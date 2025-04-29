import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Search } from 'lucide-react';
import { EventType } from '../types/eventTypes';
import EventCard from '../components/events/EventCard';
import { getEvents } from '../services/api';

const EventsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Start with an empty array instead of static 'events'
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);  // Empty initially
  const [searchQuery, setSearchQuery] = useState(queryParams.get('query') || '');
  const [selectedCategory, setSelectedCategory] = useState(queryParams.get('category') || '');
  const [selectedLocation, setSelectedLocation] = useState(queryParams.get('location') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await getEvents();
        console.log('Raw response:', response);  // Log the response here

        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          const transformedEvents = response.data.map(event => ({
            id: event._id,
            title: event.title,
            category: 'General', // Adjust this if needed
            date: new Date(event.date).toISOString(),
            venue: event.location,
            location: event.location,
            imageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', // Placeholder image
            description: event.description,
            featured: false,
            tags: ['Event'],
            availableTickets: event.capacity,
          }));
          setFilteredEvents(transformedEvents);  // Set the transformed data to state
        } else {
          console.error('Expected an array, but got:', response.data);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search params
  useEffect(() => {
    let filtered = [...filteredEvents];

    const query = queryParams.get('query');
    const category = queryParams.get('category');
    const dateStr = queryParams.get('date');
    const locationParam = queryParams.get('location');

    if (query) {
      setSearchQuery(query);
      filtered = filtered.filter(event =>
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (category) {
      setSelectedCategory(category);
      filtered = filtered.filter(event =>
          event.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (dateStr) {
      const date = new Date(dateStr);
      const dateOnly = date.toISOString().split('T')[0];

      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        const eventDateOnly = eventDate.toISOString().split('T')[0];
        return eventDateOnly === dateOnly;
      });
    }

    if (locationParam) {
      setSelectedLocation(locationParam);
      filtered = filtered.filter(event =>
          event.location.toLowerCase().includes(locationParam.toLowerCase()) ||
          event.venue.toLowerCase().includes(locationParam.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [location.search, queryParams, filteredEvents]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedLocation) params.append('location', selectedLocation);

    navigate(`/events?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLocation('');
    navigate('/events');
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Get all unique locations
  const locations = Array.from(new Set(filteredEvents.map(event => event.location)));

  return (
      <div className="bg-primary py-12">
        <div className="container-custom">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-text mb-3">Discover Events</h1>
            <p className="text-text-secondary">Find and book tickets for amazing events near you</p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="input pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                      type="button"
                      onClick={toggleFilter}
                      className="flex items-center px-4 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-all duration-300"
                  >
                    <Filter className="h-5 w-5 mr-2 text-text-secondary" />
                    <span>Filter</span>
                    <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <button type="submit" className="btn btn-primary">
                    Search
                  </button>
                </div>
              </div>

              {isFilterOpen && (
                  <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-neutral-100 pt-4 mt-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                        <select
                            className="input"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          <option value="">All Categories</option>
                          {/* Render category options here */}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
                        <select
                            className="input"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                          <option value="">All Locations</option>
                          {locations.map(location => (
                              <option key={location} value={location}>
                                {location}
                              </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button type="button" onClick={clearFilters} className="text-neutral-500 hover:text-text-secondary mr-4">
                        Clear Filters
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Apply Filters
                      </button>
                    </div>
                  </motion.div>
              )}
            </form>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-neutral-600">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            </p>
          </div>

          {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-text-secondary">Loading events...</p>
              </div>
          ) : error ? (
              <div className="text-center py-16">
                <p className="text-2xl font-medium text-error mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                  Try Again
                </button>
              </div>
          ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                ))}
              </div>
          ) : (
              <div className="text-center py-16">
                <p className="text-2xl font-medium text-text mb-4">No events found</p>
                <p className="text-neutral-600 mb-6">Try adjusting your search criteria or browse all events</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  View All Events
                </button>
              </div>
          )}
        </div>
      </div>
  );
};

export default EventsPage;
