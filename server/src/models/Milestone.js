import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide milestone title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide milestone due date'],
    },
    status: {
      type: String,
      enum: ['UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'],
      default: 'UPCOMING',
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

milestoneSchema.index({ project: 1 });
milestoneSchema.index({ dueDate: 1 });
milestoneSchema.index({ status: 1 });

const Milestone = mongoose.model('Milestone', milestoneSchema);
export default Milestone;
