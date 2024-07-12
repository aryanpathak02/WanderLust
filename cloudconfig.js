const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'WonderLust_DEV',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

module.exports = { cloudinary, storage };
