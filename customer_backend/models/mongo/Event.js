import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  location: String,
  date: Date,
  capacity: Number,
  created_at: Date,
  tickets_available: Number,
  tickets: [
    {
      price: Number,
      type: String,
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
