import nodemailer from 'nodemailer';
import { generateOemInquiryPDFBuffer, generateOrderInvoicePDFBuffer } from './pdfService.js';

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@bapujisurgicals.com';
const SUPPORT_PHONE = process.env.SUPPORT_PHONE || '+91 XXXXX XXXXX';
const WEBSITE_URL = process.env.WEBSITE_URL || 'www.bapujisurgicals.com';
const formatINR = (amount = 0) => `INR ${Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const formatDate = (value) => new Date(value || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const formatAddress = (address = {}) => [address.street, address.city, address.state, address.zipCode, address.country].filter(Boolean).join(', ');

// Helper to create SMTP transporter
const getTransporter = () => {
  const isMock = process.env.SMTP_USER === 'mock_user' || !process.env.SMTP_HOST;
  
  if (isMock) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '588'),
    secure: process.env.SMTP_PORT === '465', // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Generic email dispatch helper
const sendMailHelper = async ({ to, subject, html, text, attachments = [] }) => {
  const from = process.env.FROM_EMAIL || 'noreply@bapujisurgicals.com';
  const transporter = getTransporter();

  if (!transporter) {
    // Mock Mode Fallback: print to console for development verification
    console.log('\x1b[36m%s\x1b[0m', '=================== MOCK EMAIL DISPATCH ===================');
    console.log(`To:      ${to}`);
    console.log(`From:    ${from}`);
    console.log(`Subject: ${subject}`);
    if (attachments.length > 0) {
      console.log(`Attachments: ${attachments.map((attachment) => attachment.filename).join(', ')}`);
    }
    console.log('-----------------------------------------------------------');
    console.log(text || html.replace(/<[^>]*>/g, '').trim().substring(0, 300) + '...');
    console.log('\x1b[36m%s\x1b[0m', '===========================================================');
    return { mock: true, message: 'Mock email logged successfully' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Bapuji Surgicals" <${from}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''),
      html,
      attachments
    });
    console.log(`Email dispatched to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Email dispatch failure to ${to}: ${error.message}`);
    throw error;
  }
};

// 1. Order Confirmation Email
const sendOrderConfirmationEmailLegacy = async (order, userDetails) => {
  const itemsHtml = order.orderItems.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.qty}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price * item.qty}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #0b8497; text-align: center;">Bapuji Surgicals Order Confirmed</h2>
      <p>Dear ${userDetails.name},</p>
      <p>Thank you for your order! We are preparing your surgical supplies for dispatch. Here are your transaction details:</p>
      
      <div style="background-color: #f7f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>Order ID:</strong> ${order._id}<br/>
        <strong>Payment Method:</strong> ${order.paymentMethod.replace('_', ' ')} (${order.paymentStatus})<br/>
        ${order.purchaseOrderNumber ? `<strong>PO Reference:</strong> ${order.purchaseOrderNumber}<br/>` : ''}
        <strong>Shipping Address:</strong> ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #eee;">
            <th style="padding: 8px; text-align: left;">Product</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; font-size: 1.1em; font-weight: bold; margin-bottom: 30px;">
        Total Paid: ₹${order.totalAmount}
      </div>

      <hr style="border: none; border-top: 1px solid #eee;"/>
      <p style="font-size: 0.85em; color: #777; text-align: center;">
        Bapuji Surgicals - No. 12, Rajajinagar Industrial Area, Bengaluru, India
      </p>
    </div>
  `;

  const invoiceBuffer = await generateOrderInvoicePDFBuffer(order, userDetails);

  return sendMailHelper({
    to: userDetails.email,
    subject: `Order Confirmation - Bapuji Surgicals [ID: ${order._id}]`,
    html,
    attachments: [
      {
        filename: `Bapuji-Surgicals-Invoice-${order._id}.pdf`,
        content: invoiceBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
};

export const sendOrderConfirmationEmail = async (order, userDetails) => {
  const subtotal = Number(order.totalAmount || 0) - Number(order.taxAmount || 0) - Number(order.shippingAmount || 0) + Number(order.discountAmount || 0);
  const deliveryDate = order.estimatedDeliveryDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const itemsHtml = (order.orderItems || []).map(item => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb;">${item.name}</td>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb;">${item.sku || item.product || 'BAP-SKU'}</td>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.qty}</td>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatINR(item.price)}</td>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatINR(Number(item.price || 0) * Number(item.qty || 0))}</td>
    </tr>
  `).join('');

  const html = `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:720px;margin:0 auto;padding:24px;">
        <div style="background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;">
          <div style="background:#0b1116;color:#ffffff;padding:24px 28px;">
            <div style="font-size:24px;font-weight:800;">Bapuji Surgicals</div>
            <div style="font-size:13px;color:#cbd5e1;margin-top:4px;">Order Confirmation & Tax Invoice</div>
          </div>
          <div style="padding:28px;">
            <p style="font-size:16px;">Dear ${userDetails.name || 'Customer'},</p>
            <p style="line-height:1.6;">Thank you for choosing Bapuji Surgicals.</p>
            <p style="line-height:1.6;">We are pleased to confirm that your order has been successfully placed and is currently being processed.</p>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin:22px 0;">
              <div><strong>Order ID:</strong> ${order._id}</div>
              <div><strong>Order Date:</strong> ${formatDate(order.createdAt)}</div>
              <div><strong>Payment Method:</strong> ${String(order.paymentMethod || '').replace(/_/g, ' ')}</div>
              <div><strong>Payment Status:</strong> ${String(order.paymentStatus || '').toUpperCase()}</div>
              <div><strong>Estimated Delivery Date:</strong> ${formatDate(deliveryDate)}</div>
            </div>
            <h3 style="margin-top:0;">Shipping Address</h3>
            <p style="line-height:1.5;background:#ffffff;border-left:4px solid #0976BC;padding:10px 14px;">${formatAddress(order.shippingAddress)}</p>
            <h3>Ordered Products</h3>
            <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
              <thead>
                <tr style="background:#0b1116;color:#ffffff;">
                  <th style="padding:10px;text-align:left;">Product Name</th>
                  <th style="padding:10px;text-align:left;">SKU</th>
                  <th style="padding:10px;text-align:center;">Quantity</th>
                  <th style="padding:10px;text-align:right;">Unit Price</th>
                  <th style="padding:10px;text-align:right;">Total Price</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <div style="background:#f8fafc;border-radius:14px;padding:16px;border:1px solid #e2e8f0;">
              <div style="display:flex;justify-content:space-between;"><span>Subtotal</span><strong>${formatINR(subtotal)}</strong></div>
              <div style="display:flex;justify-content:space-between;"><span>GST/Tax</span><strong>${formatINR(order.taxAmount)}</strong></div>
              <div style="display:flex;justify-content:space-between;"><span>Shipping Charges</span><strong>${formatINR(order.shippingAmount)}</strong></div>
              <div style="display:flex;justify-content:space-between;"><span>Discount Applied</span><strong>${formatINR(order.discountAmount)}</strong></div>
              <div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid #cbd5e1;font-size:17px;"><span>Grand Total</span><strong>${formatINR(order.totalAmount)}</strong></div>
            </div>
            <p style="line-height:1.6;">You can track your order using your customer dashboard.</p>
            <p style="line-height:1.6;">If you have any questions regarding your order, please contact our customer support team.</p>
            <p>Thank you for your business.</p>
            <p style="line-height:1.5;">Warm Regards,<br/><strong>Bapuji Surgicals</strong><br/>Customer Support Team</p>
            <div style="font-size:13px;color:#475569;">
              Email: <a href="mailto:${SUPPORT_EMAIL}" style="color:#0976BC;">${SUPPORT_EMAIL}</a><br/>
              Phone: ${SUPPORT_PHONE}<br/>
              Website: <a href="https://${WEBSITE_URL}" style="color:#0976BC;">${WEBSITE_URL}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const invoiceBuffer = await generateOrderInvoicePDFBuffer(order, userDetails);
  return sendMailHelper({
    to: userDetails.email,
    subject: `Order Confirmation - Order #${order._id}`,
    html,
    attachments: [{
      filename: `Invoice_${order._id}.pdf`,
      content: invoiceBuffer,
      contentType: 'application/pdf'
    }]
  });
};

export const sendOrderStatusEmail = async (order, userDetails, statusType, message) => {
  const titleMap = {
    confirmed: 'Order Confirmed',
    processing: 'Order Processing',
    shipped: 'Order Shipped',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Order Delivered',
    cancelled: 'Order Cancelled',
    refund_initiated: 'Refund Initiated',
    refund_completed: 'Refund Completed'
  };
  const title = titleMap[statusType] || 'Order Update';
  const html = `
    <div style="margin:0;padding:24px;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;">
        <div style="background:#0b1116;color:#ffffff;padding:22px 26px;">
          <div style="font-size:22px;font-weight:800;">Bapuji Surgicals</div>
          <div style="font-size:13px;color:#cbd5e1;">${title}</div>
        </div>
        <div style="padding:26px;">
          <p>Dear ${userDetails.name || 'Customer'},</p>
          <p style="line-height:1.6;">${message || `Your order #${order._id} status has been updated to ${title}.`}</p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin:20px 0;">
            <strong>Order ID:</strong> ${order._id}<br/>
            <strong>Status:</strong> ${title}<br/>
            ${order.trackingNumber ? `<strong>Tracking Number:</strong> ${order.trackingNumber}<br/>` : ''}
            <strong>Updated:</strong> ${formatDate(new Date())}
          </div>
          <p>You can view full details and download your invoice from your customer dashboard.</p>
          <p>Warm Regards,<br/><strong>Bapuji Surgicals Customer Support Team</strong></p>
        </div>
      </div>
    </div>
  `;
  return sendMailHelper({
    to: userDetails.email,
    subject: `${title} - Order #${order._id}`,
    html
  });
};

// 2. B2B Registration Received Alert
export const sendB2BRegistrationReceivedEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #0b8497; text-align: center;">B2B Application Received</h2>
      <p>Dear ${user.name},</p>
      <p>We have successfully received your B2B Wholesaler request for <strong>${user.b2bProfile.companyName}</strong> (GSTIN: ${user.b2bProfile.gstinOrTaxId}).</p>
      <p>Our compliance officers are currently reviewing your drug license and tax documents. We will notify you via email as soon as your wholesale status is approved.</p>
      <p>If you have any urgent questions, please feel free to reply to this email.</p>
      <hr style="border: none; border-top: 1px solid #eee;"/>
      <p style="font-size: 0.85em; color: #777; text-align: center;">
        Bapuji Surgicals Wholesaler Division
      </p>
    </div>
  `;

  return sendMailHelper({
    to: user.email,
    subject: `B2B Wholesaler Request Received - Bapuji Surgicals`,
    html
  });
};

// 3. B2B Status Verification Updated (Approve/Reject)
export const sendB2BStatusUpdatedEmail = async (user, status) => {
  const isApproved = status === 'approved';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: ${isApproved ? '#28a745' : '#dc3545'}; text-align: center;">
        B2B Wholesaler Application ${isApproved ? 'Approved' : 'Declined'}
      </h2>
      <p>Dear ${user.name},</p>
      
      ${isApproved ? `
        <p>Congratulations! Your business profile for <strong>${user.b2bProfile.companyName}</strong> has been verified and approved.</p>
        <p>The next time you log in to Bapuji Surgicals, wholesale tiered contract prices will be active in the catalog, and you can pay invoices via Purchase Orders (PO).</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/login" style="background-color: #0b8497; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Log In To Wholesale Shop
          </a>
        </div>
      ` : `
        <p>Thank you for your interest in our B2B Wholesaler Program. Unfortunately, we were unable to approve your application for <strong>${user.b2bProfile.companyName}</strong> at this time.</p>
        <p>This is usually due to incomplete/unreadable drug license uploads or mismatched GSTIN numbers. Please apply again with corrected documentation or reply directly to this mail to negotiate terms.</p>
      `}
      
      <hr style="border: none; border-top: 1px solid #eee;"/>
      <p style="font-size: 0.85em; color: #777; text-align: center;">
        Bapuji Surgicals Wholesaler Division
      </p>
    </div>
  `;

  return sendMailHelper({
    to: user.email,
    subject: `B2B Wholesaler Account Status: ${status.toUpperCase()} - Bapuji Surgicals`,
    html
  });
};

// 4. OEM RFQ Inquiry Received
export const sendOemInquiryReceivedEmail = async (inquiry) => {
  const estimatedUnitPrice = inquiry.targetQuantity < 1000 ? 28 : inquiry.targetQuantity < 5000 ? 24 : 19;
  const estimatedTotal = inquiry.targetQuantity * estimatedUnitPrice;
  const pdfBuffer = await generateOemInquiryPDFBuffer(inquiry, {
    unitPrice: estimatedUnitPrice,
    totalAmount: estimatedTotal
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 14px; background: #ffffff;">
      <div style="border-bottom: 3px solid #0976BC; padding-bottom: 14px; margin-bottom: 22px;">
        <h2 style="color: #0f172a; margin: 0;">Bapuji Surgicals</h2>
        <p style="color: #64748b; margin: 4px 0 0 0;">Formal OEM Manufacturing RFQ Acknowledgement</p>
      </div>
      <p>Dear ${inquiry.contactPerson},</p>
      <p>Thank you for submitting your OEM wet wipes manufacturing request. We have registered your RFQ and our sales/production team will contact you using the details below.</p>
      
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 10px; margin: 20px 0; font-size: 0.92em; border: 1px solid #e2e8f0;">
        <strong>RFQ ID:</strong> OEM-${inquiry._id.toString().slice(-6).toUpperCase()}<br/>
        <strong>Company:</strong> ${inquiry.companyName}<br/>
        <strong>Contact:</strong> ${inquiry.contactPerson}<br/>
        <strong>Email:</strong> ${inquiry.email}<br/>
        <strong>Phone:</strong> ${inquiry.phone}<br/>
      </div>

      <div style="background-color: #f8fafc; padding: 16px; border-radius: 10px; margin: 20px 0; font-size: 0.92em; border: 1px solid #e2e8f0;">
        <strong>Product Category:</strong> ${inquiry.productCategory.replace(/-/g, ' ')}<br/>
        <strong>Material:</strong> ${inquiry.specifications.material || 'Custom'}<br/>
        <strong>Dimensions:</strong> ${inquiry.specifications.dimensions || 'Custom'}<br/>
        <strong>Sterilization / Formula:</strong> ${inquiry.specifications.sterilization || 'Custom'}<br/>
        <strong>Packaging:</strong> ${inquiry.specifications.packaging || 'Custom'}<br/>
        <strong>Quantity:</strong> ${inquiry.targetQuantity} units<br/>
        <strong>Estimated Value:</strong> INR ${estimatedTotal.toLocaleString('en-IN')} (${estimatedUnitPrice}/unit estimate)
      </div>

      <p>A formal PDF acknowledgement/invoice copy is attached to this email for your records. Final pricing, GST, freight, and delivery dates will be confirmed by our sales team after technical review.</p>
      <p>We will reply with the confirmed quotation and lead-time schedule within 2 business days.</p>
      <hr style="border: none; border-top: 1px solid #eee;"/>
      <p style="font-size: 0.85em; color: #777; text-align: center;">
        Bapuji Surgicals Custom OEM Division
      </p>
    </div>
  `;

  return sendMailHelper({
    to: inquiry.email,
    subject: `OEM Manufacturing RFQ Received - Bapuji Surgicals`,
    html,
    attachments: [
      {
        filename: `Bapuji-Surgicals-OEM-RFQ-${inquiry._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
};

// 5. OEM Quotation Issued / Updated
export const sendOemQuotationUpdatedEmail = async (inquiry) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #0b8497; text-align: center;">OEM Factory Quotation Issued</h2>
      <p>Dear ${inquiry.contactPerson},</p>
      <p>Our engineering desk has reviewed your specifications and provided a pricing quote for your custom manufacturing request:</p>
      
      <div style="background-color: #f7f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; border: 1px solid #e1e8ed;">
        <span style="font-size: 0.85em; color: #777; display: block; margin-bottom: 6px;">Factory Unit Quote</span>
        <strong style="font-size: 1.8em; color: #0b8497;">₹${inquiry.quotedPrice} <span style="font-size: 0.5em; color: #555;">/ unit</span></strong><br/>
        <span style="font-size: 0.85em; color: #555; display: block; margin-top: 8px;">
          <strong>Target Volume:</strong> ${inquiry.targetQuantity} units
        </span>
      </div>

      ${inquiry.adminFeedback ? `
        <p style="font-style: italic; background-color: #fff9e6; border-left: 3px solid #ffc107; padding: 10px; border-radius: 4px;">
          <strong>Factory Feedback:</strong> "${inquiry.adminFeedback}"
        </p>
      ` : ''}

      <p>Please log in to your account dashboard to accept or negotiate this quotation.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:3000/oem" style="background-color: #0b8497; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Review OEM Quotation
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #eee;"/>
      <p style="font-size: 0.85em; color: #777; text-align: center;">
        Bapuji Surgicals Custom OEM Division
      </p>
    </div>
  `;

  return sendMailHelper({
    to: inquiry.email,
    subject: `OEM Quotation Issued: ₹${inquiry.quotedPrice}/unit - Bapuji Surgicals`,
    html
  });
};
