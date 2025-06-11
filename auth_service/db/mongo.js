import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectMongo = async () => {
    try {
        const dbUrl = process.env.DATABASE_URL || "mongodb://mongodb-auth:27017/auth_db";
        await mongoose.connect(dbUrl);
        console.log("Connected to MongoDB");
    } catch(err) {
        console.error("MongoDB connection error: ", err);
        process.exit(1);
    }
}

export default connectMongo; 