const PatientData = require('../model/patientsData');
const factory = require('./factoryController');

exports.retriveAllPatientsData = factory.retriveAll(PatientData);

exports.userProfile = factory.profile(PatientData);

exports.registerUser = factory.register(PatientData);

exports.retriveUserById = factory.retriveById(PatientData);

exports.delete = factory.delete(PatientData);

exports.reactivateUser = factory.reactivate(PatientData);
