import { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack'
import { getClustersAndHosts, getVsphereDatacenters, handleChange, isNextButtonDisabled, useDcIdx, useVcenters } from '../lib/utilities';
import { getDatacenterTemplates, queryForAddresses } from '../lib/api';
import PopUpDialog from './dialog';
import VcenterEnvironmentDetails from './forms/vcenter_env_details';
import GeneralInstancesDetails from './forms/instances_gen';
import InstanceOperatingSystemSpecs from './forms/instance_os_specs';
import HardwareNetwrokSpecs from './forms/hw_network_specs';
import VsphereCreds from './vsphere-creds';
import VM_Summary from './vm-summary'
import DeployButton from './forms/deploy-button';
import DialogProvisionBody from './errors/dialog_provision';
import DialogErrorBody from './errors/dialog_error';
import ModalTemplatePage from './modal-template-page';
import SectionButtonGroups from './forms/section-buttons-group';





const CreateNewServerForm = ({values, setValues, handleSubmission, closeForm, labs, vspheres, token, viewedLabId}) => {

    
    const Components = {
        VcenterEnvironmentDetails,
        GeneralInstancesDetails,
        HardwareNetwrokSpecs,
        InstanceOperatingSystemSpecs,
        VsphereCreds,
        VM_Summary
    } 

    const [isInit, setInit]               = useState(true)
    const [idx, setIdx]                   = useState(0)
    const [view, setView]                 = useState(Object.keys(Components)[idx])
    const [dialogIsOpen, setDialogOpen]   = useState(false)
    const [templates, setTemplates]       = useState([])
    const [isFinalized, setFinalize]      = useState(false)
    const [isSubmitting, setSubmitting]   = useState(false)
    const [passConfirm, setPassConfirm]   = useState('')
    const [ipIdx, setIpIdx]               = useState(1);

    const vcenterData = useVcenters(values.VSPHERE_HOST,token)
    const vsphere_datacenters = getVsphereDatacenters(vcenterData)
    const dcIdx = useDcIdx(vsphere_datacenters,values.datacenter)
    const { esxi_hosts, clusters, useBothTypes } = getClustersAndHosts(vcenterData, dcIdx)



    useEffect(() => {

        let _isMounted = true

        if (_isMounted) {
            if (isInit) {
                setValues({
                    lab: viewedLabId,
                    ...values
                })  
                setInit(false)
            }
        }
        return () => _isMounted = false
    }, [values])



    useEffect(() => {

        if (values.esxi) setValues({ ...values, cluster: '' })
        if (values.cluster) setValues({ ...values, esxi: '' })

    },[values.requested_rp])

    useEffect(() => {
        if (values.lab) {
            const idx = labs.map(lab => lab._id).indexOf(values.lab)
            setValues({...values, static_ips: [], dg: labs[idx].dg })
        }


    }, [values.lab])

    useEffect(() => {
        if (values.ipv4_type === 'dhcp') {
            const e = {
                target: {
                    value: viewedLabId
                }
            }
            handleChange(e,values,setValues)
        }
        
    },[values.ipv4_type])


    useEffect(() => {
        if (values.datacenter && values.VSPHERE_HOST) {
            setTemplates([])
            getDatacenterTemplates(values.VSPHERE_HOST,values.datacenter,token)
            .then((data) => {
                if (data.data.templates.length) setTemplates(data.data.templates)
            })
        }
    }, [values.datacenter])



    useEffect(() => {

        setValues({ ...values, lab: '', static_ips: [] })
    }, [values.ipv4_type])


    useEffect(() => {
        setView(Object.keys(Components)[idx])
    }, [idx, isFinalized])



    const handleIpv4NextButton = (e) => {

        setIpIdx(prv => prv+1)

    }

    const handleIpv4BackButton = () => {
        setIpIdx(prv => prv-1)

    }
    const getAvailableAddresses = async () => {
        setSubmitting(true)
        const userdata = { lab_id: values.lab, numOfInstances: values.serverCount }
        const data = await queryForAddresses(userdata,token)
        setValues({...values, static_ips: [...data.data.addresses]})
        setSubmitting(false)
    }

    const handlePart = (e) => {
        if (idx+1 === Object.keys(Components).length - 1) setFinalize(true)
        if (e.target.name === 'next') setIdx(count => count + 1)
        else if (e.target.name === 'back') setIdx(count => count - 1)
        setView(Object.keys(Components)[idx])
    }



    const componentsProps = {
        VcenterEnvironmentDetails: { values, setValues, dcs: vsphere_datacenters, clusters, esxi_hosts, vspheres, useBothTypes, isTemplate: false },
        GeneralInstancesDetails: { values, setValues, templates, useBothTypes },
        HardwareNetwrokSpecs: { values, setValues, isSubmitting, setSubmitting, labs, ipIdx, getAvailableAddresses, handleIpv4BackButton, handleIpv4NextButton },
        InstanceOperatingSystemSpecs: { values, setValues },
        VsphereCreds: {  values, setValues, passConfirm, setPassConfirm, vspheres, instanceCount: values.serverCount, dialogIsOpen, setDialogOpen },
        VM_Summary: { values }
    }

    return (
        <>
            <Stack
                component="form"
                id='new-vm-form'
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    height: '50vh'
                }}
                noValidate
                autoComplete="off"
                onSubmit={(e) => {
                    handleSubmission(e,values,token)
                    setDialogOpen(false)
                    closeForm()
                }}
            >   
                <ModalTemplatePage 
                    RenderedComponent={Components[view]} 
                    {...componentsProps[view]} 
                />
                <SectionButtonGroups 
                    isBackDisabled={!idx} 
                    isNextDisabled={() => isNextButtonDisabled(!values.VSPHERE_HOST || !values.datacenter || isFinalized, !values.esxi || !values.cluster)} 
                    backButtonName="back" 
                    nextButtonName="next"
                    onChangeComponent={handlePart} 
                />
                {
                    idx === Object.keys(Components).length-1 && 
                        <DeployButton setDialog={setDialogOpen} />
                }
                {
                    dialogIsOpen && 
                        isFinalized ? 
                            <PopUpDialog 
                                DialogBody={DialogProvisionBody}
                                open={dialogIsOpen} 
                                handleClose={() => setDialogOpen(false)}  
                                number={values.serverCount} 
                                isSubmitting={isSubmitting}
                                formId="new-vm-form"
                            />
                        :
                            <PopUpDialog 
                                DialogBody={DialogErrorBody}
                                open={dialogIsOpen}
                                handleClose={() => {
                                    setDialogOpen(false)
                                    setValues({})
                                    closeForm()
                                }}
                                formId="error"
                                title="No templates! Please add template"
                            />

                }        
            </Stack>

        </>
    )
}

export default CreateNewServerForm