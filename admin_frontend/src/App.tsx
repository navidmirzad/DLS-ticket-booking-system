import { useEffect, useState } from "react";
import { Event } from "./types/Event";
import { fetchEvents } from "./services/eventService";
import LoadingScreen from "./components/LoadingScreen";
import EventList from "./components/EventList";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom"
import { useAuth } from "./context/AuthContext";

// pages
import ViewEvent from "./pages/ViewEvent"
import EventForm from "./pages/EventForm"
import Login from "./pages/Login"
/* import SUIIII from "./components/SUIIII" */

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const loadEvents = async () => {
      if (isAuthenticated) {
        try {
          const fetchedEvents = await fetchEvents();
          setEvents(fetchedEvents);
        } catch (error) {
          console.error("Failed to fetch events:", error);
        }
      }
    };

    loadEvents();
  }, [isAuthenticated]);

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) return <Login />;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="py-6 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<EventList events={events} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-event" element={<EventForm />} />
          <Route path="/events/:id" element={<ViewEvent />} />
          <Route path="/events/:id/edit" element={<EventForm />} />
          <Route path="*" element={<h2 className="text-center text-red-600">404 - Page Not Found</h2>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
