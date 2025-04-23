import { Event } from "../types/Event";

export const fetchEvents = async (): Promise<Event[]> => {
  const response = await fetch("http://localhost:3001/api/admin/events");

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await response.json();
  return data.data;
};

export const fetchEventById = async (id: string): Promise<Event> => {
  const response = await fetch(`http://localhost:3001/api/admin/events/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }

  const data = await response.json();
  return data.data;
};

export const handleDelete = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:3001/api/admin/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
    console.log('Event deleted successfully');
    alert('Event deleted successfully');
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
};