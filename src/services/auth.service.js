const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class AuthService {
  // Register new user
  async register(userData) {
    const { email, mobile, password, role, firstName, lastName } = userData;

    // Check if user exists with email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return { error: 'Email already registered' };
    }

    // Check if user exists with mobile
    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) {
      return { error: 'Mobile number already registered' };
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      countryCode: userData.countryCode || '+91',
      address: userData.address,
      designation: userData.designation,
      password,
      profilePic: userData.profilePic || '',
      role: role || 'user'
    });

    const token = generateToken(user._id);

    return {
      user: user.toJSON(),
      token
    };
  }

  // Login user
  async login(identifier, password) {
    // Try to find by email or mobile
    let user = await User.findOne({ email: identifier }).select('+password');
    
    if (!user) {
      user = await User.findOne({ mobile: identifier }).select('+password');
    }

    if (!user) {
      return { error: 'Invalid credentials' };
    }

    // Check if user is active
    if (!user.isActive) {
      return { error: 'Your account has been deactivated' };
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return { error: 'Invalid credentials' };
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    return {
      user: user.toJSON(),
      token
    };
  }

  // Get current user
  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      return { error: 'User not found' };
    }
    return { user: user.toJSON() };
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return { error: 'User not found' };
    }

    return { user: user.toJSON() };
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return { error: 'User not found' };
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return { error: 'Current password is incorrect' };
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }

  // Logout (could be used for token blacklisting in future)
  async logout(userId) {
    // For now, just return success
    // In production, you might want to blacklist the token
    return { message: 'Logged out successfully' };
  }

  // Get all users (admin only)
  async getAllUsers(query) {
    const { page = 1, limit = 10, search, role, isActive } = query;

    const filter = {};
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    return {
      users: users.map(u => u.toJSON()),
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    };
  }

  // Get user by ID
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      return { error: 'User not found' };
    }
    return { user: user.toJSON() };
  }

  // Update user role (admin only)
  async updateUserRole(userId, role) {
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) {
      return { error: 'User not found' };
    }

    return { user: user.toJSON() };
  }

  // Toggle user active status
  async toggleUserStatus(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      return { error: 'User not found' };
    }

    user.isActive = !user.isActive;
    await user.save();

    return { user: user.toJSON() };
  }

  // Delete user (soft delete - deactivate)
  async deleteUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return { error: 'User not found' };
    }

    return { message: 'User deleted successfully' };
  }
}

module.exports = new AuthService();