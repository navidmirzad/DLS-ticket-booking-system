import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { EventType } from '../../types/eventTypes';
import { formatDate } from '../../utils/dateUtils';

interface EventCardProps {
  event: EventType;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
      <Link to={`/events/${event.id}`} className="card group">
        <div className="relative overflow-hidden aspect-[16/9]">
          <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
          <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-text">
            {event.category}
          </span>
          </div>
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
              <span>{event.venue}, {event.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Remove price as it's not part of the Event data */}
            <button className="btn btn-outline py-2 px-4">View Details</button>
          </div>
        </div>
      </Link>
  );
};

export default EventCard;
