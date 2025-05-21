// SSE service for real-time event updates
import { useState, useEffect } from 'react';

// Type definitions for event updates
export interface EventUpdate {
  type: 'TICKET_PURCHASED' | 'connected';
  eventId?: string;
  remainingTickets?: number;
  eventTitle?: string;
  timestamp?: string;
}

const API_URL = 'http://localhost:3002';

// Hook to subscribe to event updates
export const useEventUpdates = (eventId: string) => {
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [eventUpdates, setEventUpdates] = useState<EventUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create EventSource only if eventId is provided
    if (!eventId) return;

    // Clean up previous connection if any
    if (eventSource) {
      eventSource.close();
    }

    // Create new connection
    try {
      const newEventSource = new EventSource(`${API_URL}/api/event/${eventId}/updates`);
      setEventSource(newEventSource);

      // Connection opened
      newEventSource.onopen = () => {
        console.log(`SSE connection opened for event ${eventId}`);
        setIsConnected(true);
        setError(null);
      };

      // Handle incoming messages
      newEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as EventUpdate;
          console.log('SSE update received:', data);
          
          if (data.type === 'connected') {
            setIsConnected(true);
          } else {
            setEventUpdates(prev => [data, ...prev].slice(0, 10)); // Keep last 10 updates
          }
        } catch (err) {
          console.error('Error parsing SSE message:', event.data, err);
        }
      };

      // Handle errors
      newEventSource.onerror = (err) => {
        console.error('SSE connection error:', err);
        setError('Connection error. Reconnecting...');
        setIsConnected(false);
        
        // Close and try to reconnect
        newEventSource.close();
        
        // The browser will automatically try to reconnect
      };

      // Clean up on unmount
      return () => {
        console.log(`Closing SSE connection for event ${eventId}`);
        newEventSource.close();
        setEventSource(null);
        setIsConnected(false);
      };
    } catch (err) {
      console.error('Error creating EventSource:', err);
      setError(`Failed to connect: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [eventId]);

  return { eventUpdates, isConnected, error };
};

// Function to manually close an SSE connection
export const closeEventSource = (eventSource: EventSource | null) => {
  if (eventSource) {
    eventSource.close();
  }
}; 