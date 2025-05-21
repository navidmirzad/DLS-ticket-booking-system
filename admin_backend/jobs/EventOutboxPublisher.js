import mysql from "mysql2/promise";
import { publishEvent, connectRabbit } from "../util/rabbitmq.js";
import dotenv from "dotenv";

dotenv.config();

const POLL_INTERVAL_MS = 5000;

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runPublisher = async () => {
  while (true) {
    const connection = await mysql.createConnection(dbConfig);
    try {
      const [rows] = await connection.query(
        `SELECT * FROM EVENT_OUTBOX WHERE published = FALSE ORDER BY created_at ASC LIMIT 10`
      );

      for (const row of rows) {
        try {
          await publishEvent({
            type: row.event_type,
            payload: row.payload,
          });

          await connection.query(
            `UPDATE EVENT_OUTBOX SET published = TRUE, published_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [row.id]
          );

          console.log(`[✅] Published outbox event ${row.id}`);
        } catch (err) {
          console.error(`[❌] Failed to publish outbox event ${row.id}`, err);
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

(async () => {
  try {
    await connectRabbit();
    await runPublisher();
  } catch (err) {
    console.error("Failed to start publisher:", err);
    process.exit(1);
  }
})();
