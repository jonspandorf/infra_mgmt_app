import { DialogTitle, Typography } from "@mui/material"


const DevicePassword = ({ user, password }) => {

    return (
        <>
            <DialogTitle>
                <Typography variant="body1">
                    <strong>Username: {user}</strong>
                </Typography>
                <Typography variant="body1">
                    <strong>Password: {password}</strong>
                </Typography>
            </DialogTitle>
        </>
    )
}

export default DevicePassword