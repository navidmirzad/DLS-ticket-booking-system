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

