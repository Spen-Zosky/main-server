const mongoose = require('mongoose');

/**
 * ResearchProject Schema - NOSE Research Framework
 * Academic research project management with collaboration and publication tracking
 */
const ResearchProjectSchema = new mongoose.Schema({
  // Project Identification
  projectId: {
    type: String,
    required: [true, 'Project ID is required'],
    unique: true,
    uppercase: true,
    match: [/^PROJ[0-9]{6}$/, 'Project ID must be in format PROJ000000']
  },
  
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  // Project Details
  description: {
    abstract: {
      type: String,
      required: [true, 'Project abstract is required'],
      maxlength: [2000, 'Abstract cannot exceed 2000 characters']
    },
    objectives: [{
      type: String,
      required: true,
      maxlength: [500, 'Objective cannot exceed 500 characters']
    }],
    methodology: {
      type: String,
      maxlength: [3000, 'Methodology cannot exceed 3000 characters']
    },
    expectedOutcomes: [{
      type: String,
      maxlength: [500, 'Expected outcome cannot exceed 500 characters']
    }]
  },
  
  // Research Classification
  classification: {
    researchType: {
      type: String,
      enum: ['basic', 'applied', 'experimental', 'theoretical', 'mixed'],
      required: [true, 'Research type is required']
    },
    fieldOfStudy: {
      primary: {
        type: String,
        required: [true, 'Primary field of study is required']
      },
      secondary: [String]
    },
    keywords: [{
      type: String,
      trim: true
    }],
    subjects: [{
      type: String,
      enum: [
        'computer_science', 'mathematics', 'physics', 'chemistry', 'biology',
        'medicine', 'engineering', 'psychology', 'sociology', 'economics',
        'philosophy', 'literature', 'history', 'other'
      ]
    }],
    ethicsApprovalRequired: {
      type: Boolean,
      default: false
    },
    ethicsApprovalNumber: String
  },
  
  // Team Management
  team: {
    principalInvestigator: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Principal investigator is required']
      },
      role: { type: String, default: 'Principal Investigator' },
      affiliationInstitution: String,
      contactEmail: String
    },
    
    coInvestigators: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role: String,
      affiliationInstitution: String,
      expertise: [String],
      contributionPercentage: {
        type: Number,
        min: 0,
        max: 100
      },
      joinedDate: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ['active', 'inactive', 'left'],
        default: 'active'
      }
    }],
    
    students: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      level: {
        type: String,
        enum: ['undergraduate', 'graduate', 'phd', 'postdoc']
      },
      supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      joinedDate: { type: Date, default: Date.now },
      expectedGraduationDate: Date,
      thesisTitle: String,
      status: {
        type: String,
        enum: ['active', 'completed', 'withdrawn'],
        default: 'active'
      }
    }],
    
    externalCollaborators: [{
      name: { type: String, required: true },
      email: String,
      institution: String,
      role: String,
      expertise: [String],
      contactInfo: {
        phone: String,
        address: String
      }
    }]
  },
  
  // Project Timeline
  timeline: {
    proposalDate: Date,
    approvalDate: Date,
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    expectedEndDate: {
      type: Date,
      required: [true, 'Expected end date is required']
    },
    actualEndDate: Date,
    
    milestones: [{
      title: { type: String, required: true },
      description: String,
      targetDate: { type: Date, required: true },
      actualDate: Date,
      status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed', 'delayed', 'cancelled'],
        default: 'not_started'
      },
      deliverables: [String]
    }],
    
    phases: [{
      name: { type: String, required: true },
      description: String,
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed', 'cancelled'],
        default: 'not_started'
      },
      progress: { type: Number, min: 0, max: 100, default: 0 }
    }]
  },
  
  // Funding Information
  funding: {
    totalBudget: {
      amount: { type: Number, min: 0 },
      currency: { type: String, default: 'USD' }
    },
    
    sources: [{
      organization: { type: String, required: true },
      grantNumber: String,
      amount: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ['applied', 'approved', 'rejected', 'active', 'completed'],
        default: 'applied'
      },
      restrictions: [String],
      reportingRequirements: [String]
    }],
    
    expenses: [{
      category: {
        type: String,
        enum: ['personnel', 'equipment', 'supplies', 'travel', 'other'],
        required: true
      },
      description: String,
      amount: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
      date: { type: Date, default: Date.now },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      receiptUrl: String
    }],
    
    remainingBudget: { type: Number, default: 0 }
  },
  
  // Publications and Outputs
  publications: [{
    title: { type: String, required: true },
    authors: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String, // For external authors
      order: { type: Number, required: true },
      isCorresponding: { type: Boolean, default: false }
    }],
    
    publicationType: {
      type: String,
      enum: ['journal_article', 'conference_paper', 'book_chapter', 'book', 'thesis', 'report', 'patent'],
      required: true
    },
    
    venue: {
      name: String,
      type: {
        type: String,
        enum: ['journal', 'conference', 'workshop', 'book', 'repository']
      },
      impactFactor: Number,
      ranking: String
    },
    
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'accepted', 'published', 'rejected'],
      default: 'draft'
    },
    
    dates: {
      submitted: Date,
      accepted: Date,
      published: Date
    },
    
    identifiers: {
      doi: String,
      pmid: String,
      arxivId: String,
      isbn: String
    },
    
    urls: {
      manuscript: String,
      supplementary: String,
      data: String,
      code: String
    },
    
    citationCount: { type: Number, default: 0 },
    lastCitationUpdate: Date
  }],
  
  // Data Management
  data: {
    datasets: [{
      name: { type: String, required: true },
      description: String,
      type: {
        type: String,
        enum: ['experimental', 'observational', 'computational', 'survey', 'literature']
      },
      size: String, // e.g., "10GB", "1M records"
      format: [String], // e.g., ["CSV", "JSON", "HDF5"]
      location: String,
      accessLevel: {
        type: String,
        enum: ['public', 'restricted', 'private'],
        default: 'private'
      },
      license: String,
      lastUpdated: { type: Date, default: Date.now },
      version: { type: String, default: '1.0' }
    }],
    
    softwareTools: [{
      name: { type: String, required: true },
      version: String,
      purpose: String,
      license: String,
      repository: String,
      documentation: String
    }],
    
    protocols: [{
      name: { type: String, required: true },
      description: String,
      version: String,
      documentUrl: String,
      lastUpdated: { type: Date, default: Date.now }
    }]
  },
  
  // Collaboration and Communication
  collaboration: {
    meetings: [{
      title: String,
      date: { type: Date, required: true },
      attendees: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        name: String // For external attendees
      }],
      agenda: [String],
      minutes: String,
      actionItems: [{
        task: String,
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        dueDate: Date,
        status: {
          type: String,
          enum: ['pending', 'in_progress', 'completed'],
          default: 'pending'
        }
      }]
    }],
    
    communications: [{
      type: {
        type: String,
        enum: ['email', 'call', 'video_conference', 'in_person'],
        required: true
      },
      date: { type: Date, required: true },
      participants: [String],
      summary: String,
      followUpRequired: { type: Boolean, default: false }
    }]
  },
  
  // Risk Management
  risks: [{
    category: {
      type: String,
      enum: ['technical', 'financial', 'timeline', 'personnel', 'ethical', 'regulatory'],
      required: true
    },
    description: { type: String, required: true },
    probability: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    impact: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    mitigationStrategy: String,
    status: {
      type: String,
      enum: ['identified', 'monitoring', 'mitigated', 'occurred'],
      default: 'identified'
    },
    identifiedDate: { type: Date, default: Date.now },
    lastReviewDate: Date
  }],
  
  // Quality Assurance
  quality: {
    reviews: [{
      reviewType: {
        type: String,
        enum: ['peer_review', 'ethics_review', 'institutional_review', 'external_review'],
        required: true
      },
      reviewer: String,
      reviewDate: { type: Date, required: true },
      rating: {
        type: String,
        enum: ['excellent', 'good', 'satisfactory', 'needs_improvement', 'unsatisfactory']
      },
      comments: String,
      recommendations: [String],
      followUpRequired: { type: Boolean, default: false }
    }],
    
    qualityMetrics: {
      dataQualityScore: { type: Number, min: 0, max: 100 },
      reproducibilityScore: { type: Number, min: 0, max: 100 },
      documentationCompleteness: { type: Number, min: 0, max: 100 },
      lastAssessmentDate: Date
    }
  },
  
  // Project Status and Health
  status: {
    type: String,
    enum: ['planning', 'active', 'on_hold', 'completed', 'cancelled', 'suspended'],
    default: 'planning'
  },
  
  health: {
    overallHealth: {
      type: String,
      enum: ['green', 'yellow', 'red'],
      default: 'green'
    },
    budgetHealth: {
      type: String,
      enum: ['green', 'yellow', 'red'],
      default: 'green'
    },
    timelineHealth: {
      type: String,
      enum: ['green', 'yellow', 'red'],
      default: 'green'
    },
    teamHealth: {
      type: String,
      enum: ['green', 'yellow', 'red'],
      default: 'green'
    },
    lastHealthCheck: { type: Date, default: Date.now }
  },
  
  // Analytics and Insights
  analytics: {
    views: { type: Number, default: 0 },
    collaborationRequests: { type: Number, default: 0 },
    dataDownloads: { type: Number, default: 0 },
    citationImpact: {
      hIndex: { type: Number, default: 0 },
      totalCitations: { type: Number, default: 0 },
      averageCitationsPerPaper: { type: Number, default: 0 }
    },
    lastAnalyticsUpdate: Date
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
ResearchProjectSchema.index({ projectId: 1 });
ResearchProjectSchema.index({ 'team.principalInvestigator.userId': 1 });
ResearchProjectSchema.index({ status: 1 });
ResearchProjectSchema.index({ 'classification.fieldOfStudy.primary': 1 });
ResearchProjectSchema.index({ 'timeline.startDate': -1 });
ResearchProjectSchema.index({ 'health.overallHealth': 1 });

// Compound indexes
ResearchProjectSchema.index({ 'classification.subjects': 1, status: 1 });
ResearchProjectSchema.index({ 'team.principalInvestigator.userId': 1, status: 1 });

// Text index for search
ResearchProjectSchema.index({
  title: 'text',
  'description.abstract': 'text',
  'classification.keywords': 'text'
});

// Virtual for project duration
ResearchProjectSchema.virtual('durationInDays').get(function() {
  if (!this.timeline.startDate || !this.timeline.expectedEndDate) return null;
  const start = new Date(this.timeline.startDate);
  const end = this.timeline.actualEndDate || this.timeline.expectedEndDate;
  return Math.ceil((new Date(end) - start) / (1000 * 60 * 60 * 24));
});

// Virtual for budget utilization
ResearchProjectSchema.virtual('budgetUtilization').get(function() {
  if (!this.funding.totalBudget.amount) return 0;
  const totalExpenses = this.funding.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return (totalExpenses / this.funding.totalBudget.amount) * 100;
});

// Virtual for team size
ResearchProjectSchema.virtual('teamSize').get(function() {
  return 1 + // PI
         this.team.coInvestigators.length +
         this.team.students.length +
         this.team.externalCollaborators.length;
});

// Pre-save middleware for audit trail
ResearchProjectSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.audit.lastModified = new Date();
    this.audit.version += 1;
  }
  
  // Update remaining budget
  if (this.isModified('funding.expenses') || this.isModified('funding.totalBudget')) {
    const totalExpenses = this.funding.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    this.funding.remainingBudget = (this.funding.totalBudget.amount || 0) - totalExpenses;
  }
  
  next();
});

// Instance Methods

/**
 * Check if project is overdue
 * @returns {boolean} - True if project is overdue
 */
ResearchProjectSchema.methods.isOverdue = function() {
  if (this.status === 'completed' || !this.timeline.expectedEndDate) return false;
  return new Date() > new Date(this.timeline.expectedEndDate);
};

/**
 * Get active team members
 * @returns {Array} - Array of active team members
 */
ResearchProjectSchema.methods.getActiveTeamMembers = function() {
  const activeMembers = [];
  
  // Add PI
  activeMembers.push({
    userId: this.team.principalInvestigator.userId,
    role: 'Principal Investigator',
    type: 'pi'
  });
  
  // Add active co-investigators
  this.team.coInvestigators
    .filter(co => co.status === 'active')
    .forEach(co => {
      activeMembers.push({
        userId: co.userId,
        role: co.role,
        type: 'co_investigator'
      });
    });
  
  // Add active students
  this.team.students
    .filter(student => student.status === 'active')
    .forEach(student => {
      activeMembers.push({
        userId: student.userId,
        role: `${student.level} Student`,
        type: 'student'
      });
    });
  
  return activeMembers;
};

/**
 * Calculate project progress based on milestones
 * @returns {number} - Progress percentage (0-100)
 */
ResearchProjectSchema.methods.calculateProgress = function() {
  if (!this.timeline.milestones.length) return 0;
  
  const completedMilestones = this.timeline.milestones.filter(
    milestone => milestone.status === 'completed'
  ).length;
  
  return Math.round((completedMilestones / this.timeline.milestones.length) * 100);
};

/**
 * Add publication to project
 * @param {Object} publicationData - Publication data
 * @returns {Promise} - Saved project
 */
ResearchProjectSchema.methods.addPublication = function(publicationData) {
  this.publications.push(publicationData);
  return this.save();
};

// Static Methods

/**
 * Find projects by principal investigator
 * @param {string} userId - User ID of PI
 * @returns {Promise<ResearchProject[]>} - Array of projects
 */
ResearchProjectSchema.statics.findByPI = function(userId) {
  return this.find({
    'team.principalInvestigator.userId': userId
  }).populate('team.principalInvestigator.userId', 'profile.firstName profile.lastName email');
};

/**
 * Generate next project ID
 * @returns {Promise<string>} - Next project ID
 */
ResearchProjectSchema.statics.generateProjectId = async function() {
  const lastProject = await this.findOne({}, {}, { sort: { projectId: -1 } });
  if (!lastProject) {
    return 'PROJ000001';
  }
  
  const lastNumber = parseInt(lastProject.projectId.substring(4));
  const nextNumber = lastNumber + 1;
  return `PROJ${nextNumber.toString().padStart(6, '0')}`;
};

/**
 * Get projects by status
 * @param {string} status - Project status
 * @returns {Promise<ResearchProject[]>} - Array of projects
 */
ResearchProjectSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('team.principalInvestigator.userId', 'profile.firstName profile.lastName');
};

module.exports = mongoose.model('ResearchProject', ResearchProjectSchema);