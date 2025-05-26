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
  return await Ticket.findOne({ ticket_id: ticketId });
};

export const createTicket = async (eventId, email, tickets) => {
  const event = await getEventByID(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const createdIndividualTickets = []; // To store full ticket documents for notifications
  const ticketsForOrder = []; // To store ticket objects for the Order document
  let totalPrice = 0;

  // Fixed price for all tickets
  const ticketPrice = 50;

  // Process each ticket in the tickets array
  for (const ticketItem of tickets) {
    const { quantity } = ticketItem;
    
    // Create individual tickets for this quantity
    for (let i = 0; i < quantity; i++) {
      const newTicket = new Ticket({
        ticket_id: uuidv4(),
        event_id: eventId,
        ticket_price: ticketPrice,
      });

      await decreaseCapacity(eventId);
      const savedTicket = await newTicket.save();
      createdIndividualTickets.push(savedTicket);
    }

    
    // Add to tickets for order array
    ticketsForOrder.push({
      ticket_id: ticketItem.ticket_id,
      quantity: ticketItem.quantity
    });

    // Calculate total price for this ticket type
    totalPrice += ticketPrice * quantity;
  }

  const order = new Order({
    order_id: uuidv4(),
    event_id: eventId,
    email,
    tickets_bought: ticketsForOrder,
    total_price: totalPrice,
    order_status: "CONFIRMED",
  });

  await order.save();

  // Send a single notification for the entire order
  const ticketData = {
    type: "TICKET_BOUGHT",
    to: email,
    orderId: order.order_id,
    quantity: createdIndividualTickets.length,
    ticket: {
      price: ticketPrice,
      event_id: eventId,
    },
    event: {
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
    },
  };
  await sendToQueue(ticketData);

  await sendTicketToQueue({
    type: "OrderCreated",
    eventId: event.id,
    ticketsAvailable: event.tickets_available - createdIndividualTickets.length,
    tickets: createdIndividualTickets,
    order,
  });

  return order;
};

export const deleteTicket = async (ticketId) => {
  const ticket = await getTicketByID(ticketId);
  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const CURRENT_TIMESTAMP = new Date();

  await increaseCapacity(ticket.event_id);
  const deletedTicket = await Ticket.findOneAndUpdate(
    { ticket_id: ticketId },
    { 
      deleted_at: CURRENT_TIMESTAMP,
      updated_at: CURRENT_TIMESTAMP 
    },
    { new: true }
  );

  const event = await getEventByID(deletedTicket.event_id);
  console.log("Event found:", event);

  const order = await Order.findOne(
    { "tickets_bought.ticket_id": deletedTicket.ticket_id }
  );

  console.log("Order found:", order);

  const newTotalPrice = order.total_price - deletedTicket.ticket_price;

  await Order.findOneAndUpdate(
    { order_id: order.order_id },
    { 
      total_price: newTotalPrice,
      updated_at: CURRENT_TIMESTAMP
    },
    { new: true }
  );

  await sendTicketToQueue({
    type: "TICKET_REFUNDED",
    id: deletedTicket.ticket_id,
    orderId: order.order_id,
    eventId: event.id,
    deletedAt: CURRENT_TIMESTAMP,
    newTotalPrice: newTotalPrice,
    ticketsAvailable: event.tickets_available
  });

  return deletedTicket;
};
