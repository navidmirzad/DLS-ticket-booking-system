import {
  Event,
  EventDescription,
  Ticket,
  Order,
  User,
} from "../models/mongo/index.js";
import { v4 as uuidv4 } from "uuid";

export const seedMongo = async () => {
  try {
    // Clear existing data
    await Event.deleteMany({});
    await EventDescription.deleteMany({});
    await Ticket.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});

    // Create event descriptions
    const eventDescriptions = await EventDescription.insertMany([
      {
        event_desc_id: uuidv4(),
        event_name: "Summer Music Festival",
        event_image:
          "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
        event_date: new Date("2025-07-15"),
        event_description:
          "A fantastic music festival featuring top artists from around the world.",
        event_location: "Central Park, New York",
      },
      {
        event_desc_id: uuidv4(),
        event_name: "Tech Conference 2025",
        event_image:
          "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
        event_date: new Date("2025-09-20"),
        event_description:
          "The biggest tech conference of the year with keynotes from industry leaders.",
        event_location: "Convention Center, San Francisco",
      },
      {
        event_desc_id: uuidv4(),
        event_name: "Food & Wine Expo",
        event_image:
          "https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg",
        event_date: new Date("2025-08-05"),
        event_description:
          "Taste incredible dishes and wines from renowned chefs and sommeliers.",
        event_location: "Exhibition Hall, Chicago",
      },
      {
        event_desc_id: uuidv4(),
        event_name: "Sports Championship",
        event_image:
          "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
        event_date: new Date("2025-10-12"),
        event_description:
          "The final championship game of the season featuring top teams.",
        event_location: "Stadium Arena, Dallas",
      },
    ]);

    // Create events
    const events = await Event.insertMany([
      {
        event_id: uuidv4(),
        tickets_available: 500,
        event_description: eventDescriptions[0]._id,
      },
      {
        event_id: uuidv4(),
        tickets_available: 1000,
        event_description: eventDescriptions[1]._id,
      },
      {
        event_id: uuidv4(),
        tickets_available: 300,
        event_description: eventDescriptions[2]._id,
      },
      {
        event_id: uuidv4(),
        tickets_available: 5000,
        event_description: eventDescriptions[3]._id,
      },
    ]);

    // Create users
    const users = await User.insertMany([
      {
        user_id: uuidv4(),
        name: "John Doe",
        email: "john@example.com",
        role: "USER",
        password: "hashed_password_123", // In real app, use proper hashing
      },
      {
        user_id: uuidv4(),
        name: "Admin User",
        email: "admin@example.com",
        role: "ADMIN",
        password: "hashed_password_admin",
      },
    ]);

    // Create tickets
    const tickets = await Ticket.insertMany([
      {
        ticket_id: uuidv4(),
        event_id: events[0].event_id,
        ticket_price: 99.99,
        ticket_type: "STANDARD",
      },
      {
        ticket_id: uuidv4(),
        event_id: events[0].event_id,
        ticket_price: 199.99,
        ticket_type: "VIP",
      },
      {
        ticket_id: uuidv4(),
        event_id: events[1].event_id,
        ticket_price: 149.99,
        ticket_type: "EARLY_BIRD",
      },
    ]);

    // Create orders
    await Order.insertMany([
      {
        order_id: uuidv4(),
        email: users[0].email,
        tickets_bought: [{ ticket_id: tickets[0].ticket_id, quantity: 2 }],
        total_price: tickets[0].ticket_price * 2,
        order_status: "CONFIRMED",
      },
    ]);

    console.log("✅ MongoDB seeded with tombstone pattern models.");
  } catch (err) {
    console.error("Seeding error:", err);
  }
};
