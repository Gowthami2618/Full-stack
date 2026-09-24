import AuditLog from '../models/AuditLog.js';

export const logActivity = async ({
  user = null,
  action,
  entityType = 'SYSTEM',
  entityId = null,
  description,
  metadata = {},
}) => {
  try {
    await AuditLog.create({
      user: user ? user._id || user : null,
      action,
      entityType,
      entityId: entityId ? entityId.toString() : null,
      description,
      metadata,
    });
  } catch (error) {
    console.error(`[Audit Log Failed]: ${error.message}`);
  }
};
