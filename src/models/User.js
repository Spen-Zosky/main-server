const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * User Schema - Foundation authentication model for all frameworks
 * Supports AI-HRMS, NOSE Research, and Web-Hunter frameworks
 */
const UserSchema = new mongoose.Schema({
  // Authentication Core
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username cannot exceed 50 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include in queries by default
  },
  
  // Profile Information
  profile: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    avatar: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  
  // Framework Permissions & Roles
  frameworks: {
    aiHrms: {
      enabled: { type: Boolean, default: false },
      role: { 
        type: String, 
        enum: ['viewer', 'employee', 'manager', 'hr_admin', 'super_admin'],
        default: 'viewer'
      },
      permissions: [{
        type: String,
        enum: [
          'view_employees', 'edit_employees', 'delete_employees',
          'view_payroll', 'manage_payroll', 'view_reports',
          'manage_departments', 'system_admin'
        ]
      }],
      department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
      employeeId: { type: String, unique: true, sparse: true }
    },
    
    nose: {
      enabled: { type: Boolean, default: false },
      role: {
        type: String,
        enum: ['viewer', 'researcher', 'lead_researcher', 'admin'],
        default: 'viewer'
      },
      permissions: [{
        type: String,
        enum: [
          'view_projects', 'create_projects', 'edit_projects', 'delete_projects',
          'manage_collaborations', 'view_publications', 'manage_publications',
          'system_admin'
        ]
      }],
      institution: { type: String },
      researchAreas: [{ type: String }]
    },
    
    webHunter: {
      enabled: { type: Boolean, default: false },
      role: {
        type: String,
        enum: ['viewer', 'analyst', 'data_scientist', 'admin'],
        default: 'viewer'
      },
      permissions: [{
        type: String,
        enum: [
          'view_jobs', 'create_jobs', 'edit_jobs', 'delete_jobs',
          'manage_datasets', 'view_analytics', 'export_data',
          'system_admin'
        ]
      }],
      apiQuota: { type: Number, default: 1000 }
    }
  },
  
  // Security Features
  security: {
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    emailVerifiedAt: { type: Date },
    
    // Account Lockout
    isLocked: { type: Boolean, default: false },
    lockUntil: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    
    // Password Reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    
    // Two Factor Authentication
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    
    // Session Management
    refreshTokens: [{
      token: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      expiresAt: { type: Date, required: true },
      deviceInfo: { type: String }
    }],
    
    lastLogin: { type: Date },
    lastLoginIP: { type: String },
    passwordChangedAt: { type: Date }
  },
  
  // System Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'pending'
  },
  
  // Audit Trail
  audit: {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastModified: { type: Date, default: Date.now },
    version: { type: Number, default: 1 }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for Performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ 'frameworks.aiHrms.employeeId': 1 }, { sparse: true });
UserSchema.index({ 'security.isLocked': 1, 'security.lockUntil': 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Virtual for account lock status
UserSchema.virtual('isAccountLocked').get(function() {
  return !!(this.security.isLocked && this.security.lockUntil && this.security.lockUntil > Date.now());
});

// Pre-save middleware for password hashing
UserSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with salt rounds of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Update password changed timestamp
    this.security.passwordChangedAt = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware for audit trail
UserSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.audit.lastModified = new Date();
    this.audit.version += 1;
  }
  next();
});

// Instance Methods

/**
 * Compare provided password with stored hash
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} - True if passwords match
 */
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate JWT access token
 * @returns {string} - JWT token
 */
UserSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { 
      userId: this._id,
      username: this.username,
      email: this.email,
      frameworks: this.frameworks
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  );
};

/**
 * Generate JWT refresh token
 * @param {string} deviceInfo - Device information
 * @returns {string} - Refresh token
 */
UserSchema.methods.generateRefreshToken = function(deviceInfo = '') {
  const token = jwt.sign(
    { userId: this._id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
  
  // Store refresh token
  this.security.refreshTokens.push({
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    deviceInfo
  });
  
  return token;
};

/**
 * Revoke refresh token
 * @param {string} token - Token to revoke
 */
UserSchema.methods.revokeRefreshToken = function(token) {
  this.security.refreshTokens = this.security.refreshTokens.filter(
    rt => rt.token !== token
  );
};

/**
 * Increment login attempts and lock account if necessary
 */
UserSchema.methods.incLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { 'security.lockUntil': 1 },
      $set: { 'security.loginAttempts': 1, 'security.isLocked': false }
    });
  }
  
  const updates = { $inc: { 'security.loginAttempts': 1 } };
  
  // Lock account after 5 attempts for 2 hours
  if (this.security.loginAttempts + 1 >= 5 && !this.security.isLocked) {
    updates.$set = {
      'security.lockUntil': Date.now() + 2 * 60 * 60 * 1000, // 2 hours
      'security.isLocked': true
    };
  }
  
  return this.updateOne(updates);
};

/**
 * Reset login attempts
 */
UserSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $unset: { 'security.loginAttempts': 1, 'security.lockUntil': 1 },
    $set: { 'security.isLocked': false }
  });
};

/**
 * Check if user has framework permission
 * @param {string} framework - Framework name (aiHrms, nose, webHunter)
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if user has permission
 */
UserSchema.methods.hasFrameworkPermission = function(framework, permission) {
  const frameworkData = this.frameworks[framework];
  return frameworkData && 
         frameworkData.enabled && 
         frameworkData.permissions.includes(permission);
};

/**
 * Check if user has framework role
 * @param {string} framework - Framework name
 * @param {string|Array} roles - Role(s) to check
 * @returns {boolean} - True if user has role
 */
UserSchema.methods.hasFrameworkRole = function(framework, roles) {
  const frameworkData = this.frameworks[framework];
  if (!frameworkData || !frameworkData.enabled) return false;
  
  const rolesArray = Array.isArray(roles) ? roles : [roles];
  return rolesArray.includes(frameworkData.role);
};

// Static Methods

/**
 * Find user by email or username
 * @param {string} identifier - Email or username
 * @returns {Promise<User>} - User document
 */
UserSchema.statics.findByIdentifier = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  }).select('+password');
};

/**
 * Clean expired refresh tokens
 */
UserSchema.statics.cleanExpiredTokens = async function() {
  return this.updateMany(
    {},
    {
      $pull: {
        'security.refreshTokens': {
          expiresAt: { $lt: new Date() }
        }
      }
    }
  );
};

module.exports = mongoose.model('User', UserSchema);