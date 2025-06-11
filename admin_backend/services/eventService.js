import Event from "../models/Event.js";

/**
 * Inserts an event message into the outbox table (instead of publishing directly)
 * @param {Object} connection - MySQL connection
 * @param {string} type - Event type (e.g. "EventCreated")
 * @param {Object} payload - Event payload
 */
const enqueueOutboxEvent = async (connection, type, payload) => {
  await connection.query(
    `INSERT INTO EVENT_OUTBOX (event_type, payload, published) VALUES (?, ?, ?)`,
    [type, JSON.stringify(payload), false]
  );
};

// Existing service functions
const getEvents = async () => {
  const connection = await Event.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT e.*, ed.*
      FROM EVENT e
      JOIN EVENT_DESCRIPTION ed ON e.description_id = ed.id
      WHERE e.deleted_at IS NULL
      ORDER BY ed.date ASC
    `);
    return rows;
  } finally {
    await connection.end();
  }
};

// getEvent.js
const getEvent = async (connection, eventId) => {
  const [rows] = await connection.query(
    `SELECT 
        E.id,
        ED.title,
        ED.image, ED.capacity, ED.date,
        ED.description, ED.location
      FROM EVENT E
      JOIN EVENT_DESCRIPTION ED ON E.description_id = ED.id
      WHERE E.id = ?`,
    [eventId]
  );

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    image: row.image,
    capacity: row.capacity,
    date: row.date,
    description: row.description,
    location: row.location,
    tickets: [],
    tickets_available: row.capacity,
  };
};

const createEvent = async (eventData) => {
  const connection = await Event.getConnection();
  try {
    await connection.beginTransaction();

    // Convert ISO string to MySQL datetime format
    const date = new Date(eventData.date);
    const mysqlDatetime = date.toISOString().slice(0, 19).replace("T", " ");

    const [descResult] = await connection.query(
      "INSERT INTO EVENT_DESCRIPTION (title, image, capacity, date, description, location) VALUES (?, ?, ?, ?, ?, ?)",
      [
        eventData.title,
        eventData.image,
        eventData.capacity,
        mysqlDatetime,
        eventData.description,
        eventData.location,
      ]
    );

    const [eventResult] = await connection.query(
      "INSERT INTO EVENT (description_id, tickets_available) VALUES (?, ?)",
      [descResult.insertId, eventData.capacity]
    );

    if (eventData.tickets?.length) {
      const ticketValues = eventData.tickets.map((ticket) => [
        eventResult.insertId,
        ticket.price,
        ticket.type,
      ]);
      await connection.query(
        "INSERT INTO TICKETS (event_id, price, type) VALUES ?",
        [ticketValues]
      );
    }

    const newEvent = await getEvent(connection, eventResult.insertId);
    console.log("New event before enqueueing:", newEvent);

    await enqueueOutboxEvent(connection, "EventCreated", newEvent);

    await connection.commit();
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
      "SELECT description_id FROM EVENT WHERE id = ? AND deleted_at IS NULL",
      [eventId]
    );
    if (eventRows.length === 0) throw new Error("Event not found");

    const descriptionId = eventRows[0].description_id;

    // Convert ISO string to MySQL datetime format
    const date = new Date(eventData.date);
    const mysqlDatetime = date.toISOString().slice(0, 19).replace("T", " ");

    await connection.query(
      `UPDATE EVENT_DESCRIPTION 
       SET title = ?, image = ?, date = ?, description = ?, location = ?
       WHERE id = ?`,
      [
        eventData.title,
        eventData.image,
        mysqlDatetime,
        eventData.description,
        eventData.location,
        descriptionId,
      ]
    );

    if (eventData.tickets_available !== undefined) {
      await connection.query(
        "UPDATE EVENT SET tickets_available = ? WHERE id = ?",
        [eventData.tickets_available, eventId]
      );
    }

    if (eventData.tickets) {
      await connection.query("DELETE FROM TICKETS WHERE event_id = ?", [
        eventId,
      ]);

      if (eventData.tickets.length > 0) {
        const ticketValues = eventData.tickets.map((ticket) => [
          eventId,
          ticket.price,
          ticket.type,
        ]);
        await connection.query(
          "INSERT INTO TICKETS (event_id, price, type) VALUES ?",
          [ticketValues]
        );
      }
    }

    const updatedEvent = await getEvent(connection, eventId);

    await enqueueOutboxEvent(connection, "EventUpdated", updatedEvent);

    await connection.commit();
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

    const eventToDelete = await getEvent(connection, eventId);
    if (!eventToDelete) throw new Error("Event not found");

    await connection.query(
      "UPDATE EVENT SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL",
      [eventId]
    );

    await enqueueOutboxEvent(connection, "EventDeleted", eventToDelete);

    await connection.commit();
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

    await connection.query("UPDATE EVENT SET deleted_at = NULL WHERE id = ?", [
      eventId,
    ]);

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

export {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  restoreEvent,
};
