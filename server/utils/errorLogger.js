const SystemErrorLog = require('../models/SystemErrorLog');

/**
 * Log system errors to MongoDB
 * @param {Error} error - The javascript Error object
 * @param {string} [userId] - Optional ID of the user who encountered the error
 * @param {object} [sessionData] - Optional session or request context data
 * @param {string} [logDestination] - 'DATABASE' or 'LOCAL_FILE_SYSTEM'
 */
async function logError(error, userId = null, sessionData = null, logDestination = 'DATABASE') {
  try {
    const errorLog = new SystemErrorLog({
      errorMessage: error.message || String(error),
      stackTrace: error.stack || '',
      userId,
      sessionData,
      logDestination
    });
    await errorLog.save();
    console.error('Logged System Error:', error.message);
  } catch (err) {
    console.error('Failed to log system error to database:', err);
    console.error('Original Error:', error);
  }
}

module.exports = {
  logError
};
