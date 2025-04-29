import axios from 'axios';

const API_URL = 'http://localhost:3002';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  capacity: number;
  created_at: Date;
}

export interface Ticket {
  _id: string;
  eventId: string;
  userId: number;
  email: string;
  purchasedAt: Date;
}

export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get('/api/event');
  return response.data;
};

export const getEventById = async (eventId: string): Promise<Event> => {
  const response = await api.get(`/api/event/${eventId}`);
  return response.data;
};

export const getTicketById = async (ticketId: string): Promise<Ticket> => {
  const response = await api.get(`/api/ticket/${ticketId}`);
  return response.data;
};

export const getTicketsByUserId = async (userId: number): Promise<Ticket[]> => {
  const response = await api.get(`/api/ticket/user/${userId}`);
  return response.data;
};

export const buyTicket = async (eventId: string, userId: number, email: string): Promise<Ticket> => {
  const response = await api.post('/api/ticket', { eventId, userId, email });
  return response.data;
};

export const refundTicket = async (ticketId: string): Promise<void> => {
  await api.delete(`/api/ticket/${ticketId}`);
};

export default api;