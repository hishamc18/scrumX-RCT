const multer = require('multer')
const cloudinary = require('../config/cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'user',
        allowed_formats: ['jpg','png','jpeg','webp','avif']
    },
})

const upload = multer({storage})

module.exports = upload