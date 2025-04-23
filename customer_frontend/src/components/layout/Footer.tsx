import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Ticket, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  CreditCard,
  ShieldCheck,
  Headphones
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white">
      {/* Features */}
      <div className="border-b border-neutral-100">
        <div className="container-custom py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary p-3 rounded-xl">
                <CreditCard className="h-6 w-6 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Secure Payments</h3>
                <p className="text-neutral-500 text-sm">Multiple payment options with end-to-end encryption</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary p-3 rounded-xl">
                <ShieldCheck className="h-6 w-6 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Ticket Guarantee</h3>
                <p className="text-neutral-500 text-sm">Verified tickets and 100% money-back guarantee</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary p-3 rounded-xl">
                <Headphones className="h-6 w-6 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">24/7 Customer Support</h3>
                <p className="text-neutral-500 text-sm">Dedicated support team available around the clock</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-6">
              <Ticket className="h-8 w-8 text-accent" strokeWidth={1.5} />
              <span className="ml-2 text-2xl font-bold font-heading text-text">Eventix</span>
            </Link>
            <p className="text-neutral-600 mb-6">
              Discover and book the best events happening in your city. From concerts to workshops, find tickets for all your favorite events.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-primary hover:bg-secondary transition-all duration-300">
                <Facebook className="h-5 w-5 text-text-secondary" strokeWidth={1.5} />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary hover:bg-secondary transition-all duration-300">
                <Twitter className="h-5 w-5 text-text-secondary" strokeWidth={1.5} />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary hover:bg-secondary transition-all duration-300">
                <Instagram className="h-5 w-5 text-text-secondary" strokeWidth={1.5} />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary hover:bg-secondary transition-all duration-300">
                <Youtube className="h-5 w-5 text-text-secondary" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-lg font-medium mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-neutral-600 hover:text-accent transition-all duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-neutral-600 hover:text-accent transition-all duration-300">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-neutral-600 hover:text-accent transition-all duration-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-neutral-600 hover:text-accent transition-all duration-300">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-neutral-600 hover:text-accent transition-all duration-300">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/help" className="text-neutral-600 hover:text-accent transition-all duration-300">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-neutral-600 hover:text-accent transition-all duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-600 hover:text-accent transition-all duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-neutral-600 hover:text-accent transition-all duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-neutral-600 hover:text-accent transition-all duration-300">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-medium mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-accent mr-3 mt-0.5" strokeWidth={1.5} />
                <span className="text-neutral-600">123 Event Street, San Francisco, CA 94107</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-accent mr-3" strokeWidth={1.5} />
                <a href="tel:+14155550123" className="text-neutral-600 hover:text-accent transition-all duration-300">
                  +1 (415) 555-0123
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-accent mr-3" strokeWidth={1.5} />
                <a href="mailto:support@eventix.com" className="text-neutral-600 hover:text-accent transition-all duration-300">
                  support@eventix.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-neutral-100">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Eventix. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <Link to="/terms" className="text-neutral-500 hover:text-accent text-sm transition-all duration-300">
                Terms
              </Link>
              <Link to="/privacy" className="text-neutral-500 hover:text-accent text-sm transition-all duration-300">
                Privacy
              </Link>
              <Link to="/cookies" className="text-neutral-500 hover:text-accent text-sm transition-all duration-300">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;