import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please specify material name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify material category'],
      enum: [
        'Flooring',
        'Furniture',
        'Lighting',
        'Paint',
        'Kitchen',
        'Bathroom',
        'Electrical',
        'Decor',
        'Other',
      ],
    },
    supplier: {
      type: String,
      default: '',
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      default: 'units', // sqft, units, meters, pieces, kg, etc.
    },
    estimatedCost: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    actualCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['PLANNED', 'ORDERED', 'DELIVERED', 'INSTALLED'],
      default: 'PLANNED',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

materialSchema.index({ project: 1 });
materialSchema.index({ category: 1 });
materialSchema.index({ status: 1 });

const Material = mongoose.model('Material', materialSchema);
export default Material;
