import { Box, Stack, Button } from '@mui/material'

const VM_Summary = ({ values, static_ips=[] }) => {

    return (
        <>
        <Stack>
            <Stack>
                <div><strong>VM Count:</strong> {values.serverCount}</div>
                <div><strong>VM Names:</strong> {values.vm_name} </div>
                <div><strong>OS Type:</strong> {values.type} </div>
                <div><strong>Username:</strong> {values.username} </div>
                <div><strong>Hostname:</strong> {values.hostname} </div>
                <div><strong>vCpu:</strong> {values.vcpu} </div>
                <div><strong>RAM in GB:</strong> {values.ram} </div>
                <div><strong>Storage in GB:</strong> {values.storage} </div>
                <div><strong>IP Address Type:</strong> {values.ipv4_type} </div>
                <div><strong>Environment:</strong> {values.VSPHERE_HOST}</div>
                <div><strong>Resouece Pool:</strong>{values.requested_rp}</div>
                {values.ipv4_type === 'static' && static_ips.length > 0 && <div>Static Management IP: {static_ips}</div>}
                {/* <div>Private Nics: </div>
                <div>Nic Addresses: </div> */}
            </Stack>
        </Stack>
        </>
    )

}

export default VM_Summary