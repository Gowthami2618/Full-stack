import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    action: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      required: true,
      enum: [
        'AUTH',
        'USER',
        'PROJECT',
        'PROPOSAL',
        'REVISION',
        'TASK',
        'MATERIAL',
        'EXPENSE',
        'MILESTONE',
        'FILE',
        'SYSTEM',
      ],
    },
    entityId: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ entityType: 1 });
auditLogSchema.index({ user: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
