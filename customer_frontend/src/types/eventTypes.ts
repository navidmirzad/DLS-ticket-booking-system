// types/eventTypes.ts

export interface BaseModel {
  _id: string;         // MongoDB ObjectId
  created_at: string;  // Date in string format, as it's coming from backend as ISO string
  updated_at: string;  // Date in string format
  deleted_at: string | null; // Tombstone pattern - null if not deleted
}

export interface EventDescription {
  event_desc_id: string;
  event_name: string;
  event_image: string;
  event_date: string;
  event_description: string;
  event_location: string;
}

export interface Event extends BaseModel {
  event_id: string;
  event_description: EventDescription | string; // Could be the ID or the embedded object
  tickets_available: number;
}

export interface Ticket extends BaseModel {
  ticket_id: string;
  event_id: string;
  ticket_price: number;
  ticket_type: "STANDARD" | "VIP" | "EARLY_BIRD" | "GROUP";
}

export interface Order extends BaseModel {
  order_id: string;
  email: string;
  tickets_bought: Array<{
    ticket_id: string;
    quantity: number;
  }>;
  total_price: number;
  order_status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

export interface User extends BaseModel {
  user_id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "EVENT_MANAGER";
}