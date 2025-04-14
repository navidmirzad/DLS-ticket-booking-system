import Event from "../models/mongo/Event.js";

export const getEvents = async () => {
    return await Event.find();
}

export const getEventByID = async (eventId) => {
    return await Event.find({ id: eventId });
}