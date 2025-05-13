// eventController.js
import {
  getEventByID as getEventByIDService,
  getEvents as getEventsService,
  getTicketTypesForEvent as getTicketTypesService,
} from "../services/eventService.js";

export const getEvents = async (req, res) => {
  try {
    const events = await getEventsService();
    res.send({ data: events });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const getEventByID = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await getEventByIDService(eventId);
    res.send({ data: event });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const getTicketTypesForEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const ticketTypes = await getTicketTypesService(eventId);
    res.send({ data: ticketTypes });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
