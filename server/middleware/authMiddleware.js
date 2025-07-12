const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  console.log('🔍 Authorization header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('❌ JWT error:', err.message);
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
};
