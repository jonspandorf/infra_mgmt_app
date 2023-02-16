import { useState } from "react"
import { k8sinitialValues as initialValues } from "../lib/utilities"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


const DeployK8S = () => {

    const [values, setValues] = useState(initialValues)


    const handleSubmission = (e) => {
        e.preventDefault()
    }

    return (
        <>
        <Box
            component="form"
            sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },s
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmission}
        >
        <TextField
        
        >

        </TextField>
        </Box>
        </>
    )
}

export default DeployK8S