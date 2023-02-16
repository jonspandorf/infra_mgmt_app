import { Button } from "@mui/material"
import { useState } from "react"
import NewVsphereForm from "../components/forms/new_vsphere/new-vsphere-form"
import AppModal from "../components/modal"
import CustomResourceTable from "../components/resources/custom-resource-table"

const VcentersTable = ({ vspheres }) => {

    const initialValues = {
        hostname: '',
        ip_address: '',
        username: '',
        password: '',
    }



    const [ values, setValues ]          = useState(initialValues)
    const [ modalIsOpen, setModalOpen ]  = useState(false)

    const modalProps = {
        title: 'Add Vcenter',
        open: modalIsOpen,
        handleClose: () => setModalOpen(false),
        Component: NewVsphereForm,
        values,
        setValues
    }
    


    const handleAddVcenter = () => {
        // TODO
        setModalOpen(true)

    }


    return (
        <>
            {
                vspheres !== undefined && 
                <>
                    <CustomResourceTable records={vspheres}/>
                    <Button 
                        variant="contained" 
                        color="success" 
                        sx={{ p: 3, m: 4}} 
                        onClick={handleAddVcenter}
                    >
                        Add vSphere Server
                    </Button>
                    <AppModal {...modalProps} />
                </>            
            }
        </>
    )
}

export default VcentersTable