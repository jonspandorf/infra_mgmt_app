import { Box, Button, Typography } from "@mui/material"
import DropdownMenu from "../components/forms/dropdown-menu"
import  SingleTextField  from '../components/forms/single-textfield'


const AddHardwareIfraToInventory = ({ values, setValues, datacenters , handleFormSubmission }) => {



    const typeOptions = [
        { name: 'Network Infrastrucutre', id: 1, value: 'network' },
        { name: 'Rack Servers and hosts', id: 2, value: 'servers' }
    ]

    const vendorOptions = {
        network: [ { name: "Cisco", value: 'cisco', id:1 }, { name: "Juniper", value: 'juniper', id: 2}, { name: 'Dell', value: 'dell', id: 3 }],
        servers: [ { name: "Dell", value: 'dell', id:1 }, { name: 'HP', value: 'hp', id: 2}, { name: 'Lenovo', value: 'lenovo', id: 3} ]
    }

    const labels = Object.keys(values).map(val => `Set the ${val}`)

    


    return (
        <>
        <Box sx={{ p: 4 }}>
                <Typography variant="h5">Baremetal Type</Typography>
                <Typography variant="body1">Choose the type of Baremetal device</Typography>
                <Box sx={{ display: 'flex' }}>
                    <DropdownMenu 
                        id='fdkjk'
                        name="type"
                        value={values.type}
                        values={values}
                        setValues={setValues}
                        label="Set Infra type"
                        options={typeOptions}
                    />
                    {
                        values.type &&
                            <DropdownMenu
                                id="vendorOptions"
                                name="vendor"
                                value={values.vendor}
                                values={values}
                                setValues={setValues}
                                label="Choose Vendor's name"
                                options={vendorOptions[values.type]}
                            />
                    }
                </Box>
            </Box>
            <Box>
                <Typography variant="h5">Baremetal Details</Typography>
                <Typography variant="body1">Details of remote management access such as Dell iDrac, HP iLo</Typography>
                    <Box sx={{ display: 'flex'}}>
                        {
                            Object.keys(values).slice(2,6).map((key,i) => {
                                return(
                                    <SingleTextField
                                        key={i}
                                        id={`${key}Id`}
                                        name={`${key}`}
                                        value={values[key]}
                                        values={values}
                                        setValues={setValues}
                                        label={`Set the ${key}`}
                                        helperText={key==='role' ? 'esxi, hypervisor, stoarge, etc.' : ""}
                                    />
                                )
                            })
                        }
                    </Box>
            </Box>
            <Box>
                    <Typography variant="h5">System Management Details</Typography>
                    <Typography variant="body1">Details of operating system access for ESXi, KVM, Switch Management, etc.</Typography>
                {
                    Object.keys(values).slice(6,9).map((key, i) => {
                        return(
                            <SingleTextField
                                key={i}
                                id={`${key}Id`}
                                name={key}
                                value={values[key]}
                                values={values}
                                setValues={setValues}
                                label={`Set the ${key}`}
                                type={key.includes('password') ? 'password' : 'text'}
                            />
                        )
                    })
                }
            </Box>
            <Box>
                    <Typography variant="h5">Remote Access Details</Typography>
                    <Typography variant="body1">Details of remote management access such as Dell iDrac, HP iLo</Typography>
                {
                    Object.keys(values).slice(9,12).map((key, i) => {
                        return(
                            <SingleTextField
                                key={i}
                                id={`${key}Id`}
                                name={key}
                                value={values[key]}
                                values={values}
                                setValues={setValues}
                                label={`Set the ${key}`}
                                type={key.includes('password') ? 'password' : 'text'}
                                helperText={key==="remote_access_ip" ? 'idrac, ilo, xclarity, digi' : ""}
                            />
                        )
                    })
                }
            </Box>
            <Box>
                <DropdownMenu
                    id="labChoice"
                    name="lab"
                    value={values.lab}
                    values={values}
                    setValues={setValues}
                    label="Associate device with lab"
                    options={
                        datacenters.map(dc =>  { return { name: dc.name, id: dc._id, value: dc._id } })
                    }
                />
            </Box>
            <Button variant="contained" color="error" type="submit">Add to Inventory</Button>
        </>
    )
}

export default AddHardwareIfraToInventory