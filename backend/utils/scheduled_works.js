const CronJob = require("node-cron");
const { spinPowershellContainer } = require("./instances");
const { spawn } = require('node:child_process');
const VsphereServer = require('../models/vsphere');
const { decryptPassword } = require("./resources");


exports.scanVcenterServers = async () => {

    const onScanVcenter = CronJob.schedule("1 * * * *", async () => {
        const time = new Date()
        console.log('scaning vcenters at: ', time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds())
        const vspheres = await VsphereServer.find()
        if (!vspheres.length) return 
        for (const vsphere of vspheres) {
            const password = decryptPassword(vsphere, 'password')
            const args = ['-viserver',vsphere.ip_address ,'-servername', vsphere.hostname.toLowerCase(),'-username',vsphere.username,'-password',password]
            await spinPowershellContainer('/scripts/gather_vsphere_data.ps1',false,args)
        }
        return
    })
    onScanVcenter.start()

}


exports.cleanDockerNetworks = async () => {
    const onCleanNetworks = CronJob.schedule("3 * * * *", async () => {
        const cleanNetwork = spawn('docker',['network',['prune','--force']])
        cleanNetwork.stdout.on('data', (data) => {
            console.log(`data: ${data}`)
        })
    })

    onCleanNetworks.start()
}