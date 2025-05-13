import amqp from "amqplib";
import { syncToMySQL } from "./sync.js";

let channel;

export const connectRabbit = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue("ticketQueue"); // Ensure the queue exists
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
    "ticketQueue",
    async (msg) => {
      if (msg !== null) {
        const ticket = JSON.parse(msg.content.toString());
        console.log("Ticket received:", ticket);

        await syncToMySQL(ticket);

        // Acknowledge the message
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
};
