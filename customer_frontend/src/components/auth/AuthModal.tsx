import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: '1',
      name: formData.name || 'John Doe',
      email: formData.email
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

                    <h2 className="text-2xl font-bold text-text mb-2">
                      {isLogin ? 'Welcome back!' : 'Create an account'}
                    </h2>
                    <p className="text-neutral-600 mb-6">
                      {isLogin
                          ? 'Sign in to access your account and book tickets.'
                          : 'Join Eventix to start booking amazing events.'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6">
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
                                className="input pl-10"
                                placeholder="John Doe"
                                required
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
                            className="input pl-10"
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
                            className="input pl-10"
                            placeholder="••••••••"
                            required
                        />
                      </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full flex items-center justify-center"
                    >
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>

                    <div className="mt-6 text-center">
                      <p className="text-neutral-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-accent hover:text-accent/80 font-medium"
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
