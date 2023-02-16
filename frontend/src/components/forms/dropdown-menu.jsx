import { Box, InputLabel, MenuItem, TextField } from "@mui/material"
import { handleChange } from "../../lib/utilities"
import Select from '@mui/material/Select';

const DropdownMenu = ({ id, name, helperText, options, value, values, setValues, label}) => {

    return (
        <>
        <Box >
        <InputLabel id={`label${id}`}>{label}</InputLabel>
        <Select
            defaultValue={label}
            id={id}
            labelId={`label${id}`}
            label={label ? label : "Select"}
            value={value}
            name={name}
            onChange={(e) => handleChange(e, values, setValues)}
            // helperText={helperText}
            // sx={{ margin: 1, p: 4}}
            fullWidth
        >
            {
                options.map((option) => (
                    <MenuItem key={option.id} value={option.value} >
                        {option.name}
                    </MenuItem> 
                ))
            } 
    </Select>
    </Box>
        </>
    )
}

export default DropdownMenu