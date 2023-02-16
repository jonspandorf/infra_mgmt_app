import  Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { Grid } from "@mui/material"
const HomeAdmin = () => {

    return (
        <>
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vg'}}
        >
            <h1>Welcome Admin</h1>
                <Stack direction="row" spacing={2}>
                    <Button color="primary">Show Used Addresses</Button>
                    <Button color="secondary">Show Vcenter VMs</Button>
                    <Button variant="outlined" color="error">Create New Static Address Range</Button>
                </Stack>
        </Grid>
        </>
    )
}

export default HomeAdmin