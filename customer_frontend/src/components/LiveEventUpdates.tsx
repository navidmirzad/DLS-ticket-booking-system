import { useEventUpdates, EventUpdate } from '../services/sseService';

interface LiveEventUpdatesProps {
  eventId: string;
}

const LiveEventUpdates = ({ eventId }: LiveEventUpdatesProps) => {
  const { eventUpdates, isConnected, error } = useEventUpdates(eventId);
  
  if (error) {
    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }
  
  if (!isConnected) {
    return (
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-500">Connecting to live updates...</p>
      </div>
    );
  }
  
  if (eventUpdates.length === 0) {
    return (
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-600">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          <span className="font-medium">Live updates connected.</span> You'll see ticket purchases in real-time as they happen.
        </p>
      </div>
    );
  }
  
  return (
    <div className="mt-4">
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mb-2">
        <div className="flex items-center">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          <p className="text-sm text-blue-600">Live updates connected</p>
        </div>
      </div>
      
      <div className="space-y-2">
        {eventUpdates.map((update, index) => (
          <LiveUpdateItem key={index} update={update} />
        ))}
      </div>
    </div>
  );
};

// Component to display individual update
const LiveUpdateItem = ({ update }: { update: EventUpdate }) => {
  // Format timestamp
  const formattedTime = update.timestamp 
    ? new Date(update.timestamp).toLocaleTimeString() 
    : '';
  
  if (update.type === 'TICKET_PURCHASED') {
    return (
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md animate-pulse">
        <div className="flex justify-between">
          <p className="text-sm font-medium text-yellow-800">
            Ticket purchased for {update.eventTitle || 'event'}!
          </p>
          <p className="text-xs text-gray-500">{formattedTime}</p>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {typeof update.remainingTickets === 'number' 
            ? `${update.remainingTickets} tickets remaining` 
            : 'Availability updated'}
        </p>
      </div>
    );
  }
  
  // Default case for unknown update types
  return (
    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
      <div className="flex justify-between">
        <p className="text-sm text-gray-600">Event update received</p>
        <p className="text-xs text-gray-500">{formattedTime}</p>
      </div>
    </div>
  );
};

export default LiveEventUpdates; 