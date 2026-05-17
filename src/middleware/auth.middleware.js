const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config/env');
const { unauthorizedResponse } = require('../utils/responseHandler');

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Check from cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return unauthorizedResponse(res, 'No token, authorization denied');
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return unauthorizedResponse(res, 'User not found');
    }

    if (!user.isActive) {
      return unauthorizedResponse(res, 'Your account has been deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return unauthorizedResponse(res, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      return unauthorizedResponse(res, 'Token expired');
    }
    return unauthorizedResponse(res, 'Authentication failed');
  }
};

module.exports = { protect: authMiddleware };