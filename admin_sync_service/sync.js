import { getMySQLConnection } from "./mysql.js";

export const syncToMySQL = async (data) => {
  const connection = getMySQLConnection();
  try {
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

  } catch(error) {
    console.error("Error sync to MySQL", error);
  }
  
};

const formatDateForMySQL = (isoString) => {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 19).replace('T', ' ');
};
