import mysql from "mysql2/promise";
import { publishEvent, connectRabbit } from "../util/rabbitmq.js";
import dotenv from "dotenv";

dotenv.config();

const POLL_INTERVAL_MS = 5000;

// Log environment variables (excluding sensitive ones)
console.log('Database Configuration:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runPublisher = async () => {
  while (true) {
    console.log('Attempting to connect to MySQL with config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    });
    
    const connection = await mysql.createConnection(dbConfig);
    try {
      const [rows] = await connection.query(
        `SELECT * FROM EVENT_OUTBOX WHERE published = FALSE ORDER BY created_at ASC LIMIT 10`
      );

      for (const row of rows) {
        try {
          await publishEvent({
            type: row.event_type,
            payload:
              typeof row.payload === "string"
                ? JSON.parse(row.payload)
                : row.payload,
          });

          await connection.query(
            `UPDATE EVENT_OUTBOX SET published = TRUE, published_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [row.id]
          );

          console.log(`[✅] Published outbox event ${row.id}`);
        } catch (err) {
          console.error(`[❌] Failed to publish outbox event ${row.id}`, err);
          // Do not update as published if publishEvent fails!
        }
      }
    } catch (err) {
      console.error("[❌] Outbox polling error:", err);
    } finally {
      await connection.end();
      await sleep(POLL_INTERVAL_MS);
    }
  }
};

/**
 * Starts the event outbox publisher with robust RabbitMQ reconnect logic.
 * Keeps retrying RabbitMQ connection and polling the outbox.
 */
export const startEventOutboxPublisher = async () => {
  while (true) {
    try {
      await connectRabbit();
      await runPublisher();
    } catch (err) {
      console.error(
        "Failed to start publisher or lost connection. Retrying in 5s...",
        err
      );
      await sleep(5000);
    }
  }
};
