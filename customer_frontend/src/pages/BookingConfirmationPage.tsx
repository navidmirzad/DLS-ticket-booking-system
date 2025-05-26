import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { verifyBookingSession, buyTicket } from '../services/api';

const BookingConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<{ email: string; total_price: number } | null>(null);

  // Get the session_id and event_id from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');
  const eventId = searchParams.get('event_id');

  useEffect(() => {
    const verifyBooking = async () => {
      if (!sessionId) {
        setError('Invalid booking session');
        setIsLoading(false);
        return;
      }

      if (!eventId) {
        setError('Missing event information');
        setIsLoading(false);
        return;
      }

      try {
        // Verify the booking session
        const verificationResult = await verifyBookingSession(sessionId);

        if (verificationResult.success && verificationResult.order) {
          // Create the order and send confirmation email
          const ticketInfo = verificationResult.order.tickets_bought?.[0]
          const order = await buyTicket(
            eventId,
            verificationResult.order.email,
            ticketInfo.quantity,
            sessionId // Pass session_id as payment_intent_id
          );

          setOrderDetails({
            email: order.email,
            total_price: order.total_price
          });
        } else {
          throw new Error(verificationResult.error || 'Invalid order data');
        }
      } catch (err) {
        console.error('Error verifying booking:', err);
        setError('Failed to verify booking. Please contact support.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyBooking();
  }, [sessionId, eventId]);

  if (isLoading) {
    return (
      <div className="bg-primary min-h-[calc(100vh-64px)] flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-text">Verifying your booking...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-primary min-h-[calc(100vh-64px)] flex items-center justify-center py-12">
        <motion.div
          className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <AlertTriangle className="h-16 w-16 text-error" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">Booking Error</h1>
          <p className="text-neutral-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/events')}
            className="btn btn-primary w-full"
          >
            Browse Events
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-primary min-h-[calc(100vh-64px)] flex items-center justify-center py-12">
      <motion.div
        className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center my-3">
          <CheckCircle className="h-56 w-56 text-success" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-text mb-2">Booking Confirmed!</h1>
        {orderDetails && (
          <div className="text-neutral-600 space-y-2 mb-6">
            <p>Total Amount: ${orderDetails.total_price.toFixed(2)}</p>
            <p className="text-sm">
              A confirmation email has been sent to {orderDetails.email}
            </p>
          </div>
        )}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/account')}
            className="btn btn-primary w-full"
          >
            View My Tickets
          </button>
          <button
            onClick={() => navigate('/events')}
            className="btn btn-secondary w-full"
          >
            Browse More Events
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmationPage; 