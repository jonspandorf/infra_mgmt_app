import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Grid, Stack } from '@mui/material'
import { useEffect } from 'react';
import { modalStyle } from '../lib/utilities';
import { useAuth } from '../context/auth';

const AppModal = ({ title, 
    open, 
    handleClose, 
    Component, 
    toDelete, 
    instanceId, 
    handleDestroy, 
    values, 
    setDialogOpen, 
    ...props }) => {
      
      
    const { token } = useAuth()

    useEffect(() => {
      let _isMounted = true 

      return () =>  {
        _isMounted = false
      } 
    }, [])

    return (
      <div>
       <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={modalStyle}>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                {title}
              </Typography>
              <Typography component="div" id="transition-modal-body" sx={{ mt: 2 }}>
                <Grid container justify = 'center' sx={{ display: 'flex', justifyContent: 'center' }} >
                  { 
                    Component &&
                        toDelete
                       ?
                        <Stack 
                          id="destroy-form" 
                          component="form" 
                          onSubmit={(e) => {
                          setDialogOpen(false)
                          handleClose()
                          handleDestroy(e,instanceId,values,token)
                        }}>
                          <Component 
                            toDelete={toDelete} 
                            setDialogOpen={setDialogOpen} 
                            values={values} 
                            token={token}
                            {...props} 
                          />
                        </Stack>
                        : 
                        <Component 
                          closeForm={handleClose} 
                          token={token}
                          values={values}
                          {...props} 
                          />
                  }
                </Grid> 
              </Typography>
            </Box>
          </Fade>
        </Modal>
      </div>
    );
  }

  export default AppModal