const multer = require('multer')
const fs = require('fs')
const { checkFileType } = require('./check_file_type')
const { os_files_path } = require('../utils/paths')



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path =  os_files_path
        fs.mkdirSync(path, { recursive: true })
        cb(null, path) 
    },
    filename: (req, file, cb) => {
        const uniqueName = file.originalname
        cb(null, uniqueName)
    }
})



const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
})


exports.upload = upload