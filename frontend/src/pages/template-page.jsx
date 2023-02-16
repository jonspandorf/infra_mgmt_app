import { Grid, Stack } from '@mui/material'

const TemplatePage = ({Component, ...props}) => {


    return(
        <>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                sx={{ display: 'flex', width: '100%', }}
                xs={8}
            >
                <Stack sx={{ display: 'flex', justifyContent: 'center',}}>
                    {Component && <Component {...props} />}
                </Stack>
            </Grid>
        </>
    )
}

export default TemplatePage