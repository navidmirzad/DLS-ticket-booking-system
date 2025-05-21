import { Order, Ticket } from "../models/mongo/index.js";
import { v4 as uuidv4 } from "uuid";

export const createOrder = async (req, res) => {
  try {
    const { tickets, email } = req.body;
    
    // Validate tickets exist and calculate total price
    let totalPrice = 0;
    const ticketsBought = [];
    
    for (const item of tickets) {
      const ticket = await Ticket.findOne({ ticket_id: item.ticket_id });
      if (!ticket) {
        return res.status(404).json({ error: `Ticket ${item.ticket_id} not found` });
      }
      totalPrice += ticket.ticket_price * item.quantity;
      ticketsBought.push({
        ticket_id: item.ticket_id,
        quantity: item.quantity
      });
    }

    const order = new Order({
      order_id: uuidv4(),
      email,
      tickets_bought: ticketsBought,
      total_price: totalPrice,
      order_status: 'CONFIRMED'
    });

    await order.save();
    res.status(201).json({ data: order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    console.log('Getting orders for user:', req.user);
    const { email } = req.user;
    
    if (!email) {
      return res.status(400).json({ error: "User email is required" });
    }

    const orders = await Order.find({ 
      email,
      deleted_at: null 
    }).sort({ created_at: -1 });
    
    console.log('Found orders:', orders);
    res.json({ data: orders });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;
    
    const order = await Order.findOne({ 
      order_id: id,
      deleted_at: null
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Ensure user can only access their own orders
    if (order.email !== email) {
      return res.status(403).json({ error: "Not authorized to view this order" });
    }

    res.json({ data: order });
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { email } = req.user;

    const order = await Order.findOne({
      order_id: id,
      deleted_at: null
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Ensure user can only update their own orders
    if (order.email !== email) {
      return res.status(403).json({ error: "Not authorized to update this order" });
    }

    // Only allow certain status transitions
    const allowedStatuses = ['CANCELLED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status update" });
    }

    order.order_status = status;
    if (status === 'CANCELLED') {
      order.deleted_at = new Date();
    }

    await order.save();
    res.json({ data: order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: error.message });
  }
}; 