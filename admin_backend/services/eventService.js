import { getConnection } from "../database/connection.js";
import { publishEvent } from "../util/rabbitmq.js";

const getEvents = async () => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM events ORDER BY date ASC"
    );
    return rows;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

const getEvent = async (eventId) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM events WHERE id = ?",
      [eventId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

const createEvent = async (event) => {
  try {
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
    console.error("Error creating event:", error);
    throw error;
  }
};

const updateEvent = async (eventId, event) => {
  try {
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
    console.error("Error updating event:", error);
    throw error;
  }
};

const deleteEvent = async (eventId) => {
  try {
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
    console.error("Error deleting event:", error);
    throw error;
  }
};

export { getEvents, getEvent, createEvent, updateEvent, deleteEvent };
