const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const DoctorAvailability = require('../model/doctorsAvailability');

exports.setDoctorsAvailability = catchAsync(async (req, res, next) => {
  const doctorId = req.user.id;
  const { date, consultationDuration, availableSlots } = req.body;
  if (consultationDuration < 45) {
    return next(new AppError('Minimum duration is 45 minutes', 400));
  }
  const updated = await DoctorAvailability.findOneAndUpdate(
    { doctor: doctorId, date },
    { consultationDuration, availableSlots },
    { upsert: true, new: true }
  );
  res.status(200).json({
    status: 'success',
    data: { updated },
  });
});
