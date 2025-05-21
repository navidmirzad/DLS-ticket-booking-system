import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  tickets_bought: [{
    ticket_id: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  total_price: {
    type: Number,
    required: true,
    min: 0
  },
  order_status: {
    type: String,
    required: true,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    default: 'PENDING'
  },
  deleted_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.__type;
      return ret;
    }
  }
});

// Add pre-find middleware to automatically populate ticket and event details
orderSchema.pre(['find', 'findOne'], function() {
  this.populate({
    path: 'tickets.ticket',
    populate: {
      path: 'event',
      select: 'title date location'
    }
  });
});

const Order = mongoose.model("Order", orderSchema);
export default Order; 