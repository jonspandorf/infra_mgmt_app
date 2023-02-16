import { Button, Stack } from "@mui/material"
import { useState } from "react"
import { addNewVsphereServer } from "../../../lib/api"
import SingleTextField from "../single-textfield"
import { useAuth } from "../../../context/auth"; 


const NewVsphereForm = ({ values, setValues }) => {
    const [ submitting, setSubmitting ] = useState(false)
    const { token } = useAuth()


    const allFields = [
        { name: "hostname", id: 1, label: 'vSphere/vCenter Hostname', value: values.hostname, values, setValues },
        { name: "ip_address", id: 2, label: 'IP address of appliance', value: values.ip_address, values, setValues },
        { name: "username", id: 3, label: 'Username', helperText: 'must be admin priv.', value: values.username, values, setValues },
        { name: "password", id: 4, type: 'password', label: 'Password', helperText: 'must be admin priv.', value: values.password, values, setValues}
    ]


    const onSubmitVsphereData = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        const res = await addNewVsphereServer(values, token)
        setSubmitting(false)
    }

    return (

        <>
            <Stack
                component="form"
                id='new-vm-form'
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    height: '50vh'
                }}
                noValidate
                autoComplete="off"
                onSubmit={onSubmitVsphereData}
            >   
                {
                    allFields.map(fields => (
                        <SingleTextField 
                            {...fields}
                        />
                    ))
                }
                <Button type="submit" variant="contained" color="error">add to inventory</Button>
            </Stack>
        </>
    )
}

export default NewVsphereForm