import dotenv from "dotenv";
import express from "express";
import { connectRabbit } from "./util/rabbitmq.js";
/* import { isAuthenticated } from "./middleware/auth.js"; */
import createDatabase from "./database/init_database.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./util/swagger.js";
import { seedMySQL } from "./database/seedMySQL.js";

const app = express();

dotenv.config();

app.use(
  cors({
    origin: [
      process.env.LOCAL_ENV,
      process.env.ADMIN_FRONTEND,
      process.env.AUTH_ENV,
    ],
  })
);

app.use(express.json());

try {
  await connectRabbit(); // Connect to RabbitMQ
  console.log("RabbitMQ connected ✅");

  await createDatabase(); // Initialize the database
  console.log("Database initialized ✅");

  await seedMySQL(); // Seed the database
  console.log("Database seeded ✅");
} catch (error) {
  console.error("Error initializing services:", error);
  process.exit(1); // Exit if initialization fails
}

import eventRoutes from "./routes/event.js";
import adminRoutes from "./routes/admin.js";
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(eventRoutes);
app.use(adminRoutes);

const PORT = process.env.ADMIN_BACKEND_PORT || 3001;
app.listen(PORT, () => {
  console.log("Admin backend is running on PORT: ", PORT);
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api-docs`
  );
});
