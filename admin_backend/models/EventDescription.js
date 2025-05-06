import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

class EventDescription {
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
      const [rows] = await connection.query('SELECT * FROM EVENT_DESCRIPTION WHERE id = ?', [id]);
      return rows.length ? new EventDescription(rows[0]) : null;
    } finally {
      await connection.end();
    }
  }

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