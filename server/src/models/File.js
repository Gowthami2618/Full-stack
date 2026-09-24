import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: [
        'Room Image',
        'Design Image',
        'Floor Plan',
        'Quotation',
        'Document',
        'Progress Photo',
        'Other',
      ],
      default: 'Document',
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

fileSchema.index({ project: 1 });
fileSchema.index({ uploadedBy: 1 });
fileSchema.index({ fileType: 1 });

const File = mongoose.model('File', fileSchema);
export default File;
