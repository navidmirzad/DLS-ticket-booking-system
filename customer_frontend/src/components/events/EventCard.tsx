// EventCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { Event } from '../../services/api';  // Importing Event model
import { formatDate } from '../../utils/dateUtils';

interface EventCardProps {
  event: Event;  // Use Event directly here
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
      <Link to={`/events/${event._id}`} className="card group">
        <div className="relative overflow-hidden aspect-[16/9]">
          <img
              src={event.image || "https://images.com/photos/1105666/pexels-photo-1105666.jpeg"}  // Placeholder image
              alt={event.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-5">
          <h3 className="text-lg font-medium text-text mb-2 group-hover:text-accent transition-colors duration-300">
            {event.title}
          </h3>

          <div className="mb-4 space-y-2">
            <div className="flex items-center text-neutral-500 text-sm">
              <Calendar className="h-4 w-4 mr-2" strokeWidth={1.5} />
              <span>{formatDate(event.date)}</span>
            </div>

            <div className="flex items-center text-neutral-500 text-sm">
              <MapPin className="h-4 w-4 mr-2" strokeWidth={1.5} />
              <span>{event.location}</span>  {/* Displaying location */}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button className="btn btn-outline py-2 px-4">View Details</button>
          </div>
        </div>
      </Link>
  );
};

export default EventCard;
