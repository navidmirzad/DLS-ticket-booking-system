import { Event } from "../types/Event";
import EventCard from "./EventCard";
import { Link } from "react-router-dom"

interface Props {
  events: Event[];
}

const EventList = ({ events }: Props) => {
  return (
    <div className="container mx-auto px-6">
      <div className="mb-8">
        <Link to={"/create-event"} className="bg-gray-800 text-white px-6 py-3 rounded-lg flex justify-center items-center w-full md:w-48 hover:bg-gray-700 transition-colors">
          <span className="mr-2">+</span> Create Event
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      {events.length === 0 && (
         <div className="text-center text-gray-500">No events found</div>
       )}
    </div>
  );
};

export default EventList;
