import { Event } from "../model/Event.js";

export const createEvent = async(event) => {
    return await Event.create(event);
}

export const deleteEvent = async(event) => {
    const existingEvent = await Event.findOne({ id: String(event.id) });
    if(!existingEvent) {
        throw new Error("Event not found");
    }
    return await existingEvent.softDelete(); 
}

export const updateEvent = async (event) => {
    const { id, ...updateFields } = event;
  
    const updated = await Event.findOneAndUpdate(
      { id: String(id) },
      { $set: updateFields },
      { new: true }
    );
  
    if (!updated) {
      throw new Error("Event not found");
    }
  
    return updated;
};