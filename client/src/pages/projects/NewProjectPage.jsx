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
  Sliders,
  Palette,
  Eye,
  FileCheck,
  Send,
  Building,
  Users,
  Compass,
  Briefcase,
  ShieldCheck,
  Zap,
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
  'Apartment',
  'Villa',
  'Independent House',
  'Duplex',
  'Penthouse',
  'Studio',
  'Office',
  'Commercial',
  'Other',
];

const CONSTRUCTION_STATUSES = [
  'Ready to Move',
  'Under Renovation',
  'Bare Shell',
  'New Construction',
  'Planning',
];

const DESIGN_STYLES = [
  {
    id: 'Modern',
    name: 'Modern',
    desc: 'Clean architectural lines, neutral palettes with sky accents, and functional flow.',
    colors: ['#F8FAFC', '#94A3B8', '#38BDF8', '#0F172A'],
    img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Minimalist',
    name: 'Minimalist',
    desc: 'Pure monolithic serenity, shadow-gap skirting, concealed storage, microcement.',
    colors: ['#FAFAF9', '#D6D3D1', '#78716C', '#1C1917'],
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Scandinavian',
    name: 'Scandinavian',
    desc: 'Nordic blonde timber, warm light diffusion, cozy wool textures, and airy simplicity.',
    colors: ['#FFFFFF', '#E2E8F0', '#0284C7', '#64748B'],
    img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Contemporary',
    name: 'Contemporary',
    desc: 'Fluid state-of-the-art curves, high-contrast textures, and integrated smart DALI lighting.',
    colors: ['#F1F5F9', '#CBD5E1', '#0284C7', '#0F172A'],
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Luxury',
    name: 'Luxury / Modern Luxury',
    desc: 'Imported Calacatta marble, brushed champagne brass inlays, and bespoke Italian millwork.',
    colors: ['#FDFBF7', '#D4AF37', '#0F172A', '#78350F'],
    img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Japandi',
    name: 'Japandi',
    desc: 'Wabi-sabi natural balance, limewash plaster, warm white oak, and tranquil minimalism.',
    colors: ['#FAF8F5', '#C4B5A5', '#5A6B5C', '#44403C'],
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Traditional',
    name: 'Traditional / Heritage',
    desc: 'Rich timber moldings, warm brass filigree, classic symmetry, and artisan joinery.',
    colors: ['#FFFDF9', '#C27D38', '#1E3A8A', '#451A03'],
    img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Industrial',
    name: 'Industrial',
    desc: 'Exposed structural concrete, black iron elements, reclaimed wood, and track spot arrays.',
    colors: ['#E2E8F0', '#64748B', '#F97316', '#0F172A'],
    img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Bohemian',
    name: 'Bohemian',
    desc: 'Layered handcrafted textiles, natural rattan, organic greenery, and relaxed warmth.',
    colors: ['#FEF3C7', '#D97706', '#059669', '#78350F'],
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
  },
];

const ROOM_CATALOG_DEFAULTS = [
  { name: 'Living Room', category: 'Living Room', length: 22, width: 16, height: 12, budgetRatio: 0.22, style: 'Modern', condition: 'Bare Shell', priority: 'High' },
  { name: 'Dining Room', category: 'Dining Room', length: 14, width: 12, height: 11, budgetRatio: 0.10, style: 'Modern', condition: 'Bare Shell', priority: 'Medium' },
  { name: 'Kitchen', category: 'Kitchen', length: 16, width: 12, height: 11, budgetRatio: 0.18, style: 'Contemporary', condition: 'Bare Shell', priority: 'High' },
  { name: 'Master Bedroom', category: 'Master Bedroom', length: 18, width: 16, height: 11, budgetRatio: 0.20, style: 'Luxury', condition: 'Bare Shell', priority: 'High' },
  { name: 'Bedroom 2', category: 'Bedroom', length: 14, width: 13, height: 10, budgetRatio: 0.10, style: 'Modern', condition: 'Bare Shell', priority: 'Medium' },
  { name: 'Kids Bedroom', category: 'Kids Bedroom', length: 14, width: 12, height: 10, budgetRatio: 0.08, style: 'Scandinavian', condition: 'Bare Shell', priority: 'Medium' },
  { name: 'Guest Bedroom', category: 'Guest Bedroom', length: 13, width: 12, height: 10, budgetRatio: 0.07, style: 'Modern', condition: 'Bare Shell', priority: 'Low' },
  { name: 'Master Bathroom', category: 'Bathroom', length: 12, width: 8, height: 10, budgetRatio: 0.08, style: 'Luxury', condition: 'Bare Shell', priority: 'High' },
  { name: 'Common Bathroom', category: 'Bathroom', length: 9, width: 6, height: 10, budgetRatio: 0.05, style: 'Modern', condition: 'Bare Shell', priority: 'Medium' },
  { name: 'Home Office', category: 'Home Office', length: 14, width: 11, height: 10, budgetRatio: 0.08, style: 'Modern', condition: 'Bare Shell', priority: 'Medium' },
  { name: 'Pooja Room', category: 'Pooja Room', length: 8, width: 6, height: 10, budgetRatio: 0.03, style: 'Traditional', condition: 'Bare Shell', priority: 'High' },
  { name: 'Utility Room', category: 'Utility Room', length: 9, width: 6, height: 10, budgetRatio: 0.03, style: 'Modern', condition: 'Bare Shell', priority: 'Low' },
  { name: 'Balcony', category: 'Balcony', length: 16, width: 6, height: 10, budgetRatio: 0.04, style: 'Contemporary', condition: 'Bare Shell', priority: 'Medium' },
  { name: 'Terrace Garden', category: 'Terrace', length: 24, width: 16, height: 0, budgetRatio: 0.08, style: 'Modern', condition: 'Bare Shell', priority: 'Medium' },
  { name: 'Garden & Lawn', category: 'Garden', length: 30, width: 20, height: 0, budgetRatio: 0.08, style: 'Contemporary', condition: 'Bare Shell', priority: 'Medium' },
  { name: 'Entrance & Foyer', category: 'Entrance', length: 10, width: 8, height: 11, budgetRatio: 0.04, style: 'Modern', condition: 'Bare Shell', priority: 'High' },
  { name: 'Walk-in Closet', category: 'Walk-in Closet', length: 12, width: 8, height: 10, budgetRatio: 0.06, style: 'Luxury', condition: 'Bare Shell', priority: 'High' },
  { name: 'Garage', category: 'Garage', length: 20, width: 18, height: 10, budgetRatio: 0.03, style: 'Modern', condition: 'Bare Shell', priority: 'Low' },
];

export const NewProjectPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [designers, setDesigners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // STEP 1: Project Information
  const [projectInfo, setProjectInfo] = useState({
    title: 'Modern Dream Villa',
    description: 'Comprehensive luxury interior turnkey design and fit-out with bespoke millwork, Italian marble, and architectural smart lighting.',
    projectType: 'Full Home',
    designerId: '',
  });

  // STEP 2: Property Information
  const [propertyInfo, setPropertyInfo] = useState({
    propertyName: 'Palm Crest Estate Residence',
    propertyType: 'Villa',
    address: '18 Palm Crest Boulevard',
    city: 'San Francisco / Mumbai',
    state: 'California / Maharashtra',
    country: 'USA / India',
    totalArea: 4800,
    builtUpArea: 4200,
    floors: 2,
    bedrooms: 4,
    bathrooms: 4,
    parking: '2 Covered Car Slots',
    balcony: 'Master Suite Balcony',
    terrace: 'First Floor Open Terrace Garden',
    garden: 'Private Landscaped Lawn',
    possessionDate: new Date().toISOString().split('T')[0],
    expectedCompletionDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    constructionStatus: 'Ready to Move',
  });

  // STEP 3: House Requirements
  const [houseRequirements, setHouseRequirements] = useState({
    familySize: 4,
    children: true,
    elderly: false,
    pets: true,
    workFromHome: true,
    entertainmentNeeds: 'Frequent weekend hosting with 8-seater dining & acoustic TV lounge',
    storageNeeds: 'Maximum concealed floor-to-ceiling cabinetry and dedicated walk-in wardrobe',
    specialInstructions: 'Focus on natural daylight, pet-friendly scratch-resistant flooring, and automated recessed cove lighting.',
  });

  // STEP 4: Rooms / Spaces
  const [rooms, setRooms] = useState(
    ROOM_CATALOG_DEFAULTS.slice(0, 7).map((r) => ({
      ...r,
      area: (r.length || 15) * (r.width || 12),
      budget: Math.round(250000 * r.budgetRatio),
      designStatus: 'Draft',
      executionStatus: 'Pending',
      photos: [],
    }))
  );
  const [customRoomForm, setCustomRoomForm] = useState({
    name: '',
    category: 'Other',
    length: 15,
    width: 12,
    height: 10,
    style: 'Modern',
    priority: 'Medium',
    condition: 'Bare Shell',
  });
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);

  // STEP 5: Budget
  const [totalBudget, setTotalBudget] = useState(250000);
  const [budgetAllocation, setBudgetAllocation] = useState({
    civil: 35000,
    electrical: 18000,
    plumbing: 12000,
    furniture: 60000,
    kitchen: 40000,
    bathroom: 25000,
    flooring: 22000,
    painting: 12000,
    lighting: 10000,
    decor: 6000,
    landscaping: 8000,
    labor: 20000,
    contingency: 12000,
  });

  // STEP 6: Design Style
  const [preferredStyle, setPreferredStyle] = useState('Modern Luxury');
  const [colorPreference, setColorPreference] = useState('Warm Neutral with Walnut & Brushed Brass Accents');

  // STEP 7: Property Photos
  const [photos, setPhotos] = useState([
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Front Exterior Elevation & Entrance',
      roomType: 'Exterior',
      tag: 'before',
    },
    {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      caption: 'Living Room Bare Shell Condition',
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
  const [newPhotoInput, setNewPhotoInput] = useState({
    url: '',
    caption: '',
    roomType: 'Living Room',
    tag: 'before',
  });

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

  // Budget recalculator helper
  const handleBudgetChange = (val) => {
    const total = Number(val) || 0;
    setTotalBudget(total);
    setBudgetAllocation({
      civil: Math.round(total * 0.14),
      electrical: Math.round(total * 0.07),
      plumbing: Math.round(total * 0.05),
      furniture: Math.round(total * 0.24),
      kitchen: Math.round(total * 0.16),
      bathroom: Math.round(total * 0.10),
      flooring: Math.round(total * 0.09),
      painting: Math.round(total * 0.05),
      lighting: Math.round(total * 0.04),
      decor: Math.round(total * 0.02),
      landscaping: Math.round(total * 0.03),
      labor: Math.round(total * 0.08),
      contingency: Math.round(total * 0.05),
    });
  };

  const toggleRoom = (roomDef) => {
    const exists = rooms.find((r) => r.name === roomDef.name);
    if (exists) {
      setRooms(rooms.filter((r) => r.name !== roomDef.name));
    } else {
      const calculatedArea = (roomDef.length || 15) * (roomDef.width || 12);
      setRooms([
        ...rooms,
        {
          ...roomDef,
          area: calculatedArea,
          budget: Math.round(totalBudget * (roomDef.budgetRatio || 0.08)),
          designStatus: 'Draft',
          executionStatus: 'Pending',
          photos: [],
        },
      ]);
    }
  };

  const handleUpdateRoomDimensions = (index, field, val) => {
    const updated = [...rooms];
    const item = { ...updated[index], [field]: Number(val) || 0 };
    // Recalculate Area = Length x Width
    item.area = (item.length || 0) * (item.width || 0);
    updated[index] = item;
    setRooms(updated);
  };

  const handleAddCustomRoom = () => {
    if (!customRoomForm.name.trim()) {
      showToast('Please provide room name', 'error');
      return;
    }
    const area = (Number(customRoomForm.length) || 15) * (Number(customRoomForm.width) || 12);
    setRooms([
      ...rooms,
      {
        name: customRoomForm.name.trim(),
        category: customRoomForm.category,
        length: Number(customRoomForm.length) || 15,
        width: Number(customRoomForm.width) || 12,
        height: Number(customRoomForm.height) || 10,
        area,
        budget: Math.round(totalBudget * 0.08),
        style: customRoomForm.style || preferredStyle,
        condition: customRoomForm.condition || 'Bare Shell',
        priority: customRoomForm.priority || 'Medium',
        designStatus: 'Draft',
        executionStatus: 'Pending',
        photos: [],
      },
    ]);
    setCustomRoomForm({
      name: '',
      category: 'Other',
      length: 15,
      width: 12,
      height: 10,
      style: 'Modern',
      priority: 'Medium',
      condition: 'Bare Shell',
    });
    setShowAddCustomModal(false);
  };

  const handleAddPhoto = () => {
    if (!newPhotoInput.url.trim()) {
      showToast('Please enter a valid image URL', 'error');
      return;
    }
    setPhotos([...photos, { ...newPhotoInput, uploadedAt: new Date() }]);
    setNewPhotoInput({ url: '', caption: '', roomType: 'Living Room', tag: 'before' });
    showToast('Photo added to house gallery', 'success');
  };

  const handleRemovePhoto = (idx) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  // Step Validation
  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!projectInfo.title.trim() || !projectInfo.description.trim()) {
        showToast('Please provide project title and description', 'error');
        return false;
      }
    } else if (currentStep === 2) {
      if (!propertyInfo.address.trim() || !propertyInfo.city.trim()) {
        showToast('Please provide property address and city', 'error');
        return false;
      }
    } else if (currentStep === 4) {
      if (rooms.length === 0) {
        showToast('Please select at least one room or space for your house', 'error');
        return false;
      }
    } else if (currentStep === 5) {
      if (!totalBudget || totalBudget <= 0) {
        showToast('Please specify a positive total budget', 'error');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(9, prev + 1));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Final Step: Submit Project to MongoDB
  const handleCreateProject = async () => {
    if (!projectInfo.title || !propertyInfo.address || !totalBudget || rooms.length === 0) {
      showToast('Please complete all required fields and rooms', 'error');
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        title: projectInfo.title,
        description: projectInfo.description,
        projectType: projectInfo.projectType || 'Full Home',
        propertyType: propertyInfo.propertyType || 'Villa',
        location: `${propertyInfo.address}, ${propertyInfo.city}, ${propertyInfo.state}`,
        totalBudget: Number(totalBudget),
        preferredStyle: preferredStyle || 'Modern',
        designerId: projectInfo.designerId || undefined,
        startDate: propertyInfo.possessionDate || new Date(),
        expectedEndDate: propertyInfo.expectedCompletionDate || null,
        requirements: houseRequirements.specialInstructions || '',
        images: photos.map((p) => p.url),
        propertyDetails: {
          propertyName: propertyInfo.propertyName,
          propertyType: propertyInfo.propertyType,
          address: propertyInfo.address,
          city: propertyInfo.city,
          state: propertyInfo.state,
          country: propertyInfo.country,
          totalArea: Number(propertyInfo.totalArea),
          builtUpArea: Number(propertyInfo.builtUpArea),
          floors: Number(propertyInfo.floors),
          bedrooms: Number(propertyInfo.bedrooms),
          bathrooms: Number(propertyInfo.bathrooms),
          parking: propertyInfo.parking,
          balcony: propertyInfo.balcony,
          terrace: propertyInfo.terrace,
          garden: propertyInfo.garden,
          possessionDate: propertyInfo.possessionDate,
          expectedCompletionDate: propertyInfo.expectedCompletionDate,
          constructionStatus: propertyInfo.constructionStatus,
        },
        designBrief: {
          familySize: Number(houseRequirements.familySize),
          children: Boolean(houseRequirements.children),
          elderly: Boolean(houseRequirements.elderly),
          pets: Boolean(houseRequirements.pets),
          workFromHome: Boolean(houseRequirements.workFromHome),
          entertainmentNeeds: houseRequirements.entertainmentNeeds,
          storageNeeds: houseRequirements.storageNeeds,
          colorScheme: 'Custom',
          customColors: [colorPreference],
          specialInstructions: houseRequirements.specialInstructions,
        },
        budgetAllocation: {
          ...budgetAllocation,
          totalBudget: Number(totalBudget),
          interior: (budgetAllocation.civil || 0) + (budgetAllocation.painting || 0) + (budgetAllocation.flooring || 0),
        },
        housePhotos: photos,
        rooms: rooms.map((r) => ({
          name: r.name,
          category: r.category,
          dimensions: `${r.length} x ${r.width} ft`,
          length: Number(r.length),
          width: Number(r.width),
          height: Number(r.height),
          area: Number(r.length) * Number(r.width),
          budget: Number(r.budget),
          style: r.style || preferredStyle,
          existingCondition: r.condition || 'Bare Shell',
          priority: r.priority || 'High',
          designStatus: 'Draft',
          executionStatus: 'Pending',
          photos: r.photos || [],
        })),
      };

      const res = await projectsAPI.createProject(payload);
      const created = res.data?.data;
      showToast('🎉 Real-World Interior Project created successfully in MongoDB!', 'success');
      navigate(`/projects/${created._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create project.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Project Info', icon: FolderPlus },
    { num: 2, label: 'Property', icon: Home },
    { num: 3, label: 'Requirements', icon: Users },
    { num: 4, label: 'Spaces / Rooms', icon: Grid },
    { num: 5, label: 'Budget', icon: DollarSign },
    { num: 6, label: 'Design Style', icon: Palette },
    { num: 7, label: 'House Photos', icon: Camera },
    { num: 8, label: 'Review', icon: FileCheck },
    { num: 9, label: 'Create Project', icon: Send },
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (currentStep > 1 ? handlePrevStep() : navigate(-1))}
          icon={ArrowLeft}
        >
          {currentStep > 1 ? 'Previous Step' : 'Back to Dashboard'}
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-sky-500 dark:text-sky-400 font-bold uppercase tracking-wider">
            Step {currentStep} of 9
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">•</span>
          <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold">
            {stepsList[currentStep - 1].label}
          </span>
        </div>
      </div>

      <GlassCard className="border-sky-400/25 p-6 sm:p-10 shadow-2xl">
        {/* Title Header */}
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-sky-400/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-400/20">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 dark:text-white">
                Project Creation Wizard
              </h1>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                Real property specifications, dimensional room layouts, structured budgets & aesthetic direction
              </p>
            </div>
          </div>
        </div>

        {/* 9-Step Progress Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-8 scrollbar-thin">
          {stepsList.map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.num;
            const isActive = currentStep === s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num < currentStep) setCurrentStep(s.num);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all border ${
                  isActive
                    ? 'border-sky-400 bg-sky-500/20 text-sky-600 dark:text-sky-300 font-bold shadow-glass-glow'
                    : isCompleted
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer'
                    : 'border-sky-400/10 glass-panel text-slate-400 dark:text-slate-500 opacity-60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{s.num}. {s.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: PROJECT INFORMATION */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center gap-2 pb-2 border-b border-sky-400/10">
              <FolderPlus className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Step 1: Project Information
              </h3>
            </div>

            <Input
              label="Project Title"
              placeholder="e.g. Modern Dream Villa, Palm Crest Penthouse"
              value={projectInfo.title}
              onChange={(e) => setProjectInfo({ ...projectInfo, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Project Scope / Type"
                value={projectInfo.projectType}
                onChange={(e) => setProjectInfo({ ...projectInfo, projectType: e.target.value })}
                options={[
                  'Full Home',
                  'Living Room',
                  'Bedroom',
                  'Kitchen',
                  'Bathroom',
                  'Office',
                  'Commercial',
                  'Other',
                ]}
              />
              <Select
                label="Select Lead Designer (Optional)"
                value={projectInfo.designerId}
                onChange={(e) => setProjectInfo({ ...projectInfo, designerId: e.target.value })}
                options={[
                  { value: '', label: 'Open to marketplace designers' },
                  ...designers.map((d) => ({
                    value: d._id,
                    label: `${d.name} (${d.specialization || d.location || 'Interior Designer'})`,
                  })),
                ]}
              />
            </div>

            <Textarea
              label="Project Brief & Overview"
              placeholder="Describe the architectural vision, family lifestyle requirements, turnkey fit-out expectations..."
              value={projectInfo.description}
              onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })}
              rows={4}
              required
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: PROPERTY INFORMATION */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center gap-2 pb-2 border-b border-sky-400/10">
              <Building className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Step 2: Real Property Blueprint & Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Property / Estate Name"
                placeholder="e.g. Palm Crest Villa"
                value={propertyInfo.propertyName}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, propertyName: e.target.value })}
              />
              <Select
                label="Property Type"
                value={propertyInfo.propertyType}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, propertyType: e.target.value })}
                options={PROPERTY_TYPES}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Street Address"
                placeholder="18 Palm Crest Boulevard"
                value={propertyInfo.address}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, address: e.target.value })}
                required
              />
              <Input
                label="City"
                placeholder="San Francisco / Mumbai"
                value={propertyInfo.city}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, city: e.target.value })}
                required
              />
              <Input
                label="State / Country"
                placeholder="CA / India"
                value={propertyInfo.state}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, state: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="Total Plot Area (Sq.Ft)"
                type="number"
                value={propertyInfo.totalArea}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, totalArea: Number(e.target.value) })}
              />
              <Input
                label="Built-Up Area (Sq.Ft)"
                type="number"
                value={propertyInfo.builtUpArea}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, builtUpArea: Number(e.target.value) })}
              />
              <Input
                label="Number of Floors"
                type="number"
                value={propertyInfo.floors}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, floors: Number(e.target.value) })}
              />
              <Select
                label="Construction Status"
                value={propertyInfo.constructionStatus}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, constructionStatus: e.target.value })}
                options={CONSTRUCTION_STATUSES}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="Bedrooms"
                type="number"
                value={propertyInfo.bedrooms}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, bedrooms: Number(e.target.value) })}
              />
              <Input
                label="Bathrooms"
                type="number"
                value={propertyInfo.bathrooms}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, bathrooms: Number(e.target.value) })}
              />
              <Input
                label="Parking"
                placeholder="2 Covered Slots"
                value={propertyInfo.parking}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, parking: e.target.value })}
              />
              <Input
                label="Balcony / Terrace"
                placeholder="Master Balcony"
                value={propertyInfo.balcony}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, balcony: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Possession Date"
                type="date"
                value={propertyInfo.possessionDate}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, possessionDate: e.target.value })}
              />
              <Input
                label="Expected Handover Date"
                type="date"
                value={propertyInfo.expectedCompletionDate}
                onChange={(e) => setPropertyInfo({ ...propertyInfo, expectedCompletionDate: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: HOUSE REQUIREMENTS */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center gap-2 pb-2 border-b border-sky-400/10">
              <Users className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Step 3: Family Lifestyle & Functional Requirements
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Family Size (Persons)"
                type="number"
                value={houseRequirements.familySize}
                onChange={(e) => setHouseRequirements({ ...houseRequirements, familySize: Number(e.target.value) })}
              />
              <div className="flex flex-col gap-2 justify-center">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Household Dynamics</span>
                <div className="flex flex-wrap gap-4">
                  {[
                    { key: 'children', label: 'Children' },
                    { key: 'elderly', label: 'Elderly Members' },
                    { key: 'pets', label: 'Pets' },
                    { key: 'workFromHome', label: 'Work from Home' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={houseRequirements[item.key]}
                        onChange={(e) => setHouseRequirements({ ...houseRequirements, [item.key]: e.target.checked })}
                        className="rounded border-sky-400 text-sky-500 focus:ring-sky-400"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Input
              label="Hosting & Entertainment Habits"
              placeholder="e.g. Frequent weekend dinner parties for 8-10 people, movie nights in lounge"
              value={houseRequirements.entertainmentNeeds}
              onChange={(e) => setHouseRequirements({ ...houseRequirements, entertainmentNeeds: e.target.value })}
            />

            <Input
              label="Storage & Wardrobe Needs"
              placeholder="e.g. Deep concealed pantry, dual walk-in master wardrobes, seasonal luggage storage"
              value={houseRequirements.storageNeeds}
              onChange={(e) => setHouseRequirements({ ...houseRequirements, storageNeeds: e.target.value })}
            />

            <Textarea
              label="Special Architectural / Technical Instructions"
              placeholder="e.g. Acoustic dampening on shared walls, smart lighting automation, motorized curtain pockets, hypoallergenic materials..."
              value={houseRequirements.specialInstructions}
              onChange={(e) => setHouseRequirements({ ...houseRequirements, specialInstructions: e.target.value })}
              rows={3}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: ROOMS / SPACES (Length x Width x Height => Area) */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-sky-400/10">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Step 4: Spaces & Dimensional Planning (Area = Length × Width)
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddCustomModal(true)}
                icon={Plus}
              >
                Add Custom Space
              </Button>
            </div>

            {/* Space Toggle Catalog */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select spaces to include in your house project:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {ROOM_CATALOG_DEFAULTS.map((roomDef) => {
                  const isSelected = !!rooms.find((r) => r.name === roomDef.name);
                  return (
                    <button
                      key={roomDef.name}
                      type="button"
                      onClick={() => toggleRoom(roomDef)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-sky-400 bg-sky-500/20 text-sky-600 dark:text-sky-300 font-bold shadow-glass-glow'
                          : 'border-sky-400/10 glass-panel text-slate-600 dark:text-slate-300 hover:border-sky-400/30'
                      }`}
                    >
                      <span className="text-xs truncate">{roomDef.name}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Configured Rooms Table with Length x Width Auto Calculation */}
            <div className="flex flex-col gap-3 mt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Configured Spaces & Dimension Verification ({rooms.length} Active Spaces)
              </span>

              <div className="space-y-3">
                {rooms.map((room, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl glass-panel border border-sky-400/20 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-3">
                      <span className="text-sm font-bold text-slate-950 dark:text-white">{room.name}</span>
                      <span className="block text-[10px] text-sky-500 dark:text-sky-400 font-medium">
                        {room.category} • {room.condition || 'Bare Shell'}
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Length (ft)</label>
                      <input
                        type="number"
                        value={room.length || 15}
                        onChange={(e) => handleUpdateRoomDimensions(idx, 'length', e.target.value)}
                        className="w-full text-xs glass-input border border-sky-400/30 rounded px-2.5 py-1.5 text-slate-950 dark:text-white font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Width (ft)</label>
                      <input
                        type="number"
                        value={room.width || 12}
                        onChange={(e) => handleUpdateRoomDimensions(idx, 'width', e.target.value)}
                        className="w-full text-xs glass-input border border-sky-400/30 rounded px-2.5 py-1.5 text-slate-950 dark:text-white font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Calculated Area</label>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 py-1.5">
                        {(room.length || 0) * (room.width || 0)} sq.ft
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Budget ($)</label>
                      <input
                        type="number"
                        value={room.budget || 0}
                        onChange={(e) => {
                          const updated = [...rooms];
                          updated[idx].budget = Number(e.target.value) || 0;
                          setRooms(updated);
                        }}
                        className="w-full text-xs glass-input border border-sky-400/30 rounded px-2.5 py-1.5 text-slate-950 dark:text-white font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setRooms(rooms.filter((_, i) => i !== idx))}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Room Modal */}
            {showAddCustomModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md">
                <GlassCard className="max-w-md w-full p-6 border-sky-400/30">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Add Custom Architectural Space</h3>
                  <div className="flex flex-col gap-3">
                    <Input
                      label="Space Name"
                      placeholder="e.g. Home Theater, Wine Cellar, Study Pod"
                      value={customRoomForm.name}
                      onChange={(e) => setCustomRoomForm({ ...customRoomForm, name: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Length (ft)"
                        type="number"
                        value={customRoomForm.length}
                        onChange={(e) => setCustomRoomForm({ ...customRoomForm, length: e.target.value })}
                      />
                      <Input
                        label="Width (ft)"
                        type="number"
                        value={customRoomForm.width}
                        onChange={(e) => setCustomRoomForm({ ...customRoomForm, width: e.target.value })}
                      />
                    </div>
                    <div className="text-xs text-sky-400 font-semibold">
                      Calculated Area: {(Number(customRoomForm.length) || 0) * (Number(customRoomForm.width) || 0)} sq.ft
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-4">
                      <Button variant="ghost" size="sm" onClick={() => setShowAddCustomModal(false)}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" onClick={handleAddCustomRoom}>
                        Add Room
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: BUDGET */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center gap-2 pb-2 border-b border-sky-400/10">
              <DollarSign className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Step 5: Smart Financial Budget & Trade Allocations
              </h3>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-sky-400/30 bg-sky-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-sky-600 dark:text-sky-300 uppercase tracking-widest">
                  Total Project Estimated Budget
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-950 dark:text-white mt-1">
                  ${totalBudget.toLocaleString()}
                </h2>
              </div>
              <div className="w-full sm:w-64">
                <Input
                  label="Adjust Total Budget ($)"
                  type="number"
                  value={totalBudget}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { key: 'civil', label: 'Civil & Drywall' },
                { key: 'electrical', label: 'Electrical & Automation' },
                { key: 'plumbing', label: 'Plumbing & Sanitary' },
                { key: 'furniture', label: 'Furniture & Millwork' },
                { key: 'kitchen', label: 'Modular Kitchen' },
                { key: 'bathroom', label: 'Bathrooms' },
                { key: 'flooring', label: 'Flooring & Tiling' },
                { key: 'painting', label: 'Painting & Texture' },
                { key: 'lighting', label: 'Lighting Fixtures' },
                { key: 'decor', label: 'Decor & Soft Furnishing' },
                { key: 'landscaping', label: 'Landscaping & Garden' },
                { key: 'labor', label: 'Contractor Labor' },
                { key: 'contingency', label: 'Contingency Reserve' },
              ].map((trade) => (
                <div key={trade.key} className="p-3.5 rounded-xl glass-panel border border-sky-400/20 flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{trade.label}</span>
                  <input
                    type="number"
                    value={budgetAllocation[trade.key] || 0}
                    onChange={(e) =>
                      setBudgetAllocation({
                        ...budgetAllocation,
                        [trade.key]: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full text-xs glass-input border border-sky-400/30 rounded px-2 py-1 text-slate-950 dark:text-white font-semibold"
                  />
                  <span className="text-[10px] text-sky-500 dark:text-sky-400 font-medium">
                    {totalBudget > 0
                      ? `${Math.round(((budgetAllocation[trade.key] || 0) / totalBudget) * 100)}% of total`
                      : '0%'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: DESIGN STYLE */}
        {/* ========================================================================= */}
        {currentStep === 6 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center gap-2 pb-2 border-b border-sky-400/10">
              <Palette className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Step 6: Interior Design Style & Color Preferences
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DESIGN_STYLES.map((st) => {
                const isSelected = preferredStyle.toLowerCase().includes(st.id.toLowerCase());
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setPreferredStyle(st.name)}
                    className={`rounded-2xl border overflow-hidden text-left transition-all flex flex-col ${
                      isSelected
                        ? 'border-sky-400 bg-sky-500/20 shadow-glass-glow'
                        : 'border-sky-400/20 glass-panel opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={st.img} alt={st.name} className="w-full h-36 object-cover" />
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{st.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-sky-400/20">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mr-1">Palette:</span>
                        {st.colors.map((c, idx) => (
                          <span
                            key={idx}
                            style={{ backgroundColor: c }}
                            className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <Input
              label="Custom Color Palette / Accents Description"
              placeholder="e.g. Warm Travertine Neutral base with Brushed Champagne Brass and Deep Forest Green accents"
              value={colorPreference}
              onChange={(e) => setColorPreference(e.target.value)}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 7: UPLOAD PROPERTY PHOTOS */}
        {/* ========================================================================= */}
        {currentStep === 7 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center gap-2 pb-2 border-b border-sky-400/10">
              <Camera className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Step 7: House & Site Photo Gallery (Before, Current, Inspiration)
              </h3>
            </div>

            {/* Photo Adder */}
            <div className="p-4 rounded-2xl glass-panel border border-sky-400/30 flex flex-col sm:flex-row items-center gap-3">
              <Input
                label="Image URL (JPG / PNG / WEBP)"
                placeholder="https://..."
                value={newPhotoInput.url}
                onChange={(e) => setNewPhotoInput({ ...newPhotoInput, url: e.target.value })}
                className="flex-1"
              />
              <Input
                label="Caption"
                placeholder="e.g. Master Bedroom Before Fit-out"
                value={newPhotoInput.caption}
                onChange={(e) => setNewPhotoInput({ ...newPhotoInput, caption: e.target.value })}
                className="flex-1"
              />
              <Select
                label="Associated Space"
                value={newPhotoInput.roomType}
                onChange={(e) => setNewPhotoInput({ ...newPhotoInput, roomType: e.target.value })}
                options={[
                  'Exterior',
                  'Living Room',
                  'Dining Room',
                  'Kitchen',
                  'Master Bedroom',
                  'Bedroom',
                  'Bathroom',
                  'Garden',
                  'Balcony',
                  'Terrace',
                  'Entrance',
                  'Other',
                ]}
                className="w-40"
              />
              <Select
                label="Tag"
                value={newPhotoInput.tag}
                onChange={(e) => setNewPhotoInput({ ...newPhotoInput, tag: e.target.value })}
                options={[
                  { value: 'before', label: 'Before Site' },
                  { value: 'inspiration', label: 'Inspiration' },
                  { value: 'current', label: 'Current Progress' },
                ]}
                className="w-36"
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

            {/* Photos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((photo, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden glass-panel border border-sky-400/20 group">
                  <img src={photo.url} alt={photo.caption} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                    <span className="text-xs font-bold text-white truncate">{photo.caption || 'House Photo'}</span>
                    <span className="text-[10px] text-sky-300 uppercase">{photo.roomType} • {photo.tag}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(i)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-charcoal-900/80 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 8: REVIEW */}
        {/* ========================================================================= */}
        {currentStep === 8 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center gap-2 pb-2 border-b border-sky-400/10">
              <FileCheck className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Step 8: Comprehensive Project Specification Review
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Project & Property Summary */}
              <div className="p-5 rounded-2xl glass-panel border border-sky-400/20 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-500 uppercase">Project & Property</span>
                  <button type="button" onClick={() => setCurrentStep(1)} className="text-xs text-sky-400 hover:underline">
                    Edit
                  </button>
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-950 dark:text-white">{projectInfo.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{propertyInfo.address}, {propertyInfo.city}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-sky-400/10">
                  <div><strong>Property:</strong> {propertyInfo.propertyType}</div>
                  <div><strong>Status:</strong> {propertyInfo.constructionStatus}</div>
                  <div><strong>Area:</strong> {propertyInfo.totalArea} sq.ft</div>
                  <div><strong>Floors:</strong> {propertyInfo.floors}</div>
                  <div><strong>Bedrooms:</strong> {propertyInfo.bedrooms} BHK</div>
                  <div><strong>Bathrooms:</strong> {propertyInfo.bathrooms} Baths</div>
                </div>
              </div>

              {/* Budget & Aesthetic Summary */}
              <div className="p-5 rounded-2xl glass-panel border border-sky-400/20 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-500 uppercase">Budget & Style</span>
                  <button type="button" onClick={() => setCurrentStep(5)} className="text-xs text-sky-400 hover:underline">
                    Edit
                  </button>
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Total Budget</span>
                  <h4 className="text-2xl font-bold text-slate-950 dark:text-white">${totalBudget.toLocaleString()}</h4>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-sky-400/10 space-y-1">
                  <div><strong>Style:</strong> {preferredStyle}</div>
                  <div><strong>Palette:</strong> {colorPreference}</div>
                  <div><strong>Spaces:</strong> {rooms.length} Configured Rooms</div>
                  <div><strong>Photos:</strong> {photos.length} Site Photos Linked</div>
                </div>
              </div>
            </div>

            {/* Configured Rooms Summary */}
            <div className="p-5 rounded-2xl glass-panel border border-sky-400/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-sky-500 uppercase">Configured House Spaces ({rooms.length})</span>
                <button type="button" onClick={() => setCurrentStep(4)} className="text-xs text-sky-400 hover:underline">
                  Edit Spaces
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {rooms.map((r, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl glass-panel border border-sky-400/30 text-xs font-medium text-slate-800 dark:text-slate-200"
                  >
                    {r.name} ({r.length}x{r.width}ft • {r.area} sq.ft)
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 9: CREATE PROJECT CONFIRMATION */}
        {/* ========================================================================= */}
        {currentStep === 9 && (
          <div className="flex flex-col gap-6 items-center text-center py-6 animate-fadeIn">
            <div className="p-4 rounded-3xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 dark:text-white">
                Ready to Launch Real Interior Project
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
                Your property blueprint, {rooms.length} individual room spaces, budget allocations, and site photos will be saved directly into MongoDB.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-sky-400/30 max-w-md w-full text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Project Title:</span>
                <span className="font-bold text-slate-900 dark:text-white">{projectInfo.title}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Property Type:</span>
                <span className="font-bold text-slate-900 dark:text-white">{propertyInfo.propertyType}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Total Budget:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">${totalBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Rooms Initialized:</span>
                <span className="font-bold text-sky-500">{rooms.length} Spaces</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              loading={isLoading}
              onClick={handleCreateProject}
              icon={Send}
              className="px-8 shadow-glass-glow text-base font-bold"
            >
              Confirm & Create Project
            </Button>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="flex items-center justify-between pt-8 mt-6 border-t border-sky-400/20">
          <Button
            variant="ghost"
            size="md"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
          >
            {currentStep > 1 ? 'Previous Step' : 'Cancel'}
          </Button>

          {currentStep < 9 ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleNextStep}
              icon={ArrowRight}
            >
              Continue to Step {currentStep + 1}
            </Button>
          ) : null}
        </div>
      </GlassCard>
    </div>
  );
};

export default NewProjectPage;
