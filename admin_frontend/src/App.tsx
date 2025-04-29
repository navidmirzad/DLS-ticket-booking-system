import { useEffect, useState } from "react";
import { Event } from "./types/Event";
import { fetchEvents } from "./services/eventService";
import { validateToken } from "./services/authService";
import LoadingScreen from "./components/LoadingScreen";
import EventList from "./components/EventList";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom"

// pages
import ViewEvent from "./pages/ViewEvent"
import EventForm from "./pages/EventForm"
import Login from "./pages/Login"
/* import SUIIII from "./components/SUIIII" */

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [jwtTokenValid, setJwtTokenValid] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      const valid = await validateToken();
      if (valid) {
        await fetchEvents()
          .then(setEvents)
          .catch((error) => {
            console.error("Failed to fetch events:", error);
          });
      }
      setJwtTokenValid(valid);
      setLoading(false);
    };

    init();
  }, []);

  if (loading) return <LoadingScreen />;

  if (!jwtTokenValid) return <Login />;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="px-4 py-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center">
          Event List
        </h1>
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
