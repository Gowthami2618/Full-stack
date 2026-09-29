import mongoose from 'mongoose';

const furnitureCatalogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please specify furniture item name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify furniture category'],
      enum: [
        'Sofa',
        'Bed',
        'Dining table',
        'Dining chair',
        'Coffee table',
        'TV unit',
        'Wardrobe',
        'Study table',
        'Chair',
        'Bookshelf',
        'Cabinet',
        'Outdoor furniture',
        'Other',
      ],
      default: 'Sofa',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    },
    dimensions: {
      type: String,
      default: 'Standard', // e.g. "84 x 36 x 32 in"
    },
    material: {
      type: String,
      default: 'Solid Wood & Fabric',
    },
    finish: {
      type: String,
      default: 'Natural Matte',
    },
    price: {
      type: Number,
      required: [true, 'Please specify price'],
      min: 0,
      default: 0,
    },
    supplier: {
      type: String,
      default: 'DesignSpace Studio Atelier',
    },
    description: {
      type: String,
      default: '',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

furnitureCatalogSchema.index({ category: 1 });
furnitureCatalogSchema.index({ name: 'text', description: 'text' });

const FurnitureCatalog = mongoose.model('FurnitureCatalog', furnitureCatalogSchema);
export default FurnitureCatalog;
