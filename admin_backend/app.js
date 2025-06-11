/**
 * Admin backend main application
 * @module app
 */
import dotenv from "dotenv";
import express from "express";
import { connectRabbit } from "./util/rabbitmq.js";
/* import { isAuthenticated } from "./middleware/auth.js"; */
import createDatabase from "./database/init_database.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./util/swagger.js";
import { seedMySQL } from "./database/seedMySQL.js";
import { startEventOutboxPublisher } from "./jobs/EventOutboxPublisher.js";

/**
 * Express application instance
 * @type {Object}
 */
const app = express();

dotenv.config();

/**
 * Configure CORS middleware
 */
app.use(cors());

/**
 * Configure request body parsing middleware
 */
app.use(express.json());

/**
 * Initialize services: RabbitMQ and Database
 */
try {
  await connectRabbit(); // Connect to RabbitMQ
  console.log("RabbitMQ connected ✅");

  await createDatabase().then(() => {
    console.log("Database initialized ✅");
    startEventOutboxPublisher();
    seedMySQL();
  });

  console.log("Database seeded ✅");
} catch (error) {
  console.error("Error initializing services:", error);
  process.exit(1); // Exit if initialization fails
}

import eventRoutes from "./routes/event.js";
import adminRoutes from "./routes/admin.js";

/**
 * Configure API routes
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(eventRoutes);
app.use(adminRoutes);

/**
 * Start the server
 */
const PORT = process.env.ADMIN_BACKEND_PORT || 3001;
app.listen(PORT, () => {
  console.log("Admin backend is running on PORT: ", PORT);
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api-docs`
  );
});
