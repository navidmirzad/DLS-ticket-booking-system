import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById } from "../services/eventService";

type EventFormData = {
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  capacity: number; // Added capacity field
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
    capacity: 0, // Initialize capacity
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
          capacity: event.capacity, // Populate capacity
        });
      })
      .catch(() => setStatus("Failed to load event"));
  }, [id]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value, 10) || 0 : value, // Handle capacity as a number
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await fetch(`http://localhost:3001/api/admin/events${isEditMode ? `/${id}` : ""}`, {
        method: isEditMode ? "PATCH" : "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setStatus(isEditMode ? "Event updated!" : `Event created! ID: ${data.data}`);
        if (!isEditMode) {
          setFormData({ title: "", description: "", date: "", location: "", image: "", capacity: 0 });
        }
      } else {
        setStatus("Failed to submit event.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error occurred.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">
        {isEditMode ? "Edit Event" : "Create Event"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Image URL</label>
          <input
            type="url"
            name="image"
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Event preview"
              className="mt-2 w-full h-48 object-cover rounded"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
          )}
        </div>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      
        <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleChange} className="w-full p-2 border rounded" required /> {/* Added capacity field */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {isEditMode ? "Update" : "Submit"}
        </button>
      </form>
      {status && (
        <div className="mt-4 p-2 rounded text-center" style={{ backgroundColor: status.includes("Failed") ? "#fee2e2" : "#dcfce7" }}>
          {status}
        </div>
      )}
    </div>
  );
};

export default EventForm;
