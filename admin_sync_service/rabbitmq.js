import amqp from "amqplib";
import { syncToMySQL } from "./sync.js";

let channel;

export const connectRabbit = async () => {
  console.log("Connecting to RabbitMQ:", process.env.RABBITMQ_URL);
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await conn.createChannel();
  await channel.assertQueue("ticketQueue"); // Ensure the ticketQueue exists
  console.log("RabbitMQ connected and queues asserted.");
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
