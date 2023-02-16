import { TableContainer, Table, Paper, TableHead, TableRow, TableCell, TableBody } from "@mui/material"

const CustomResourceTable = ({ records }) => {

    return (
            <>
            { 
                records.length ? 

                <TableContainer sx={{ height: '50vh', pt: 4, mt: 4, display: 'flex', alignItems: 'start'}} component={Paper}>
                <Table sx={{ minWidth: 200 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        {Object.keys(records[0]).map((field,idx)  => (
                            <TableCell key={idx} align="right">{field}</TableCell>
                        ))}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                        records.map((record,idx) => (
                            <TableRow
                                key={idx}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            {
                                Object.values(record).map((entry, idx) => (
                                    
                                    <TableCell align="right" key={idx}>{entry}</TableCell>
                                ))
                            }
                            </TableRow>))
                    }
                    </TableBody>
                </Table>
                </TableContainer>
                
                :

                <div>No resources found!</div>
            }
            
            </>
    )

}

export default CustomResourceTable