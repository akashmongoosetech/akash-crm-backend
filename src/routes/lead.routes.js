const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.route('/')
  .get(leadController.getLeads)
  .post(authorize('admin', 'manager', 'user'), leadController.createLead);

router.route('/:id')
  .get(leadController.getLeadById)
  .put(authorize('admin', 'manager', 'user'), leadController.updateLead)
  .delete(authorize('admin', 'manager'), leadController.deleteLead);

router.route('/:id/notes')
  .post(authorize('admin', 'manager', 'user'), leadController.addNote);

module.exports = router;
