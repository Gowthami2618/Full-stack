import React, { useState, useEffect } from 'react';
import {
  Armchair,
  Layers,
  Search,
  Filter,
  Plus,
  Check,
  Tag,
  DollarSign,
  Sparkles,
  ExternalLink,
  Sliders,
  Box,
} from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import StatusBadge from './StatusBadge';
import { catalogAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const FURNITURE_CATEGORIES = [
  'ALL',
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
];

const MATERIAL_CATEGORIES = [
  'ALL',
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
];

export const CatalogExplorerModal = ({
  isOpen,
  onClose,
  project,
  initialTab = 'furniture',
  onItemAdded,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState(initialTab); // 'furniture' | 'materials'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [addingItemId, setAddingItemId] = useState(null);

  useEffect(() => {
    if (project?.rooms?.length > 0 && !selectedRoomId) {
      setSelectedRoomId(project.rooms[0]._id);
    }
  }, [project, selectedRoomId]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory !== 'ALL') params.category = selectedCategory;
        if (search.trim()) params.search = search.trim();

        if (activeTab === 'furniture') {
          const res = await catalogAPI.getFurniture(params);
          setItems(res.data?.data || []);
        } else {
          const res = await catalogAPI.getMaterials(params);
          setItems(res.data?.data || []);
        }
      } catch (err) {
        console.warn('Error loading catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [isOpen, activeTab, selectedCategory, search]);

  const handleAddToProject = async (item) => {
    if (!project?._id) {
      showToast('No active project found', 'error');
      return;
    }

    try {
      setAddingItemId(item._id);
      if (activeTab === 'furniture') {
        await catalogAPI.addFurnitureToProject({
          projectId: project._id,
          roomId: selectedRoomId || (project.rooms?.[0]?._id || ''),
          furnitureId: item._id,
          customQuantity: 1,
        });
        showToast(`Added "${item.name}" to project space!`, 'success');
      } else {
        await catalogAPI.addMaterialToProject({
          projectId: project._id,
          roomId: selectedRoomId || (project.rooms?.[0]?._id || ''),
          materialId: item._id,
          quantityRequired: '1',
        });
        showToast(`Associated material "${item.name}" with space!`, 'success');
      }

      if (onItemAdded) onItemAdded();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add catalog item.';
      showToast(msg, 'error');
    } finally {
      setAddingItemId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Architectural & Furniture Catalog"
      size="2xl"
    >
      <div className="flex flex-col gap-5">
        {/* Top Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-sky-400/20">
          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl glass-panel border border-sky-400/20">
            <button
              type="button"
              onClick={() => {
                setActiveTab('furniture');
                setSelectedCategory('ALL');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'furniture'
                  ? 'bg-sky-500 text-white shadow-glass-glow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-sky-400'
              }`}
            >
              <Armchair className="w-3.5 h-3.5" />
              Furniture Catalog
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('materials');
                setSelectedCategory('ALL');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'materials'
                  ? 'bg-sky-500 text-white shadow-glass-glow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-sky-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Material Catalog
            </button>
          </div>

          {/* Target Room Selector */}
          {project?.rooms?.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target Space:</span>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="text-xs glass-input border border-sky-400/30 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white font-medium"
              >
                {project.rooms.map((r) => (
                  <option key={r._id} value={r._id} className="bg-charcoal-900 text-white">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Search & Category Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeTab} by name, supplier, or material...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 glass-input border border-sky-400/30 rounded-xl text-slate-900 dark:text-white"
            />
          </div>
          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs glass-input border border-sky-400/30 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            >
              {(activeTab === 'furniture' ? FURNITURE_CATEGORIES : MATERIAL_CATEGORIES).map((cat) => (
                <option key={cat} value={cat} className="bg-charcoal-900 text-white">
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
            No items matching your search or category filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[500px] overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-sky-400/20 glass-panel overflow-hidden flex flex-col justify-between group hover:border-sky-400/40 transition-all"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-charcoal-900/80 text-sky-300 backdrop-blur-md">
                    {item.category}
                  </span>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                    ${item.price?.toLocaleString()} {activeTab === 'materials' ? `/${item.unit || 'sq.ft'}` : ''}
                  </span>
                </div>

                <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-950 dark:text-white line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.description || item.material || item.finish}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                      <span>By: {item.supplier || item.brand || 'Atelier'}</span>
                      {item.finish && <span>• {item.finish}</span>}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    loading={addingItemId === item._id}
                    onClick={() => handleAddToProject(item)}
                    icon={Plus}
                    className="w-full text-xs font-bold mt-1"
                  >
                    Add to Space
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-sky-400/20 text-xs text-slate-500 dark:text-slate-400">
          <span>{items.length} Catalog items available</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close Explorer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CatalogExplorerModal;
