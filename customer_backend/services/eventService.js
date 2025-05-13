import { Event, EventDescription } from "../models/mongo/index.js";

export const getEvents = async () => {
  // Populate the event_description field to get the full event data
  return await Event.find().populate("description");
};

export const getEventByID = async (eventId) => {
  const event = await Event.findById(eventId).populate("description");
  if (!event) {
    throw new Error("Event not found");
  }
  return event;
};

export const getTicketTypesForEvent = async (eventId) => {
  // This is a placeholder function that will return ticket types for an event
  // In a real implementation, you would fetch this from your database
  return [
    {
      id: "general",
      name: "General Admission",
      description: "Standard entry to the event",
      price: 50,
      available: 200,
    },
    {
      id: "vip",
      name: "VIP Access",
      description: "Premium seating and exclusive perks",
      price: 100,
      available: 50,
    },
    {
      id: "premium",
      name: "Premium Package",
      description: "All-inclusive experience with backstage access",
      price: 150,
      available: 20,
    },
  ];
};

export const increaseCapacity = async (eventId) => {
  const event = await getEventByID(eventId);
  event.tickets_available += 1;
  return await event.save();
};

export const decreaseCapacity = async (eventId) => {
  const event = await getEventByID(eventId);

  if (event.tickets_available <= 0) {
    throw new Error("No more tickets available");
  }

  event.tickets_available -= 1;
  return await event.save();
};
