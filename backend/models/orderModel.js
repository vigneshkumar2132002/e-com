import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  name: { type: String, required: true },
  sku: { type: String },
  hsnCode: { type: String, default: '30059090' },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  gstRate: { type: Number, default: 12 },
  gstAmount: { type: Number, default: 0 },
  image: { type: String }
}, { _id: false });

const emailLogSchema = new mongoose.Schema({
  type: { type: String, required: true },
  status: { type: String, enum: ['sent', 'mock', 'failed'], required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String },
  sentAt: { type: Date, default: Date.now }
}, { _id: false });

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  message: { type: String },
  actor: { type: String, default: 'system' },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderType: { type: String, enum: ['b2c', 'b2b'], required: true },
  orderItems: [orderItemSchema],
  
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  billingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  
  paymentMethod: { 
    type: String, 
    enum: ['credit_card', 'net_banking', 'invoice', 'purchase_order', 'cod'], 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'paid', 'processing', 'refunded'], 
    default: 'unpaid' 
  },
  orderStatus: { 
    type: String,
    enum: ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refund_initiated', 'refund_completed'],
    default: 'pending' 
  },
  
  // B2B specific purchase order
  purchaseOrderNumber: { type: String },
  invoiceNumber: { type: String, unique: true, sparse: true },
  invoiceGeneratedAt: { type: Date },
  invoicePdfPath: { type: String },
  estimatedDeliveryDate: { type: Date },
  
  totalAmount: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  shippingAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  
  trackingNumber: { type: String },
  emailDeliveryStatus: { type: String, enum: ['not_sent', 'sent', 'mock', 'failed'], default: 'not_sent' },
  emailLogs: [emailLogSchema],
  auditLogs: [auditLogSchema],
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
