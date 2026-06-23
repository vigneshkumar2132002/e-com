import express from 'express';
import { 
  registerB2C, 
  registerB2B, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  getB2BRequests,
  verifyB2BRequest
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register/b2c', registerB2C);
router.post('/register/b2b', upload.single('document'), registerB2B);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin-only endpoints for B2B verifications
router.get('/b2b-requests', protect, admin, getB2BRequests);
router.put('/b2b-requests/:id/verify', protect, admin, verifyB2BRequest);

export default router;
