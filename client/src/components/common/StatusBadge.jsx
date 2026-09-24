import React from 'react';
import Badge from './Badge';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  // Status to style mapping
  const statusMap = {
    // Project & Proposal Statuses
    DRAFT: { label: 'Draft', variant: 'default' },
    REQUESTED: { label: 'Requested', variant: 'sky' },
    DESIGNING: { label: 'Designing', variant: 'sky' },
    SENT: { label: 'Sent', variant: 'sky' },
    PROPOSAL_SENT: { label: 'Proposal Sent', variant: 'purple' },
    UNDER_REVIEW: { label: 'Under Review', variant: 'sky' },
    APPROVED: { label: 'Approved', variant: 'emerald' },
    IN_PROGRESS: { label: 'In Progress', variant: 'sky' },
    REVISION_REQUESTED: { label: 'Revision Requested', variant: 'rose' },
    REJECTED: { label: 'Rejected', variant: 'rose' },
    ON_HOLD: { label: 'On Hold', variant: 'default' },
    COMPLETED: { label: 'Completed', variant: 'emerald' },
    CANCELLED: { label: 'Cancelled', variant: 'rose' },

    // Task & Priority Statuses
    TODO: { label: 'To Do', variant: 'default' },
    BLOCKED: { label: 'Blocked', variant: 'rose' },
    LOW: { label: 'Low', variant: 'default' },
    MEDIUM: { label: 'Medium', variant: 'sky' },
    HIGH: { label: 'High', variant: 'sky' },
    URGENT: { label: 'Urgent', variant: 'rose' },

    // Material Statuses
    PLANNED: { label: 'Planned', variant: 'default' },
    ORDERED: { label: 'Ordered', variant: 'sky' },
    DELIVERED: { label: 'Delivered', variant: 'purple' },
    INSTALLED: { label: 'Installed', variant: 'emerald' },

    // Milestone Statuses
    UPCOMING: { label: 'Upcoming', variant: 'default' },
    DELAYED: { label: 'Delayed', variant: 'rose' },
  };

  const config = statusMap[normalized] || {
    label: status.replace(/_/g, ' '),
    variant: 'default',
  };

  return (
    <Badge variant={config.variant} size="sm">
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
