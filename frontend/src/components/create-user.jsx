import { Stack, TextField, Typography, Button, Alert, CircularProgress, MenuItem, FormLabel, FormGroup, FormControlLabel, Checkbox, FormControl } from "@mui/material"
import { useEffect } from "react"
import { useState } from "react"
import { useAuth } from "../context/auth"
import { addNewUser, getLabs } from "../lib/api"
import { handleChange } from "../lib/utilities"

const CreateUser = () => {

    const initialValues = {
        username: '',
        fullname: '',
        email: '',
        role: 'user',
        password: '',
        confirmpass: '',
        permissions: [],
    }

    const [init, setInit] = useState(true)
    const [values, setValues] = useState(initialValues)
    const [message, setMessage] = useState('')
    const [isSubmitting, setSubmitting] = useState(false)
    const [color, setColor] = useState('')
    const [passwordmatch, setMatch] = useState(true)
    const [collections, setCollections] = useState({})
    const [permissions, setPermissions] = useState([])

    const { token } = useAuth()
    useEffect(() => {
        let _isMounted = true

        if (_isMounted) {
            getLabs(token)
             .then(res => {
                const checkboxes = {}
                for (const collection of res.data.ranges) {
                   checkboxes[collection] = false
                }
                setCollections(checkboxes)
            })

        return () => _isMounted = false
        }
    },[init])

    useEffect(() => {},[values.permissions])

    useEffect(() => {
        if (values.confirmpass !== values.password)  {
            setMatch(false)
        } else {
            setMatch(true)
            setMessage('')
            setColor('')
        }

    }, [values])


    const handleSubmission = async (e) => {
        e.preventDefault()
        if (!passwordmatch) {
            setMessage('Password does not match')
            setColor('error')
            return
        } 
        setSubmitting(true)
        const data = await addNewUser(values)
        if (data) {
            if (data.status === 200) setColor('success')
            else setColor('error')
            setMessage(message)
            setSubmitting(false)
        }
        
    }

    const addPermissions = (name) => {

        if (values.permissions.includes(name)) {
            setCollections(prev => ({...prev, [name]: false}))
        } else {
            setCollections(prev => ({...prev, [name]: true}))
        }
        const newPerms = []
        for (const [collection, permitted] of Object.entries(collections)) {
            if (permitted) newPerms.push(collection)
        }
        setPermissions(newPerms)


    }

    const form_data = [
        {
            id: "username",
            label:"Choose username",
            type:"string",
            name:"username",
            value: values.username,
        },
        {
            id: "fullname",
            label:"Type full name",
            type:"string",
            name:"fullname",
            value: values.fullname,
        },
        {
            id: "username",
            label:"Type email",
            type:"email",
            name:"email",
            value: values.email,
        },
        {
            id: "userRole",
            label:"User Role",
            name:"role",
            value: values.role,
            select: true
        },
        {
            id: "password",
            label:"Choose Password",
            type:"password",
            name:"password",
            value: values.password,
            error: !passwordmatch
        },
        {
            id: "confirmpass",
            label:"Confirm password",
            type:"password",
            name:"confirmpass",
            value: values.confirmpass,
            error: !passwordmatch
        }
    ]

    return (
        <Stack
            component="form"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
            }}
            onSubmit={handleSubmission}
        >
                <Typography variant="h2">Add new user</Typography>
                {form_data.map((data) => {
                    if (!data.select) {
                        return (
                            <TextField
                                id={data.id}
                                label={data.label}
                                type={data.type}
                                name={data.name}
                                value= {data.value}
                                sx={{ margin: 1 }}
                                onChange={(e) => handleChange(e, values, setValues)}
                                error={data.error}
                            />
                        )
                    } else {
                        return (
                            <>
                            <TextField
                                id={data.id}
                                label={data.label}
                                select
                                name={data.name}
                                value= {data.value}
                                sx={{ margin: 1 }}
                                onChange={(e) => handleChange(e, values, setValues)}
                            >
                                <MenuItem value="user">
                                    User
                                </MenuItem>
                                <MenuItem value="admin">
                                    Admin
                                </MenuItem>
                            </TextField>
                            {values.role === 'user' && 
                                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                    <FormLabel component="legend">Permissions to create</FormLabel>
                                        <FormGroup>
                                            {
                                                Object.keys(collections).map((collection) => {
                                                    return (
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox 
                                                                    checked={values.permissions[collection]}
                                                                    onChange={(e) => addPermissions(e.target.name)}
                                                                    value={values.permissions}
                                                                    name={collection}
                                                                />
                                                            }
                                                            label={collection}
                                                        />
                                                    )
                                                    }
                                                )
                                            }
                                        </FormGroup>
                                </FormControl>
                            }
                        </>
                        )
                    }

                })} 
                <Button sx={{ p: 2, m: 1 }} type="submit" variant="contained">{isSubmitting ? <><CircularProgress color="inherit" />Submitting</> : "Submit"}</Button>
                {message && <Alert severity={color}>{message}</Alert>}
        </Stack>
    )
}

export default CreateUser