import { Box, TextField, Button, CircularProgress, Typography  } from "@mui/material"
import DropdownMenu from "../components/forms/dropdown-menu"
import { useAuth } from "../context/auth"
import { validateCIDR } from "../lib/ip-utils"
import { handleChange, useLabOwners } from "../lib/utilities"



const CreateRange = ({ isSubmitting, values, setValues }) => {

    const { token } = useAuth()
    const owners= useLabOwners(token)

    return (
        <>
                <Typography variant="h3" sx={{ p:3 }}>Initiate Static IPs Range</Typography>
                <Box sx={{ margin: 1}}>
                    <TextField
                        id="cidr"
                        label="Cidr block of range"
                        value={values.cidr}
                        name="cidr"
                        sx={{ margin: 1 }}
                        onChange={(e) => handleChange(e, values, setValues)}
                    />
                    <TextField
                        id="dg"
                        label="Default Gateway"
                        value={values.dg}
                        name="dg"
                        sx={{ margin: 1 }}
                        onChange={(e) => handleChange(e, values, setValues)}
                    />
                </Box>
                <Box sx={{ margin: 1}}>
                    <TextField 
                        id="startAddress"
                        label="First address of range"
                        type="string"
                        name="startAddress"
                        sx={{ margin: 1 }}
                        value={values.startAddress}
                        onChange={(e) => handleChange(e, values, setValues)}
                    />    
                    <TextField 
                        id="endAddress"
                        label="Last address of range"
                        type="string"
                        name="endAddress"
                        sx={{ margin: 1 }}
                        value={values.endAddress}
                        onChange={(e) => handleChange(e, values, setValues)}
                    />

                </Box>
                <Box sx={{ margin: 1, display: 'flex', flexDirection: 'row' }}>
                    <TextField 
                            id="labName"
                            name="name"
                            label="Short name for Lab"
                            type="string"
                            sx={{ margin: 1 }}
                            value={values.name}
                            // helperText="Set the lab associated with addresses"
                            onChange={(e) => handleChange(e, values, setValues)}
                        />
                        <DropdownMenu
                            id="owner"
                            label="Select the range owner"
                            value={values.owner}
                            values={values}
                            setValues={setValues}
                            name="owner"
                            options={owners}

                        />
                    {/* <TextField 
                            id="owner"
                            name="owner"
                            label="Owner of Range"
                            type="string"
                            sx={{ margin: 1 }}
                            value={values.owner}
                            // helperText="Set the lab associated with addresses"
                            onChange={(e) => handleChange(e, values, setValues)}
                        /> */}
                </Box>
                    <Box sx={{ display: 'flex', justifyContent:'center', margin: 2}}>
                        <Button variant="contained" type="submit">{isSubmitting ? <>Creating Range<CircularProgress /></> : 'submit'}</Button>
                    </Box>
        </>
    )
}

export default CreateRange