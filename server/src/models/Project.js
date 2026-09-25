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
    floor: {
      type: String,
      enum: ['Ground Floor', 'First Floor', 'Second Floor', 'Basement', 'Terrace', 'Outdoor', 'General'],
      default: 'Ground Floor',
    },
    length: { type: Number, default: 15 },
    width: { type: Number, default: 12 },
    height: { type: Number, default: 10 },
    existingCondition: {
      type: String,
      enum: ['Bare Shell', 'Fair', 'Requires Full Renovation', 'Good'],
      default: 'Bare Shell',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'High',
    },
    lightingPlan: [
      {
        fixture: { type: String, required: true },
        type: { type: String, enum: ['Ambient', 'Task', 'Accent', 'Decorative', 'Landscape'], default: 'Ambient' },
        quantity: { type: Number, default: 1 },
        wattage: { type: String, default: '12W' },
        colorTemp: { type: String, default: '3000K Warm White' },
        location: { type: String, default: 'Ceiling' },
        estimatedCost: { type: Number, default: 0 },
      },
    ],
    electricalPlan: [
      {
        pointType: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        location: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
    ],
    moodboard: [
      {
        imageUrl: { type: String, required: true },
        title: { type: String, default: '' },
        tags: [{ type: String }],
        notes: { type: String, default: '' },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        likes: { type: Number, default: 0 },
        comments: [
          {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
          },
        ],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    aiProposal: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
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
        'Modern Luxury',
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
    // Client Lifestyle & Design Brief
    designBrief: {
      familySize: { type: Number, default: 4 },
      children: { type: Boolean, default: false },
      elderly: { type: Boolean, default: false },
      pets: { type: Boolean, default: false },
      workFromHome: { type: Boolean, default: true },
      entertainmentNeeds: { type: String, default: 'Living & Dining gathering focus' },
      storageNeeds: { type: String, default: 'Maximum concealed storage' },
      colorScheme: {
        type: String,
        enum: ['Warm', 'Cool', 'Neutral', 'Earthy', 'Monochrome', 'Custom'],
        default: 'Warm',
      },
      customColors: [{ type: String }],
      functionalRequirements: [{ type: String }],
      specialInstructions: { type: String, default: '' },
    },
    // Project Quotations
    quotations: [
      {
        quoteNumber: { type: String, default: () => 'QT-' + Date.now().toString().slice(-6) },
        title: { type: String, default: 'Interior Design & Fit-out Estimate' },
        createdAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['Draft', 'Sent', 'Submitted', 'Approved', 'Changes Requested'],
          default: 'Draft',
        },
        items: [
          {
            category: { type: String, default: 'Civil & Interior' },
            description: { type: String, required: true },
            quantity: { type: Number, default: 1 },
            unit: { type: String, default: 'Lump Sum' },
            unitPrice: { type: Number, default: 0 },
            discount: { type: Number, default: 0 },
            taxPercent: { type: Number, default: 18 },
            total: { type: Number, default: 0 },
          },
        ],
        subtotal: { type: Number, default: 0 },
        discountTotal: { type: Number, default: 0 },
        taxTotal: { type: Number, default: 0 },
        grandTotal: { type: Number, default: 0 },
        clientNotes: { type: String, default: '' },
        approvedAt: { type: Date, default: null },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    // Central Approval Audit Register
    approvals: [
      {
        type: {
          type: String,
          enum: ['Design', 'Design Brief', 'Material', 'Furniture', 'Color', 'Quotation', 'Final Handover'],
          required: true,
        },
        entityId: { type: String, default: '' },
        entityTitle: { type: String, required: true },
        requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: {
          type: String,
          enum: ['Pending', 'Approved', 'Changes Requested', 'Rejected'],
          default: 'Pending',
        },
        version: { type: Number, default: 1 },
        comment: { type: String, default: '' },
        decisionDate: { type: Date, default: Date.now },
      },
    ],
    // Site Surveys & Measurements Log
    siteVisits: [
      {
        visitDate: { type: Date, default: Date.now },
        inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        measurements: { type: String, default: '' },
        existingCondition: { type: String, default: '' },
        electricalCondition: { type: String, default: 'Normal wiring requiring modification' },
        plumbingCondition: { type: String, default: 'Standard builder points' },
        wallCondition: { type: String, default: 'Plastered with primer' },
        floorCondition: { type: String, default: 'Bare screed ready for tiling' },
        ceilingCondition: { type: String, default: 'RCC slab' },
        constraints: { type: String, default: '' },
        notes: { type: String, default: '' },
        photos: [{ type: String }],
      },
    ],
    // Issue Ticket Management
    issues: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        room: { type: String, default: 'General' },
        priority: {
          type: String,
          enum: ['High', 'Medium', 'Low', 'Critical'],
          default: 'Medium',
        },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        photos: [{ type: String }],
        status: {
          type: String,
          enum: ['Open', 'In Review', 'In Progress', 'Resolved', 'Closed'],
          default: 'Open',
        },
        resolution: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now },
        resolvedAt: { type: Date, default: null },
      },
    ],
    // Snag / Punch List
    snags: [
      {
        description: { type: String, required: true },
        room: { type: String, default: 'General' },
        priority: {
          type: String,
          enum: ['High', 'Medium', 'Low'],
          default: 'Medium',
        },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        dueDate: { type: Date },
        status: {
          type: String,
          enum: ['Open', 'In Progress', 'Resolved', 'Completed', 'Closed'],
          default: 'Open',
        },
        photo: { type: String, default: '' },
        verifiedAt: { type: Date, default: null },
      },
    ],
    // Procurement Register
    procurement: [
      {
        itemName: { type: String, required: true },
        category: { type: String, default: 'Materials' },
        room: { type: String, default: 'General' },
        supplier: { type: String, default: '' },
        orderDate: { type: Date, default: Date.now },
        expectedDelivery: { type: Date },
        actualDelivery: { type: Date },
        quantityRequired: { type: String, default: '1' },
        quantityDelivered: { type: String, default: '0' },
        unitCost: { type: Number, default: 0 },
        totalCost: { type: Number, default: 0 },
        status: {
          type: String,
          enum: [
            'Required',
            'Quoted',
            'Approved',
            'Ordered',
            'Partially Delivered',
            'Delivered',
            'Installed',
          ],
          default: 'Required',
        },
      },
    ],
    // Final Project Handover Details
    handoverDetails: {
      isHandoverCompleted: { type: Boolean, default: false },
      handoverDate: { type: Date, default: null },
      approvedByClient: { type: Boolean, default: false },
      finalInspectionDate: { type: Date, default: null },
      inspectionNotes: { type: String, default: '' },
      clientSignoffNotes: { type: String, default: '' },
    },
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

