import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import OemInquiry from '../models/oemInquiryModel.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bapuji_surgicals';

const seedProducts = [
  {
    name: 'Absorbent Cotton Roll (High Absorbent)',
    sku: 'COT-ROLL-500G',
    description: 'Bapuji Surgicals absorbent cotton rolls are made of 100% pure, natural, carded cotton. Highly absorbent, hypoallergenic, and clean. Suitable for wound dressing and cleansing.',
    category: 'wound-care',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 180,
    b2bPricing: [
      { minQty: 50, price: 130 },
      { minQty: 200, price: 110 }
    ],
    isOemCapable: true,
    specifications: {
      material: '100% Pure Carded Cotton',
      size: '500g',
      packaging: 'Individually wrapped in blue paper sleeve',
      sterilization: 'Non-sterile (can be autoclaved)'
    },
    stock: 500
  },
  {
    name: 'Sterile Gauze Swabs 12-Ply (Pack of 100)',
    sku: 'GAUZE-SWB-12P',
    description: 'Medical-grade cotton gauze swabs. High fluid absorption capacity, folded edges to prevent fraying and loose threads. ETO sterilized.',
    category: 'wound-care',
    images: ['https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 350,
    b2bPricing: [
      { minQty: 30, price: 260 },
      { minQty: 100, price: 220 }
    ],
    isOemCapable: true,
    specifications: {
      material: '100% Cotton Gauze',
      size: '10cm x 10cm',
      packaging: '100 swabs per pack',
      sterilization: 'ETO Sterile'
    },
    stock: 800
  },
  {
    name: 'Reinforced Surgical Gown (SMS Fabric)',
    sku: 'GOWN-SMS-REIN',
    description: 'High-barrier reinforced surgical gown made of breathable SMS fabric. Provides excellent protection against fluids and pathogens. Fluid-resistant reinforcement in critical zones.',
    category: 'apparel',
    images: ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 450,
    b2bPricing: [
      { minQty: 25, price: 320 },
      { minQty: 100, price: 280 }
    ],
    isOemCapable: true,
    specifications: {
      material: 'SMMS Breathable Fabric, 50 GSM',
      size: 'Large',
      packaging: 'Individually pouch packed with hand towel',
      sterilization: 'ETO Sterile'
    },
    stock: 350
  },
  {
    name: 'Disposable Underpads Extra-Large (Pack of 10)',
    sku: 'PAD-UNDER-XL',
    description: 'Highly absorbent underpads for bed protection. Features a soft top sheet, super absorbent core (SAP), and waterproof back sheet to prevent leakage.',
    category: 'hygiene',
    images: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 299,
    b2bPricing: [
      { minQty: 40, price: 220 },
      { minQty: 150, price: 180 }
    ],
    isOemCapable: false,
    specifications: {
      material: 'Fluff Pulp with SAP polymer layer',
      size: '60cm x 90cm',
      packaging: '10 pads per pack',
      sterilization: 'Non-sterile'
    },
    stock: 600
  },
  {
    name: 'Lap Sponges (Mopping Pads) with X-Ray Thread',
    sku: 'LAP-SPG-XRAY',
    description: 'Abdominal mopping pads made of premium cotton with pre-washed loop. Includes an X-ray detectable barium sulfate thread woven throughout for safety in operating theaters.',
    category: 'sterilization',
    images: ['https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 650,
    b2bPricing: [
      { minQty: 20, price: 480 },
      { minQty: 80, price: 420 }
    ],
    isOemCapable: true,
    specifications: {
      material: '100% Cotton, 40s yarn',
      size: '30cm x 30cm - 12 Ply',
      packaging: 'Pack of 5 tied, or sterile single packed',
      sterilization: 'ETO Sterile'
    },
    stock: 200
  },
  {
    name: 'Bapuji CHG Bathing Wipes (Antiseptic Pack of 10)',
    sku: 'WIPE-MED-CHX',
    description: 'Antiseptic patient wash washcloths containing 2% Chlorhexidine Gluconate. Ideal for pre-surgical patient bathing, clinical decontamination, and intensive care bed hygiene.',
    category: 'hygiene',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 250,
    b2bPricing: [
      { minQty: 50, price: 180 },
      { minQty: 200, price: 150 }
    ],
    isOemCapable: true,
    specifications: {
      material: 'Extra-Thick Non-Woven Spunlace',
      size: '30cm x 20cm',
      packaging: 'Resealable packet of 10 washcloths',
      sterilization: 'Sterile solution impregnated'
    },
    stock: 400
  },
  {
    name: '70% Isopropyl Alcohol Disinfectant Wipes (Tub of 100)',
    sku: 'WIPE-ALC-70',
    description: 'Rapid-action sanitizing wipes saturated with 70% Isopropyl Alcohol. Designed for sanitizing clinic tables, medical equipment housings, and hard surfaces.',
    category: 'hygiene',
    images: ['https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 399,
    b2bPricing: [
      { minQty: 30, price: 290 },
      { minQty: 100, price: 240 }
    ],
    isOemCapable: true,
    specifications: {
      material: 'Lint-Free Micro-Embossed Spunlace',
      size: '15cm x 18cm',
      packaging: 'Airtight dispenser canister of 100',
      sterilization: 'Non-sterile (Disinfectant)'
    },
    stock: 500
  },
  {
    name: 'Sterile Saline Wound Wipes (Pack of 80)',
    sku: 'WIPE-STER-SAL',
    description: 'Individually packaged sterile wet wipes saturated with 0.9% Sodium Chloride saline solution. Safe for cleaning wounds, cuts, and scrapes without stinging.',
    category: 'wound-care',
    images: ['https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 450,
    b2bPricing: [
      { minQty: 40, price: 320 },
      { minQty: 150, price: 270 }
    ],
    isOemCapable: true,
    specifications: {
      material: 'Medical-Grade Soft Rayon',
      size: '10cm x 12cm',
      packaging: '80 individually sealed foil pouches',
      sterilization: 'Gamma Sterile'
    },
    stock: 300
  },
  {
    name: 'Ultrasoft Baby & Patient Wipes (Pack of 72)',
    sku: 'WIPE-SENS-BABY',
    description: '99% Pure Water sensitive wipes. Free from alcohol, fragrances, parabens, and chlorine. Perfect for pediatric care and gentle adult elder hygiene.',
    category: 'hygiene',
    images: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 180,
    b2bPricing: [
      { minQty: 60, price: 130 },
      { minQty: 250, price: 110 }
    ],
    isOemCapable: true,
    specifications: {
      material: 'Biodegradable Plant Fibers',
      size: '18cm x 20cm',
      packaging: 'Flip-top pack of 72 wipes',
      sterilization: 'Non-sterile'
    },
    stock: 600
  },
  {
    name: 'Hospital-Grade Disinfectant Surface Wipes (Canister of 120)',
    sku: 'WIPE-SURF-DIS',
    description: 'EPA-registered medical surface disinfectant wipes. Kills 99.9% of clinic pathogens, MRSA, influenza, and corona viruses. Bleach-free, non-corrosive.',
    category: 'sterilization',
    images: ['https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 599,
    b2bPricing: [
      { minQty: 20, price: 440 },
      { minQty: 80, price: 380 }
    ],
    isOemCapable: true,
    specifications: {
      material: 'High-Strength Cross-Lapped Spunlace',
      size: '18cm x 22cm',
      packaging: '120 wipes per pull-up canister',
      sterilization: 'Non-sterile (Bactericidal)'
    },
    stock: 250
  },
  {
    name: 'Flushable Personal Hygiene Washcloths (Pack of 48)',
    sku: 'WIPE-FLUSH-AD',
    description: 'Sewer-safe flushable personal wet wipes for patient toilet hygiene. Formulated with skin-soothing aloe vera and vitamin E. Disintegrates rapidly.',
    category: 'hygiene',
    images: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 150,
    b2bPricing: [
      { minQty: 80, price: 110 },
      { minQty: 300, price: 95 }
    ],
    isOemCapable: false,
    specifications: {
      material: 'Flushable Hydraspun Dispersible Paper',
      size: '17cm x 19cm',
      packaging: '48 wipes per resealable soft pack',
      sterilization: 'Non-sterile'
    },
    stock: 450
  },
  {
    name: 'Rinse-Free Patient Bed-Bath Wipes (Pack of 8)',
    sku: 'WIPE-BATH-XL',
    description: 'Extra-thick, large bathing washcloths for complete rinse-free bed baths. Saturated with moisturizers. Can be warmed in microwave for comfort.',
    category: 'hygiene',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 320,
    b2bPricing: [
      { minQty: 50, price: 240 },
      { minQty: 200, price: 199 }
    ],
    isOemCapable: true,
    specifications: {
      material: 'Ultra-Soft Heavyweight Needle-Punched Non-Woven',
      size: '24cm x 24cm',
      packaging: '8 washcloths per peel-open thermal pack',
      sterilization: 'ETO Sterile'
    },
    stock: 300
  },
  {
    name: 'Gynecological pH-Balanced Intimate Wipes (Pack of 30)',
    sku: 'WIPE-pH-INT',
    description: 'Soap-free, alcohol-free intimate cleansing wipes. pH-balanced, dermatologically safe, and enriched with chamomile extracts. Ideal for female ward hygiene.',
    category: 'hygiene',
    images: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 199,
    b2bPricing: [
      { minQty: 50, price: 140 },
      { minQty: 200, price: 115 }
    ],
    isOemCapable: true,
    specifications: {
      material: 'Hypoallergenic Rayon Blend',
      size: '15cm x 15cm',
      packaging: '30 wipes per pocket pouch',
      sterilization: 'Non-sterile'
    },
    stock: 400
  },
  {
    name: 'Biodegradable Bamboo Sanitizing Wipes (Pack of 50)',
    sku: 'WIPE-BAMB-SAN',
    description: '100% natural, biodegradable bamboo hand sanitizing wipes. Impregnated with organic tea tree extract and moisturizer. Eco-friendly hygiene.',
    category: 'hygiene',
    images: ['https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 220,
    b2bPricing: [
      { minQty: 40, price: 160 },
      { minQty: 150, price: 130 }
    ],
    isOemCapable: true,
    specifications: {
      material: '100% Bamboo Organic Fibers',
      size: '16cm x 18cm',
      packaging: '50 wipes per resealable soft pack',
      sterilization: 'Non-sterile'
    },
    stock: 350
  },
  {
    name: 'Sterile Injection Alcohol Prep Pads (Box of 200)',
    sku: 'WIPE-PREP-PAD',
    description: 'Small, individually sealed sterile prep pads saturated with 70% Isopropyl Alcohol. For skin sterilization prior to vaccine injections or blood draws.',
    category: 'wound-care',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=60'],
    b2cPrice: 280,
    b2bPricing: [
      { minQty: 50, price: 199 },
      { minQty: 300, price: 160 }
    ],
    isOemCapable: true,
    specifications: {
      material: 'Non-Woven Absorbent Lint-Free Pad',
      size: '3cm x 6cm (Folded)',
      packaging: '200 prep pads per carton box',
      sterilization: 'Gamma Sterile'
    },
    stock: 1000
  }
];

const seedUsers = [
  {
    name: 'Bapuji Admin',
    email: 'admin@bapujisurgicals.com',
    password: 'AdminPassword123',
    role: 'admin',
    shippingAddress: {
      street: '12, Industrial Area, Rajajinagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560010'
    },
    billingAddress: {
      street: '12, Industrial Area, Rajajinagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560010'
    }
  },
  {
    name: 'Apollo Hospital Procurement',
    email: 'apollo@hospital.com',
    password: 'B2BPassword123',
    role: 'b2b',
    b2bProfile: {
      companyName: 'Apollo Hospitals Group',
      gstinOrTaxId: '29AAAAA0000A1Z5',
      documentPath: 'uploads/mock-license.pdf',
      verificationStatus: 'approved'
    },
    shippingAddress: {
      street: '154/11, Bannerghatta Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560076'
    },
    billingAddress: {
      street: '154/11, Bannerghatta Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560076'
    }
  },
  {
    name: 'Sagar Clinic B2B',
    email: 'sagar@clinic.com',
    password: 'B2BPassword123',
    role: 'b2b',
    b2bProfile: {
      companyName: 'Sagar Medical Center',
      gstinOrTaxId: '29BBBBB1111B2Z6',
      documentPath: 'uploads/mock-license-sagar.pdf',
      verificationStatus: 'pending'
    },
    shippingAddress: {
      street: '44th Cross, Jayanagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560082'
    },
    billingAddress: {
      street: '44th Cross, Jayanagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560082'
    }
  },
  {
    name: 'John Doe',
    email: 'john@gmail.com',
    password: 'CustomerPassword123',
    role: 'b2c',
    shippingAddress: {
      street: '456, 10th Main, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560038'
    },
    billingAddress: {
      street: '456, 10th Main, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560038'
    }
  }
];

const runSeed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await OemInquiry.deleteMany({});
    console.log('Existing collections cleared.');

    // Seed products
    const products = await Product.insertMany(seedProducts);
    console.log(`${products.length} products seeded successfully.`);

    // Seed users (password hashing is done automatically by pre-save hooks, but we must use save or create)
    for (const u of seedUsers) {
      await User.create(u);
    }
    console.log(`${seedUsers.length} users seeded successfully.`);

    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

runSeed();
