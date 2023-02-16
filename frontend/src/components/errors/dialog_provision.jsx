import { Button, DialogTitle } from "@mui/material"


const DialogProvisionBody = ({serverCount, toDestroy, formId }) => {

    return(
        <>
            <DialogTitle>
                {
                    serverCount > 1 ? 
                    <>
                        {toDestroy ? <>Destroy</> : <>Provision</>} all {serverCount} resources?
                    </> 
                : 
                    <>{toDestroy ? <>Destroy</> : <>Provision</>} resource?</>
                }
            </DialogTitle>
            <Button type="submit" id="validator" form={formId} primary={true} >
                { toDestroy ? <>Destroy</> : <>Deploy</> }
            </Button>
        </>
    )
}
export default DialogProvisionBody