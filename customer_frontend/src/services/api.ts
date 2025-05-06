// src/services/api.ts
import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:3002';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Event interface based on MongoDB model
export interface Event {
  _id: string;
  event_id: string;
  tickets_available: number;
  event_description: {
    event_desc_id: string;
    event_name: string;
    event_image?: string;
    event_date: string;
    event_description: string;
    event_location: string;
  };
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  __type?: string;
}

// Simplified Event interface for component usage
export interface SimpleEvent {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  capacity: number;
  image?: string;
  created_at?: string;
}

// Ticket interface from MongoDB model
export interface Ticket {
  _id: string;
  ticket_id: string;
  event_id: string;
  ticket_price: number;
  ticket_type: 'STANDARD' | 'VIP' | 'EARLY_BIRD' | 'GROUP';
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  __type?: string;
}

// Order interface from MongoDB model
export interface Order {
  _id: string;
  order_id: string; // This is the UUID for the order
  email: string;
  tickets_bought: string[]; // <-- CORRECTED: Now an array of ticket_id strings (UUIDs of created Ticket documents)
  total_price: number;
  order_status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  __type?: string;
}

interface BuyTicketResponsePayload {
  tickets: Ticket[]; // Your existing Ticket interface should work for the items in this array
  order: Order;    // Your (now updated) Order interface
}

// User interface from MongoDB model
export interface User {
  _id: string;
  user_id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'EVENT_MANAGER';
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  __type?: string;
}

// Define ticket type interface for the ticket selection UI
export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  available: number;
  ticket_type: 'STANDARD' | 'VIP' | 'EARLY_BIRD' | 'GROUP';
}

// API response type
interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

// Helper function to map the complex Event object to a simpler structure
const mapEventToSimpleEvent = (event: Event): SimpleEvent => {
  return {
    _id: event._id,
    title: event.event_description.event_name,
    description: event.event_description.event_description,
    location: event.event_description.event_location,
    date: event.event_description.event_date,
    capacity: event.tickets_available,
    image: event.event_description.event_image,
    created_at: event.created_at
  };
};

// Get all events
export const getEvents = async (): Promise<SimpleEvent[]> => {
  try {
    const response: AxiosResponse<ApiResponse<Event[]> | Event[]> = await api.get('/api/event');

    if (response.data && Array.isArray(response.data)) {
      return response.data.map(mapEventToSimpleEvent);
    } else if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
      return response.data.data.map(mapEventToSimpleEvent);
    } else {
      console.error('Unexpected response format:', response.data);
      throw new Error('Unexpected response format');
    }
  } catch (err) {
    console.error('Error fetching events:', err);
    throw err;
  }
};

// Get event by ID
export const getEventById = async (eventId: string): Promise<SimpleEvent> => {
  try {
    const response: AxiosResponse<ApiResponse<Event> | Event> = await api.get(`/api/event/${eventId}`);

    if (response.data && 'data' in response.data && response.data.data) {
      return mapEventToSimpleEvent(response.data.data);
    } else if (response.data && '_id' in response.data) {
      return mapEventToSimpleEvent(response.data);
    } else {
      console.error('Invalid event data structure:', response.data);
      throw new Error('Invalid event data structure');
    }
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
};

// Get ticket types for an event
export const getTicketTypesForEvent = async (eventId: string): Promise<TicketType[]> => {
  try {
    const response: AxiosResponse<ApiResponse<Ticket[]> | Ticket[]> =
        await api.get(`/api/event/${eventId}/ticket-types`);

    // Log the raw response to understand the structure
    console.log('Raw ticket types response:', response.data);

    // Try to process the response data appropriately
    if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
      // If we have a proper data structure with valid ticket objects
      return response.data.data.map((ticket: Ticket) => ({
        id: ticket._id || `fallback-${Math.random().toString(36).substring(2, 9)}`,
        name: ticket.ticket_type || 'Standard Ticket',
        description: `${ticket.ticket_type || 'Standard'} ticket`,
        price: ticket.ticket_price || 50,
        available: 100, // Adjust as needed
        ticket_type: ticket.ticket_type || 'STANDARD'
      }));
    } else if (Array.isArray(response.data)) {
      // If the data is directly an array
      return response.data.map((ticket: Ticket) => ({
        id: ticket._id || `fallback-${Math.random().toString(36).substring(2, 9)}`,
        name: ticket.ticket_type || 'Standard Ticket',
        description: `${ticket.ticket_type || 'Standard'} ticket`,
        price: ticket.ticket_price || 50,
        available: 100,
        ticket_type: ticket.ticket_type || 'STANDARD'
      }));
    } else {
      // If the API doesn't return valid data, use fallback values
      console.warn('Using fallback ticket types due to invalid API response');
      return [
        {
          id: 'standard',
          name: 'Standard Admission',
          description: 'Regular entry ticket',
          price: 50,
          available: 100,
          ticket_type: 'STANDARD'
        },
        {
          id: 'vip',
          name: 'VIP Access',
          description: 'Premium experience with exclusive perks',
          price: 150,
          available: 20,
          ticket_type: 'VIP'
        }
      ];
    }
  } catch (error) {
    console.error('Error fetching ticket types:', error);
    // Return fallback data for development
    return [
      {
        id: 'standard',
        name: 'Standard Admission',
        description: 'Regular entry ticket',
        price: 50,
        available: 100,
        ticket_type: 'STANDARD'
      },
      {
        id: 'vip',
        name: 'VIP Access',
        description: 'Premium experience with exclusive perks',
        price: 150,
        available: 20,
        ticket_type: 'VIP'
      }
    ];
  }
};

// Get ticket by ID
export const getTicketById = async (ticketId: string): Promise<Ticket> => {
  try {
    const response: AxiosResponse<ApiResponse<Ticket> | Ticket> = await api.get(`/api/ticket/${ticketId}`);

    if (response.data && 'data' in response.data && response.data.data) {
      return response.data.data;
    } else if (response.data && '_id' in response.data) {
      return response.data;
    } else {
      console.error('Invalid ticket data structure:', response.data);
      throw new Error('Invalid ticket data structure');
    }
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
    throw error;
  }
};

// Get tickets by user ID
export const getTicketsByUserId = async (userId: string): Promise<Order[]> => {
  try {
    const response: AxiosResponse<ApiResponse<Order[]> | Order[]> = await api.get(`/api/ticket/user/${userId}`);

    if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('Invalid tickets data structure:', response.data);
      throw new Error('Invalid tickets data structure');
    }
  } catch (error) {
    console.error('Error fetching tickets by user ID:', error);
    throw error;
  }
};

// Buy a ticket
export const buyTicket = async (
    eventId: string,
    userId: string,
    email: string,
    ticketsBought: Array<{ ticketId: string; quantity: number }>, // ticketId here is selectedTicketType.name
): Promise<Order> => { // The function is still expected to return the created Order
  try {
    // Expect the specific BuyTicketResponsePayload structure from the backend
    const response: AxiosResponse<BuyTicketResponsePayload> = // <-- TYPE CHANGED
        await api.post('/api/ticket', { // Your baseURL is http://localhost:3002, so this calls http://localhost:3002/api/ticket
          eventId: eventId,
          ticketsBought: ticketsBought,
          email: email,
          userId: userId
        });

    // NEW PARSING LOGIC: Access the 'order' object from response.data
    if (response.data && response.data.order && response.data.order._id) {
      return response.data.order; // Success: return the order object
    } else {
      // This case would mean the backend response structure is not { tickets: [], order: {_id: ...} }
      console.error('Invalid ticket purchase response structure from backend:', response.data);
      throw new Error('Invalid ticket purchase response: "order" field missing, malformed, or lacks _id.');
    }
  } catch (error) {
    throw new Error('Failed to complete ticket purchase. Please try again later.');
  }
};

// Refund a ticket
export const refundTicket = async (ticketId: string): Promise<void> => {
  try {
    await api.delete(`/api/ticket/${ticketId}`);
  } catch (error) {
    console.error('Error refunding ticket:', error);
    throw error;
  }
};

export default api;