import amqp from "amqplib";
import dotenv from "dotenv";
import { Event } from "../models/mongo/index.js"; // Import the Event model
import mongoose from "mongoose"; // Add this for MongoDB connection check
import { sendEventUpdate } from "../controllers/eventController.js"; // Import SSE function

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
  await channel.assertQueue("ticketQueue"); // Ensure the ticketQueue exists
  await channel.assertQueue("emailQueue"); // Ensure the emailQueue exists
  console.log("RabbitMQ connected and queues asserted.");
};

export const sendToQueue = async (data) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  channel.sendToQueue("emailQueue", Buffer.from(JSON.stringify(data)));
};

export const sendTicketToQueue = async (data) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  channel.sendToQueue("ticketQueue", Buffer.from(JSON.stringify(data)));
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

  // Consume ticket queue for SSE updates
  await channel.consume(
    "ticketQueue",
    async (msg) => {
      if (msg !== null) {
        try {
          const ticketData = JSON.parse(msg.content.toString());
          console.log("Ticket data received:", ticketData);

          if (ticketData.type === "TICKET_BOUGHT" && ticketData.event && ticketData.event_id) {
            // Find the event to get updated availability
            const eventId = ticketData.event_id || ticketData.event.id;
            if (eventId) {
              // For SSE, we need to send an update to all clients listening for this event
              const eventUpdate = {
                type: "TICKET_PURCHASED",
                eventId: eventId,
                remainingTickets: null, // We'll update this with real data below
                timestamp: new Date().toISOString()
              };
              
              try {
                // Get the updated event data to include latest ticket availability
                // Use both id and _id fields to ensure we find the event
                const event = await Event.findOne({ 
                  $or: [
                    { id: eventId },
                    { _id: eventId }
                  ]
                });
                
                if (event) {
                  console.log(`Found event with tickets_available: ${event.tickets_available}`);
                  eventUpdate.remainingTickets = event.tickets_available;
                  eventUpdate.eventTitle = event.title;
                } else {
                  console.log(`Event not found with ID: ${eventId}`);
                }
              } catch (error) {
                console.error("Error fetching updated event data:", error);
              }
              
              // Send the update to all connected SSE clients for this event
              sendEventUpdate(eventId, eventUpdate);
              console.log("Sent SSE update for event:", eventId, "with data:", eventUpdate);
            }
          }
        } catch (error) {
          console.error("Error processing ticket message:", error);
        }
      }
    },
    { noAck: true }
  );
  console.log("RabbitMQ consumer started for ticketQueue.");
};
