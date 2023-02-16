import { Checkbox, FormControlLabel, FormGroup, Switch, TextField, Typography, MenuItem, Box } from "@mui/material"
import { useState } from "react"
import { useEffect } from "react"
import { getVcenterData } from "../../lib/api"
import { handleChange } from "../../lib/utilities"
import VsphereEnv from "../vsphere_env"

const VcenterEnvironmentDetails = ({values, setValues, vspheres, dcs, esxi_hosts, clusters, useBothTypes=false,  isTemplate=true, minimal=false }) => {


    const [ rpExists, setRpExists ] = useState(false)
    const [ toggleView, setClustersOrHosts ] = useState(useBothTypes ? 'clusters' : 'hosts')
    const [ switchIsOn, setSwitchOn ] = useState(false)

    const handleClustersOrHosts = () => {
        if (toggleView === 'clusters') setClustersOrHosts('hosts')
        else setClustersOrHosts('clusters')
        setSwitchOn(!switchIsOn)
    }

    useEffect(() => {
        if (values.datacenter) {
            if (!clusters.length) setClustersOrHosts('hosts')
            if (toggleView === 'hosts' && values.cluster) setValues({ ...values, cluster: '' })
            if (toggleView === 'clusters' && values.esxi) setValues({ ...values, esxi: '' })
        }
    }, [values.datacenter,toggleView])



    return (
        <>
        <Typography sx={{ mb: 1 }} component={'span'} variant="h5">Environment Details</Typography>
            <VsphereEnv vspheres={vspheres} values={values} setValues={setValues} />
        {
            values.VSPHERE_HOST && 
                <TextField
                    id='choosedc'
                    select
                    label='Choose Datacenter'
                    value={values.datacenter}
                    onChange={(e) => handleChange(e, values, setValues)}
                    sx={{ m: 1 }}
                    name='datacenter'
                >
                    {
                        dcs.length && dcs.map((dc,i) => (
                            <MenuItem key={i} value={dc}>
                                {dc.toUpperCase()}
                            </MenuItem>
                        ))
                    }
                
                </TextField>
        }
        {
           !minimal && values.datacenter && useBothTypes &&
                <FormGroup>
                    <FormControlLabel 
                    sx={{ m:1 }} 
                    control={<Switch 
                        checked={switchIsOn} 
                        onChange={handleClustersOrHosts} />
                    } 
                    label="Switch between clusters and hosts" />
                </FormGroup>
        }
        { 
            !minimal && values.datacenter &&          
            useBothTypes && toggleView === 'clusters' && 
                <TextField
                    id='choosecluster'
                    label='Type Cluster'
                    select
                    value={values.cluster}
                    onChange={(e) => handleChange(e, values, setValues)}
                    sx={{ m: 1}}
                    name='cluster'
                >
                    {
                        clusters.length && clusters.map((cluster,i) => (
                            <MenuItem key={i} value={cluster}>
                                {cluster.toUpperCase()}
                            </MenuItem>
                        ))
                    }
                </TextField>      
        }
        {
            !minimal && values.datacenter && (!useBothTypes || toggleView === 'hosts') && 
                    <TextField
                        id='esxi'
                        label='Choose Esxi'
                        select
                        value={values.esxi}
                        sx={{ m: 2 }}
                        onChange={(e) => handleChange(e, values, setValues)}
                        name='esxi' 
                    >
                        {
                            esxi_hosts.length ? esxi_hosts.map((esxi,i) => (
                                <MenuItem key={i} value={esxi}>
                                    {esxi}
                                </MenuItem>
                            ))
                            :
                            <></>
                        }
                    </TextField>
        }
        {
            (values.cluster || values.esxi) && !isTemplate &&  
                <Box sx={{ display: 'flex', p: 1}}>
                    <TextField
                        id="rp"
                        label="Type Resource Pool"
                        value={values.requested_rp}
                        helperText="Specify the RP name"
                        name="requested_rp"
                        sx={{ margin: 1}}
                        onChange={(e) => handleChange(e, values, setValues)}
                    />
                <FormGroup>
                    <FormControlLabel 
                        sx={{ margin: 2 }} 
                        control={
                                    <Checkbox 
                                        value={values.rpExists} 
                                        name="rpExists"
                                        checked={values.rpExists} 
                                        onChange={(e) => handleChange(e,values,setValues)} 
                                    />
                                } 
                        label="Is this an existing Resource Pool?" />
                </FormGroup>
                </Box>
        } 
        </>
    )
}

export default VcenterEnvironmentDetails