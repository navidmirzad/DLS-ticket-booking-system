import { Event } from "../types/Event";
import { fetchWithAuth } from "./api";

const ADMIN_BACKEND_URL = import.meta.env.VITE_ADMIN_BACKEND_URL;

export const fetchEvents = async (): Promise<Event[]> => {
  const response = await fetchWithAuth(`${ADMIN_BACKEND_URL}/events`);
  const data = await response.json();
  return data.data;
};

export const fetchEventById = async (id: string): Promise<Event> => {
  const response = await fetchWithAuth(`${ADMIN_BACKEND_URL}/events/${id}`);
  const data = await response.json();
  return data.data;
};

export const handleDelete = async (id: string) => {
  try {
    const response = await fetchWithAuth(`${ADMIN_BACKEND_URL}/events/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    console.log("Event deleted successfully:", data);
    alert("Event deleted successfully");
    window.location.reload();
  } catch (error) {
    console.error("Failed to delete event", error);
  }
};
