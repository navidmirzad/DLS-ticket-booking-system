import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  ticket_id: {
    type: String,
    required: true,
    unique: true
  },
  event_id: {
    type: String,
    required: true
  },
  ticket_price: {
    type: Number,
    required: true
  },
  deleted_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket; 