import dotenv from "dotenv";
import express from "express";
import { getEvents, createEvent } from "./services/eventService.js";
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

app.get("/api/admin/events", async (req, res) => {
  try {
    const events = await getEvents();
    res.json({ data: events });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.post("/api/admin/events", async (req, res) => {
  try {
    const event = req.body;
    const newEvent = await createEvent(event);
    res.json({ data: newEvent });
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
});

const PORT = process.env.ADMIN_BACKEND_PORT;
app.listen(PORT, () => {
  console.log("Admin backend is running on PORT: ", PORT);
});
