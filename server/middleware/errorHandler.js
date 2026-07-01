const { logError } = require('../utils/errorLogger');

/**
 * Global Express Error Handling Middleware
 */
async function errorHandler(err, req, res, next) {
  const userId = req.user ? req.user.id : null;
  const sessionData = {
    method: req.method,
    url: req.url,
    ip: req.ip,
    body: req.body ? { ...req.body, password: req.body.password ? '[HIDDEN]' : undefined } : undefined
  };

  // Log error in background
  await logError(err, userId, sessionData, 'DATABASE');

  console.error('[Unhandled Server Error]:', err);

  res.status(500).json({
    message: 'An unexpected internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}

module.exports = errorHandler;
