import ipaddr from 'ipaddr.js';

export const validateCIDR = (value) => {
    const cidrRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/;
    return cidrRegex.test(value);
}

export const getFirstIP = (cidr) => {
  const network = ipaddr.parseCIDR(cidr)[0];
  return network.start.toString();
};

export const getLastIp = (cidr) => {
    const broadcast = ipaddr.broadcastAddressFromCIDR(cidr);
    let octets = ipaddr.parse(broadcast).octets
    const lastOctet = parseInt(octets[3]) - 1 
    octets = [octets[0],octets[1],octets[2],lastOctet]
    return octets.join('.')
}

export const checkIpInCidr = (ip, cidr) => {
    try {
      const network = ipaddr.parseCIDR(cidr);
      const address = ipaddr.parse(ip);
      return network[0].match(address) !== null;
    } catch (error) {
      console.error(error);
      return false;
    }
  };



