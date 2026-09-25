import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus,
  ArrowLeft,
  ArrowRight,
  Home,
  Camera,
  DollarSign,
  Grid,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  MapPin,
  Maximize2,
  Layers,
  Utensils,
  Bed,
  Bath,
  Trees,
} from 'lucide-react';
import { projectsAPI, usersAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import GlassCard from '../../components/common/GlassCard';
import ProgressBar from '../../components/common/ProgressBar';

const PROPERTY_TYPES = [
  'Villa',
  'Apartment',
  'Independent House',
  'Duplex',
  'Studio',
  'Other',
];

const CONSTRUCTION_STATUSES = [
  'Ready to Move',
  'Under Renovation',
  'Bare Shell',
  'New Construction',
  'Planning',
];

const DEFAULT_ROOM_OPTIONS = [
  { name: 'Living Room', category: 'Living', dimensions: '20 x 16 ft', area: 320, budgetRatio: 0.22, style: 'Modern' },
  { name: 'Dining Room', category: 'Dining', dimensions: '14 x 12 ft', area: 168, budgetRatio: 0.10, style: 'Modern' },
  { name: 'Kitchen', category: 'Kitchen', dimensions: '14 x 10 ft', area: 140, budgetRatio: 0.18, style: 'Modern' },
  { name: 'Master Bedroom', category: 'Bedroom', dimensions: '18 x 15 ft', area: 270, budgetRatio: 0.20, style: 'Luxury' },
  { name: 'Bedroom 2', category: 'Bedroom', dimensions: '14 x 13 ft', area: 182, budgetRatio: 0.12, style: 'Contemporary' },
  { name: 'Bedroom 3', category: 'Bedroom', dimensions: '13 x 12 ft', area: 156, budgetRatio: 0.08, style: 'Modern' },
  { name: 'Bathroom 1', category: 'Bathroom', dimensions: '9 x 6 ft', area: 54, budgetRatio: 0.05, style: 'Modern' },
  { name: 'Bathroom 2', category: 'Bathroom', dimensions: '8 x 6 ft', area: 48, budgetRatio: 0.05, style: 'Modern' },
  { name: 'Balcony', category: 'Outdoor', dimensions: '14 x 5 ft', area: 70, budgetRatio: 0.04, style: 'Minimalist' },
  { name: 'Home Office', category: 'Work', dimensions: '12 x 10 ft', area: 120, budgetRatio: 0.08, style: 'Industrial' },
  { name: 'Pooja Room', category: 'Sacred', dimensions: '8 x 6 ft', area: 48, budgetRatio: 0.03, style: 'Traditional' },
  { name: 'Utility Room', category: 'Utility', dimensions: '8 x 5 ft', area: 40, budgetRatio: 0.03, style: 'Minimalist' },
  { name: 'Garden', category: 'Outdoor', dimensions: '30 x 15 ft', area: 450, budgetRatio: 0.08, style: 'Contemporary' },
  { name: 'Terrace', category: 'Outdoor', dimensions: '25 x 20 ft', area: 500, budgetRatio: 0.07, style: 'Modern' },
  { name: 'Entrance & Foyer', category: 'Entrance', dimensions: '10 x 8 ft', area: 80, budgetRatio: 0.04, style: 'Modern' },
  { name: 'Exterior Elevation', category: 'Exterior', dimensions: 'Full Facade', area: 600, budgetRatio: 0.10, style: 'Contemporary' },
];

export const NewProjectPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [designers, setDesigners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Property
  const [propertyData, setPropertyData] = useState({
    title: 'My Dream Luxury Villa',
    description: 'Complete bespoke interior design, carpentry, luxury lighting, and turnkey contractor fit-out for our family home.',
    propertyType: 'Villa',
    location: 'Palm Avenue, Silicon Valley',
    city: 'San Francisco',
    floors: 2,
    totalArea: 2400,
    bedrooms: 3,
    bathrooms: 3,
    constructionStatus: 'Ready to Move',
    preferredStyle: 'Modern',
    designerId: '',
  });

  // Step 2: House Photos
  const [housePhotos, setHousePhotos] = useState([
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Front Exterior Facade',
      roomType: 'Exterior',
      tag: 'before',
    },
    {
      url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      caption: 'Living Room Current Condition',
      roomType: 'Living Room',
      tag: 'before',
    },
    {
      url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      caption: 'Kitchen Space Before Fit-out',
      roomType: 'Kitchen',
      tag: 'before',
    },
  ]);
  const [newPhoto, setNewPhoto] = useState({ url: '', caption: '', roomType: 'Exterior', tag: 'before' });

  // Step 3: Budget
  const [totalBudget, setTotalBudget] = useState(1500000);
  const [budgetAllocation, setBudgetAllocation] = useState({
    interior: 600000,
    furniture: 300000,
    kitchen: 200000,
    bathrooms: 100000,
    electrical: 75000,
    flooring: 75000,
    paint: 50000,
    garden: 100000,
    exterior: 100000,
    contingency: 100000,
  });

  // Step 4: Rooms / Spaces
  const [selectedRooms, setSelectedRooms] = useState(
    DEFAULT_ROOM_OPTIONS.slice(0, 8).map((r) => ({
      ...r,
      budget: Math.round(1500000 * r.budgetRatio),
      designStatus: 'Draft',
      executionStatus: 'Pending',
    }))
  );
  const [customRoomName, setCustomRoomName] = useState('');
  const [showCustomRoomInput, setShowCustomRoomInput] = useState(false);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const res = await usersAPI.getProfessionals({ role: 'DESIGNER' });
        if (res.data?.data) {
          setDesigners(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load designers:', err);
      }
    };
    fetchDesigners();
  }, []);

  // Update budget allocations whenever total budget changes
  const handleTotalBudgetChange = (val) => {
    const total = Number(val) || 0;
    setTotalBudget(total);
    setBudgetAllocation({
      interior: Math.round(total * 0.4),
      furniture: Math.round(total * 0.2),
      kitchen: Math.round(total * 0.13),
      bathrooms: Math.round(total * 0.07),
      electrical: Math.round(total * 0.05),
      flooring: Math.round(total * 0.05),
      paint: Math.round(total * 0.03),
      garden: Math.round(total * 0.04),
      exterior: Math.round(total * 0.03),
      contingency: Math.round(total * 0.1),
    });
  };

  const handleAddPhoto = () => {
    if (!newPhoto.url) return;
    setHousePhotos([...housePhotos, { ...newPhoto, uploadedAt: new Date() }]);
    setNewPhoto({ url: '', caption: '', roomType: 'Exterior', tag: 'before' });
  };

  const handleRemovePhoto = (idx) => {
    setHousePhotos(housePhotos.filter((_, i) => i !== idx));
  };

  const toggleRoomSelection = (roomOption) => {
    const exists = selectedRooms.find((r) => r.name === roomOption.name);
    if (exists) {
      setSelectedRooms(selectedRooms.filter((r) => r.name !== roomOption.name));
    } else {
      setSelectedRooms([
        ...selectedRooms,
        {
          ...roomOption,
          budget: Math.round(totalBudget * (roomOption.budgetRatio || 0.1)),
          designStatus: 'Draft',
          executionStatus: 'Pending',
        },
      ]);
    }
  };

  const handleAddCustomRoom = () => {
    if (!customRoomName.trim()) return;
    const newRoom = {
      name: customRoomName.trim(),
      category: 'Custom Space',
      dimensions: '15 x 12 ft',
      area: 180,
      budget: Math.round(totalBudget * 0.08),
      style: propertyData.preferredStyle,
      designStatus: 'Draft',
      executionStatus: 'Pending',
    };
    setSelectedRooms([...selectedRooms, newRoom]);
    setCustomRoomName('');
    setShowCustomRoomInput(false);
  };

  const handleSubmit = async () => {
    if (!propertyData.title || !propertyData.location || !totalBudget) {
      showToast('Please complete required property fields and total budget.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        title: propertyData.title,
        description: propertyData.description,
        propertyType: propertyData.propertyType,
        projectType: 'Full Home',
        location: propertyData.location,
        totalBudget: Number(totalBudget),
        preferredStyle: propertyData.preferredStyle,
        designerId: propertyData.designerId || undefined,
        images: housePhotos.map((p) => p.url),
        propertyDetails: {
          city: propertyData.city,
          floors: Number(propertyData.floors),
          totalArea: Number(propertyData.totalArea),
          bedrooms: Number(propertyData.bedrooms),
          bathrooms: Number(propertyData.bathrooms),
          constructionStatus: propertyData.constructionStatus,
        },
        budgetAllocation: {
          ...budgetAllocation,
          totalBudget: Number(totalBudget),
        },
        housePhotos,
        rooms: selectedRooms,
      };

      const res = await projectsAPI.createProject(payload);
      const created = res.data?.data;
      showToast('🎉 House Project created successfully with all rooms and spaces initialized!', 'success');
      navigate(`/projects/${created._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create house project.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Property', icon: Home },
    { num: 2, label: 'House Photos', icon: Camera },
    { num: 3, label: 'Budget Allocation', icon: DollarSign },
    { num: 4, label: 'House Spaces', icon: Grid },
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-12">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate(-1))}
          icon={ArrowLeft}
        >
          {currentStep > 1 ? 'Previous Step' : 'Back to Dashboard'}
        </Button>
        <span className="text-xs text-sky-400 font-semibold uppercase tracking-wider">
          Step {currentStep} of 4: {steps[currentStep - 1].label}
        </span>
      </div>

      <GlassCard className="border-sky-400/25 p-6 sm:p-10 shadow-2xl">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-sky-400/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-400/20">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
                Create Complete House Project
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Define property blueprint, initial site photos, financial allocations, and individual spaces
              </p>
            </div>
          </div>
        </div>

        {/* Wizard Steps Bar */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.num;
            const isActive = currentStep === s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                  isActive
                    ? 'border-sky-400 bg-sky-500/20 text-sky-600 dark:text-sky-300 font-bold shadow-glass-glow'
                    : isCompleted
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-sky-400/10 glass-panel text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* STEP 1: PROPERTY FUNDAMENTALS */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Home className="w-4 h-4" /> 1. Property Blueprint & Location
            </h3>

            <Input
              label="House / Project Name"
              placeholder="e.g. My Dream Luxury Villa"
              value={propertyData.title}
              onChange={(e) => setPropertyData({ ...propertyData, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Property Type"
                value={propertyData.propertyType}
                onChange={(e) => setPropertyData({ ...propertyData, propertyType: e.target.value })}
                options={PROPERTY_TYPES}
              />
              <Select
                label="Construction Status"
                value={propertyData.constructionStatus}
                onChange={(e) => setPropertyData({ ...propertyData, constructionStatus: e.target.value })}
                options={CONSTRUCTION_STATUSES}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Street Address / Community"
                placeholder="e.g. 104 Ocean View Crescent"
                value={propertyData.location}
                onChange={(e) => setPropertyData({ ...propertyData, location: e.target.value })}
                required
              />
              <Input
                label="City / Metro Area"
                placeholder="e.g. San Francisco, CA"
                value={propertyData.city}
                onChange={(e) => setPropertyData({ ...propertyData, city: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="Floors"
                type="number"
                value={propertyData.floors}
                onChange={(e) => setPropertyData({ ...propertyData, floors: Number(e.target.value) })}
              />
              <Input
                label="Total Area (Sq.Ft)"
                type="number"
                value={propertyData.totalArea}
                onChange={(e) => setPropertyData({ ...propertyData, totalArea: Number(e.target.value) })}
              />
              <Input
                label="Bedrooms"
                type="number"
                value={propertyData.bedrooms}
                onChange={(e) => setPropertyData({ ...propertyData, bedrooms: Number(e.target.value) })}
              />
              <Input
                label="Bathrooms"
                type="number"
                value={propertyData.bathrooms}
                onChange={(e) => setPropertyData({ ...propertyData, bathrooms: Number(e.target.value) })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Preferred Architectural Style"
                value={propertyData.preferredStyle}
                onChange={(e) => setPropertyData({ ...propertyData, preferredStyle: e.target.value })}
                options={[
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
                ]}
              />
              <Select
                label="Assign Lead Interior Designer (Optional)"
                value={propertyData.designerId}
                onChange={(e) => setPropertyData({ ...propertyData, designerId: e.target.value })}
                options={[
                  { value: '', label: 'Open to marketplace designers' },
                  ...designers.map((d) => ({
                    value: d._id,
                    label: `${d.name} (${d.specialty || 'Lead Interior Architect'})`,
                  })),
                ]}
              />
            </div>

            <Textarea
              label="Brief & Vision Description"
              value={propertyData.description}
              onChange={(e) => setPropertyData({ ...propertyData, description: e.target.value })}
              rows={3}
            />
          </div>
        )}

        {/* STEP 2: HOUSE PHOTOS */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4" /> 2. House & Site Photos (Before & Inspiration)
            </h3>
            <p className="text-xs text-slate-400">
              Upload or link original site photos, current conditions, and inspirational references.
            </p>

            {/* Photo Input Bar */}
            <div className="p-4 rounded-xl glass-panel border border-sky-400/25 flex flex-col sm:flex-row items-center gap-3">
              <Input
                label="Image URL"
                placeholder="https://..."
                value={newPhoto.url}
                onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                className="flex-1"
              />
              <Input
                label="Caption"
                placeholder="e.g. Master Bedroom Before"
                value={newPhoto.caption}
                onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                className="flex-1"
              />
              <Select
                label="Room Space"
                value={newPhoto.roomType}
                onChange={(e) => setNewPhoto({ ...newPhoto, roomType: e.target.value })}
                options={[
                  'Exterior',
                  'Living Room',
                  'Dining Room',
                  'Kitchen',
                  'Master Bedroom',
                  'Bedroom',
                  'Bathroom',
                  'Balcony',
                  'Garden',
                  'Terrace',
                  'Entrance',
                  'Other',
                ]}
                className="w-36"
              />
              <Select
                label="Tag"
                value={newPhoto.tag}
                onChange={(e) => setNewPhoto({ ...newPhoto, tag: e.target.value })}
                options={[
                  { value: 'before', label: 'Before Site' },
                  { value: 'inspiration', label: 'Inspiration' },
                  { value: 'current', label: 'Current' },
                ]}
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

            {/* Photos Grid Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {housePhotos.map((photo, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden glass-panel border border-sky-400/20 group">
                  <img src={photo.url} alt={photo.caption} className="w-full h-36 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2.5 flex flex-col justify-end">
                    <span className="text-xs font-semibold text-white truncate">{photo.caption || 'Site Photo'}</span>
                    <span className="text-[10px] text-sky-300 uppercase">{photo.roomType} • {photo.tag}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(i)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-charcoal-900/80 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: BUDGET ALLOCATION */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold text-sky-500 dark:text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> 3. Total Project Budget & Category Allocations
            </h3>

            {/* Total Budget Input */}
            <div className="p-6 rounded-2xl glass-panel border border-sky-400/30 bg-sky-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-sky-600 dark:text-sky-300 uppercase tracking-widest">
                  Total House Fit-out Budget
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-slate-100 mt-1">
                  ${totalBudget.toLocaleString()}
                </h2>
              </div>
              <div className="w-full sm:w-64">
                <Input
                  label="Adjust Total ($)"
                  type="number"
                  value={totalBudget}
                  onChange={(e) => handleTotalBudgetChange(e.target.value)}
                />
              </div>
            </div>

            {/* Granular Breakdown Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {[
                { key: 'interior', label: 'Interior Fit-out' },
                { key: 'furniture', label: 'Loose & Custom Furniture' },
                { key: 'kitchen', label: 'Modular Kitchen' },
                { key: 'bathrooms', label: 'Bathrooms & Sanitary' },
                { key: 'electrical', label: 'Electrical & Automation' },
                { key: 'flooring', label: 'Flooring & Tiling' },
                { key: 'paint', label: 'Wall Paint & Polish' },
                { key: 'garden', label: 'Garden & Landscape' },
                { key: 'exterior', label: 'Exterior & Facade' },
                { key: 'contingency', label: 'Contingency Reserve' },
              ].map((item) => (
                <div key={item.key} className="p-3.5 rounded-xl glass-panel border border-sky-400/20 flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">{item.label}</span>
                  <input
                    type="number"
                    value={budgetAllocation[item.key] || 0}
                    onChange={(e) =>
                      setBudgetAllocation({
                        ...budgetAllocation,
                        [item.key]: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs glass-input border border-sky-400/30 rounded px-2 py-1 text-slate-900 dark:text-slate-100 font-semibold"
                  />
                  <span className="text-[10px] text-sky-500 dark:text-sky-400">
                    {totalBudget > 0
                      ? `${Math.round(((budgetAllocation[item.key] || 0) / totalBudget) * 100)}% of total`
                      : '0%'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: HOUSE SPACES / ROOMS */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-sky-500 dark:text-sky-400 uppercase tracking-wider flex items-center gap-2">
                  <Grid className="w-4 h-4" /> 4. House Spaces & Room Breakdown
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Select all rooms and architectural zones present in your property. Each will be independently planned and executed.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomRoomInput(true)}
                icon={Plus}
              >
                Add Custom Space
              </Button>
            </div>

            {/* Custom Room Input prompt */}
            {showCustomRoomInput && (
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center gap-3">
                <Input
                  placeholder="e.g. Home Theater / Wine Cellar / Study Pod"
                  value={customRoomName}
                  onChange={(e) => setCustomRoomName(e.target.value)}
                  className="flex-1"
                />
                <Button variant="primary" size="sm" onClick={handleAddCustomRoom}>
                  Add Space
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowCustomRoomInput(false)}>
                  Cancel
                </Button>
              </div>
            )}

            {/* Pre-configured Spaces Chips Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DEFAULT_ROOM_OPTIONS.map((room) => {
                const isSelected = !!selectedRooms.find((r) => r.name === room.name);
                return (
                  <button
                    key={room.name}
                    type="button"
                    onClick={() => toggleRoomSelection(room)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'border-sky-400 bg-sky-500/20 shadow-glass-glow'
                        : 'border-sky-400/20 glass-panel opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{room.name}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </div>
                    <div className="flex flex-col text-[10px] text-slate-600 dark:text-slate-300">
                      <span>{room.dimensions}</span>
                      <span className="text-sky-600 dark:text-sky-300 font-medium">
                        Est: ${(Math.round(totalBudget * room.budgetRatio)).toLocaleString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Rooms List */}
            <div className="flex flex-col gap-2 pt-4 border-t border-sky-400/20">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Configured House Spaces ({selectedRooms.length} Spaces Active)
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedRooms.map((r, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel border border-sky-400/30 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <Sparkles className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                    {r.name} ({r.dimensions || 'Custom'})
                    <button
                      type="button"
                      onClick={() => setSelectedRooms(selectedRooms.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-500 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-8 mt-4 border-t border-sky-400/20">
          <Button
            variant="ghost"
            size="md"
            onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate(-1))}
          >
            {currentStep > 1 ? 'Back' : 'Cancel'}
          </Button>

          {currentStep < 4 ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentStep(currentStep + 1)}
              icon={ArrowRight}
            >
              Continue to Step {currentStep + 1}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              loading={isLoading}
              onClick={handleSubmit}
              icon={CheckCircle2}
            >
              Launch House Project
            </Button>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default NewProjectPage;
