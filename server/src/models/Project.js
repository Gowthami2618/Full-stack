import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    designer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    contractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    projectType: {
      type: String,
      required: [true, 'Please specify project type'],
      enum: [
        'Living Room',
        'Bedroom',
        'Kitchen',
        'Bathroom',
        'Office',
        'Full Home',
        'Commercial',
        'Other',
      ],
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: [
        'Apartment',
        'Villa',
        'Independent House',
        'Office',
        'Studio',
        'Commercial',
      ],
    },
    location: {
      type: String,
      required: [true, 'Please specify location'],
    },
    totalBudget: {
      type: Number,
      required: [true, 'Please specify total budget'],
      min: [0, 'Budget cannot be negative'],
    },
    spentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Spent amount cannot be negative'],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expectedEndDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        'DRAFT',
        'REQUESTED',
        'DESIGNING',
        'PROPOSAL_SENT',
        'APPROVED',
        'IN_PROGRESS',
        'ON_HOLD',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'REQUESTED',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    requirements: {
      type: String,
      default: '',
    },
    preferredStyle: {
      type: String,
      enum: [
        'Modern',
        'Minimalist',
        'Contemporary',
        'Traditional',
        'Luxury',
        'Scandinavian',
        'Industrial',
        'Bohemian',
      ],
      default: 'Modern',
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for high performance querying
projectSchema.index({ status: 1 });
projectSchema.index({ client: 1 });
projectSchema.index({ designer: 1 });
projectSchema.index({ contractor: 1 });
projectSchema.index({ projectType: 1 });
projectSchema.index({ createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
