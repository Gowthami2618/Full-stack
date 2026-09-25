import React, { useState } from 'react';
import {
  Hammer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Layers,
  Plus,
  Trash2,
  Calendar,
} from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';
import ProgressBar from './ProgressBar';

export const ContractorExecutionModal = ({
  isOpen,
  onClose,
  room,
  onSaveExecution,
}) => {
  if (!room) return null;

  const [formData, setFormData] = useState({
    executionStatus: room.executionStatus || 'Pending',
    progress: room.progress || 0,
    materials: room.materials || [],
    sitePhotos: room.sitePhotos || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // New site photo subform
  const [newPhoto, setNewPhoto] = useState({
    url: '',
    caption: '',
    stage: 'Current Progress',
    progressPercent: room.progress || 0,
  });

  const handleMaterialDeliveryChange = (index, val) => {
    const updated = [...formData.materials];
    updated[index] = { ...updated[index], quantityDelivered: val };
    setFormData({ ...formData, materials: updated });
  };

  const handleAddSitePhoto = () => {
    if (!newPhoto.url) return;
    setFormData((prev) => ({
      ...prev,
      sitePhotos: [
        ...prev.sitePhotos,
        {
          ...newPhoto,
          progressPercent: Number(newPhoto.progressPercent) || prev.progress,
          date: new Date(),
        },
      ],
    }));
    setNewPhoto({ url: '', caption: '', stage: 'Current Progress', progressPercent: formData.progress });
  };

  const handleRemovePhoto = (idx) => {
    setFormData((prev) => ({
      ...prev,
      sitePhotos: prev.sitePhotos.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await onSaveExecution(room._id, formData);
      onClose();
    } catch (err) {
      console.error('Failed to update room execution:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-serif font-bold text-slate-100">
              Site Execution Desk: {room.name}
            </span>
            <span className="text-xs text-slate-400 block">
              Manage on-site build progress, material deliveries, and photographic milestones
            </span>
          </div>
        </div>
      }
      size="xl"
    >
      <div className="flex flex-col gap-6">
        {/* Progress & Status Controls */}
        <div className="p-4 rounded-xl glass-panel border border-sky-400/20 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="On-Site Construction Status"
              value={formData.executionStatus}
              onChange={(e) => setFormData({ ...formData, executionStatus: e.target.value })}
              options={['Pending', 'In Progress', 'Blocked', 'Completed']}
            />
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">Room Fit-out Progress (%)</label>
                <span className="text-xs font-bold text-sky-400">{formData.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                className="w-full accent-sky-400 cursor-pointer h-2 bg-charcoal-900 rounded-lg"
              />
              <ProgressBar progress={formData.progress} size="sm" variant={formData.progress === 100 ? 'emerald' : 'sky'} />
            </div>
          </div>
        </div>

        {/* Site Progress Photos Logger */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" /> Log Daily Site Progress Photo
          </span>
          <div className="p-4 rounded-xl glass-panel border border-sky-400/20 flex flex-col sm:flex-row items-center gap-3">
            <Input
              label="Photo URL"
              placeholder="https://..."
              value={newPhoto.url}
              onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
              className="flex-1"
            />
            <Input
              label="Description / Milestone Note"
              placeholder="e.g. Electrical wiring completed"
              value={newPhoto.caption}
              onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
              className="flex-1"
            />
            <Select
              label="Stage"
              value={newPhoto.stage}
              onChange={(e) => setNewPhoto({ ...newPhoto, stage: e.target.value })}
              options={['Before', 'Current Progress', 'Completed']}
              className="w-36"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddSitePhoto}
              className="self-end sm:self-center mt-4"
              icon={Upload}
            >
              Log Photo
            </Button>
          </div>

          {/* Site Photos Gallery */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
            {formData.sitePhotos.map((photo, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden glass-panel border border-sky-400/20 group">
                <img src={photo.url} alt={photo.caption} className="w-full h-24 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-end">
                  <span className="text-[11px] font-semibold text-white truncate">{photo.caption || 'Site Photo'}</span>
                  <span className="text-[9px] text-sky-300">{photo.stage} • {photo.progressPercent}%</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(i)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-charcoal-900/80 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Materials Required vs Delivered Tracker */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" /> Material Delivery Tracking ({formData.materials.length})
          </span>
          {formData.materials.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 glass-panel rounded-xl">
              No materials registered for this room yet.
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
              {formData.materials.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl glass-panel border border-sky-400/15 text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-100">{m.name}</span>
                    <span className="text-[11px] text-slate-400">
                      Category: {m.category} {m.supplier && `• Supplier: ${m.supplier}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Delivered qty"
                      value={m.quantityDelivered || ''}
                      onChange={(e) => handleMaterialDeliveryChange(idx, e.target.value)}
                      className="w-28 text-xs bg-charcoal-900 border border-sky-400/30 rounded px-2 py-1 text-slate-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-sky-400/20">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            loading={isSubmitting}
            onClick={handleSave}
            icon={CheckCircle2}
          >
            Update Site Progress
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ContractorExecutionModal;
