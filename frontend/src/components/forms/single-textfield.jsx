import { TextField } from "@mui/material"
import { handleChange } from "../../lib/utilities"

const SingleTextField = ({ label, id, name, value, values, setValues, type, helperText, checkIsValid=true }) => {

    return (
        <> 

        <TextField 
            sx={{ m: 3 }}
            label={label}
            id={id}
            name={name}
            value={value}
            error={checkIsValid}
            type={type ? type : "text"}
            onChange={(e) => handleChange(e,values,setValues)}
            helperText={helperText ? helperText : ""}
        />
        </>
    )

}

export default SingleTextField