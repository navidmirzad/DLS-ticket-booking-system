// eventTypes.ts

export interface Event {
  _id: string;         // MongoDB ObjectId for the event
  title: string;
  description: string;
  location: string;
  date: string;        // Date in string format, as it's coming from backend as ISO string
  capacity: number;
  created_at: string;  // Date in string format, same as above
}

export interface Ticket {
  _id: string;         // MongoDB ObjectId for the ticket
  eventId: string;     // Event ID which should match Event _id (MongoDB ObjectId)
  userId: number;
  email: string;
  purchasedAt: string; // Date in string format (ISO string)
}

export type EventType = {
  id: string;          // A unique identifier for the event, corresponds to _id in MongoDB
  title: string;
  category: string;
  date: string;        // Date in string format
  venue: string;
  location: string;
  imageUrl: string;
  description: string;
  featured: boolean;
  tags: string[];
  availableTickets: number;
};

export type TicketType = {
  id: string;          // A unique identifier for the ticket, corresponds to _id in MongoDB
  name: string;
  price: number;       // Ticket price
  description: string;
  available: number;   // Number of available tickets
  maxPerOrder: number; // Max tickets per order
};

export type CategoryType = {
  id: string;   // Unique identifier for the category
  name: string;
  icon: string; // Icon related to the category
};
