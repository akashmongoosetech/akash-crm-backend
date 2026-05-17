const { z } = require('zod');

const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  companyName: z.string().min(1, 'Company name is required').max(100),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  leadSource: z.enum(['Web', 'Referral', 'Cold Call', 'Campaign', 'Partner', 'Website', 'Trade Show', 'Other']),
  leadStatus: z.enum(['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted']),
  industry: z.string().optional(),
  website: z.string().optional(),
  annualRevenue: z.string().optional(),
  noOfEmployees: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  assignedUser: z.string().optional(),
  tags: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

const validateLead = (data) => {
  return leadSchema.parse(data);
};

const validateLeadPartial = (data) => {
  return leadSchema.partial().parse(data);
};

module.exports = {
  validateLead,
  validateLeadPartial,
  leadSchema,
};
