import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify expense category'],
      enum: [
        'Furniture',
        'Materials',
        'Labor',
        'Design',
        'Electrical',
        'Plumbing',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please provide expense description'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide expense amount'],
      min: [0, 'Amount cannot be negative'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receipt: {
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

expenseSchema.index({ project: 1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
