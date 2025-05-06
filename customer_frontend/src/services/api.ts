import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:3002';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Event {
  _id: string;
  title: string,
  image: string,
  description: string,
  location: string,
  date: string,
  capacity: number,
  created_at: Date,
  tickets_available: number,
  tickets: [
    {
      price: number,
      type: string,
    },
  ],
}

// Updated Ticket interface with price information
export interface Ticket {
  _id: string;
  eventId: string;
  userId: number;
  email: string;
  purchasedAt: Date;
  price: number;
  type: string; // e.g., "General Admission", "VIP", etc.
  description?: string;
}

// Define ticket type interface for the ticket selection UI
export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  available: number;
}

// Define response types
interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

export const getEvents = async (): Promise<Event[]> => {
  try {
    const response: AxiosResponse<ApiResponse<Event[]>> = await api.get('/api/event');
    console.log('API Response:', response); // Log the response to check its structure

    // Access the events array from the `data.data` field
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('Error: Response data is not an array', response.data);
      throw new Error('Response data is not an array');
    }
  } catch (err) {
    console.error('Error fetching events:', err);
    throw err;
  }
};

export const getEventById = async (eventId: string): Promise<Event> => {
  try {
    const response: AxiosResponse<ApiResponse<Event> | Event> = await api.get(`/api/event/${eventId}`);
    console.log('Event by ID Response:', response.data); // Log the response to debug

    // Check if the response follows { data: Event } structure
    if (response.data && 'data' in response.data && response.data.data) {
      return response.data.data as Event;
    }
    // If response is directly the event object
    else if (response.data && '_id' in response.data) {
      return response.data as Event;
    }
    // If no valid event data is found
    else {
      console.error('Invalid event data structure:', response.data);
      throw new Error('Invalid event data structure');
    }
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
};

// New function to get ticket types for an event
export const getTicketTypesForEvent = async (eventId: string): Promise<TicketType[]> => {
  try {
    const response: AxiosResponse<ApiResponse<TicketType[]> | TicketType[]> =
        await api.get(`/api/event/${eventId}/ticket-types`);

    if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else {
      // If API doesn't support ticket types yet, return dummy data for now
      return [
        {
          id: 'general',
          name: 'General Admission',
          description: 'Standard entry to the event',
          price: 50,
          available: 200
        },
        {
          id: 'vip',
          name: 'VIP Access',
          description: 'Premium seating and exclusive perks',
          price: 100,
          available: 50
        },
        {
          id: 'premium',
          name: 'Premium Package',
          description: 'All-inclusive experience with backstage access',
          price: 150,
          available: 20
        }
      ];
    }
  } catch (error) {
    console.error('Error fetching ticket types:', error);
    // Return dummy data if API endpoint doesn't exist yet
    return [
      {
        id: 'general',
        name: 'General Admission',
        description: 'Standard entry to the event',
        price: 50,
        available: 200
      },
      {
        id: 'vip',
        name: 'VIP Access',
        description: 'Premium seating and exclusive perks',
        price: 100,
        available: 50
      },
      {
        id: 'premium',
        name: 'Premium Package',
        description: 'All-inclusive experience with backstage access',
        price: 150,
        available: 20
      }
    ];
  }
};

export const getTicketById = async (ticketId: string): Promise<Ticket> => {
  try {
    const response: AxiosResponse<ApiResponse<Ticket> | Ticket> = await api.get(`/api/ticket/${ticketId}`);

    // Check if response follows { data: Ticket } structure
    if (response.data && 'data' in response.data && response.data.data) {
      return response.data.data as Ticket;
    } else if (response.data && '_id' in response.data) {
      return response.data as Ticket;
    } else {
      console.error('Invalid ticket data structure:', response.data);
      throw new Error('Invalid ticket data structure');
    }
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
    throw error;
  }
};

export const getTicketsByUserId = async (userId: number): Promise<Ticket[]> => {
  try {
    const response: AxiosResponse<ApiResponse<Ticket[]> | Ticket[]> = await api.get(`/api/ticket/user/${userId}`);

    // Check if the response contains a data property
    if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
      return response.data.data as Ticket[];
    } else if (Array.isArray(response.data)) {
      return response.data as Ticket[];
    } else {
      console.error('Invalid tickets data structure:', response.data);
      throw new Error('Invalid tickets data structure');
    }
  } catch (error) {
    console.error('Error fetching tickets by user ID:', error);
    throw error;
  }
};

// Updated to include ticket type and price
export const buyTicket = async (
    eventId: string,
    userId: number,
    email: string,
    ticketTypeId: string
): Promise<Ticket> => {
  try {
    const response: AxiosResponse<ApiResponse<Ticket> | Ticket> =
        await api.post('/api/ticket', {
          eventId,
          userId,
          email,
          ticketTypeId
        });

    // Handle potential response structures
    if (response.data && 'data' in response.data && response.data.data) {
      return response.data.data as Ticket;
    } else if (response.data && '_id' in response.data) {
      return response.data as Ticket;
    } else {
      console.error('Invalid ticket purchase response:', response.data);
      throw new Error('Invalid ticket purchase response');
    }
  } catch (error) {
    console.error('Error buying ticket:', error);
    throw error;
  }
};

export const refundTicket = async (ticketId: string): Promise<void> => {
  try {
    await api.delete(`/api/ticket/${ticketId}`);
  } catch (error) {
    console.error('Error refunding ticket:', error);
    throw error;
  }
};

export default api;