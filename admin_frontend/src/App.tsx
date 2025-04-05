import { useEffect, useState } from "react";
import { Event } from "./types/Event";
import { fetchEvents } from "./services/eventService";
import LoadingScreen from "./components/LoadingScreen";
import EventList from "./components/EventList";

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch((error) => {
        console.error("Failed to fetch events:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 pb-4">
        Event List
      </h1>
      <EventList events={events} />
    </div>
  );
}

export default App;
