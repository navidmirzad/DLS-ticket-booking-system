import { Event } from "../types/Event";

interface Props {
  event: Event;
}

const EventCard = ({ event }: Props) => {
  return (
    <div className="bg-gray-500 rounded-2xl p-4">
      <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
      <p className="text-gray-800">
        <span className="font-medium">Date & Time:</span> {new Date(event.date).toLocaleString()}
      </p>
      <p className="text-gray-800">
        <span className="font-medium">Location:</span> {event.location}
      </p>
      <div className="flex gap-2 flex-wrap mt-4">
        <button className="text-white px-4 py-2 rounded bg-blue-600">
          <a href="#">View Event</a>
        </button>
        <button className="text-white px-4 py-2 rounded bg-yellow-600">
          <a href="#">Edit Event</a>
        </button>
        <button className="text-white px-4 py-2 rounded bg-red-600">
          <a href="#">Delete Event</a>
        </button>
      </div>
    </div>
  );
};

export default EventCard;
