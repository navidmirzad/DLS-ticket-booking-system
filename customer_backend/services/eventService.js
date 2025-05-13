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
  // Simplified to return only a single standard ticket type
  return [
    {
      id: "standard",
      name: "Standard Admission",
      description: "Entry ticket to the event",
      price: 50,
      available: 200,
    }
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
