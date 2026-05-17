const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
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
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  mobileNumber: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  leadSource: {
    type: String,
    required: [true, 'Lead source is required'],
    enum: ['Web', 'Referral', 'Cold Call', 'Campaign', 'Partner', 'Website', 'Trade Show', 'Other'],
    default: 'Web'
  },
  leadStatus: {
    type: String,
    required: [true, 'Lead status is required'],
    enum: ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'],
    default: 'New'
  },
  industry: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  annualRevenue: {
    type: String,
    trim: true
  },
  noOfEmployees: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  assignedUser: {
    type: String,
    trim: true
  },
  tags: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  activities: [{
    user: { type: String, default: 'System' },
    action: String,
    time: String,
    iconType: { type: String, enum: ['User', 'Clock'], default: 'Clock' }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);
