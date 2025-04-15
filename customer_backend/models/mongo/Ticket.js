import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: Number, required: true },
    email: { type: String },
    purchasedAt: { type: Date, default: Date.now },
  });

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket