import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: 'India' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['b2c', 'b2b', 'admin'], default: 'b2c' },
  
  // B2B specific fields
  b2bProfile: {
    applicationId: { type: String },
    companyName: { type: String },
    gstinOrTaxId: { type: String },
    phone: { type: String },
    businessType: { type: String },
    expectedMonthlyPurchase: { type: String },
    leadSource: { type: String },
    assignedManager: { type: String, default: 'Unassigned' },
    documentPath: { type: String },
    verificationStatus: { 
      type: String, 
      enum: ['none', 'pending', 'new', 'under_review', 'contacted', 'approved', 'rejected', 'converted'], 
      default: 'none' 
    }
  },
  
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
