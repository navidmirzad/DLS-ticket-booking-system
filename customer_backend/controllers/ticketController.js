import { getTicketByID as getTicketByIDService, getTicketsByUserID as getTicketsByUserIDService } from "../services/ticketService.js";

export const getTicketByID = async (req, res) => {
    try {
        const ticketId = parseInt(req.params.ticketId);
        const tickets = getTicketByIDService(ticketId);
        res.send({ data: tickets });
    } catch(err) {
        res.status(500).send({ error: err.message });
    }
}

export const getTicketsByUserID = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const tickets = getTicketsByUserIDService(userId);
        res.send({ data: tickets });
    } catch(err) {
        res.status(500).send({ error: err.message });
    }
}

/*
export const buyTicket = async (req, res) => {
    try {
        const tickets = getTickets();
        res.json({ data: tickets });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteTicket = async (req, res) => {
    try {
        const tickets = getTickets();
        res.json({ data: tickets });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

*/