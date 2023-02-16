import {  Stack } from "@mui/material"
import { useEffect } from "react"
import { useState } from "react"
import { getClustersAndHosts, getVsphereDatacenters, initialTemplateValues, isNextButtonDisabled, onSubmitTemplateData, useClusters, useDatacenters, useEsxiHosts, useVcenters } from "../lib/utilities"
import TemplatePage from "./template-page"
import InstanceHWSpecs from "../components/forms/instance_hw_specs"
import SectionButtonGroups from "../components/forms/section-buttons-group"
import UploadFile from "../components/forms/uplod-file"
import VcenterEnvironmentDetails from "../components/forms/vcenter_env_details"
import VsphereCreds from "../components/vsphere-creds"
import DeployButton from "../components/forms/deploy-button"
import PopUpDialog from "../components/dialog"
import DialogProvisionBody from "../components/errors/dialog_provision"
import { useAuth } from "../context/auth"



const DeployOVATemplate = ({ vspheres }) => {



    const [values, setValues] = useState(initialTemplateValues)
    // const [passConfirm, setPassConfirm] = useState("")
    const [isDialogOpen, setDialog] = useState(false)
    const [viewedComponent, setViewedComponent] = useState("")
    const [idx, setIdx] = useState(0)
    const [dcIdx, setDcIdx] = useState(0)
    const [isSubmitting, setSubmitting] = useState(false)
    const { token } = useAuth()


    const vcenterData = useVcenters(values.VSPHERE_HOST, token)
    const dcs = getVsphereDatacenters(vcenterData)
    const { esxi_hosts, clusters, useBothTypes } = getClustersAndHosts(vcenterData, dcIdx)


    const Components = {
        InstanceHWSpecs,
        VcenterEnvironmentDetails,
        UploadFile,
        VsphereCreds
    }

    useEffect(() => {

        setViewedComponent(Object.keys(Components)[idx])
        
    }, [idx])


    useEffect(() => {
        if (values.datacenter) {
            if (values.cluster) setValues({ ...values, cluster: '' })
            else if (values.esxi) setValues({ ...values, esxi: '' })
            setDcIdx(dcs.indexOf(values.datacenter))
        }
    }, [values.datacenter, dcIdx])

    
    const onChangeComponent = (e) => {
        setIdx(idx => { 
            if (e.target.name === 'next') return idx + 1
            else return idx - 1 
        })
        setViewedComponent(Object.keys(Components)[idx])

    }

    const handleSubmission = async (e) => {
        // TODO
        e.preventDefault()
        setSubmitting(true)
        const res = await onSubmitTemplateData(values,token)
        setSubmitting(false)
        setDialog(false)
        
    }

    const componentProps = {
        InstanceHWSpecs: { values, setValues, isTemplate: true } ,
        VcenterEnvironmentDetails :{ values, setValues, vspheres, dcs, esxi_hosts, clusters, useBothTypes, isTemplate: true, },
        UploadFile: { values, setValues },
        VsphereCreds: { values, setValues, vspheres, setDialogOpen: setDialog, dialogIsOpen: isDialogOpen, isSubmitting }
    }
 
    return (
        <>
            <Stack
                component="form"
                id='deploy-ova'
                sx={{
                    // width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    height: '50vh',
                    minWidth: '100vh'
                }}
                xs={12}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmission}
            >
                <TemplatePage 
                    Component={Components[viewedComponent]} 
                    {...componentProps[viewedComponent]}
                />
                <SectionButtonGroups 
                    isBackDisabled={!idx} 
                    isNextDisabled={() => isNextButtonDisabled(idx === Object.keys(Components).length - 1, idx === Object.keys(Components).length - 1)} 
                    onChangeComponent={onChangeComponent}
                    backButtonName="back" 
                    nextButtonName="next"
                />
                {
                    idx === Object.keys(Components).length - 1 &&
                        <DeployButton setDialog={setDialog} isSubmitting={isSubmitting}/>
                }
                {
                    isDialogOpen && 
                        <PopUpDialog 
                            open={isDialogOpen} 
                            DialogBody={DialogProvisionBody}
                            handleClose={() => setDialog(false)}  
                            number={1} 
                            isSubmitting={isSubmitting}
                            formId="deploy-ova"
                        />
                }
            </Stack>
        </>
    )
}

export default DeployOVATemplate