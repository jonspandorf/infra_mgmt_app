import Form from 'react-bootstrap/Form';
import { handleChange } from '../../lib/utilities';

const FileInput = ({ values, setValues }) => {

    return (
        <>
        <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload OVA file</Form.Label>
            <Form.Control type="file" name="file" onChange={(e) => handleChange(e,values,setValues)} />
        </Form.Group>
        </>
    )
}

export default FileInput