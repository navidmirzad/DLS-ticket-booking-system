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
    <div className="max-w-2xl mx-auto p-4">
      {event?.image && (
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
          }}
        />
      )}
      <h2 className="text-2xl font-bold mb-4">{event?.name}</h2>
      <p className="mb-4 text-gray-700">{event?.description}</p>
      <div className="space-y-2">
        <p className="text-gray-600">
          <strong>Date & Time:</strong>{" "}
          {event?.date ? new Date(event.date).toLocaleString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : "N/A"}
        </p>
        <p className="text-gray-600">
          <strong>Location:</strong> {event?.location}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Created At:</strong>{" "}
          {event?.created_at ? new Date(event.created_at).toLocaleString() : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ViewEvent;
