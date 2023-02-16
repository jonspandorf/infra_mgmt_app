import { Box, Button } from "@mui/material"


const SectionButtonGroups = ({ isBackDisabled, isNextDisabled, backButtonName, nextButtonName, onChangeComponent }) => {


    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
            <Button sx={{ margin: 2 }} color="primary" disabled={isBackDisabled} variant="outlined" onClick={onChangeComponent} name={backButtonName}>Back</Button>
            <Button sx={{ margin: 2 }} color="secondary" disabled={isNextDisabled()} variant="outlined" onClick={onChangeComponent} name={nextButtonName}>Next</Button> 
        </Box> 
    )
}

export default SectionButtonGroups