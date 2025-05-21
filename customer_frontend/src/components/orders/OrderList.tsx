import React, { useEffect, useState } from 'react';
import { Order, getMyOrders, updateOrderStatus } from '../../services/orderService';

interface OrderListProps {
  onSelectOrder?: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'cancelled');
      // Refresh orders after cancellation
      fetchOrders();
    } catch (err) {
      setError('Failed to cancel order. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-4 text-gray-600">
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-lg shadow-md p-4"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                Order #{order._id.slice(-6)}
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 rounded-full text-sm ${
                order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {order.tickets.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">{item.ticket.event.title}</p>
                  <p className="text-gray-600">{item.ticket.type} × {item.quantity}</p>
                </div>
                <p className="font-medium">
                  ${(item.ticket.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Total</p>
              <p className="font-bold text-lg">
                ${order.total_price.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              onClick={() => onSelectOrder?.(order)}
            >
              View Details
            </button>
            {order.status === 'pending' && (
              <button
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
                onClick={() => handleCancelOrder(order._id)}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList; 