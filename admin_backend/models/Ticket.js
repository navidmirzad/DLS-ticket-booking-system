import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

class Ticket {
  constructor(data) {
    this.ticket_id = data.ticket_id;
    this.event_id = data.event_id;
    this.ticket_price = data.ticket_price;
    this.ticket_type = data.ticket_type;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async getConnection() {
    return await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  static async findById(id) {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM TICKETS WHERE ticket_id = ?', [id]);
      return rows.length ? new Ticket(rows[0]) : null;
    } finally {
      await connection.end();
    }
  }

  static async findByEventId(eventId) {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM TICKETS WHERE event_id = ?', [eventId]);
      return rows.map(row => new Ticket(row));
    } finally {
      await connection.end();
    }
  }

  static async create(ticketData) {
    const connection = await this.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO TICKETS (event_id, ticket_price, ticket_type) VALUES (?, ?, ?)',
        [ticketData.event_id, ticketData.ticket_price, ticketData.ticket_type]
      );
      return result.insertId;
    } finally {
      await connection.end();
    }
  }
}

export default Ticket; 