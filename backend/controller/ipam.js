const { clearAddress, createIpRange, assignAddresses,  collectionize, getAllLabs, getLabCidrs, queryAllAdresses, updateDbClearedAddresses, createNewLab, queryAddressesFromLab, queryFreeAddresses, getStaticRangeAndCount } = require("../utils/utilities")
const { queryDeployedInstances } = require('../utils/instances');
const Address = require('../models/address')
const User = require('../models/user');
const Lab = require('../models/lab')



const getMainView = async (req,res,next) => {

    const { dc } = req.params

    const ips = await queryAddressesFromLab(dc)

    const instances = await queryDeployedInstances(dc)


    res.status(200).send({ ips, instances })

}

const getAvailableLabs = async (req,res,next) => {
    try {
        const ranges = await getAllLabs()
        res.status(200).send({ ranges })

    } catch (err) {
        res
         .status(500)
         .send({ msg: 'something is wrong' })
    }
    
    
}

const getLabsAndRanges = async (req,res,next) => {
    const data = []
    try {
        const labs = await getAllLabs()
        for (const lab of labs) {
            const rangeInfo = await getStaticRangeAndCount(lab._id)
            data.push({ ...lab.toObject(), ...rangeInfo })
        }
        res.status(200).send({ data })
    } catch (err) {
        return next(err)
    }
}

const onAddressesForInstance = async (req,res,next) => {
    const { lab_id, numOfInstances } = req.params 

    try {

        const addresses = await queryFreeAddresses(lab_id,numOfInstances)
        return res
                .status(200)
                .send({ addresses })
    } catch (err) {
        return next(err)
    }
}

// POST ROUTES


const onCreateNewLabRange = async (req,res,next) => {
    const { name, cidr, dg, startAddress, endAddress, owner } = req.body 

    try {
        console.log(`User ${req.user.userId} is initiating new Range`)
        const new_lab_id = await createNewLab (name,cidr,dg)
        const rangeInserted = createIpRange(new_lab_id, startAddress,endAddress,owner);
        if (rangeInserted) res.status(200).send({ message: 'Range has been added successfully!' })
    } catch (err) {
        console.log(err)
    }
}




// PUT 


const onAssignAddresses = async (req,res,next) => {

    try {
        const { lab, numOfAddresses, description, owner } = req.body
        const addresses = await queryFreeAddresses(lab,numOfAddresses)
        const updated = assignAddresses(addresses, description, numOfAddresses, owner._id, quereid=true)
        Address.bulkWrite(updated)
         .then(() => { 
            return res
            .status(200)
            .send({ message: "Addresses added!" })
         })
         .catch((err) => {
            return next(err)
         })
    } catch (err) {
        return next(err)
    }   

}



//  DELETE

const onReleaseAddresses = async (req,res,next) => {
    try {
        const { id, lab } = req.params 
        let current = await Address.findById(id)
        let next = current.nextAddress
        const addresses = []
        addresses.push(current)
        while (next) {
            current = await Address.findById(next)
            addresses.push(current)
            next = current.nextAddress
        }
        const toBeCleared = clearAddress(addresses)
        const cleared = await updateDbClearedAddresses(toBeCleared)
        if (cleared) return res.status(200).send({ message: 'addresses deleted!' })

    } catch (err) {
        return next(err)
    }
}


const onDeleteRange = async (req,res,next) => {
    const { lab_id } = req.params
    try {
        const isNotAvailable = await Address.countDocuments({ lab_id, isFree: false })
        console.log(isNotAvailable)
        if (isNotAvailable) return res.status(409).send({ message: 'Cannot delete range. Remove all used addresses'})
        await Address.deleteMany({ lab_id })
        await Lab.findByIdAndDelete(lab_id)
        return res.status(204).send({ message: 'Deleted successfully'})
    } catch (err) {
        return next(err)
    }
}

exports.getMainView = getMainView
exports.getAvailableLabs = getAvailableLabs
exports.onAssignAddresses = onAssignAddresses
exports.onCreateNewLabRange = onCreateNewLabRange
exports.onReleaseAddresses = onReleaseAddresses
exports.onAddressesForInstance = onAddressesForInstance
exports.getLabsAndRanges = getLabsAndRanges
exports.onDeleteRange = onDeleteRange