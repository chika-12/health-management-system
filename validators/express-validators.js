const { body } = require('express-validator');
exports.articleValidator = [
  body('title').notEmpty().withMessage('Title required'),
  body('body').notEmpty().withMessage('message body required'),
  //body('postedBy').notEmpty().withMessage("Poster's name required"),
];

exports.videoValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('description is required'),
  //body('video').notEmpty().withMessage('video required'),
];

exports.patientsValidator = [
  body('name').notEmpty().withMessage('Name required'),
  body('email').notEmpty().withMessage('Email required'),
  body('password').notEmpty().withMessage('password required'),
  body('passwordConfirm').notEmpty().withMessage('confrim your password'),
  body('phone').notEmpty().withMessage('phone number required'),
  body('dateOfBirth').notEmpty().withMessage('date of birth required'),
];

exports.loginDetails = [
  body('email').notEmpty().withMessage('Email required'),
  body('password').notEmpty().withMessage('password required'),
];

exports.doctorValidator = [
  body('name').notEmpty().withMessage('Name is required'),

  body('email').isEmail().withMessage('Provide a valid email'),

  body('password')
    .isLength({ min: 8, max: 50 })
    .withMessage('Password must be between 8 and 50 characters'),

  body('passwordConfirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),

  body('phone').notEmpty().withMessage('Phone number is required'),

  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),

  body('specialization')
    .isIn([
      'general',
      'cardiologist',
      'dermatologist',
      'pediatrician',
      'neurologist',
      'psychiatrist',
      'gynecologist',
      'orthopedic',
      'dentist',
      'other',
    ])
    .withMessage('Invalid specialization'),

  body('licenseNumber').notEmpty().withMessage('License number is required'),

  body('yearsOfExperience')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Years of experience must be a non-negative number'),

  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),

  body('availability')
    .optional()
    .isBoolean()
    .withMessage('Availability must be true or false'),
];

exports.reactivateUser = [
  body('email').notEmpty().withMessage('Email required')
]
