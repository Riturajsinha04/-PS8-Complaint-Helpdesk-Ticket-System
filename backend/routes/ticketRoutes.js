const express = require('express');
const {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
    addComment
} = require('../controllers/ticketController');
const { protect, allowRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
.post(protect, createTicket)
.get(protect, getTickets);

router.route('/:id')
.get(protect, getTicketById)
.put(protect, updateTicket);

router.post('/:id/comments', protect, addComment);

module.exports = router;