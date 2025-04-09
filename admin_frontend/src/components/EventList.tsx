import { Event } from "../types/Event";
import EventCard from "./EventCard";
import { Link } from "react-router-dom"

interface Props {
  events: Event[];
}

const EventList = ({ events }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <Link to={"/create-event"} className="bg-gray-900 text-white px-4 py-4 rounded flex justify-center">
        Create Event
      </Link>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
