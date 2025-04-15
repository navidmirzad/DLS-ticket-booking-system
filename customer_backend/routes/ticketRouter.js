import express from "express";
import { getTicketByID, getTicketsByUserID, buyTicket, refundTicket } from "../controllers/ticketController.js";

const router = express.Router();

router.get("/api/ticket/:ticketId", getTicketByID);

// this probably has body with jwt
router.get("/api/ticket/user/:userId", getTicketsByUserID);
router.post("/api/ticket", buyTicket);
router.delete("/api/ticket/:ticketId", refundTicket);

export default router;