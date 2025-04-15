import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    date: Date,
    capacity: Number,
    created_at: Date
});

const Event = mongoose.model("Event", eventSchema);
export default Event