import Ticket from "../models/mongo/Ticket.js";

export const getTicketsByUserID = async (userId) => {
    return await Ticket.find({ userId: userId });
}

export const getTicketByID = async (ticketId) => {
    return await Ticket.find({ _id: ticketId });
}

export const createTicket = async (eventId, userId, email) => {
    const ticket = new Ticket({
        eventId: eventId,
        userId: userId,
        email: email
    })
    return await ticket.save();
}

export const deleteTicket = async (ticketId) => {
    return await Ticket.deleteOne({ _id: ticketId });
}