import Event from "../models/mongo/Event.js";
import Ticket from "../models/mongo/Ticket.js";

export const seedMongo = async () => {
  try {
    await Event.deleteMany();
    await Ticket.deleteMany();

    const events = await Event.insertMany([
      {
        title: "Sample Event 1",
        description: "This is a sample event.",
        location: "City A",
        date: new Date(),
        capacity: 100,
        created_at: new Date(),
      },
      {
        title: "Sample Event 2",
        description: "This is a sample event.",
        location: "City B",
        date: new Date(),
        capacity: 200,
        created_at: new Date(),
      },
      {
        title: "Sample Event 3",
        description: "This is a sample event.",
        location: "City C",
        date: new Date(),
        capacity: 100,
        created_at: new Date(),
      },
      {
        title: "Sample Event 4",
        description: "This is a sample event.",
        location: "City D",
        date: new Date(),
        capacity: 50,
        created_at: new Date(),
      },
    ]);

    await Ticket.insertMany([
      {
        eventId: events[0]._id,
        userId: 1,
        email: "john@doe.com",
        purchasedAt: new Date()
      },

      {
        eventId: events[0]._id,
        userId: 1,
        email: "john@doe.com",
        purchasedAt: new Date()
      },

      {
        eventId: events[0]._id,
        userId: 1,
        email: "john@doe.com",
        purchasedAt: new Date()
      },

      {
        eventId: events[0]._id,
        userId: 1,
        email: "john@doe.com",
        purchasedAt: new Date()
      },
    ]);

    console.log("✅ MongoDB seeded.");
  } catch (err) {
    console.error("Seeding error:", err);
  }
};
