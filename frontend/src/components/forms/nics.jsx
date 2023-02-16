import { Box, FormControlLabel, Switch } from "@mui/material"
import { handleChange } from "../../lib/utilities"
import PrivateNic from "../pnic-component"

const Nics = ({ values, setValues, nic_count, addOrRemoveNic }) => {

    return (
        <>
            <Box
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                <Box>
                    <FormControlLabel 
                        control={
                        <Switch  
                            name="extra_nics"
                            value={values.extra_nics}
                            onChange={(e) => handleChange(e, values, setValues)}
                        />} 
                        label="Do you need private networks?" 
                    />
                        </Box>
                            {
                                (values.extra_nics && nic_count) > 0 && 
                                    [...Array(nic_count).keys()].map(num => {
                                        return (
                                            <PrivateNic 
                                                ic_name={`nic_name_${num+1}`}
                                                nic_label="Pirvate Nic Name"
                                                private_ip_name={`private_ip_${num+1}`}
                                                private_ip_label="Type Private IP"
                                                nic_count={nic_count}
                                                addOrRemoveNic={addOrRemoveNic}
                                            />
                                        )
                                })
                            }
            </Box>
        </>
    )
}

export default Nics