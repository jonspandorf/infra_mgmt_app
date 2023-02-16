import { Button, CircularProgress, Box } from "@mui/material"

const DeployButton = ({ setDialog, setFinalize, isSubmitting=false }) => {

    const handleDeployment = () => {
        if (setFinalize) setFinalize(true)
        setDialog(true)
    }
 
    return(
        <Box sx={{ display: 'flex', justifyContent: 'center'}}>
            <Button 
                sx={{ margin: 2, width: '50%', justifyContent: 'center' }}  
                variant="contained" 
                color="error" 
                onClick={handleDeployment} >
                { 
                    isSubmitting ? 
                    <>
                        Deploying... <CircularProgress />
                    </> :
                    <>Deploy</>

                }
            </Button>
        </Box>
    )
}

export default DeployButton