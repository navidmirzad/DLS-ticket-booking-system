import express from "express";
import { getTicketByID, getTicketsByUserID } from "../controllers/ticketController.js";

const router = express.Router();

router.get("/api/ticket/:ticketId", getTicketByID);

// this probably has body with jwt
router.get("/api/ticket/user/:userId", getTicketsByUserID);

export default router;