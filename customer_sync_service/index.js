import dotenv from "dotenv";
import { connectRabbit, consume } from "./config/rabbitmq.js";
import { connectMongo } from "./config/mongo.js"

dotenv.config();

await connectMongo();
await connectRabbit();
await consume();