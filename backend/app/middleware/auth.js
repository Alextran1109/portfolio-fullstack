const jwt = require('jsonwebtoken');
const createError = require('http-errors');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    return next(createError(401, 'Authentication required'));
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(createError(500, 'JWT_SECRET is not configured'));
  }
  try {
    const payload = jwt.verify(token, secret);
    req.userId = payload.sub;
    next();
  } catch {
    next(createError(401, 'Invalid or expired token'));
  }
}

module.exports = { requireAuth };
