import Event from '../models/Event.js';
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
    
    if (rows.length === 0) {
      return null;
    }

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
      'INSERT INTO EVENT_DESCRIPTION (title, image, date, description, location) VALUES (?, ?, ?, ?, ?)',
      [eventData.title, eventData.image, eventData.date, eventData.description, eventData.location]
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

    // Get the event and publish after committing the transaction
    const newEvent = await getEvent(eventResult.insertId);
    
    if (newEvent) {
      await publishEvent({
        type: "EventCreated",
        payload: newEvent,
      });
    }

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
       SET title = ?, image = ?, date = ?, 
           description = ?, location = ?
       WHERE id = ?`,
      [eventData.title, eventData.image, eventData.date, 
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
    
    const updatedEvent = await getEvent(eventId);
    
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

    // Get the event before deletion for publishing
    const eventToDelete = await getEvent(eventId);
    
    if (!eventToDelete) {
      throw new Error('Event not found');
    }

    // Soft delete the event
    await connection.query(
      'UPDATE EVENT SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
      [eventId]
    );

    await connection.commit();

    // Publish the event deletion
    await publishEvent({
      type: "EventDeleted",
      payload: eventToDelete
    });

    return eventToDelete;
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
