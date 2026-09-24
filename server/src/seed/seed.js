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

// Load env from server root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

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
    // Project 1: Active in progress
    const project1 = await Project.create({
      title: 'Tribeca High-Ceiling Loft Transformation',
      description:
        'A comprehensive redesign of a 3,200 sq.ft industrial loft in Tribeca into an organic modern sanctuary featuring fluted marble, custom brass lighting fixtures, and curated bespoke Italian furniture.',
      client: client1._id,
      designer: designer1._id,
      contractor: contractor1._id,
      projectType: 'Living Room',
      propertyType: 'Apartment',
      location: '72 Franklin St, Tribeca, New York',
      totalBudget: 125000,
      spentAmount: 48500,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      expectedEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'IN_PROGRESS',
      progress: 45,
      requirements:
        'Open layout flow, hidden acoustic ceiling panels, bespoke travertine fireplace, textured lime wash walls, custom oak library wall with rolling ladder.',
      preferredStyle: 'Luxury',
      images: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
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
