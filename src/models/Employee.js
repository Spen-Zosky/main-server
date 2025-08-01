const mongoose = require('mongoose');

/**
 * Employee Schema - AI-HRMS Framework
 * Comprehensive employee management with performance tracking and analytics
 */
const EmployeeSchema = new mongoose.Schema({
  // Link to User Account
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  
  // Employee Identification
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    uppercase: true,
    match: [/^EMP[0-9]{6}$/, 'Employee ID must be in format EMP000000']
  },
  
  // Personal Information
  personalInfo: {
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      required: [true, 'Gender is required']
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed', 'separated'],
      default: 'single'
    },
    nationality: {
      type: String,
      required: [true, 'Nationality is required']
    },
    socialSecurityNumber: {
      type: String,
      unique: true,
      sparse: true,
      select: false // Sensitive data
    },
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String }
    }
  },
  
  // Address Information
  address: {
    current: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    permanent: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      sameAsCurrent: { type: Boolean, default: true }
    }
  },
  
  // Employment Details
  employment: {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required']
    },
    position: {
      title: { type: String, required: true },
      level: {
        type: String,
        enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive'],
        required: true
      },
      category: {
        type: String,
        enum: ['full_time', 'part_time', 'contract', 'intern', 'consultant'],
        required: true
      }
    },
    
    // Employment Timeline
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      default: null
    },
    probationEndDate: {
      type: Date
    },
    
    // Manager Hierarchy
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    directReports: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    }],
    
    // Work Schedule
    schedule: {
      workingHours: {
        monday: { start: String, end: String, isWorkingDay: Boolean },
        tuesday: { start: String, end: String, isWorkingDay: Boolean },
        wednesday: { start: String, end: String, isWorkingDay: Boolean },
        thursday: { start: String, end: String, isWorkingDay: Boolean },
        friday: { start: String, end: String, isWorkingDay: Boolean },
        saturday: { start: String, end: String, isWorkingDay: Boolean },
        sunday: { start: String, end: String, isWorkingDay: Boolean }
      },
      timezone: { type: String, default: 'UTC' },
      workLocation: {
        type: String,
        enum: ['office', 'remote', 'hybrid'],
        default: 'office'
      }
    }
  },
  
  // Compensation & Benefits
  compensation: {
    salary: {
      amount: {
        type: Number,
        required: [true, 'Salary amount is required'],
        min: [0, 'Salary cannot be negative']
      },
      currency: {
        type: String,
        default: 'USD',
        uppercase: true
      },
      frequency: {
        type: String,
        enum: ['hourly', 'monthly', 'annually'],
        default: 'annually'
      },
      lastReviewDate: Date,
      nextReviewDate: Date
    },
    
    benefits: {
      healthInsurance: { type: Boolean, default: false },
      dentalInsurance: { type: Boolean, default: false },
      visionInsurance: { type: Boolean, default: false },
      lifeInsurance: { type: Boolean, default: false },
      retirementPlan: { type: Boolean, default: false },
      paidTimeOff: {
        annual: { type: Number, default: 0 },
        sick: { type: Number, default: 0 },
        personal: { type: Number, default: 0 }
      }
    },
    
    // Bonus and Incentives
    bonuses: [{
      type: {
        type: String,
        enum: ['performance', 'annual', 'signing', 'retention', 'project'],
        required: true
      },
      amount: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
      dateAwarded: { type: Date, default: Date.now },
      description: String
    }]
  },
  
  // Skills & Qualifications
  skills: {
    technical: [{
      name: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert']
      },
      yearsOfExperience: Number,
      certifications: [String]
    }],
    
    soft: [{
      name: String,
      level: {
        type: String,
        enum: ['developing', 'competent', 'proficient', 'expert']
      }
    }],
    
    languages: [{
      language: String,
      proficiency: {
        type: String,
        enum: ['basic', 'conversational', 'fluent', 'native']
      }
    }]
  },
  
  // Education & Training
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: String,
    graduationDate: Date,
    gpa: Number,
    honors: String
  }],
  
  training: [{
    title: { type: String, required: true },
    provider: String,
    completionDate: Date,
    expirationDate: Date,
    certificateUrl: String,
    score: Number
  }],
  
  // Performance Management
  performance: {
    currentRating: {
      type: String,
      enum: ['outstanding', 'exceeds_expectations', 'meets_expectations', 'below_expectations', 'unsatisfactory']
    },
    
    reviews: [{
      reviewPeriod: {
        startDate: Date,
        endDate: Date
      },
      reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
      },
      rating: {
        type: String,
        enum: ['outstanding', 'exceeds_expectations', 'meets_expectations', 'below_expectations', 'unsatisfactory']
      },
      goals: [{
        title: String,
        description: String,
        status: {
          type: String,
          enum: ['not_started', 'in_progress', 'completed', 'cancelled']
        },
        targetDate: Date,
        completionDate: Date,
        weight: Number // Percentage importance
      }],
      feedback: {
        strengths: [String],
        areasForImprovement: [String],
        managerComments: String,
        employeeComments: String
      },
      reviewDate: { type: Date, default: Date.now }
    }],
    
    // Goals and Objectives
    currentGoals: [{
      title: { type: String, required: true },
      description: String,
      status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed', 'cancelled'],
        default: 'not_started'
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      },
      targetDate: Date,
      completionDate: Date,
      progress: { type: Number, min: 0, max: 100, default: 0 }
    }]
  },
  
  // Leave Management
  leaves: [{
    type: {
      type: String,
      enum: ['vacation', 'sick', 'personal', 'maternity', 'paternity', 'bereavement', 'jury_duty'],
      required: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    reason: String,
    appliedDate: { type: Date, default: Date.now },
    approvalDate: Date
  }],
  
  // Disciplinary Actions
  disciplinaryActions: [{
    type: {
      type: String,
      enum: ['verbal_warning', 'written_warning', 'suspension', 'termination'],
      required: true
    },
    reason: { type: String, required: true },
    description: String,
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    issueDate: { type: Date, default: Date.now },
    acknowledgmentDate: Date,
    employeeComments: String
  }],
  
  // Documents and Files
  documents: [{
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['contract', 'id_copy', 'resume', 'certificate', 'policy_acknowledgment', 'other'],
      required: true
    },
    url: String,
    uploadDate: { type: Date, default: Date.now },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isConfidential: { type: Boolean, default: false }
  }],
  
  // AI Analytics & Insights
  aiInsights: {
    performancePrediction: {
      nextQuarterRating: String,
      riskFactors: [String],
      improvementSuggestions: [String],
      lastAnalysisDate: Date
    },
    careerPath: {
      suggestedNextRoles: [String],
      requiredSkills: [String],
      timeToPromotion: Number, // months
      lastAnalysisDate: Date
    },
    engagementScore: {
      score: { type: Number, min: 0, max: 100 },
      factors: [String],
      lastCalculated: Date
    }
  },
  
  // System Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'terminated', 'on_leave'],
    default: 'active'
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
EmployeeSchema.index({ employeeId: 1 });
EmployeeSchema.index({ userId: 1 });
EmployeeSchema.index({ 'employment.department': 1 });
EmployeeSchema.index({ 'employment.manager': 1 });
EmployeeSchema.index({ status: 1 });
EmployeeSchema.index({ 'employment.startDate': -1 });
EmployeeSchema.index({ 'performance.currentRating': 1 });

// Compound indexes
EmployeeSchema.index({ 'employment.department': 1, status: 1 });
EmployeeSchema.index({ 'employment.manager': 1, status: 1 });

// Virtual for age calculation
EmployeeSchema.virtual('age').get(function() {
  if (!this.personalInfo.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.personalInfo.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for years of service
EmployeeSchema.virtual('yearsOfService').get(function() {
  if (!this.employment.startDate) return 0;
  const today = new Date();
  const startDate = new Date(this.employment.startDate);
  return Math.floor((today - startDate) / (365.25 * 24 * 60 * 60 * 1000));
});

// Virtual for current leave balance
EmployeeSchema.virtual('leaveBalance').get(function() {
  const currentYear = new Date().getFullYear();
  const thisYearLeaves = this.leaves.filter(leave => 
    leave.status === 'approved' && 
    new Date(leave.startDate).getFullYear() === currentYear
  );
  
  const usedDays = thisYearLeaves.reduce((total, leave) => total + leave.days, 0);
  const totalAllowance = this.compensation.benefits.paidTimeOff.annual || 0;
  
  return Math.max(0, totalAllowance - usedDays);
});

// Pre-save middleware for audit trail
EmployeeSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.audit.lastModified = new Date();
    this.audit.version += 1;
  }
  next();
});

// Instance Methods

/**
 * Check if employee is currently on leave
 * @returns {boolean} - True if on leave
 */
EmployeeSchema.methods.isOnLeave = function() {
  const today = new Date();
  return this.leaves.some(leave => 
    leave.status === 'approved' &&
    new Date(leave.startDate) <= today &&
    new Date(leave.endDate) >= today
  );
};

/**
 * Get employee's direct reports
 * @returns {Promise<Employee[]>} - Array of direct report employees
 */
EmployeeSchema.methods.getDirectReports = function() {
  return this.model('Employee').find({
    'employment.manager': this._id,
    status: 'active'
  }).populate('userId', 'profile.firstName profile.lastName email');
};

/**
 * Calculate total compensation including bonuses
 * @param {number} year - Year to calculate for (default: current year)
 * @returns {number} - Total compensation
 */
EmployeeSchema.methods.getTotalCompensation = function(year = new Date().getFullYear()) {
  const baseSalary = this.compensation.salary.amount || 0;
  const bonuses = this.compensation.bonuses
    .filter(bonus => new Date(bonus.dateAwarded).getFullYear() === year)
    .reduce((total, bonus) => total + bonus.amount, 0);
  
  return baseSalary + bonuses;
};

// Static Methods

/**
 * Find employees by department
 * @param {string} departmentId - Department ID
 * @returns {Promise<Employee[]>} - Array of employees
 */
EmployeeSchema.statics.findByDepartment = function(departmentId) {
  return this.find({
    'employment.department': departmentId,
    status: 'active'
  }).populate('userId', 'profile.firstName profile.lastName email');
};

/**
 * Generate next employee ID
 * @returns {Promise<string>} - Next employee ID
 */
EmployeeSchema.statics.generateEmployeeId = async function() {
  const lastEmployee = await this.findOne({}, {}, { sort: { employeeId: -1 } });
  if (!lastEmployee) {
    return 'EMP000001';
  }
  
  const lastNumber = parseInt(lastEmployee.employeeId.substring(3));
  const nextNumber = lastNumber + 1;
  return `EMP${nextNumber.toString().padStart(6, '0')}`;
};

module.exports = mongoose.model('Employee', EmployeeSchema);