const fileController = require('./fileController');
const PatientData = require('../model/patientsData');
const DoctorsData = require('../model/doctorData');

exports.patientUpdateprofilePix =
  fileController.savePhotoToCloudinary(PatientData);

exports.doctorsPicxUpdate = fileController.savePhotoToCloudinary(DoctorsData);
