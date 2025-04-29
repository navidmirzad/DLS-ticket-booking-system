/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from "dotenv";
import express from "express";
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./services/eventService.js";
import { authenticate, authorizeAdmin } from "./middleware/auth.js";
import createDatabase from "./database/init_database.js";
import cors from "cors";
const app = express();

dotenv.config();

app.use(
  cors({
    origin: [process.env.LOCAL_ENV, process.env.ADMIN_FRONTEND],
  })
);

app.use(express.json());

createDatabase();

app.get("/api/admin", (req, res) => {
  res.send({ data: "Hello from admin backend" });
});

app.get("/api/admin/events", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const events = await getEvents();
    res.json({ data: events });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.get(
  "/api/admin/events/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = await getEvent(eventId);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json({ data: event });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  }
);

app.post(
  "/api/admin/events",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    try {
      const event = req.body;
      const newEvent = await createEvent(event);
      res.json({ data: newEvent });
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" });
    }
  }
);

app.patch(
  "/api/admin/events/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = req.body;
      const updatedEvent = await updateEvent(eventId, event);
      res.json({ data: updatedEvent });
    } catch (error) {
      res.status(500).json({ error: "Failed to update event" });
    }
  }
);

app.delete(
  "/api/admin/events/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    try {
      const eventId = req.params.id;
      await deleteEvent(eventId);
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  }
);

const PORT = process.env.ADMIN_BACKEND_PORT;
app.listen(PORT, () => {
  console.log("Admin backend is running on PORT: ", PORT);
});
