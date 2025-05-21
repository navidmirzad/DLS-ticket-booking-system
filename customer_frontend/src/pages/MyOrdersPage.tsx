import React from 'react';
import OrderList from '../components/orders/OrderList';
import { Order } from '../services/orderService';
import { useNavigate } from 'react-router-dom';

const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectOrder = (order: Order) => {
    navigate(`/orders/${order._id}`);
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <OrderList onSelectOrder={handleSelectOrder} />
    </div>
  );
};

export default MyOrdersPage; 