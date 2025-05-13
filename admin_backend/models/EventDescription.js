import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/**
 * EventDescription model class representing event description details in the database
 * @class
 */
class EventDescription {
  /**
   * Create an EventDescription instance
   * @param {Object} data - Event description data from database
   * @param {number} data.id - Event description ID
   * @param {string} data.name - Event name
   * @param {string} data.image - Event image URL or path
   * @param {Date} data.date - Event date
   * @param {string} data.description - Event description text
   * @param {string} data.location - Event location
   * @param {Date} data.created_at - Creation timestamp
   * @param {Date} data.updated_at - Last update timestamp
   */
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image;
    this.date = data.date;
    this.description = data.description;
    this.location = data.location;
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
   * Find an event description by its ID
   * @static
   * @async
   * @param {number} id - Event description ID to find
   * @returns {Promise<EventDescription|null>} EventDescription instance or null if not found
   */
  static async findById(id) {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM EVENT_DESCRIPTION WHERE id = ?', [id]);
      return rows.length ? new EventDescription(rows[0]) : null;
    } finally {
      await connection.end();
    }
  }

  /**
   * Create a new event description in the database
   * @static
   * @async
   * @param {Object} eventData - Data for the new event description
   * @param {string} eventData.name - Event name
   * @param {string} eventData.image - Event image URL or path
   * @param {Date|string} eventData.date - Event date
   * @param {string} eventData.description - Event description text
   * @param {string} eventData.location - Event location
   * @returns {Promise<number>} ID of the newly created event description
   */
  static async create(eventData) {
    const connection = await this.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO EVENT_DESCRIPTION (name, image, date, description, location) VALUES (?, ?, ?, ?, ?)',
        [eventData.name, eventData.image, eventData.date, eventData.description, eventData.location]
      );
      return result.insertId;
    } finally {
      await connection.end();
    }
  }
}

export default EventDescription; 