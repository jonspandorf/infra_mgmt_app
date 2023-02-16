import { Button, Box, CircularProgress, Typography } from "@mui/material"
import SingleTextField from '../forms/single-textfield'


const LoginForm = ({ values, setValues, submitting }) => {


    const loginFields = [
        { 
            name: 'username', 
            label: 'Username', 
            id: 'dfsafe', 
            ...(values &&  
                { 
                    value: values.username,
                    values,
                    setValues 
            })
        },
        { 
            name: 'password', 
            type: 'password', 
            label: 'Password', 
            id: 'rlbme', 
            ...(values &&  { 
                value: values.password,
                values,
                setValues 
            })
        }

    ]

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 4, boxShadow: 8 }}>
                <Typography variant="h4">InfraManager Login</Typography>
            {
                loginFields.map(field => {
                    return(
                        <SingleTextField 
                            key={field.id}
                            {...field}
                        />
                    )
                })
            }
                <Button type="submit" variant="contained" color="error">
                    {
                        submitting ? 
                            <>Logging in <CircularProgress /></> 
                        : <>login</>
                    }
                </Button>
            </Box>
        </>
    )
}

export default LoginForm