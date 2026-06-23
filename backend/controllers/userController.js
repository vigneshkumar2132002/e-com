import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { sendB2BRegistrationReceivedEmail, sendB2BStatusUpdatedEmail } from '../config/emailService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'bapuji_secret', {
    expiresIn: '30d'
  });
};

// @desc    Register a new B2C Customer
// @route   POST /api/users/register/b2c
// @access  Public
export const registerB2C = async (req, res) => {
  const { name, email, password, shippingAddress } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'b2c',
      shippingAddress,
      billingAddress: shippingAddress // default same as shipping
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register B2B Wholesaler Request
// @route   POST /api/users/register/b2b
// @access  Public (Multipart upload required)
export const registerB2B = async (req, res) => {
  const { name, email, password, companyName, gstinOrTaxId, phone, businessType, expectedMonthlyPurchase, leadSource, shippingAddress } = req.body;
  const documentFile = req.file;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!documentFile) {
      return res.status(400).json({ message: 'Please upload a business registration document' });
    }

    // Server-side Document Validation
    if (documentFile.size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: 'Document size exceeds 10MB limit' });
    }
    const validMimes = [
      'application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'
    ];
    if (!validMimes.includes(documentFile.mimetype)) {
      return res.status(400).json({ message: 'Invalid document format. Only PDF, JPG, PNG, and DOCX are allowed.' });
    }

    // Parse shipping address if sent as stringified JSON
    let parsedAddress;
    try {
      parsedAddress = typeof shippingAddress === 'string' ? JSON.parse(shippingAddress) : shippingAddress;
    } catch (e) {
      return res.status(400).json({ message: 'Invalid address format' });
    }

    // Generate Unique Application ID
    const year = new Date().getFullYear();
    const count = await User.countDocuments({ role: 'b2b' });
    const applicationId = `B2B-${year}-${String(count + 1).padStart(4, '0')}`;

    const user = await User.create({
      name,
      email,
      password,
      role: 'b2b',
      b2bProfile: {
        applicationId,
        companyName,
        gstinOrTaxId,
        phone,
        businessType,
        expectedMonthlyPurchase,
        leadSource: leadSource || 'Website',
        documentPath: documentFile.path,
        verificationStatus: 'new',
        assignedManager: 'Unassigned'
      },
      shippingAddress: parsedAddress,
      billingAddress: parsedAddress
    });

    // Send B2B registration acknowledgment email
    sendB2BRegistrationReceivedEmail(user).catch(err => {
      console.error(`Deferred B2B registration email failure: ${err.message}`);
    });

    res.status(201).json({
      message: 'B2B registration request submitted successfully. Awaiting administrator approval.',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      applicationId,
      verificationStatus: 'new'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please sign up first.' });
    }

    if (await user.comparePassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        b2bProfile: user.b2bProfile,
        shippingAddress: user.shippingAddress,
        billingAddress: user.billingAddress,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        b2bProfile: user.b2bProfile,
        shippingAddress: user.shippingAddress,
        billingAddress: user.billingAddress
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.password) {
        user.password = req.body.password;
      }
      if (req.body.shippingAddress) {
        user.shippingAddress = req.body.shippingAddress;
      }
      if (req.body.billingAddress) {
        user.billingAddress = req.body.billingAddress;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        b2bProfile: updatedUser.b2bProfile,
        shippingAddress: updatedUser.shippingAddress,
        billingAddress: updatedUser.billingAddress,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all B2B accounts (Admin)
// @route   GET /api/users/b2b-requests
// @access  Private/Admin
export const getB2BRequests = async (req, res) => {
  try {
    const requests = await User.find({ role: 'b2b' }).select('-password').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update B2B Pipeline Status (Admin)
// @route   PUT /api/users/b2b-requests/:id/verify
// @access  Private/Admin
export const verifyB2BRequest = async (req, res) => {
  const { status } = req.body; 
  
  const validStatuses = ['none', 'pending', 'new', 'under_review', 'contacted', 'approved', 'rejected', 'converted'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid verification status' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'b2b') {
      return res.status(404).json({ message: 'B2B user not found' });
    }

    user.b2bProfile.verificationStatus = status;
    await user.save();
    
    // Send status update notification email
    sendB2BStatusUpdatedEmail(user, status).catch(err => {
      console.error(`Deferred B2B verification status email failure: ${err.message}`);
    });

    res.json({ message: `B2B Request successfully updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
