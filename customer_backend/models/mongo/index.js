import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Base schema with tombstone pattern that will be applied to all models
const baseOptions = {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  discriminatorKey: "__type",
  collection: "data",
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

// Base schema definition with deleted_at field
const BaseSchema = new Schema(
  {
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  baseOptions
);

// EVENT model - now extends the BaseSchema
const EventSchema = new Schema({
  event_id: {
    type: String,
    required: true,
    unique: true,
  },
  tickets_available: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  event_description: {
    type: Schema.Types.ObjectId,
    ref: "EventDescription",
    required: true,
  },
});

// EVENT_DESCRIPTION model
const EventDescriptionSchema = new Schema({
  event_desc_id: {
    type: String,
    required: true,
    unique: true,
  },
  event_name: {
    type: String,
    required: true,
  },
  event_image: {
    type: String,
    required: false,
  },
  event_date: {
    type: Date,
    required: true,
  },
  event_description: {
    type: String,
    required: true,
  },
  event_location: {
    type: String,
    required: true,
  },
});

// TICKETS model
const TicketSchema = new Schema({
  ticket_id: {
    type: String,
    required: true,
    unique: true,
  },
  event_id: {
    type: String,
    required: true,
    ref: "Event",
  },
  ticket_price: {
    type: Number,
    required: true,
    min: 0,
  },
  ticket_type: {
    type: String,
    required: true,
    enum: ["STANDARD", "VIP", "EARLY_BIRD", "GROUP"],
  },
});

// ORDERS model
const OrderSchema = new Schema({
  order_id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    ref: "User",
  },
  tickets_bought: [
    {
      type: String,
      ref: "Ticket",
    },
  ],
  total_price: {
    type: Number,
    required: true,
    min: 0,
  },
  order_status: {
    type: String,
    required: true,
    enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
    default: "PENDING",
  },
});

// USERS model
const UserSchema = new Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["USER", "ADMIN", "EVENT_MANAGER"],
    default: "USER",
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// Methods to support the tombstone pattern
const softDeletePlugin = function (schema) {
  schema.methods.softDelete = function () {
    this.deleted_at = new Date();
    return this.save();
  };

  schema.methods.restore = function () {
    this.deleted_at = null;
    return this.save();
  };

  // Query middleware to filter out soft-deleted documents
  schema.pre("find", function () {
    this.where({ deleted_at: null });
  });

  schema.pre("findOne", function () {
    this.where({ deleted_at: null });
  });
};

// Apply the soft delete plugin to all schemas
BaseSchema.plugin(softDeletePlugin);

// Create models by extending the Base model
const Base = mongoose.model("Base", BaseSchema);
const Event = Base.discriminator("Event", EventSchema);
const EventDescription = Base.discriminator(
  "EventDescription",
  EventDescriptionSchema
);
const Ticket = Base.discriminator("Ticket", TicketSchema);
const Order = Base.discriminator("Order", OrderSchema);
const User = Base.discriminator("User", UserSchema);

export { Base, Event, EventDescription, Ticket, Order, User };
