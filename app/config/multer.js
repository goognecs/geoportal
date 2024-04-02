const multer = require('multer')
const {extname} = require('path')
const { existsSync, mkdirSync } = require('fs')

const uploadDirectory = 'public/uploads';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create the destination folder if it doesn't exist
    if (!existsSync(uploadDirectory)) {
      mkdirSync(uploadDirectory);
    }

    cb(null, uploadDirectory)

  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname))
  },
})

function fileFilter (req, file, callback) {
  var ext = extname(file.originalname);
  if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return {error: 'Only images are allowed'}
  }
  callback(null, true)
}

module.exports = multer({ storage: storage, limits: {fileSize: 4 * 1024 * 1024 }, fileFilter })
