const express = require('express');
const router = express.Router();
const controller = require('../controllers/ticketController');

router.get('/tickets', controller.getAllTickets);
router.get('/tickets/search', controller.searchTickets);
router.get('/tickets/:id', controller.getTicketById);

module.exports = router;
