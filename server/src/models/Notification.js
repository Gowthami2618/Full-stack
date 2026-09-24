import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'NEW_PROJECT',
        'DESIGNER_ASSIGNED',
        'CONTRACTOR_ASSIGNED',
        'PROPOSAL_SUBMITTED',
        'PROPOSAL_APPROVED',
        'PROPOSAL_REJECTED',
        'REVISION_REQUESTED',
        'REVISION_RESOLVED',
        'TASK_ASSIGNED',
        'TASK_COMPLETED',
        'TASK_COMMENT',
        'MILESTONE_UPDATED',
        'MATERIAL_STATUS_CHANGED',
        'USER_VERIFIED',
        'SYSTEM',
      ],
      default: 'SYSTEM',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
