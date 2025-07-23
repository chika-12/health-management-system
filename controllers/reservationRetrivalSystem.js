const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const Reservation = require('../model/reservation');
//const PatientData = require("../model/patientsData");
//const DoctorData = require("../model/doctorData");
const ApiFeatures = require('../utilities/apiFeatures');

exports.retriveReservation = (roleField) =>
  catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const reservation = await new ApiFeatures(
      Reservation.find({ [roleField]: userId }).lean(),
      req.query
    )
      .filtering()
      .sorting()
      .pagination()
      .fields().query;
    if (!reservation) {
      return next(new AppError('Reservation not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        result: reservation.length,
        reservation,
      },
    });
  });

exports.adminRetrival = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const feature = new ApiFeatures(Reservation.find().lean(), req.query)
    .filtering()
    .sorting()
    .fields()
    .pagination();

  const data = await feature.query;
  if (!data) {
    return next(new AppError('No data found', 404));
  }
  res.status(200).json({
    status: 'success',
    result: data.length,
    data,
  });
});
