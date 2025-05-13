import axios from 'axios';

type AxiosResponse<T = unknown> = {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: Record<string, unknown>;
};

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
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Event interface based on MongoDB model
export interface Event {
  _id: string;
  id: string;
  tickets_available: number;
  title: string;
  image?: string;
  date: string;
  description: string;
  location: string;
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
    title: event.title,
    description: event.description,
    location: event.location,
    date: event.date,
    capacity: event.tickets_available,
    image: event.image,
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

    // Process the response - now we'll just return a single standard ticket type
    // since we've removed ticket types from the system
    return [
      {
        id: 'standard',
        name: 'Standard Admission',
        description: 'Regular entry ticket',
        price: 50,
        available: 100
      }
    ];
  } catch (error) {
    console.error('Error fetching ticket types:', error);
    // Return fallback data for development
    return [
      {
        id: 'standard',
        name: 'Standard Admission',
        description: 'Regular entry ticket',
        price: 50,
        available: 100
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
    ticketsBought: Array<{ ticketId: string; quantity: number }>,
): Promise<Order> => {
  try {

    // Expect the specific BuyTicketResponsePayload structure from the backend
    const response: AxiosResponse<BuyTicketResponsePayload> = 
        await api.post('/api/ticket', {
          eventId: eventId,
          quantity: ticketsBought[0].quantity,
          email: email,
          userId: userId
        });

    // Return the order data from the response
    return response.data.order;
  } catch (error) {
    console.error('Error buying ticket:', error);
    throw error;
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