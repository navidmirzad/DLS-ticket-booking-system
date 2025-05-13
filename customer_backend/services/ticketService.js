import { Ticket, Order } from "../models/mongo/index.js";
import {
  increaseCapacity,
  decreaseCapacity,
  getEventByID,
} from "./eventService.js";
import { sendToQueue } from "../util/rabbitmq.js";
import { v4 as uuidv4 } from "uuid";

export const getTicketsByUserID = async (userId) => {
  return await Ticket.find({ userId });
};

export const getTicketByID = async (ticketId) => {
  return await Ticket.findById(ticketId);
};

export const createTicket = async (eventId, userId, email, ticketsBought) => {
  const event = await getEventByID(eventId); // Make sure this function correctly fetches events
  if (!event) {
    throw new Error("Event not found");
  }

  if (!Array.isArray(ticketsBought) || ticketsBought.length === 0) {
    throw new Error("No tickets specified for purchase");
  }

  const createdIndividualTickets = []; // To store full ticket documents for notifications
  const createdTicketIdsForOrder = []; // To store just the IDs for the Order document
  let totalPrice = 0;

  for (const item of ticketsBought) {
    // 'ticketId' from item is now "vip", "standard", etc.
    // 'quantity' from item is the number of tickets of this type
    const { ticketId: ticketTypeIdentifier, quantity } = item;

    let resolvedTicketPrice;
    let resolvedTicketTypeString; // This will be 'VIP', 'STANDARD', etc. from your enum

    // Determine price and type string based on the identifier
    switch (ticketTypeIdentifier.toLowerCase()) {
      case "vip":
        resolvedTicketPrice = 100;
        resolvedTicketTypeString = "VIP";
        break;
      case "premium": // Assuming you might add this to your TicketSchema enum
        resolvedTicketPrice = 150;
        resolvedTicketTypeString = "PREMIUM"; // Add to enum if used
        break;
      case "early_bird":
        resolvedTicketPrice = 40;
        resolvedTicketTypeString = "EARLY_BIRD";
        break;
      case "group":
        resolvedTicketPrice = 35;
        resolvedTicketTypeString = "GROUP";
        break;
      case "standard": // Explicitly handle standard
        resolvedTicketPrice = 50;
        resolvedTicketTypeString = "STANDARD";
        break;
      default:
        // Fallback or throw error for unknown ticket type identifier
        console.warn(
          `Unknown ticket type identifier: ${ticketTypeIdentifier}. Defaulting to STANDARD.`
        );
        resolvedTicketPrice = 50; // Default price
        resolvedTicketTypeString = "STANDARD"; // Default type from enum
    }

    if (!resolvedTicketTypeString) {
      throw new Error(
        `Invalid ticket type identifier received: ${ticketTypeIdentifier}`
      );
    }

    for (let i = 0; i < quantity; i++) {
      const newTicket = new Ticket({
        ticket_id: uuidv4(), // Generate a unique ID for each ticket
        event_id: eventId,
        ticket_price: resolvedTicketPrice,
        ticket_type: resolvedTicketTypeString, // Use the resolved ENUM value
      });

      await decreaseCapacity(eventId); // Should be event.event_id if that's what decreaseCapacity expects
      const savedTicket = await newTicket.save();
      createdIndividualTickets.push(savedTicket);
      createdTicketIdsForOrder.push(savedTicket._id); // Store the UUID for the order
    }

    totalPrice += resolvedTicketPrice * quantity;
  }

  const order = new Order({
    order_id: uuidv4(),
    email, // Assuming email is passed correctly, maps to User's email if user exists
    // user_id: userId, // Consider adding userId to your Order model if 'email' isn't the primary link to a User
    tickets_bought: createdTicketIdsForOrder, // Array of UUIDs of created Ticket documents
    total_price: totalPrice,
    order_status: "CONFIRMED", // Or 'PENDING' until payment confirmation if you have a payment step
  });

  await order.save();

  // Extract relevant event details for email notification
  const eventInfo = {
    id: event._id || event.event_description,
    title: event.event_description?.event_name || event.title || "Event", // Ensure we have a fallback
    date: event.event_description?.event_date || event.date,
    location: event.event_description?.event_location || event.location,
    description:
      event.event_description?.event_description || event.description,
  };

  // Send notifications for all tickets
  for (const ticket of createdIndividualTickets) {
    await sendToQueue({
      type: "TICKET_BOUGHT",
      to: email,
      id: ticket._id,
      ticket: {
        id: ticket.ticket_id,
        type: ticket.ticket_type,
        price: ticket.ticket_price,
        event_id: ticket.event_id,
      },
      event: {
        title: event.event_description?.event_name || "Event",
        date: event.event_description?.event_date || "the scheduled time",
        location: event.event_description?.event_location || "the location",
        description: event.event_description?.event_description || "the event",
      },
    });
  }

  return {
    tickets: createdIndividualTickets, // Return the full ticket details
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
