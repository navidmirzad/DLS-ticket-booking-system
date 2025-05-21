import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Search, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Ticket className="h-12 w-12 text-accent" strokeWidth={1.5} />
            <span className="ml-3 text-3xl font-bold font-heading text-text">Eventix</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({ isActive }) => 
              `text-base font-medium transition-all duration-300 ${isActive ? 'text-accent' : 'text-text hover:text-accent'}`
            }>
              Home
            </NavLink>
            <NavLink to="/events" className={({ isActive }) => 
              `text-base font-medium transition-all duration-300 ${isActive ? 'text-accent' : 'text-text hover:text-accent'}`
            }>
              Events
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/account" className={({ isActive }) => 
                `text-base font-medium transition-all duration-300 ${isActive ? 'text-accent' : 'text-text hover:text-accent'}`
              }>
                My Tickets
              </NavLink>
            )}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-secondary transition-all duration-300"
              aria-label="Search events"
            >
              <Search className="h-5 w-5 text-text" />
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/account" className="flex items-center space-x-2 p-2 rounded-full hover:bg-secondary transition-all duration-300">
                  <User className="h-5 w-5 text-text" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-full hover:bg-secondary transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5 text-text" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:block btn btn-primary"
              >
                Sign In
              </button>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-full hover:bg-secondary transition-all duration-300"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-text" />
              ) : (
                <Menu className="h-6 w-6 text-text" />
              )}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white shadow-md p-4 mt-0"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for events, artists, venues..."
                  className="input pr-10"
                  autoFocus
                />
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={toggleSearch}
                >
                  <X className="h-5 w-5 text-neutral-400 hover:text-accent" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md overflow-hidden"
          >
            <nav className="container-custom py-4 flex flex-col space-y-4">
              <NavLink
                to="/"
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg ${isActive ? 'bg-secondary text-text' : 'text-text hover:bg-secondary'}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/events"
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg ${isActive ? 'bg-secondary text-text' : 'text-text hover:bg-secondary'}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </NavLink>
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/account"
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg ${isActive ? 'bg-secondary text-text' : 'text-text hover:bg-secondary'}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Tickets
                  </NavLink>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg text-text hover:bg-secondary flex items-center"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="btn btn-primary w-full justify-center"
                >
                  Sign In
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};

export default Header;