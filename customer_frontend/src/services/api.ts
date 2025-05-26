import axios, { AxiosResponse as AxiosOriginalResponse } from 'axios';

type AxiosResponse<T = unknown> = AxiosOriginalResponse<T>;

const API_URL = import.meta.env.VITE_CUSTOMER_BACKEND_URL || 'http://localhost:30002';

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

export interface OrderTicket {
  ticket_id: string;
  quantity: number;
  _id?: string;
}

// Order interface from MongoDB model
export interface Order {
  _id: string;
  order_id: string;
  event_id: string;
  email: string;
  tickets_bought: OrderTicket[];
  total_price: number;
  order_status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
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
  data: T;
  error?: string;
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
  email: string,
  tickets: Array<{ ticket_id: string; quantity: number }>,
  paymentIntentId?: string
): Promise<Order> => {
  try {
    const response = await api.post<{ order: Order }>('/api/ticket', {
      eventId,
      email,
      tickets,
      payment_intent_id: paymentIntentId
    });

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

// Get user's orders
export const getMyOrders = async (): Promise<Order[]> => {
  try {
    console.log('Calling /api/orders/my-orders endpoint');
    const response: AxiosResponse<ApiResponse<Order[]>> = await api.get('/api/orders/my-orders');
    console.log('Raw response:', response);
    
    if (!response.data) {
      console.error('No data in response:', response);
      throw new Error('No data received from server');
    }

    if ('data' in response.data) {
      console.log('Orders from response:', response.data.data);
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      console.log('Orders from direct response:', response.data);
      return response.data;
    } else {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Payment related interfaces
interface CreatePaymentIntentRequest {
  amount: number;
  tickets: Array<{ ticket_id: string; quantity: number }>;
  email: string;
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

interface ConfirmPaymentRequest {
  paymentIntentId: string;
  tickets: Array<{ ticket_id: string; quantity: number }>;
  email: string;
}

interface ConfirmPaymentResponse {
  success: boolean;
  order: Order;
}

// Create a payment intent
export const createPaymentIntent = async (
  data: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> => {
  try {
    const { data: responseData } = await api.post<CreatePaymentIntentResponse>('/api/payments/create-payment-intent', data);
    return responseData;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Confirm payment and create order
export const confirmPayment = async (
  data: ConfirmPaymentRequest
): Promise<ConfirmPaymentResponse> => {
  try {
    const { data: responseData } = await api.post<ConfirmPaymentResponse>('/api/payments/confirm-payment', data);
    return responseData;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

// Checkout related interfaces
interface CreateCheckoutSessionRequest {
  amount: number;
  tickets: Array<{ ticket_id: string; quantity: number }>;
  email: string;
  eventId: string;
}

interface CreateCheckoutSessionResponse {
  url: string;
}

// Create a checkout session
export const createCheckoutSession = async (
  data: CreateCheckoutSessionRequest
): Promise<string> => {
  try {
    const response = await api.post<CreateCheckoutSessionResponse>('/api/payments/create-checkout-session', data);
    
    if (!response.data.url) {
      throw new Error('No checkout URL received');
    }
    
    return response.data.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

interface VerifyBookingSessionResponse {
  success: boolean;
  order: Order;
  error?: string;
}

// Verify booking session
export const verifyBookingSession = async (sessionId: string): Promise<VerifyBookingSessionResponse> => {
  try {
    const { data } = await api.get<VerifyBookingSessionResponse>(`/api/payments/success?session_id=${sessionId}`);
    return data;
  } catch (error) {
    console.error('Error verifying booking session:', error);
    throw error;
  }
};

export default api;