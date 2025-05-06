import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

class Event {
  constructor(data) {
    this.id = data.id;
    this.description_id = data.description_id;
    this.tickets_available = data.tickets_available;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.deleted_at = data.deleted_at;
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
      const [rows] = await connection.query('SELECT * FROM EVENT WHERE id = ? AND deleted_at IS NULL', [id]);
      return rows.length ? new Event(rows[0]) : null;
    } finally {
      await connection.end();
    }
  }

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