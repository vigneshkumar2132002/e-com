import express from 'express';
import { 
  createOemInquiry, 
  getMyOemInquiries, 
  getOemInquiries, 
  updateOemInquiryStatus, 
  acceptOemQuote 
} from '../controllers/oemController.js';
import { protect, optionalProtect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Allow public submittal of inquiries, but log details if logged-in (via optional token or standard auth)
// Let's use standard protect route for submitting OEM inquiries to keep designs organized under a user account.
router.route('/')
  .post(optionalProtect, upload.single('designFile'), createOemInquiry)
  .get(protect, admin, getOemInquiries);

router.route('/myinquiries')
  .get(protect, getMyOemInquiries);

router.route('/:id/accept')
  .put(protect, acceptOemQuote);

router.route('/:id/quote')
  .put(protect, admin, updateOemInquiryStatus);

export default router;
