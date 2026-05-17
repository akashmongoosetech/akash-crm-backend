const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect: authMiddleware } = require('../middleware/auth.middleware');
const { authorize: roleMiddleware } = require('../middleware/role.middleware');
const { 
  validateRegistration, 
  validateLogin, 
  validateUpdateProfile, 
  validateChangePassword,
  validate 
} = require('../validators/auth.validator');

// Public routes
router.post('/register', validateRegistration, validate, authController.register);
router.post('/login', validateLogin, validate, authController.login);

// Protected routes - require authentication
router.use(authMiddleware);

// User routes
router.get('/me', authController.getCurrentUser);
router.put('/profile', validateUpdateProfile, validate, authController.updateProfile);
router.put('/change-password', validateChangePassword, validate, authController.changePassword);
router.post('/logout', authController.logout);

// Admin routes (Admin and Super Admin only)
router.get('/users', roleMiddleware('super_admin', 'admin'), authController.getAllUsers);
router.get('/users/:id', roleMiddleware('super_admin', 'admin'), authController.getUserById);
router.put('/users/:id/status', roleMiddleware('super_admin', 'admin'), authController.toggleUserStatus);

// Super Admin only routes
router.put('/users/:id/role', roleMiddleware('super_admin'), authController.updateUserRole);
router.delete('/users/:id', roleMiddleware('super_admin'), authController.deleteUser);

module.exports = router;