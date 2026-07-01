const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and attach user payload to request
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Bearer token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'efcg_super_secret_session_key_2026');
    req.user = decoded; // Contains id, email, role, name, title
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;
