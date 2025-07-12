const ComplaintReportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DoctorData',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PatientData',
    required: true,
  },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'in-review', 'resolved'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});
