import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectMongo = async () => {
    try {
        const dbUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/customer"
        await mongoose.connect(dbUrl);
        
        console.log("Connected to MongoDB");
    } catch(err) {
        console.error("MongoDB connection error: ", err);
    }
}

export default connectMongo;