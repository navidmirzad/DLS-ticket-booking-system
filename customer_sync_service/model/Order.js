import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true
  },
  mysql_id: {
    type: Number,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true
  },
  tickets: [{
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SyncTicket',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  tickets_bought: {
    type: Number,
    required: true,
    min: 1
  },
  total_price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  deleted_at: Date
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Index for efficient lookups
orderSchema.index({ order_id: 1 });
orderSchema.index({ mysql_id: 1 });
orderSchema.index({ email: 1 });

// Pre-save middleware to calculate tickets_bought
orderSchema.pre('save', function(next) {
  if (this.tickets && this.tickets.length > 0) {
    this.tickets_bought = this.tickets.reduce((total, item) => total + item.quantity, 0);
  }
  next();
});

// Use a different model name for sync service
const SyncOrder = mongoose.model("SyncOrder", orderSchema);
export default SyncOrder; 