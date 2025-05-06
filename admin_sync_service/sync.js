import mysql from "mysql2/promise";
import { publishEvent } from "./rabbitmq.js";

const getMySQLConnection = async () => {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
};

export const syncEventsFromMySQL = async () => {
  const connection = await getMySQLConnection();
  const [events] = await connection.query("SELECT * FROM events");

  for (const event of events) {
    console.log("Publishing event to RabbitMQ:", event);

    await publishEvent({
      type: "EventCreated",
      payload: event,
    });
  }

  console.log("Events synced from MySQL to RabbitMQ ✅");
};
