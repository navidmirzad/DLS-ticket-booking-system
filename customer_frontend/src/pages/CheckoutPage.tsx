import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // Redirect to account page after a delay
      setTimeout(() => {
        navigate('/account');
      }, 3000);
    }, 2000);
  };
  
  if (isComplete) {
    return (
      <div className="bg-primary min-h-[calc(100vh-64px)] flex items-center justify-center py-12">
        <motion.div 
          className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-success" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-text mb-4">Booking Confirmed!</h1>
          <p className="text-neutral-600 mb-6">
            Your booking has been successfully completed. We've sent a confirmation email with all the details.
          </p>
          <button
            onClick={() => navigate('/account')}
            className="btn btn-primary w-full"
          >
            View My Tickets
          </button>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="bg-primary py-12">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-text mb-8">Payment</h1>
          
          <motion.div 
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="p-6 border-b border-neutral-100">
              <h2 className="text-xl font-bold text-text">Credit Card Details</h2>
              <p className="text-neutral-500 text-sm">Enter your payment information securely</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="cardName">
                  Name on Card
                </label>
                <input
                  type="text"
                  id="cardName"
                  className="input"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="cardNumber">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  className="input"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="expiry">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    className="input"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="cvc">
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    className="input"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="billingZip">
                  Billing Zip Code
                </label>
                <input
                  type="text"
                  id="billingZip"
                  className="input"
                  placeholder="94107"
                  required
                />
              </div>
              
              <div className="pt-4 border-t border-neutral-100">
                <button
                  type="submit"
                  className="btn btn-primary w-full relative overflow-hidden"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Complete Payment'
                  )}
                </button>
                
                <p className="mt-4 text-center text-xs text-neutral-500">
                  By completing this purchase, you agree to our Terms of Service, Privacy Policy, and Refund Policy
                </p>
              </div>
            </form>
          </motion.div>
          
          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-neutral-700">
              <span className="font-medium">Demo Note:</span> This is a demonstration checkout page. No real payments are processed. Click "Complete Payment" to simulate a successful booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;