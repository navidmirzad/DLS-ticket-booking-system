import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Search,
  ArrowRight,
  Music,
  Trophy,
  Theater,
  Users,
  Utensils,
} from 'lucide-react';
import EventCard from '../components/events/EventCard';
import SearchBar from '../components/common/SearchBar';
import AuthModal from '../components/auth/AuthModal';
import { getEvents } from '../services/api';  // Import API function to fetch events

const HomePage: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState([]);  // State to hold the featured events
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'concert', name: 'Concerts', icon: <Music className="h-6 w-6" strokeWidth={1.5} /> },
    { id: 'sports', name: 'Sports', icon: <Trophy className="h-6 w-6" strokeWidth={1.5} /> },
    { id: 'theater', name: 'Theater', icon: <Theater className="h-6 w-6" strokeWidth={1.5} /> },
    { id: 'conference', name: 'Conferences', icon: <Users className="h-6 w-6" strokeWidth={1.5} /> },
    { id: 'food', name: 'Food & Drink', icon: <Utensils className="h-6 w-6" strokeWidth={1.5} /> }
  ];

  // Fetch featured events when the component is mounted
  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setIsLoading(true);
        const response = await getEvents();
        console.log('Fetched events:', response);

        // If response.data is an array, you can set it to featuredEvents
        if (Array.isArray(response.data)) {
          setFeaturedEvents(response.data);
        } else {
          setError('Failed to load featured events.');
        }
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

            <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
              {categories.map((category, index) => (
                  <Link
                      key={category.id}
                      to={`/events?category=${category.id}`}
                      className="bg-white rounded-xl p-4 text-center shadow-sm border border-neutral-100 hover:shadow-md hover:border-secondary transition-all duration-300"
                  >
                    <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-accent">
                      {category.icon}
                    </div>
                    <h3 className="font-medium text-text">{category.name}</h3>
                  </Link>
              ))}
            </motion.div>
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
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredEvents.map((event, index) => (
                      <motion.div
                          key={event._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <EventCard event={event} /> {/* Display event without pricing */}
                      </motion.div>
                  ))}
                </div>
            )}
          </div>
        </section>

        <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
  );
};

export default HomePage;
// Note: The above code assumes that the API response for events is an array of event objects.