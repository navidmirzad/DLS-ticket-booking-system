import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, User, Calendar, Download, MapPin, Clock } from 'lucide-react';
import { getEvents } from '../services/api';  // Fetch events from the API
import { formatShortDate, formatTime, getDayOfMonth, getDayOfWeek, getMonth } from '../utils/dateUtils';

const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState<any[]>([]);  // State to store all events
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all events for the user (upcoming and past)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await getEvents();
        setEvents(response.data || []); // Assuming the response has a 'data' array
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Split the events into upcoming and past based on the current date
  const currentDate = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) > currentDate);
  const pastEvents = events.filter(event => new Date(event.date) <= currentDate);

  const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
      <div className="bg-primary py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-text">My Account</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                  className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-24"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
              >
                <div className="p-6 border-b border-neutral-100">
                  <div className="flex items-center">
                    <div className="bg-primary rounded-full p-3 mr-4">
                      <User className="h-6 w-6 text-accent" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-text">John Doe</h2>
                      <p className="text-sm text-neutral-500">john.doe@example.com</p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <nav className="space-y-1">
                    <button
                        className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                            activeTab === 'upcoming'
                                ? 'bg-accent text-white'
                                : 'text-text hover:bg-neutral-100'
                        }`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                      <Calendar className="h-5 w-5 mr-3" strokeWidth={1.5} />
                      Upcoming Events
                    </button>
                    <button
                        className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                            activeTab === 'past'
                                ? 'bg-accent text-white'
                                : 'text-text hover:bg-neutral-100'
                        }`}
                        onClick={() => setActiveTab('past')}
                    >
                      <Clock className="h-5 w-5 mr-3" strokeWidth={1.5} />
                      Past Events
                    </button>
                  </nav>

                  <div className="border-t border-neutral-100 mt-4 pt-4">
                    <button
                        className="flex items-center w-full px-4 py-3 rounded-lg text-text hover:bg-neutral-100 transition-all duration-300"
                    >
                      <User className="h-5 w-5 mr-3" strokeWidth={1.5} />
                      Profile Settings
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 xl:col-span-3">
              <motion.div
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
              >
                <div className="p-6 border-b border-neutral-100">
                  <h2 className="text-xl font-bold text-text">
                    {activeTab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
                  </h2>
                  <p className="text-neutral-500 text-sm">
                    {activeTab === 'upcoming'
                        ? 'Your tickets for upcoming events'
                        : 'Events you have attended in the past'}
                  </p>
                </div>

                <div className="p-6">
                  {isLoading ? (
                      <div className="text-center py-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
                          <Calendar className="h-8 w-8 text-accent" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-medium text-text mb-2">Loading Events...</h3>
                      </div>
                  ) : error ? (
                      <div className="text-center py-10">
                        <p className="text-xl text-error">{error}</p>
                      </div>
                  ) : displayedEvents.length > 0 ? (
                      <div className="space-y-6">
                        {displayedEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                className="border border-neutral-200 rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <div className="grid grid-cols-1 md:grid-cols-4">
                                <div className="md:col-span-1 relative">
                                  <div className="h-full">
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        className="h-full w-full object-cover md:aspect-square"
                                    />
                                    <div className="absolute top-0 left-0 bg-white p-2 m-3 rounded-lg text-center">
                                      <div className="text-xs font-medium text-neutral-500">{getDayOfWeek(event.date)}</div>
                                      <div className="text-xl font-bold text-text">{getDayOfMonth(event.date)}</div>
                                      <div className="text-xs font-medium text-neutral-500">{getMonth(event.date)}</div>
                                    </div>
                                  </div>
                                </div>

                                <div className="md:col-span-3 p-6">
                                  <div className="mb-4">
                                    <h3 className="text-lg font-medium text-text mb-2">{event.title}</h3>
                                    <div className="flex flex-wrap gap-y-2">
                                      <div className="flex items-center text-neutral-500 text-sm mr-4">
                                        <Calendar className="h-4 w-4 mr-1" strokeWidth={1.5} />
                                        <span>{formatShortDate(event.date)}</span>
                                      </div>
                                      <div className="flex items-center text-neutral-500 text-sm mr-4">
                                        <Clock className="h-4 w-4 mr-1" strokeWidth={1.5} />
                                        <span>{formatTime(event.date)}</span>
                                      </div>
                                      <div className="flex items-center text-neutral-500 text-sm">
                                        <MapPin className="h-4 w-4 mr-1" strokeWidth={1.5} />
                                        <span>{event.venue}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                <span className="inline-block bg-primary px-3 py-1 rounded-full text-xs font-medium text-text-secondary">
                                  General Admission × 2
                                </span>
                                    </div>

                                    <div className="flex space-x-3">
                                      {activeTab === 'upcoming' && (
                                          <button className="btn btn-outline py-2 px-3 text-sm flex items-center">
                                            <Download className="h-4 w-4 mr-2" strokeWidth={1.5} />
                                            Download
                                          </button>
                                      )}

                                      <button className="btn btn-primary py-2 px-3 text-sm flex items-center">
                                        <Ticket className="h-4 w-4 mr-2" strokeWidth={1.5} />
                                        View Ticket
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                        ))}
                      </div>
                  ) : (
                      <div className="text-center py-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
                          <Calendar className="h-8 w-8 text-accent" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-medium text-text mb-2">No Events Found</h3>
                        <p className="text-neutral-600 mb-6">
                          {activeTab === 'upcoming'
                              ? "You don't have any upcoming events booked yet."
                              : "You haven't attended any events in the past."}
                        </p>
                        <button className="btn btn-primary">Browse Events</button>
                      </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AccountPage;
