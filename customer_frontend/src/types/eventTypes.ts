export type EventType = {
  id: string;
  title: string;
  category: string;
  date: string;
  venue: string;
  location: string;
  imageUrl: string;
  price: {
    min: number;
    max: number;
  };
  description: string;
  featured: boolean;
  tags: string[];
  availableTickets: number;
};

export type TicketType = {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
  maxPerOrder: number;
};

export type CategoryType = {
  id: string;
  name: string;
  icon: string;
};