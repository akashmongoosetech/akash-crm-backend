const Lead = require('../models/lead.model');

const createLead = async (leadData, userId) => {
  const lead = new Lead({
    ...leadData,
    createdBy: userId,
  });
  return await lead.save();
};

const getLeads = async (query = {}) => {
  const { page = 1, limit = 10, search, status, source, sort = '-createdAt' } = query;
  const filter = { isDeleted: false };

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { mobileNumber: { $regex: search, $options: 'i' } },
    ];
  }
  if (status) filter.leadStatus = status;
  if (source) filter.leadSource = source;

  const leads = await Lead.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('createdBy', 'firstName lastName');

  const total = await Lead.countDocuments(filter);

  return {
    leads,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getLeadById = async (id) => {
  return await Lead.findOne({ _id: id, isDeleted: false }).populate('createdBy', 'firstName lastName');
};

const updateLead = async (id, leadData, userId) => {
  return await Lead.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { ...leadData, updatedBy: userId },
    { new: true, runValidators: true }
  );
};

const deleteLead = async (id) => {
  return await Lead.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
};
