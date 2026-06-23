import express from 'express';
import { 
  addOrderItems, 
  getOrderById, 
  getMyOrders, 
  getOrders, 
  updateOrderToPaid, 
  updateOrderStatus,
  getOrderInvoice,
  resendOrderInvoiceEmail
} from '../controllers/orderController.js';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/razorpayController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.post('/razorpay-order', protect, createRazorpayOrder);
router.post('/razorpay-verify', protect, verifyRazorpayPayment);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/invoice')
  .get(protect, getOrderInvoice);

router.route('/:id/resend-invoice')
  .post(protect, resendOrderInvoiceEmail);

router.route('/:id/pay')
  .put(protect, admin, updateOrderToPaid);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

export default router;
