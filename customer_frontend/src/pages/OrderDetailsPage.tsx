import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order, getOrderById, updateOrderStatus } from '../services/orderService';

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        setError(null);
      } catch (err) {
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      await updateOrderStatus(order._id, 'cancelled');
      // Refresh order details
      const updatedOrder = await getOrderById(order._id);
      setOrder(updatedOrder);
    } catch (err) {
      setError('Failed to cancel order. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center p-4 text-red-600">
          <p>{error || 'Order not found'}</p>
          <button
            className="mt-4 text-blue-600 hover:text-blue-800"
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Order #{order._id.slice(-6)}
            </h2>
            <p className="text-gray-600">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p className="text-gray-600">{order.email}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div className="border-t border-gray-200 py-6">
          <h3 className="text-lg font-semibold mb-4">Tickets</h3>
          <div className="space-y-4">
            {order.tickets.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{item.ticket.event.title}</h4>
                  <p className="text-gray-600">{item.ticket.type}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.ticket.event.date).toLocaleDateString()}
                    {' at '}
                    {item.ticket.event.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {item.quantity} × ${item.ticket.price.toFixed(2)}
                  </p>
                  <p className="text-lg font-semibold">
                    ${(item.quantity * item.ticket.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center text-lg font-semibold">
            <p>Total</p>
            <p>${order.total_price.toFixed(2)}</p>
          </div>
        </div>

        {order.status === 'pending' && (
          <div className="mt-8 flex justify-end">
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={handleCancelOrder}
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage; 