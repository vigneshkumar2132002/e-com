import OemInquiry from '../models/oemInquiryModel.js';
import { sendOemInquiryReceivedEmail, sendOemQuotationUpdatedEmail } from '../config/emailService.js';

// @desc    Submit a new OEM custom request
// @route   POST /api/oem
// @access  Public (Multipart upload support)
export const createOemInquiry = async (req, res) => {
  const {
    companyName,
    contactPerson,
    email,
    phone,
    productCategory,
    material,
    dimensions,
    sterilization,
    packaging,
    description,
    targetQuantity
  } = req.body;

  const file = req.file;

  try {
    const oemInquiry = new OemInquiry({
      user: req.user ? req.user._id : undefined, // optional if user is not logged in, but standard is logged-in
      companyName,
      contactPerson,
      email,
      phone,
      productCategory,
      specifications: {
        material,
        dimensions,
        sterilization,
        packaging
      },
      description,
      targetQuantity: Number(targetQuantity),
      attachmentPath: file ? file.path : undefined
    });

    const savedInquiry = await oemInquiry.save();
    
    let emailStatus = { status: 'not_sent' };
    try {
      const emailResult = await sendOemInquiryReceivedEmail(savedInquiry);
      emailStatus = emailResult?.mock
        ? { status: 'mock', message: 'Email rendered in backend console because SMTP is in mock mode.' }
        : { status: 'sent', message: 'Confirmation email sent to customer with PDF attachment.' };
    } catch (err) {
      console.error(`OEM RFQ email failure: ${err.message}`);
      emailStatus = { status: 'failed', message: err.message };
    }

    res.status(201).json({
      message: 'OEM custom manufacturing inquiry submitted successfully.',
      inquiry: savedInquiry,
      emailStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's OEM inquiries
// @route   GET /api/oem/myinquiries
// @access  Private
export const getMyOemInquiries = async (req, res) => {
  try {
    const inquiries = await OemInquiry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all OEM inquiries (Admin)
// @route   GET /api/oem
// @access  Private/Admin
export const getOemInquiries = async (req, res) => {
  try {
    const inquiries = await OemInquiry.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Provide quote and update feedback (Admin)
// @route   PUT /api/oem/:id/quote
// @access  Private/Admin
export const updateOemInquiryStatus = async (req, res) => {
  const { status, adminFeedback, quotedPrice } = req.body;

  try {
    const inquiry = await OemInquiry.findById(req.params.id);

    if (inquiry) {
      inquiry.status = status || inquiry.status;
      if (adminFeedback !== undefined) inquiry.adminFeedback = adminFeedback;
      if (quotedPrice !== undefined) inquiry.quotedPrice = Number(quotedPrice);

      const updatedInquiry = await inquiry.save();
      
      // Send email alert to client when quotation price is provided/updated
      if (quotedPrice !== undefined) {
        sendOemQuotationUpdatedEmail(updatedInquiry).catch(err => {
          console.error(`Deferred OEM quotation update email failure: ${err.message}`);
        });
      }

      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'OEM Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept OEM quotation by user
// @route   PUT /api/oem/:id/accept
// @access  Private
export const acceptOemQuote = async (req, res) => {
  try {
    const inquiry = await OemInquiry.findById(req.params.id);

    if (inquiry) {
      if (inquiry.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to modify this inquiry' });
      }
      inquiry.status = 'accepted';
      const updatedInquiry = await inquiry.save();
      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'OEM Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
