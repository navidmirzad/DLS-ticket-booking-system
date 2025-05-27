import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById, createEvent, updateEvent } from "../services/eventService";

type EventFormData = {
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  capacity: number;
};

const EventForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    location: "",
    image: "",
    capacity: 0,
  });

  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchEventById(id)
      .then((event) => {
        setFormData({
          title: event.title,
          description: event.description,
          date: new Date(event.date).toISOString().slice(0, 16),
          location: event.location,
          image: event.image || "",
          capacity: event.capacity,
        });
      })
      .catch(() => setStatus("Failed to load event"));
  }, [id]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const eventData = {
        ...formData,
        date: new Date(formData.date),
      };

      if (isEditMode && id) {
        await updateEvent(id, eventData);
        setStatus("Event updated!");
      } else {
        await createEvent(eventData);
        setStatus(`Event created successfully!`);
        setFormData({ title: "", description: "", date: "", location: "", image: "", capacity: 0 });
      }
    } catch (err) {
      console.error(err);
      setStatus("Failed to submit event.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">
        {isEditMode ? "Edit Event" : "Create Event"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Event Image URL</label>
          <input
            type="url"
            name="image"
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-3 border border-gray-700 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {formData.image && (
            <div className="mt-3 border border-gray-700 rounded-md overflow-hidden">
              <img
                src={formData.image}
                alt="Event preview"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Event title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-700 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
          <textarea
            name="description"
            placeholder="Event description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-700 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Date & Time</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-700 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Location</label>
          <input
            type="text"
            name="location"
            placeholder="Event location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-700 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Capacity</label>
          <input 
            type="number" 
            name="capacity" 
            placeholder="Number of attendees" 
            value={formData.capacity} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-700 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            required 
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {isEditMode ? "Update Event" : "Create Event"}
        </button>
      </form>
      
      {status && (
        <div className={`mt-5 p-3 rounded-md text-center font-medium ${status.includes("Failed") ? "bg-red-900 text-red-100" : "bg-green-900 text-green-100"}`}>
          {status}
        </div>
      )}
    </div>
  );
};

export default EventForm;
