import Dialog from '@mui/material/Dialog';

const PopUpDialog = ({ DialogBody, open, handleClose, ...props  }) => {


    
    return (
        <>
        <Dialog
               open={open}
               onClose={handleClose}
        >
            <DialogBody {...props} handleClose={handleClose} />
        </Dialog>
        </>
    )
}

export default PopUpDialog