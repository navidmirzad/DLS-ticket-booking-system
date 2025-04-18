import dotenv from "dotenv";
dotenv.config();

import { connect, consumeQueue } from "./rabbitmq.js";

await connect();
await consumeQueue();