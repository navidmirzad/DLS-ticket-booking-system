import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    id: Number,
    user_id: Number,
    event: {
        id: Number,
        title: String,
        location: String,
        date: Date
    },
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket