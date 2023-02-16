const VsphereServer = require('../models/vsphere')
const crypto = require('crypto')
const CRYPTO_SECRET = process.env.CRYPTO_SECRET || 'pppppppppppppppppppppppppppppppp'; // set random encryption key

const findVsphereHostname = async (ip_address) => {
    return VsphereServer.find({ ip_address }).select('hostname -_id')
}

const handlePasswordHasing = (data) => {
    const sensitive = Object.keys(data)
    .map(key => { 
        if (key.includes('password')) return key 
    })
    .filter(el => {
         if (el !== undefined) return el 
    })

    const iv = Buffer.from(crypto.randomBytes(16));
    data['iv'] = iv.toString('hex')
    for (const key of sensitive) {
        const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(CRYPTO_SECRET), iv);
        const encrypt = Buffer.concat([
            cipher.update(data[key]),
            cipher.final(),
        ]);

        data[key] = encrypt.toString('hex')
    }
    return data
}

const decryptPassword = (server,req_passwd) => {
    const decipher = crypto.createDecipheriv(
        "aes-256-ctr",
        Buffer.from(CRYPTO_SECRET),
        Buffer.from(server.iv, "hex")
      );
    
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(server[req_passwd], "hex")),
        decipher.final(),
      ]);
      return decrypted.toString()
}

exports.findVsphereHostname = findVsphereHostname
exports.handlePasswordHasing = handlePasswordHasing
exports.decryptPassword = decryptPassword