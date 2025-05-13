import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/**
 * Event model class representing an event in the database
 * @class
 */
class Event {
  /**
   * Create an Event instance
   * @param {Object} data - Event data from database
   * @param {number} data.id - Event ID
   * @param {number} data.description_id - ID of associated event description
   * @param {number} data.tickets_available - Number of tickets available for this event
   * @param {Date} data.created_at - Creation timestamp
   * @param {Date} data.updated_at - Last update timestamp
   * @param {Date|null} data.deleted_at - Deletion timestamp or null if not deleted
   */
  constructor(data) {
    this.id = data.id;
    this.description_id = data.description_id;
    this.tickets_available = data.tickets_available;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.deleted_at = data.deleted_at;
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
   * Find an event by its ID
   * @static
   * @async
   * @param {number} id - Event ID to find
   * @returns {Promise<Event|null>} Event instance or null if not found
   */
  static async findById(id) {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM EVENT WHERE id = ? AND deleted_at IS NULL', [id]);
      return rows.length ? new Event(rows[0]) : null;
    } finally {
      await connection.end();
    }
  }

  /**
   * Create a new event in the database
   * @static
   * @async
   * @param {Object} eventData - Data for the new event
   * @param {number} eventData.description_id - ID of associated event description
   * @param {boolean} eventData.tickets_available - Whether tickets are available
   * @returns {Promise<number>} ID of the newly created event
   */
  static async create(eventData) {
    const connection = await this.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO EVENT (description_id, tickets_available) VALUES (?, ?)',
        [eventData.description_id, eventData.tickets_available]
      );
      return result.insertId;
    } finally {
      await connection.end();
    }
  }

  /**
   * Update ticket availability for an event
   * @static
   * @async
   * @param {number} eventId - ID of the event to update
   * @param {boolean} isAvailable - Whether tickets should be available
   * @returns {Promise<void>}
   */
  static async updateTicketAvailability(eventId, isAvailable) {
    const connection = await this.getConnection();
    try {
      await connection.query(
        'UPDATE EVENT SET tickets_available = ? WHERE id = ? AND deleted_at IS NULL',
        [isAvailable, eventId]
      );
    } finally {
      await connection.end();
    }
  }

  /**
   * Soft delete an event by setting its deleted_at timestamp
   * @static
   * @async
   * @param {number} eventId - ID of the event to delete
   * @returns {Promise<void>}
   */
  static async softDelete(eventId) {
    const connection = await this.getConnection();
    try {
      await connection.query(
        'UPDATE EVENT SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
        [eventId]
      );
    } finally {
      await connection.end();
    }
  }

  /**
   * Restore a previously deleted event
   * @static
   * @async
   * @param {number} eventId - ID of the event to restore
   * @returns {Promise<void>}
   */
  static async restore(eventId) {
    const connection = await this.getConnection();
    try {
      await connection.query(
        'UPDATE EVENT SET deleted_at = NULL WHERE id = ?',
        [eventId]
      );
    } finally {
      await connection.end();
    }
  }
}

export default Event; 