import mongoose from 'mongoose';

const b2bTierSchema = new mongoose.Schema({
  minQty: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['wound-care', 'apparel', 'hygiene', 'sterilization', 'instruments']
  },
  images: [{ type: String }],
  b2cPrice: { type: Number, required: true },
  
  // Tiered pricing for B2B. E.g., [ { minQty: 50, price: 90 }, { minQty: 200, price: 80 } ]
  b2bPricing: [b2bTierSchema],
  
  isOemCapable: { type: Boolean, default: false },
  
  specifications: {
    material: { type: String },
    size: { type: String },
    packaging: { type: String },
    sterilization: { type: String } // E.g., 'ETO sterile', 'Non-sterile', 'Gamma sterile'
  },
  
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
