import amqp from "amqplib";
import dotenv from "dotenv";
import { Event } from "../models/mongo/index.js"; // Your Mongoose model
import mongoose from "mongoose";

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
  const retryDelay = 5000;

  const tryConnect = async () => {
    try {
      console.log("Connecting to RabbitMQ:", process.env.RABBITMQ_URL);
      const conn = await amqp.connect(process.env.RABBITMQ_URL);

      channel = await conn.createChannel();
      await channel.assertQueue("eventQueue");
      await channel.assertQueue("ticketQueue");
      await channel.assertQueue("emailQueue");
      console.log("RabbitMQ connected and queues asserted.");

      await consumeQueue();

      conn.on("close", () => {
        console.error("RabbitMQ connection closed. Reconnecting...");
        channel = null;
        setTimeout(tryConnect, retryDelay);
      });

      conn.on("error", (err) => {
        console.error("RabbitMQ connection error:", err.message);
      });

    } catch (err) {
      console.error("RabbitMQ connection failed:", err.message);
      setTimeout(tryConnect, retryDelay);
    }
  };

  tryConnect();
};

export const sendToQueue = async (data) => {
  if (!channel) {
    console.warn("Cannot send to queue, RabbitMQ not connected.");
    return;
  }
  channel.sendToQueue("emailQueue", Buffer.from(JSON.stringify(data)));
};

export const sendTicketToQueue = async (data) => {
  if (!channel) {
    console.warn("Cannot send to queue, RabbitMQ not connected.");
    return;
  }
  channel.sendToQueue("ticketQueue", Buffer.from(JSON.stringify(data)));
};

export const consumeQueue = async () => {
  if (!channel) {
    console.warn("Cannot consume queue, RabbitMQ not connected.");
    return;
  }

  await ensureMongoConnected();

  await channel.consume(
    "eventQueue",
    async (msg) => {
      if (msg !== null) {
        const event = JSON.parse(msg.content.toString());
        console.log("Event received:", event);

        try {
          if (event.type === "EventCreated") {
            const saved = await Event.create(event.payload);
            console.log("Event saved to MongoDB:", saved);
          } else if (event.type === "EventUpdated") {
            const updated = await Event.findOneAndUpdate(
              { id: String(event.payload.id) },
              event.payload,
              { new: true }
            );
            console.log("Event updated in MongoDB:", updated);
          } else if (event.type === "EventDeleted") {
            await Event.findOneAndDelete({ id: String(event.payload.id) });
            console.log("Event deleted from MongoDB:", event.payload.id);
          } else {
            console.log("Unknown event type:", event.type);
          }

          channel.ack(msg);
        } catch (error) {
          console.error("Error processing event:", error, "Payload:", event.payload);
          // No ack here to allow retry
        }
      } else {
        console.log("Received null message from eventQueue.");
      }
    },
    { noAck: false }
  );

  console.log("RabbitMQ consumer started for eventQueue.");
};
