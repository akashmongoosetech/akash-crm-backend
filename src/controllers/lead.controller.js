const leadService = require('../services/lead.service');
const { validateLead, validateLeadPartial } = require('../validators/lead.validator');
const { asyncHandler } = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const createLead = asyncHandler(async (req, res) => {
  const validatedData = validateLead(req.body);
  const lead = await leadService.createLead(validatedData, req.user.id);
  return successResponse(res, 'Lead created successfully', lead, 201);
});

const getLeads = asyncHandler(async (req, res) => {
  const result = await leadService.getLeads(req.query);
  return successResponse(res, 'Leads fetched successfully', result);
});

const getLeadById = asyncHandler(async (req, res) => {
  const lead = await leadService.getLeadById(req.params.id);
  if (!lead) {
    return errorResponse(res, 'Lead not found', 404);
  }
  return successResponse(res, 'Lead fetched successfully', lead);
});

const updateLead = asyncHandler(async (req, res) => {
  const validatedData = validateLeadPartial(req.body);
  const lead = await leadService.updateLead(req.params.id, validatedData, req.user.id);
  if (!lead) {
    return errorResponse(res, 'Lead not found', 404);
  }
  return successResponse(res, 'Lead updated successfully', lead);
});

const deleteLead = asyncHandler(async (req, res) => {
  const lead = await leadService.deleteLead(req.params.id);
  if (!lead) {
    return errorResponse(res, 'Lead not found', 404);
  }
  return successResponse(res, 'Lead deleted successfully');
});

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
};
