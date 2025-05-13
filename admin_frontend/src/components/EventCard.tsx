import { Event } from "../types/Event";
import { Link } from "react-router-dom"
import { handleDelete } from "../services/eventService";

interface Props {
  event: Event;
}

const EventCard = ({ event }: Props) => {
  return (
    <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden h-full flex flex-col transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="h-56">
        <img 
          src={event.image || "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg"} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-5">
        <h2 className="text-xl font-bold text-white mb-4">{event.title}</h2>
        
        <div className="space-y-3 mb-5">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-300">{new Date(event.date).toLocaleDateString()} | {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-300">{event.location}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-gray-300">Capacity: {event.capacity}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span className="text-gray-300">Tickets Available: {event.tickets_available}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-5 border-t border-gray-700">
        <div className="flex gap-3">
          <Link to={`/events/${event.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex-1 text-center hover:bg-blue-700 transition-colors">
            View
          </Link>
          <Link to={`/events/${event.id}/edit`} className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium flex-1 text-center hover:bg-gray-600 transition-colors">
            Edit
          </Link>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium flex-1 text-center hover:bg-red-700 transition-colors" onClick={() => handleDelete(event.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
