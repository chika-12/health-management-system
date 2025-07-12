const DoctorFlagSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  flaggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  reason: { type: String },
  status: {
    type: String,
    enum: ['active', 'suspended', 'cleared'],
    default: 'active',
  },
  actionTaken: { type: String }, // e.g., "Suspended for 30 days"
  dateFlagged: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});
