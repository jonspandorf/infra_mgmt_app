import { Button, Box } from "@mui/material"
import DropdownMenu from "../forms/dropdown-menu"
import SingleTextField from '../forms/single-textfield'

const SignupForm = ({ values, setValues, departments }) => {

    const signupFields = [
        {
            name: 'fullname',
            label: 'Full name',
            id: 6,
            ...(values &&  
                { 
                    value: values.fullname,
                    values,
                    setValues 
            })
        },
        {
            name: 'username', 
            label: 'Username', 
            id: 1, 
            ...(values &&  
                { 
                    value: values.username,
                    values,
                    setValues 
            })
        },
        {
            name: 'email',
            label: 'email',
            type: 'email',
            id: 2,
            ...(values &&  
                { 
                    value: values.email,
                    values,
                    setValues 
            }),
        },
        {
            name: 'role',
            label: 'Select role for user',
            type: 'select',
            id: 7,
            options: [{ key: 1, value: 'user', name: 'User'}, { key: 2, value: 'admin', name: 'Admin'} ],
            ...(values && 
                {
                    value: values.role,
                    values,
                    setValues
                })
        },
        {
            name: 'department',
            label: 'department',
            type: 'select',
            options: departments,
            id: 3,
            ...(values &&  
                { 
                    value: values.department,
                    values,
                    setValues 
            }),
        },

        { 
            name: 'password', 
            type: 'password', 
            label: 'Password', 
            id: 4, 
            ...(values &&  { 
                value: values.password,
                values,
                setValues 
            })
        },
        { 
            name: 'passConfirm', 
            type: 'password', 
            label: 'Confirm Password', 
            id: 5, 
            ...(values &&  { 
                value: values.passConfirm,
                values,
                setValues 
            })
        }
    ]

    return (
        <Box 
            sx={{ 
                    boxShadow: 8, 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: '20px', 
                    m: 4,
                    p: 4,
                }}
        >
            <Box>
                {
                    signupFields.slice(0,3).map(fields => (
                        <SingleTextField {...fields} />
                    ))
                }
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly'}}>
                {
                    signupFields.slice(3,5).map(fields => (
                        fields.name === "department" ? 
                         
                            values.role === 'user' &&
                            <DropdownMenu {...fields} />
                         
                        :
                        <DropdownMenu {...fields} />
                    ))
                }
            </Box>
            <Box>
                {
                    signupFields.slice(5).map(fields => (
                        <SingleTextField  {...fields} />
                    ))
                }
            </Box>
            <Button variant="contained" color="error" type="submit">Add User</Button>
        </Box>
    )
}

export default SignupForm