const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');

exports.createTicket = async (req,res,next) => {
    try {
        const { title, category, priority, description, screenshotUrl } = req.body;
        const count = await Ticket.countDocuments();
        const ticketId = `TKT-${1000 + count + 1}`;

        const ticket = await Ticket.create({
            ticketId,
            title,
            category,
            priority,
            description,
            screenshotUrl,
            customer : req.user.id
        });

        res.status(201).json(ticket);
    } catch (error) {
        next (error);
    }
};

exports.getTickets = async (req, res, next) => {
    try {
        let filter = {};
        if (req.user.role === 'customer') {
            filter.customer = req.user.id;
        }
        const tickets = await Ticket.find(filter).populate('customer assignedDepartment', 'name email');
        res.json(tickets);
    } catch (error) {
        next (error);
    }
};

exports.getTicketById = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('customer assignedDepartment', 'name email');
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        const comments = await Comment.find({ ticket:req.params.id }).populate('author', 'name role');
        res.json({ticket, comments });
    } catch (error) {
        next(error);
    }
};

exports.updateTicket = async (req,res,next) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket) return res.status(404).json({ message: 'Ticket not found' });
        
        if(req.user.role === 'customer') {
            if(ticket.status === 'Closed') return res.status(400).json({ message: 'Can only edit Open tickets' });
        }

        if(req.body.status) {
            if(ticket.status === 'Closed') return res.status(400).json({ message: 'Closed tickets are read-only'});
            if(req.body.status === 'Open' && ticket.status === 'Resolved') {
                if(ticket.reopenCount >= 1) return res.status(400).json({ message: 'Ticket can only be reopened once' });
                ticket.reopenCount += 1;
            }
        }

        Object.assign(ticket, req.body);
        await ticket.save();
        res.json(ticket);
    }catch (error) {
        next (error);
    }
};

exports.addComment = async (req,res,next) => {
    try {
        const { message } = req.body;
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket) return res.status(404).json({ message: 'Ticket not found'});
        if(ticket.status === 'Closed') return res.status(404).json({ message : 'Cannot comment on closed tickets' });
        
        const comment = await Comment.create({
            ticket: ticket._id,
            author: req.user.id,
            message
        });

        const populatedComment = await comment.populate('author', 'name role');
        res.status(201).json(populatedComment);
    } catch (error) {
        next(error);
    }
};