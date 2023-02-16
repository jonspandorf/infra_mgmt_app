import { Box, Button, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { useEffect } from "react"
import { useAuth } from "../context/auth"
import { getBaremetalDeviceDetails, getBaremetalDeviceRequestedPasswd } from "../lib/api"
import  PopUpDialog  from './dialog'
import DevicePassword from "./forms/device-password"

const DeviceDetails = ({ token, deviceId }) => {

    const [ device, setDevice ] = useState({})
    const [ showPassword, setShowPassword ] = useState(false)
    const [ dialogIsOpen, setDialogOpen ] = useState(false)
    const [ secrets, setSecrets ] = useState({user: '', password: ''})



    useEffect(() => {

        let _mounted = true 

        if (_mounted) {
            getBaremetalDeviceDetails(deviceId, token)
              .then((res) => {
                setDevice(res.data.device)
              })
              .catch((err) => {
                console.error(err)
              })

        }
        return () => _mounted = false

    },[deviceId])

    const handleShowPassword = async (deviceId,user,passwordName) => {
        const res = await getBaremetalDeviceRequestedPasswd(deviceId,passwordName,token)
        setSecrets({ user: device[user], password: res.data.password })
        setDialogOpen(true)
    }

    return (
        <>
            <Stack sx={{ pb: 1 }}>
                <Typography variant="h6">Properties</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', minWidth: '500px' }}>
                    <Typography variant="body1">
                        <strong>Name: </strong>
                        {device.name}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Type: </strong>
                        {device.type}
                    </Typography>
                </Box>
            </Stack>
            <Stack sx={{ p: 1 }}>
                <Typography variant="h6">Device Details</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', minWidth: '500px' }}>
                    <Typography variant="body1">
                        <strong>Vendor: </strong>
                        {device.vendor}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Model: </strong>
                        {device.model}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Role: </strong>
                        {device.role}
                    </Typography>
                </Box>
            </Stack>
            <Stack sx={{ p: 1 }}>
                <Typography variant="h6">Infra Location</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', minWidth: '500px' }}>
                    <Typography variant="body1">
                        <strong>Lab: </strong>
                        {device.lab}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Rack: </strong>
                        {device.rack}
                    </Typography>
                </Box>
            </Stack>
            <Stack sx={{ p: 1 }}>
                <Typography variant="h6">OS Management details</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', minWidth: '500px' }}>
                    <Typography variant="body1">
                        <strong>Management IP: </strong>
                        {device.management_ip}
                    </Typography>
                   {
                        <Button variant="contained" color="primary" onClick={() => handleShowPassword(deviceId,'management_user','management_password')}>Show Password</Button>
                   }
                </Box>
            </Stack>
            <Stack sx={{ p: 1 }}>
                <Typography variant="h6">Remote Access Details</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', minWidth: '500px' }}>
                    <Typography variant="body1">
                        <strong>Remote Access IP: </strong>
                        {device.remote_access_ip}
                    </Typography>
                    {
                        <Button variant="contained" color="primary" onClick={() => handleShowPassword(deviceId,'remote_access_user','remote_access_password')}>Show Password</Button>
                    }                
                </Box>
            </Stack>
            {
                dialogIsOpen && 
                    <PopUpDialog    
                        DialogBody={DevicePassword}
                        open={dialogIsOpen}
                        handleClose={() => { setSecrets({ user: '', password: '' }); setDialogOpen(false) }}
                        user={secrets.user}
                        password={secrets.password}
                    />
            }
        </>
    )
}

export default DeviceDetails