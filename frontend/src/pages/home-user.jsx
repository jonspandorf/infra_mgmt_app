import { useState } from 'react'
import { Button, Stack, Typography, CircularProgress } from "@mui/material"
import AppModal from '../components/modal'
import ShowTables from './show-table'
import { useEffect } from 'react'
import { getMainView } from '../lib/api'
import { onSubmitInstancesData, onInitRange, onReserveAddresses, handleDestroy, handleReleaseAddressBlock, initialInstancesValues } from '../lib/utilities'
import CreateNewServerForm from '../components/vm-create-form';
import CreateAddresses from '../components/create-addresses';
import CreateRange from './create-range';
import { useAuth } from '../context/auth'




const HomeUser = ({ vspheres, datacenter, labs, viewedLabId })  => {


    const [formIsOpen, setFormOpen] = useState(false)
    const [viewedComponent, setViewdComponent] = useState('')
    const [resources, setResources] = useState({})
    const [modalTitle, setTitle] = useState('')
    const [isSubmitting, setSubmitting] = useState(false)
    const [updatePage, setUpdatePage] = useState(false)
    const [dialogIsOpen, setDialogOpen] = useState(false)
    const [ isDestroying, setDestroying ] = useState(false)
    const [ vmFormValues, setVmFormValues ] = useState(initialInstancesValues)
    const [ pageIsLoading, setPageLoading ] = useState(false)

    const { token } = useAuth()

    
    const features = [
        {title: "Launch Instances", name: "CreateNewServerForm", color: "error", featureIsActive: true, isReady: vspheres !== undefined },
        {title: "Reserve IP Addresses", name: "CreateAddresses" , color: "primary", featureIsActive: true, isReady: labs !== undefined  },
        // {title: "Initiate New Static Range", name: "CreateRange", color: "success", featureIsActive: true },
        {title: "Deploy K8S", name: "CreateNewServerForm", color: "success", featureIsActive: true, isk8s: true, isReady: vspheres !== undefined   },
    ]

    const Components = {
        CreateNewServerForm,
        CreateAddresses,
        CreateRange
    }

    const createActions = {
        CreateNewServerForm: onSubmitInstancesData,
        CreateRange: onInitRange,
        CreateAddresses: onReserveAddresses,     
    }

    const fetchResources = async () => {
        getMainView(datacenter,token)
        .then((res) => {
            setResources({...res.data})
            setPageLoading(false)
        })
    }

    useEffect(() => {
        let _isMounted = true
        
        if (_isMounted) {
            setPageLoading(true)
            if (datacenter && token) fetchResources()
            
        }
        return () => _isMounted = false
    }, [vspheres, token, datacenter ])

    useEffect(() => {
        if (datacenter || updatePage) {
            setPageLoading(true)
            fetchResources()
            setUpdatePage(false)
        } 

    },[datacenter, updatePage])

    const handleForm = async (e) => {
        setTitle('')
        setViewdComponent(e.target.name)
        setTitle(features[features.map(fet => fet.name).indexOf(e.target.name)].title)
        setFormOpen(!formIsOpen)
    }

    const closeForm = () => {
        setVmFormValues(initialInstancesValues)
        setFormOpen(false)
    }

    const timeout = async () => {
        return new Promise(res => setTimeout(res,1500))
    }

    const handleCreateAction = async (e,values) => {
        e.preventDefault()
        setSubmitting(true) 
        await createActions[viewedComponent](values,token)
        if (viewedComponent!=="CreateNewServerForm"); await timeout()
        setFormOpen(false)
        setSubmitting(false)
        setUpdatePage(true)
    }

    const onReleaseAddresses = async (id,lab) => {
        setSubmitting(true)
        const res = await handleReleaseAddressBlock(id,lab,token)
        if (res) setSubmitting(false)
        setUpdatePage(true)

    }

    const onDestroyInstances = async (e,id,creds) => {
        // TODO
        e.preventDefault()
        setDestroying(true)
        const res = await handleDestroy(id,creds,token)
        if (res) setDestroying(false)
        setUpdatePage(true)
    }


    return (
        <>
                <Typography variant="h2">Infrastrucutre Manager</Typography>
                    {
                        !pageIsLoading  ? 
                            <Stack direction="row" spacing={2} sx={{   pt: 10, pb: 10, pl: 30, pr: 0, flex:1 }} >
                                <Stack direction="column" spacing={2} sx={{ display: 'flex', justifyContent: 'flex-start', p:5 }} >
                                    <h3>Managed Infrastructure</h3>
                                    {
                                        Object.keys(resources).length > 0 
                                        ? 
                                        <>
                                            {/* {resources.ips.length > 0 ?  */}
                                                <ShowTables 
                                                    handleSubmission={onReleaseAddresses} 
                                                    title="Latest created IPs" 
                                                    items={resources.ips} 
                                                    type="ip" 
                                                    releasingAddresses={isSubmitting} 
                                                /> 
                                                {/* : <h4>Currently No Allocated IPs</h4>}  */}
                                            {/* {resources.instances.length > 0 ?  */}
                                                <ShowTables  
                                                    handleSubmission={onDestroyInstances} 
                                                    title="Provisioned Servers" 
                                                    items={resources.instances} 
                                                    type="instance" 
                                                    dialogIsOpen={dialogIsOpen} 
                                                    setDialogOpen={setDialogOpen}
                                                    deployInProgress={isSubmitting} 
                                                    destroyInProgress={isDestroying}
                                                    vspheres={vspheres}
                                                /> 
                                                {/* : <h4>Currently No Provisioned Servers</h4>} */}
                                        </>
                                        : 
                                            <div>no resources!</div>
                                    }
                                </Stack>
                                <Stack direction="column" spacing={2} sx={{ p: 10, }} >
                                    <Typography variant="h5">Control Panel</Typography>
                                    {
                                        features.map((feature,i) => (
                                            <Button 
                                                key={i} 
                                                variant="contained" 
                                                color={feature.color} 
                                                onClick={handleForm} 
                                                sx={{ p: 4 }} 
                                                name={feature.name} 
                                                disabled={!feature.featureIsActive || !feature.isReady }
                                            >
                                                {feature.title}
                                            </Button>
                                        ))
                                    }
                                </Stack>
                                {
                                    viewedComponent && formIsOpen &&
                                        <AppModal 
                                            title={modalTitle} 
                                            open={formIsOpen} 
                                            handleClose={closeForm} 
                                            Component={Components[viewedComponent]} 
                                            vspheres={vspheres} 
                                            handleSubmission={handleCreateAction} 
                                            isSubmitting={isSubmitting} 
                                            labs={labs}
                                            values={vmFormValues}
                                            setValues={setVmFormValues}
                                            viewedLabId={viewedLabId}
                                        />
                                }
                            </Stack>
                            :
                            <CircularProgress />
                }
        </>

    )


}

export default HomeUser