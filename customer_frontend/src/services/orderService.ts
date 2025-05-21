import api from './api';

export interface OrderTicket {
  ticket_id: string;
  quantity: number;
  _id?: string;
}

export interface Order {
  _id: string;
  order_id: string;
  email: string;
  tickets_bought: OrderTicket[];
  total_price: number;
  order_status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  __type?: string;
  __v?: number;
  id?: string;
}

export interface CreateOrderData {
  tickets: { ticket_id: string; quantity: number }[];
  email: string;
}

// Get all orders for the authenticated user
export const getMyOrders = async (): Promise<Order[]> => {
  try {
    console.log('Fetching orders...');
    const response = await api.get<{ data: Order[] }>('/api/orders/my-orders');
    console.log('Orders response:', response);
    
    if (!response.data || !response.data.data) {
      console.error('Invalid response format:', response);
      throw new Error('Invalid response format');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Get a specific order
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get<{ data: Order }>(`/api/orders/${orderId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  try {
    const response = await api.post<{ data: Order }>('/api/orders', orderData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Update order status (e.g., cancel order)
export const updateOrderStatus = async (orderId: string, status: 'CANCELLED'): Promise<Order> => {
  try {
    const response = await api.patch<{ data: Order }>(
      `/api/orders/${orderId}/status`,
      { status }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}; 