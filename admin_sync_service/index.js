import dotenv from "dotenv";
import { connectRabbit } from "./rabbitmq.js";
import { connectMySQL } from "./mysql.js";

dotenv.config();

(async () => {
  try {
    // Connect to RabbitMQ
    await connectRabbit();
    console.log("RabbitMQ connected ✅");

    // Connect to MySQL
    await connectMySQL();
    console.log("MySQL connected ✅");

    // Start consuming messages from RabbitMQ
    await consumeQueue();
    console.log("Consuming messages from RabbitMQ started ✅");
  } catch (error) {
    console.error("Error in AdminSyncService:", error);
    process.exit(1);
  }
})();
