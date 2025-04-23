import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin } from 'lucide-react';

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (date) params.append('date', date);
    if (location) params.append('location', location);
    
    navigate(`/events?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="bg-white rounded-xl shadow-md p-2 flex flex-col md:flex-row"
    >
      <div className="flex-1 border-b md:border-b-0 md:border-r border-neutral-100 px-3 py-2 flex items-center">
        <Search className="h-5 w-5 text-neutral-400 mr-2" />
        <input
          type="text"
          placeholder="Search events, artists, teams..."
          className="w-full focus:outline-none text-text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex-1 border-b md:border-b-0 md:border-r border-neutral-100 px-3 py-2 flex items-center">
        <Calendar className="h-5 w-5 text-neutral-400 mr-2" />
        <input
          type="date"
          placeholder="When"
          className="w-full focus:outline-none text-text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      
      <div className="flex-1 px-3 py-2 flex items-center">
        <MapPin className="h-5 w-5 text-neutral-400 mr-2" />
        <input
          type="text"
          placeholder="Where"
          className="w-full focus:outline-none text-text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      
      <button
        type="submit"
        className="mt-2 md:mt-0 md:ml-2 bg-accent text-white rounded-lg px-6 py-2 font-medium hover:bg-accent/90 transition-all duration-300"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;