import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Layers,
  Armchair,
  Utensils,
  Bath,
  Trees,
  Home,
  Plus,
  Trash2,
  CheckCircle2,
  Send,
  Image as ImageIcon,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';
import Tabs from './Tabs';
import StatusBadge from './StatusBadge';

const DESIGN_STYLES = [
  'Modern',
  'Minimalist',
  'Contemporary',
  'Luxury',
  'Scandinavian',
  'Industrial',
  'Rustic',
  'Traditional',
  'Japandi',
  'Indian Contemporary',
  'Bohemian',
  'Custom',
];

const MATERIAL_CATEGORIES = [
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
];

const KITCHEN_LAYOUTS = [
  'Straight',
  'L-shaped',
  'U-shaped',
  'Parallel',
  'Island',
  'Peninsula',
];

const DEFAULT_PALETTES = [
  { name: 'Warm Minimalist', primary: '#FDFBF7', secondary: '#E6DEC8', accent: '#D8B244', ceiling: '#FFFFFF', flooring: '#A47551' },
  { name: 'Nordic Sky', primary: '#F0F9FF', secondary: '#BAE6FD', accent: '#0284C7', ceiling: '#FFFFFF', flooring: '#D1D5DB' },
  { name: 'Modern Luxury', primary: '#0F172A', secondary: '#334155', accent: '#38BDF8', ceiling: '#F8FAFC', flooring: '#1E293B' },
  { name: 'Japandi Earth', primary: '#FAF7F2', secondary: '#D3C5B4', accent: '#8C7A6B', ceiling: '#FAF7F2', flooring: '#654321' },
  { name: 'Indian Contemporary', primary: '#FFF7ED', secondary: '#FED7AA', accent: '#EA580C', ceiling: '#FFFFFF', flooring: '#78350F' },
];

export const RoomDesignerModal = ({
  isOpen,
  onClose,
  room,
  projectId,
  onSaveRoom,
  onSubmitForReview,
}) => {
  if (!room) return null;

  const [activeTab, setActiveTab] = useState('concept');
  const [formData, setFormData] = useState({
    name: room.name || '',
    category: room.category || 'General',
    dimensions: room.dimensions || '',
    area: room.area || 0,
    budget: room.budget || 0,
    style: room.style || 'Modern',
    colorPalette: room.colorPalette || {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      accent: '#38BDF8',
      ceiling: '#FFFFFF',
      flooring: '#78350F',
    },
    designerNotes: room.designerNotes || '',
    furniture: room.furniture || [],
    materials: room.materials || [],
    kitchenDetails: room.kitchenDetails || { layout: 'L-shaped', components: [] },
    bathroomDetails: room.bathroomDetails || { fixtures: [] },
    gardenDetails: room.gardenDetails || { features: [] },
    exteriorDetails: room.exteriorDetails || { features: [] },
    photos: room.photos || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sub-item temporary forms
  const [newFurniture, setNewFurniture] = useState({
    name: '',
    quantity: 1,
    estimatedCost: '',
    vendor: '',
    photo: '',
    notes: '',
  });

  const [newMaterial, setNewMaterial] = useState({
    name: '',
    category: 'Flooring',
    price: '',
    supplier: '',
    color: '',
    finish: '',
    notes: '',
    photo: '',
  });

  const [newPhoto, setNewPhoto] = useState({ url: '', caption: '', type: 'concept' });

  // Specialized planners temporary forms
  const [newKitchenComp, setNewKitchenComp] = useState({ name: 'Cabinets', specifiedMaterial: '', cost: '' });
  const [newBathFixture, setNewBathFixture] = useState({ name: 'Vanity & Basin', brand: '', cost: '' });
  const [newGardenFeature, setNewGardenFeature] = useState({ name: 'Lawn & Planters', description: '', cost: '' });
  const [newExteriorFeature, setNewExteriorFeature] = useState({ name: 'Front Elevation Finish', description: '', cost: '' });

  const handleColorChange = (key, val) => {
    setFormData((prev) => ({
      ...prev,
      colorPalette: { ...prev.colorPalette, [key]: val },
    }));
  };

  const applyPalette = (palette) => {
    setFormData((prev) => ({
      ...prev,
      colorPalette: {
        primary: palette.primary,
        secondary: palette.secondary,
        accent: palette.accent,
        ceiling: palette.ceiling,
        flooring: palette.flooring,
      },
    }));
  };

  // Add Item Handlers
  const handleAddFurniture = () => {
    if (!newFurniture.name) return;
    setFormData((prev) => ({
      ...prev,
      furniture: [
        ...prev.furniture,
        { ...newFurniture, estimatedCost: Number(newFurniture.estimatedCost) || 0 },
      ],
    }));
    setNewFurniture({ name: '', quantity: 1, estimatedCost: '', vendor: '', photo: '', notes: '' });
  };

  const handleRemoveFurniture = (idx) => {
    setFormData((prev) => ({
      ...prev,
      furniture: prev.furniture.filter((_, i) => i !== idx),
    }));
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name) return;
    setFormData((prev) => ({
      ...prev,
      materials: [
        ...prev.materials,
        { ...newMaterial, price: Number(newMaterial.price) || 0 },
      ],
    }));
    setNewMaterial({ name: '', category: 'Flooring', price: '', supplier: '', color: '', finish: '', notes: '', photo: '' });
  };

  const handleRemoveMaterial = (idx) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== idx),
    }));
  };

  const handleAddPhoto = () => {
    if (!newPhoto.url) return;
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, { ...newPhoto, date: new Date() }],
    }));
    setNewPhoto({ url: '', caption: '', type: 'concept' });
  };

  const handleRemovePhoto = (idx) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  };

  const handleAddKitchenComp = () => {
    if (!newKitchenComp.name) return;
    setFormData((prev) => ({
      ...prev,
      kitchenDetails: {
        ...prev.kitchenDetails,
        components: [
          ...(prev.kitchenDetails?.components || []),
          { ...newKitchenComp, cost: Number(newKitchenComp.cost) || 0, status: 'Specified' },
        ],
      },
    }));
    setNewKitchenComp({ name: 'Countertop', specifiedMaterial: '', cost: '' });
  };

  const handleSave = async (submitReview = false) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        designStatus: submitReview ? 'Submitted' : formData.designStatus || 'Draft',
      };
      await onSaveRoom(room._id, payload);
      if (submitReview && onSubmitForReview) {
        await onSubmitForReview(room._id);
      }
      onClose();
    } catch (err) {
      console.error('Failed to save room design:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'concept', label: 'Concept & Palette', icon: Palette },
    { id: 'furniture', label: `Furniture (${formData.furniture.length})`, icon: Armchair },
    { id: 'materials', label: `Materials (${formData.materials.length})`, icon: Layers },
    ...(formData.name.toLowerCase().includes('kitchen')
      ? [{ id: 'kitchen', label: 'Kitchen Planner', icon: Utensils }]
      : []),
    ...(formData.name.toLowerCase().includes('bath')
      ? [{ id: 'bathroom', label: 'Bathroom Planner', icon: Bath }]
      : []),
    ...(formData.name.toLowerCase().includes('garden') || formData.name.toLowerCase().includes('terrace')
      ? [{ id: 'garden', label: 'Garden & Landscape', icon: Trees }]
      : []),
    ...(formData.name.toLowerCase().includes('exterior') || formData.name.toLowerCase().includes('entrance')
      ? [{ id: 'exterior', label: 'Exterior Elevation', icon: Home }]
      : []),
    { id: 'renders', label: `Design Visuals (${formData.photos.length})`, icon: ImageIcon },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-slate-100">
                Spatial Designer Studio: {formData.name}
              </span>
              <StatusBadge status={room.designStatus || 'Draft'} />
            </div>
            <span className="text-xs text-slate-400">
              Architectural Concept & Material Specification
            </span>
          </div>
        </div>
      }
      size="2xl"
    >
      <div className="flex flex-col gap-6">
        {/* Navigation Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* TAB 1: CONCEPT & COLOR PALETTE */}
        {activeTab === 'concept' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Interior Design Style"
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                options={DESIGN_STYLES}
              />
              <Input
                label="Dimensions (e.g. 16 x 14 ft)"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="16 x 14 ft"
              />
              <Input
                label="Allocated Room Budget ($)"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              />
            </div>

            {/* Curated Color Palettes Quick Select */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
                Preset Designer Color Palettes
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {DEFAULT_PALETTES.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => applyPalette(p)}
                    className="flex flex-col p-2.5 rounded-xl glass-panel border border-sky-400/20 hover:border-sky-400/60 transition-all text-left group"
                  >
                    <span className="text-[11px] font-semibold text-slate-200 group-hover:text-sky-300 truncate mb-2">
                      {p.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {[p.primary, p.secondary, p.accent, p.flooring].map((c, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom HEX Color Palette Controls */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
                Custom Color Palette & Material Tones (HEX)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { key: 'primary', label: 'Primary Wall' },
                  { key: 'secondary', label: 'Secondary Tone' },
                  { key: 'accent', label: 'Accent Feature' },
                  { key: 'ceiling', label: 'Ceiling Tone' },
                  { key: 'flooring', label: 'Floor Finish' },
                ].map((item) => (
                  <div key={item.key} className="flex flex-col gap-1.5 p-3 rounded-xl glass-panel border border-sky-400/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-slate-300">{item.label}</span>
                      <div
                        className="w-5 h-5 rounded-full border border-white/30 shadow-sm"
                        style={{ backgroundColor: formData.colorPalette[item.key] }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.colorPalette[item.key] || '#ffffff'}
                        onChange={(e) => handleColorChange(item.key, e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.colorPalette[item.key] || ''}
                        onChange={(e) => handleColorChange(item.key, e.target.value)}
                        className="w-full text-xs bg-charcoal-900 border border-sky-400/30 rounded px-1.5 py-1 text-slate-100 font-mono"
                        placeholder="#HEX"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Designer Spatial Concept Notes */}
            <Textarea
              label="Designer Spatial Intent & Concept Notes"
              value={formData.designerNotes}
              onChange={(e) => setFormData({ ...formData, designerNotes: e.target.value })}
              placeholder="Describe the architectural concept, natural lighting considerations, custom carpentry, and focal points..."
              rows={3}
            />
          </div>
        )}

        {/* TAB 2: FURNITURE PLANNER */}
        {activeTab === 'furniture' && (
          <div className="flex flex-col gap-5">
            {/* Add Furniture Form */}
            <div className="p-4 rounded-xl glass-panel border border-sky-400/25 flex flex-col gap-3">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Bespoke or Catalog Furniture
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Input
                  label="Item Name"
                  placeholder="e.g. King Platform Bed with Fluted Headboard"
                  value={newFurniture.name}
                  onChange={(e) => setNewFurniture({ ...newFurniture, name: e.target.value })}
                />
                <Input
                  label="Quantity"
                  type="number"
                  value={newFurniture.quantity}
                  onChange={(e) => setNewFurniture({ ...newFurniture, quantity: Number(e.target.value) })}
                />
                <Input
                  label="Est. Cost ($)"
                  type="number"
                  placeholder="1200"
                  value={newFurniture.estimatedCost}
                  onChange={(e) => setNewFurniture({ ...newFurniture, estimatedCost: e.target.value })}
                />
                <Input
                  label="Vendor / Brand"
                  placeholder="e.g. Poliform / Custom Millwork"
                  value={newFurniture.vendor}
                  onChange={(e) => setNewFurniture({ ...newFurniture, vendor: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Input
                  label="Photo / Reference URL (Optional)"
                  placeholder="https://..."
                  value={newFurniture.photo}
                  onChange={(e) => setNewFurniture({ ...newFurniture, photo: e.target.value })}
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddFurniture}
                  className="self-end mb-1"
                  icon={Plus}
                >
                  Add Piece
                </Button>
              </div>
            </div>

            {/* Furniture Inventory List */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-300">
                Planned Furniture Pieces ({formData.furniture.length})
              </span>
              {formData.furniture.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 glass-panel rounded-xl border border-dashed border-sky-400/20">
                  No furniture items specified yet. Add custom beds, sofas, wardrobes, dining sets, or desks above.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {formData.furniture.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between p-3 rounded-xl glass-panel border border-sky-400/20 group hover:border-sky-400/40 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border border-sky-400/30 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0">
                            <Armchair className="w-5 h-5" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-100">{item.name}</span>
                          <span className="text-[11px] text-sky-300">
                            Qty: {item.quantity} • ${item.estimatedCost?.toLocaleString()}
                          </span>
                          {item.vendor && (
                            <span className="text-[10px] text-slate-400">Vendor: {item.vendor}</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFurniture(idx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MATERIALS SELECTOR */}
        {activeTab === 'materials' && (
          <div className="flex flex-col gap-5">
            {/* Add Material Form */}
            <div className="p-4 rounded-xl glass-panel border border-sky-400/25 flex flex-col gap-3">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Specify Architectural Material / Finish
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Input
                  label="Material Name"
                  placeholder="e.g. Italian Carrara Marble / Fluted Oak"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                />
                <Select
                  label="Category"
                  value={newMaterial.category}
                  onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                  options={MATERIAL_CATEGORIES}
                />
                <Input
                  label="Est. Cost / Sq.Ft ($)"
                  type="number"
                  placeholder="45"
                  value={newMaterial.price}
                  onChange={(e) => setNewMaterial({ ...newMaterial, price: e.target.value })}
                />
                <Input
                  label="Finish / Texture"
                  placeholder="Honed / Matte / Brushed"
                  value={newMaterial.finish}
                  onChange={(e) => setNewMaterial({ ...newMaterial, finish: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Input
                  label="Supplier / Brand"
                  placeholder="e.g. StoneSource / Benjamin Moore"
                  value={newMaterial.supplier}
                  onChange={(e) => setNewMaterial({ ...newMaterial, supplier: e.target.value })}
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddMaterial}
                  className="self-end mb-1"
                  icon={Plus}
                >
                  Add Material
                </Button>
              </div>
            </div>

            {/* Materials List */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-300">
                Specified Materials ({formData.materials.length})
              </span>
              {formData.materials.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 glass-panel rounded-xl border border-dashed border-sky-400/20">
                  No materials specified yet. Define floorings, marbles, granites, paints, wallpapers, or fabrics above.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {formData.materials.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between p-3 rounded-xl glass-panel border border-sky-400/20 group hover:border-sky-400/40 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-100">{item.name}</span>
                          <span className="text-[11px] text-sky-300">
                            {item.category} • ${item.price?.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Finish: {item.finish || 'Standard'} {item.supplier && `• ${item.supplier}`}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(idx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: KITCHEN PLANNER (Dedicated) */}
        {activeTab === 'kitchen' && (
          <div className="flex flex-col gap-5">
            <div className="p-4 rounded-xl glass-panel border border-sky-400/25 flex flex-col gap-4">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                Kitchen Layout Configuration
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {KITCHEN_LAYOUTS.map((layout) => (
                  <button
                    key={layout}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        kitchenDetails: { ...prev.kitchenDetails, layout },
                      }))
                    }
                    className={`p-3 rounded-xl border text-center transition-all ${
                      formData.kitchenDetails?.layout === layout
                        ? 'border-sky-400 bg-sky-500/20 text-sky-300 font-bold shadow-glass-glow'
                        : 'border-sky-400/20 glass-panel text-slate-300 hover:border-sky-400/50'
                    }`}
                  >
                    <Utensils className="w-4 h-4 mx-auto mb-1 text-sky-400" />
                    <span className="text-xs">{layout}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add Component to Kitchen */}
            <div className="p-4 rounded-xl glass-panel border border-sky-400/20 flex flex-col sm:flex-row items-center gap-3">
              <Select
                label="Kitchen Element"
                value={newKitchenComp.name}
                onChange={(e) => setNewKitchenComp({ ...newKitchenComp, name: e.target.value })}
                options={[
                  'Cabinets & Millwork',
                  'Quartz / Granite Countertop',
                  'Undermount Sink & Faucet',
                  'Induction Hob / Gas Burner',
                  'Ducted Island Chimney',
                  'Built-in Refrigerator',
                  'Convection Oven',
                  'Microwave Unit',
                  'Integrated Dishwasher',
                  'Pantry Tall Storage',
                ]}
                className="w-full sm:w-1/3"
              />
              <Input
                label="Material Specification"
                placeholder="Acrylic / Marine Ply / Quartz"
                value={newKitchenComp.specifiedMaterial}
                onChange={(e) => setNewKitchenComp({ ...newKitchenComp, specifiedMaterial: e.target.value })}
                className="w-full sm:w-1/3"
              />
              <Input
                label="Est. Cost ($)"
                type="number"
                placeholder="1500"
                value={newKitchenComp.cost}
                onChange={(e) => setNewKitchenComp({ ...newKitchenComp, cost: e.target.value })}
                className="w-full sm:w-1/4"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddKitchenComp}
                className="self-end sm:self-center mt-4"
                icon={Plus}
              >
                Add
              </Button>
            </div>

            {/* Kitchen Component List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {(formData.kitchenDetails?.components || []).map((comp, i) => (
                <div key={i} className="p-3 rounded-xl glass-panel border border-sky-400/20 flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-100">{comp.name}</span>
                    <span className="text-[11px] text-sky-300">
                      {comp.specifiedMaterial || 'Standard'} • ${comp.cost?.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/30">
                    {comp.status || 'Specified'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DESIGN VISUALS & RENDERS */}
        {activeTab === 'renders' && (
          <div className="flex flex-col gap-5">
            <div className="p-4 rounded-xl glass-panel border border-sky-400/25 flex flex-col sm:flex-row items-center gap-3">
              <Input
                label="3D Render / Inspiration URL"
                placeholder="https://images.unsplash.com/..."
                value={newPhoto.url}
                onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                className="flex-1"
              />
              <Input
                label="Caption"
                placeholder="e.g. Master Suite Concept View"
                value={newPhoto.caption}
                onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                className="flex-1"
              />
              <Select
                label="Type"
                value={newPhoto.type}
                onChange={(e) => setNewPhoto({ ...newPhoto, type: e.target.value })}
                options={['concept', 'before', 'after', 'progress']}
                className="w-32"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddPhoto}
                className="self-end sm:self-center mt-4"
                icon={Plus}
              >
                Add Photo
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto">
              {formData.photos.map((photo, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden glass-panel border border-sky-400/20 group">
                  <img src={photo.url} alt={photo.caption} className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-end">
                    <span className="text-xs font-semibold text-white truncate">{photo.caption || 'Render'}</span>
                    <span className="text-[10px] text-sky-300 uppercase">{photo.type}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-charcoal-900/80 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-sky-400/20">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              loading={isSubmitting}
              onClick={() => handleSave(false)}
            >
              Save Concept Draft
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={isSubmitting}
              onClick={() => handleSave(true)}
              icon={Send}
            >
              Submit Design to Client
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RoomDesignerModal;
