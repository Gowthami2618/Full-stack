import mongoose from 'mongoose';

const materialCatalogSchema = new mongoose.Schema(
  {
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
        'Paint',
        'Tiles',
        'Marble',
        'Granite',
        'Quartz',
        'Wood',
        'Veneer',
        'Laminate',
        'Wallpaper',
        'Glass',
        'Metal',
        'Fabric',
        'Hardware',
        'Lighting',
        'Other',
      ],
      default: 'Flooring',
    },
    brand: {
      type: String,
      default: 'Premium Architectural Selection',
    },
    sku: {
      type: String,
      default: () => `MAT-${Date.now().toString().slice(-6)}`,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    color: {
      type: String,
      default: '#F8FAFC',
    },
    finish: {
      type: String,
      default: 'Matte Honed',
    },
    unit: {
      type: String,
      default: 'sq.ft', // sq.ft, liter, roll, piece, meter, box
    },
    price: {
      type: Number,
      required: [true, 'Please specify unit price'],
      min: 0,
      default: 0,
    },
    supplier: {
      type: String,
      default: 'StoneSource International',
    },
    description: {
      type: String,
      default: '',
    },
    specifications: {
      durabilityRating: { type: String, default: 'Heavy Residential / Commercial' },
      fireRating: { type: String, default: 'Class A' },
      moistureResistance: { type: String, default: 'High' },
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

materialCatalogSchema.index({ category: 1 });
materialCatalogSchema.index({ brand: 1 });
materialCatalogSchema.index({ name: 'text', description: 'text' });

const MaterialCatalog = mongoose.model('MaterialCatalog', materialCatalogSchema);
export default MaterialCatalog;
