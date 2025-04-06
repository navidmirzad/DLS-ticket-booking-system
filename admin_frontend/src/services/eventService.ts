import { Event } from "../types/Event";

export const fetchEvents = async (): Promise<Event[]> => {
  const response = await fetch("http://localhost:3001/api/admin/events");

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await response.json();
  return data.data;
};
