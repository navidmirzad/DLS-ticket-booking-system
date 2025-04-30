import { Event } from "../types/Event";

const ADMIN_BACKEND_URL = "http://localhost:3001/api/admin";

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
