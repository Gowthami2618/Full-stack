import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Proposal from '../models/Proposal.js';
import Revision from '../models/Revision.js';
import Task from '../models/Task.js';
import Material from '../models/Material.js';
import Expense from '../models/Expense.js';
import Milestone from '../models/Milestone.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/designspace';
    if (process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD) {
      if (mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
        mongoUri = mongoUri
          .replace('<username>', encodeURIComponent(process.env.MONGODB_USERNAME))
          .replace('<password>', encodeURIComponent(process.env.MONGODB_PASSWORD));
      }
    }
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');
  } catch (error) {
    console.error(`[Seed DB Connection Failed]: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing previous data...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Proposal.deleteMany({});
    await Revision.deleteMany({});
    await Task.deleteMany({});
    await Material.deleteMany({});
    await Expense.deleteMany({});
    await Milestone.deleteMany({});
    await Notification.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('[Seed] Creating Users...');
    const demoPassword = 'Password123!';

    // Admin
    const admin = await User.create({
      name: 'Victoria Sterling',
      email: 'admin@designspace.com',
      phone: '+1 (555) 019-2831',
      password: demoPassword,
      role: 'ADMIN',
      bio: 'DesignSpace Platform Principal Director & Design Governance Lead.',
      location: 'New York, NY',
      isActive: true,
      isVerified: true,
    });

    // Clients
    const client1 = await User.create({
      name: 'Eleanor Vance',
      email: 'client@designspace.com',
      phone: '+1 (555) 392-8192',
      password: demoPassword,
      role: 'CLIENT',
      bio: 'Art curator renovating a mid-century modern penthouse in Tribeca.',
      location: 'Manhattan, New York',
      isActive: true,
      isVerified: true,
    });

    const client2 = await User.create({
      name: 'Julian Mercer',
      email: 'julian.mercer@luxhome.io',
      phone: '+1 (555) 442-9901',
      password: demoPassword,
      role: 'CLIENT',
      bio: 'Tech entrepreneur looking for Scandinavian luxury interior overhaul.',
      location: 'San Francisco, CA',
      isActive: true,
      isVerified: true,
    });

    // Designers
    const designer1 = await User.create({
      name: 'Aurelia Dupont',
      email: 'designer@designspace.com',
      phone: '+1 (555) 881-2234',
      password: demoPassword,
      role: 'DESIGNER',
      bio: 'Award-winning architectural interior designer specializing in Parisian Minimalist & Contemporary spaces.',
      location: 'Paris & New York',
      isActive: true,
      isVerified: true,
    });

    const designer2 = await User.create({
      name: 'Marcus Thorne',
      email: 'marcus.thorne@studio.com',
      phone: '+1 (555) 773-4512',
      password: demoPassword,
      role: 'DESIGNER',
      bio: 'Spatial strategist and lighting designer with 12+ years experience in high-end residential.',
      location: 'Los Angeles, CA',
      isActive: true,
      isVerified: true,
    });

    // Contractors
    const contractor1 = await User.create({
      name: 'Harrison Sterling Build Co.',
      email: 'contractor@designspace.com',
      phone: '+1 (555) 902-1144',
      password: demoPassword,
      role: 'CONTRACTOR',
      bio: 'Master craftsman & general contracting firm specializing in bespoke joinery and structural fit-outs.',
      location: 'Brooklyn, NY',
      isActive: true,
      isVerified: true,
    });

    const contractor2 = await User.create({
      name: 'Apex Structural Fitouts',
      email: 'apex.builds@craftfit.io',
      phone: '+1 (555) 303-7722',
      password: demoPassword,
      role: 'CONTRACTOR',
      bio: 'Licensed premium contracting and smart-home integration specialists.',
      location: 'San Francisco, CA',
      isActive: true,
      isVerified: true,
    });

    console.log('[Seed] Creating Projects...');
    // Project 1: Flagship Modern Dream Villa
    const project1 = await Project.create({
      title: 'Modern Dream Villa',
      description:
        'A comprehensive luxury interior design and turnkey fit-out for a bespoke 4,800 sq.ft contemporary duplex villa. Features double-height living room glazing, Italian marble flooring, bespoke walnut millwork, concealed cove lighting, and integrated landscape terrace gardens.',
      client: client1._id,
      designer: designer1._id,
      contractor: contractor1._id,
      projectType: 'Full Home',
      propertyType: 'Villa',
      location: '18 Palm Crest Boulevard, Beverly Hills / Mumbai Coastal',
      totalBudget: 250000,
      spentAmount: 142000,
      startDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      expectedEndDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
      status: 'IN_PROGRESS',
      progress: 68,
      requirements:
        'Open layout flow, hidden acoustic ceiling panels, double-height travertine fireplace, textured lime wash walls, custom walnut library with rolling ladder, smart DALI lighting integration.',
      preferredStyle: 'Modern Luxury',
      propertyDetails: {
        propertyName: 'Modern Dream Villa Estate',
        propertyType: 'Villa',
        address: '18 Palm Crest Boulevard',
        city: 'Mumbai / Los Angeles',
        state: 'Maharashtra / California',
        country: 'India / USA',
        totalArea: 5200,
        builtUpArea: 4800,
        floors: 2,
        bedrooms: 4,
        bathrooms: 4,
        parking: '2 Covered Slots',
        garden: 'Private Landscaped Lawn',
        balcony: 'Master Suite Balcony',
        terrace: 'First Floor Open Terrace Garden',
        possessionDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        expectedCompletionDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
      },
      designBrief: {
        lifestyle: {
          familySize: 'Family of 4 (Parents & 2 Kids)',
          children: true,
          elderlyMembers: false,
          pets: true,
          workFromHome: true,
          entertainmentNeeds: 'Frequent weekend hosting with 8-seater dining',
          storageNeeds: 'High capacity floor-to-ceiling concealed joinery',
        },
        stylePreference: 'Modern Luxury',
        colorPalettePreference: 'Warm Neutral with Walnut & Brushed Brass accents',
        functionalRequirements: [
          'Large Island Kitchen with Pantry',
          'Walk-in Wardrobe in Master Suite',
          'Acoustic TV Wall & Fluted Travertine Paneling',
          'Dedicated Home Office & Study Area',
          'Tranquil Prayer Room / Meditation Corner',
          'Smart Home Lighting & Automated Motorized Curtains',
          'Outdoor Terrace Garden Seating & Pergola',
        ],
        freeTextNotes:
          'Client emphasizes clean seamless flush lines, shadow gap skirting, natural light optimization, and durable anti-scratch materials for pet safety.',
      },
      budgetAllocation: {
        totalBudget: 250000,
        interior: 110000,
        furniture: 45000,
        kitchen: 35000,
        bathrooms: 20000,
        electrical: 12000,
        flooring: 15000,
        paint: 6000,
        garden: 7000,
        exterior: 0,
        contingency: 10000,
      },
      housePhotos: [
        {
          url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
          caption: 'Living Room Bare Shell Before Work',
          roomType: 'Living Room',
          tag: 'before',
        },
        {
          url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
          caption: 'Living Room Architectural Concept Proposal',
          roomType: 'Living Room',
          tag: 'after',
        },
      ],
      rooms: [
        // GROUND FLOOR
        {
          name: 'Entrance Foyer',
          category: 'Entrance',
          floor: 'Ground Floor',
          dimensions: '10 x 8 ft',
          length: 10,
          width: 8,
          height: 11,
          area: 80,
          budget: 8000,
          spent: 6200,
          progress: 85,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Modern Luxury',
          colorPalette: { primary: '#0F172A', secondary: '#334155', accent: '#38BDF8', ceiling: '#F8FAFC', flooring: '#1E293B' },
        },
        {
          name: 'Living Room',
          category: 'Living',
          floor: 'Ground Floor',
          dimensions: '24 x 18 ft',
          length: 24,
          width: 18,
          height: 14,
          area: 432,
          budget: 55000,
          spent: 42000,
          progress: 90,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Modern Luxury',
          colorPalette: { primary: '#0F172A', secondary: '#334155', accent: '#38BDF8', ceiling: '#F8FAFC', flooring: '#1E293B' },
          furniture: [
            { name: 'Curved Bouclé 4-Seater Sectional', quantity: 1, estimatedCost: 7500, vendor: 'B&B Italia' },
            { name: 'Monolith Travertine Coffee Table', quantity: 1, estimatedCost: 3400, vendor: 'StoneSource' },
          ],
          materials: [
            { name: 'Italian Calacatta Marble Slabs', category: 'Marble', price: 18000, supplier: 'StoneSource', finish: 'Honed' },
            { name: 'Fluted American Walnut Wall Paneling', category: 'Wood', price: 12500, supplier: 'Havwoods', finish: 'Matte Lacquer' },
          ],
        },
        {
          name: 'Dining Room',
          category: 'Dining',
          floor: 'Ground Floor',
          dimensions: '16 x 14 ft',
          length: 16,
          width: 14,
          height: 11,
          area: 224,
          budget: 22000,
          spent: 15000,
          progress: 75,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Modern Luxury',
        },
        {
          name: 'Kitchen',
          category: 'Kitchen',
          floor: 'Ground Floor',
          dimensions: '18 x 14 ft',
          length: 18,
          width: 14,
          height: 11,
          area: 252,
          budget: 40000,
          spent: 28000,
          progress: 70,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Contemporary Minimalist',
          kitchenDetails: {
            layout: 'Island',
            components: [
              { name: 'Custom Marine-Ply Acrylic Base Cabinets', specifiedMaterial: 'Marine Ply + Acrylic', cost: 16000, status: 'Ordered' },
              { name: 'Silestone Calacatta Quartz Waterfall Island', specifiedMaterial: 'Quartz', cost: 8500, status: 'Delivered' },
            ],
          },
        },
        {
          name: 'Utility Room',
          category: 'Utility',
          floor: 'Ground Floor',
          dimensions: '10 x 8 ft',
          length: 10,
          width: 8,
          height: 10,
          area: 80,
          budget: 6000,
          spent: 3500,
          progress: 60,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Modern',
        },
        {
          name: 'Guest Bedroom',
          category: 'Bedroom',
          floor: 'Ground Floor',
          dimensions: '16 x 14 ft',
          length: 16,
          width: 14,
          height: 11,
          area: 224,
          budget: 18000,
          spent: 9500,
          progress: 50,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Warm Minimalist',
        },
        {
          name: 'Guest Bathroom',
          category: 'Bathroom',
          floor: 'Ground Floor',
          dimensions: '10 x 8 ft',
          length: 10,
          width: 8,
          height: 10,
          area: 80,
          budget: 10000,
          spent: 6000,
          progress: 65,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Contemporary',
        },
        {
          name: 'Garden & Lawn',
          category: 'Garden',
          floor: 'Ground Floor',
          dimensions: '30 x 20 ft',
          length: 30,
          width: 20,
          height: 0,
          area: 600,
          budget: 15000,
          spent: 7500,
          progress: 50,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Contemporary Landscape',
        },

        // FIRST FLOOR
        {
          name: 'Master Bedroom Suite',
          category: 'Bedroom',
          floor: 'First Floor',
          dimensions: '22 x 18 ft',
          length: 22,
          width: 18,
          height: 12,
          area: 396,
          budget: 35000,
          spent: 24000,
          progress: 80,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Japandi Luxury',
          colorPalette: { primary: '#FAF7F2', secondary: '#D3C5B4', accent: '#8C7A6B', ceiling: '#FAF7F2', flooring: '#654321' },
        },
        {
          name: 'Master Ensuite Bathroom',
          category: 'Bathroom',
          floor: 'First Floor',
          dimensions: '14 x 12 ft',
          length: 14,
          width: 12,
          height: 11,
          area: 168,
          budget: 20000,
          spent: 14000,
          progress: 75,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Modern Luxury',
        },
        {
          name: 'Bedroom 2 (Kids Room)',
          category: 'Bedroom',
          floor: 'First Floor',
          dimensions: '16 x 14 ft',
          length: 16,
          width: 14,
          height: 11,
          area: 224,
          budget: 16000,
          spent: 8000,
          progress: 50,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Scandinavian Contemporary',
        },
        {
          name: 'Bedroom 3 (Study / Flex Room)',
          category: 'Bedroom',
          floor: 'First Floor',
          dimensions: '15 x 13 ft',
          length: 15,
          width: 13,
          height: 11,
          area: 195,
          budget: 14000,
          spent: 7000,
          progress: 45,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Modern Minimalist',
        },
        {
          name: 'Common Bathroom',
          category: 'Bathroom',
          floor: 'First Floor',
          dimensions: '10 x 8 ft',
          length: 10,
          width: 8,
          height: 10,
          area: 80,
          budget: 9000,
          spent: 5000,
          progress: 60,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Contemporary',
        },
        {
          name: 'Home Office & Library',
          category: 'Office',
          floor: 'First Floor',
          dimensions: '14 x 12 ft',
          length: 14,
          width: 12,
          height: 11,
          area: 168,
          budget: 16000,
          spent: 9800,
          progress: 70,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Executive Warm Modern',
        },
        {
          name: 'Master Suite Balcony',
          category: 'Balcony',
          floor: 'First Floor',
          dimensions: '18 x 6 ft',
          length: 18,
          width: 6,
          height: 10,
          area: 108,
          budget: 7000,
          spent: 3800,
          progress: 55,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Contemporary Outdoor',
        },
        {
          name: 'First Floor Open Terrace',
          category: 'Terrace',
          floor: 'First Floor',
          dimensions: '26 x 16 ft',
          length: 26,
          width: 16,
          height: 0,
          area: 416,
          budget: 14000,
          spent: 6200,
          progress: 40,
          designStatus: 'Approved',
          executionStatus: 'In Progress',
          style: 'Pergola Lounge',
        },
      ],
      quotations: [
        {
          title: 'Turnkey Architectural Interior Fit-out & Execution Quotation',
          version: 1,
          status: 'Approved',
          items: [
            { category: 'Civil & Architectural Prep', description: 'Wall preparation, dry-lining, false ceiling grids with shadow gap detail', quantity: 1, unit: 'Lump Sum', unitPrice: 38000, discount: 0, total: 38000 },
            { category: 'Flooring & Tiling', description: 'Calacatta marble living floor and European engineered herringbone oak in bedrooms', quantity: 1, unit: 'Lump Sum', unitPrice: 42000, discount: 2000, total: 40000 },
            { category: 'Bespoke Joinery & Millwork', description: 'Island kitchen cabinets, walk-in wardrobes, TV accent wall, library shelving', quantity: 1, unit: 'Lump Sum', unitPrice: 78000, discount: 4000, total: 74000 },
            { category: 'Electrical & Lighting Automation', description: 'Smart DALI lighting conduits, magnetic track lights, 2700K warm downlights', quantity: 1, unit: 'Lump Sum', unitPrice: 24000, discount: 1000, total: 23000 },
            { category: 'Plumbing & Premium Sanitaryware', description: 'Concealed thermostatic diverters, wall-hung WCs, freestanding stone soaking tub', quantity: 1, unit: 'Lump Sum', unitPrice: 22000, discount: 1000, total: 21000 },
            { category: 'Painting & Surface Texture', description: 'Italian mineral lime wash plaster on living accent walls and washable matte luxury paint', quantity: 1, unit: 'Lump Sum', unitPrice: 15000, discount: 500, total: 14500 },
          ],
          subtotal: 210500,
          discount: 8500,
          tax: 37890,
          grandTotal: 248390,
          clientNotes: 'Client approved comprehensive turnkey estimate.',
        },
      ],
      approvals: [
        {
          type: 'Design Brief',
          entityTitle: 'Initial Lifestyle & Space Requirements Brief',
          status: 'Approved',
          comment: 'Client signed off the lifestyle parameters, room counts, and Modern Luxury theme.',
          approvedBy: client1._id,
          role: 'CLIENT',
          timestamp: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
        },
        {
          type: 'Quotation',
          entityTitle: 'Turnkey Architectural Interior Fit-out Quotation',
          status: 'Approved',
          comment: 'Complete fit-out scope of $248,390 officially approved.',
          approvedBy: client1._id,
          role: 'CLIENT',
          timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        },
        {
          type: 'Material',
          entityTitle: 'Italian Calacatta Marble & Engineered White Oak Samples',
          status: 'Approved',
          comment: 'Physical stone sample veining and timber stain verified on site.',
          approvedBy: client1._id,
          role: 'CLIENT',
          timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        },
      ],
      siteVisits: [
        {
          date: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000),
          measurements: 'Laser survey confirmed: Ground floor built-up 2400 sq.ft, First floor 2400 sq.ft. Floor-to-ceiling 14ft in living.',
          existingCondition: 'Bare shell reinforced concrete structure with plaster primed masonry and external window frames installed.',
          electricalCondition: 'Conduit sleeves pulled to main DB location. Earthing verified.',
          plumbingCondition: 'PPR shaft lines pressure tested at 10 bar.',
          notes: 'Direct heavy vehicle access available for stone slab cranes and millwork delivery.',
        },
      ],
      procurement: [
        {
          itemName: 'Calacatta Gold Polished Slabs',
          category: 'Materials',
          room: 'Living Room',
          supplier: 'StoneSource International',
          quantityRequired: '1800 sq.ft',
          unitCost: 10,
          totalCost: 18000,
          status: 'Delivered',
        },
        {
          itemName: 'Silestone Quartz Island Slab',
          category: 'Materials',
          room: 'Kitchen',
          supplier: 'Cosentino',
          quantityRequired: '2 Slabs',
          unitCost: 4250,
          totalCost: 8500,
          status: 'Delivered',
        },
        {
          itemName: 'Magnetic Track Light Rails (3m)',
          category: 'Lighting',
          room: 'Living Room',
          supplier: 'Lucent US',
          quantityRequired: '8 pcs',
          unitCost: 350,
          totalCost: 2800,
          status: 'Installed',
        },
      ],
      snags: [
        {
          description: 'Living room cove light driver needs adjustment to eliminate low-frequency dimming flicker',
          room: 'Living Room',
          priority: 'Medium',
          status: 'Resolved',
        },
        {
          description: 'Kitchen pantry corner soft-close hinge damper requires tension alignment',
          room: 'Kitchen',
          priority: 'Low',
          status: 'Open',
        },
        {
          description: 'Master ensuite shower glass partition silicone sealing bead check',
          room: 'Master Ensuite Bathroom',
          priority: 'High',
          status: 'Open',
        },
      ],
      issues: [
        {
          title: 'AC copper pipe routing clearance in false ceiling drop',
          description: 'HVAC copper line clashed with recessed curtain track pocket depth.',
          room: 'Master Bedroom Suite',
          priority: 'High',
          status: 'Resolved',
          resolution: 'Shifted AC duct run 150mm inboard with insulated bypass bracket.',
        },
      ],
      images: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      ],
    });

    // Project 2: Under proposal review
    const project2 = await Project.create({
      title: 'Pacific Heights Minimalist Villa',
      description:
        'Full kitchen and master ensuite renovation featuring minimalist Japandi aesthetics, brushed bronze tapware, and monolith quartz islands.',
      client: client2._id,
      designer: designer1._id,
      contractor: null,
      projectType: 'Kitchen',
      propertyType: 'Villa',
      location: '2840 Broadway, Pacific Heights, San Francisco',
      totalBudget: 85000,
      spentAmount: 0,
      startDate: new Date(),
      expectedEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: 'PROPOSAL_SENT',
      progress: 15,
      requirements:
        'Seamless integrated Gaggenau appliances, rift-cut white oak cabinetry, warm concealed 2700K perimeter LED lighting.',
      preferredStyle: 'Scandinavian',
      images: [
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      ],
    });

    // Project 3: Completed Showcase
    const project3 = await Project.create({
      title: 'SoHo Contemporary Executive Office',
      description:
        'Architectural workspace redesign incorporating sound-dampening acoustic slatting, ergonomic walnut desk consoles, and mood lighting.',
      client: client1._id,
      designer: designer2._id,
      contractor: contractor1._id,
      projectType: 'Office',
      propertyType: 'Office',
      location: '104 Prince St, SoHo, New York',
      totalBudget: 60000,
      spentAmount: 58200,
      startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      expectedEndDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: 'COMPLETED',
      progress: 100,
      requirements: 'Dual workstation setup, conference lounge, smart glass partitions.',
      preferredStyle: 'Contemporary',
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      ],
    });

    // Project 4: Newly requested
    const project4 = await Project.create({
      title: 'Greenwich Mid-Century Master Suite',
      description:
        'Rejuvenation of a primary master bedroom suite with walk-in wardrobe, microcement wet room, and bespoke fluted walnut bedhead.',
      client: client2._id,
      designer: null,
      contractor: null,
      projectType: 'Bedroom',
      propertyType: 'Independent House',
      location: 'Greenwich, CT',
      totalBudget: 45000,
      spentAmount: 0,
      startDate: new Date(),
      status: 'REQUESTED',
      progress: 0,
      requirements:
        'Bouclé accents, dimmable architectural cove lighting, radiant heated herringbone flooring.',
      preferredStyle: 'Modern',
      images: [
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
      ],
    });

    console.log('[Seed] Creating Proposals & Revisions...');
    const proposal1 = await Proposal.create({
      project: project1._id,
      designer: designer1._id,
      title: 'Curated Organic Luxury Concept — V2 Final',
      description:
        'A harmonized spatial concept combining raw limestone textures with polished soft gold metal accents and rich velvet seating elements.',
      designStyle: 'Luxury',
      estimatedCost: 120000,
      estimatedDuration: '10 Weeks',
      materials: [
        { name: 'Calacatta Vagli Marble Slabs', estimatedCost: 18000, notes: 'For custom hearth' },
        { name: 'Bespoke European White Oak Flooring', estimatedCost: 22000, notes: 'Chevron pattern' },
        { name: 'Flos Architectural Chandelier', estimatedCost: 8500, notes: 'Central feature' },
      ],
      designImages: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      ],
      notes: 'Includes full 3D spatial renders, material samples board, and lighting schedules.',
      status: 'APPROVED',
    });

    const proposal2 = await Proposal.create({
      project: project2._id,
      designer: designer1._id,
      title: 'Japandi Architectural Kitchen Concept',
      description:
        'Minimalist kitchen concept utilizing continuous linear oak cabinetry, fluted glass pantry doors, and flush quartz worktops.',
      designStyle: 'Scandinavian',
      estimatedCost: 82000,
      estimatedDuration: '8 Weeks',
      materials: [
        { name: 'Rift-Cut Oak Cabinetry', estimatedCost: 34000, notes: 'Custom milled' },
        { name: 'Silestone Calacatta Gold Quartz', estimatedCost: 16000, notes: 'Island waterfall' },
      ],
      designImages: [
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      ],
      notes: 'Plumbing and electrical lines rerouting required for the island cooktop.',
      status: 'SENT',
    });

    console.log('[Seed] Creating Tasks...');
    await Task.create([
      {
        project: project1._id,
        title: 'Complete dry-wall framing & acoustic sub-ceiling',
        description: 'Install resilient channels and mineral wool soundproofing layers.',
        assignedTo: contractor1._id,
        assignedBy: designer1._id,
        priority: 'HIGH',
        status: 'COMPLETED',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        project: project1._id,
        title: 'Install Chevron European Oak Hardwood Flooring',
        description: 'Acclimate timber for 72 hours before precision herringbone installation.',
        assignedTo: contractor1._id,
        assignedBy: designer1._id,
        priority: 'URGENT',
        status: 'IN_PROGRESS',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        project: project1._id,
        title: 'Deliver and inspect custom Travertine fireplace mantle',
        description: 'Verify stone veining continuity and check for hairline fissures on arrival.',
        assignedTo: designer1._id,
        assignedBy: client1._id,
        priority: 'MEDIUM',
        status: 'TODO',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log('[Seed] Creating Materials...');
    await Material.create([
      {
        project: project1._id,
        name: 'European White Oak Chevron Flooring',
        category: 'Flooring',
        supplier: 'Havwoods International',
        quantity: 2800,
        unit: 'sq.ft',
        estimatedCost: 24000,
        actualCost: 22800,
        status: 'DELIVERED',
        notes: 'Inspected and moisture content verified at 8.2%',
      },
      {
        project: project1._id,
        name: 'Custom Bouclé Curved Sofa & Ottoman',
        category: 'Furniture',
        supplier: 'Pierre Augustin Rose Atelier',
        quantity: 1,
        unit: 'set',
        estimatedCost: 16500,
        actualCost: 16500,
        status: 'ORDERED',
        notes: 'In transit from Milan workshop, ETA 3 weeks.',
      },
      {
        project: project1._id,
        name: 'Dimmable Recessed Trimless Downlights (2700K)',
        category: 'Lighting',
        supplier: 'Lucent Lighting US',
        quantity: 36,
        unit: 'fixtures',
        estimatedCost: 4500,
        actualCost: 4200,
        status: 'INSTALLED',
      },
    ]);

    console.log('[Seed] Creating Expenses...');
    await Expense.create([
      {
        project: project1._id,
        category: 'Materials',
        description: 'Down-payment for European Oak timber and adhesive',
        amount: 22800,
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        addedBy: contractor1._id,
      },
      {
        project: project1._id,
        category: 'Design',
        description: 'Architectural schematics, 3D visualizations, and CAD elevations',
        amount: 12000,
        date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        addedBy: designer1._id,
      },
      {
        project: project1._id,
        category: 'Labor',
        description: 'Phase 1 demolition, electrical rough-in, and waste disposal',
        amount: 13700,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        addedBy: contractor1._id,
      },
    ]);

    console.log('[Seed] Creating Milestones...');
    await Milestone.create([
      {
        project: project1._id,
        title: 'Phase 1: Concept & Approvals',
        description: 'Site survey, design development, client sign-off, and municipal permits.',
        startDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        status: 'COMPLETED',
        completionPercentage: 100,
      },
      {
        project: project1._id,
        title: 'Phase 2: Structural Fit-out & MEP',
        description: 'Acoustics, mechanical, electrical, plumbing, and wall framing.',
        startDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'IN_PROGRESS',
        completionPercentage: 80,
      },
      {
        project: project1._id,
        title: 'Phase 3: Millwork & Finishes',
        description: 'Flooring installation, fluted marble fireplace, paint finishes, custom cabinetry.',
        startDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        status: 'UPCOMING',
        completionPercentage: 0,
      },
      {
        project: project1._id,
        title: 'Phase 4: Styling & Handover',
        description: 'Furniture placement, art installation, lighting calibration, white-glove handover.',
        startDate: new Date(Date.now() + 36 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
        status: 'UPCOMING',
        completionPercentage: 0,
      },
    ]);

    console.log('[Seed] Creating Notifications...');
    await Notification.create([
      {
        recipient: client1._id,
        type: 'TASK_COMPLETED',
        title: 'Milestone Progress Update',
        message: 'Acoustic sub-ceiling and dry-wall framing completed by Harrison Sterling Build Co.',
        relatedProject: project1._id,
        isRead: false,
      },
      {
        recipient: designer1._id,
        type: 'PROPOSAL_APPROVED',
        title: 'Proposal Approved by Eleanor Vance',
        message: 'Your proposal "Curated Organic Luxury Concept" has been approved!',
        relatedProject: project1._id,
        isRead: true,
      },
      {
        recipient: client2._id,
        type: 'PROPOSAL_SUBMITTED',
        title: 'New Proposal for Pacific Heights Villa',
        message: 'Aurelia Dupont submitted a Japandi Architectural Kitchen proposal for your review.',
        relatedProject: project2._id,
        isRead: false,
      },
    ]);

    console.log('[Seed] Creating Audit Logs...');
    await AuditLog.create([
      {
        user: admin._id,
        action: 'PLATFORM_INITIALIZED',
        entityType: 'SYSTEM',
        description: 'System seed database populated with baseline enterprise demo datasets.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        user: client1._id,
        action: 'PROJECT_CREATED',
        entityType: 'PROJECT',
        entityId: project1._id.toString(),
        description: `Project "${project1.title}" created with budget $125,000`,
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        user: designer1._id,
        action: 'PROPOSAL_CREATED',
        entityType: 'PROPOSAL',
        entityId: proposal1._id.toString(),
        description: `Design proposal submitted by Aurelia Dupont`,
        timestamp: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
      },
      {
        user: client1._id,
        action: 'PROPOSAL_APPROVED',
        entityType: 'PROPOSAL',
        entityId: proposal1._id.toString(),
        description: `Client approved proposal "${proposal1.title}"`,
        timestamp: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log('\n=========================================');
    console.log('✅ DEMO SEED DATA INSERTED SUCCESSFULLY!');
    console.log('=========================================');
    console.log('Demo Logins (Password for all: Password123!)');
    console.log('👑 ADMIN:       admin@designspace.com');
    console.log('👤 CLIENT 1:    client@designspace.com');
    console.log('👤 CLIENT 2:    julian.mercer@luxhome.io');
    console.log('🎨 DESIGNER 1:  designer@designspace.com');
    console.log('🎨 DESIGNER 2:  marcus.thorne@studio.com');
    console.log('🔨 CONTRACTOR 1: contractor@designspace.com');
    console.log('🔨 CONTRACTOR 2: apex.builds@craftfit.io');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
