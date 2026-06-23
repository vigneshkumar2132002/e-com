import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/orderModel.js';

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId === 'mock_key' || !keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
};

// @desc    Initiate Razorpay Order
// @route   POST /api/orders/razorpay-order
// @access  Private
export const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid order amount' });
  }

  const razorpay = getRazorpayInstance();
  const options = {
    amount: Math.round(amount * 100), // Razorpay expects amount in paise (1 INR = 100 paise)
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`
  };

  try {
    if (!razorpay) {
      // Mock Mode Fallback: return mock Razorpay Order
      console.log('Running in MOCK RAZORPAY mode');
      return res.status(201).json({
        id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(4, 9)}`,
        amount: options.amount,
        currency: 'INR',
        mock: true,
        key_id: 'mock_key'
      });
    }

    const razorpayOrder = await razorpay.orders.create(options);
    res.status(201).json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: `Razorpay Order initialization failure: ${error.message}` });
  }
};

// @desc    Verify Razorpay Signature & complete order payment
// @route   POST /api/orders/razorpay-verify
// @access  Private
export const verifyRazorpayPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    db_order_id
  } = req.body;

  if (!db_order_id) {
    return res.status(400).json({ message: 'Missing database order reference ID' });
  }

  const razorpay = getRazorpayInstance();

  try {
    const order = await Order.findById(db_order_id);
    if (!order) {
      return res.status(404).json({ message: 'Database order document not found' });
    }

    if (!razorpay) {
      // Mock Verification Fallback
      console.log('Verifying in MOCK RAZORPAY signature mode');
      order.paymentStatus = 'paid';
      await order.save();
      return res.json({ success: true, mock: true, message: 'Mock payment verified successfully' });
    }

    // Verify cryptographic signature
    const signatureBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(signatureBody)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      order.paymentStatus = 'paid';
      // Record payment ref
      order.purchaseOrderNumber = `RPAY-${razorpay_payment_id}`;
      await order.save();
      res.json({ success: true, message: 'Razorpay payment verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid payment signature: verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: `Razorpay verification failure: ${error.message}` });
  }
};
