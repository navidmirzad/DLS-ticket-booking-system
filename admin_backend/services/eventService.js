import { getConnection } from "../database/connection.js";

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
    const connection = await getConnection();
    const [result] = await connection.execute(
      "INSERT INTO events (title, description, date, location) VALUES (?, ?, ?, ?)",
      [event.title, event.description, event.date, event.location]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

const updateEvent = async (eventId, event) => {
  try {
    const connection = await getConnection();
    const [result] = await connection.execute(
      "UPDATE events SET title = ?, description = ?, date = ?, location = ? WHERE id = ?",
      [event.title, event.description, event.date, event.location, eventId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

const deleteEvent = async (eventId) => {
  try {
    const connection = await getConnection();
    const [result] = await connection.execute(
      "DELETE FROM events WHERE id = ?",
      [eventId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export { getEvents, getEvent, createEvent, updateEvent, deleteEvent };
