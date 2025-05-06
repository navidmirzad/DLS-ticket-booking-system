import { getMySQLConnection } from "./mysql.js";

export const syncToMySQL = async (event) => {
  const connection = getMySQLConnection();

  try {
    if (event.type === "EventCreated") {
      await connection.execute(
        "INSERT INTO events (id, title, description, location, date, capacity) VALUES (?, ?, ?, ?, ?, ?)",
        [
          event.payload.id,
          event.payload.title,
          event.payload.description,
          event.payload.location,
          event.payload.date,
          event.payload.capacity,
        ]
      );
    } else if (event.type === "EventUpdated") {
      await connection.execute(
        "UPDATE events SET title = ?, description = ?, location = ?, date = ?, capacity = ? WHERE id = ?",
        [
          event.payload.title,
          event.payload.description,
          event.payload.location,
          event.payload.date,
          event.payload.capacity,
          event.payload.id,
        ]
      );
    } else if (event.type === "EventDeleted") {
      await connection.execute("DELETE FROM events WHERE id = ?", [
        event.payload.id,
      ]);
    }
  } catch (error) {
    console.error("Error syncing to MySQL:", error);
  }
};
