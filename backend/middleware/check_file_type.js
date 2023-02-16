const path = require('path')

function checkFileType(file, cb){
  console.log('checking file type')
    // Allowed ext
    const filetypes = /rar|tar|tgz|tar.gz|ova|ovf|img/;

    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    // const mimetype = filetypes.test(file.mimetype);
  
    if (extname){
      return cb(null,true);
    } else {
      throw new Error('Invalid file!')
    }
  }

  exports.checkFileType = checkFileType