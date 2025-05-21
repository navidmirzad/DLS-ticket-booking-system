import React, { useEffect, useState } from 'react';
import { Ticket, getTicketsByEvent } from '../../services/ticketService';

interface TicketListProps {
  eventId: string;
  onSelectTicket?: (ticket: Ticket) => void;
}

const TicketList: React.FC<TicketListProps> = ({ eventId, onSelectTicket }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTicketsByEvent(eventId);
        setTickets(data);
        setError(null);
      } catch (err) {
        setError('Failed to load tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center p-4 text-gray-600">
        <p>No tickets available for this event.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4">
      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSelectTicket?.(ticket)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{ticket.type}</h3>
              <p className="text-gray-600">{ticket.event.title}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">
                ${ticket.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketList; 