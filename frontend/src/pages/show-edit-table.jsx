import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { useAuth } from "../context/auth"
import { deleteLabRange } from "../lib/api"
import { getTableColumns } from "../lib/utilities"

const ShowAndEditContentTable = ({ getResources }) => {

    const [ resources, setResources ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ updatePage, setUpdate ] = useState(true)
    const [ viewedEntryId, setViewedEntryId ] = useState("")
    const [  actionConfirm, setActionConfirm ] = useState(false)

    const { token } = useAuth()

    useEffect(() => {
        (
            async () => {
                try {
                    if (!token) return
                    if (updatePage) {
                        setUpdate(false)
                        setLoading(true)
                        const res = await getResources(token)
                        const parsed = res.data.map(item => { return { id: item._id, ...item }})
                        setResources(parsed)   
                        setLoading(false)
                    }
                } catch (err) {
                    return err
                }
            }
        )()
    }, [token, getResources, updatePage])

    //  columns should be produced dynamically
    const columns = [
        { field: '_id', headerName: 'ID', width: 130 },
        { field: 'name', headerName: 'Lab', width: 130 },
        { field: 'cidr', headerName: 'Cidr', width: 130},
        { field: 'firstAddress', headerName: 'First IP in static range', width: 130},
        { field: 'lastAddress', headerName: 'Last IP in static range', width: 130},
    ]


    const onShowEntryDetails = (e, id) => {
        e.stopPropagation()
        setViewedEntryId(id)
        // setModalOpen(true)    
    }

    const onDeleteById = async (e,id) => {
        e.stopPropagation()
        setActionConfirm(true)
        await deleteLabRange(id,token)
    }

    return (
        <>
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={resources}
                columns={getTableColumns(columns,onShowEntryDetails,onDeleteById)}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                loading={loading}
            />
        </div>
        </>
    )
}

export default ShowAndEditContentTable