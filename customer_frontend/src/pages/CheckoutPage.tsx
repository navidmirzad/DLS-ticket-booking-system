import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { buyTicket, getEventById, TicketType } from '../services/api';

interface LocationState {
  eventId: string;
  selectedTicketType?: TicketType;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId, selectedTicketType } = (location.state as LocationState) || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventName, setEventName] = useState<string>('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [email, setEmail] = useState('');

  // Get event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) {
        setError('Event ID is missing');
        return;
      }

      try {
        const event = await getEventById(eventId);
        setEventName(event.title);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Could not load event details');
      }
    };

    fetchEventDetails();
  }, [eventId]);

  // Redirect if no event ID or ticket type is selected
  useEffect(() => {
    if (!eventId) {
      navigate('/events', { replace: true });
      return;
    }

    if (!selectedTicketType) {
      navigate(`/events/${eventId}`, { replace: true });
    }
  }, [selectedTicketType, eventId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventId || !selectedTicketType) {
      setError('Missing event or ticket information');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // In a real app, you'd likely get the userId from auth context or state
      const userId = 1; // Placeholder - would come from authentication

      // Call the API to buy the ticket
      await buyTicket(
          eventId,
          userId,
          email,
          selectedTicketType.id
      );

      setIsProcessing(false);
      setIsComplete(true);

      // Redirect to account page after a delay
      setTimeout(() => {
        navigate('/account');
      }, 3000);
    } catch (err) {
      console.error('Error purchasing ticket:', err);
      setIsProcessing(false);
      setError('Failed to complete purchase. Please try again.');
    }
  };

  if (isComplete) {
    return (
        <div className="bg-primary min-h-[calc(100vh-64px)] flex items-center justify-center py-12">
          <motion.div
              className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-success" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-text mb-2">Booking Confirmed!</h1>
            <p className="text-lg font-medium text-text-secondary mb-1">{eventName}</p>
            <p className="text-neutral-600 mb-6">
              Your booking has been successfully completed. We've sent a confirmation email with all the details.
            </p>
            <button
                onClick={() => navigate('/account')}
                className="btn btn-primary w-full"
            >
              View My Tickets
            </button>
          </motion.div>
        </div>
    );
  }

  return (
      <div className="bg-primary py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-text mb-8">Complete Your Purchase</h1>

            {error && (
                <motion.div
                    className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6 flex items-start"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                  <AlertTriangle className="h-5 w-5 text-error mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-error">Payment Error</h3>
                    <p className="text-sm text-error/80">{error}</p>
                  </div>
                </motion.div>
            )}

            {selectedTicketType && (
                <motion.div
                    className="bg-secondary/20 rounded-lg p-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-medium text-text mb-2">Order Summary</h2>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{eventName}</p>
                      <p className="text-sm text-neutral-600">{selectedTicketType.name}</p>
                    </div>
                    <p className="font-bold text-lg">${selectedTicketType.price.toFixed(2)}</p>
                  </div>
                </motion.div>
            )}

            <motion.div
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="p-6 border-b border-neutral-100">
                <h2 className="text-xl font-bold text-text">Payment Information</h2>
                <p className="text-neutral-500 text-sm">Enter your contact and payment details securely</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                      type="email"
                      id="email"
                      className="input"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="cardName">
                    Name on Card
                  </label>
                  <input
                      type="text"
                      id="cardName"
                      className="input"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="cardNumber">
                    Card Number
                  </label>
                  <input
                      type="text"
                      id="cardNumber"
                      className="input"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="expiry">
                      Expiry Date
                    </label>
                    <input
                        type="text"
                        id="expiry"
                        className="input"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="cvc">
                      CVC
                    </label>
                    <input
                        type="text"
                        id="cvc"
                        className="input"
                        placeholder="123"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="billingZip">
                    Billing Zip Code
                  </label>
                  <input
                      type="text"
                      id="billingZip"
                      className="input"
                      placeholder="94107"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                  />
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <button
                      type="submit"
                      className="btn btn-primary w-full relative overflow-hidden"
                      disabled={isProcessing}
                  >
                    {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                    ) : (
                        `Complete Payment ${selectedTicketType ? `($${selectedTicketType.price.toFixed(2)})` : ''}`
                    )}
                  </button>

                  <p className="mt-4 text-center text-xs text-neutral-500">
                    By completing this purchase, you agree to our Terms of Service, Privacy Policy, and Refund Policy
                  </p>
                </div>
              </form>
            </motion.div>

            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-neutral-700">
                <span className="font-medium">Note:</span> This is a demonstration checkout page. Your card will not be charged, but a ticket will be reserved in our system.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CheckoutPage;