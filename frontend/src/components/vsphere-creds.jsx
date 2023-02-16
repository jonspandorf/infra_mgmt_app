import { Box, Button, TextField, Typography } from "@mui/material"
import { handleChange } from "../lib/utilities"
import PopUpDialog from "./dialog"
import VsphereEnv from "./vsphere_env"
import DialogProvisionBody from "./errors/dialog_provision"

const VsphereCreds = ({ values, setValues, passConfirm, setPassConfirm, toDelete=false, vspheres, instanceCount=1, dialogIsOpen, setDialogOpen }) => {


    return (
        <Box 
            sx={{ display: 'flex', flexDirection: 'column'}} 
        >
        <Typography variant="h5">API Credentials</Typography>
        {
            toDelete && 
                <>
                    <VsphereEnv 
                        vspheres={vspheres} 
                        values={values} 
                        setValues={setValues} 
                    />
                </>
        }
        <TextField
            id='vsphere_user'
            label='vSphere Username'
            value={values.VSPHERE_USER}
            onChange={(e) => handleChange(e, values, setValues)}
            name='VSPHERE_USER'
            sx={{ p: 1 }}
        >
        </TextField>
        <TextField
            id='vsphere_passwd'
            label='vSphere Password'
            type='password'
            values={values.VSPHERE_PASSWD}
            onChange={(e) => handleChange(e, values, setValues)}
            name='VSPHERE_PASSWD'
            sx={{ p: 1 }}
        >
        </TextField>
        <TextField
            id='confirm_psswd'
            label='Confirm Password'
            type='password'
            value={passConfirm}
            sx={{ p: 1}}
            onChange={(e) => setPassConfirm(e.target.value)}
            name='confirm_psswd'
        >
        </TextField>
        {
            toDelete &&
            <> 
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => setDialogOpen(true)}
                >
                    Destroy Instances
                </Button>
                <PopUpDialog 
                    open={dialogIsOpen} 
                    handleClose={() => setDialogOpen(false)}  
                    DialogBody={DialogProvisionBody}
                    number={instanceCount}  
                    toDestroy={true} 
                    formId="destroy-form"
                />
            </>
        }
        </Box>
    )
}

export default VsphereCreds