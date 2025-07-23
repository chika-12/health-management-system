const streamifier = require('streamifier');
const cloudinary = require('../utilities/cloudSevice');

const uploadToCloudinary = (
  fileBuffer,
  folder,
  type,
  width = null,
  height = null
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: type,
        width,
        height,
      },
      (error, result) => {
        if (error) {
          console.error('🔥 Cloudinary Upload Error:', error);
          return reject(new AppError(error.message || 'Upload failed', 400));
        }
        resolve(result);
      }
    );

    // THIS IS IMPORTANT: pipe the buffer correctly
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;
