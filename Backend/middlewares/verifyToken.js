import jwt from 'jsonwebtoken';
import { errorHandler } from './errorHandler.js';

export const verifyToken = (req, res, next) => {
  // We check the cookie named 'access_token'
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, 'Unauthorized: No token provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Unauthorized: Invalid token'));
    }
    // Attach decoded user (id, isBlogger) to request object
    req.user = user;
    next();
  });
};
