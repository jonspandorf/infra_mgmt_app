import { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, CircularProgress } from '@mui/material' 
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import AppModal from './modal';
import { deleteAddressRange, destroyInstances } from '../lib/api';
import VsphereCreds from './vsphere-creds';



const ResourcesTable = ({ handleSubmission, resources, resourcesLength, type, deployInProgress=false,destroyInProgress=false, vspheres=[],  ...props }) => {


    const initialValues = {
        VSPHERE_HOST: '',
        VSPHERE_USER: '',
        VSPHERE_PASSWD: '',
    }

    const [formIsOpen, setFormOpen] = useState(false)
    const [vsphereCreds, setVsphereCreds] = useState(initialValues)
    const [viewedComponent, setViewdComponent] = useState("")
    const [instanceIdToDelete, setInstanceId] = useState("")


    const Components = {
        VsphereCreds
    }

    const showMoreResources = async () => {
        // TODO
    }

    const exploreResource = async (uid,lab) => {
        // 
    } 


    const handleDeleteClick = (id,lab) => {
        if (type === 'ip') {
            handleSubmission(id,lab)
        } else {
            handleDeleteInstance(id)
        }
    }

    const handleDeleteInstance = async (id) => {
        // open modal and get vsphere creds
        setViewdComponent("VsphereCreds")
        setInstanceId(id)
        setFormOpen(true)
        
    }

    const handleTableModal = () => {
        setFormOpen(!formIsOpen)
    }

    return (
        <>
            { 
                resources.length ? 
                    <TableContainer component={Paper} >
                    <Table sx={{ minWidth: 650 }}  aria-label="all-resources">
                        <TableHead sx={{ display:'flex', flexDirection: 'column' }}>
                            <TableRow  sx={{ width: '100%', display:'flex', justifyContent: 'space-between'  }}>
                                {
                                    Object.keys(resources[0]).map((key) => (
                                        key !== '_id' && <TableCell key={key} >{key}</TableCell>
                                    )) 
                                }
                                <TableCell>Info</TableCell>
                                <TableCell>Destroy</TableCell>
                                {/* <TableCell>Datacenter</TableCell>
                                <TableCell>IP Address</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Num</TableCell>
                                <TableCell >Info</TableCell>
                                <TableCell >Destroy</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ display: 'flex',  flexDirection: 'column' }}>
                            {
                                deployInProgress &&
                                    <> 
                                        <TableRow
                                            sx={{ width: '100%', display:'flex', justifyContent: 'space-between'}}
                                        />
                                        <TableCell>Deploying Latest Instance <CircularProgress size={20} /></TableCell>
                                    </>
                            }
                            {
                                resources.length && 
                                    resources.map((resource) => (
                                        <TableRow
                                        key={resource._id}
                                        hover
                                        sx={{ width: '100%', display:'flex', justifyContent: 'space-between' }}
                                        >
                                                {
                                                    Object.keys(resource).map((name, idx) => (
                                                        name !== '_id' && <TableCell key={idx} align="right" >{resource[name]}</TableCell>
                                                    ))
                                                }
                                                <TableCell>
                                                    <Button  onClick={() => exploreResource(resource._id)} color="success" startIcon={<InfoIcon/>} />
                                                </TableCell>
                                            
                                            {
                                                !destroyInProgress ? 
                                                    <TableCell>
                                                        <Button  onClick={() => handleDeleteClick(resource._id,resource.lab)} color="error" startIcon={<DeleteIcon/>}></Button>
                                                    </TableCell>
                                                    :
                                                    <TableCell>
                                                        <Button 
                                                            onClick={() => {}}
                                                            startIcon={<IconButton />}
                                                        >
                                                            <CircularProgress size={20} />
                                                        </Button>
                                                    </TableCell>
                                            }
                                        </TableRow>
                                    ))

                            }
                        </TableBody>
                            {
                                resourcesLength > 2 ? 
                                    <Button variant="outlined" onClick={showMoreResources} >Show More</Button>  : ""
                            }
                            {
                                formIsOpen && 
                                <AppModal 
                                    title={viewedComponent} 
                                    open={formIsOpen} 
                                    handleClose={handleTableModal} 
                                    Component={Components[viewedComponent]} 
                                    instanceId={instanceIdToDelete} 
                                    values={vsphereCreds} 
                                    setValues={setVsphereCreds} 
                                    toDelete={true} 
                                    vspheres={vspheres} 
                                    handleDestroy={handleSubmission} 
                                    {...props} 
                                />
                            }
                        </Table>
                    </TableContainer>
                    :
                    <div>No provisioned resources!</div>
            }
        </>
    )
}

export default ResourcesTable