import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/**
 * Ticket model class representing event tickets in the database
 * @class
 */
class Ticket {
  /**
   * Create a Ticket instance
   * @param {Object} data - Ticket data from database
   * @param {number} data.ticket_id - Ticket ID
   * @param {number} data.event_id - ID of the associated event
   * @param {number} data.ticket_price - Price of the ticket
   * @param {string} data.ticket_type - Type of ticket
   * @param {Date} data.created_at - Creation timestamp
   * @param {Date} data.updated_at - Last update timestamp
   */
  constructor(data) {
    this.ticket_id = data.ticket_id;
    this.event_id = data.event_id;
    this.ticket_price = data.ticket_price;
    this.ticket_type = data.ticket_type;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Creates a database connection
   * @static
   * @async
   * @returns {Promise<Object>} Database connection
   */
  static async getConnection() {
    return await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  /**
   * Find a ticket by its ID
   * @static
   * @async
   * @param {number} id - Ticket ID to find
   * @returns {Promise<Ticket|null>} Ticket instance or null if not found
   */
  static async findById(id) {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM TICKETS WHERE ticket_id = ?', [id]);
      return rows.length ? new Ticket(rows[0]) : null;
    } finally {
      await connection.end();
    }
  }

  /**
   * Find all tickets for a specific event
   * @static
   * @async
   * @param {number} eventId - Event ID to find tickets for
   * @returns {Promise<Array<Ticket>>} Array of Ticket instances
   */
  static async findByEventId(eventId) {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM TICKETS WHERE event_id = ?', [eventId]);
      return rows.map(row => new Ticket(row));
    } finally {
      await connection.end();
    }
  }

  /**
   * Create a new ticket in the database
   * @static
   * @async
   * @param {Object} ticketData - Data for the new ticket
   * @param {number} ticketData.event_id - ID of the associated event
   * @param {number} ticketData.ticket_price - Price of the ticket
   * @param {string} ticketData.ticket_type - Type of ticket
   * @returns {Promise<number>} ID of the newly created ticket
   */
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