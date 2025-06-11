import { useParams, Link } from "react-router-dom";
import { fetchEventById } from "../services/eventService";
import { useEffect, useState } from "react";
import { Event, Ticket } from "../types/Event";

const ViewEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchEventById(id)
      .then(setEvent)
      .catch((error) => {
        console.error("Failed to fetch event:", error);
      })
      .finally(() => setLoading(false));
  }, [id]); 
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Event not found</h2>
        <Link to="/events" className="text-blue-500 hover:underline">
          Return to events list
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="relative h-96">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg";
              }}
            />
          ) : (
            <img
              src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg"
              alt="Default event"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-6">{event.title}</h1>
          
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Event Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="text-gray-300">
                    {new Date(event.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-gray-300">
                    {new Date(event.date).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-gray-300">{event.location}</div>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div className="text-gray-300">Capacity: {event.capacity} people</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Ticket Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <div className="text-gray-300">
                    {event.tickets_available} tickets available
                  </div>
                </div>
                
                {event.tickets && event.tickets.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Ticket Types:</h4>
                    <div className="space-y-2">
                      {event.tickets.map((ticket: Ticket, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-gray-800 rounded p-3">
                          <span className="text-gray-300">{ticket.type}</span>
                          <span className="text-white font-medium">${ticket.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 italic">No ticket information available</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Link to="/" className="bg-gray-700 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors">
              Back to Events
            </Link>
            <Link to={`/events/${id}/edit`} className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              Edit Event
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEvent;
