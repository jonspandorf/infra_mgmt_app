import { Stack, Alert } from "@mui/material"
import { useState } from "react"
import { useAuth } from "../context/auth"
import { useValues } from "../lib/utilities"
import { useNavigate } from 'react-router-dom'



const TemplateForm = ({ Component, initialValues, handleFormSubmission, ...props }) => {

    const [ alert, setAlert ] = useState({text: '', color: '' })
    const [ submitting, setSubmitting ] = useState(false)

    const { values, setValues } = useValues(initialValues)
    const navigate = useNavigate()

    const { login, token } = useAuth()

    const timeout = async () => {
        return new Promise(res => setTimeout(res,1500))
    }



    const handleForm = async (e) => {
        e.preventDefault()
        setAlert({})
        setSubmitting(true)
        const res = await handleFormSubmission(values,token,login, navigate)
        
        if (res.status >= 200 && res.status <= 299) {
            setAlert({ text: res.data.message ? res.data.message : 'Success!', color: 'success' })
            timeout()
            return navigate('/')
            
        } else {
            setAlert({ text: res.data.message, color: 'error' })
        }            
        setSubmitting(false)
    }

    return(
        <Stack
        component="form"
        id='new-vm-form'
        sx={{
            m: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleForm}
    >
        <Component values={values} setValues={setValues} submitting={submitting} {...props} /> 
        {
            alert.text ?
                <Alert 
                    severity={alert.color}
                >
                    {alert.text}
                </Alert>
            :
            <></>
        }
    </Stack>
    )
}

export default TemplateForm