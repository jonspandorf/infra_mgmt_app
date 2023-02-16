import { Box, TextField, Button, Checkbox, CircularProgress, FormControlLabel, Stack } from "@mui/material"
import { useEffect } from "react"
import { useState } from "react"
import { handleChange, useLabOwners } from "../lib/utilities"
import { useAuth } from '../context/auth'
import DropdownMenu from "./forms/dropdown-menu"


const CreateAddresses = ({ handleSubmission, labs, isSubmitting }) => {

    const initalValues = {
        cidr: '',
        ipExists: false,
        numOfAddresses: 1,
        description: '',
        owner: '',
        // ownerId: isAdmin ? '' : userId
    }


    const { token } = useAuth()

    const [values, setValues] = useState(initalValues)

    const owners = useLabOwners(token)




    useEffect(() => {
        let _isMounted = true 

        return () => _isMounted = false
    }, [])


    return (
        <>
                <Stack
                    component="form"
                    sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    onSubmit={(e) => handleSubmission(e,values)}
                >
                    {/* <Box sx={{ display: 'flex', flexDirection: 'row'}}>                     */}
                    <DropdownMenu
                      id={'lab'}
                      name="lab"
                      value={values.lab}
                      vales={values}
                      setValues={setValues}
                      label="Associate with lab"
                      options={labs.map(lab => ( { id:lab._id, value: lab._id, name: lab.name+' '+lab.cidr }))}
                    />
                    <TextField
                        id="totalAddresses"
                        label="Number of Addresses needed"
                        type="number"
                        name="numOfAddresses"
                        value={values.count}
                        sx={{ m: 2 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => handleChange(e, values, setValues)}
                    />
                {/* </Box> */}

                    <TextField 
                        id="description"
                        label="Description"
                        name="description"
                        value={values.description}
                        onChange={(e) => handleChange(e, values, setValues)}
                        placeholder="Describe address use"
                        multiline
                        sx={{ m: 2 }}
                        rows={2}
                        minRows={6}
                    />

                
                    <DropdownMenu
                        id="owner"
                        label="Select Owner"
                        value={values.owner}
                        values={values}
                        setValues={setValues}
                        name="owner"
                        options={owners}

                    />
                    <FormControlLabel 
                        control={
                            <Checkbox 
                                id="checkbox"
                                name="ipExists"
                                value={values.ipExists}
                                defaultChecked={values.ipExists} 
                                onChange={(e) => handleChange(e, values, setValues)}
                            />} 
                            label="Check if this is an existing IP address or range" 
                        /> 

                <Box sx={{ display: 'flex', justifyContent: 'center'}} >
                    <Button variant="contained" type="submit" disabled={isSubmitting} >
                        Submit
                            {
                                isSubmitting && <CircularProgress />
                            }
                    </Button>
                </Box>
                </Stack>
            {/* </Stack> */}
        </>
    )
}

export default CreateAddresses