import { Event } from "../types/Event";
import EventCard from "./EventCard";

interface Props {
  events: Event[];
}

const EventList = ({ events }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <button className="mt-4 text-white px-4 py-2 rounded bg-green-600 self-start">
        <a href="#">Create Event</a>
      </button>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
