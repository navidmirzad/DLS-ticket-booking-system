import express from "express";
import { getEventByID, getEvents } from "../controllers/eventController.js"; 

const router = express.Router();

router.get("/api/event", getEvents);
router.get("/api/event/:eventId", getEventByID);

export default router;