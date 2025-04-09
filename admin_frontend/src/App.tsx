import { useEffect, useState } from "react";
import { Event } from "./types/Event";
import { fetchEvents } from "./services/eventService";
import LoadingScreen from "./components/LoadingScreen";
import EventList from "./components/EventList";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom"

// pages
import ViewEvent from "./pages/ViewEvent"
import CreateEvent from "./pages/CreateEvent"
import EditEvent from "./pages/EditEvent"

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
    <div className="min-h-screen">
      <Navbar />
      <main className="px-4 py-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center">
          Event List
        </h1>
        <Routes>
          <Route path="/" element={<EventList events={events} />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:id" element={<ViewEvent />} />
          <Route path="/edit/:id/edit" element={<EditEvent />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
