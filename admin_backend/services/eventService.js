import Event from '../models/Event.js';
import EventDescription from '../models/EventDescription.js';
import Ticket from '../models/Ticket.js';
import { getConnection } from "../database/connection.js";
import { publishEvent } from "../util/rabbitmq.js";

const getEvents = async () => {
  try {
    const connection = await Event.getConnection();
    const [rows] = await connection.query(`
      SELECT e.*, ed.*
      FROM EVENT e
      JOIN EVENT_DESCRIPTION ed ON e.description_id = ed.id
      WHERE e.deleted_at IS NULL
      ORDER BY ed.date ASC
    `);
    await connection.end();
    return rows;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

const getEvent = async (eventId) => {
  try {
    const connection = await Event.getConnection();
    const [rows] = await connection.query(`
      SELECT e.*, ed.*, t.id as ticket_id, t.price, t.type
      FROM EVENT e
      JOIN EVENT_DESCRIPTION ed ON e.description_id = ed.id
      LEFT JOIN TICKETS t ON e.id = t.event_id
      WHERE e.id = ? AND e.deleted_at IS NULL
    `, [eventId]);
    await connection.end();
    
    if (rows.length === 0) return null;

    const event = rows[0];
    event.tickets = rows.map(row => ({
      id: row.ticket_id,
      price: row.price,
      type: row.type
    })).filter(ticket => ticket.id != null);

    return event;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

const createEvent = async (eventData) => {
  const connection = await Event.getConnection();
  try {
    await connection.beginTransaction();

    const [descResult] = await connection.query(
      'INSERT INTO EVENT_DESCRIPTION (name, image, date, description, location) VALUES (?, ?, ?, ?, ?)',
      [eventData.name, eventData.image, eventData.date, eventData.description, eventData.location]
    );
    
    const [eventResult] = await connection.query(
      'INSERT INTO EVENT (description_id, tickets_available) VALUES (?, ?)',
      [descResult.insertId, true]
    );

    if (eventData.tickets && eventData.tickets.length > 0) {
      const ticketValues = eventData.tickets.map(ticket => 
        [eventResult.insertId, ticket.price, ticket.type]
      );
      
      await connection.query(
        'INSERT INTO TICKETS (event_id, price, type) VALUES ?',
        [ticketValues]
      );
    }

    await connection.commit();
    return await getEvent(eventResult.insertId);
    // Validate input data
    const { title, description, date, location, capacity } = event;
    if (
      !title ||
      !description ||
      !date ||
      !location ||
      capacity === undefined
    ) {
      throw new Error("Missing required fields for creating an event");
    }

    const connection = await getConnection();
    const [result] = await connection.execute(
      "INSERT INTO events (title, description, date, location, capacity) VALUES (?, ?, ?, ?, ?)",
      [title, description, date, location, capacity]
    );

    const newEvent = { id: result.insertId, ...event };

    // Publish the event to RabbitMQ
    await publishEvent({
      type: "EventCreated",
      payload: newEvent,
    });

    return newEvent;
  } catch (error) {
    await connection.rollback();
    console.error("Error creating event:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

const updateEvent = async (eventId, eventData) => {
  const connection = await Event.getConnection();
  try {
    await connection.beginTransaction();

    const [eventRows] = await connection.query(
      'SELECT description_id FROM EVENT WHERE id = ? AND deleted_at IS NULL',
      [eventId]
    );

    if (eventRows.length === 0) {
      throw new Error('Event not found');
    }

    const descriptionId = eventRows[0].description_id;

    await connection.query(
      `UPDATE EVENT_DESCRIPTION 
       SET name = ?, image = ?, date = ?, 
           description = ?, location = ?
       WHERE id = ?`,
      [eventData.name, eventData.image, eventData.date, 
       eventData.description, eventData.location, descriptionId]
    );

    if (eventData.tickets_available !== undefined) {
      await connection.query(
        'UPDATE EVENT SET tickets_available = ? WHERE id = ? AND deleted_at IS NULL',
        [eventData.tickets_available, eventId]
      );
    }

    if (eventData.tickets) {
      await connection.query('DELETE FROM TICKETS WHERE event_id = ?', [eventId]);
      
      if (eventData.tickets.length > 0) {
        const ticketValues = eventData.tickets.map(ticket => 
          [eventId, ticket.price, ticket.type]
        );
        
        await connection.query(
          'INSERT INTO TICKETS (event_id, price, type) VALUES ?',
          [ticketValues]
        );
      }
    }

    await connection.commit();
    return await getEvent(eventId);
    const connection = await getConnection();
    await connection.execute(
      "UPDATE events SET title = ?, description = ?, date = ?, location = ?, capacity = ? WHERE id = ?",
      [
        event.title,
        event.description,
        event.date,
        event.location,
        event.capacity,
        eventId,
      ]
    );

    const updatedEvent = { id: eventId, ...event };

    // Publish the event to RabbitMQ
    await publishEvent({
      type: "EventUpdated",
      payload: updatedEvent,
    });

    return updatedEvent;
  } catch (error) {
    await connection.rollback();
    console.error("Error updating event:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

const deleteEvent = async (eventId) => {
  const connection = await Event.getConnection();
  try {
    await connection.beginTransaction();

    const [eventRows] = await connection.query(
      'SELECT description_id FROM EVENT WHERE id = ? AND deleted_at IS NULL',
      [eventId]
    );

    if (eventRows.length === 0) {
      throw new Error('Event not found');
    }

    await connection.query(
      'UPDATE EVENT SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
      [eventId]
    );

    await connection.commit();
    return true;

    const connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM events WHERE id = ?",
      [eventId]
    );

    if (rows.length === 0) {
      throw new Error("Event not found");
    }

    const deletedEvent = rows[0];

    await connection.execute("DELETE FROM events WHERE id = ?", [eventId]);

    // Publish the event to RabbitMQ
    await publishEvent({
      type: "EventDeleted",
      payload: deletedEvent,
    });

    return deletedEvent;
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting event:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

const restoreEvent = async (eventId) => {
  const connection = await Event.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      'UPDATE EVENT SET deleted_at = NULL WHERE id = ?',
      [eventId]
    );

    await connection.commit();
    return await getEvent(eventId);
  } catch (error) {
    await connection.rollback();
    console.error("Error restoring event:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

export { getEvents, getEvent, createEvent, updateEvent, deleteEvent, restoreEvent };
