import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login flow - call API through context
        await login(formData.email, formData.password);
      } else {
        // Registration flow - call API through context
        await register(formData.name, formData.email, formData.phone, formData.password);
      }
      // If successful, close the modal
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
      <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Backdrop */}
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={onClose}
              />

              {/* Modal */}
              <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full max-w-md z-10"
                  onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="relative p-6 pb-0">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {isLogin ? 'Welcome back!' : 'Create an account'}
                    </h2>
                    <p className="text-neutral-600 mb-6">
                      {isLogin
                          ? 'Sign in to access your account and book tickets.'
                          : 'Join Eventix to start booking amazing events.'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                          {error}
                        </div>
                    )}

                    {!isLogin && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="name">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input pl-10 w-full p-3 border border-gray-300 rounded-lg"
                                placeholder="John Doe"
                                required
                            />
                          </div>
                        </div>
                    )}

                    {!isLogin && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="phone">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input pl-10 w-full p-3 border border-gray-300 rounded-lg"
                                placeholder="+1 (555) 123-4567"
                            />
                          </div>
                        </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="email">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input pl-10 w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="you@example.com"
                            required
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="password">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input pl-10 w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="••••••••"
                            required
                        />
                      </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {isLoading ? (
                          <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                      ) : (
                          <>
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                      )}
                    </button>

                    <div className="mt-6 text-center">
                      <p className="text-neutral-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-blue-600 hover:text-blue-500 font-medium"
                        >
                          {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
        )}
      </AnimatePresence>
  );
};

export default AuthModal;