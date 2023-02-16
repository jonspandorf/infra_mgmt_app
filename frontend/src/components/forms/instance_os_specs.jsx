import { Stack, TextField, Typography } from "@mui/material"
import { handleChange } from "../../lib/utilities"

const InstanceOperatingSystemSpecs = ({ values, setValues }) => {
    return (
        <>
        <Typography variant="h5">Instance OS specs</Typography>
                <Stack
                    sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}
                >
                    <Stack
                        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}
                     >
                    <TextField
                        required
                        id="vmName"
                        name="vm_name"
                        label="Server Name"
                        value={values.vm_name}
                        onChange={(e) => handleChange(e, values, setValues)}
                        helperText="This will be VM name in vCenter"
                        sx={{ margin: 1 }}
                    />
                    <TextField
                        required
                        id="userName"
                        name="username"
                        label="Username"
                        value={values.username}
                        onChange={(e) => handleChange(e, values, setValues)}
                        sx={{ margin: 1 }}
                        helperText="This will be VM name in vCenter"
                    />
                    </Stack>
                    <Stack sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', p: 1}}>
                    <TextField
                        required
                        id="hostname"
                        name="hostname"
                        label="Hostname"
                        value={values.hostname}
                        onChange={(e) => handleChange(e, values, setValues)}
                        helperText="How server communicates with other servers"
                        sx={{ margin: 1 }}
                    />
                    <TextField
                        required
                        type="password"
                        id="password"
                        name="password"
                        label="Password"
                        value={values.password}
                        onChange={(e) => handleChange(e, values, setValues)}
                        helperText="How server communicates with other servers"
                        sx={{ margin: 1 }}

                    />
                    </Stack>
                </Stack>
        </>
    )
}

export default InstanceOperatingSystemSpecs