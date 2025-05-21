// eventController.js
import {
  getEventByID as getEventByIDService,
  getEvents as getEventsService,
  getTicketTypesForEvent as getTicketTypesService,
} from "../services/eventService.js";

// Create an object to store SSE clients by eventId
const sseClients = {};

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

export const getEventUpdates = (req, res) => {
  const eventId = req.params.eventId;
  
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  // Send initial connection established message
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
  
  // Create client object to track this connection
  const clientId = Date.now();
  
  // Initialize client array for this event if it doesn't exist
  if (!sseClients[eventId]) {
    sseClients[eventId] = [];
  }
  
  // Add this client to the event's client list
  sseClients[eventId].push({
    id: clientId,
    res
  });
  
  // Handle client disconnect
  req.on('close', () => {
    if (sseClients[eventId]) {
      sseClients[eventId] = sseClients[eventId].filter(client => client.id !== clientId);
      
      // Clean up empty event entries
      if (sseClients[eventId].length === 0) {
        delete sseClients[eventId];
      }
    }
  });
};

// Function to send updates to all clients for a specific event
export const sendEventUpdate = (eventId, data) => {
  if (sseClients[eventId]) {
    sseClients[eventId].forEach(client => {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }
};
