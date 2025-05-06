import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

class Order {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.tickets_bought = data.tickets_bought;
    this.total_price = data.total_price;
    this.status = data.status;
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
      const [rows] = await connection.query('SELECT * FROM ORDERS WHERE id = ? AND deleted_at IS NULL', [id]);
      return rows.length ? new Order(rows[0]) : null;
    } finally {
      await connection.end();
    }
  }

  static async findByEmail(email) {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM ORDERS WHERE email = ? AND deleted_at IS NULL', [email]);
      return rows.map(row => new Order(row));
    } finally {
      await connection.end();
    }
  }

  static async create(orderData) {
    const connection = await this.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO ORDERS (email, tickets_bought, total_price, status) VALUES (?, ?, ?, ?)',
        [orderData.email, orderData.tickets_bought, orderData.total_price, orderData.status]
      );
      return result.insertId;
    } finally {
      await connection.end();
    }
  }

  static async updateStatus(orderId, status) {
    const connection = await this.getConnection();
    try {
      await connection.query(
        'UPDATE ORDERS SET status = ? WHERE id = ? AND deleted_at IS NULL',
        [status, orderId]
      );
    } finally {
      await connection.end();
    }
  }

  static async softDelete(orderId) {
    const connection = await this.getConnection();
    try {
      await connection.query(
        'UPDATE ORDERS SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
        [orderId]
      );
    } finally {
      await connection.end();
    }
  }

  static async restore(orderId) {
    const connection = await this.getConnection();
    try {
      await connection.query(
        'UPDATE ORDERS SET deleted_at = NULL WHERE id = ?',
        [orderId]
      );
    } finally {
      await connection.end();
    }
  }
}

export default Order; 