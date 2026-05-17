const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { asyncHandler } = require('../utils/asyncHandler');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  
  if (result.error) {
    return errorResponse(res, result.error, 400);
  }

  // Set cookie
  res.cookie('token', result.token, {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production'
  });

  return successResponse(res, 'Registration successful', result, 201);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  
  const result = await authService.login(identifier, password);
  
  if (result.error) {
    return errorResponse(res, result.error, 401);
  }

  // Set cookie
  res.cookie('token', result.token, {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production'
  });

  return successResponse(res, 'Login successful', result);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
  const result = await authService.getCurrentUser(req.user._id);
  
  if (result.error) {
    return errorResponse(res, result.error, 404);
  }

  return successResponse(res, 'User fetched successfully', result);
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const result = await authService.updateProfile(req.user._id, req.body);
  
  if (result.error) {
    return errorResponse(res, result.error, 404);
  }

  return successResponse(res, 'Profile updated successfully', result);
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  const result = await authService.changePassword(req.user._id, currentPassword, newPassword);
  
  if (result.error) {
    return errorResponse(res, result.error, 400);
  }

  return successResponse(res, result.message, {});
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  return successResponse(res, 'Logged out successfully', {});
});

// @desc    Get all users (admin only)
// @route   GET /api/auth/users
// @access  Private (Admin, Super Admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const result = await authService.getAllUsers(req.query);
  return successResponse(res, 'Users fetched successfully', result);
});

// @desc    Get user by ID
// @route   GET /api/auth/users/:id
// @access  Private (Admin, Super Admin)
const getUserById = asyncHandler(async (req, res) => {
  const result = await authService.getUserById(req.params.id);
  
  if (result.error) {
    return errorResponse(res, result.error, 404);
  }

  return successResponse(res, 'User fetched successfully', result);
});

// @desc    Update user role
// @route   PUT /api/auth/users/:id/role
// @access  Private (Super Admin)
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  
  const result = await authService.updateUserRole(req.params.id, role);
  
  if (result.error) {
    return errorResponse(res, result.error, 404);
  }

  return successResponse(res, 'User role updated successfully', result);
});

// @desc    Toggle user status
// @route   PUT /api/auth/users/:id/status
// @access  Private (Admin, Super Admin)
const toggleUserStatus = asyncHandler(async (req, res) => {
  const result = await authService.toggleUserStatus(req.params.id);
  
  if (result.error) {
    return errorResponse(res, result.error, 404);
  }

  return successResponse(res, 'User status updated successfully', result);
});

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private (Super Admin)
const deleteUser = asyncHandler(async (req, res) => {
  const result = await authService.deleteUser(req.params.id);
  
  if (result.error) {
    return errorResponse(res, result.error, 404);
  }

  return successResponse(res, result.message, {});
});

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser
};