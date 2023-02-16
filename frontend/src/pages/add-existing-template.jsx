import { Stack } from "@mui/material"
import { useState } from "react"
import TemplateInfo from "../components/template_info"
import VcenterEnvironmentDetails from "../components/forms/vcenter_env_details"
import DeployButton from "../components/forms/deploy-button"
import { getClustersAndHosts, getVsphereDatacenters, initialTemplateValues, onAddExistingTemplateToDB, useDcIdx, useVcenters } from "../lib/utilities"
import PopUpDialog from "../components/dialog"
import DialogProvisionBody from "../components/errors/dialog_provision"


const AddExistingTemplate = ({ vspheres, ...props }) => {

    const [values, setValues] = useState(initialTemplateValues)
    const [dialogIsOpen, setDialog] = useState(false)
    const [isSubmitting, setSubmitting] = useState(false)
    const vcenterData = useVcenters(values.VSPHERE_HOST)

    const dcs = getVsphereDatacenters(vcenterData)
    const dcIdx = useDcIdx(dcs,values.datacenter)
    const { esxi_hosts, clusters, useBothTypes } = getClustersAndHosts(vcenterData, dcIdx)


    const handleSubmission = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        const res = await onAddExistingTemplateToDB(values)
        setSubmitting(false)
    }

    return(
        <>
            <Stack
                component="form"
                id='add-template-db'
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
                
                <TemplateInfo values={values} setValues={setValues} />
                <VcenterEnvironmentDetails 
                    values={values} 
                    setValues={setValues} 
                    vspheres={vspheres} 
                    esxi_hosts={esxi_hosts}
                    clusters={clusters}
                    minimal={true}
                    useBothTypes={useBothTypes} 
                    dcs={dcs}
                />
                <DeployButton setDialog={setDialog} isSubmitting={isSubmitting}/>
                {
                    dialogIsOpen &&
                        <PopUpDialog 
                            open={dialogIsOpen}
                            DialogBody={DialogProvisionBody}
                            handleClose={(e) => setDialog(false)} 
                            number={1} 
                            isSubmitting={isSubmitting}
                            formId="add-template-db"
                        />
                }

            </Stack>
        </>
    )
}

export default AddExistingTemplate 