import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/**
 * Initializes the database by creating necessary tables if they don't exist
 *
 * Creates the following tables:
 * - EVENT_DESCRIPTION: Stores event details such as title, image, capacity, etc.
 * - EVENT: Stores event records with references to descriptions
 * - TICKETS: Stores ticket information for events
 * - ORDERS: Stores customer orders
 *
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If there's an error creating the database or tables
 */
async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS EVENT_DESCRIPTION (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        image VARCHAR(255),
        capacity INT,
        date DATETIME,
        description TEXT,
        location VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS EVENT (
        id INT AUTO_INCREMENT PRIMARY KEY,
        description_id INT,
        tickets_available INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME DEFAULT NULL,
        FOREIGN KEY (description_id) REFERENCES EVENT_DESCRIPTION(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS ORDERS (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255),
        tickets_bought INT,
        total_price DECIMAL(10, 2),
        status VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        deleted_at DATETIME DEFAULT NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS TICKETS (
        id VARCHAR(50) PRIMARY KEY,
        event_id INT,
        price DECIMAL(10, 2),
        type VARCHAR(50),
        order_id VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        deleted_at DATETIME DEFAULT NULL,
        FOREIGN KEY (event_id) REFERENCES EVENT(id),
        FOREIGN KEY (order_id) REFERENCES ORDERS(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS EVENT_OUTBOX (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        event_type VARCHAR(255) NOT NULL,
        payload JSON NOT NULL,
        published BOOLEAN DEFAULT FALSE,
        published_at TIMESTAMP NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database and tables created successfully");
  } catch (error) {
    console.error("Error creating database and tables:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

export default createDatabase;
