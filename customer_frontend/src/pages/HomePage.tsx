import React from 'react';
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
  Ticket
} from 'lucide-react';
import { featuredEvents } from '../data/eventData';
import EventCard from '../components/events/EventCard';
import SearchBar from '../components/common/SearchBar';

const HomePage: React.FC = () => {
  const categories = [
    { id: 'concert', name: 'Concerts', icon: <Music className="h-6 w-6" strokeWidth={1.5} /> },
    { id: 'sports', name: 'Sports', icon: <Trophy className="h-6 w-6" strokeWidth={1.5} /> },
    { id: 'theater', name: 'Theater', icon: <Theater className="h-6 w-6" strokeWidth={1.5} /> },
    { id: 'conference', name: 'Conferences', icon: <Users className="h-6 w-6" strokeWidth={1.5} /> },
    { id: 'food', name: 'Food & Drink', icon: <Utensils className="h-6 w-6" strokeWidth={1.5} /> }
  ];
  
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">How It Works</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Booking tickets has never been easier. Follow these simple steps to secure your spot at the events you love.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-accent">
                <Search className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-text mb-3">Find Your Event</h3>
              <p className="text-neutral-600">
                Browse through thousands of events or use our smart search to find exactly what you're looking for.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-accent">
                <Calendar className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-text mb-3">Select Your Tickets</h3>
              <p className="text-neutral-600">
                Choose from different ticket options and select the best seats available for your budget.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-accent">
                <Ticket className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-text mb-3">Secure Your Booking</h3>
              <p className="text-neutral-600">
                Complete your purchase securely and receive your e-tickets instantly via email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-accent to-text-secondary section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Amazing Events?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of event-goers and never miss out on your favorite events again.
            </p>
            <Link to="/events" className="btn bg-white text-accent hover:bg-neutral-100 transition-all duration-300">
              Explore Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;