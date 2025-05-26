// eventRouter.js
import express from "express";
import {
  getEventByID,
  getEvents,
  getTicketTypesForEvent,
  getEventUpdates
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/api/event", getEvents);
router.get("/api/event/:eventId", getEventByID);
router.get("/api/event/:eventId/ticket-types", getTicketTypesForEvent);
router.get("/api/event/:eventId/updates", getEventUpdates);

export default router;
