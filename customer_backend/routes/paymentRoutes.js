import express from 'express';
import { createCheckoutSession, handleSuccess } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.get('/success', handleSuccess);

export default router; 