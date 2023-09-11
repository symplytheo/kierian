const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, error: 'Authorization token in invalid' });
        // decoded
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json({ success: false, error: 'No authorization token provided' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

module.exports = isAuthenticated;
