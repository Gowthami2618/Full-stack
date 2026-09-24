import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus,
  ArrowLeft,
  DollarSign,
  MapPin,
  Calendar,
  Image,
} from 'lucide-react';
import { projectsAPI, usersAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import GlassCard from '../../components/common/GlassCard';

export const NewProjectPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [designers, setDesigners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectType: 'Living Room',
    propertyType: 'Apartment',
    location: '',
    totalBudget: '',
    preferredStyle: 'Modern',
    requirements: '',
    startDate: new Date().toISOString().split('T')[0],
    expectedEndDate: '',
    designerId: '',
    imageUrl: '',
  });

  useEffect(() => {
    // Fetch available designers
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.totalBudget || !formData.location) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        ...formData,
        totalBudget: Number(formData.totalBudget),
        images: formData.imageUrl ? [formData.imageUrl] : [],
      };

      const res = await projectsAPI.createProject(payload);
      const created = res.data?.data;
      showToast('Project created successfully! Connecting with designers...', 'success');
      navigate(`/projects/${created._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create project.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Back Button */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          icon={ArrowLeft}
        >
          Back
        </Button>
      </div>

      <GlassCard className="border-sky-400/25 p-6 sm:p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-sky-400/15">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-400/20">
            <FolderPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
              Create New Interior Project
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify your spatial vision, budget expectations, and architectural requirements.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Section 1: Overview */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider">
              1. Spatial Fundamentals
            </h3>

            <Input
              label="Project Title"
              name="title"
              placeholder="e.g. Modernist Loft Living Room Transformation"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Space / Room Type"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
                options={[
                  'Living Room',
                  'Bedroom',
                  'Kitchen',
                  'Bathroom',
                  'Office',
                  'Full Home',
                  'Commercial',
                  'Other',
                ]}
              />

              <Select
                label="Property Type"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
                options={[
                  'Apartment',
                  'Villa',
                  'Independent House',
                  'Office',
                  'Studio',
                  'Commercial',
                ]}
              />
            </div>

            <Textarea
              label="Design Brief & Vision Description"
              name="description"
              rows={3}
              placeholder="Describe your aspiration for this space, lighting mood, color palette, and family lifestyle needs..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Section 2: Financials & Location */}
          <div className="flex flex-col gap-4 pt-4 border-t border-sky-400/15">
            <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider">
              2. Budget & Scheduling
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Total Budget ($ USD)"
                type="number"
                name="totalBudget"
                placeholder="e.g. 75000"
                value={formData.totalBudget}
                onChange={handleChange}
                icon={DollarSign}
                required
              />

              <Input
                label="Project Location / Address"
                name="location"
                placeholder="e.g. Manhattan, New York or 94107 SF"
                value={formData.location}
                onChange={handleChange}
                icon={MapPin}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Target Start Date"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                icon={Calendar}
              />

              <Input
                label="Expected Handover Date"
                type="date"
                name="expectedEndDate"
                value={formData.expectedEndDate}
                onChange={handleChange}
                icon={Calendar}
              />
            </div>
          </div>

          {/* Section 3: Aesthetic Preferences */}
          <div className="flex flex-col gap-4 pt-4 border-t border-sky-400/15">
            <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider">
              3. Style & Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Preferred Aesthetic Style"
                name="preferredStyle"
                value={formData.preferredStyle}
                onChange={handleChange}
                options={[
                  'Modern',
                  'Minimalist',
                  'Contemporary',
                  'Traditional',
                  'Luxury',
                  'Scandinavian',
                  'Industrial',
                  'Bohemian',
                ]}
              />

              <Select
                label="Assign Direct Designer (Optional)"
                name="designerId"
                value={formData.designerId}
                onChange={handleChange}
                placeholder="Open to all platform designers"
              >
                <option value="">Open Marketplace (Any verified designer)</option>
                {designers.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.location || 'Designer'})
                  </option>
                ))}
              </Select>
            </div>

            <Textarea
              label="Detailed Technical / Material Requirements"
              name="requirements"
              rows={2}
              placeholder="e.g. Radiant heated flooring, hidden acoustic paneling, French casement windows..."
              value={formData.requirements}
              onChange={handleChange}
            />

            <Input
              label="Existing Room / Inspiration Image URL (Optional)"
              name="imageUrl"
              placeholder="https://images.unsplash.com/... or uploaded photo link"
              value={formData.imageUrl}
              onChange={handleChange}
              icon={Image}
              helperText="You can also upload blueprints and site photos directly inside the project workspace."
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-sky-400/15">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              icon={FolderPlus}
            >
              Publish Project Brief
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default NewProjectPage;
