import { Button, DialogTitle } from "@mui/material"


const DialogErrorBody = ({ title, handleClose }) => {

    return(
        <>
            <DialogTitle>
                {title}
            </DialogTitle>
            <Button type="submit" id="finish" onClick={handleClose} primary={true} >
                Close
            </Button>
        </>
    )
}

export default DialogErrorBody 