import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-primary py-24">
      <div className="container-custom text-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-9xl font-bold text-accent mb-8">404</h1>
          <h2 className="text-3xl font-bold text-text mb-4">Page Not Found</h2>
          <p className="text-lg text-neutral-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/" className="btn btn-primary flex items-center justify-center">
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <Link to="/events" className="btn btn-outline flex items-center justify-center">
              <Search className="h-5 w-5 mr-2" />
              Find Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;