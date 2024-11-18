const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authenticateUser = require('../middleware/auth');

router.post('/', authenticateUser, clientController.createClient);
router.get('/', authenticateUser, clientController.getClients);
router.get('/:id', authenticateUser, clientController.getClientById);
router.put('/:id', authenticateUser, clientController.updateClient);
router.post('/:id/documents', authenticateUser, clientController.addDocument);

module.exports = router; 