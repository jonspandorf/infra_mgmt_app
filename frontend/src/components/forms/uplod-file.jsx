import { FormControlLabel, FormGroup, Switch, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { handleChange } from '../../lib/utilities';
import ModalTemplatePage from '../modal-template-page';
import DropdownMenu from './dropdown-menu';
import FileInput from './file-input';
import ImageRadioOptionsGroup from './image_radio_options';
import SingleTextField from './single-textfield';

const UploadFile = ({ values, setValues }) => {
    
    const options = [
        { name: 'Ubuntu 22 Jammy', value: 'http://ubuntu', id: 'k23jr' },
        { name: 'Rocky Linux 8.6', value: 'https://dldatac.linuxvmimages.com/VMware/R/rockylinux/8/Rocky_8.6_VMM.7z', id:'jkj3'},
        { name: 'Windows10', value: 'https://microsoft', id: '4lfk4' }
    ]
    
    const Components = {
        link: { Component: SingleTextField, props: { id:1, name: 'template_url', label: 'Paste URL', values, setValues } },
        file: { Component: FileInput, props: { id: 2, name: 'file', label: 'Upload file', values, setValues } },
        dropdown: { Component: DropdownMenu, props: { id: 3, name: 'template_url', label: 'Choose from list', options, values, setValues }}
    }

    const radioInfo = [
        { name: 'link', label: 'Paste URL' },
        { name: 'file', label: 'Upload File' },
        { name: 'dropdown', label: 'Choose from known external resources' }
    ]

    const [idx, setIdx] = useState(0)
    const [selectedOption, setSelectedOption ] = useState(Object.keys(Components)[idx])


    const handleSelection = (name) => {
       const newIdx =  Object.keys(Components).indexOf(name)
       setIdx(newIdx)
    }

    useEffect(() => {

        setSelectedOption(Object.keys(Components)[idx])

    }, [idx])



    return(
        <>
            <ImageRadioOptionsGroup  displayUploadTypeOption={(e) => handleSelection(e.target.value)} options={radioInfo} />
                <ModalTemplatePage 
                    RenderedComponent={Components[selectedOption].Component} 
                    {...Components[selectedOption].props} 
                />
        </>
    )
}

export default UploadFile