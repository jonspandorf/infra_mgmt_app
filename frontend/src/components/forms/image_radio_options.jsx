import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material"

const ImageRadioOptionsGroup = ({ options,displayUploadTypeOption }) => {


    return (
        <>
        <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Choose Upload Image Type</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="image-upload"
                    name="image-upload-types"
                >
                    {options.map(option => {
                        return (
                            <FormControlLabel value={option.name} control={<Radio onChange={displayUploadTypeOption} />} label={option.label} />
                        )
                    })}
                </RadioGroup>
        </FormControl>
        </>
    )
}

export default ImageRadioOptionsGroup