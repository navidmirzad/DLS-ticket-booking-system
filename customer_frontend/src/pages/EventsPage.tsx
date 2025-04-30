// EventsPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Event } from '../services/api';  // Import Event model
import EventCard from '../components/events/EventCard';
import { getEvents } from '../services/api';

const EventsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [events, setEvents] = useState<Event[]>([]);  // Store events fetched from the API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await getEvents();  // Fetch the events
        setEvents(response);  // Set the events if fetched successfully
      } catch (err) {
        setError('Failed to fetch events');
        console.error('Error fetching events:', err);
      } finally {
        setIsLoading(false);  // Set loading state to false when done
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchQuery = queryParams.get('query') || '';
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);

    navigate(`/events?${params.toString()}`);
  };

  return (
      <div className="bg-primary py-12">
        <div className="container-custom">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-text mb-3">Discover Events</h1>
            <p className="text-text-secondary">Find and book tickets for amazing events near you</p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="input pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn btn-primary">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Loading or Error State */}
          {isLoading && <div>Loading...</div>}
          {error && <div>{error}</div>}

          {/* Display Events */}
          {!isLoading && !error && events.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                    <motion.div
                        key={event._id}  // Use _id as the key
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                ))}
              </div>
          )}

          {/* If no events found */}
          {!isLoading && !error && events.length === 0 && (
              <div className="text-center py-16">
                <p className="text-2xl font-medium text-text mb-4">No events found</p>
                <p className="text-neutral-600 mb-6">Try adjusting your search criteria or browse all events</p>
              </div>
          )}
        </div>
      </div>
  );
};

export default EventsPage;
