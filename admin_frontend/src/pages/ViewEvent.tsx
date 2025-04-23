import { useParams } from "react-router-dom";
import { fetchEventById } from "../services/eventService";
import { useEffect, useState } from "react";
import { Event } from "../types/Event";

const ViewEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchEventById(id)
      .then(setEvent)
      .catch((error) => {
        console.error("Failed to fetch event:", error);
      });
  }, [id]); 
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">{event?.title}</h2>
      <p className="mb-2">{event?.description}</p>
      <p className="text-gray-600">
        <strong>Date:</strong> {event?.date ? new Date(event.date).toLocaleDateString() : "N/A"}
      </p>
      <p className="text-gray-600">
        <strong>Location:</strong> {event?.location}
      </p>
      <p className="text-gray-600">
        <strong>Capacity:</strong> {event?.capacity}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Created At:</strong> {event?.created_at ? new Date(event?.created_at).toLocaleString() : "N/A"}
      </p>
    </div>
  );
};
  

export default ViewEvent;
