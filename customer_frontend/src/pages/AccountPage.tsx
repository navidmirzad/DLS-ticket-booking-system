import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, User, Calendar, Download, MapPin, Clock, CreditCard, X } from 'lucide-react';
import { getMyOrders } from '../services/orderService';
import type { Order, OrderTicket } from '../services/orderService';
import { getTicketById } from '../services/ticketService';
import { getEventById } from '../services/api';
import type { SimpleEvent } from '../services/api';
import { formatShortDate, formatTime } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import DownloadableTicket from '../components/DownloadableTicket';

interface TicketDetails extends OrderTicket {
  details?: {
    _id: string;
    ticket_id: string;
    event_id: string;
    ticket_price: number;
    event?: SimpleEvent;
  };
  isLoading?: boolean;
  error?: string;
}

interface OrderWithDetails extends Order {
  tickets_bought: TicketDetails[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketDetails;
}

const TicketDetailsModal: React.FC<ModalProps> = ({ isOpen, onClose, ticket }) => {
  const [showDownloadable, setShowDownloadable] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`relative bg-white rounded-2xl mx-4 ${
            showDownloadable ? 'w-full max-w-5xl' : 'max-w-2xl w-full'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {ticket.isLoading ? (
            <div className="text-center py-8">Loading ticket details...</div>
          ) : ticket.error ? (
            <div className="text-center py-8 text-error">{ticket.error}</div>
          ) : ticket.details?.event ? (
            showDownloadable ? (
              <div className="p-6">
                <DownloadableTicket
                  ticketId={ticket.ticket_id}
                  event={ticket.details.event}
                  ticketPrice={ticket.details.ticket_price}
                  quantity={ticket.quantity}
                />
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-text mb-2">
                    {ticket.details.event.title}
                  </h2>
                  <p className="text-neutral-600">
                    {ticket.details.event.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-neutral-600">
                      <Calendar className="h-5 w-5 mr-3 text-accent" strokeWidth={1.5} />
                      <span>{formatShortDate(ticket.details.event.date)}</span>
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <Clock className="h-5 w-5 mr-3 text-accent" strokeWidth={1.5} />
                      <span>{formatTime(ticket.details.event.date)}</span>
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <MapPin className="h-5 w-5 mr-3 text-accent" strokeWidth={1.5} />
                      <span>{ticket.details.event.location}</span>
                    </div>
                  </div>

                  <div className="space-y-4 bg-primary/5 p-4 rounded-xl">
                    <div className="text-neutral-600">
                      <strong>Ticket Type:</strong> Standard Admission
                    </div>
                    <div className="text-neutral-600">
                      <strong>Quantity:</strong> {ticket.quantity}
                    </div>
                    <div className="text-neutral-600">
                      <strong>Price per Ticket:</strong> ${ticket.details.ticket_price}
                    </div>
                    <div className="font-semibold text-accent">
                      <strong>Total:</strong> ${ticket.details.ticket_price * ticket.quantity}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <button 
                    className="btn btn-primary w-full"
                    onClick={() => setShowDownloadable(true)}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Ticket
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-8">No ticket details available</div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketDetails | null>(null);
  const { isAuthenticated, user, logout } = useAuth();

  // Fetch orders and ticket details
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching orders...');
        
        const response = await getMyOrders();
        console.log('Orders received:', response);

        // Convert orders to include ticket details structure
        const ordersWithDetails: OrderWithDetails[] = response.map(order => {
          console.log('Processing order:', order);
          if (!order.tickets_bought || !Array.isArray(order.tickets_bought)) {
            console.error('Invalid tickets_bought in order:', order);
            return {
              ...order,
              tickets_bought: []
            };
          }

          return {
            ...order,
            tickets_bought: order.tickets_bought.map(ticket => ({
              ...ticket,
              isLoading: true
            }))
          };
        });
        
        console.log('Orders with details:', ordersWithDetails);
        setOrders(ordersWithDetails);

        // Fetch ticket details and event details for each ticket
        for (const order of ordersWithDetails) {
          for (const ticket of order.tickets_bought) {
            try {
              console.log('Fetching ticket details for:', ticket.ticket_id);
              const ticketDetails = await getTicketById(ticket.ticket_id);
              console.log('Ticket details received:', ticketDetails);
              
              // Fetch event details
              const eventDetails = await getEventById(ticketDetails.event_id);
              console.log('Event details received:', eventDetails);
              
              setOrders(currentOrders => 
                currentOrders.map(o => 
                  o.order_id === order.order_id ? {
                    ...o,
                    tickets_bought: o.tickets_bought.map(t => 
                      t.ticket_id === ticket.ticket_id ? {
                        ...t,
                        details: {
                          _id: ticketDetails._id,
                          ticket_id: ticketDetails.ticket_id,
                          event_id: ticketDetails.event_id,
                          ticket_price: ticketDetails.ticket_price,
                          event: eventDetails
                        },
                        isLoading: false
                      } : t
                    )
                  } : o
                )
              );
            } catch (err) {
              console.error(`Error fetching details for ${ticket.ticket_id}:`, err);
              setOrders(currentOrders => 
                currentOrders.map(o => 
                  o.order_id === order.order_id ? {
                    ...o,
                    tickets_bought: o.tickets_bought.map(t => 
                      t.ticket_id === ticket.ticket_id ? {
                        ...t,
                        error: 'Failed to load ticket details',
                        isLoading: false
                      } : t
                    )
                  } : o
                )
              );
            }
          }
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Helper function to safely check if a ticket is upcoming
  const isUpcomingTicket = (ticket: TicketDetails) => {
    try {
      if (!ticket.details?.event?.date) return true; // Show as upcoming if no date
      return new Date(ticket.details.event.date) > new Date();
    } catch (e) {
      console.warn('Invalid ticket date:', e);
      return false;
    }
  };

  // Split orders into upcoming and past based on the event date
  const upcomingOrders = orders.filter(order => 
    order.tickets_bought.some(isUpcomingTicket)
  );
  const pastOrders = orders.filter(order => 
    order.tickets_bought.length > 0 && order.tickets_bought.every(ticket => !isUpcomingTicket(ticket))
  );

  const displayedOrders = activeTab === 'upcoming' ? upcomingOrders : pastOrders;

  // Update the list view download button to open modal with download view
  const handleDownload = (ticketItem: TicketDetails) => {
    setSelectedTicket(ticketItem);
  };

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
                    <h2 className="text-lg font-medium text-text">{user.name}</h2>
                    <p className="text-sm text-neutral-500">{user.email}</p>
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
                    Upcoming Orders
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
                    Past Orders
                  </button>
                </nav>

                <div className="border-t border-neutral-100 mt-4 pt-4">
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-text hover:bg-neutral-100 transition-all duration-300"
                  >
                    <User className="h-5 w-5 mr-3" strokeWidth={1.5} />
                    Logout
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
                  {activeTab === 'upcoming' ? 'Upcoming Orders' : 'Past Orders'}
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
                    <h3 className="text-lg font-medium text-text mb-2">Loading Orders...</h3>
                  </div>
                ) : error ? (
                  <div className="text-center py-10">
                    <p className="text-xl text-error">{error}</p>
                  </div>
                ) : displayedOrders.length > 0 ? (
                  <div className="space-y-6">
                    {displayedOrders.map((order, index) => (
                      <motion.div
                        key={order._id}
                        className="border border-neutral-200 rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        {order.tickets_bought?.map((ticketItem, ticketIndex) => (
                          <div key={`${order._id}-${ticketIndex}`} className="grid grid-cols-1 md:grid-cols-4 border-b last:border-b-0 border-neutral-100">
                            <div className="md:col-span-3 p-6">
                              <div className="mb-4">
                                <h3 className="text-lg font-medium text-text mb-2">
                                  {ticketItem.isLoading ? (
                                    'Loading ticket details...'
                                  ) : ticketItem.error ? (
                                    'Error loading ticket details'
                                  ) : ticketItem.details?.event?.title ? (
                                    ticketItem.details.event.title
                                  ) : (
                                    'Ticket details not available'
                                  )}
                                </h3>
                                <div className="flex flex-wrap gap-y-2">
                                  <div className="flex items-center text-neutral-500 text-sm mr-4">
                                    <Calendar className="h-4 w-4 mr-1" strokeWidth={1.5} />
                                    <span>
                                      {ticketItem.details?.event?.date ? 
                                        formatShortDate(ticketItem.details.event.date) : 
                                        'Date not available'}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-neutral-500 text-sm mr-4">
                                    <Clock className="h-4 w-4 mr-1" strokeWidth={1.5} />
                                    <span>
                                      {ticketItem.details?.event?.date ? 
                                        formatTime(ticketItem.details.event.date) : 
                                        'Time not available'}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-neutral-500 text-sm">
                                    <MapPin className="h-4 w-4 mr-1" strokeWidth={1.5} />
                                    <span>
                                      {ticketItem.details?.event?.location || 'Location not available'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap justify-between items-center gap-4">
                                <div className="space-y-1">
                                  <span className="inline-block bg-primary px-3 py-1 rounded-full text-xs font-medium text-text-secondary">
                                    Standard Admission × {ticketItem.quantity}
                                  </span>
                                  <div className="flex items-center text-sm text-neutral-500">
                                    <CreditCard className="h-4 w-4 mr-1" strokeWidth={1.5} />
                                    <span>
                                      {ticketItem.details ? 
                                        `Total: $${ticketItem.details.ticket_price * ticketItem.quantity}` :
                                        `Total: Part of order total $${order.total_price}`}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex space-x-3">
                                  {activeTab === 'upcoming' && (
                                    <button 
                                      className="btn btn-outline py-2 px-3 text-sm flex items-center"
                                      onClick={() => handleDownload(ticketItem)}
                                    >
                                      <Download className="h-4 w-4 mr-2" strokeWidth={1.5} />
                                      Download Ticket
                                    </button>
                                  )}

                                  <button 
                                    className="btn btn-primary py-2 px-3 text-sm flex items-center"
                                    onClick={() => setSelectedTicket(ticketItem)}
                                  >
                                    <Ticket className="h-4 w-4 mr-2" strokeWidth={1.5} />
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="bg-neutral-50 p-4 border-t border-neutral-100">
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-neutral-500">
                              Order ID: {order.order_id}
                            </div>
                            <div className="flex items-center">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                order.order_status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                order.order_status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.order_status}
                              </span>
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
                    <h3 className="text-lg font-medium text-text mb-2">No Orders Found</h3>
                    <p className="text-neutral-600 mb-6">
                      {activeTab === 'upcoming'
                        ? "You don't have any upcoming orders."
                        : "You haven't made any past orders."}
                    </p>
                    <button className="btn btn-primary">Browse Events</button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket!}
      />
    </div>
  );
};

export default AccountPage;
