import { getMySQLConnection } from "./mysql.js";

export const syncToMySQL = async (data) => {
  const connection = getMySQLConnection();
  try {
    if (data.type === "OrderCreated") {
      for(const ticket of data.tickets) {
        await connection.execute(
          "INSERT INTO TICKETS(id, event_id, price, type, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?)",
          [
            ticket.ticket_id,
            data.eventId,
            ticket.ticket_price,
            ticket.__type,
            formatDateForMySQL(ticket.created_at),
            formatDateForMySQL(ticket.updated_at)
          ]
        )
      };

      await connection.execute(
        "INSERT INTO ORDERS(id, email, tickets_bought, total_price, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          data.order.id,
          data.order.email,
          data.order.tickets_bought.length,
          data.order.total_price,
          data.order.order_status,
          formatDateForMySQL(data.order.created_at),
          formatDateForMySQL(data.order.updated_at)
        ]
      );

      await connection.execute(
        "UPDATE EVENT SET tickets_available = ? WHERE id = ?",
        [
          data.ticketsAvailable,
          data.eventId
        ]

      )
      
    } else if (data.type === "OrderDeleted") {
      await connection.execute(
        "UPDATE orders SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?",
        [data.payload.mysql_id]
      );
    
    }
    
    } catch(error) {
      console.error("Error sync to MySQL", error);
      throw error; // Re-throw to handle in the calling function
    }

  /*
    
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
    } if (event.type === "OrderUpdated") {
      await connection.execute(
        "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [
          event.payload.status,
          event.payload.mysql_id
        ]
      );
    } 
*/
  
};

const formatDateForMySQL = (isoString) => {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 19).replace('T', ' ');
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
