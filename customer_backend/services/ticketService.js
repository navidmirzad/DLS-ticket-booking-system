import { Ticket, Order } from "../models/mongo/index.js";
import {
  increaseCapacity,
  decreaseCapacity,
  getEventByID,
} from "./eventService.js";
import { sendToQueue, sendTicketToQueue } from "../util/rabbitmq.js";
import { v4 as uuidv4 } from "uuid";

export const getTicketsByUserID = async (userId) => {
  return await Ticket.find({ userId });
};

export const getTicketByID = async (ticketId) => {
  return await Ticket.findById(ticketId);
};

export const createTicket = async (eventId, userId, email, quantity) => {
  const event = await getEventByID(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const createdIndividualTickets = []; // To store full ticket documents for notifications
  const ticketsForOrder = []; // To store ticket objects for the Order document
  let totalPrice = 0;

  // Get total quantity of tickets from all items
  const ticketPrice = 50; // Fixed price for all tickets

  // Create all tickets
  for (let i = 0; i < quantity; i++) {
    const newTicket = new Ticket({
      ticket_id: uuidv4(), // Generate a unique ID for each ticket
      event_id: eventId,
      ticket_price: ticketPrice,
    });

    await decreaseCapacity(eventId);
    const savedTicket = await newTicket.save();
    createdIndividualTickets.push(savedTicket);

    // Create properly structured ticket for Order
    ticketsForOrder.push({
      ticket_id: savedTicket.ticket_id,
      quantity: 1,
    });
  }

  totalPrice = ticketPrice * quantity;

  const order = new Order({
    order_id: uuidv4(),
    email,
    tickets_bought: ticketsForOrder,
    total_price: totalPrice,
    order_status: "CONFIRMED",
  });

  await order.save();

  // Send notifications for all tickets
  for (const ticket of createdIndividualTickets) {
    const ticketData = {
      type: "TICKET_BOUGHT",
      to: email,
      id: ticket._id,
      ticket: {
        id: ticket.ticket_id,
        price: ticket.ticket_price,
        event_id: ticket.event_id,
      },
      event: {
        title: event.title,
        date: event.date,
        location: event.location,
        description: event.description,
      },
    };
    await sendToQueue(ticketData);
  }

  await sendTicketToQueue(order);

  return {
    tickets: createdIndividualTickets,
    order,
  };
};

export const deleteTicket = async (ticketId) => {
  const ticket = await getTicketByID(ticketId);
  if (!ticket) {
    throw new Error("Ticket not found");
  }

  await increaseCapacity(ticket.event_id);
  return await Ticket.findByIdAndUpdate(
    ticketId,
    { deleted_at: new Date() },
    { new: true }
  );
};
