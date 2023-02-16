import { Stack, TextField } from "@mui/material"
import { handleChange } from "../lib/utilities"

const TemplateInfo = ({ values, setValues }) => {

    return (
        <>
            <Stack sx={{ m: 1}}>
                <TextField 
                    id="templateName"
                    name="vcenter_template_name"
                    label="Template Name"
                    onChange={(e) => handleChange(e,values,setValues)}
                    helperText="No spaces. use underscore or camelcase"
                    sx={{ margin: 1 }}
                />
                <TextField 
                    id="uiName"
                    name="template_name"
                    label="UI name"
                    onChange={(e) => handleChange(e,values,setValues)}
                    helperText="This will be presented for other users. spaces allowed"
                    sx={{ m: 1 }}
                />
            </Stack>
        </>
    )
}

export default TemplateInfo