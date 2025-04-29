import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Share,
  Heart,
  Info,
  Tag,
  Plus,
  Minus
} from 'lucide-react';
import { getEventById } from '../services/api';
import { EventType } from '../types/eventTypes';
import { formatDate, formatShortDate, formatTime } from '../utils/dateUtils';
import EventCard from '../components/events/EventCard';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await getEventById(id);

        // Transform backend event to match frontend EventType
        const transformedEvent: EventType = {
          id: response._id,
          title: response.title,
          category: 'General',
          date: new Date(response.date).toISOString(),
          venue: response.location,
          location: response.location,
          imageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', // Placeholder image
          description: response.description,
          featured: false,
          tags: ['Event'],
          availableTickets: response.capacity,
        };

        setEvent(transformedEvent);
      } catch (err) {
        setError('Failed to fetch event details');
        console.error('Error fetching event:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // We don't use price anymore since it's not in the backend model
  const ticketTypes = [
    {
      id: 't1',
      name: 'General Admission',
      description: 'Standard entry to the event',
      available: 200
    },
    {
      id: 't2',
      name: 'VIP Access',
      description: 'Premium seating and exclusive perks',
      available: 50
    },
    {
      id: 't3',
      name: 'Premium Package',
      description: 'All-inclusive experience with backstage access',
      available: 20
    }
  ];

  const handleTicketChange = (amount: number) => {
    const newAmount = selectedTickets + amount;
    setSelectedTickets(Math.max(0, Math.min(10, newAmount)));
  };

  const handleBookNow = () => {
    if (selectedTickets > 0 && event) {
      navigate(`/booking/${event.id}?tickets=${selectedTickets}`);
    }
  };

  if (isLoading) {
    return (
        <div className="bg-primary min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading event details...</p>
          </div>
        </div>
    );
  }

  if (error || !event) {
    return (
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-text mb-4">Event Not Found</h1>
          <p className="text-text-secondary mb-8">
            {error || "The event you're looking for doesn't exist or has been removed."}
          </p>
          <Link to="/events" className="btn btn-primary">
            Browse Events
          </Link>
        </div>
    );
  }

  return (
      <div className="bg-primary">
        {/* Hero Section */}
        <div
            className="relative bg-cover bg-center h-96 md:h-[500px]"
            style={{ backgroundImage: `url(${event.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="container-custom relative z-10 h-full flex flex-col justify-end pb-12">
            <div className="text-white">
              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map((tag) => (
                    <span key={tag} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                  {tag}
                </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{event.title}</h1>
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-white/80">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" strokeWidth={1.5} />
                  <span>{formatShortDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" strokeWidth={1.5} />
                  <span>{formatTime(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" strokeWidth={1.5} />
                  <span>{event.venue}, {event.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Event Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-text">Event Details</h2>
                  <div className="flex space-x-3">
                    <button className="p-2 rounded-full hover:bg-primary transition-all duration-300">
                      <Share className="h-5 w-5 text-text-secondary" strokeWidth={1.5} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-primary transition-all duration-300">
                      <Heart className="h-5 w-5 text-text-secondary" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                <div className="prose max-w-none text-neutral-700 leading-relaxed">
                  <p className="mb-6 text-lg">{event.description}</p>

                  <div className="border-t border-neutral-100 pt-6 mt-6">
                    <h3 className="flex items-center text-lg font-medium text-text mb-4">
                      <Info className="h-5 w-5 mr-2 text-accent" strokeWidth={1.5} />
                      Event Information
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 mr-3 mt-0.5 text-text-secondary" strokeWidth={1.5} />
                        <div>
                          <h4 className="font-medium text-text">Date and Time</h4>
                          <p className="text-neutral-600">{formatDate(event.date)}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-3 mt-0.5 text-text-secondary" strokeWidth={1.5} />
                        <div>
                          <h4 className="font-medium text-text">Location</h4>
                          <p className="text-neutral-600">{event.venue}</p>
                          <p className="text-neutral-600">{event.location}</p>
                          <a href="#" className="text-accent hover:underline text-sm mt-1 inline-block">
                            View on map
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Tag className="h-5 w-5 mr-3 mt-0.5 text-text-secondary" strokeWidth={1.5} />
                        <div>
                          <h4 className="font-medium text-text">Category</h4>
                          <p className="text-neutral-600">{event.category}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-6 mt-6">
                    <h3 className="text-lg font-medium text-text mb-4">Additional Information</h3>
                    <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                      <li>Please arrive at least 30 minutes before the event starts</li>
                      <li>Bring a valid ID that matches the ticket purchaser's name</li>
                      <li>No professional cameras or recording equipment allowed</li>
                      <li>Food and beverages available for purchase at the venue</li>
                      <li>Event is suitable for all ages</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Selection */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-24">
                <div className="bg-accent text-white p-5">
                  <h2 className="text-xl font-medium mb-1">Tickets</h2>
                  <p className="opacity-90 text-sm">Select your tickets to proceed</p>
                </div>

                <div className="p-5">
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-neutral-600 mb-2">
                      <span>Ticket Type</span>
                      <span>Price</span>
                    </div>

                    <div className="space-y-4">
                      {ticketTypes.map((ticket) => (
                          <div
                              key={ticket.id}
                              className="border border-neutral-200 rounded-lg p-4 hover:border-accent/50 transition-all duration-300"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium text-text">{ticket.name}</h3>
                                <p className="text-sm text-neutral-500">{ticket.description}</p>
                              </div>
                              <span className="font-medium text-lg text-text">TBD</span>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-neutral-500">
                            {ticket.available} available
                          </span>

                              <div className="flex items-center">
                                <button
                                    className="p-1 rounded-lg bg-neutral-100 hover:bg-secondary transition-all duration-300"
                                    onClick={() => handleTicketChange(-1)}
                                >
                                  <Minus className="h-4 w-4 text-text" />
                                </button>
                                <span className="w-10 text-center">{selectedTickets}</span>
                                <button
                                    className="p-1 rounded-lg bg-neutral-100 hover:bg-secondary transition-all duration-300"
                                    onClick={() => handleTicketChange(1)}
                                >
                                  <Plus className="h-4 w-4 text-text" />
                                </button>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-600">Tickets</span>
                      <span className="font-medium text-text">{selectedTickets}</span>
                    </div>


                    <div className="flex justify-between mb-4">
                      <span className="text-neutral-600">Total</span>
                      <span className="font-bold text-lg text-text">TBD</span>
                    </div>

                    <button
                        className={`btn w-full ${selectedTickets > 0 ? 'btn-primary' : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'}`}
                        onClick={handleBookNow}
                        disabled={selectedTickets === 0}
                    >
                      Book Now
                    </button>

                    <p className="mt-4 text-center text-xs text-neutral-500">
                      By proceeding, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default EventDetailPage;
