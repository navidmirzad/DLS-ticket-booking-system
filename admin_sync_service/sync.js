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
    } else if (event.type === "OrderCreated") {
      const [result] = await connection.execute(
        "INSERT INTO orders (email, tickets_bought, total_price, status) VALUES (?, ?, ?, ?)",
        [
          event.payload.email,
          event.payload.tickets_bought,
          event.payload.total_price,
          event.payload.status
        ]
      );
      // Update the sync service with the MySQL ID
      await updateSyncOrderMySQLId(event.payload.order_id, result.insertId);
    } else if (event.type === "OrderUpdated") {
      await connection.execute(
        "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [
          event.payload.status,
          event.payload.mysql_id
        ]
      );
    } else if (event.type === "OrderDeleted") {
      await connection.execute(
        "UPDATE orders SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?",
        [event.payload.mysql_id]
      );
    }
  } catch (error) {
    console.error("Error syncing to MySQL:", error);
    throw error; // Re-throw to handle in the calling function
  }
};

// Helper function to update MySQL ID in sync service
async function updateSyncOrderMySQLId(order_id, mysql_id) {
  try {
    // This would be implemented in the customer sync service
    // to update the mysql_id field of the corresponding order
    console.log(`Order ${order_id} synced with MySQL ID ${mysql_id}`);
  } catch (error) {
    console.error("Error updating sync order MySQL ID:", error);
  }
}
