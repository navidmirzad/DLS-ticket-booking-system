import amqp from "amqplib";
import dotenv from "dotenv";
import {Event} from "../models/mongo/index.js"; // Import the Event model

dotenv.config();
let channel;

export const connectRabbit = async () => {
  console.log(process.env.RABBITMQ_URL);
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await conn.createChannel();
  await channel.assertQueue("eventQueue"); // Ensure the queue exists
  await channel.assertQueue("emailQueue"); // Ensure the emailQueue exists
};

export const sendToQueue = async (data) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  channel.sendToQueue("emailQueue", Buffer.from(JSON.stringify(data)));
};

export const consumeQueue = async () => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");

  await channel.consume(
    "eventQueue",
    async (msg) => {
      if (msg !== null) {
        const event = JSON.parse(msg.content.toString());
        console.log("Event received:", event);

        // Handle event (e.g., save to MongoDB)
        if (event.type === "EventCreated") {
          const { payload } = event;
          try {
            await Event.create(payload); // Save the event to MongoDB
          } catch (error) {
            console.error("Error saving event to MongoDB:", error);
          }
        }
      }
    },
    { noAck: true }
  );
};
