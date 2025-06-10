import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/**
 * Order model class representing a customer order in the database
 * @class
 */
class Order {
  /**
   * Create an Order instance
   * @param {Object} data - Order data from database
   * @param {number} data.id - Order ID
   * @param {string} data.email - Customer email
   * @param {number} data.tickets_bought - Number of tickets purchased
   * @param {number} data.total_price - Total price of the order
   * @param {string} data.status - Order status
   * @param {Date} data.created_at - Creation timestamp
   * @param {Date} data.updated_at - Last update timestamp
   * @param {Date|null} data.deleted_at - Deletion timestamp or null if not deleted
   */
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
   * Find an order by its ID
   * @static
   * @async
   * @param {number} id - Order ID to find
   * @returns {Promise<Order|null>} Order instance or null if not found
   */
  static async findById(id) {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT * FROM ORDERS WHERE id = ? AND deleted_at IS NULL",
        [id]
      );
      return rows.length ? new Order(rows[0]) : null;
    } finally {
      await connection.end();
    }
  }

  /**
   * Find orders by customer email
   * @static
   * @async
   * @param {string} email - Customer email to search for
   * @returns {Promise<Array<Order>>} Array of Order instances
   */
  static async findByEmail(email) {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT * FROM ORDERS WHERE email = ? AND deleted_at IS NULL",
        [email]
      );
      return rows.map((row) => new Order(row));
    } finally {
      await connection.end();
    }
  }

  /**
   * Create a new order in the database
   * @static
   * @async
   * @param {Object} orderData - Data for the new order
   * @param {string} orderData.email - Customer email
   * @param {number} orderData.tickets_bought - Number of tickets purchased
   * @param {number} orderData.total_price - Total price of the order
   * @param {string} orderData.status - Order status
   * @returns {Promise<number>} ID of the newly created order
   */
  static async create(orderData) {
    const connection = await this.getConnection();
    try {
      const [result] = await connection.query(
        "INSERT INTO ORDERS (email, tickets_bought, total_price, status) VALUES (?, ?, ?, ?)",
        [
          orderData.email,
          orderData.tickets_bought,
          orderData.total_price,
          orderData.status,
        ]
      );
      return result.insertId;
    } finally {
      await connection.end();
    }
  }

  /**
   * Update the status of an order
   * @static
   * @async
   * @param {number} orderId - ID of the order to update
   * @param {string} status - New status for the order
   * @returns {Promise<void>}
   */
  static async updateStatus(orderId, status) {
    const connection = await this.getConnection();
    try {
      await connection.query(
        "UPDATE ORDERS SET status = ? WHERE id = ? AND deleted_at IS NULL",
        [status, orderId]
      );
    } finally {
      await connection.end();
    }
  }

  /**
   * Soft delete an order by setting its deleted_at timestamp
   * @static
   * @async
   * @param {number} orderId - ID of the order to delete
   * @returns {Promise<void>}
   */
  static async softDelete(orderId) {
    const connection = await this.getConnection();
    try {
      await connection.query(
        "UPDATE ORDERS SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL",
        [orderId]
      );
    } finally {
      await connection.end();
    }
  }

  /**
   * Restore a previously deleted order
   * @static
   * @async
   * @param {number} orderId - ID of the order to restore
   * @returns {Promise<void>}
   */
  static async restore(orderId) {
    const connection = await this.getConnection();
    try {
      await connection.query(
        "UPDATE ORDERS SET deleted_at = NULL WHERE id = ?",
        [orderId]
      );
    } finally {
      await connection.end();
    }
  }
}

export default Order;
