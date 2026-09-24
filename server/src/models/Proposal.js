import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    designer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a proposal title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide proposal description and concept'],
    },
    designStyle: {
      type: String,
      required: true,
    },
    estimatedCost: {
      type: Number,
      required: [true, 'Please provide estimated cost'],
      min: [0, 'Cost cannot be negative'],
    },
    estimatedDuration: {
      type: String,
      required: [true, 'Please provide estimated duration (e.g. 6 weeks)'],
    },
    materials: [
      {
        name: { type: String, required: true },
        estimatedCost: { type: Number, default: 0 },
        notes: { type: String, default: '' },
      },
    ],
    designImages: [
      {
        type: String,
      },
    ],
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'DRAFT',
        'SENT',
        'UNDER_REVIEW',
        'APPROVED',
        'REJECTED',
        'REVISION_REQUESTED',
      ],
      default: 'DRAFT',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

proposalSchema.index({ project: 1 });
proposalSchema.index({ designer: 1 });
proposalSchema.index({ status: 1 });

const Proposal = mongoose.model('Proposal', proposalSchema);
export default Proposal;
