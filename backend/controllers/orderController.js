import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../config/emailService.js';
import { generateOrderInvoicePDFBuffer } from '../config/pdfService.js';

const makeInvoiceNumber = () => `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
const addDays = (date, days) => new Date(new Date(date).getTime() + days * 24 * 60 * 60 * 1000);

const mapEmailResultToStatus = (result) => (result?.mock ? 'mock' : 'sent');

const recordEmailLog = async (order, { type, status, to, subject, message }) => {
  order.emailDeliveryStatus = status;
  order.emailLogs.push({ type, status, to, subject, message });
  order.auditLogs.push({
    action: `email_${type}`,
    message: `${subject} ${status === 'mock' ? 'generated in mock mode' : status}`,
    actor: 'system'
  });
  await order.save();
};

const sendAndRecordOrderEmail = async (order, user, type = 'confirmation', statusType = 'confirmed', message = '') => {
  const populatedOrder = order.populate ? order : await Order.findById(order._id);
  try {
    const result = type === 'confirmation' || type === 'invoice_resend'
      ? await sendOrderConfirmationEmail(populatedOrder, user)
      : await sendOrderStatusEmail(populatedOrder, user, statusType, message);
    await recordEmailLog(populatedOrder, {
      type,
      status: mapEmailResultToStatus(result),
      to: user.email,
      subject: type === 'invoice_resend'
        ? `Invoice Copy - Order #${populatedOrder._id}`
        : type === 'confirmation'
          ? `Order Confirmation - Order #${populatedOrder._id}`
          : `${statusType} - Order #${populatedOrder._id}`,
      message: result?.message || result?.messageId || 'Email accepted by mail provider'
    });
    return result;
  } catch (error) {
    await recordEmailLog(populatedOrder, {
      type,
      status: 'failed',
      to: user.email,
      subject: type === 'invoice_resend'
        ? `Invoice Copy - Order #${populatedOrder._id}`
        : type === 'confirmation'
          ? `Order Confirmation - Order #${populatedOrder._id}`
          : `${statusType} - Order #${populatedOrder._id}`,
      message: error.message
    });
    throw error;
  }
};

// @desc    Create new order (B2C or B2B)
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    billingAddress,
    paymentMethod,
    purchaseOrderNumber,
    taxAmount,
    shippingAmount,
    totalAmount
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // Validate stock and verify pricing logic (B2B vs B2C)
    // In production, we'd recalculate prices on server side, let's do a basic check
    const type = req.user.role === 'b2b' && req.user.b2bProfile?.verificationStatus === 'approved' ? 'b2b' : 'b2c';

    // Verify and decrement stock
    const enrichedOrderItems = [];
    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (dbProduct.stock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for product: ${item.name}` });
      }
      // Decrement stock
      dbProduct.stock -= item.qty;
      await dbProduct.save();

      const gstRate = Number(item.gstRate || 12);
      enrichedOrderItems.push({
        ...item,
        sku: dbProduct.sku,
        hsnCode: item.hsnCode || '30059090',
        gstRate,
        gstAmount: Math.round(Number(item.price || 0) * Number(item.qty || 0) * (gstRate / 100))
      });
    }

    const order = new Order({
      user: req.user._id,
      orderType: type,
      orderItems: enrichedOrderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      purchaseOrderNumber: type === 'b2b' ? purchaseOrderNumber : undefined,
      paymentStatus: paymentMethod === 'credit_card' ? 'unpaid' : 'paid', // credit card starts unpaid until verified, others (invoice/bank transfer) are unpaid, manual/cod is paid/unpaid
      invoiceNumber: makeInvoiceNumber(),
      invoiceGeneratedAt: new Date(),
      estimatedDeliveryDate: addDays(new Date(), type === 'b2b' ? 7 : 5),
      totalAmount,
      taxAmount,
      shippingAmount,
      discountAmount: Number(req.body.discountAmount || 0),
      auditLogs: [{ action: 'invoice_generated', message: 'Invoice number generated during order confirmation', actor: 'system' }]
    });

    const createdOrder = await order.save();
    
    sendAndRecordOrderEmail(createdOrder, req.user, 'confirmation').catch(err => {
      console.error(`Order confirmation email failure: ${err.message}`);
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (order) {
      // Allow only the owner or an admin to access
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email phone b2bProfile').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order payment status to paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.paymentStatus = 'paid';
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order fulfillment status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { status, trackingNumber } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const previousStatus = order.orderStatus;
      order.orderStatus = status || order.orderStatus;
      if (trackingNumber) {
        order.trackingNumber = trackingNumber;
      }
      const updatedOrder = await order.save();

      if (status && status !== previousStatus) {
        const populatedOrder = await Order.findById(order._id).populate('user', 'name email phone');
        const statusTypeMap = {
          pending: 'confirmed',
          processing: 'processing',
          shipped: 'shipped',
          out_for_delivery: 'out_for_delivery',
          delivered: 'delivered',
          cancelled: 'cancelled',
          refund_initiated: 'refund_initiated',
          refund_completed: 'refund_completed'
        };
        sendAndRecordOrderEmail(
          populatedOrder,
          populatedOrder.user,
          'status_update',
          statusTypeMap[status] || status,
          `Your order status is now ${status.replace(/_/g, ' ')}.`
        ).catch(err => console.error(`Order status email failure: ${err.message}`));
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate PDF Invoice for B2B/B2C order
// @route   GET /api/orders/:id/invoice
// @access  Private
export const getOrderInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone b2bProfile');

    if (order) {
      // Allow only the owner or an admin to access
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to download this invoice' });
      }
      
      const pdfBuffer = await generateOrderInvoicePDFBuffer(order, order.user);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Invoice_${order._id}.pdf`);
      res.end(pdfBuffer);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resend invoice PDF by email
// @route   POST /api/orders/:id/resend-invoice
// @access  Private
export const resendOrderInvoiceEmail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone b2bProfile');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to resend this invoice' });
    }

    const result = await sendAndRecordOrderEmail(order, order.user, 'invoice_resend', 'confirmed', 'Your requested invoice copy is attached.');
    res.json({
      message: result?.mock ? 'Invoice email generated in mock mode.' : 'Invoice email resent successfully.',
      emailStatus: result?.mock ? 'mock' : 'sent',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
