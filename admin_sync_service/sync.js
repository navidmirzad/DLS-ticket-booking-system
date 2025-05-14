import { getMySQLConnection } from "./mysql.js";

export const syncToMySQL = async (event) => {
  const connection = getMySQLConnection();

  try {
    await connection.execute(
      "INSERT INTO ORDER(email, tickets_bought, total_price, status) VALUES (?, ?, ?, ?)",
      [
        event.email,
        event.tickets_bought.length,
        event.total_price,
        order_status
      ]
    );

    /*
    await connection.execute(
      "INSERT INTO TICKETS(event_id)"
    )
      */
  } catch(error) {
    console.error("Error sync to MySQL", error);
  }
  
};
