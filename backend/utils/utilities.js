const mongoose = require('mongoose')
const ip = require('ip')
const ping = require('ping')
const { CreateCollection } = require('../models/address')
const Lab = require('../models/lab')
const Address = require('../models/address')

const createIpRange = async (lab_id, start_ip, end_ip, addressOwner) => {
  const ip_to_int = (num) => {
      return parseInt(num)
    }

  let start = start_ip.split('.').map(ip_to_int)
  let end = end_ip.split('.').map(ip_to_int)

  let current = start
  const ipRange = []
  
  let ip_address = current.join('.')

  const data = {
    lab_id, 
    ip_address, 
    ip_bin: ip.toBuffer(ip_address), 
    addressOwner 
  }

  ipRange.push(data)
    
  while (current.join('.') !== end.join('.')) {
      start[3] += 1
    
    for (let oct of [3,2,1]) {
        if (start[oct] === 256) {
          start[oct] = 0
        start[oct-1] += 1
      }
    }

    ip_address = current.join('.')
    ipRange.push({ lab_id, ip_address, ip_bin: ip.toBuffer(ip_address), addressOwner })
  }

  return await Address.insertMany(ipRange)
}

const assignAddresses = (addresses, description, numOfAddresses, addressOwner, queried=false, instancesIds=[]) => {
  const updated = []
  let former;
  for (let [idx, address] of addresses.entries()) {

    if (queried) {
      address = address.toObject()
    }
  
    if (idx === 0) {
      address.isHead = true
      address.description = description 
      address.rangeTotal = numOfAddresses
    } else if (0 < idx <= addresses.length-1) {
      address.prevAddress = former._id
      former.nextAddress = address._id
    }
    address.isFree = false
    address.addressOwner = addressOwner
    if (instancesIds.length > 0)  {
      address.instance_ref = instancesIds.shift()
      
    }
    former = address
    updated.push({
      updateOne: {
        filter: { ip_address  : address.ip_address },
        update: address,
        upsert: true
      }
    })
  }
  return updated
}

const clearAddress = (addresses) => {
  const forClearance = []  


  for (let [idx,address] of addresses.entries()) {
    address = address.toObject()

    forClearance.push({
      updateOne: {
        filter: { ip_address  : address.ip_address },
        update: { $unset: { 
          isHead: 1,
          description: 1,
          rangeTotal: 1,
          prevAddress: 1,
          nextAddress: 1,
          addressOwner: 1,
          instance_ref: 1
        },
        $set: {
          isFree: true
        }
      },
        upsert: true
      }
    })
  } 
  return forClearance
}

const updateDbClearedAddresses = async (addresses) => {
  
  const cleared = Address.bulkWrite(addresses)
  .then(() => { return true })
  .catch(err => { return err })
  return cleared
}


const findDocsByIps = async(addresses) => {
  return await Address.find({'ip_address': { $in: addresses.map(add => { return add.ip_address })}})
}

const findAddressClusterById = async (id) => {
  const result = []
  while (id) {
    const address = await Address.findById(id)
    result.push(address)
    id = address.nextAddress
  } 
  return result
}

const queryForAddresses = async (lab_id, numOfAddresses, conditions={ lab_id, isFree: true }) => {
  const addresses =  await Address.find(conditions).limit(parseInt(numOfAddresses)).select('ip_address')
  return addresses;
}


const removeAliveAddress = (addresses, unavailableAddressesIdxs) => {

  unavailableAddressesIdxs.forEach(unavailableIdx => {
    addresses.splice(unavailableIdx, 1);
  })

}

const addressesAreNotAlive = async (addresses) => { 

  const unavailableIdxs = []

  for (const [idx,address] of addresses.entries()) {
    let res = await ping.promise.probe(address.ip_address);
    if (res.alive) {
      unavailableIdxs.push(idx)
      address.isAlive = true
    } 
  }

  return unavailableIdxs
}

const queryFreeAddresses = async (lab_id,numOfAddresses) => {

  const addresses = await queryForAddresses(lab_id,numOfAddresses)
  let unavailable = await addressesAreNotAlive(addresses) 
  while (unavailable.length > 0) {
    let condition = { lab_id, 
                      ip_address: { $nin: unavailable }, 
                      isFree: true, 
                      ip_bin: { $gt: ip.toBuffer(addresses[addresses.length-1].ip_address) } 
                    }
    const moreAddressesNeeded = await queryForAddresses(lab_id,unavailable.length,condition)
    removeAliveAddress(addresses, unavailable)
    moreAddressesNeeded.forEach(address => {
      addresses.push(address)
    })
    unavailable = await addressesAreNotAlive(addresses)
  }
  return addresses
}


const collectionize = (str) => {
  const striped = str.split('_');

  const result = [];
  for (const [idx,word] of striped.entries()) {
    if (idx) {
      result.push(word.charAt(0).toUpperCase() + word.slice(1));
    } else {
      result.push(word.charAt(0) + word.slice(1))
    }
  }

  return result.join('');
}

const queryAddressesFromLab = async (lab_id) => {
  const data = await Address.find({ lab_id, isHead: true }).select('ip_address description rangeTotal')
  return data
}

const queryAllAdresses = async (ranges) => {
  const data = [];
  for (const range of ranges) {
    const addresses = await queryAddressesFromRange(range)
    data.push(...addresses) 
  }
  return data
}

const queryLabDetails = async (range) => {

  const data = await Lab.findOne()
  return data
}

const getLabCidrs = async (ranges) => {
    const data = []
    
    for (const range of ranges) { 
      const lab = await queryLabDetails(range)
      data.push(lab)
    }

    return data

}

const getAllLabs = async () => {

  return await Lab.find()
}

const getStaticRangeAndCount = async (lab_id) => {
  const firstAddress = await Address.findOne({ lab_id }).sort({ _id: 1 }).select('ip_address -_id').exec()
  const lastAddress = await Address.findOne({ lab_id }).sort({ _id: -1 }).select('ip_address -_id').exec()
  const count = await Address.countDocuments({ lab_id })

  return { firstAddress: firstAddress.ip_address, lastAddress: lastAddress.ip_address, count }
}

// CHECK
const assignInstanceAddresses = async (lab_id,static_ips,instancesIds,owner) => {
  const assignedIps = assignAddresses(lab_id,static_ips, `assigned address to a user instance`, static_ips.length, owner, queried=true, instancesIds)
  const written = Address.bulkWrite(assignedIps)
   .then(() => { 
      return true
   })
   .catch((err) => {
      return err
   })
   return written;
}

const createNewLab = async (name, cidr, dg, owner) => {

  try {
    const lab = new Lab({
      name,
      cidr,
      dg,
      ...(owner && { owner })
    })  
    await lab.save()
    return lab._id
  } catch (err) {
    return err 
  }


}

exports.getAllLabs = getAllLabs;
exports.getStaticRangeAndCount = getStaticRangeAndCount
exports.createIpRange = createIpRange
exports.clearAddress = clearAddress
exports.assignAddresses = assignAddresses
exports.queryFreeAddresses = queryFreeAddresses
exports.collectionize = collectionize
exports.queryLabDetails = queryLabDetails
exports.getLabCidrs = getLabCidrs
exports.queryAllAdresses = queryAllAdresses
exports.findDocsByIps = findDocsByIps
exports.assignInstanceAddresses = assignInstanceAddresses
exports.findAddressClusterById = findAddressClusterById
exports.updateDbClearedAddresses = updateDbClearedAddresses
exports.queryAddressesFromLab = queryAddressesFromLab
exports.createNewLab = createNewLab