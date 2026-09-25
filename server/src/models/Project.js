import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    dimensions: {
      type: String,
      default: '',
    },
    area: {
      type: Number,
      default: 0,
    },
    budget: {
      type: Number,
      default: 0,
    },
    spent: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    designStatus: {
      type: String,
      enum: ['Draft', 'Submitted', 'Client Review', 'Approved', 'Changes Requested'],
      default: 'Draft',
    },
    executionStatus: {
      type: String,
      enum: ['Pending', 'In Progress', 'Blocked', 'Completed'],
      default: 'Pending',
    },
    style: {
      type: String,
      default: 'Modern',
    },
    colorPalette: {
      primary: { type: String, default: '#F8FAFC' },
      secondary: { type: String, default: '#94A3B8' },
      accent: { type: String, default: '#38BDF8' },
      ceiling: { type: String, default: '#FFFFFF' },
      flooring: { type: String, default: '#78350F' },
    },
    furniture: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        estimatedCost: { type: Number, default: 0 },
        vendor: { type: String, default: '' },
        photo: { type: String, default: '' },
        notes: { type: String, default: '' },
        status: {
          type: String,
          enum: ['Draft', 'Selected', 'Ordered', 'Delivered', 'Installed'],
          default: 'Selected',
        },
      },
    ],
    materials: [
      {
        name: { type: String, required: true },
        category: {
          type: String,
          enum: [
            'Flooring',
            'Tiles',
            'Paint',
            'Wood',
            'Marble',
            'Granite',
            'Countertop',
            'Wallpaper',
            'Fabric',
            'Hardware',
            'Lighting',
            'Other',
          ],
          default: 'Other',
        },
        price: { type: Number, default: 0 },
        supplier: { type: String, default: '' },
        color: { type: String, default: '' },
        finish: { type: String, default: '' },
        photo: { type: String, default: '' },
        notes: { type: String, default: '' },
        quantityRequired: { type: String, default: '' },
        quantityDelivered: { type: String, default: '' },
        status: {
          type: String,
          enum: ['Specified', 'Ordered', 'Delivered', 'Installed'],
          default: 'Specified',
        },
      },
    ],
    kitchenDetails: {
      layout: {
        type: String,
        enum: ['Straight', 'L-shaped', 'U-shaped', 'Parallel', 'Island', 'Peninsula', ''],
        default: '',
      },
      components: [
        {
          name: { type: String, required: true },
          specifiedMaterial: { type: String, default: '' },
          cost: { type: Number, default: 0 },
          status: { type: String, default: 'Planned' },
        },
      ],
    },
    bathroomDetails: {
      fixtures: [
        {
          name: { type: String, required: true },
          brand: { type: String, default: '' },
          cost: { type: Number, default: 0 },
          status: { type: String, default: 'Planned' },
        },
      ],
    },
    gardenDetails: {
      features: [
        {
          name: { type: String, required: true },
          description: { type: String, default: '' },
          cost: { type: Number, default: 0 },
          status: { type: String, default: 'Planned' },
        },
      ],
    },
    exteriorDetails: {
      features: [
        {
          name: { type: String, required: true },
          description: { type: String, default: '' },
          cost: { type: Number, default: 0 },
          status: { type: String, default: 'Planned' },
        },
      ],
    },
    photos: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: '' },
        type: { type: String, enum: ['before', 'after', 'progress', 'concept'], default: 'concept' },
        date: { type: Date, default: Date.now },
      },
    ],
    designerNotes: {
      type: String,
      default: '',
    },
    clientFeedback: {
      type: String,
      default: '',
    },
    revisions: [
      {
        revisionNumber: { type: Number, default: 1 },
        requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comments: { type: String, default: '' },
        date: { type: Date, default: Date.now },
        status: { type: String, default: 'Pending' },
        designerResponse: { type: String, default: '' },
      },
    ],
    sitePhotos: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: '' },
        stage: { type: String, enum: ['Before', 'Current Progress', 'Completed'], default: 'Current Progress' },
        progressPercent: { type: Number, default: 0 },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

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
      default: 'Full Home',
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: [
        'Apartment',
        'Villa',
        'Independent House',
        'Duplex',
        'Studio',
        'Office',
        'Commercial',
        'Other',
      ],
      default: 'Villa',
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
        'Rustic',
        'Japandi',
        'Indian Contemporary',
        'Bohemian',
        'Custom',
      ],
      default: 'Modern',
    },
    images: [
      {
        type: String,
      },
    ],
    // Rich House & Property Specifications
    propertyDetails: {
      city: { type: String, default: '' },
      floors: { type: Number, default: 1 },
      totalArea: { type: Number, default: 0 },
      bedrooms: { type: Number, default: 3 },
      bathrooms: { type: Number, default: 2 },
      constructionStatus: {
        type: String,
        enum: [
          'New Construction',
          'Ready to Move',
          'Under Renovation',
          'Bare Shell',
          'Planning',
        ],
        default: 'Ready to Move',
      },
    },
    // Granular Budget Allocation
    budgetAllocation: {
      totalBudget: { type: Number, default: 0 },
      interior: { type: Number, default: 0 },
      furniture: { type: Number, default: 0 },
      kitchen: { type: Number, default: 0 },
      bathrooms: { type: Number, default: 0 },
      electrical: { type: Number, default: 0 },
      flooring: { type: Number, default: 0 },
      paint: { type: Number, default: 0 },
      garden: { type: Number, default: 0 },
      exterior: { type: Number, default: 0 },
      contingency: { type: Number, default: 0 },
    },
    // House & Site Photo Gallery
    housePhotos: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: '' },
        roomType: { type: String, default: 'Exterior' },
        tag: {
          type: String,
          enum: ['before', 'after', 'current', 'inspiration', 'site_progress'],
          default: 'current',
        },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    // Independent Rooms & Spaces
    rooms: [roomSchema],
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

