const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const Reservation = require('../model/reservation');
const PatientData = require('../model/patientsData');
const DoctorData = require('../model/doctorData');
const ApiFeatures = require('../utilities/apiFeatures');
const DoctorAvailability = require('../model/doctorsAvailability');
const { model } = require('mongoose');

const checkAvailableDoc = async (model, doctorId, date) => {
  const availableDoc = await model.findOne({ doctor: doctorId, date });
  if (!availableDoc) {
    return false;
  }
  return availableDoc;
};

const checkAvailableTime = (availableDoc, time) => {
  const isAvailable = availableDoc.checkAvailableTime(time);
  return isAvailable;
};

exports.findSpecialiseDoctor = catchAsync(async (req, res, next) => {
  const doctors = await new ApiFeatures(DoctorData.find(), req.query)
    .filtering()
    .sorting()
    .fields()
    .pagination().query;
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
  const { doctor, date, timeSlot, reasonForVisit } = req.body;
  const isAvailble = await checkAvailableDoc(DoctorAvailability, doctor, date);
  if (!isAvailble) {
    return next(new AppError('Doctor not available', 400));
  }
  const availableTime = checkAvailableTime(isAvailble, timeSlot);
  if (!availableTime) {
    return next(
      new AppError('Doctor not available at this time choose another', 400)
    );
  }
  const reservation = await Reservation.create({
    doctor: doctor,
    patient: patientId,
    date,
    timeSlot,
    reasonForVisit,
  });
  isAvailble.removeTimeSlot(timeSlot);
  await isAvailble.save();
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
  console.log(reservation);
  if (!reservation || reservation.doctor._id.toString() != doctorId) {
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
