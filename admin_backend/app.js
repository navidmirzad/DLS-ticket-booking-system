import dotenv from "dotenv";
import express from "express";
import createDatabase from "./database/init_database.js";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './util/swagger.js';

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
  await createDatabase();
} catch (error) {
  console.error("Error creating database:", error);
}

import eventRoutes from "./routes/event.js";
import adminRoutes from "./routes/admin.js";
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(eventRoutes);
app.use(adminRoutes);

const PORT = process.env.ADMIN_BACKEND_PORT || 3001;
app.listen(PORT, () => {
  console.log("Admin backend is running on PORT: ", PORT);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
