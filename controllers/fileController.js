const PatientData = require('../model/patientsData');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const cloudinary = require('../utilities/cloudSevice');
const multer = require('multer');
const streamifier = require('streamifier');

const storage = multer.memoryStorage();
const upload = multer({ storage });
exports.uploadUserPhoto = upload.single('photo');

exports.savePhotoToCloudinary = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a file', 400));
  }

  const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'user_photos',
          width: 200,
          height: 200,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            return reject(new AppError('unable to upload photo', 400));
          }
          resolve(result);
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  };

  const result = await uploadToCloudinary(req.file.buffer);

  const user = await PatientData.findByIdAndUpdate(
    req.user.id,
    { photo: result.secure_url },
    { new: true, runValidators: false }
  );

  res.status(200).json({
    status: 'success',
    message: 'Photo uploaded successfully',
    data: {
      photo: user.photo,
    },
  });
});

exports.uploadUserfile = upload.single('test');

exports.testResult = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('upload a your result', 400));
  }

  const uploadToCloudinary = (pdfFile) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'test_results',
          public_id: `test_${Date.now()}.pdf`,
          resource_type: 'raw',
        },
        (error, result) => {
          if (error) {
            return reject(new AppError('upload failed', 500));
          }
          resolve(result);
        }
      );
      streamifier.createReadStream(pdfFile).pipe(stream);
    });
  };
  const result = await uploadToCloudinary(req.file.buffer);
  //console.log(result);

  const user = await PatientData.findByIdAndUpdate(
    req.user.id,
    { userTestResult: result.secure_url },
    { new: true, runValidators: false }
  );
  res.status(200).json({
    status: 'success',
    message: 'file uploaded',
    data: {
      photo: user.userTestResult,
    },
  });
});
