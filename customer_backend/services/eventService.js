import { Event, EventDescription } from "../models/mongo/index.js";

export const getEvents = async () => {
    // Populate the event_description field to get the full event data
    return await Event.find().populate('event_description');
}

export const getEventByID = async (eventId) => {
    const event = await Event.findById(eventId).populate('event_description');
    if(!event) {
        throw new Error("Event not found");
    }
    return event;
}

export const increaseCapacity = async (eventId) => {
    const event = await getEventByID(eventId);
    event.capacity += 1;
    return await event.save(event);
}

export const decreaseCapacity = async (eventId) => {
    const event = await getEventByID(eventId);

    if(event.capacity <= 0) {
        throw new Error("No more tickets");
    }
    
    event.capacity -= 1;
    return await event.save(event);
}