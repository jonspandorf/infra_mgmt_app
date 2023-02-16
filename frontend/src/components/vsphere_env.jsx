import { MenuItem, TextField } from "@mui/material"
import { useEffect } from "react"
import { handleChange } from "../lib/utilities"
import DropdownMenu from "./forms/dropdown-menu"

const VsphereEnv = ({ vspheres, values, setValues}) => {

    useEffect(()=> {}, [vspheres])


    return (
        <>
            {

                vspheres.length && 

                <DropdownMenu
                  id='vsphereEnv'
                  name='VSPHERE_HOST'
                  values={values}
                  setValues={setValues}
                  value={values.VSPHERE_HOST}
                  label='Choose vSphere Environement'
                  options={vspheres.map((vsphere,i) => ({ id: vsphere._id, value: vsphere.ip_address, name: vsphere.hostname }))}
                />
            }
        </>
    )
}

export default VsphereEnv