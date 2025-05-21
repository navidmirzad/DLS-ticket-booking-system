import express from "express";
import { 
  createOrder,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus
} from "../controllers/orderController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Create a new order
router.post("/", authenticateUser, createOrder);

// Get all orders for the authenticated user
router.get("/my-orders", authenticateUser, getOrdersByUser);

// Get a specific order
router.get("/:id", authenticateUser, getOrderById);

// Update order status (e.g., cancel order)
router.patch("/:id/status", authenticateUser, updateOrderStatus);

export default router; 