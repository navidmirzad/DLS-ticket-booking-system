import Event from "../models/mongo/Event.js";
import Ticket from "../models/mongo/Ticket.js";

export const seedMongo = async () => {
  try {
    await Event.deleteMany();
    await Ticket.deleteMany();

    const events = await Event.insertMany([
      {
        id: 1,
        title: "Sample Event",
        description: "This is a sample event.",
        location: "City A",
        date: new Date(),
        capacity: 100,
        created_at: new Date(),
      },
    ]);

    await Ticket.insertMany([
      {
        id: 1,
        user_id: 42,
        event: {
          id: events[0].id,
          title: events[0].title,
          location: events[0].location,
          date: events[0].date,
        },
      },
    ]);

    console.log("✅ MongoDB seeded.");
  } catch (err) {
    console.error("Seeding error:", err);
  }
};
