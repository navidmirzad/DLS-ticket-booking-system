import Event from "../models/mongo/Event.js";

export const getEvents = async () => {
    return await Event.find();
}

export const getEventByID = async (eventId) => {
    const event = await Event.findById(eventId);
    if(!event) {
        throw new Error("Ticket not found")
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