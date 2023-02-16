import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const PrivateNic = ({ nic_name, nic_label, private_ip_name, private_ip_label,  addOrRemoveNic, nic_count }) => {

    return (
        <>
            <Box 
                sx={{ display: 'flex', alignItems: 'center' }}
            >
                <TextField 
                    name={nic_name}
                    label={nic_label}
                    sx={{ margin: 2 }}

                />
                <TextField 
                    name={private_ip_name}
                    label={private_ip_label}
                    sx={{ margin: 2 }}
                />
                <Button
                    sx={{ margin: 2 }}
                    onClick={() => addOrRemoveNic('+')}
                >
                    <AddCircleIcon fontSize='large' />
                </Button>
                <Button
                    disabled={nic_count <= 1}
                    sx={{ margin: 2 }}
                    onClick={() => addOrRemoveNic('-')}
                >
                    <RemoveCircleIcon fontSize='large' />
                </Button>
            </Box>

        </>
    )
}

export default PrivateNic