import PDFDocument from 'pdfkit';

const collectPDFBuffer = (doc) => new Promise((resolve, reject) => {
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => resolve(Buffer.concat(chunks)));
  doc.on('error', reject);
});

const formatINR = (amount = 0) => `INR ${Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export const generateInvoicePDF = (order, res) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  
  // Set response headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Invoice_${order._id}.pdf`);
  
  doc.pipe(res);
  
  // --- Header Brand ---
  // Background decorative header banner
  doc.rect(0, 0, 595, 15).fill('#0b1116'); // Deep Teal banner at the very top
  
  // Title / Brand Name
  doc.fillColor('#0b1116')
     .fontSize(22)
     .font('Helvetica-Bold')
     .text('BAPUJI SURGICALS', 50, 40);
     
  doc.fillColor('#00b4d8')
     .fontSize(9)
     .font('Helvetica-Bold')
     .text('MANUFACTURER & OEM SUPPLIES', 50, 65);
     
  // Company Details (Right aligned)
  doc.fillColor('#4a5568')
     .fontSize(8)
     .font('Helvetica')
     .text('No. 12, Rajajinagar Industrial Area', 400, 40, { align: 'right' })
     .text('Bengaluru, Karnataka - 560010, India', 400, 52, { align: 'right' })
     .text('Email: info@bapujisurgicals.com', 400, 64, { align: 'right' })
     .text('GSTIN: 29BBJPS1234F1Z0', 400, 76, { align: 'right' });
     
  // Solid divider line
  doc.strokeColor('#e2e8f0')
     .lineWidth(1)
     .moveTo(50, 95)
     .lineTo(545, 95)
     .stroke();
     
  // --- Invoice Title ---
  doc.fillColor('#0b1116')
     .fontSize(16)
     .font('Helvetica-Bold')
     .text('TAX INVOICE / RECEIPT', 50, 110);
     
  // --- Two-Column Layout (Invoice Details & Bill To) ---
  // Left Side: Invoice details
  doc.fillColor('#718096').fontSize(9).font('Helvetica-Bold').text('INVOICE DETAILS', 50, 140);
  doc.fillColor('#2d3748').fontSize(9).font('Helvetica')
     .text(`Invoice Number: INV-${order._id.toString().substring(0, 10).toUpperCase()}`, 50, 155)
     .text(`Date of Order: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 168)
     .text(`Payment Method: ${order.paymentMethod.replace('_', ' ').toUpperCase()}`, 50, 181)
     .text(`Payment Status: ${order.paymentStatus.toUpperCase()}`, 50, 194);
     
  if (order.purchaseOrderNumber) {
    doc.font('Helvetica-Bold').text(`PO Reference: ${order.purchaseOrderNumber}`, 50, 207).font('Helvetica');
  }
  
  // Right Side: Client details (Bill To)
  doc.fillColor('#718096').fontSize(9).font('Helvetica-Bold').text('BILL TO', 300, 140);
  doc.fillColor('#2d3748').fontSize(9).font('Helvetica');
  
  let currentY = 155;
  if (order.orderType === 'b2b' && order.user && order.user.b2bProfile) {
    doc.font('Helvetica-Bold').text(order.user.b2bProfile.companyName || order.user.name, 300, currentY).font('Helvetica');
    currentY += 13;
    if (order.user.b2bProfile.gstinOrTaxId) {
      doc.text(`GSTIN: ${order.user.b2bProfile.gstinOrTaxId}`, 300, currentY);
      currentY += 13;
    }
  } else {
    doc.font('Helvetica-Bold').text(order.user?.name || 'Retail Customer', 300, currentY).font('Helvetica');
    currentY += 13;
  }
  
  // Add Shipping Address
  const addr = order.shippingAddress;
  if (addr) {
    doc.text(`${addr.street}`, 300, currentY);
    currentY += 13;
    doc.text(`${addr.city}, ${addr.state} - ${addr.zipCode}`, 300, currentY);
    currentY += 13;
    doc.text(`${addr.country}`, 300, currentY);
  }
  
  // --- Items Table ---
  const tableTop = 250;
  
  // Table Header Background Banner
  doc.rect(50, tableTop, 495, 20).fill('#0b1116');
  
  // Table Header Text
  doc.fillColor('#ffffff')
     .fontSize(8)
     .font('Helvetica-Bold')
     .text('S.No.', 60, tableTop + 6)
     .text('Item Description', 100, tableTop + 6)
     .text('Qty', 320, tableTop + 6, { width: 30, align: 'center' })
     .text('Unit Price (INR)', 370, tableTop + 6, { width: 80, align: 'right' })
     .text('Total (INR)', 470, tableTop + 6, { width: 70, align: 'right' });
     
  let positionY = tableTop + 20;
  doc.fillColor('#2d3748').font('Helvetica').fontSize(8);
  
  if (order.orderItems && order.orderItems.length > 0) {
    order.orderItems.forEach((item, index) => {
      // Draw borders/background for zebra stripes
      if (index % 2 === 1) {
        doc.rect(50, positionY, 495, 20).fill('#f7fafc');
      }
      
      doc.fillColor('#2d3748')
         .text(String(index + 1), 60, positionY + 6)
         .text(item.name, 100, positionY + 6, { width: 200, height: 12, ellipsis: true })
         .text(String(item.qty), 320, positionY + 6, { width: 30, align: 'center' })
         .text(`₹${item.price.toFixed(2)}`, 370, positionY + 6, { width: 80, align: 'right' })
         .text(`₹${(item.price * item.qty).toFixed(2)}`, 470, positionY + 6, { width: 70, align: 'right' });
         
      // Draw thin horizontal grid lines
      doc.strokeColor('#edf2f7').lineWidth(0.5).moveTo(50, positionY + 20).lineTo(545, positionY + 20).stroke();
      
      positionY += 20;
    });
  }
  
  // --- Summary Section ---
  const summaryTop = positionY + 15;
  
  doc.fillColor('#2d3748').font('Helvetica').fontSize(9);
  
  // Calculations
  const subtotal = order.totalAmount - (order.taxAmount || 0) - (order.shippingAmount || 0);
  
  doc.text('Subtotal:', 350, summaryTop, { width: 100, align: 'right' })
     .text(`₹${subtotal.toFixed(2)}`, 450, summaryTop, { width: 90, align: 'right' });
     
  doc.text('GST / Taxes:', 350, summaryTop + 15, { width: 100, align: 'right' })
     .text(`₹${(order.taxAmount || 0).toFixed(2)}`, 450, summaryTop + 15, { width: 90, align: 'right' });
     
  doc.text('Freight / Shipping:', 350, summaryTop + 30, { width: 100, align: 'right' })
     .text(`₹${(order.shippingAmount || 0).toFixed(2)}`, 450, summaryTop + 30, { width: 90, align: 'right' });
     
  // Grand Total banner
  doc.rect(340, summaryTop + 48, 205, 24).fill('#0b1116');
  doc.fillColor('#ffffff')
     .font('Helvetica-Bold')
     .fontSize(10)
     .text('Grand Total:', 350, summaryTop + 55, { width: 90, align: 'left' })
     .text(`₹${order.totalAmount.toFixed(2)}`, 440, summaryTop + 55, { width: 100, align: 'right' });
     
  // --- Footer Details & Trust Seals ---
  const footerTop = 730;
  
  doc.strokeColor('#edf2f7').lineWidth(1).moveTo(50, footerTop - 10).lineTo(545, footerTop - 10).stroke();
  
  doc.fillColor('#a0aec0')
     .font('Helvetica')
     .fontSize(8)
     .text('Bapuji Surgicals - ISO 9001:2015 & GMP Certified manufacturer of absorbent cotton and surgical dressings.', 50, footerTop, { align: 'center' })
     .text('This is a computer-generated invoice and requires no physical signature.', 50, footerTop + 12, { align: 'center' });
     
  doc.end();
};

export const generateOrderInvoicePDFBuffer = async (order, userDetails = {}) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const pdfPromise = collectPDFBuffer(doc);
  const invoiceId = order.invoiceNumber || `INV-${order._id.toString().slice(-10).toUpperCase()}`;
  const subtotal = Number(order.totalAmount || 0) - Number(order.taxAmount || 0) - Number(order.shippingAmount || 0);
  const cgst = Number(order.taxAmount || 0) / 2;
  const sgst = Number(order.taxAmount || 0) / 2;

  doc.rect(0, 0, 595, 18).fill('#0b1116');
  doc.roundedRect(50, 34, 42, 42, 8).fill('#e0f2fe');
  doc.fillColor('#0976BC').font('Helvetica-Bold').fontSize(22).text('B', 64, 44);
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(22).text('BAPUJI SURGICALS', 104, 42);
  doc.fillColor('#0976BC').fontSize(9).text('TAX INVOICE / ORDER CONFIRMATION', 50, 66);
  doc.fillColor('#64748b').font('Helvetica').fontSize(8)
    .text('No. 12, Rajajinagar Industrial Area', 360, 42, { width: 185, align: 'right' })
    .text('Bengaluru, Karnataka - 560010', 360, 54, { width: 185, align: 'right' })
    .text('GSTIN: 29BBJPS1234F1Z0', 360, 66, { width: 185, align: 'right' })
    .text('support@bapujisurgicals.com', 360, 78, { width: 185, align: 'right' });

  doc.strokeColor('#e2e8f0').moveTo(50, 96).lineTo(545, 96).stroke();

  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(15).text('Invoice Details', 50, 118);
  doc.fillColor('#334155').font('Helvetica').fontSize(9)
    .text(`Invoice Number: ${invoiceId}`, 50, 144)
    .text(`Invoice Date: ${new Date(order.invoiceGeneratedAt || order.createdAt || Date.now()).toLocaleDateString('en-IN')}`, 50, 158)
    .text(`Order ID: ${order._id}`, 50, 172)
    .text(`Customer ID: ${order.user?._id || 'N/A'}`, 50, 186)
    .text(`Order Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}`, 50, 200)
    .text(`Payment Method: ${String(order.paymentMethod || '').replace(/_/g, ' ').toUpperCase()}`, 50, 214)
    .text(`Payment Status: ${String(order.paymentStatus || 'pending').toUpperCase()}`, 50, 228);

  const address = order.shippingAddress || {};
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(15).text('Bill / Ship To', 320, 118);
  doc.fillColor('#334155').font('Helvetica').fontSize(9)
    .text(userDetails.name || order.user?.name || 'Customer', 320, 144)
    .text(userDetails.email || order.user?.email || '', 320, 158)
    .text(`Email: ${userDetails.email || order.user?.email || ''}`, 320, 158)
    .text(`Contact: ${userDetails.phone || order.user?.phone || 'N/A'}`, 320, 172)
    .text(`Billing: ${[order.billingAddress?.street, order.billingAddress?.city, order.billingAddress?.state, order.billingAddress?.zipCode].filter(Boolean).join(', ')}`, 320, 186, { width: 210 })
    .text(`Shipping: ${[address.street, address.city, address.state, address.zipCode, address.country].filter(Boolean).join(', ')}`, 320, 212, { width: 210 });

  const tableTop = 250;
  doc.rect(50, tableTop, 495, 24).fill('#0b1116');
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8)
    .text('S.No.', 60, tableTop + 8)
    .text('Product / SKU / HSN', 90, tableTop + 8)
    .text('Qty', 270, tableTop + 8, { width: 30, align: 'center' })
    .text('Unit', 310, tableTop + 8, { width: 55, align: 'right' })
    .text('GST %', 372, tableTop + 8, { width: 35, align: 'right' })
    .text('GST Amt', 412, tableTop + 8, { width: 55, align: 'right' })
    .text('Total', 472, tableTop + 8, { width: 68, align: 'right' });

  let y = tableTop + 26;
  (order.orderItems || []).forEach((item, index) => {
    if (index % 2 === 1) doc.rect(50, y - 2, 495, 24).fill('#f8fafc');
    doc.fillColor('#334155').font('Helvetica').fontSize(8)
      .text(String(index + 1), 60, y + 5)
      .text(`${item.name}\nSKU: ${item.sku || item.product || 'BAP-SKU'} | HSN: ${item.hsnCode || '30059090'}`, 90, y + 3, { width: 175, height: 18, ellipsis: true })
      .text(String(item.qty), 270, y + 5, { width: 30, align: 'center' })
      .text(formatINR(item.price), 300, y + 5, { width: 65, align: 'right' })
      .text(`${item.gstRate || 12}%`, 372, y + 5, { width: 35, align: 'right' })
      .text(formatINR(item.gstAmount || Number(item.price || 0) * Number(item.qty || 0) * ((item.gstRate || 12) / 100)), 412, y + 5, { width: 55, align: 'right' })
      .text(formatINR(Number(item.price || 0) * Number(item.qty || 0)), 472, y + 5, { width: 68, align: 'right' });
    doc.strokeColor('#e2e8f0').moveTo(50, y + 22).lineTo(545, y + 22).stroke();
    y += 24;
  });

  const summaryTop = y + 20;
  doc.fillColor('#334155').font('Helvetica').fontSize(9)
    .text('Subtotal:', 350, summaryTop, { width: 100, align: 'right' })
    .text(formatINR(subtotal), 450, summaryTop, { width: 90, align: 'right' })
    .text('GST / Taxes:', 350, summaryTop + 16, { width: 100, align: 'right' })
    .text(formatINR(order.taxAmount || 0), 450, summaryTop + 16, { width: 90, align: 'right' })
    .text('CGST:', 350, summaryTop + 32, { width: 100, align: 'right' })
    .text(formatINR(cgst), 450, summaryTop + 32, { width: 90, align: 'right' })
    .text('SGST:', 350, summaryTop + 48, { width: 100, align: 'right' })
    .text(formatINR(sgst), 450, summaryTop + 48, { width: 90, align: 'right' })
    .text('IGST:', 350, summaryTop + 64, { width: 100, align: 'right' })
    .text(formatINR(0), 450, summaryTop + 64, { width: 90, align: 'right' })
    .text('Shipping:', 350, summaryTop + 80, { width: 100, align: 'right' })
    .text(formatINR(order.shippingAmount || 0), 450, summaryTop + 80, { width: 90, align: 'right' })
    .text('Discount:', 350, summaryTop + 96, { width: 100, align: 'right' })
    .text(formatINR(order.discountAmount || 0), 450, summaryTop + 96, { width: 90, align: 'right' });

  doc.rect(340, summaryTop + 116, 205, 28).fill('#0b1116');
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10)
    .text('Grand Total', 352, summaryTop + 125)
    .text(formatINR(order.totalAmount || 0), 430, summaryTop + 125, { width: 105, align: 'right' });

  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(9).text('Terms & Conditions', 50, 650);
  doc.fillColor('#64748b').font('Helvetica').fontSize(8)
    .text('Goods once sold are subject to Bapuji Surgicals return policy. Sterile and hygiene products must be returned unopened with original packaging.', 50, 665, { width: 300 })
    .text('Authorized Signature', 420, 665, { width: 110, align: 'center' });
  doc.strokeColor('#cbd5e1').moveTo(408, 706).lineTo(540, 706).stroke();
  doc.fillColor('#94a3b8').font('Helvetica').fontSize(8)
    .text('Company Seal Area', 420, 715, { width: 110, align: 'center' })
    .text('This is a computer-generated invoice and requires no physical signature unless demanded by compliance teams.', 50, 742, { align: 'center' });

  doc.end();
  return pdfPromise;
};

export const generateOemInquiryPDFBuffer = async (inquiry, estimate = {}) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const pdfPromise = collectPDFBuffer(doc);
  const rfqNo = `OEM-${inquiry._id.toString().slice(-6).toUpperCase()}`;
  const unitPrice = Number(estimate.unitPrice || 0);
  const totalAmount = Number(estimate.totalAmount || Number(inquiry.targetQuantity || 0) * unitPrice);

  doc.rect(0, 0, 595, 18).fill('#0b1116');
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(22).text('BAPUJI SURGICALS', 50, 42);
  doc.fillColor('#0976BC').fontSize(9).text('OEM RFQ ACKNOWLEDGEMENT / PROFORMA SUMMARY', 50, 66);
  doc.fillColor('#64748b').font('Helvetica').fontSize(8)
    .text('Custom OEM Wet Wipes Division', 360, 42, { width: 185, align: 'right' })
    .text('Bengaluru, Karnataka - India', 360, 54, { width: 185, align: 'right' })
    .text('info@bapujisurgicals.com', 360, 66, { width: 185, align: 'right' });

  doc.strokeColor('#e2e8f0').moveTo(50, 96).lineTo(545, 96).stroke();

  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(16).text('RFQ Details', 50, 120);
  doc.fillColor('#334155').font('Helvetica').fontSize(9)
    .text(`RFQ Number: ${rfqNo}`, 50, 148)
    .text(`Submitted On: ${new Date(inquiry.createdAt || Date.now()).toLocaleDateString('en-IN')}`, 50, 162)
    .text(`Current Status: ${String(inquiry.status || 'submitted').toUpperCase()}`, 50, 176);

  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(16).text('Customer Details', 320, 120);
  doc.fillColor('#334155').font('Helvetica').fontSize(9)
    .text(`Company: ${inquiry.companyName}`, 320, 148)
    .text(`Contact: ${inquiry.contactPerson}`, 320, 162)
    .text(`Email: ${inquiry.email}`, 320, 176)
    .text(`Phone: ${inquiry.phone}`, 320, 190);

  doc.rect(50, 230, 495, 26).fill('#0b1116');
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9).text('Manufacturing Specification', 64, 239);

  const rows = [
    ['Product Category', String(inquiry.productCategory || '').replace(/-/g, ' ')],
    ['Material / Fabric', inquiry.specifications?.material || 'Custom'],
    ['Dimensions', inquiry.specifications?.dimensions || 'Custom'],
    ['Sterilization / Formula', inquiry.specifications?.sterilization || 'Custom'],
    ['Packaging', inquiry.specifications?.packaging || 'Custom'],
    ['Target Quantity', `${Number(inquiry.targetQuantity || 0).toLocaleString('en-IN')} units`],
    ['Estimated Unit Price', formatINR(unitPrice)],
    ['Estimated Total', formatINR(totalAmount)]
  ];

  let y = 270;
  rows.forEach(([label, value], index) => {
    if (index % 2 === 0) doc.rect(50, y - 4, 495, 24).fill('#f8fafc');
    doc.fillColor('#64748b').font('Helvetica-Bold').fontSize(8).text(label, 64, y);
    doc.fillColor('#0f172a').font('Helvetica').fontSize(9).text(value, 230, y, { width: 285 });
    y += 24;
  });

  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(12).text('Customer Notes / Custom Specs', 50, y + 20);
  doc.fillColor('#334155').font('Helvetica').fontSize(9).text(inquiry.description || 'No additional notes provided.', 50, y + 40, {
    width: 495,
    lineGap: 3
  });

  doc.fillColor('#64748b').fontSize(8).text(
    'Note: This document acknowledges receipt of your OEM RFQ. Final invoice, GST, freight, and delivery commitments will be issued after quotation approval.',
    50,
    710,
    { width: 495, align: 'center' }
  );

  doc.end();
  return pdfPromise;
};
