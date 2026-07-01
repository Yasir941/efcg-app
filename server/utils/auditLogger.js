const AuditLog = require('../models/AuditLog');

/**
 * Log an advisor or administrator activity to the database
 * @param {string} userId - The user performing the action
 * @param {string} action - The action name (e.g. "User login")
 * @param {string} [details] - Detailed description of the action
 */
async function logAudit(userId, action, details = '') {
  try {
    const log = new AuditLog({
      userId,
      action,
      details
    });
    await log.save();
  } catch (err) {
    console.error('Audit logging failed:', err);
  }
}

module.exports = {
  logAudit
};
