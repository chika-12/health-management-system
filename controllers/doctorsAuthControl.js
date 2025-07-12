const DoctorData = require('../model/doctorData');
const authentication = require('./authentication');
const factory = require('./factoryController');

exports.signup = authentication.signUpControl(DoctorData);
exports.login = authentication.loginControl(DoctorData);
exports.protect = authentication.protectControl(DoctorData);

// Doctors Controllers
exports.retriveAllDoctors = factory.retriveAll(DoctorData);
exports.profile = factory.profile(DoctorData);
exports.getDoctorById = factory.retriveById(DoctorData);
exports.delete = factory.delete(DoctorData);
exports.restoreDeleted = factory.reactivate(DoctorData);
exports.register = factory.register(DoctorData);
