const Lead = require('../models/lead.model');

const createLead = async (leadData, userId) => {
  const notes = typeof leadData.notes === 'string' 
    ? (leadData.notes ? [{ text: leadData.notes, user: 'System', createdAt: new Date() }] : [])
    : (leadData.notes || []);

  const lead = new Lead({
    ...leadData,
    notes,
    createdBy: userId,
    activities: [{
      user: 'System',
      action: 'Lead created',
      time: new Date().toISOString(),
      iconType: 'User'
    }]
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
  const lead = await Lead.findOne({ _id: id, isDeleted: false });
  if (!lead) return null;

  const updates = { ...leadData, updatedBy: userId };
  
  if (typeof leadData.notes === 'string') {
    updates.notes = leadData.notes ? [{ text: leadData.notes, user: 'System', createdAt: new Date() }] : [];
  }

  if (leadData.leadStatus && leadData.leadStatus !== lead.leadStatus) {
    lead.activities.push({
      user: 'Sales Rep',
      action: `changed status to ${leadData.leadStatus}`,
      time: new Date().toISOString(),
      iconType: 'Clock'
    });
  } else {
    lead.activities.push({
      user: 'Sales Rep',
      action: 'Lead updated',
      time: new Date().toISOString(),
      iconType: 'Clock'
    });
  }
  updates.activities = lead.activities;

  return await Lead.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updates,
    { new: true, runValidators: true }
  );
};

const addNote = async (id, text, userName) => {
  const lead = await Lead.findOne({ _id: id, isDeleted: false });
  if (!lead) return null;

  const newNote = { text, user: userName, createdAt: new Date() };
  lead.notes.push(newNote);
  return await lead.save();
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
  addNote,
  deleteLead,
};
