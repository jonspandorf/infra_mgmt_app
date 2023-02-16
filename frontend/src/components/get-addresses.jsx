import { useState } from 'react'
import { Box } from '@mui/material'

const GetNewAddresses = () => {

    const handleChange = (e) => {
        const value = e.target.value;
        setValues({
            ...values,
            [e.target.name]: value
        })  
    }

    return (
        <>
        <Box
            component="form"
            sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmission}
        >
        <>
            <TextField
                id="labs"
                select
                label="Select"
                value={values.lab}
                name="lab"
                onChange={handleChange}
                helperText="Select desired Operating System"
                >
                {vm_types_opt.map((option) => (
                    <MenuItem key={option.type} value={option.type} >
                        {option.label}
                    </MenuItem>
                ))} 
            </TextField>
        </>
        </Box>
        </>
    )

}

export default GetNewAddresses