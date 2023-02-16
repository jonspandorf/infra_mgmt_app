import { Box, Button, MenuItem, TextField, CircularProgress, Stack } from "@mui/material"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { handleChange } from "../../lib/utilities";
import { useState } from "react";
import { useEffect } from "react";
import { queryForAddresses } from "../../lib/api";

const IPv4Specs = ({values, setValues, labs, ipIdx, getAvailableAddresses, handleIpv4BackButton, handleIpv4NextButton, isSubmitting, setSubmitting }) => {

    const ipv4_opt = ['dhcp', 'static']



    return (
        <>
            <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', m:1 }}>
            <TextField
                    id="ipv4_type"
                    select
                    label="IPv4 Type"
                    name="ipv4_type"
                    value={values.ipv4_type}
                    onChange={(e) => handleChange(e, values, setValues)}
                    helperText="Please IP type"
                    sx={{ margin: 1}}
                    >
                    {ipv4_opt.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
            </TextField>
                        
            {

                <>
                        <TextField 
                                id="cidr"
                                label="Choose Cidr"
                                name="lab"
                                value={values.lab}
                                defaultValue="Choose Cidr"
                                select
                                // Handle Cidr
                                onChange={e => handleChange(e,values,setValues)}
                                helperText="Choose Cidr"
                                sx={{ margin: 1 }}
                            >
                                {labs.map((lab,i) => (
                                    <MenuItem key={i} value={lab._id}>
                                       {lab.cidr}
                                    </MenuItem>
                                    ))}

                        </TextField>
                            {
                                values.ipv4_type==='static' && !values.static_ips.length && values.lab 
                                ? 
                                    <Button 
                                        color="primary" 
                                        variant="outlined" 
                                        onClick={getAvailableAddresses} 
                                        sx={{ maxHeight: '55.5px', margin:1}}
                                    >
                                        {
                                            isSubmitting ? 
                                                <>fetching ips<CircularProgress /></> 
                                            : 
                                                <>Generate New Ips</>
                                        }
                                    </Button> 
                                : ""
                            }
                            {
                                values.static_ips.length ? 
                                    <Box sx={{ display: 'flex', mb: 3 ,alignItems: 'center', p:3}} >
                                        {
                                            values.static_ips.length > 1 && 
                                                <>
                                                    <Button  
                                                        onClick={handleIpv4BackButton} 
                                                        value="back"
                                                        disabled={ipIdx===1}>
                                                            <ArrowLeftIcon value="back"/>
                                                    </Button>
                                                    <Button 
                                                        onClick={handleIpv4NextButton}
                                                        value="next" 
                                                        disabled={ipIdx===values.static_ips.length}>
                                                            <ArrowRightIcon value="next"/>
                                                    </Button>
                                                </>
                                        }
                                        {
                                            values.static_ips.slice(ipIdx-1, ipIdx).map(ip => {
                                                return (  
                                                    <>
                                                        <div key={ip._id}>{ip.ip_address}</div>
                                                    </>
                                                )
                                            })
                                        }
                                    </Box>
                                    :<></>
                            }
                            
                        </>
                }
                            </Stack>

            </>
    )
}

export default IPv4Specs