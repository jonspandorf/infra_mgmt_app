import { Button, DialogTitle } from "@mui/material"


const GenericDialogBody = ({ dialogTitle, dialogBtnTxt,formId }) => {

    return(
        <>
            <DialogTitle>
                {
                    dialogTitle
                }
            </DialogTitle>
            <Button type="submit" id="validator" form={formId} primary={true} >
                { 
                    dialogBtnTxt
                }
            </Button>
        </>
    )
}
export default GenericDialogBody