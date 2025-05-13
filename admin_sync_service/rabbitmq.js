import amqp from "amqplib";
import { syncToMySQL } from "./sync.js";

let channel;

export const connectRabbit = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue("eventQueue"); // Ensure the queue exists
      console.log("RabbitMQ connected ✅");
      return;
    } catch (error) {
      console.error("RabbitMQ connection failed. Retrying...", error);
      retries -= 1;
      if (retries === 0)
        throw new Error("RabbitMQ connection failed after retries");
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export const consumeQueue = async () => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");

  await channel.consume(
    "eventQueue",
    async (msg) => {
      if (msg !== null) {
        const event = JSON.parse(msg.content.toString());
        console.log("Event received:", event);

        // Synchronize changes to MySQL and MongoDB
        if (
          event.type === "EventCreated" ||
          event.type === "EventUpdated" ||
          event.type === "EventDeleted"
        ) {
          await syncToMySQL(event);
        }

        // Acknowledge the message
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
};
