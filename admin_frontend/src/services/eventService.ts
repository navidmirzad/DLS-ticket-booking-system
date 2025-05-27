import { Event } from "../types/Event";

const ADMIN_BACKEND_URL = import.meta.env.VITE_ADMIN_BACKEND_URL;

type EventInput = Omit<Event, 'id' | 'created_at' | 'updated_at' | 'tickets_available' | 'tickets'>;

export const fetchEvents = async (): Promise<Event[]> => {
  const response = await fetch(`${ADMIN_BACKEND_URL}/events`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  return data.data;
};

export const fetchEventById = async (id: string): Promise<Event> => {
  const response = await fetch(`${ADMIN_BACKEND_URL}/events/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  return data.data;
};

export const createEvent = async (eventData: EventInput): Promise<string> => {
  const response = await fetch(`${ADMIN_BACKEND_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      ...eventData,
      date: new Date(eventData.date),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create event");
  }

  const data = await response.json();
  return data.data;
};

export const updateEvent = async (id: string, eventData: Partial<EventInput>): Promise<void> => {
  const response = await fetch(`${ADMIN_BACKEND_URL}/events/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      ...eventData,
      date: eventData.date ? new Date(eventData.date) : undefined,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update event");
  }
};

export const handleDelete = async (id: string) => {
  try {
    const response = await fetch(`${ADMIN_BACKEND_URL}/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    console.log("Event deleted successfully:", data);
    alert("Event deleted successfully");
    window.location.reload();
  } catch (error) {
    console.error("Failed to delete event", error);
  }
};
