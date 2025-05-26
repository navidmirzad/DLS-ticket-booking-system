// ticketController.js
import {
  getTicketByID as getTicketByIDService,
  getTicketsByUserID as getTicketsByUserIDService,
  createTicket,
  deleteTicket,
} from "../services/ticketService.js";

export const getTicketByID = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;

    if (!ticketId) {
      return res.status(400).send({ error: "Missing ticket id" });
    }

    const ticket = await getTicketByIDService(ticketId);

    if (!ticket) {
      return res.status(404).send({ error: "Ticket not found" });
    }

    res.send({ data: ticket });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const getTicketsByUserID = async (req, res) => {
  try {
    const userId = req.params.userId;
    const tickets = await getTicketsByUserIDService(userId);

    res.send({ data: tickets });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const buyTickets = async (req, res) => {
  try {
    const { eventId, email, tickets } = req.body;

    if (!eventId || !email || !tickets || !Array.isArray(tickets)) {
      return res.status(400).json({ error: 'Missing required fields or invalid format' });
    }

    const result = await createTicket(eventId, email, tickets);
    res.status(201).json({ order: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const refundTicket = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;

    if (!ticketId) {
      return res.status(400).send({ error: "Missing ticket id" });
    }

    const ticket = await deleteTicket(ticketId);

    if (!ticket) {
      return res.status(404).send({ error: "Ticket not found" });
    }

    res.send({ data: ticket });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
