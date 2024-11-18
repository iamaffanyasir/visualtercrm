const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const authenticateUser = require('../middleware/auth');

router.post('/', authenticateUser, caseController.createCase);
router.get('/', authenticateUser, caseController.getCases);
router.get('/:id', authenticateUser, caseController.getCaseById);
router.put('/:id', authenticateUser, caseController.updateCase);
router.post('/:id/updates', authenticateUser, caseController.addUpdate);

module.exports = router; 