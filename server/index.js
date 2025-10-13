// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { register, login, updatePassword } from './controllers/authController.js';
import { listStores, adminAddStore } from './controllers/storesController.js';
import { submitOrUpdateRating } from './controllers/ratingsController.js';
import { dashboardCounts, listUsers, adminListStores, createUserByAdmin } from './controllers/adminController.js';
import { ownerStoreUsers } from './controllers/ownerController.js';

import authMiddleware from './middlewares/authMiddleware.js';
import { requireRole } from './middlewares/roleMiddleware.js';

const app = express();
app.use(cors());
app.use(express.json());

// public
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// stores listing (public but returns user's rating if logged in)
app.get('/api/stores', authMiddlewareOptional, listStores); // we'll implement authMiddlewareOptional below

// PRIVATE: update password
app.put('/api/auth/password', authMiddleware, updatePassword);

// Ratings
app.post('/api/ratings', authMiddleware, requireRole('user'), submitOrUpdateRating);

// Admin routes
app.get('/api/admin/dashboard', authMiddleware, requireRole('admin'), dashboardCounts);
app.get('/api/admin/users', authMiddleware, requireRole('admin'), listUsers);
app.post('/api/admin/users', authMiddleware, requireRole('admin'), createUserByAdmin);
app.get('/api/admin/stores', authMiddleware, requireRole('admin'), adminListStores);
app.post('/api/admin/stores', authMiddleware, requireRole('admin'), adminAddStore);

// Owner routes
app.get('/api/owner/stores/ratings', authMiddleware, requireRole('owner'), ownerStoreUsers);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/**
 * Helper: optional auth middleware (if token present, set req.user)
 * We'll define it here quickly to keep file minimal.
 */
import jwt from 'jsonwebtoken';
function authMiddlewareOptional(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return next();
  const token = authHeader.split(' ')[1];
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
  } catch (err) {
    // ignore invalid token for optional
  }
  return next();
}
