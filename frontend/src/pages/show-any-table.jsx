import { Button, setRef, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useEffect } from 'react';
import DeviceDetails from '../components/device-details';
import PopUpDialog from '../components/dialog';
import GenericDialogBody from '../components/errors/dialog-gen';
import AppModal from '../components/modal';
import { useAuth } from '../context/auth';
import { deleteBaremetalDeviceFromDB, getBaremetalInventory } from '../lib/api';
import { getDevicesTableColumns } from '../lib/utilities';




const ShowAnyTable = ({ labId }) => {
  const [ resources, setResources ] = useState([])
  const [ modalIsOpen, setModalOpen ] = useState(false)
  const [ viewedDeviceId, setViewedDeviceId ] = useState("")
  const [  actionConfirm, setActionConfirm ] = useState(false)
  const [ refreshPage, setRefresh ] = useState(false)
 
  const { token } = useAuth()

  useEffect(() => {

      getBaremetalInventory(labId,token)
      .then((res) => {
        const parsed = res.data.devices.map(device => { return { id: device._id, ...device }})
        setResources(parsed)
        setRefresh(false)
      })

  }, [labId,refreshPage])


const handleShowBaremetalDeviceDetails = (e, deviceId) => {
    e.stopPropagation()
    setViewedDeviceId(deviceId)
    setModalOpen(true)
}

const deleteDeviceById = (e, deviceId) => {
  e.stopPropagation()
  setActionConfirm(true)
  setViewedDeviceId(deviceId)
  // TODO
}

const onDeleteDevice = async (e) => {
  e.preventDefault()
  const deleted = await deleteBaremetalDeviceFromDB(viewedDeviceId,token)
  if (deleted) {
    setActionConfirm(false)
    setRefresh(true)
  }
  return
  
}

const editDeviceDetails = (e,deviceId) => {
  e.stopPropagation()
  // TODO
}


  const onCloseModal = () => {
    setViewedDeviceId("")
    setModalOpen(false)
  }

  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={resources}
          columns={getDevicesTableColumns(handleShowBaremetalDeviceDetails,deleteDeviceById)}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>
      { 
        modalIsOpen && 
          <AppModal
            title="Device Details"
            open={modalIsOpen}
            handleClose={onCloseModal}
            Component={DeviceDetails}
            deviceId={viewedDeviceId}
          />
      }
      {
        actionConfirm && 
          <Stack
            component="form"
            id='deleteDevice'
            onSubmit={onDeleteDevice}
          >
            <PopUpDialog 
              DialogBody={GenericDialogBody}
              open={actionConfirm}
              handleClose={() => { setActionConfirm(false); setViewedDeviceId("") }}
              dialogTitle={'Delete Device?'} 
              dialogBtnTxt={'Delete'}
              formId={'deleteDevice'}
            />
          </Stack>
      }
    </>
  );
}
export default ShowAnyTable