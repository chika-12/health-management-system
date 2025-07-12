const PatientData = require('../model/patientsData');
const authentication = require('./authentication');

exports.signup = authentication.signUpControl(PatientData);
exports.login = authentication.loginControl(PatientData);
exports.protect = authentication.protectControl(PatientData);
