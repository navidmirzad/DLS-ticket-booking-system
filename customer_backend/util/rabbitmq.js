import amqp from "amqplib";
import dotenv from "dotenv";
import { Event } from "../models/mongo/index.js"; // Import the Event model
import mongoose from "mongoose"; // Add this for MongoDB connection check

dotenv.config();
let channel;

// Ensure MongoDB is connected before consuming messages
const ensureMongoConnected = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log("MongoDB not connected. Connecting...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected.");
  }
};

export const connectRabbit = async () => {
  console.log("Connecting to RabbitMQ:", process.env.RABBITMQ_URL);
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await conn.createChannel();
  await channel.assertQueue("eventQueue"); // Ensure the queue exists
  await channel.assertQueue("emailQueue"); // Ensure the emailQueue exists
  console.log("RabbitMQ connected and queues asserted.");
};

export const sendToQueue = async (data) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  channel.sendToQueue("emailQueue", Buffer.from(JSON.stringify(data)));
};

export const consumeQueue = async () => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");

  await ensureMongoConnected();

  await channel.consume(
    "eventQueue",
    async (msg) => {
      if (msg !== null) {
        const event = JSON.parse(msg.content.toString());
        console.log("Event received:", event);

        // Handle event (e.g., save to MongoDB)
        if (event.type === "EventCreated") {
          const { payload } = event;
          console.log("Saving event to MongoDB. Payload:", payload);
          try {
            const saved = await Event.create(payload); // Save the event to MongoDB
            console.log("Event saved to MongoDB:", saved);
          } catch (error) {
            console.error(
              "Error saving event to MongoDB:",
              error,
              "Payload:",
              payload
            );
          }
        } else {
          console.log("Unknown event type:", event.type);
        }
      } else {
        console.log("Received null message from eventQueue.");
      }
    },
    { noAck: true }
  );
  console.log("RabbitMQ consumer started for eventQueue.");
};
