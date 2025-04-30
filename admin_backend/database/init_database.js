import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    await connection.query(`USE ${process.env.DB_NAME}`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        location VARCHAR(255),
        date DATETIME,
        capacity INT, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT,
        type VARCHAR(50),
        price DECIMAL(10, 2),
        available INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT,
        ticket_id INT,
        quantity INT,
        total_amount DECIMAL(10, 2),
        status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
        ordered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id),
        FOREIGN KEY (ticket_id) REFERENCES tickets(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        amount_paid DECIMAL(10, 2),
        method ENUM('credit_card', 'paypal', 'bank_transfer'),
        status ENUM('pending', 'successful', 'failed') DEFAULT 'pending',
        paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )
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
