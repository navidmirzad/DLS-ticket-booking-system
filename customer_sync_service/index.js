import dotenv from "dotenv";
import { connectRabbit, consume } from "./config/rabbitmq.js";

dotenv.config();

await connectRabbit();
await consume();