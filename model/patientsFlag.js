const PatientFlagSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  reason: { type: String, required: true },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  actionTaken: { type: String }, // e.g. "Warned", "Suspended 7 days"
  dateFlagged: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});
