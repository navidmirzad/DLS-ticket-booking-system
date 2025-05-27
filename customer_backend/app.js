import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectMongo from "./db/mongo.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "*", 
  })
);

await connectMongo();
console.log("RABBITMQ_URL:", process.env.RABBITMQ_URL);
app.use(express.json());

import ticketRouter from "./routes/ticketRouter.js";
app.use(ticketRouter);

import eventRouter from "./routes/eventRouter.js";
app.use(eventRouter);

import orderRouter from "./routes/orderRouter.js";
app.use('/api/orders', orderRouter);

import paymentRoutes from './routes/paymentRoutes.js';
app.use('/api/payments', paymentRoutes);

import { connectRabbit, consumeQueue } from "./util/rabbitmq.js";
await connectRabbit();
await consumeQueue();

const PORT = process.env.CUSTOMER_BACKEND_PORT || 3002;
app.listen(PORT, () => {
  console.log("Customer backend is running on PORT: ", PORT);
});
