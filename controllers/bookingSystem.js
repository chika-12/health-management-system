const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const Reservation = require('../model/reservation');
const PatientData = require('../model/patientsData');
const DoctorData = require('../model/doctorData');

exports.findSpecialiseDoctor = catchAsync(async (req, res, next) => {
  const { specialization, languageSpoken } = req.query;
  const filter = {};
  if (specialization) {
    filter.specialization = specialization;
  }
  if (languageSpoken) {
    filter.languageSpoken = languageSpoken;
  }
  const doctors = await DoctorData.find(filter);
  if (doctors.length === 0) {
    return next(new AppError('Oops! no doctor found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      result: doctors.length,
      doctors,
    },
  });
});
exports.bookDoctor = catchAsync(async (req, res, next) => {
  const patientId = req.user.id;
  const patient = await PatientData.findById(patientId);
  const { doctor, date, timeSlot, reasonForVisit } = req.body;
  const checkDoctorsAvailability = await Reservation.find({
    doctor: doctor,
    date,
    timeSlot,
    status: { $ne: 'cancelled' },
  });
  if (checkDoctorsAvailability.length != 0) {
    return next(
      new AppError(
        'This time slot is already booked. Please choose another',
        400
      )
    );
  }
  const reservation = await Reservation.create({
    doctor: doctor,
    patient: patientId,
    date,
    timeSlot,
    reasonForVisit,
  });
  res.status(200).json({
    status: 'success',
    data: {
      reservation,
    },
  });
});
exports.comfirmBooking = catchAsync(async (req, res, next) => {
  const state = req.body.status;
  const doctorId = req.user.id;
  const reservation = await Reservation.findById(req.body.id);
  if (!reservation || reservation.doctor.toString() != doctorId) {
    return next(new AppError('You do not have any pending reservation', 404));
  }
  if (reservation.status !== 'pending') {
    return next(new AppError('Reservation is not pending', 400));
  }

  reservation.status = state;
  await reservation.save({ validateBeforeSave: false });
  res.status(200).json({
    status: 'success',
    message: `request ${state}`,
  });
});
