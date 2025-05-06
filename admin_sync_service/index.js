import dotenv from "dotenv";
import { connectRabbit } from "./rabbitmq.js";
import { syncEventsFromMySQL } from "./sync.js";

dotenv.config();

(async () => {
  try {
    await connectRabbit();
    console.log("RabbitMQ connected ✅");

    // Sync events from MySQL to RabbitMQ
    await syncEventsFromMySQL();
  } catch (error) {
    console.error("Error in AdminSyncService:", error);
  }
})();
