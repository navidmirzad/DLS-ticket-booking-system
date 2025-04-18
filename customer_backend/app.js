import express from "express";
import dotenv from "dotenv";
import connectMongo from "./db/mongo.js";
import { seedMongo } from "./db/seed.js";

const app = express();
dotenv.config();

await connectMongo();
await seedMongo();
console.log('RABBITMQ_URL:', process.env.RABBITMQ_URL);
app.use(express.json());

import ticketRouter from "./routes/ticketRouter.js";
app.use(ticketRouter);

import eventRouter from "./routes/eventRouter.js";
app.use(eventRouter);

import { connectRabbit } from './util/rabbitmq.js';
await connectRabbit();

const PORT = process.env.CUSTOMER_BACKEND_PORT || 3002;
app.listen(PORT, () => {
  console.log("Customer backend is running on PORT: ", PORT);
});
