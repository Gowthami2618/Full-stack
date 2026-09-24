import mongoose from 'mongoose';

const revisionSchema = new mongoose.Schema(
  {
    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide revision instructions/feedback'],
    },
    requestedChanges: [
      {
        type: String,
      },
    ],
    attachments: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
      default: 'OPEN',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

revisionSchema.index({ proposal: 1 });
revisionSchema.index({ project: 1 });
revisionSchema.index({ requestedBy: 1 });

const Revision = mongoose.model('Revision', revisionSchema);
export default Revision;
