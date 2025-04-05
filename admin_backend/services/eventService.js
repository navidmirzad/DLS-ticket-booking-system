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

export { getEvents, createEvent };
