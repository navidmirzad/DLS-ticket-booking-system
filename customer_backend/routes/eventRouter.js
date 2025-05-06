// eventRouter.js
import express from "express";
import {
  getEventByID,
  getEvents,
  getTicketTypesForEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/api/event", getEvents);
router.get("/api/event/:eventId", getEventByID);
router.get("/api/event/:eventId/ticket-types", getTicketTypesForEvent);

export default router;
