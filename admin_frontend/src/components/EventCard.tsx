import { Event } from "../types/Event";
import { Link } from "react-router-dom"
import { handleDelete } from "../services/eventService";

interface Props {
  event: Event;
}

const EventCard = ({ event }: Props) => {

  return (
    <div className="bg-gray-500 rounded-2xl p-4">
      <img src={event.image || "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg"} alt={event.name} className="w-full h-40 object-cover rounded-md mb-4" />
      <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
      <p className="text-gray-800">
        <span className="font-medium">Date & Time:</span> {new Date(event.date).toLocaleString()}
      </p>
      <p className="text-gray-800">
        <span className="font-medium">Location:</span> {event.location}
      </p>
      <div className="flex gap-2 flex-wrap mt-4">
      <Link to={`/events/${event.id}`} className="bg-gray-900 text-white px-4 py-4 rounded">
          View
        </Link>
        <Link to={`/events/${event.id}/edit`} className="bg-gray-900 text-white px-4 py-4 rounded">
          Edit
        </Link>
        <button className="text-white px-4 py-2 rounded" onClick={() => handleDelete(event.id)}>
          Delete Event
        </button>
      </div>
    </div>
  );
};

export default EventCard;
