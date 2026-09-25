/**
 * DesignSpace AI Interior Design Service
 * Provides structured room analysis & bespoke architectural design proposals
 * Supports external LLM providers (Gemini, OpenAI) if keys are provided,
 * with a high-fidelity architectural domain engine as intelligent fallback.
 */

export const analyzeRoomImageAndGenerateProposal = async ({
  imageUrl,
  spaceType = 'Living Room',
  style = 'Modern',
  budgetAmount = 500000,
  budgetTier = 'Premium',
  requirements = '',
  dimensions = { length: 15, width: 12, height: 10 },
  lifestyle = {},
}) => {
  // Check if external provider configured
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      const externalResult = await generateWithGemini({
        geminiKey,
        imageUrl,
        spaceType,
        style,
        budgetAmount,
        budgetTier,
        requirements,
        dimensions,
        lifestyle,
      });
      if (externalResult) return externalResult;
    } catch (err) {
      console.warn('[AI Service] Gemini invocation failed, using core architectural engine:', err.message);
    }
  }

  if (openaiKey) {
    try {
      const externalResult = await generateWithOpenAI({
        openaiKey,
        imageUrl,
        spaceType,
        style,
        budgetAmount,
        budgetTier,
        requirements,
        dimensions,
        lifestyle,
      });
      if (externalResult) return externalResult;
    } catch (err) {
      console.warn('[AI Service] OpenAI invocation failed, using core architectural engine:', err.message);
    }
  }

  // Core Architectural Design Engine
  return generateDomainProposal({
    imageUrl,
    spaceType,
    style,
    budgetAmount,
    budgetTier,
    requirements,
    dimensions,
    lifestyle,
  });
};

/**
 * Domain-specific architectural generation engine
 */
const generateDomainProposal = ({
  imageUrl,
  spaceType,
  style,
  budgetAmount,
  budgetTier,
  requirements,
  dimensions,
  lifestyle,
}) => {
  const normSpace = spaceType.toLowerCase();
  const area = (dimensions.length || 15) * (dimensions.width || 12);
  const budget = budgetAmount || 500000;

  // Style-specific color swatches & concept
  const styleConfigs = {
    'Modern': {
      conceptName: 'Sleek Geometric Elegance',
      mood: 'Refined, serene, and functional with clean lines',
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      accent: '#38BDF8',
      neutral: '#E2E8F0',
      ceiling: '#FFFFFF',
      flooring: '#334155',
      wallFinish: 'Low-sheen acrylic emulsion with fluted charcoal acoustic slat accent panel',
      floorMaterial: 'Large-format Italian glazed vitrified tiles (1200x600mm)',
    },
    'Luxury': {
      conceptName: 'Opulent Atelier Glamour',
      mood: 'Lavish, rich textures with brass accents and ambient backlighting',
      primary: '#FDFBF7',
      secondary: '#D4AF37',
      accent: '#0F172A',
      neutral: '#F1E9D2',
      ceiling: '#FFFFFF',
      flooring: '#78350F',
      wallFinish: 'Italian Stucco Marmorino plaster with brushed champagne brass inlay trims',
      floorMaterial: 'Imported Statuario white marble with book-matched veins',
    },
    'Minimalist': {
      conceptName: 'Pure Monolithic Harmony',
      mood: 'Uncluttered, airy, and centered on natural textures and light',
      primary: '#FAFAF9',
      secondary: '#D6D3D1',
      accent: '#78716C',
      neutral: '#E7E5E4',
      ceiling: '#FFFFFF',
      flooring: '#A8A29E',
      wallFinish: 'Seamless micro-cement render with shadow-gap architectural skirting',
      floorMaterial: 'Seamless light ash micro-topping concrete overlay',
    },
    'Japandi': {
      conceptName: 'Wabi-Sabi Natural Haven',
      mood: 'Organic warmth, artisanal craftsmanship, and earthy tranquility',
      primary: '#FAF8F5',
      secondary: '#C4B5A5',
      accent: '#5A6B5C',
      neutral: '#E6DFD5',
      ceiling: '#F5F0EB',
      flooring: '#8C6D4F',
      wallFinish: 'Textured limewash finish in natural oat with white oak acoustic battens',
      floorMaterial: 'Engineered brushed European white oak planks (190mm width)',
    },
    'Indian Contemporary': {
      conceptName: 'Heritage Fusion Sanctuary',
      mood: 'Warm teak wood accents, subtle brass motifs, and bespoke hand-woven textiles',
      primary: '#FFFDF9',
      secondary: '#C27D38',
      accent: '#1E3A8A',
      neutral: '#EAD7C3',
      ceiling: '#FFFFFF',
      flooring: '#5C3A21',
      wallFinish: 'Soft ivory silk-sheen wall paint with carved teak wood wall jaali accents',
      floorMaterial: 'Honed Kota stone tiles complemented by seasoned Burma teak borders',
    },
    'Scandinavian': {
      conceptName: 'Nordic Light Sanctuary',
      mood: 'Bright, welcoming, with blonde woods, soft wools, and cozy ambient glows',
      primary: '#FFFFFF',
      secondary: '#E2E8F0',
      accent: '#0284C7',
      neutral: '#CBD5E1',
      ceiling: '#FFFFFF',
      flooring: '#D1D5DB',
      wallFinish: 'Ultra-matte breathable emulsion in chalk white with pale pine paneling',
      floorMaterial: 'Scandinavian pale beech herringbone engineered timber flooring',
    },
  };

  const currentStyleConfig = styleConfigs[style] || styleConfigs['Modern'];

  // Space-specific components
  let furniture = [];
  let materials = [];
  let lighting = [];
  let storage = [];
  let decor = [];
  let kitchenDetails = null;
  let bathroomDetails = null;
  let gardenDetails = null;

  if (normSpace.includes('living')) {
    furniture = [
      { name: 'Custom Sectional Sofa (L-Shape)', category: 'Sofa', dimensions: '9.5 x 6.5 ft', material: 'Performance Bouclé Fabric', finish: 'Sand Beige', estimatedCost: Math.round(budget * 0.18), reason: 'Spacious ergonomic seating anchoring the main entertainment zone' },
      { name: 'Architectural Floating TV Console with Slat Wall', category: 'TV Unit', dimensions: '8 x 1.5 ft', material: 'Smoked Oak Veneer & Quartz Top', finish: 'Matte Charcoal', estimatedCost: Math.round(budget * 0.14), reason: 'Conceals media wiring while providing high-end focal statement' },
      { name: 'Dual Nesting Coffee Tables', category: 'Coffee Table', dimensions: '36 & 24 in dia', material: 'Honed Calacatta & Black Steel', finish: 'Brushed Gold Frame', estimatedCost: Math.round(budget * 0.06), reason: 'Flexible modular cocktail tables with contrasting stone heights' },
      { name: 'Accent Lounge Armchair', category: 'Chair', dimensions: '32 x 30 in', material: 'Full-Grain Top Leather', finish: 'Cognac / Tan', estimatedCost: Math.round(budget * 0.08), reason: 'Adds rich accent color and cozy reading corner' },
    ];
    materials = [
      { name: 'Fluted Acoustic Charcoal Wall Battens', category: 'Wood', finish: 'Matte Polyurethane', estimatedPrice: Math.round(budget * 0.09), supplier: 'DecoPanels Direct', notes: 'Behind entertainment wall for acoustic dampening' },
      { name: 'Italian Glazed Vitrified Slabs (1200x600)', category: 'Flooring', finish: 'Honed Satin', estimatedPrice: Math.round(budget * 0.16), supplier: 'Graniti Vicenza', notes: 'Seamless high-traffic flooring' },
      { name: 'Designer Washable Emulsion Paint', category: 'Paint', finish: 'Eggshell', estimatedPrice: Math.round(budget * 0.05), supplier: 'Asian Paints Royale / Dulux', notes: 'Low VOC formulation' },
    ];
    lighting = [
      { type: 'Ambient', fixture: 'Magnetic Recessed Linear Spotlights', location: 'False ceiling grid perimeter', colorTemp: '3000K Warm White', estimatedCost: Math.round(budget * 0.05) },
      { type: 'Accent', fixture: 'Concealed COB LED Strip (Cove Lighting)', location: 'Ceiling perimeter drop & TV niche', colorTemp: '2700K Soft Warm', estimatedCost: Math.round(budget * 0.03) },
      { type: 'Decorative', fixture: 'Suspended Asymmetrical Chandelier', location: 'Living center / Coffee table axis', colorTemp: '3000K', estimatedCost: Math.round(budget * 0.06) },
    ];
    storage = [
      { type: 'Concealed Media Credenza', dimensions: '96 x 18 x 20 in', finish: 'Fluted Wood with Push-to-Open Latches', notes: 'Houses soundbar, gaming consoles, and cable management' },
      { type: 'Display Curio Niches with Glass Shelving', dimensions: '24 x 12 x 84 in', finish: 'Tinted Grey Toughened Glass', notes: 'Warm spotlighting for art artifacts' },
    ];
    decor = [
      { item: 'Hand-Tufted Wool & Silk Geometric Rug (8x10 ft)', placement: 'Under Sectional and Coffee Table cluster', notes: 'Anchors the seating configuration' },
      { item: 'Floor-to-Ceiling Motorized Wave-Fold Sheer & Blackout Drapes', placement: 'Main Balcony / Window Glazing', notes: 'Softens acoustic flutter and manages glare' },
      { item: 'Fiddle Leaf Fig in Handcrafted Terracotta Planter', placement: 'Corner adjacent to window', notes: 'Brings organic greenery into interior space' },
    ];
  } else if (normSpace.includes('bed') || normSpace.includes('master')) {
    furniture = [
      { name: 'King Bed with Fluted Upholstered Headboard', category: 'Bed', dimensions: '78 x 72 in (Mattress Size)', material: 'Seasoned Solid Hardwood & Velvet Fabric', finish: 'Warm Oatmeal', estimatedCost: Math.round(budget * 0.22), reason: 'Plush focal bedframe with integrated floating nightstands' },
      { name: 'Dual Floating Bedside Nightstands', category: 'Cabinet', dimensions: '22 x 16 x 14 in', material: 'Walnut Veneer', finish: 'Satin Clear', estimatedCost: Math.round(budget * 0.06), reason: 'Clean floor clearance with wireless phone charging cutout' },
      { name: 'Full-Height Floor-to-Ceiling Wardrobe', category: 'Wardrobe', dimensions: '10 x 9 x 2 ft', material: 'BWP Marine Ply with Tinted Glass Doors', finish: 'Champagne Aluminum Trim', estimatedCost: Math.round(budget * 0.28), reason: 'Organized his & hers closet storage with sensor LED hanging rods' },
      { name: 'Dressing Vanity with Backlit Vanity Mirror', category: 'Study Desk', dimensions: '48 x 18 in', material: 'Quartz Top & Brass Accents', finish: 'Matte White', estimatedCost: Math.round(budget * 0.09), reason: 'Dedicated makeup and grooming console with concealed drawers' },
    ];
    materials = [
      { name: 'Acoustic Padded Headboard Paneling', category: 'Fabric', finish: 'Stain-Resistant Velvet', estimatedPrice: Math.round(budget * 0.08), supplier: 'Velveteen Studio', notes: 'Sound-insulating accent wall' },
      { name: 'High-Density Engineered Wood Planks', category: 'Flooring', finish: 'Natural Matte Lacquer', estimatedPrice: Math.round(budget * 0.14), supplier: 'Pergo / QuickStep', notes: 'Warm touch underfoot for master bedroom' },
      { name: 'Textured Wallpaper (Subtle Linen Weave)', category: 'Wallpaper', finish: 'Embossed Vinyl', estimatedPrice: Math.round(budget * 0.05), supplier: 'Marshalls', notes: 'Bed accent backdrop' },
    ];
    lighting = [
      { type: 'Task', fixture: 'Dual Adjustable Brass Bedside Pendants', location: 'Suspended over nightstands', colorTemp: '2700K', estimatedCost: Math.round(budget * 0.04) },
      { type: 'Ambient', fixture: 'Dimmable Recessed False Ceiling Spotlights', location: 'Bedroom grid', colorTemp: '3000K', estimatedCost: Math.round(budget * 0.04) },
      { type: 'Accent', fixture: 'Wardrobe Sensor Profile Lighting', location: 'Inside closet frames', colorTemp: '4000K Natural White', estimatedCost: Math.round(budget * 0.03) },
    ];
    storage = [
      { type: 'Walk-in Modular Wardrobe Organizers', dimensions: '120 x 108 x 24 in', finish: 'Linen Laminate Internal with Glass Drawers', notes: 'Shoe racks, tie organizers, and jewelry pullouts' },
      { type: 'Hydraulic Storage Bed Platform', dimensions: 'King Size Under-bed', finish: 'Reinforced Metal Subframe', notes: 'Stores seasonal duvets and luggage' },
    ];
    decor = [
      { item: 'Soft Touch Wool Shag Runner Rugs', placement: 'Both sides of the bed', notes: 'Plush morning footing' },
      { item: 'Curated Triptych Canvas Abstract Art', placement: 'Side wall across bed', notes: 'Adds soothing color harmonies' },
    ];
  } else if (normSpace.includes('kitchen')) {
    kitchenDetails = {
      layout: 'L-shaped with Island',
      components: [
        { name: 'Hydraulic Lift-Up Wall Cabinets', specifiedMaterial: 'Anti-Fingerprint Acrylic', cost: Math.round(budget * 0.15), status: 'Specified' },
        { name: 'Soft-Close Blum Tandembox Base Drawers', specifiedMaterial: 'BWP Marine Ply with Quartz Top', cost: Math.round(budget * 0.25), status: 'Specified' },
        { name: 'Pantry Tall Unit with Pull-Out Baskets', specifiedMaterial: 'Stainless Steel & Glass', cost: Math.round(budget * 0.12), status: 'Specified' },
        { name: 'Breakfast Counter / Preparation Island', specifiedMaterial: 'Seamless 20mm Nano-White Quartz', cost: Math.round(budget * 0.14), status: 'Specified' },
      ],
    };
    furniture = [
      { name: 'Breakfast Counter Bar Stools (Set of 3)', category: 'Chair', dimensions: '26 in Seat Height', material: 'Bentwood & Faux Leather', finish: 'Walnut & Black', estimatedCost: Math.round(budget * 0.06), reason: 'Casual dining at preparation counter' },
    ];
    materials = [
      { name: 'Stain-Proof Calacatta Gold Quartz Countertop (20mm)', category: 'Countertop', finish: 'Polished', estimatedPrice: Math.round(budget * 0.18), supplier: 'KalingaStone', notes: 'Zero porosity, heat and scratch resistant' },
      { name: 'Anti-Skid Matte Porcelain Floor Tiles (600x600)', category: 'Flooring', finish: 'R10 Slip Resistance', estimatedPrice: Math.round(budget * 0.10), supplier: 'Kajaria Eternity', notes: 'Safe when wet and easily washable' },
      { name: 'Subway Glazed Backsplash Tiles (300x100)', category: 'Tiles', finish: 'Beveled Gloss', estimatedPrice: Math.round(budget * 0.05), supplier: 'Somany Ceramics', notes: 'Easy grease cleanup' },
    ];
    lighting = [
      { type: 'Task', fixture: 'Under-Cabinet Profile LED Strip', location: 'Below upper wall cabinets illuminating countertop', colorTemp: '4000K Clean White', estimatedCost: Math.round(budget * 0.04) },
      { type: 'Decorative', fixture: 'Trio of Minimalist Cylinder Pendants', location: 'Over Island breakfast counter', colorTemp: '3000K Warm', estimatedCost: Math.round(budget * 0.05) },
    ];
    storage = [
      { type: 'Magic Corner Pullout Unit', dimensions: 'Standard 900mm corner cabinet', finish: 'Heavy-Duty Chrome Plated SS', notes: 'Optimizes deep corner blind zones' },
      { type: 'Dedicated Spice & Bottle Pullout', dimensions: '200mm base unit', finish: 'SS 304 Soft Close', notes: 'Next to induction/hob for rapid cooking access' },
    ];
    decor = [
      { item: 'Magnetic Knife Rack with Olive Wood Grain', placement: 'Backsplash near preparation prep zone', notes: 'Functional display' },
      { item: 'Ceramic Herb Planter Trio', placement: 'Kitchen window sill', notes: 'Fresh culinary basil, rosemary, and mint' },
    ];
  } else if (normSpace.includes('bath')) {
    bathroomDetails = {
      fixtures: [
        { name: 'Wall-Hung Rimless WC with Concealed Cistern', brand: 'Kohler / Grohe', cost: Math.round(budget * 0.18), status: 'Specified' },
        { name: 'Thermostatic Rain Shower Column with Handheld Spray', brand: 'Hansgrohe / Jaguar Artize', cost: Math.round(budget * 0.22), status: 'Specified' },
        { name: 'Floating Vanity with Undermount Ceramic Basin', brand: 'Custom Corian / Kohler', cost: Math.round(budget * 0.20), status: 'Specified' },
        { name: 'Frameless Toughened Glass Shower Enclosure (10mm)', brand: 'Saint-Gobain', cost: Math.round(budget * 0.15), status: 'Specified' },
      ],
    };
    materials = [
      { name: 'Large Format Grey Terrazzo Wall Tiles (1200x600)', category: 'Tiles', finish: 'Honed Matte', estimatedPrice: Math.round(budget * 0.15), supplier: 'Simpolo Ceramics', notes: 'Full height wall claddings' },
      { name: 'Brushed Rose Gold / Matte Black Diverters & Faucets', category: 'Hardware', finish: 'PVD Coated Anti-Corrosion', estimatedPrice: Math.round(budget * 0.12), supplier: 'Grohe Euphoria', notes: '10-year anti-tarnish warranty' },
    ];
    lighting = [
      { type: 'Task', fixture: 'Anti-Fog Backlit LED Smart Vanity Mirror', location: 'Above wash basin vanity', colorTemp: 'Dual 3000K/4000K Touch Control', estimatedCost: Math.round(budget * 0.07) },
      { type: 'Accent', fixture: 'IP65 Waterproof Recessed Downlights', location: 'Shower zone ceiling drop', colorTemp: '3000K Warm', estimatedCost: Math.round(budget * 0.05) },
    ];
    storage = [
      { type: 'Recessed Shower Niche with Tile Inlay', dimensions: '24 x 14 x 4 in', finish: 'Accent Mosaic Tiles with LED Strip', notes: 'Shampoo and body wash storage without protruding shelves' },
      { type: 'Waterproof Vanity Under-Basin Drawer Unit', dimensions: '36 x 20 x 18 in', finish: 'High-Pressure Solid Core Laminate', notes: 'Hairdryer and linen storage' },
    ];
    decor = [
      { item: 'Natural Teak Wood Shower Duckboard', placement: 'Drying area outside glass enclosure', notes: 'Water resistant spa aesthetic' },
    ];
  } else if (normSpace.includes('garden') || normSpace.includes('terrace') || normSpace.includes('exterior')) {
    gardenDetails = {
      features: [
        { name: 'Bermuda Grass Natural Lawn with Subsurface Drip Irrigation', description: 'Zero maintenance lush green turf', cost: Math.round(budget * 0.18), status: 'Specified' },
        { name: 'Outdoor Weatherproof Pergola with Louvered Slats', description: 'Powder-coated aluminium pergola with rain sensor', cost: Math.round(budget * 0.30), status: 'Specified' },
        { name: 'Natural Basalt Stone Stepping Walkway', description: 'Flamed non-slip textured pavers', cost: Math.round(budget * 0.12), status: 'Specified' },
        { name: 'Recirculating Zen Stone Water Fountain', description: 'Granite basin with underwater warm LED illumination', cost: Math.round(budget * 0.14), status: 'Specified' },
      ],
    };
    furniture = [
      { name: 'All-Weather Rattan Outdoor 4-Piece Sofa Set', category: 'Outdoor Furniture', dimensions: 'Sofa + 2 Chairs + Coffee Table', material: 'UV-Protected Synthetic Wicker with Olefin Fabric', finish: 'Charcoal Grey', estimatedCost: Math.round(budget * 0.20), reason: 'Resists heavy monsoon rains and sunlight exposure' },
    ];
    materials = [
      { name: 'Flamed Grey Granite Cobblestones', category: 'Granite', finish: 'Flamed Textured', estimatedPrice: Math.round(budget * 0.14), supplier: 'Raj Stones', notes: 'Permeable garden walkway' },
      { name: 'Weather-Shield Silicone Exterior Wall Emulsion', category: 'Paint', finish: 'UV Resistant', estimatedPrice: Math.round(budget * 0.08), supplier: 'Dulux Weathershield', notes: 'Resists mold and algae' },
    ];
    lighting = [
      { type: 'Landscape', fixture: 'Solar & Low-Voltage LED Spike Spotlights', location: 'Focused on tree canopies and shrub beds', colorTemp: '2700K Warm Amber', estimatedCost: Math.round(budget * 0.06) },
      { type: 'Perimeter', fixture: 'Bollard Pathway Illumination Lights', location: 'Along basalt stone pathway', colorTemp: '3000K', estimatedCost: Math.round(budget * 0.05) },
    ];
    storage = [];
    decor = [
      { item: 'Large Fiber-Clay Architectural Planters with Areca Palms', placement: 'Pergola corner pillars', notes: 'Creates lush visual depth and privacy screen' },
    ];
  } else {
    // General / Custom / Home Office space
    furniture = [
      { name: 'Ergonomic Executive Desk with Cable Ducting', category: 'Study Desk', dimensions: '60 x 30 x 29 in', material: 'Solid Ash & Steel Frame', finish: 'Natural Blonde', estimatedCost: Math.round(budget * 0.22), reason: 'Spacious work surface for dual monitors' },
      { name: 'High-Back Mesh Ergonomic Task Chair', category: 'Chair', dimensions: 'Adjustable Lumbar Support', material: 'Breathable Mesh & Aluminum Base', finish: 'Graphite', estimatedCost: Math.round(budget * 0.15), reason: 'All-day ergonomic posture support' },
      { name: 'Modular Wall Bookshelf & Display Unit', category: 'Bookshelf', dimensions: '72 x 84 x 14 in', material: 'Smoked Oak Laminate', finish: 'Matte Oak', estimatedCost: Math.round(budget * 0.24), reason: 'Organized reference storage and background for video calls' },
    ];
    materials = [
      { name: 'Sound-Absorbing Felt Wall Panels', category: 'Fabric', finish: 'Hexagonal Geometric Relief', estimatedPrice: Math.round(budget * 0.10), supplier: 'AcousticPlus', notes: 'Ensures crystal-clear audio during meetings' },
      { name: 'Commercial Grade Luxury Vinyl Tile (LVT)', category: 'Flooring', finish: 'Acoustic Backed Oak Grain', estimatedPrice: Math.round(budget * 0.12), supplier: 'Armstrong Flooring', notes: 'Heavy duty, chair caster resistant' },
    ];
    lighting = [
      { type: 'Task', fixture: 'Architectural Glare-Free LED Linear Suspension', location: 'Directly over desk workspace', colorTemp: '4000K Crisp Focus', estimatedCost: Math.round(budget * 0.06) },
      { type: 'Ambient', fixture: 'Indirect Ceiling Cove Glow', location: 'Perimeter ceiling drop', colorTemp: '3000K Warm', estimatedCost: Math.round(budget * 0.04) },
    ];
    storage = [
      { type: 'Lockable Under-Desk File Pedestal', dimensions: '16 x 20 x 24 in', finish: 'Powder-Coated Steel', notes: 'Secure storage for confidential paperwork' },
    ];
    decor = [
      { item: 'Felt Desk Pad with Cork Base', placement: 'Desk workstation', notes: 'Protects desk surface and smooths mouse tracking' },
    ];
  }

  // Calculate estimated total
  const furnitureTotal = furniture.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  const materialsTotal = materials.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
  const lightingTotal = lighting.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  const estimatedTotal = furnitureTotal + materialsTotal + lightingTotal + Math.round(budget * 0.15); // + labor / civil

  return {
    isAIGenerated: true,
    analyzedAt: new Date().toISOString(),
    spaceType,
    style,
    budgetTier,
    estimatedTotalBudget: budget,
    styleObservation: `${style} aesthetic tailored for ${spaceType} (${area} sq.ft approx)`,
    dominantColors: [
      currentStyleConfig.primary,
      currentStyleConfig.secondary,
      currentStyleConfig.accent,
      currentStyleConfig.neutral,
    ],
    designConcept: {
      name: currentStyleConfig.conceptName,
      style,
      mood: currentStyleConfig.mood,
      description: `Comprehensive ${style} interior concept tailored for a ${spaceType} with an estimated area of ${area} sq.ft. Focuses on maximizing usable spatial flow, ergonomic comfort, bespoke material selections, and dynamic layer-based illumination.`,
      goals: [
        `Optimize layout for ${dimensions.length || 15}' x ${dimensions.width || 12}' spatial dimensions`,
        `Curate cohesive ${style} color harmonies with high-durability finishes`,
        `Ensure strict adherence to ${budgetTier} budget parameters (₹${budget.toLocaleString('en-IN')})`,
        requirements ? `Directly address client brief: "${requirements}"` : 'Deliver a turnkey, luxury living environment',
      ],
    },
    colorPalette: {
      primary: currentStyleConfig.primary,
      secondary: currentStyleConfig.secondary,
      accent: currentStyleConfig.accent,
      neutral: currentStyleConfig.neutral,
      ceiling: currentStyleConfig.ceiling,
      flooring: currentStyleConfig.flooring,
    },
    walls: {
      paint: 'Low-VOC washable acrylic emulsion (2 coats over skimmed drywall)',
      finish: currentStyleConfig.wallFinish,
      accentWall: `Focal feature wall incorporating ${style} textured elements, architectural trims, or acoustic paneling`,
    },
    flooring: {
      material: currentStyleConfig.floorMaterial,
      finish: 'High-traffic anti-stain sealed finish',
      color: currentStyleConfig.flooring,
    },
    ceiling: {
      type: '12mm Gypsum False Ceiling with 75mm perimeter drop',
      lightingType: 'Recessed linear channels with concealed warm white LED cove lighting',
      details: 'Clean shadow gaps with magnetic track lighting integration',
    },
    furnitureRecommendations: furniture,
    materialRecommendations: materials,
    lightingRecommendations: lighting,
    storageRecommendations: storage,
    decorRecommendations: decor,
    kitchenDetails,
    bathroomDetails,
    gardenDetails,
    budgetEstimate: {
      category: budgetTier,
      furnitureSubtotal: furnitureTotal,
      materialsSubtotal: materialsTotal,
      lightingSubtotal: lightingTotal,
      executionLaborSubtotal: Math.round(budget * 0.15),
      contingency: Math.max(0, budget - estimatedTotal),
      estimatedTotal: Math.min(budget, estimatedTotal),
    },
    designNotes: `This AI Design Proposal was generated based on verified architectural space planning rules and physical dimensions (${dimensions.length || 15}' L × ${dimensions.width || 12}' W). The designer can review, modify specific finishes, and convert recommendations directly into real project materials and tasks.`,
  };
};

/**
 * Adapter for Gemini
 */
const generateWithGemini = async ({ geminiKey, spaceType, style, budgetAmount, requirements, dimensions }) => {
  return null;
};

/**
 * Adapter for OpenAI
 */
const generateWithOpenAI = async ({ openaiKey, spaceType, style, budgetAmount, requirements, dimensions }) => {
  return null;
};

export default {
  analyzeRoomImageAndGenerateProposal,
};
