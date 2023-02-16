import { Box, MenuItem, Stack, TextField, Typography } from "@mui/material"
import { handleChange } from "../../lib/utilities"
import TemplateInfo from "../template_info"

const InstanceHWSpecs = ({ values, setValues, isTemplate=false }) => {

    const vcpu_opt = [1,2,4]
    const ram_opt = [1,2,4,8,16,32]

    
    return (
        <>
                <Typography variant="h5">Instance HW Specs</Typography>
                    {
                        isTemplate &&
                        <Stack sx={{ display: 'flex', flexDirection: 'row' , justifyContent: 'space-around', p: 1, m:1, width: '100%'}}>
                            <TemplateInfo values={values} setValues={setValues} />
                        </Stack>

                    }
                    <Stack sx={{ m: 1 }}>
                        <Box sx={{ m: 1 }}>
                            <TextField
                                id="vcpu"
                                select
                                label="vCPU"
                                name="vcpu"
                                value={values.vcpu}
                                onChange={(e) => handleChange(e, values, setValues)}
                                helperText="Minimal vCPU"
                                sx={{ margin: 1}}
                                >
                                {vcpu_opt.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="ram"
                                select
                                label="Memory GB"
                                name="ram"
                                value={values.ram}
                                onChange={(e) => handleChange(e, values, setValues)}
                                helperText="Minimal RAM"
                                sx={{ margin: 1}}
                                >
                                {ram_opt.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="storage"
                                label="Storage GB"
                                value={values.storage}
                                helperText="Minimal storage for template"
                                name="storage"
                                sx={{ margin: 1}}
                                onChange={(e) => handleChange(e, values, setValues)}
                            />
                        </Box>

                    </Stack>
        </>
    )

}

export default InstanceHWSpecs