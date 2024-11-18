const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticateUser = require('../middleware/auth');

router.post('/generate', authenticateUser, reportController.generateReport);
router.get('/revenue', authenticateUser, reportController.getRevenueData);
router.get('/cases', authenticateUser, reportController.getCaseData);
router.get('/clients', authenticateUser, reportController.getClientData);

module.exports = router; 