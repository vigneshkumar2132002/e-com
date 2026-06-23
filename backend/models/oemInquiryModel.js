import mongoose from 'mongoose';

const oemInquirySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  productCategory: { 
    type: String, 
    enum: ['household-wipes', 'mens-care-wipes', 'baby-wipes', 'pet-wipes', 'personal-care-wipes', 'automobile-wipes', 'other'],
    required: true 
  },
  
  // Custom specifications (size, materials, GSM, loops, sterilization, packaging)
  specifications: {
    material: { type: String },
    dimensions: { type: String },
    sterilization: { type: String },
    packaging: { type: String }
  },
  
  description: { type: String, required: true },
  targetQuantity: { type: Number, required: true },
  attachmentPath: { type: String }, // Drawing PDF or image
  
  status: { 
    type: String, 
    enum: ['submitted', 'reviewing', 'quoted', 'accepted', 'declined'], 
    default: 'submitted' 
  },
  adminFeedback: { type: String },
  quotedPrice: { type: Number }, // Quoted cost by Bapuji Admin
  createdAt: { type: Date, default: Date.now }
});

const OemInquiry = mongoose.model('OemInquiry', oemInquirySchema);
export default OemInquiry;
