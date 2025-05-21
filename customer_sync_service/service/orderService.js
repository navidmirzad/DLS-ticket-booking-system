import SyncOrder from "../model/Order.js";

export const createOrder = async (orderData) => {
  try {
    const order = new SyncOrder(orderData);
    await order.save();
    console.log("Order created successfully");
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const updateOrder = async (orderData) => {
  try {
    await SyncOrder.findByIdAndUpdate(orderData.id, orderData);
    console.log("Order updated successfully");
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const deleteOrder = async (orderData) => {
  try {
    await SyncOrder.findByIdAndUpdate(orderData.id, { deleted_at: new Date() });
    console.log("Order soft deleted successfully");
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}; 