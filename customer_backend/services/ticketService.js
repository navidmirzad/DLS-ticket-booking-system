import Ticket from "../models/mongo/Ticket.js";
import { increaseCapacity, decreaseCapacity, getEventByID } from "./eventService.js";
import { sendToQueue } from "../util/rabbitmq.js";

export const getTicketsByUserID = async (userId) => {
    return await Ticket.find({ userId: userId });
}

export const getTicketByID = async (ticketId) => {
    return await Ticket.findById(ticketId);
}

export const createTicket = async (eventId, userId, email) => {

    const event = await getEventByID(eventId);

    const ticket = new Ticket({
        eventId,
        userId,
        email,
    })

    await decreaseCapacity(eventId);

    const savedTicket = await ticket.save();

    await sendToQueue({
        type: "TICKET_BOUGHT",
        to: email,
        id: savedTicket._id,
        event: event
    })

    return savedTicket;
}

export const deleteTicket = async (ticketId) => {
    const ticket = await getTicketByID(ticketId);
    await increaseCapacity(ticket.eventId);
    return await Ticket.findByIdAndDelete(ticketId);
}