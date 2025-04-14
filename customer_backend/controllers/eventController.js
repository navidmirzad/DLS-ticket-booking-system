import { getEventByID as getEventByIDService, getEvents as getEventsService } from "../services/eventService.js";

export const getEvents = async (req, res) => {
    try {
        const events = getEventsService();
        res.send({ data: events });
    } catch(err) {
        res.status(500).send({ error: err.message });
    }
} 

export const getEventByID = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = getEventByIDService(eventId);
        res.send({ data: event });
    } catch(err) {
        res.status(500).send({ error: err.message });
    }
} 
