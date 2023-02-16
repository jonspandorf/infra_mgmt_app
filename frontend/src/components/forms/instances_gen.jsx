import { Typography, Stack, TextField, MenuItem, FormControlLabel, Radio, RadioGroup  } from "@mui/material"
import { useState } from "react"
import { handleChange } from "../../lib/utilities"
import DropdownMenu from './dropdown-menu'

const GeneralInstancesDetails = ({ values, setValues, templates, useBothTypes  }) => {
    // if using host - 

    //  SHOULD BE FETCHED FROM DB
    const ova_options = [
        { id: 1, name: 'Ubuntu Jammy 22.04', value: 'jammy-server-cloudimg-amd64.ova'}, 
    ]

    const template_options = [
        { template_type: 'template', label: 'From Template' },
        { template_type: 'ova', label: 'From Ova'}, 
    ]

    return (
        <>
            <Typography variant="h5">Number of Instances and OS</Typography>
                <Stack sx={{ display: 'flex', flexDirection: 'row' }}>
                    <TextField
                        id="server-number"
                        label="Number of Servers to deploy"
                        type="number"
                        name="serverCount"
                        helperText="Max 4"
                        sx={{ margin: 1 }}
                        value={values.serverCount}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => handleChange(e, values, setValues)}
                    />
                {
                    useBothTypes && 
                    <Stack sx={{ display: 'flex' }}>
                        <RadioGroup
                            row
                            aria-labelledby="image-deploy-type"
                            name="template_type">
                            {
                                template_options.map(option => {
                                    return (
                                        <FormControlLabel 
                                            value={option.template_type} 
                                            control={
                                                <Radio 
                                                    onChange={e => handleChange(e,values,setValues)} 
                                                />
                                                } 
                                            label={option.label} 
                                        />
                                    )
                                })
                            }
                        </RadioGroup>
                    </Stack>
                }
                {
                    values.template_type ?
                        values.template_type === 'template' ? 
                            <TextField
                                id="vmType"
                                select
                                label="Select"
                                value={values.template_name}
                                name="template_name"
                                onChange={(e) => handleChange(e, values, setValues)}
                                helperText="Select desired Operating System"
                                sx={{ margin: 1 }}
                                >
                                {
                                    templates.map((option) => (
                                        <MenuItem key={option._id} value={option.vcenter_template_name} >
                                            {option.template_name}
                                        </MenuItem> 
                                    ))
                                } 
                            </TextField>
                            :
                            <DropdownMenu 
                                id="vmType"
                                name="template_name"
                                value={values.template_name}
                                label="Select OVA template"
                                values={values}
                                setValues={setValues}
                                options={ova_options}
                                
                            />   
                    :
                    <></> 
                }
                </Stack>
        </>
    )
}

export default GeneralInstancesDetails