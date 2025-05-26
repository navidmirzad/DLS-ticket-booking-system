// src/pages/EventDetailPage.tsx - With improved error handling for ticket data

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Share,
  Heart,
  Info,
  Plus,
  Minus,
  AlertTriangle
} from 'lucide-react';
import {
  getEventById,
  getTicketTypesForEvent,
  SimpleEvent,
  TicketType
} from '../services/api';
import { formatDate, formatShortDate, formatTime } from '../utils/dateUtils';
import LiveEventUpdates from '../components/LiveEventUpdates';
import { useEventUpdates } from '../services/sseService';

// Safe formatting functions with fallbacks
const isValidDate = (dateString: string | Date | undefined | null): boolean => {
  if (!dateString) return false;
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    // Ignore error - just return false for invalid dates
    return false;
  }
};

const safeFormatDate = (dateString: string | Date | undefined | null): string => {
  return isValidDate(dateString) ? formatDate(String(dateString)) : "Date TBD";
};

const safeFormatShortDate = (dateString: string | Date | undefined | null): string => {
  return isValidDate(dateString) ? formatShortDate(String(dateString)) : "Date TBD";
};

const safeFormatTime = (dateString: string | Date | undefined | null): string => {
  return isValidDate(dateString) ? formatTime(String(dateString)) : "Time TBD";
};

// Default image
const DEFAULT_IMAGE = 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<SimpleEvent | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [selectedTicketType, setSelectedTicketType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticketDataError, setTicketDataError] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState(0);
  
  // Always call hook with empty string if id is undefined to avoid conditional hook call
  const { eventUpdates } = useEventUpdates(id || '');
  
  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        console.log(`Fetching event with ID: ${id}`);

        // Fetch event details
        const eventData = await getEventById(id);
        console.log('Fetched event data:', eventData);
        setEvent(eventData);

        try {
          // Fetch ticket types - handle this separately so event can still display even if tickets fail
          const ticketTypesData = await getTicketTypesForEvent(id);
          console.log('Fetched ticket types:', ticketTypesData);

          if (ticketTypesData && ticketTypesData.length > 0) {
            setTicketTypes(ticketTypesData);

            // Verify the ticket data has all required fields
            const hasValidTicketData = ticketTypesData.some(ticket =>
                ticket.id &&
                ticket.name &&
                typeof ticket.price === 'number' &&
                !isNaN(ticket.price)
            );

            if (!hasValidTicketData) {
              console.warn('Invalid ticket data structure received');
              setTicketDataError('Unable to load ticket information correctly');
            } else {
              // Set the default selected ticket type to the first valid one
              const firstValidTicket = ticketTypesData.find(t =>
                  t.id && typeof t.price === 'number' && !isNaN(t.price)
              );
              if (firstValidTicket) {
                setSelectedTicketType(firstValidTicket.id);
              }
            }
          } else {
            setTicketDataError('No ticket information available');
          }
        } catch (ticketErr) {
          console.error('Error fetching ticket types:', ticketErr);
          setTicketDataError('Failed to load ticket information');
        }

      } catch (err) {
        setError('Failed to fetch event details');
        console.error('Error fetching event:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  // Effect to update ticket availability when SSE updates are received
  useEffect(() => {
    if (eventUpdates.length > 0 && event && id) {
      // Get the most recent update
      const latestUpdate = eventUpdates[0];
      
      if (latestUpdate.type === 'TICKET_PURCHASED' && 
          typeof latestUpdate.remainingTickets === 'number') {
        // Update the event with new ticket availability
        setEvent(prevEvent => {
          if (!prevEvent) return null;
          return {
            ...prevEvent,
            // Ensure capacity is a number
            capacity: latestUpdate.remainingTickets || prevEvent.capacity
          };
        });
        
        // Also update ticket types with new availability
        setTicketTypes(prevTypes => {
          if (!prevTypes || prevTypes.length === 0) return prevTypes;
          return prevTypes.map(type => ({
            ...type,
            // Ensure available is a number
            available: latestUpdate.remainingTickets || type.available
          }));
        });
      }
    }
  }, [eventUpdates, event, id]);

  const handleTicketTypeChange = (ticketTypeId: string) => {
    setSelectedTicketType(ticketTypeId);
    // Reset ticket count when changing ticket type
    setSelectedTickets(0);
  };

  const handleTicketChange = (amount: number) => {
    const newAmount = selectedTickets + amount;
    setSelectedTickets(Math.max(0, Math.min(10, newAmount)));
  };

  const handleBookNow = () => {
    if (selectedTickets > 0 && event && selectedTicketType) {
      navigate(`/booking/${event._id}?tickets=${selectedTickets}&ticketType=${selectedTicketType}`);
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
        <div className="container-custom py-20">
          <h1 className="text-3xl font-bold text-text mb-4">Event Not Found</h1>
          <p className="text-text-secondary mb-6">
            {error || "The event you're looking for doesn't exist or has been removed."}
          </p>

          <div className="mt-6">
            <Link to="/events" className="btn btn-primary px-4 py-2 bg-accent text-white rounded-lg">
              Browse Events
            </Link>
          </div>
        </div>
    );
  }

  // Default image if none is provided in the API response
  const eventImage = event.image || DEFAULT_IMAGE;

  // Get the currently selected ticket type object
  const currentTicketType = ticketTypes.find(ticket => ticket.id === selectedTicketType);

  return (
      <div className="bg-primary">
        {/* Hero Section */}
        <div
            className="relative bg-cover bg-center h-96 md:h-[500px]"
            style={{ backgroundImage: `url(${eventImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="container-custom relative z-10 h-full flex flex-col justify-end pb-12">
            <div className="text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{event.title}</h1>
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-white/80">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" strokeWidth={1.5} />
                  <span>{safeFormatShortDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" strokeWidth={1.5} />
                  <span>{safeFormatTime(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" strokeWidth={1.5} />
                  <span>{event.location || 'Location TBD'}</span>
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
                  <p className="mb-6 text-lg">{event.description || 'No description available'}</p>

                  {/* Only render LiveEventUpdates if we have a valid eventId */}
                  {id && <LiveEventUpdates eventId={id} />}

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
                          <p className="text-neutral-600">{safeFormatDate(event.date)}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-3 mt-0.5 text-text-secondary" strokeWidth={1.5} />
                        <div>
                          <h4 className="font-medium text-text">Location</h4>
                          <p className="text-neutral-600">{event.location || 'Location TBD'}</p>
                          <a href="#" className="text-accent hover:underline text-sm mt-1 inline-block">
                            View on map
                          </a>
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
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                <h2 className="text-xl font-bold text-text mb-6">Get Tickets</h2>

                {ticketDataError ? (
                    <div className="p-4 bg-error/10 rounded-lg mb-6">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-error mr-2" />
                        <div>
                          <p className="font-medium text-error">Ticket Information Error</p>
                          <p className="text-sm text-neutral-700">{ticketDataError}</p>
                          <p className="text-sm text-neutral-700 mt-2">
                            Please try refreshing the page or contact customer support.
                          </p>
                        </div>
                      </div>
                    </div>
                ) : (
                    <>
                      {/* Ticket type selection */}
                      <div className="space-y-4 mb-6">
                        {ticketTypes.map(ticket => (
                            ticket && ticket.id && ticket.price !== undefined ? (
                                <div
                                    key={ticket.id}
                                    className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer transition-all duration-300
                          ${ticket.id === selectedTicketType
                                        ? 'border-accent bg-accent/5'
                                        : 'border-neutral-100 hover:border-accent/30'}`}
                                    onClick={() => handleTicketTypeChange(ticket.id)}
                                >
                                  <div>
                                    <h4 className="font-medium text-text">{ticket.name || 'Standard Ticket'}</h4>
                                    <p className="text-sm text-neutral-600">{ticket.description || 'Standard admission'}</p>
                                    <p className="text-xs text-neutral-500 mt-1">{ticket.available || 'Limited'} tickets available</p>
                                    <p className="text-sm font-semibold text-accent mt-1">${typeof ticket.price === 'number' ? ticket.price.toFixed(2) : '0.00'}</p>
                                  </div>
                                  <div className="h-5 w-5 rounded-full border-2 flex items-center justify-center">
                                    {ticket.id === selectedTicketType && (
                                        <div className="h-3 w-3 rounded-full bg-accent"></div>
                                    )}
                                  </div>
                                </div>
                            ) : null
                        ))}
                      </div>

                      {/* Ticket quantity selection */}
                      <div className="flex justify-between items-center mb-6">
                        <div className="font-medium text-text">Number of tickets</div>
                        <div className="flex items-center border border-neutral-200 rounded-lg">
                          <button
                              onClick={() => handleTicketChange(-1)}
                              disabled={selectedTickets === 0}
                              className="p-2 disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4">{selectedTickets}</span>
                          <button
                              onClick={() => handleTicketChange(1)}
                              disabled={selectedTickets === 10 || !selectedTicketType}
                              className="p-2 disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price calculation */}
                      {selectedTickets > 0 && currentTicketType && typeof currentTicketType.price === 'number' && (
                          <div className="mb-6 bg-primary p-4 rounded-lg">
                            <div className="flex justify-between mb-2">
                              <span className="text-neutral-600">{currentTicketType.name || 'Standard Ticket'} × {selectedTickets}</span>
                              <span className="font-medium text-text">${(currentTicketType.price * selectedTickets).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-neutral-100 pt-2 mt-2">
                              <div className="flex justify-between">
                                <span className="font-medium">Total</span>
                                <span className="font-bold">${(currentTicketType.price * selectedTickets).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                      )}

                      {/* Book button */}
                      <button
                          onClick={handleBookNow}
                          disabled={selectedTickets === 0 || !selectedTicketType}
                          className="w-full py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Book Now
                      </button>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default EventDetailPage;