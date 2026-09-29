import FurnitureCatalog from '../models/FurnitureCatalog.js';
import MaterialCatalog from '../models/MaterialCatalog.js';
import Project from '../models/Project.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// Pre-seeded Catalog Samples for instant zero-config availability
const INITIAL_FURNITURE_SEED = [
  {
    name: 'Curved Bouclé Sectional Sofa',
    category: 'Sofa',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    dimensions: '114 x 68 x 32 in',
    material: 'Performance Bouclé & Kiln-Dried Hardwood',
    finish: 'Ivory / Sand',
    price: 4800,
    supplier: 'B&B Italia Atelier',
    description: 'Sculptural organic curved sofa with plush deep seating and stain-resistant treatment.',
    tags: ['Living', 'Luxury', 'Contemporary'],
  },
  {
    name: 'Monolith Travertine Cocktail Table',
    category: 'Coffee table',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=800&q=80',
    dimensions: '48 x 28 x 15 in',
    material: 'Natural Italian Travertine Stone',
    finish: 'Honed Matte',
    price: 1850,
    supplier: 'StoneSource Collection',
    description: 'Honed unfilled Italian travertine coffee table with soft beveled perimeter chamfers.',
    tags: ['Living', 'Modern', 'Minimalist'],
  },
  {
    name: 'Floating Walnut King Platform Bed',
    category: 'Bed',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    dimensions: '82 x 78 x 42 in',
    material: 'American Black Walnut & Integrated Headboard LED',
    finish: 'Satin Clear Polyurethane',
    price: 3600,
    supplier: 'Nordic Craft Atelier',
    description: 'Minimalist cantilevered low platform bed with integrated soft brass reading lights.',
    tags: ['Bedroom', 'Japandi', 'Modern'],
  },
  {
    name: 'Smoked Oak 8-Seater Dining Table',
    category: 'Dining table',
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
    dimensions: '96 x 40 x 30 in',
    material: 'Solid European White Oak',
    finish: 'Smoked Charcoal Brushed',
    price: 3200,
    supplier: 'Havwoods Living',
    description: 'Solid timber dining table with sculpted cylindrical pillar bases and soft rounded bullnose edge.',
    tags: ['Dining', 'Luxury'],
  },
  {
    name: 'Sculptural Bouclé Dining Armchairs (Pair)',
    category: 'Dining chair',
    image: 'https://images.unsplash.com/photo-1580481077195-c9f28d844c87?auto=format&fit=crop&w=800&q=80',
    dimensions: '22 x 23 x 31 in',
    material: 'Bentwood Frame & Bouclé Upholstery',
    finish: 'Matte Black Steel & Oatmeal Fabric',
    price: 950,
    supplier: 'Atelier Minimal',
    description: 'Ergonomic wrap-around dining armchairs designed for extended hosting and dining comfort.',
    tags: ['Dining', 'Modern'],
  },
  {
    name: 'Architectural Fluted TV Console & Credenza',
    category: 'TV unit',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    dimensions: '84 x 18 x 22 in',
    material: 'Rift-Cut White Oak & Quartz Top',
    finish: 'Natural White Oak',
    price: 2400,
    supplier: 'CraftFit Woodworks',
    description: 'Precision fluted tambour sliding doors with integrated acoustic pass-through cloth and cable ducts.',
    tags: ['Living', 'Media'],
  },
  {
    name: 'Floor-to-Ceiling Modular Glass Wardrobe',
    category: 'Wardrobe',
    image: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=800&q=80',
    dimensions: '120 x 96 x 24 in',
    material: 'Anodized Bronze Aluminum & Fluted Tempered Glass',
    finish: 'Brushed Dark Bronze',
    price: 6800,
    supplier: 'Rimadesio Style Systems',
    description: 'Modular luxury walk-in wardrobe system with automatic internal 3000K LED illumination sensor bars.',
    tags: ['Master Bedroom', 'Walk-in Closet'],
  },
  {
    name: 'Executive Ergonomic Study Desk',
    category: 'Study table',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    dimensions: '66 x 32 x 30 in',
    material: 'Solid Walnut & Italian Saddle Leather Pad',
    finish: 'Oiled Walnut & Cognac Leather',
    price: 2100,
    supplier: 'Herman Miller Style Studio',
    description: 'Executive desk with concealed magnetic cable troughs, motorized height memory, and drawer organization.',
    tags: ['Home Office', 'Executive'],
  },
  {
    name: 'High-Back Ergonomic Lumbar Task Chair',
    category: 'Chair',
    image: 'https://images.unsplash.com/photo-1580481077195-c9f28d844c87?auto=format&fit=crop&w=800&q=80',
    dimensions: '26 x 26 x 44 in',
    material: 'Breathable Elastomer Mesh & Polished Aluminum',
    finish: 'Graphite Black',
    price: 1100,
    supplier: 'ErgoForm Pro',
    description: 'Dynamic posture balancing task chair with 4D armrests and active lumbar support for all-day focus.',
    tags: ['Office', 'Study'],
  },
  {
    name: 'Open Architectural Bookcase & Display Tower',
    category: 'Bookshelf',
    image: 'https://images.unsplash.com/photo-1594652634010-275456c808d0?auto=format&fit=crop&w=800&q=80',
    dimensions: '42 x 16 x 84 in',
    material: 'Powder-Coated Steel & Solid Ash Shelves',
    finish: 'Matte Charcoal & Bleached Ash',
    price: 1650,
    supplier: 'DesignSpace Atelier',
    description: 'Staggered vertical dividing compartments for design books, pottery, and art object curation.',
    tags: ['Living', 'Library'],
  },
  {
    name: 'Outdoor Weatherproof Teak & Cane Lounge Set',
    category: 'Outdoor furniture',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    dimensions: 'Sofa: 76 x 34 in, Chairs: 32 x 34 in',
    material: 'Grade-A SVLK Teak & QuickDry Olefin Fabric',
    finish: 'Natural Weathered Teak',
    price: 4200,
    supplier: 'Gloster Outdoor Living',
    description: 'Resistant to heavy rain, direct UV rays, and chlorinated pool mist; includes waterproof rain covers.',
    tags: ['Balcony', 'Terrace', 'Garden'],
  },
];

const INITIAL_MATERIAL_SEED = [
  {
    name: 'Calacatta Gold Italian Marble Slabs',
    category: 'Marble',
    brand: 'Antolini Italy',
    sku: 'MAR-CAL-001',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    color: '#F8F8F6',
    finish: 'Honed Silk Satin',
    unit: 'sq.ft',
    price: 38,
    supplier: 'StoneSource International',
    description: 'Quarried in Carrara, Italy. Features distinctive warm gold and grey dramatic veining over creamy background.',
  },
  {
    name: 'European Engineered White Oak Herringbone Flooring',
    category: 'Wood',
    brand: 'Havwoods International',
    sku: 'WOD-OAK-002',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    color: '#D4C4B0',
    finish: 'Brushed Ultra-Matte UV Lacquer',
    unit: 'sq.ft',
    price: 16.5,
    supplier: 'Havwoods UK/US',
    description: 'Multi-ply cross-laminated hardwood construction with 4mm European oak wear layer; compatible with underfloor heating.',
  },
  {
    name: 'Silestone Calacatta Gold 20mm Quartz Slab',
    category: 'Quartz',
    brand: 'Cosentino Silestone',
    sku: 'QTZ-SIL-003',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    color: '#FFFFFF',
    finish: 'N-Boost Polished',
    unit: 'sq.ft',
    price: 42,
    supplier: 'Cosentino Center',
    description: 'Non-porous hybrid mineral surface highly resistant to staining, acids, knife scratches, and daily kitchen wear.',
  },
  {
    name: 'Italian Mineral Lime Wash Plaster Paint',
    category: 'Paint',
    brand: 'Colorificio Veneziano',
    sku: 'PNT-LIME-004',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    color: '#EFECE6',
    finish: 'Velvety Matte Suede',
    unit: 'liter',
    price: 32,
    supplier: 'Limewash Atelier',
    description: 'Natural slaked lime and crushed marble dust formula creating subtle tonal cloud effects and breathable wall surfaces.',
  },
  {
    name: 'Large Format Terrazzo Matte Porcelain Tiles (1200x600)',
    category: 'Tiles',
    brand: 'Marazzi Ceramiche',
    sku: 'TIL-TRZ-005',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    color: '#ECE9E2',
    finish: 'R10 Slip Resistance Satin',
    unit: 'sq.ft',
    price: 11.2,
    supplier: 'Simpolo Ceramics',
    description: 'Micro-chipped stone aggregate visuals in rectified porcelain body; ideal for wet rooms and heavy traffic floors.',
  },
  {
    name: 'Acoustic Fluted Smoked Walnut Wall Slats',
    category: 'Veneer',
    brand: 'DecoPanels Architectural',
    sku: 'WOD-FLT-006',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    color: '#4A3B32',
    finish: 'Matte Lacquer on Black Acoustic Felt',
    unit: 'sq.ft',
    price: 24,
    supplier: 'AcousticPlus Atelier',
    description: 'Pre-assembled wood slat wall paneling on 9mm recycled PET acoustic felt backing for sound dampening.',
  },
  {
    name: 'Magnetic 48V Low-Voltage Trimless Track Rails',
    category: 'Lighting',
    brand: 'Flos Architectural / Lucent',
    sku: 'LGT-TRK-007',
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80',
    color: '#1E293B',
    finish: 'Anodized Matte Black',
    unit: 'piece',
    price: 145,
    supplier: 'Lucent Lighting US',
    description: 'Recessed trimless ceiling channel supporting tool-free snap-in magnetic spot modules, diffused bars, and pendants.',
  },
  {
    name: 'PVD Coated Brushed Rose Gold Kitchen Tapware',
    category: 'Hardware',
    brand: 'Grohe Euphoria Elite',
    sku: 'HDW-GRO-008',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    color: '#C59B8B',
    finish: 'PVD Brushed Warm Bronze',
    unit: 'piece',
    price: 490,
    supplier: 'Grohe / Kohler Showroom',
    description: 'Physical Vapor Deposition surface with 10x scratch resistance compared to chrome; pull-out swivel dual spray aerator.',
  },
];

// Seed initial catalogs if empty
const ensureCatalogSeeded = async () => {
  try {
    const furnitureCount = await FurnitureCatalog.countDocuments();
    if (furnitureCount === 0) {
      await FurnitureCatalog.insertMany(INITIAL_FURNITURE_SEED);
      console.log('[Catalog] Seeded initial furniture catalog');
    }
    const materialCount = await MaterialCatalog.countDocuments();
    if (materialCount === 0) {
      await MaterialCatalog.insertMany(INITIAL_MATERIAL_SEED);
      console.log('[Catalog] Seeded initial material catalog');
    }
  } catch (err) {
    console.warn('[Catalog Seed Warning]:', err.message);
  }
};

// Auto run check once on startup
ensureCatalogSeeded();

// @desc    Get Furniture Catalog with filters
// @route   GET /api/catalog/furniture
// @access  Public / Private
export const getFurnitureCatalog = async (req, res, next) => {
  try {
    await ensureCatalogSeeded();
    const { category, search, minPrice, maxPrice, sort } = req.query;
    const query = {};

    if (category && category !== 'ALL') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name_asc') sortOption = { name: 1 };

    const items = await FurnitureCatalog.find(query).sort(sortOption);
    return sendSuccess(res, 200, 'Furniture catalog retrieved', items);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Material Catalog with filters
// @route   GET /api/catalog/materials
// @access  Public / Private
export const getMaterialCatalog = async (req, res, next) => {
  try {
    await ensureCatalogSeeded();
    const { category, brand, search, minPrice, maxPrice, sort } = req.query;
    const query = {};

    if (category && category !== 'ALL') {
      query.category = category;
    }
    if (brand && brand !== 'ALL') {
      query.brand = brand;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name_asc') sortOption = { name: 1 };

    const items = await MaterialCatalog.find(query).sort(sortOption);
    return sendSuccess(res, 200, 'Material catalog retrieved', items);
  } catch (error) {
    next(error);
  }
};

// @desc    Add furniture item to project / room
// @route   POST /api/catalog/add-furniture-to-project
// @access  Private
export const addFurnitureToProject = async (req, res, next) => {
  try {
    const { projectId, roomId, furnitureId, customQuantity = 1, customNotes = '' } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return sendError(res, 404, 'Project not found');

    const item = await FurnitureCatalog.findById(furnitureId);
    if (!item) return sendError(res, 404, 'Furniture item not found in catalog');

    // Find room if specified, otherwise living room or first room
    let room = project.rooms.id(roomId);
    if (!room && project.rooms.length > 0) {
      room = project.rooms[0];
    }

    if (room) {
      room.furniture.push({
        name: item.name,
        quantity: Number(customQuantity) || 1,
        estimatedCost: (item.price || 0) * (Number(customQuantity) || 1),
        vendor: item.supplier || '',
        photo: item.image || '',
        notes: customNotes || `${item.dimensions} - ${item.material} (${item.finish})`,
        status: 'Selected',
      });
      await project.save();
      return sendSuccess(res, 200, `Added "${item.name}" to space "${room.name}"`, room);
    }

    return sendError(res, 400, 'No room available in this project to attach furniture');
  } catch (error) {
    next(error);
  }
};

// @desc    Add material to project room
// @route   POST /api/catalog/add-material-to-project
// @access  Private
export const addMaterialToProject = async (req, res, next) => {
  try {
    const { projectId, roomId, materialId, quantityRequired = '1', customNotes = '' } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return sendError(res, 404, 'Project not found');

    const item = await MaterialCatalog.findById(materialId);
    if (!item) return sendError(res, 404, 'Material item not found in catalog');

    let room = project.rooms.id(roomId);
    if (!room && project.rooms.length > 0) {
      room = project.rooms[0];
    }

    if (room) {
      room.materials.push({
        name: item.name,
        category: item.category || 'Other',
        price: (item.price || 0) * (parseFloat(quantityRequired) || 1),
        supplier: item.supplier || item.brand || '',
        color: item.color || '',
        finish: item.finish || '',
        photo: item.image || '',
        quantityRequired: `${quantityRequired} ${item.unit || 'units'}`,
        notes: customNotes || item.description || '',
        status: 'Specified',
      });
      await project.save();
      return sendSuccess(res, 200, `Associated material "${item.name}" with space "${room.name}"`, room);
    }

    return sendError(res, 400, 'No room available in this project to attach material');
  } catch (error) {
    next(error);
  }
};
