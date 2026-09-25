import React, { useState } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Palette,
  Armchair,
  Layers,
  Utensils,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Textarea from './Textarea';
import StatusBadge from './StatusBadge';

export const RoomApprovalModal = ({
  isOpen,
  onClose,
  room,
  onApprove,
  onRequestChanges,
}) => {
  if (!room) return null;

  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChangesInput, setShowChangesInput] = useState(false);

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      await onApprove(room._id, comments || 'Approved by client.');
      onClose();
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!comments.trim()) {
      alert('Please provide your revision comments so the designer knows what adjustments to make.');
      return;
    }
    try {
      setIsSubmitting(true);
      await onRequestChanges(room._id, comments);
      onClose();
    } catch (err) {
      console.error('Request changes failed:', err);
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
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-slate-100">
                Design Review: {room.name}
              </span>
              <StatusBadge status={room.designStatus || 'Draft'} />
            </div>
            <span className="text-xs text-slate-400">
              Review spatial specifications, colors, materials, and concepts submitted by your designer
            </span>
          </div>
        </div>
      }
      size="xl"
    >
      <div className="flex flex-col gap-6">
        {/* Concept Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl glass-panel border border-sky-400/20">
            <span className="text-[10px] uppercase text-sky-400 font-semibold tracking-wider">Design Style</span>
            <span className="text-sm font-bold text-slate-100 block mt-0.5">{room.style || 'Modern'}</span>
          </div>
          <div className="p-3 rounded-xl glass-panel border border-sky-400/20">
            <span className="text-[10px] uppercase text-sky-400 font-semibold tracking-wider">Dimensions</span>
            <span className="text-sm font-bold text-slate-100 block mt-0.5">{room.dimensions || '180 sq.ft'}</span>
          </div>
          <div className="p-3 rounded-xl glass-panel border border-sky-400/20">
            <span className="text-[10px] uppercase text-sky-400 font-semibold tracking-wider">Allocated Budget</span>
            <span className="text-sm font-bold text-slate-100 block mt-0.5">${(room.budget || 0).toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-xl glass-panel border border-sky-400/20">
            <span className="text-[10px] uppercase text-sky-400 font-semibold tracking-wider">Approval Stage</span>
            <span className="text-sm font-bold text-sky-300 block mt-0.5">{room.designStatus || 'Draft'}</span>
          </div>
        </div>

        {/* Color Palette Swatches */}
        {room.colorPalette && (
          <div className="p-4 rounded-xl glass-panel border border-sky-400/20 flex flex-col gap-2">
            <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Approved Spatial Color Harmony
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { label: 'Primary', color: room.colorPalette.primary },
                { label: 'Secondary', color: room.colorPalette.secondary },
                { label: 'Accent', color: room.colorPalette.accent },
                { label: 'Ceiling', color: room.colorPalette.ceiling },
                { label: 'Flooring', color: room.colorPalette.flooring },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-charcoal-900/60 border border-sky-400/20">
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-[11px] text-slate-300 font-mono">{c.label}: {c.color}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Furniture & Materials Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Furniture */}
          <div className="p-4 rounded-xl glass-panel border border-sky-400/20 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Armchair className="w-3.5 h-3.5 text-sky-400" /> Furniture List ({room.furniture?.length || 0})
            </span>
            <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
              {(room.furniture || []).map((f, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-charcoal-900/40 border border-sky-400/10">
                  <span className="text-slate-200 font-medium">{f.name} (x{f.quantity})</span>
                  <span className="text-sky-300 font-semibold">${f.estimatedCost?.toLocaleString()}</span>
                </div>
              ))}
              {(!room.furniture || room.furniture.length === 0) && (
                <span className="text-xs text-slate-500 italic">No furniture specified yet</span>
              )}
            </div>
          </div>

          {/* Materials */}
          <div className="p-4 rounded-xl glass-panel border border-sky-400/20 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" /> Specified Materials ({room.materials?.length || 0})
            </span>
            <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
              {(room.materials || []).map((m, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-charcoal-900/40 border border-sky-400/10">
                  <span className="text-slate-200 font-medium">{m.name} ({m.category})</span>
                  <span className="text-sky-300 font-semibold">${m.price?.toLocaleString()}</span>
                </div>
              ))}
              {(!room.materials || room.materials.length === 0) && (
                <span className="text-xs text-slate-500 italic">No materials specified yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Designer Notes */}
        {room.designerNotes && (
          <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-400/25 text-xs text-slate-300">
            <span className="font-semibold text-sky-400 block mb-1">Architectural Concept Notes:</span>
            {room.designerNotes}
          </div>
        )}

        {/* Changes Comment Box (conditionally open or toggled) */}
        {showChangesInput && (
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Revision Feedback for Designer
            </span>
            <Textarea
              placeholder="e.g. Please change the flooring material to herringbone oak and provide an alternative layout for the vanity..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
            <div className="flex items-center justify-end gap-2 mt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowChangesInput(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={isSubmitting}
                onClick={handleRequestChanges}
                icon={RotateCcw}
              >
                Send Revision Request
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        {!showChangesInput && (
          <div className="flex items-center justify-between pt-4 border-t border-sky-400/20">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowChangesInput(true)}
                icon={RotateCcw}
              >
                Request Changes
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={isSubmitting}
                onClick={handleApprove}
                icon={CheckCircle2}
              >
                Approve Room Design
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RoomApprovalModal;
