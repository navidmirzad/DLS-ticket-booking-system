import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import User from "./models/userModel.js"; // Import your User model
import connectMongo from "./db/mongo.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Function to seed admin user
const seedAdminUser = async () => {
  try {
    // Check if admin user exists
    const existingUser = await User.findOne({ email: "admin@example.com" });

    if (!existingUser) {
      // Create admin user
      const adminUser = new User({
        name: "Admin User",
        email: "admin@test.com",
        phone: "+1234567890",
        password: "password123",
        role: "admin",
      });

      await adminUser.save();
      console.log("Admin user created successfully");
      console.log("Email: admin@example.com");
      console.log("Password: password123");
    } else {
      console.log("Admin user already exists, skipping create");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

// Connect to MongoDB and seed admin user
await connectMongo();
await seedAdminUser();

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AuthService running on port ${PORT}`));
