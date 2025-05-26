// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  ArrowRight,
} from 'lucide-react';
import EventCard from '../components/events/EventCard';
import SearchBar from '../components/common/SearchBar';
import AuthModal from '../components/auth/AuthModal';
import { getEvents, SimpleEvent } from '../services/api';

const HomePage: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState<SimpleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch featured events when the component mounts
  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setIsLoading(true);
        const events = await getEvents();
        console.log('Fetched events:', events);

        // Take only the first 3 events to display as featured
        setFeaturedEvents(events.slice(0, 3));
      } catch (err) {
        console.error('Error fetching featured events:', err);
        setError('Failed to fetch featured events.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  return (
      <div>
        {/* Hero Section */}
        <section className="relative bg-white overflow-hidden">
          <div
              className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
              style={{
                backgroundImage: "url('https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
              }}
          />
          <div className="container-custom relative z-10 py-16 md:py-24 lg:py-32">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
              >
                Discover, Book & Enjoy Amazing Events
              </motion.h1>
              <motion.p
                  className="text-lg md:text-xl text-text-secondary mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
              >
                Find the best concerts, sports, arts, and more events near you. Secure your tickets in just a few clicks.
              </motion.p>

              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
              >
                <SearchBar />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="bg-primary section">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold text-text mb-2">Featured Events</h2>
                <p className="text-text-secondary">Don't miss out on the hottest events in town</p>
              </div>
              <Link to="/events" className="flex items-center mt-4 md:mt-0 text-accent hover:text-accent/80 font-medium transition-all duration-300">
                View all events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {isLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                  <p className="text-text-secondary">Loading featured events...</p>
                </div>
            ) : error ? (
                <div className="text-center py-16">
                  <p className="text-2xl font-medium text-error mb-4">{error}</p>
                  <button
                      onClick={() => window.location.reload()}
                      className="btn btn-primary"
                  >
                    Try Again
                  </button>
                </div>
            ) : featuredEvents.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-text-secondary">No events available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredEvents.map((event, index) => (
                      <motion.div
                          key={event._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <EventCard event={event} />
                      </motion.div>
                  ))}
                </div>
            )}
          </div>
        </section>

        {/* Event Categories */}
        <section className="bg-white section">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text mb-4">Browse by Category</h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Explore events by category to find exactly what you're looking for
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/events?category=concert" className="bg-primary rounded-xl p-6 text-center hover:shadow-md transition-all duration-300">
                <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-24 w-24 text-accent" />
                </div>
                <h3 className="font-medium text-text mb-1">Concerts</h3>
                <p className="text-sm text-text-secondary">Live music experiences</p>
              </Link>

              <Link to="/events?category=sports" className="bg-primary rounded-xl p-6 text-center hover:shadow-md transition-all duration-300">
                <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-24 w-24 text-accent" />
                </div>
                <h3 className="font-medium text-text mb-1">Sports</h3>
                <p className="text-sm text-text-secondary">Games & tournaments</p>
              </Link>

              <Link to="/events?category=arts" className="bg-primary rounded-xl p-6 text-center hover:shadow-md transition-all duration-300">
                <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-24 w-24 text-accent" />
                </div>
                <h3 className="font-medium text-text mb-1">Arts & Culture</h3>
                <p className="text-sm text-text-secondary">Exhibitions & theater</p>
              </Link>

              <Link to="/events?category=workshop" className="bg-primary rounded-xl p-6 text-center hover:shadow-md transition-all duration-300">
                <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-24 w-24 text-accent" />
                </div>
                <h3 className="font-medium text-text mb-1">Workshops</h3>
                <p className="text-sm text-text-secondary">Learn something new</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Auth Modal */}
        <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
  );
};

export default HomePage;