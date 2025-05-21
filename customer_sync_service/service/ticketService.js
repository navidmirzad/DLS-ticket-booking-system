import SyncTicket from "../model/Ticket.js";

export const createTicket = async (ticketData) => {
  try {
    const ticket = new SyncTicket(ticketData);
    await ticket.save();
    console.log("Ticket created successfully");
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

export const updateTicket = async (ticketData) => {
  try {
    await SyncTicket.findByIdAndUpdate(ticketData.id, ticketData);
    console.log("Ticket updated successfully");
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

export const deleteTicket = async (ticketData) => {
  try {
    await SyncTicket.findByIdAndDelete(ticketData.id);
    console.log("Ticket deleted successfully");
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw error;
  }
}; 