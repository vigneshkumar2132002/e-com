import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bapuji_secret');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bapuji_secret');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      console.warn(`Optional auth skipped: ${error.message}`);
      req.user = undefined;
    }
  }

  next();
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin role required' });
  }
};

export const verifiedB2B = (req, res, next) => {
  if (
    req.user &&
    req.user.role === 'b2b' &&
    req.user.b2bProfile &&
    req.user.b2bProfile.verificationStatus === 'approved'
  ) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied: Requires verified B2B wholesaler account status' 
    });
  }
};
