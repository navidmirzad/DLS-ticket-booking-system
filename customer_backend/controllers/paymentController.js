import Stripe from 'stripe';
import { Order, Ticket } from "../models/mongo/index.js";
import { v4 as uuidv4 } from "uuid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { amount, tickets, email, eventId } = req.body;

    if (!amount || !tickets || !email || !eventId) {
      return res.status(400).json({ error: 'Amount, tickets, email, and eventId are required' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Event Tickets',
              description: `${tickets[0].quantity} ticket(s)`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CUSTOMER_FRONTEND}/booking-confirmation?session_id={CHECKOUT_SESSION_ID}&event_id=${eventId}`,
      cancel_url: `${process.env.CUSTOMER_FRONTEND}/events`,
      customer_email: email,
      metadata: {
        tickets: JSON.stringify(tickets),
        email: email,
        event_id: eventId
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const handleSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;
    
    // Retrieve the session to get the payment status and metadata
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      const { tickets, email, event_id } = session.metadata;
      const ticketsData = JSON.parse(tickets);
      
      // Create the order
      const order = new Order({
        order_id: uuidv4(),
        event_id,
        email,
        tickets_bought: ticketsData,
        total_price: session.amount_total / 100, // Convert from cents
        order_status: 'CONFIRMED',
        payment_intent_id: session.payment_intent
      });

      await order.save();
      
      res.json({ success: true, order });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Error handling success:', error);
    res.status(500).json({ error: 'Failed to process payment success' });
  }
}; 