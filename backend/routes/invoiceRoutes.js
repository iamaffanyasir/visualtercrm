const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const authenticateUser = require('../middleware/auth');

router.post('/', authenticateUser, invoiceController.createInvoice);
router.get('/', authenticateUser, invoiceController.getInvoices);
router.get('/:id', authenticateUser, invoiceController.getInvoiceById);
router.put('/:id/status', authenticateUser, invoiceController.updateInvoiceStatus);

module.exports = router; 