import { getTicketByID as getTicketByIDService, getTicketsByUserID as getTicketsByUserIDService, createTicket, deleteTicket } from "../services/ticketService.js";

export const getTicketByID = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;

        if(!ticketId) {
            return res.status(400).send({ error: "Missing ticket id" });
        }

        const ticket = await getTicketByIDService(ticketId);

        if(!ticket) {
            return res.status(404).send({ error: "Ticket not found" });
        }

        res.send({ data: ticket });

    } catch(err) {
        res.status(500).send({ error: err.message });
    }
}

export const getTicketsByUserID = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const tickets = await getTicketsByUserIDService(userId);

        res.send({ data: tickets });
    } catch(err) {
        res.status(500).send({ error: err.message });
    }
}


export const buyTicket = async (req, res) => {
    try {
        const { eventId, userId, email } = req.body;

        if(!eventId || !userId || !email) {
            return res.status(400).send({ error: "Missing fields" });
        }

        const ticket = await createTicket(eventId, userId, email);

        res.send({ data: ticket });
    } catch(err) {
        res.status(500).send({ error: err.message });
    }
}

export const refundTicket = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;

        if(!ticketId) {
            return res.status(400).send({ error: "Missing ticket id" });
        }

        const ticket = await deleteTicket(ticketId);

        if(!ticket) {
            return res.status(404).send({ error: "Ticket not found" });
        }

        res.send({ data: ticket });

    } catch(err) {
        res.status(500).send({ error: err.message });
    }
}
