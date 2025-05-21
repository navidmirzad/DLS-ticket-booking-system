import api from './api';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  _id: string;
  ticket_id: string;
  event_id: string;
  ticket_price: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  __type?: string;
  __v?: number;
}

export const getTicketsByEvent = async (eventId: string): Promise<Ticket[]> => {
  try {
    const response = await api.get<{ data: Ticket[] }>(`/api/tickets/event/${eventId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const getTicketById = async (ticketId: string): Promise<Ticket> => {
  try {
    const response = await api.get<{ data: Ticket }>(`/api/ticket/${ticketId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
}; 