import Ticket from "../models/mongo/Ticket.js";

export const getTicketsByUserID = async (userId) => {
    return await Ticket.find({ user_id: userId });
}

export const getTicketByID = async (ticketId) => {
    return await Ticket.find({ id: ticketId });
}