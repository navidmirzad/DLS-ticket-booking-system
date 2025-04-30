import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  User,
  Mail,
  Phone,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  getEventById,
  Event,
  TicketType,
  getTicketTypesForEvent
} from '../services/api';
import { formatShortDate, formatTime } from '../utils/dateUtils';

// Safe formatting functions with fallbacks
const safeFormatShortDate = (dateString: string | Date | undefined | null): string => {
  if (!dateString) return "Date TBD";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date TBD";
    return formatShortDate(String(dateString));
  } catch (e) {
    return "Date TBD";
  }
};

const safeFormatTime = (dateString: string | Date | undefined | null): string => {
  if (!dateString) return "Time TBD";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Time TBD";
    return formatTime(String(dateString));
  } catch (e) {
    return "Time TBD";
  }
};

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const ticketCount = parseInt(searchParams.get('tickets') || '1', 10);
  const ticketTypeId = searchParams.get('ticketType') || 'general';

  // State for the event data, ticket types, loading, and error handling
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch event details and ticket types from the API
  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        console.log(`Fetching event with ID: ${id}`);

        // Fetch event details
        const eventData = await getEventById(id);
        console.log('Fetched event data:', eventData);

        // Fetch ticket types for this event
        const ticketTypesData = await getTicketTypesForEvent(id);
        console.log('Fetched ticket types:', ticketTypesData);

        if (!eventData) {
          throw new Error('Event not found');
        }

        setEvent(eventData);
        setTicketTypes(ticketTypesData);

        // Find the selected ticket type
        const selectedType = ticketTypesData.find(type => type.id === ticketTypeId) || ticketTypesData[0];
        setSelectedTicketType(selectedType);

      } catch (err) {
        console.error('Error fetching event data:', err);
        setError('Failed to load event data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [id, ticketTypeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field when changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Navigate to checkout with all the relevant information
      navigate('/checkout', {
        state: {
          eventId: id,
          selectedTicketType: selectedTicketType, // Pass the full ticket type object
          ticketCount,
          userInfo: formData
        }
      });
    }
  };

  if (isLoading) {
    return (
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-text mb-4">Loading Event...</h1>
          <p className="text-text-secondary mb-8">Please wait while we load the event details.</p>
        </div>
    );
  }

  if (error || !event || !selectedTicketType) {
    return (
        <div className="container-custom py-20">
          <h1 className="text-3xl font-bold text-text mb-4">Event Not Found</h1>
          <p className="text-text-secondary mb-6">{error || "The event doesn't exist or has been removed."}</p>

          <button
              onClick={() => navigate('/events')}
              className="mt-6 btn btn-primary px-4 py-2 bg-accent text-white rounded-lg"
          >
            Browse Events
          </button>
        </div>
    );
  }

  // Calculate pricing based on the selected ticket type
  const ticketPrice = selectedTicketType.price;
  const subtotal = ticketPrice * ticketCount;
  const serviceFee = subtotal * 0.15; // 15% service fee
  const total = subtotal + serviceFee;

  // Default image if none is provided
  const defaultImage = 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg';

  return (
      <div className="bg-primary py-12">
        <div className="container-custom">
          <button
              onClick={() => navigate(`/events/${id}`)}
              className="flex items-center text-text hover:text-accent mb-6 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Event
          </button>

          <h1 className="text-3xl font-bold text-text mb-6">Complete Your Booking</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <motion.div
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
              >
                <div className="border-b border-neutral-100 p-6">
                  <h2 className="text-xl font-bold text-text">Your Information</h2>
                  <p className="text-neutral-500 text-sm">We'll use this information for your booking</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="firstName">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className={`input pl-10 ${errors.firstName ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                      </div>
                      {errors.firstName && (
                          <p className="mt-1 text-sm text-error">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="lastName">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className={`input pl-10 ${errors.lastName ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                      </div>
                      {errors.lastName && (
                          <p className="mt-1 text-sm text-error">{errors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="email">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`input pl-10 ${errors.email ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
                            placeholder="john.doe@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                      </div>
                      {errors.email && (
                          <p className="mt-1 text-sm text-error">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="phone">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className={`input pl-10 ${errors.phone ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
                            placeholder="+1 (123) 456-7890"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                      </div>
                      {errors.phone && (
                          <p className="mt-1 text-sm text-error">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-start">
                      <input
                          type="checkbox"
                          id="agreeToTerms"
                          name="agreeToTerms"
                          className="mt-1 h-4 w-4 text-accent border-neutral-300 rounded focus:ring-accent/20"
                          checked={formData.agreeToTerms}
                          onChange={handleChange}
                      />
                      <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-neutral-700">
                        I agree to the <a href="#" className="text-accent hover:underline">Terms of Service</a> and <a href="#" className="text-accent hover:underline">Privacy Policy</a>
                      </label>
                    </div>
                    {errors.agreeToTerms && (
                        <p className="mt-1 text-sm text-error">{errors.agreeToTerms}</p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                  className="bg-white rounded-2xl shadow-sm sticky top-24"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="p-6 border-b border-neutral-100">
                  <h2 className="text-xl font-bold text-text">Order Summary</h2>
                </div>

                <div className="p-6">
                  <div className="flex items-start mb-6">
                    <div
                        className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0 mr-4"
                        style={{ backgroundImage: `url(${defaultImage})` }}
                    />
                    <div>
                      <h3 className="font-medium text-text mb-1">{event.title}</h3>
                      <div className="text-sm text-neutral-500 space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" strokeWidth={1.5} />
                          <span>{safeFormatShortDate(event.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" strokeWidth={1.5} />
                          <span>{safeFormatTime(event.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" strokeWidth={1.5} />
                          <span>{event.location || 'Location TBD'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-600">{selectedTicketType.name} × {ticketCount}</span>
                      <span className="font-medium text-text">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-600">Service Fee</span>
                      <span className="font-medium text-text">${serviceFee.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-lg text-text">Total</span>
                      <span className="font-bold text-xl text-text">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg bg-primary p-4">
                    <div className="flex items-center text-neutral-700 text-sm">
                      <CreditCard className="h-4 w-4 mr-2 text-text-secondary" />
                      <span>Secure payment processing</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default BookingPage;