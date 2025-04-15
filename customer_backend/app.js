import express from "express";
import dotenv from "dotenv";
import connectMongo from "./db/mongo.js";
import { seedMongo } from "./db/seed.js";

const app = express();
dotenv.config();

await connectMongo();
await seedMongo();

app.use(express.json());

import ticketRouter from "./routes/ticketRouter.js";
app.use(ticketRouter);

import eventRouter from "./routes/eventRouter.js";
app.use(eventRouter);

const PORT = process.env.CUSTOMER_BACKEND_PORT || 3002;
app.listen(PORT, () => {
  console.log("Customer backend is running on PORT: ", PORT);
});
