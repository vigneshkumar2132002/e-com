'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, ClipboardList, Package, FileText, Check, X, ShieldAlert, Award, Search, 
  Bell, Menu, ChevronLeft, ChevronRight, ChevronDown, TrendingUp, TrendingDown, DollarSign, 
  ShoppingCart, Globe, Phone, FileSpreadsheet, Plus, Settings, Eye, Trash2, 
  Edit3, Crop, FolderOpen, Image, Star, MessageSquare, ArrowRight, Play, 
  AlertTriangle, Download, ArrowUpRight, CheckCircle2, Factory, Activity, 
  Briefcase, Lock, UserCheck, Shield, HelpCircle, Layers, RefreshCw,
  Clock, Percent, Monitor, Smartphone, Tablet, Sun, Moon,
  Truck, ExternalLink, List, Grid, Printer, CreditCard, CheckCircle, FlaskConical
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell, Sector 
} from 'recharts';
import { DEFAULT_CMS_HOME, getCmsHome, saveCmsHome, subscribeCmsHome } from '../lib/cmsStore';
import { getLiveOrders, saveLiveOrders, subscribeLiveOrders } from '../lib/orderStore';

// --- MOCK DATABASE AND INITIAL STATE DATA ---
const INITIAL_CUSTOMERS = [
  { id: 'CUST-001', name: 'Alok Mehta', company: 'Fortis Hospital Group', email: 'alok@fortis.in', phone: '+91 98845 12211', country: 'India', type: 'B2B', regDate: '2026-01-15', orders: 12, spend: 450000, status: 'Active', notes: 'Prefers 70% IPA clinical formulations. Orders monthly.', attachments: ['po-304.pdf'] },
  { id: 'CUST-002', name: 'Sarah Jenkins', company: 'PureCare Brands Ltd', email: 'sarah@purecare.co.uk', phone: '+44 7700 900077', country: 'United Kingdom', type: 'OEM', regDate: '2026-02-03', orders: 4, spend: 3200000, status: 'Active', notes: 'Private label organic baby wipes. Standard 60 GSM rayon.', attachments: ['artwork_approved.png', 'specs_sheet.pdf'] },
  { id: 'CUST-003', name: 'Dr. Vivek Rao', company: 'Apollo Pharmacy', email: 'v.rao@apollopharm.com', phone: '+91 93455 88990', country: 'India', type: 'B2B', regDate: '2026-02-18', orders: 18, spend: 890000, status: 'Active', notes: 'Requires 2% CHG cleaning cloth packaging customization.', attachments: [] },
  { id: 'CUST-004', name: 'Takahashi Ken', company: 'Lotus Wellness Tokyo', email: 'ken@lotuswellness.jp', phone: '+81 90 1234 5678', country: 'Japan', type: 'OEM', regDate: '2026-03-01', orders: 2, spend: 1850000, status: 'Active', notes: 'Bamboo substrate luxury make-up wipes project.', attachments: ['drawing_v2.dwg'] },
  { id: 'CUST-005', name: 'Nisha Sharma', company: 'Individual Client', email: 'nisha@gmail.com', phone: '+91 99881 22334', country: 'India', type: 'B2C', regDate: '2026-03-12', orders: 2, spend: 3400, status: 'Active', notes: 'Frequent retail buyer of biodegradable sanitizing wipes.', attachments: [] },
  { id: 'CUST-006', name: 'David Miller', company: 'Apex MediCorp USA', email: 'dmiller@apexmedicorp.com', phone: '+1 212 555 0199', country: 'United States', type: 'OEM', regDate: '2026-03-24', orders: 3, spend: 4500000, status: 'Active', notes: 'High-speed sterile packaging requirements.', attachments: ['fda_compliance.pdf'] },
  { id: 'CUST-007', name: 'Rajesh Patel', company: 'Surat Surgical Supply', email: 'rajesh@suratsurg.com', phone: '+91 98250 44556', country: 'India', type: 'B2B', regDate: '2026-04-02', orders: 6, spend: 280000, status: 'Suspended', notes: 'Payment delayed on last invoice (AR-203). Account locked.', attachments: [] },
];

const OEM_WORKFLOW_STAGES = [
  { stage: 'Inquiry', label: 'Inquiry', icon: 'MessageSquare' },
  { stage: 'Quotation Sent', label: 'Quotation', icon: 'FileText' },
  { stage: 'Sample Approval', label: 'Sample Approval', icon: 'Award' },
  { stage: 'Artwork Approval', label: 'Artwork Approval', icon: 'Image' },
  { stage: 'Raw Material Procurement', label: 'Raw Materials', icon: 'Layers' },
  { stage: 'Production', label: 'Production', icon: 'Factory' },
  { stage: 'QC', label: 'Quality Control', icon: 'Shield' },
  { stage: 'Packing', label: 'Packing', icon: 'Package' },
  { stage: 'Dispatch', label: 'Dispatch', icon: 'Clock' },
  { stage: 'Delivered', label: 'Delivered', icon: 'CheckCircle2' }
];

const INITIAL_OEM_ORDERS = [
  { 
    id: 'OEM-9081', 
    company: 'PureCare Brands Ltd', 
    contact: 'Sarah Jenkins', 
    product: 'Baby Wipes Custom Roll', 
    wipeType: 'Rayon 60 GSM', 
    fragrance: 'Organic Aloe Vera', 
    packaging: 'Flip Lid 80-Pack Pack', 
    quantity: 50000, 
    unitPrice: 42, 
    amount: 2100000, 
    orderDate: '2026-05-10', 
    deliveryDate: '2026-06-25', 
    status: 'Production', 
    comments: 'Sample approved. Plastic lidding artwork verified. Compounding active.',
    health: 'green',
    healthStatus: 'ON TRACK',
    assignedTeam: { sales: 'Vignesh Sullia', production: 'Anant Kumar', qc: 'Leigh Jenkins' },
    documents: [
      { name: 'Specs_Sheet_BabyWipes.pdf', type: 'Product Specifications', size: '1.2 MB', date: '2026-05-12' },
      { name: 'Approved_Artwork_FlipLid.png', type: 'Artwork Files', size: '4.8 MB', date: '2026-05-15' }
    ]
  },
  { 
    id: 'OEM-9082', 
    company: 'Lotus Wellness Tokyo', 
    contact: 'Takahashi Ken', 
    product: 'Make-up remover sachet', 
    wipeType: 'Bamboo 50 GSM', 
    fragrance: 'Rose water infusion', 
    packaging: 'Single Sachet Carton', 
    quantity: 100000, 
    unitPrice: 18, 
    amount: 1800000, 
    orderDate: '2026-05-18', 
    deliveryDate: '2026-07-05', 
    status: 'Artwork Approval', 
    comments: 'Awaiting client approval of secondary packaging layout files.',
    health: 'orange',
    healthStatus: 'ATTENTION NEEDED',
    assignedTeam: { sales: 'Vignesh Sullia', production: 'Anant Kumar', qc: 'Leigh Jenkins' },
    documents: [
      { name: 'Specs_Sheet_MakeupWipes.pdf', type: 'Product Specifications', size: '1.1 MB', date: '2026-05-19' }
    ]
  },
  { 
    id: 'OEM-9083', 
    company: 'Apex MediCorp USA', 
    contact: 'David Miller', 
    product: 'Sterile Clinical Wipes', 
    wipeType: 'Spunlace 70 GSM', 
    fragrance: 'Unscented', 
    packaging: 'Double Reseal Flowpack', 
    quantity: 30000, 
    unitPrice: 75, 
    amount: 2250000, 
    orderDate: '2026-04-20', 
    deliveryDate: '2026-06-10', 
    status: 'QC', 
    comments: 'Bacteriological validation in progress in Rajajinagar cleanroom.',
    health: 'red',
    healthStatus: 'DELAYED',
    assignedTeam: { sales: 'Vignesh Sullia', production: 'Anant Kumar', qc: 'Leigh Jenkins' },
    documents: [
      { name: 'Specs_Sheet_ClinicalWipes.pdf', type: 'Product Specifications', size: '1.4 MB', date: '2026-04-22' },
      { name: 'FDA_Clinical_Clearance.pdf', type: 'Certificates', size: '2.5 MB', date: '2026-04-25' }
    ]
  },
  { 
    id: 'OEM-9084', 
    company: 'Medisave Clinics EU', 
    contact: 'Hans Gruber', 
    product: 'Disinfectant Wipes', 
    wipeType: 'Polyester Blend', 
    fragrance: 'Fresh Citrus', 
    packaging: 'Canister 120-Pack', 
    quantity: 20000, 
    unitPrice: 90, 
    amount: 1800000, 
    orderDate: '2026-05-24', 
    deliveryDate: '2026-07-20', 
    status: 'Inquiry', 
    comments: 'RFQs uploaded. Chemical compounding formulation being validated.',
    health: 'green',
    healthStatus: 'ON TRACK',
    assignedTeam: { sales: 'Vignesh Sullia', production: 'Anant Kumar', qc: 'Leigh Jenkins' },
    documents: []
  },
  { 
    id: 'OEM-9085', 
    company: 'MediLife Healthcare', 
    contact: 'Anil Mehta', 
    product: 'Patient Cleaning Cloth', 
    wipeType: 'Rayon/Poly Blend', 
    fragrance: 'Lavender extract', 
    packaging: 'Resealable Wrap 10-Pack', 
    quantity: 80000, 
    unitPrice: 35, 
    amount: 2800000, 
    orderDate: '2026-03-10', 
    deliveryDate: '2026-05-12', 
    status: 'Delivered', 
    comments: 'Delivered to central HSR warehouse. Invoices settled.',
    health: 'green',
    healthStatus: 'ON TRACK',
    assignedTeam: { sales: 'Vignesh Sullia', production: 'Anant Kumar', qc: 'Leigh Jenkins' },
    documents: [
      { name: 'Purchase_Order_MediLife.pdf', type: 'Purchase Orders', size: '1.0 MB', date: '2026-03-12' },
      { name: 'Delivery_Receipt.pdf', type: 'Agreements', size: '850 KB', date: '2026-05-12' }
    ]
  },
];

const INITIAL_QUOTATIONS = [
  { id: 'QT-206', customer: 'Fortis Hospital Group', product: 'CHG Cleaning Wipes', moq: 15000, price: 55, validUntil: '2026-06-30', status: 'Accepted' },
  { id: 'QT-207', customer: 'HealthMart India', product: 'Kitchen Sanitizer Wipes', moq: 20000, price: 32, validUntil: '2026-07-15', status: 'Sent' },
  { id: 'QT-208', customer: 'PureCare Brands Ltd', product: 'Moisturizing Face Wipes', moq: 50000, price: 44, validUntil: '2026-08-01', status: 'Draft' },
  { id: 'QT-209', customer: 'Apex MediCorp USA', product: 'Clinical Swabs (IPA)', moq: 100000, price: 12, validUntil: '2026-05-20', status: 'Expired' },
];

const INITIAL_B2B_ORDERS = [
  { 
    id: 'ORD-B2B-101', 
    businessName: 'Fortis Hospital Group', 
    products: '70% IPA Wipes Canister (x1200)', 
    qty: 1200, 
    amount: 384000, 
    status: 'Shipped', 
    paymentStatus: 'Paid', 
    date: '2026-05-15',
    contactPerson: 'Dr. Amit Verma (Chief Procurement)',
    email: 'procurement.gurgaon@fortis.com',
    phone: '+91 98124 55678',
    address: 'Fortis Memorial Research Institute, Sector 44, Gurugram, HR - 122003',
    gstin: '06AAACF1234F1Z5',
    paymentTerms: 'Net 30 Days',
    carrier: 'Blue Dart Express',
    awb: 'BD-8829-1039',
    estDelivery: '2026-05-20',
    items: [
      { name: '70% IPA Wipes Canister', qty: 1200, unitPrice: 320 }
    ]
  },
  { 
    id: 'ORD-B2B-102', 
    businessName: 'Apollo Pharmacy', 
    products: 'CHG Patient Bathing Cloth (x2000)', 
    qty: 2000, 
    amount: 560000, 
    status: 'Pending', 
    paymentStatus: 'Unpaid', 
    date: '2026-05-26',
    contactPerson: 'Suresh Kumar (Logistics Head)',
    email: 'suresh.k@apollopharmacy.in',
    phone: '+91 91223 44556',
    address: 'Apollo Central Warehouse, Industrial Area Phase 2, Chennai, TN - 600032',
    gstin: '33AAACA4567M1Z9',
    paymentTerms: 'Net 15 Days',
    carrier: 'DHL Express',
    awb: 'Awaiting Pickup',
    estDelivery: '2026-06-03',
    items: [
      { name: 'CHG Patient Bathing Cloth', qty: 2000, unitPrice: 280 }
    ]
  },
  { 
    id: 'ORD-B2B-103', 
    businessName: 'Surat Surgical Supply', 
    products: 'Clinical Dressing Roll 50m (x300)', 
    qty: 300, 
    amount: 240000, 
    status: 'Pending', 
    paymentStatus: 'Unpaid', 
    date: '2026-05-28',
    contactPerson: 'Jayesh Patel (Managing Partner)',
    email: 'contact@suratsurgicals.com',
    phone: '+91 94261 12345',
    address: 'Surgical Towers, Ring Road, Surat, GJ - 395002',
    gstin: '24AABCS8891D1ZO',
    paymentTerms: 'COD / Immediate',
    carrier: 'SafeExpress Logistics',
    awb: 'Awaiting Label Generation',
    estDelivery: '2026-06-05',
    items: [
      { name: 'Clinical Dressing Roll 50m', qty: 300, unitPrice: 800 }
    ]
  },
  { 
    id: 'ORD-B2B-104', 
    businessName: 'Apollo Pharmacy', 
    products: 'Sterile Wipe Pouches Box (x800)', 
    qty: 800, 
    amount: 180000, 
    status: 'Delivered', 
    paymentStatus: 'Paid', 
    date: '2026-04-10',
    contactPerson: 'Suresh Kumar (Logistics Head)',
    email: 'suresh.k@apollopharmacy.in',
    phone: '+91 91223 44556',
    address: 'Apollo Central Warehouse, Industrial Area Phase 2, Chennai, TN - 600032',
    gstin: '33AAACA4567M1Z9',
    paymentTerms: 'Net 15 Days',
    carrier: 'Blue Dart Express',
    awb: 'BD-7712-4912',
    estDelivery: '2026-04-14',
    items: [
      { name: 'Sterile Wipe Pouches Box', qty: 800, unitPrice: 225 }
    ]
  },
];

const INITIAL_B2C_ORDERS = [
  { 
    id: 'ORD-B2C-501', 
    customerName: 'Nisha Sharma', 
    product: 'Bapuji Face Sanitizing Pouches (x4)', 
    qty: 4, 
    value: 850, 
    address: 'Sector 4 HSR, Bangalore, Karnataka, 560102', 
    tracking: 'DTDC-8849120', 
    status: 'Delivered',
    date: '2026-06-01',
    phone: '+91 98765 43210',
    email: 'nisha.sharma@gmail.com',
    paymentMethod: 'UPI (PhonePe)',
    country: 'India',
    notes: 'Please drop at security gate if unavailable.',
    refundStatus: 'None',
    items: [
      { name: 'Bapuji Face Sanitizing Pouches', sku: 'BAP-SAN-501', category: 'PPE Wipes', unitPrice: 212.5, qty: 4 }
    ]
  },
  { 
    id: 'ORD-B2C-502', 
    customerName: 'Amit Saxena', 
    product: 'Baby Wipes Pack-of-3 Bio', 
    qty: 2, 
    value: 1200, 
    address: 'Koramangala 3rd Block, Bangalore, Karnataka, 560034', 
    tracking: 'DTDC-9924510', 
    status: 'Shipped',
    date: '2026-06-03',
    phone: '+91 91234 56789',
    email: 'amit.saxena@outlook.com',
    paymentMethod: 'Credit Card',
    country: 'India',
    notes: 'Signature required upon delivery.',
    refundStatus: 'None',
    items: [
      { name: 'Baby Wipes Pack-of-3 Bio', sku: 'BAP-BAB-502', category: 'Baby Care', unitPrice: 600, qty: 2 }
    ]
  },
  { 
    id: 'ORD-B2C-503', 
    customerName: 'Deepa Roy', 
    product: 'IPA Wipe Pack of 100', 
    qty: 1, 
    value: 450, 
    address: 'Indiranagar 100ft Rd, Bangalore, Karnataka, 560008', 
    tracking: '', 
    status: 'Pending',
    date: '2026-06-05',
    phone: '+91 88990 01122',
    email: 'deepa.roy@yahoo.com',
    paymentMethod: 'UPI (GPay)',
    country: 'India',
    notes: 'Deliver before 5:00 PM.',
    refundStatus: 'None',
    items: [
      { name: 'IPA Wipe Pack of 100', sku: 'BAP-CLI-503', category: 'Clinical PPE', unitPrice: 450, qty: 1 }
    ]
  },
  { 
    id: 'ORD-B2C-504', 
    customerName: 'Vivek Kumar', 
    product: 'Luxury Makeup Sachets Pack', 
    qty: 3, 
    value: 1650, 
    address: 'Whitefield Prestige Palms, Bangalore, Karnataka, 560066', 
    tracking: 'DTDC-5002911', 
    status: 'Returned',
    date: '2026-05-28',
    phone: '+91 77665 54433',
    email: 'vivek.kumar@gmail.com',
    paymentMethod: 'Cash on Delivery',
    country: 'India',
    notes: 'Customer requested refund review.',
    refundStatus: 'Pending',
    items: [
      { name: 'Luxury Makeup Sachets Pack', sku: 'BAP-MAK-504', category: 'Cosmetics', unitPrice: 550, qty: 3 }
    ]
  },
];

const INITIAL_PRODUCTS = [
  { id: 'PROD-001', name: 'Clinical Sterile Wipes', sku: 'BAP-CLI-001', category: 'Clinical PPE', price: 44, moq: 1000, stock: 45000, description: 'Individually sealed patient wipes pre-soaked with 70% IPA.', images: ['/img/mother_baby_wipes.png'] },
  { id: 'PROD-002', name: 'CHG 2% Wash Cloths', sku: 'BAP-CHG-002', category: 'Hospital Wipes', price: 68, moq: 1500, stock: 12000, description: 'Chlorhexidine gluconate sanitizing cloth for pre-surgical bathing.', images: ['/img/kitchen_wipes.png'] },
  { id: 'PROD-003', name: 'Biodegradable Baby Wipes', sku: 'BAP-BAB-003', category: 'Baby Care', price: 95, moq: 5000, stock: 68000, description: 'Pure water-based organic spunlace rayon wipes with flip lidding.', images: ['/img/after_shave_wipes.png'] },
  { id: 'PROD-004', name: 'Surface Disinfecting Canister', sku: 'BAP-SUR-004', category: 'Sanitizers', price: 180, moq: 500, stock: 3200, description: 'High-density spunlace wipes in sealed canisters for clinic cleanrooms.', images: ['/img/automobile_wipes.png'] },
];

const INITIAL_RAW_MATERIALS = [
  { id: 'RAW-001', name: 'Spunlace Nonwoven Roll (60 GSM)', category: 'Fabric', stock: '4,200 kg', available: '3,100 kg', reserved: '1,100 kg', status: 'In Stock' },
  { id: 'RAW-002', name: 'Rayon Cellulose fiber substrate', category: 'Fabric', stock: '2,800 kg', available: '2,000 kg', reserved: '800 kg', status: 'In Stock' },
  { id: 'RAW-003', name: 'Chlorhexidine Gluconate (20% Sol.)', category: 'Chemicals', stock: '850 L', available: '250 L', reserved: '600 L', status: 'Low Stock' },
  { id: 'RAW-004', name: 'Isopropyl Alcohol (IPA 99%)', category: 'Chemicals', stock: '2,400 L', available: '1,900 L', reserved: '500 L', status: 'In Stock' },
  { id: 'RAW-005', name: 'Aloe Vera & Organic Fragrance oil', category: 'Fragrance', stock: '120 kg', available: '80 kg', reserved: '40 kg', status: 'In Stock' },
  { id: 'RAW-006', name: 'Plastic Flip Lids (Bapuji Logo)', category: 'Packaging', stock: '1,500 units', available: '1,500 units', reserved: '0 units', status: 'Out of Stock' },
];

const INITIAL_PRODUCTION = [
  { machine: 'Line-A (Rajajinagar Cleanroom)', product: 'Clinical Sterile Wipes', speed: '140 packs/min', target: 50000, currentOutput: 38200, rejections: 240, utilization: 92, status: 'Active' },
  { machine: 'Line-B (Hosur Manufacturing)', product: 'Biodegradable Baby Wipes', speed: '90 packs/min', target: 80000, currentOutput: 45000, rejections: 880, utilization: 86, status: 'Active' },
  { machine: 'Line-C (Compounding Unit)', product: 'CHG 2% Wash Cloths', speed: '0 packs/min', target: 20000, currentOutput: 20000, rejections: 105, utilization: 0, status: 'Maintenance' },
  { machine: 'Line-D (Canister Filling)', product: 'Surface Disinfecting Canister', speed: '45 packs/min', target: 10000, currentOutput: 2100, rejections: 14, utilization: 78, status: 'Active' },
];

const INITIAL_LEADS = [
  { id: 'LEAD-101', name: 'Vikram Seth', email: 'vseth@maxhealthcare.com', phone: '+91 99443 11223', company: 'Max Super Speciality Hospital', source: 'OEM Customizer', status: 'New', amount: 1500000, date: '2026-06-01' },
  { id: 'LEAD-102', name: 'Helena Costa', email: 'hcosta@portuguesepack.pt', phone: '+351 912 345 678', company: 'Costa Care Distribuidora', source: 'Contact Form', status: 'Contacted', amount: 2400000, date: '2026-05-29' },
  { id: 'LEAD-103', name: 'Manish Gupta', email: 'manish@guptadist.in', phone: '+91 98450 67123', company: 'Gupta Medical Supplies', source: 'B2B Registry', status: 'Qualified', amount: 480000, date: '2026-05-24' },
  { id: 'LEAD-104', name: 'Laura Vance', email: 'laura@vancebrands.com', phone: '+1 312 555 0188', company: 'Vance Skin & Baby Group', source: 'OEM Customizer', status: 'Proposal Sent', amount: 3500000, date: '2026-05-18' },
  { id: 'LEAD-105', name: 'Dr. Arjun Dev', email: 'arjun.dev@arjunclinics.org', phone: '+91 93411 22998', company: 'Arjun Pediatric Clinics', source: 'Direct Callback', status: 'Won', amount: 890000, date: '2026-05-10' },
  { id: 'LEAD-106', name: 'Rayan Al-Sayed', email: 'rayan@gulfhealth.ae', phone: '+971 4 555 9821', company: 'Gulf Medical Distribution', source: 'Contact Form', status: 'Lost', amount: 1200000, date: '2026-04-12' },
];

const INITIAL_REVIEWS = [
  { id: 'REV-01', name: 'Pranav Murthy', rating: 5, review: 'Exceptional cleanroom validation standards. Our private label order of sterile clinical wipes arrived exactly on schedule with batch certificates. Extremely professional team.', date: '2026-05-22', reply: 'Thank you Pranav! We ensure class 100 sterile atmospheric packaging on every single clinical batch.' },
  { id: 'REV-02', name: 'Jessica Taylor (Medline)', rating: 4, review: 'Good product catalog and MOQ flexibility. The baby wipes lidding caps have crisp branding prints. Slightly longer lead time during compounding but quality makes up for it.', date: '2026-05-14', reply: 'We appreciate the feedback, Jessica. Compounding chemical testing takes 2 extra days to guarantee dermatological safety.' },
  { id: 'REV-03', name: 'Sanjay Dutt', rating: 5, review: 'Best bulk CHG clinical wet wipes in India. Apollo Pharmacy trusts Bapuji Surgicals for HSR cleanroom packaging.', date: '2026-04-30', reply: '' },
  { id: 'REV-04', name: 'Thomas K. (Lotus)', rating: 3, review: 'The make-up remover wipes fabric substrate is excellent. However, packaging box cartons arrived with slight moisture dampness due to transportation rain. Requesting weather-proof sheets.', date: '2026-04-15', reply: 'Apologies Thomas. We have updated our dispatch truck specifications to include waterproof vinyl sheets for monsoon safety.' },
];

const mergeDashboardOrders = (initialOrders, liveOrders = []) => {
  const liveOrderRows = Array.isArray(liveOrders)
    ? liveOrders.filter(Boolean).map((order) => ({ ...order, liveSynced: true }))
    : [];
  const liveIds = new Set(liveOrderRows.map((order) => order.id));

  return [
    ...liveOrderRows,
    ...initialOrders.filter((order) => !liveIds.has(order.id))
  ];
};

const DASHBOARD_API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

const toDateOnly = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
};

const titleCaseStatus = (value, fallback = 'Pending') => {
  if (!value) return fallback;
  return `${value}`.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDashboardAddress = (address = {}) => (
  [address.street, address.city, address.state, address.zipCode, address.country].filter(Boolean).join(', ')
);

const summarizeOrderItems = (items = []) => {
  const totalQty = items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  if (items.length === 1) return `${items[0].name} (x${items[0].qty})`;
  return `${items.length} products / ${totalQty} units`;
};

const normalizeBackendOrderItems = (items = []) => items.map((item) => ({
  name: item.name,
  sku: item.product || item._id || 'WEB-SKU',
  category: 'Website Order',
  qty: Number(item.qty || 0),
  unitPrice: Number(item.price || item.unitPrice || 0)
}));

const mapBackendOrderToDashboard = (order) => {
  const orderId = String(order?._id || order?.id || Date.now());
  const items = normalizeBackendOrderItems(order.orderItems || order.items || []);
  const qty = items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const productSummary = summarizeOrderItems(items);
  const statusMap = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  const paymentMap = {
    paid: 'Paid',
    unpaid: 'Unpaid',
    processing: 'Pending',
    refunded: 'Refunded'
  };

  if (order.orderType === 'b2b') {
    return {
      id: `ORD-B2B-${orderId.slice(-6).toUpperCase()}`,
      backendId: orderId,
      businessName: order.user?.b2bProfile?.companyName || order.user?.name || 'Website B2B Customer',
      products: productSummary,
      qty,
      amount: Number(order.totalAmount || 0),
      status: statusMap[order.orderStatus] || titleCaseStatus(order.orderStatus),
      paymentStatus: paymentMap[order.paymentStatus] || titleCaseStatus(order.paymentStatus, 'Unpaid'),
      date: toDateOnly(order.createdAt),
      contactPerson: order.user?.name || 'Website Buyer',
      email: order.user?.email || '',
      phone: order.user?.phone || '',
      address: formatDashboardAddress(order.shippingAddress),
      gstin: order.user?.b2bProfile?.gstin || 'GST pending',
      paymentTerms: order.purchaseOrderNumber ? `PO ${order.purchaseOrderNumber}` : titleCaseStatus(order.paymentMethod, 'Online payment'),
      carrier: 'Dispatch team to assign',
      awb: order.trackingNumber || 'Awaiting Label Generation',
      estDelivery: 'To be scheduled',
      items,
      invoiceNumber: order.invoiceNumber,
      emailDeliveryStatus: order.emailDeliveryStatus || 'not_sent',
      emailLogs: order.emailLogs || []
    };
  }

  return {
    id: `ORD-B2C-${orderId.slice(-6).toUpperCase()}`,
    backendId: orderId,
    customerName: order.user?.name || 'Website Customer',
    product: productSummary,
    qty,
    value: Number(order.totalAmount || 0),
    address: formatDashboardAddress(order.shippingAddress),
    tracking: order.trackingNumber || '',
    status: statusMap[order.orderStatus] || titleCaseStatus(order.orderStatus),
    date: toDateOnly(order.createdAt),
    phone: order.user?.phone || '',
    email: order.user?.email || '',
    paymentMethod: titleCaseStatus(order.paymentMethod, 'Online payment'),
    country: order.shippingAddress?.country || 'India',
    notes: 'Synced from live website order API.',
    refundStatus: order.paymentStatus === 'refunded' ? 'Refunded' : 'None',
    items,
    invoiceNumber: order.invoiceNumber,
    emailDeliveryStatus: order.emailDeliveryStatus || 'not_sent',
    emailLogs: order.emailLogs || []
  };
};

const mapBackendOemToDashboard = (inquiry) => {
  const id = String(inquiry?._id || inquiry?.id || Date.now());
  const unitPrice = Number(inquiry.quotedPrice || (Number(inquiry.targetQuantity || 0) < 1000 ? 28 : Number(inquiry.targetQuantity || 0) < 5000 ? 24 : 19));
  const quantity = Number(inquiry.targetQuantity || 0);
  const statusMap = {
    submitted: 'Inquiry',
    reviewing: 'Quotation Sent',
    quoted: 'Quotation Sent',
    accepted: 'Sample Approval',
    declined: 'Inquiry'
  };

  return {
    id: `OEM-${id.slice(-6).toUpperCase()}`,
    company: inquiry.companyName || 'Website OEM Inquiry',
    contact: inquiry.contactPerson || inquiry.user?.name || 'Website Buyer',
    email: inquiry.email || inquiry.user?.email || '',
    phone: inquiry.phone || '',
    product: `${inquiry.productCategory || 'custom wipes'}`.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    wipeType: inquiry.specifications?.material || 'Custom substrate',
    fragrance: inquiry.specifications?.sterilization || 'Custom formula',
    packaging: inquiry.specifications?.packaging || 'Custom packaging',
    quantity,
    unitPrice,
    amount: quantity * unitPrice,
    orderDate: toDateOnly(inquiry.createdAt),
    deliveryDate: toDateOnly(new Date(new Date(inquiry.createdAt || Date.now()).getTime() + 45 * 24 * 60 * 60 * 1000)),
    status: statusMap[inquiry.status] || 'Inquiry',
    comments: inquiry.adminFeedback || inquiry.description || 'Synced from website OEM inquiry API.',
    health: inquiry.status === 'declined' ? 'red' : 'green',
    healthStatus: inquiry.status === 'declined' ? 'NEEDS REVIEW' : 'WEBSITE RFQ',
    assignedTeam: { sales: 'Vignesh Sullia', production: 'Pending assignment', qc: 'Pending assignment' },
    documents: inquiry.attachmentPath
      ? [{ name: inquiry.attachmentPath.split(/[\\/]/).pop(), type: 'Website Upload', size: 'Client file', date: toDateOnly(inquiry.createdAt) }]
      : []
  };
};

const INITIAL_FINANCE_AR = [
  { id: 'INV-APO-204', customer: 'Apollo Pharmacy', invoiceDate: '2026-05-18', dueDate: '2026-06-22', amount: 560000, status: 'Due Soon', owner: 'Collections', notes: 'B2B monthly hospital wipes dispatch' },
  { id: 'INV-SUR-118', customer: 'Surat Surgical Supply', invoiceDate: '2026-05-25', dueDate: '2026-06-15', amount: 240000, status: 'Overdue', owner: 'Collections', notes: 'Distributor payment follow-up required' },
  { id: 'INV-FOR-331', customer: 'Fortis Hospital Group', invoiceDate: '2026-06-02', dueDate: '2026-06-30', amount: 420000, status: 'Open', owner: 'AR Clerk', notes: 'GST invoice sent to procurement desk' },
];

const INITIAL_FINANCE_AP = [
  { id: 'BILL-SPN-090', vendor: 'Spunlace Mills Pvt Ltd', category: 'Fabric substrate', dueDate: '2026-06-16', amount: 180000, status: 'Approval Needed', gl: 'Raw Material - Fabric', match: '2-way match' },
  { id: 'BILL-CHM-044', vendor: 'Chlorhexidine Labs', category: 'Chemicals', dueDate: '2026-06-20', amount: 350000, status: 'Scheduled', gl: 'Raw Material - Chemicals', match: '3-way match' },
  { id: 'BILL-LOG-221', vendor: 'Hosur Cold Logistics', category: 'Freight', dueDate: '2026-06-12', amount: 95000, status: 'Approval Needed', gl: 'Freight Outward', match: 'Exception' },
];

const INITIAL_FINANCE_PNL = [
  { label: 'Revenue turnover', value: 8500000, color: '#0976BC' },
  { label: 'Factory overhead', value: 4400000, color: '#ef4444' },
  { label: 'GST liability 18%', value: 738000, color: '#f59e0b' },
  { label: 'Net profit margin', value: 3362000, color: '#10b981' },
];

const INITIAL_FINANCE_OWNER_SUMMARY = [
  { label: "Today's Revenue", value: 235000, color: '#0976BC', icon: TrendingUp },
  { label: "Today's Expense", value: 95000, color: '#ef4444', icon: TrendingDown },
  { label: "Today's Profit", value: 140000, color: '#10b981', icon: DollarSign },
  { label: 'Bank Balance', value: 1850000, color: '#6366f1', icon: CreditCard },
  { label: 'Pending Receivables', value: 0, color: '#ca8a04', icon: Clock, computed: 'ar' },
  { label: 'Pending Payables', value: 0, color: '#ef4444', icon: ShieldAlert, computed: 'ap' },
  { label: 'GST Due', value: 125000, color: '#f59e0b', icon: FileText },
  { label: 'Projects Running', value: 14, color: '#0976BC', icon: Briefcase },
];

const INITIAL_FINANCE_BANKS = [
  { name: 'HDFC Current Account', type: 'Primary', balance: 1265000, movement: '+8.2%' },
  { name: 'SBI Savings Reserve', type: 'Reserve', balance: 585000, movement: '+2.1%' },
  { name: 'Factory Machinery Loan', type: 'Loan', balance: -720000, movement: 'EMI due' },
];

const INITIAL_FINANCE_TAX_WATCH = [
  { label: 'Output GST', value: 612000, color: '#ef4444' },
  { label: 'Input GST', value: 487000, color: '#10b981' },
  { label: 'TDS Payable', value: 84000, color: '#f59e0b' },
  { label: 'Payroll Cost', value: 640000, color: '#0976BC' },
];

const INITIAL_FINANCE_PROJECTS = [
  { project: 'Apollo CHG Wet Wipes Supply', revenue: 1450000, cost: 910000, margin: 37 },
  { project: 'PureCare Baby Wipes OEM', revenue: 3200000, cost: 2260000, margin: 29 },
  { project: 'Lotus Wellness Bamboo Wipes', revenue: 1850000, cost: 1620000, margin: 12 },
];

const INITIAL_FINANCE_APPROVALS = [
  { id: 'APR-101', title: 'Vendor payment above limit', owner: 'Accounts Team', amount: 350000, stage: 'Owner Approval' },
  { id: 'APR-102', title: 'Purchase order for plastic flip lids', owner: 'Procurement', amount: 275000, stage: 'Manager Review' },
  { id: 'APR-103', title: 'Employee reimbursement batch', owner: 'HR Payroll', amount: 48000, stage: 'Accounts Check' },
];

const INITIAL_FINANCE_ALERTS = [
  { text: 'Customer Surat Surgical Supply has overdue invoices worth INR 240,000.', tone: '#ef4444' },
  { text: 'Expected cash shortage risk is low for the next 15 days.', tone: '#10b981' },
  { text: 'GST payment due is approaching. Keep INR 125,000 reserved.', tone: '#f59e0b' },
  { text: 'Lotus project margin is below target. Review material cost.', tone: '#ef4444' },
];

const INITIAL_FINANCE_TRANSACTIONS = [
  { id: 'TXN-501', type: 'Receipt', party: 'Fortis Hospital Group', amount: 220000, status: 'Posted' },
  { id: 'TXN-502', type: 'Vendor Bill', party: 'Chlorhexidine Labs', amount: 350000, status: 'Scheduled' },
  { id: 'TXN-503', type: 'Payroll', party: 'Factory Staff', amount: 640000, status: 'Draft' },
  { id: 'TXN-504', type: 'GST', party: 'June liability', amount: 125000, status: 'Reserved' },
];

const INITIAL_AUDIT_LOGS = [
  { id: 'AUD-001', user: 'vignesh@bapujisurg.com', action: 'Approved B2B account: Fortis Group', time: '2026-06-02 10:14:22' },
  { id: 'AUD-002', user: 'arjun@bapujisurg.com', action: 'Modified SKU BAP-CHG-002 price to ₹68', time: '2026-06-02 08:33:04' },
  { id: 'AUD-003', user: 'vignesh@bapujisurg.com', action: 'Submitted OEM quote QT-206 to Sarah Jenkins', time: '2026-06-01 16:54:12' },
  { id: 'AUD-004', user: 'systems@bapujisurg.com', action: 'System Alert: Plastic Flip Lids marked Out of Stock', time: '2026-06-01 12:00:00' },
  { id: 'AUD-005', user: 'helen@bapujisurg.com', action: 'Updated CMS Homepage Hero description text', time: '2026-05-31 14:12:44' },
];

// --- CHARTS HARDCODED DATASETS ---
const REVENUE_ANALYTICS = [
  { name: 'Jan', Revenue: 4500000, Profit: 1800000, Expenses: 2700000 },
  { name: 'Feb', Revenue: 5200000, Profit: 2100000, Expenses: 3100000 },
  { name: 'Mar', Revenue: 4900000, Profit: 1950000, Expenses: 2950000 },
  { name: 'Apr', Revenue: 6300000, Profit: 2800000, Expenses: 3500000 },
  { name: 'May', Revenue: 7800000, Profit: 3600000, Expenses: 4200000 },
  { name: 'Jun', Revenue: 8500000, Profit: 4100000, Expenses: 4400000 },
];

const ORDER_TRENDS = [
  { name: 'Mon', OEM: 12, B2B: 45, B2C: 180 },
  { name: 'Tue', OEM: 18, B2B: 38, B2C: 220 },
  { name: 'Wed', OEM: 8, B2B: 50, B2C: 250 },
  { name: 'Thu', OEM: 24, B2B: 62, B2C: 190 },
  { name: 'Fri', OEM: 15, B2B: 40, B2C: 210 },
  { name: 'Sat', OEM: 5, B2B: 12, B2C: 340 },
  { name: 'Sun', OEM: 2, B2B: 8, B2C: 400 },
];

const TOP_PRODUCTS = [
  { name: 'Clinical Pouches', Qty: 450000, Revenue: 19800000 },
  { name: 'Baby Care Packs', Qty: 320000, Revenue: 30400000 },
  { name: 'CHG Wash Cloths', Qty: 150000, Revenue: 10200000 },
  { name: 'Canister Wipes', Qty: 68000, Revenue: 12240000 },
];

const GEOGRAPHIC_SALES = [
  { name: 'Karnataka', sales: 4800000, cords: 'Bangalore / HSR' },
  { name: 'Maharashtra', sales: 3200000, cords: 'Mumbai / Pune' },
  { name: 'Tamil Nadu', sales: 2900000, cords: 'Chennai / Hosur' },
  { name: 'Delhi NCR', sales: 2100000, cords: 'Noida / Gurgaon' },
  { name: 'Gujarat', sales: 1800000, cords: 'Surat / Ahmedabad' },
];

const GOOGLE_ANALYTICS_TRAFFIC = [
  { name: 'Organic', value: 45 },
  { name: 'Direct', value: 25 },
  { name: 'Paid Search', value: 15 },
  { name: 'Social Media', value: 10 },
  { name: 'Referral', value: 5 },
];

const DEVICE_BREAKDOWN = [
  { name: 'Desktop', value: 58 },
  { name: 'Mobile', value: 36 },
  { name: 'Tablet', value: 6 },
];

const MARKETING_ROAS = [
  { platform: 'Google Search Ads', spend: 180000, leads: 120, conversions: 24, roas: 4.8 },
  { platform: 'Facebook Retail Ads', spend: 120000, leads: 340, conversions: 85, roas: 3.5 },
  { platform: 'LinkedIn B2B Ads', spend: 150000, leads: 48, conversions: 8, roas: 5.2 },
];

const formatNumber = (num) => {
  if (num === null || num === undefined) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ROLE_DETAILS = {
  'Admin': { label: 'Admin (Full Access)', icon: Shield, color: '#0976BC', bg: 'rgba(9, 118, 188, 0.08)' },
  'Sales Manager': { label: 'Sales Manager', icon: TrendingUp, color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)' },
  'Production Manager': { label: 'Production Manager', icon: Factory, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.08)' },
  'Support Team': { label: 'Support Team', icon: Users, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' }
};

const renderTrafficActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 3}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: 'drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.25))' }}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 5}
        outerRadius={innerRadius - 3}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.6}
      />
    </g>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Navigation & Simulation states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [simulatedRole, setSimulatedRole] = useState('Admin'); // Simulated role switcher for visual demo
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Analytics & Custom Theme States
  const [timeRange, setTimeRange] = useState('30 Days');
  const [darkMode, setDarkMode] = useState(false);
  const [heatmapMetric, setHeatmapMetric] = useState('Orders');
  const [activeTrafficIndex, setActiveTrafficIndex] = useState(null);
  const [animatedValues, setAnimatedValues] = useState({ revenue: 0, orders: 0, profit: 0, visitors: 0, conversion: 0 });

  const theme = {
    bg: darkMode ? '#09090b' : '#f8f9fa',
    cardBg: darkMode ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.65)',
    border: darkMode ? '1px solid rgba(63, 63, 70, 0.7)' : '1px solid rgba(241, 245, 249, 0.9)',
    borderColorRaw: darkMode ? 'rgba(63, 63, 70, 0.7)' : 'rgba(241, 245, 249, 0.9)',
    text: darkMode ? '#f4f4f5' : '#0f172a',
    subtitle: darkMode ? '#a1a1aa' : '#71717a',
    accent: darkMode ? '#3b82f6' : '#0976BC',
    accentLight: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(9, 118, 188, 0.08)',
    divider: darkMode ? 'rgba(63, 63, 70, 0.4)' : '#f1f5f9',
    itemBg: darkMode ? 'rgba(39, 39, 42, 0.6)' : 'rgba(250, 250, 250, 0.5)',
    legendBg: darkMode ? 'rgba(39, 39, 42, 0.4)' : 'rgba(253, 253, 253, 0.8)',
    legendBorder: darkMode ? 'rgba(63, 63, 70, 0.4)' : 'rgba(241, 245, 249, 0.8)',
    shadow: darkMode ? '0 10px 30px -10px rgba(0,0,0,0.5)' : '0 10px 30px -10px rgba(0,0,0,0.04)',
    tooltipBg: darkMode ? '#18181b' : '#ffffff',
    tooltipBorder: darkMode ? '#27272a' : '#e2e8f0',
  };

  const getKPIValuesForRange = (range) => {
    switch (range) {
      case 'Today':
        return { revenue: 48000, orders: 82, profit: 18000, visitors: 950, conversion: 5.12, rG: '+2.1%', oG: '+1.5%', pG: '+3.2%', vG: '+4.8%', cG: '+0.12%', rGl: true, oGl: true, pGl: true, vGl: true, cGl: true };
      case '7 Days':
        return { revenue: 320000, orders: 345, profit: 110000, visitors: 3420, conversion: 4.65, rG: '+8.4%', oG: '+5.2%', pG: '+6.8%', vG: '+9.1%', cG: '-0.15%', rGl: true, oGl: true, pGl: true, vGl: true, cGl: false };
      case '90 Days':
        return { revenue: 3820000, orders: 4120, profit: 1280000, visitors: 45210, conversion: 4.91, rG: '+24.1%', oG: '+12.4%', pG: '+18.2%', vG: '+15.6%', cG: '+0.35%', rGl: true, oGl: true, pGl: true, vGl: true, cGl: true };
      case 'Year':
        return { revenue: 15200000, orders: 16840, profit: 5120000, visitors: 182400, conversion: 5.05, rG: '+32.8%', oG: '+22.1%', pG: '+28.4%', vG: '+26.2%', cG: '+0.45%', rGl: true, oGl: true, pGl: true, vGl: true, cGl: true };
      case '30 Days':
      default:
        return { revenue: 1240000, orders: 1348, profit: 410000, visitors: 14240, conversion: 4.82, rG: '+18.5%', oG: '+8.2%', pG: '+14.1%', vG: '+12.6%', cG: '+0.25%', rGl: true, oGl: true, pGl: true, vGl: true, cGl: true };
    }
  };

  useEffect(() => {
    if (activeTab === 'Analytics') {
      const targets = getKPIValuesForRange(timeRange);
      setAnimatedValues({ revenue: 0, orders: 0, profit: 0, visitors: 0, conversion: 0 });
      let start = 0;
      const duration = 800; // 0.8s count up
      const steps = 20;
      const stepTime = duration / steps;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const ease = 1 - Math.pow(1 - progress, 3);
        
        setAnimatedValues({
          revenue: Math.floor(ease * targets.revenue),
          orders: Math.floor(ease * targets.orders),
          profit: Math.floor(ease * targets.profit),
          visitors: Math.floor(ease * targets.visitors),
          conversion: ease * targets.conversion
        });
        
        if (step >= steps) {
          clearInterval(timer);
        }
      }, stepTime);
      
      return () => clearInterval(timer);
    }
  }, [activeTab, timeRange]);

  const formatKPIValue = (metric, val) => {
    if (metric === 'revenue' || metric === 'profit') {
      if (timeRange === 'Today') return `₹${(val / 1000).toFixed(0)}k`;
      if (timeRange === 'Year') return `₹${(val / 10000000).toFixed(2)}Cr`;
      return `₹${(val / 100000).toFixed(1)}L`;
    }
    if (metric === 'conversion') return `${val.toFixed(2)}%`;
    if (val >= 100000) return `${(val / 1000).toFixed(1)}k`;
    return formatNumber(val);
  };

  const generateHeatmapData = (metric) => {
    const data = [];
    const baseVal = metric === 'Revenue' ? 5000 : metric === 'Leads' ? 2 : 5;
    for (let day = 0; day < 7; day++) {
      const dayRow = [];
      for (let week = 0; week < 24; week++) {
        const val = Math.floor(Math.sin((week + day) * 0.5) * (baseVal * 0.4) + baseVal * 0.6) + (Math.random() > 0.85 ? Math.floor(baseVal * 0.5) : 0);
        dayRow.push(val);
      }
      data.push(dayRow);
    }
    return data;
  };

  const getCellBg = (val, metric) => {
    if (val === 0) return darkMode ? 'rgba(63, 63, 70, 0.2)' : 'rgba(228, 228, 231, 0.4)';
    let baseColor = 'rgba(9, 118, 188, '; // Blue for Orders
    if (metric === 'Revenue') baseColor = 'rgba(242, 144, 79, '; // Orange for Revenue
    if (metric === 'Leads') baseColor = 'rgba(139, 92, 246, '; // Purple for Leads
    
    const maxVal = metric === 'Revenue' ? 8000 : metric === 'Leads' ? 4 : 8;
    const opacity = Math.min(0.2 + (val / maxVal) * 0.8, 1);
    return `${baseColor}${opacity})`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: darkMode ? '#18181b' : '#ffffff',
          border: darkMode ? '1px solid #27272a' : '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
          fontSize: '0.82rem',
          minWidth: '150px',
          color: theme.text
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px', borderBottom: `1px solid ${theme.divider}`, paddingBottom: '4px' }}>{label}</p>
          {payload.map((pld, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', margin: '4px 0' }}>
              <span style={{ color: theme.subtitle }}>{pld.name}:</span>
              <span style={{ fontWeight: 'bold' }}>
                {pld.name === 'Revenue' || pld.name === 'Profit' || pld.name === 'Expenses' || pld.name === 'Spend' ? `₹${formatNumber(pld.value)}` : formatNumber(pld.value)}
              </span>
            </div>
          ))}
          <div style={{ color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '0.75rem' }}>
            <span>↑ 12.5%</span>
            <span style={{ color: theme.subtitle, fontWeight: 'normal' }}>vs last period</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: darkMode ? '#18181b' : '#ffffff',
          border: darkMode ? '1px solid #27272a' : '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
          fontSize: '0.82rem',
          color: theme.text
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '6px' }}>{data.name}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', margin: '2px 0' }}>
            <span style={{ color: theme.subtitle }}>Sessions:</span>
            <span style={{ fontWeight: 'bold' }}>{formatNumber(data.value)}</span>
          </div>
          <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.75rem', marginTop: '4px' }}>
            ↑ 12.8% vs last month
          </div>
        </div>
      );
    }
    return null;
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };
  
  // Live lists containing prefilled static data models (stateful to allow simulation)
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [oemOrders, setOemOrders] = useState(INITIAL_OEM_ORDERS);
  const [quotations, setQuotations] = useState(INITIAL_QUOTATIONS);
  const [b2bOrders, setB2bOrders] = useState(INITIAL_B2B_ORDERS);
  const [b2bSearchQuery, setB2bSearchQuery] = useState('');
  const [b2bFilterStatus, setB2bFilterStatus] = useState('All');
  const [b2bFilterPayment, setB2bFilterPayment] = useState('All');
  const [selectedB2bOrder, setSelectedB2bOrder] = useState(null);
  const [showB2bDrawer, setShowB2bDrawer] = useState(false);
  const [b2bStatusDropdownOpen, setB2bStatusDropdownOpen] = useState(false);
  const [b2bPaymentDropdownOpen, setB2bPaymentDropdownOpen] = useState(false);
  const [b2cOrders, setB2cOrders] = useState(INITIAL_B2C_ORDERS);
  const [b2cSearchQuery, setB2cSearchQuery] = useState('');
  const [b2cFilterStatus, setB2cFilterStatus] = useState('All');
  const [b2cFilterPayment, setB2cFilterPayment] = useState('All');
  const [b2cFilterValue, setB2cFilterValue] = useState('All');
  const [b2cStatusDropdownOpen, setB2cStatusDropdownOpen] = useState(false);
  const [b2cPaymentDropdownOpen, setB2cPaymentDropdownOpen] = useState(false);
  const [b2cValueDropdownOpen, setB2cValueDropdownOpen] = useState(false);
  const [selectedB2cOrder, setSelectedB2cOrder] = useState(null);
  const [showB2cDrawer, setShowB2cDrawer] = useState(false);
  const [selectedB2cCustomer, setSelectedB2cCustomer] = useState(null);
  const [showB2cCustomerDrawer, setShowB2cCustomerDrawer] = useState(false);
  const [selectedB2cTracking, setSelectedB2cTracking] = useState(null);
  const [showB2cTrackingDrawer, setShowB2cTrackingDrawer] = useState(false);
  const [b2cViewMode, setB2cViewMode] = useState('table'); // 'table' or 'card'
  const [b2cActivityFeed, setB2cActivityFeed] = useState([
    { id: 1, text: 'Order #ORD-B2C-503 Placed', time: '10 mins ago', type: 'order' },
    { id: 2, text: 'Order #ORD-B2C-502 Shipped', time: '2 hours ago', type: 'ship' },
    { id: 3, text: 'Refund for #ORD-B2C-504 Approved', time: '4 hours ago', type: 'refund' },
  ]);

  useEffect(() => {
    const syncDashboardOrders = (orders) => {
      setOemOrders(mergeDashboardOrders(INITIAL_OEM_ORDERS, orders.oem));
      setB2bOrders(mergeDashboardOrders(INITIAL_B2B_ORDERS, orders.b2b));
      setB2cOrders(mergeDashboardOrders(INITIAL_B2C_ORDERS, orders.b2c));

      const liveB2cFeed = (orders.b2c || []).map((order, index) => ({
        id: `live-${order.id || index}`,
        text: `Website order #${order.id} placed`,
        time: 'Live sync',
        type: 'order'
      }));

      if (liveB2cFeed.length > 0) {
        setB2cActivityFeed((prev) => [
          ...liveB2cFeed,
          ...prev.filter((item) => !`${item.id}`.startsWith('live-'))
        ].slice(0, 8));
      }
    };

    syncDashboardOrders(getLiveOrders());
    return subscribeLiveOrders(syncDashboardOrders);
  }, []);

  useEffect(() => {
    if (!user?.token) return;

    const controller = new AbortController();
    const fetchBackendOrders = async () => {
      try {
        const requestOptions = {
          headers: { Authorization: `Bearer ${user.token}` },
          signal: controller.signal
        };

        const [ordersRes, oemRes] = await Promise.allSettled([
          fetch(`${DASHBOARD_API_BASE}/api/orders`, requestOptions),
          fetch(`${DASHBOARD_API_BASE}/api/oem`, requestOptions)
        ]);

        const currentOrders = getLiveOrders();
        const nextOrders = { ...currentOrders };

        if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
          const backendOrders = await ordersRes.value.json();
          const mappedOrders = Array.isArray(backendOrders) ? backendOrders.map(mapBackendOrderToDashboard) : [];
          nextOrders.b2b = mergeDashboardOrders(currentOrders.b2b, mappedOrders.filter((order) => order.id.startsWith('ORD-B2B')));
          nextOrders.b2c = mergeDashboardOrders(currentOrders.b2c, mappedOrders.filter((order) => order.id.startsWith('ORD-B2C')));
        }

        if (oemRes.status === 'fulfilled' && oemRes.value.ok) {
          const backendOemOrders = await oemRes.value.json();
          nextOrders.oem = mergeDashboardOrders(
            currentOrders.oem,
            Array.isArray(backendOemOrders) ? backendOemOrders.map(mapBackendOemToDashboard) : []
          );
        }

        saveLiveOrders(nextOrders);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('Live backend order sync skipped', error);
        }
      }
    };

    fetchBackendOrders();

    return () => controller.abort();
  }, [user?.token]);

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [rawMaterials, setRawMaterials] = useState(INITIAL_RAW_MATERIALS);
  const [editingRawMaterialId, setEditingRawMaterialId] = useState(null);
  const [rawMaterialDraft, setRawMaterialDraft] = useState({ stock: '', available: '', reserved: '', status: 'In Stock' });
  const [productionMetrics, setProductionMetrics] = useState(INITIAL_PRODUCTION);
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [openLeadStatusMenu, setOpenLeadStatusMenu] = useState(null);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [newLead, setNewLead] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    website: '',
    source: 'Contact Form',
    status: 'New',
    amount: 0
  });
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [financeArLedger, setFinanceArLedger] = useState(INITIAL_FINANCE_AR);
  const [financeApLedger, setFinanceApLedger] = useState(INITIAL_FINANCE_AP);
  const [financeEditMode, setFinanceEditMode] = useState(false);
  const [financePnlRows, setFinancePnlRows] = useState(INITIAL_FINANCE_PNL);
  const [financeOwnerSummary, setFinanceOwnerSummary] = useState(INITIAL_FINANCE_OWNER_SUMMARY);
  const [financeBankAccounts, setFinanceBankAccounts] = useState(INITIAL_FINANCE_BANKS);
  const [financeTaxWatch, setFinanceTaxWatch] = useState(INITIAL_FINANCE_TAX_WATCH);
  const [financeProjects, setFinanceProjects] = useState(INITIAL_FINANCE_PROJECTS);
  const [financeApprovals, setFinanceApprovals] = useState(INITIAL_FINANCE_APPROVALS);
  const [financeAlerts, setFinanceAlerts] = useState(INITIAL_FINANCE_ALERTS);
  const [financeTransactions, setFinanceTransactions] = useState(INITIAL_FINANCE_TRANSACTIONS);
  const [activeSettingsSection, setActiveSettingsSection] = useState('Company Settings');
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  
  // Interactive feature states
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Customer HubSpot Detail Drawer
  const [crmNote, setCrmNote] = useState('');
  const [newCrmFile, setNewCrmFile] = useState(null);
  
  // Quotation creator model
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [newQuote, setNewQuote] = useState({ customer: '', product: '', moq: 10000, price: 0, validity: '30' });
  const [quoteSearchQuery, setQuoteSearchQuery] = useState('');
  const [quoteFilterStatus, setQuoteFilterStatus] = useState('All');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerFilterType, setCustomerFilterType] = useState('All');
  const [customerFilterStatus, setCustomerFilterStatus] = useState('All');
  
  // Product editor details
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', category: 'Clinical PPE', price: 0, moq: 500, stock: 1000, description: '' });
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProductForm, setEditProductForm] = useState(null);
  const [cropBox, setCropBox] = useState({ scale: 1, rotate: 0 });
  const [reorderedImages, setReorderedImages] = useState(['/img/mother_baby_wipes.png', '/img/kitchen_wipes.png']);
  const [showStockBreakdownModal, setShowStockBreakdownModal] = useState(false);
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [stockCategoryFilter, setStockCategoryFilter] = useState('All');
  
  // OEM Order Modal States
  const [showNewOemModal, setShowNewOemModal] = useState(false);
  const [newOemOrder, setNewOemOrder] = useState({
    company: '',
    contact: '',
    product: '',
    wipeType: 'Rayon 60 GSM',
    fragrance: 'Organic Aloe Vera',
    packaging: 'Flip Lid 80-Pack Pack',
    quantity: 50000,
    unitPrice: 40,
    comments: ''
  });

  // OEM Customer Modal States
  const [showNewOemCustomerModal, setShowNewOemCustomerModal] = useState(false);
  const [newOemCustomer, setNewOemCustomer] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    notes: '',
    website: '',
    industry: '',
    moq: 10000,
    interest: 'Baby Wipes',
    source: 'Website'
  });

  // OEM Customer Detail Drawer State
  const [selectedOemCustomer, setSelectedOemCustomer] = useState(null);

  // OEM Filters & Search
  const [oemSearch, setOemSearch] = useState('');
  const [oemStatusFilter, setOemStatusFilter] = useState('All');
  const [oemCountryFilter, setOemCountryFilter] = useState('All');
  const [oemStageFilter, setOemStageFilter] = useState('All');

  // Success Toast state
  const [oemToast, setOemToast] = useState({ show: false, title: '', desc: '', id: '' });

  // Node hover tooltip state
  const [hoveredNode, setHoveredNode] = useState(null);

  // Computed filtered OEM orders
  const filteredOemOrders = useMemo(() => {
    return oemOrders.filter(ord => {
      // 1. Search Query
      if (oemSearch) {
        const query = oemSearch.toLowerCase();
        const matchesCompany = ord.company?.toLowerCase().includes(query) || ord.companyName?.toLowerCase().includes(query);
        const matchesProduct = ord.product?.toLowerCase().includes(query) || ord.wipeType?.toLowerCase().includes(query);
        const matchesId = ord.id?.toLowerCase().includes(query);
        if (!matchesCompany && !matchesProduct && !matchesId) {
          return false;
        }
      }

      // 2. Health Filter (oemStatusFilter)
      if (oemStatusFilter !== 'All') {
        const healthMap = {
          'On Track': 'green',
          'Attention Needed': 'orange',
          'Delayed': 'red'
        };
        const expectedHealth = healthMap[oemStatusFilter];
        if (expectedHealth && ord.health !== expectedHealth) {
          return false;
        }
      }

      // 3. Country Filter (oemCountryFilter)
      if (oemCountryFilter !== 'All') {
        const customer = customers.find(c => c.company === ord.company);
        const country = customer ? customer.country : (ord.country || 'India');
        if (country.toLowerCase() !== oemCountryFilter.toLowerCase()) {
          return false;
        }
      }

      // 4. Stage Filter (oemStageFilter)
      if (oemStageFilter !== 'All' && ord.status !== oemStageFilter) {
        return false;
      }

      return true;
    });
  }, [oemOrders, oemSearch, oemStatusFilter, oemCountryFilter, oemStageFilter, customers]);

  // Auto-dismiss toast timer
  useEffect(() => {
    if (oemToast.show) {
      const timer = setTimeout(() => {
        setOemToast(prev => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [oemToast.show]);

  // Global ESC key event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowNewOemModal(false);
        setShowNewOemCustomerModal(false);
        setSelectedOemCustomer(null);
        setShowNewQuoteModal(false);
        setShowNewProductModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // CMS fields state with Live split-screen visual preview
  const [cmsHome, setCmsHome] = useState({
    heroTitle: 'Premium Wet Wipes for modern global brands',
    heroDesc: 'Custom OEM wet wipes manufacturing for hygiene, beauty, baby care, fitness, and healthcare brands worldwide.',
    heroCtaPrimary: 'Explore Products',
    heroCtaSecondary: 'Get a Quote',
    aboutText: 'Bapuji Surgicals designs, formulates and packages premium wet wipes for hospitals, clinics, pharmacies and wellness brands. Our cleanroom processes, custom OEM services and logistics network ensure every wet wipe pack arrives sterile, branded and ready for distribution.',
    footerCopyright: '© 2026 Bapuji Surgicals. All rights reserved.',
  });
  
  useEffect(() => {
    setCmsHome(getCmsHome());
    return subscribeCmsHome(setCmsHome);
  }, []);

  const updateCmsHome = (patch) => {
    setCmsHome(prev => {
      const next = saveCmsHome({ ...prev, ...patch });
      return next;
    });
  };

  const updateCmsHeroImage = (index, value) => {
    const nextImages = [...(cmsHome.heroImages || DEFAULT_CMS_HOME.heroImages)];
    nextImages[index] = value;
    updateCmsHome({ heroImages: nextImages });
  };

  const uploadCmsImage = (field, file, index = null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (field === 'heroImages') {
        updateCmsHeroImage(index, reader.result);
      } else {
        updateCmsHome({ [field]: reader.result });
      }
      logSystemAction(`CMS image updated: ${field}`);
    };
    reader.readAsDataURL(file);
  };

  // Selected review feedback response input
  const [reviewReplies, setReviewReplies] = useState({});

  // Push audit logs helper
  const logSystemAction = (actionText) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      user: simulatedRole === 'Admin' ? 'vignesh@bapujisurg.com' : `${simulatedRole.toLowerCase()}@bapujisurg.com`,
      action: actionText,
      time: timestamp
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const getBackendOrderId = (order) => {
    if (order?.backendId) return order.backendId;
    return /^[a-f0-9]{24}$/i.test(order?.id || '') ? order.id : null;
  };

  const updateDashboardOrderEmailState = (displayId, payload) => {
    const patch = {
      emailDeliveryStatus: payload.emailDeliveryStatus || payload.emailStatus || 'sent',
      emailLogs: payload.emailLogs || []
    };
    setB2bOrders(prev => prev.map(ord => ord.id === displayId ? { ...ord, ...patch } : ord));
    setB2cOrders(prev => prev.map(ord => ord.id === displayId ? { ...ord, ...patch } : ord));
    setSelectedB2bOrder(prev => prev?.id === displayId ? { ...prev, ...patch } : prev);
    setSelectedB2cOrder(prev => prev?.id === displayId ? { ...prev, ...patch } : prev);
  };

  const downloadOrderInvoice = async (order) => {
    const backendId = getBackendOrderId(order);
    if (!backendId) {
      alert('This sample order is not linked to a live backend invoice yet.');
      return;
    }
    try {
      const response = await fetch(`${DASHBOARD_API_BASE}/api/orders/${backendId}/invoice`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Unable to download invoice');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${backendId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      logSystemAction(`Downloaded invoice PDF for order ${order.id}`);
    } catch (error) {
      alert(error.message);
    }
  };

  const resendOrderInvoice = async (order) => {
    const backendId = getBackendOrderId(order);
    if (!backendId) {
      alert('This sample order is not linked to a live backend invoice email yet.');
      return;
    }
    try {
      const response = await fetch(`${DASHBOARD_API_BASE}/api/orders/${backendId}/resend-invoice`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to resend invoice email');
      updateDashboardOrderEmailState(order.id, {
        emailDeliveryStatus: data.order?.emailDeliveryStatus || data.emailStatus,
        emailLogs: data.order?.emailLogs || order.emailLogs || []
      });
      setOemToast({
        show: true,
        title: data.emailStatus === 'mock' ? 'Invoice email generated' : 'Invoice email resent',
        desc: `${order.id} sent to ${order.email || 'registered customer email'}`,
        id: order.id
      });
      logSystemAction(`Resent invoice email for order ${order.id}`);
    } catch (error) {
      alert(error.message);
    }
  };

  // Notification center triggers list
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New OEM Customized Proposal', desc: 'Sarah Jenkins accepted quotation price of ₹42/unit on QT-206.', read: false, time: '3 mins ago' },
    { id: 2, title: 'Low Raw Material Warning', desc: 'Compounding chemical (CHG Sol.) is running low: only 250L available.', read: false, time: '20 mins ago' },
    { id: 3, title: 'B2B Account Validation Request', desc: 'Apollo Pharmacy uploaded fresh drug license PDF for review.', read: false, time: '1 hour ago' },
    { id: 4, title: 'Critical Low Stock Alert', desc: 'Flip Lidding caps for customized baby packaging runs out of inventory.', read: true, time: '4 hours ago' },
    { id: 5, title: 'Website Lead Submission', desc: 'Contact Form inquiry from Max Healthcare: Vikram Seth.', read: true, time: '1 day ago' },
  ]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Computed filtered B2B orders
  const filteredB2bOrders = useMemo(() => {
    return b2bOrders.filter(ord => {
      const query = b2bSearchQuery.toLowerCase();
      const matchesSearch = !b2bSearchQuery || 
        ord.id.toLowerCase().includes(query) ||
        ord.businessName.toLowerCase().includes(query) ||
        ord.products.toLowerCase().includes(query);
      
      const matchesStatus = b2bFilterStatus === 'All' || ord.status === b2bFilterStatus;
      const matchesPayment = b2bFilterPayment === 'All' || ord.paymentStatus === b2bFilterPayment;
      
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [b2bOrders, b2bSearchQuery, b2bFilterStatus, b2bFilterPayment]);

  const b2bStats = useMemo(() => {
    const total = b2bOrders.reduce((sum, o) => sum + o.amount, 0);
    const unpaid = b2bOrders.filter(o => o.paymentStatus !== 'Paid').reduce((sum, o) => sum + o.amount, 0);
    const pending = b2bOrders.filter(o => o.status !== 'Delivered').length;
    const clients = new Set(b2bOrders.map(o => o.businessName)).size;
    return { total, unpaid, pending, clients };
  }, [b2bOrders]);

  // Computed filtered B2C orders
  const filteredB2cOrders = useMemo(() => {
    return b2cOrders.filter(ord => {
      const query = b2cSearchQuery.toLowerCase();
      const matchesSearch = !b2cSearchQuery || 
        ord.id.toLowerCase().includes(query) ||
        ord.customerName.toLowerCase().includes(query) ||
        (ord.email && ord.email.toLowerCase().includes(query));
      
      const matchesStatus = b2cFilterStatus === 'All' || ord.status === b2cFilterStatus;
      const matchesPayment = b2cFilterPayment === 'All' || ord.paymentMethod === b2cFilterPayment;
      
      let matchesValue = true;
      if (b2cFilterValue === 'under1000') matchesValue = ord.value < 1000;
      else if (b2cFilterValue === 'over1000') matchesValue = ord.value >= 1000;

      return matchesSearch && matchesStatus && matchesPayment && matchesValue;
    });
  }, [b2cOrders, b2cSearchQuery, b2cFilterStatus, b2cFilterPayment, b2cFilterValue]);

  const b2cStats = useMemo(() => {
    const totalOrders = b2cOrders.length;
    const revenueThisMonth = b2cOrders.reduce((sum, o) => sum + (o.status !== 'Returned' ? o.value : 0), 0);
    const revenueToday = b2cOrders.filter(o => o.date === '2026-06-05').reduce((sum, o) => sum + o.value, 0);
    const pendingDeliveries = b2cOrders.filter(o => o.status === 'Pending' || o.status === 'Shipped').length;
    const returnsRequested = b2cOrders.filter(o => o.status === 'Returned' || o.refundStatus === 'Pending').length;
    const refundAmount = b2cOrders.filter(o => o.status === 'Returned' || o.refundStatus === 'Completed').reduce((sum, o) => sum + o.value, 0);

    return {
      totalOrders,
      revenueToday,
      revenueThisMonth,
      pendingDeliveries,
      returnsRequested,
      refundAmount
    };
  }, [b2cOrders]);

  // Global search filtering
  const filteredSearchResults = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    const results = [];
    
    // Search Products
    products.forEach(p => {
      if (p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)) {
        results.push({ type: 'Product', id: p.sku, title: p.name, desc: `SKU: ${p.sku} | Price: ₹${p.price}`, tab: 'Products' });
      }
    });

    // Search Customers
    customers.forEach(c => {
      if (c.name.toLowerCase().includes(query) || c.company.toLowerCase().includes(query)) {
        results.push({ type: 'Customer', id: c.id, title: c.name, desc: `${c.company} (${c.type})`, tab: 'Customers' });
      }
    });

    // Search OEM Orders
    oemOrders.forEach(o => {
      if (o.company.toLowerCase().includes(query) || o.id.toLowerCase().includes(query)) {
        results.push({ type: 'OEM Order', id: o.id, title: `OEM Order: ${o.company}`, desc: `Product: ${o.product} (${o.status})`, tab: 'OEM Orders' });
      }
    });

    // Search Quotes
    quotations.forEach(q => {
      if (q.customer.toLowerCase().includes(query) || q.id.toLowerCase().includes(query)) {
        results.push({ type: 'Quotation', id: q.id, title: `Quote: ${q.product}`, desc: `Client: ${q.customer} | MOQ: ${q.moq}`, tab: 'Quotations' });
      }
    });

    return results.slice(0, 8);
  }, [searchQuery, products, customers, oemOrders, quotations]);

  // Handle lead column clicks to simulate drag and drop Kanban moves
  const moveLeadStatus = (leadId, newStatus) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        logSystemAction(`Moved Lead ${leadId} (${lead.company}) status from ${lead.status} to ${newStatus}`);
        return { ...lead, status: newStatus };
      }
      return lead;
    }));
  };

  const createLead = (e) => {
    e.preventDefault();
    const nextId = `LEAD-${String(100 + leads.length + 1).padStart(3, '0')}`;
    const leadToAdd = {
      id: nextId,
      name: newLead.name || 'New Contact',
      email: newLead.email || 'not-provided@bapujisurgicals.com',
      phone: newLead.phone || 'Not provided',
      website: newLead.website || '',
      company: newLead.company || 'New Lead',
      source: newLead.source,
      status: newLead.status,
      amount: Number(newLead.amount) || 0,
      date: new Date().toISOString().slice(0, 10)
    };

    setLeads(prev => [leadToAdd, ...prev]);
    logSystemAction(`Created Lead ${nextId} (${leadToAdd.company}) in ${leadToAdd.status}`);
    setNewLead({
      company: '',
      name: '',
      email: '',
      phone: '',
      website: '',
      source: 'Contact Form',
      status: 'New',
      amount: 0
    });
    setShowNewLeadModal(false);
  };

  const deleteLead = () => {
    if (!leadToDelete) return;
    setLeads(prev => prev.filter(lead => lead.id !== leadToDelete.id));
    logSystemAction(`Deleted Lead ${leadToDelete.id} (${leadToDelete.company})`);
    setLeadToDelete(null);
    setOpenLeadStatusMenu(null);
  };

  // Add quotation callback
  const createQuotation = (e) => {
    e.preventDefault();
    const quoteNo = `QT-${Math.floor(210 + Math.random() * 80)}`;
    const newQuoteObj = {
      id: quoteNo,
      customer: newQuote.customer,
      product: newQuote.product,
      moq: Number(newQuote.moq),
      price: Number(newQuote.price),
      validUntil: `2026-08-${Math.floor(10 + Math.random() * 15)}`,
      status: 'Draft'
    };
    setQuotations(prev => [newQuoteObj, ...prev]);
    logSystemAction(`Drafted quotation ${quoteNo} for customer ${newQuote.customer}`);
    setShowNewQuoteModal(false);
    setNewQuote({ customer: '', product: '', moq: 10000, price: 0, validity: '30' });
  };

  // Update quote status
  const updateQuoteStatus = (quoteId, status) => {
    setQuotations(prev => prev.map(q => {
      if (q.id === quoteId) {
        logSystemAction(`Quotation ${quoteId} status set to ${status}`);
        return { ...q, status };
      }
      return q;
    }));
  };

  // B2B verify approved/rejected status
  const verifyB2BAccount = (userId, status) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === userId) {
        logSystemAction(`B2B Wholesaler verification for ${c.name} (${c.company}) set to ${status}`);
        return { ...c, status: status === 'approved' ? 'Active' : 'Suspended' };
      }
      return c;
    }));
    alert(`B2B Wholesale account has been successfully ${status}!`);
  };

  // OEM order status updater (10 stages with dynamic keyframe notifications)
  const updateOemStage = (orderId, currentStage) => {
    const oemStages = OEM_WORKFLOW_STAGES.map(s => s.stage);
    const idx = oemStages.indexOf(currentStage);
    if (idx !== -1 && idx < oemStages.length - 1) {
      const nextStage = oemStages[idx + 1];
      setOemOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          logSystemAction(`[${timeStr}] OEM Order Updated | Order ID: ${orderId} | Advanced to: ${nextStage} | By: ${simulatedRole}`);
          
          // Trigger toast for success stage advancement
          setOemToast({
            show: true,
            title: 'Order Status Advanced',
            desc: `${o.company} order advanced to ${nextStage}`,
            id: orderId
          });
          
          return { ...o, status: nextStage };
        }
        return o;
      }));
    }
  };

  const handleCreateOemOrder = (e) => {
    e.preventDefault();
    const newId = `OEM-${9000 + oemOrders.length + 1}`;
    const amount = Number(newOemOrder.quantity) * Number(newOemOrder.unitPrice);
    const orderDate = new Date().toISOString().split('T')[0];
    const deliveryDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const newOrderObj = {
      id: newId,
      companyName: newOemOrder.company,
      company: newOemOrder.company,
      contact: newOemOrder.contact,
      product: newOemOrder.product,
      wipeType: newOemOrder.wipeType,
      fragrance: newOemOrder.fragrance,
      packaging: newOemOrder.packaging,
      quantity: Number(newOemOrder.quantity),
      unitPrice: Number(newOemOrder.unitPrice),
      amount: amount,
      orderDate: orderDate,
      deliveryDate: deliveryDate,
      status: 'Inquiry',
      comments: newOemOrder.comments || 'Order inquiry received. Compounding specification pending approval.',
      health: 'green',
      healthStatus: 'ON TRACK',
      assignedTeam: { sales: 'Vignesh Sullia', production: 'Anant Kumar', qc: 'Leigh Jenkins' },
      documents: []
    };

    setOemOrders(prev => [newOrderObj, ...prev]);
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    logSystemAction(`[${timeStr}] OEM Order Created | Order ID: ${newId} | Client: ${newOemOrder.company} | Created By: ${simulatedRole}`);
    
    setShowNewOemModal(false);
    setNewOemOrder({
      company: '',
      contact: '',
      product: '',
      wipeType: 'Rayon 60 GSM',
      fragrance: 'Organic Aloe Vera',
      packaging: 'Flip Lid 80-Pack Pack',
      quantity: 50000,
      unitPrice: 40,
      comments: ''
    });
    
    setOemToast({
      show: true,
      title: 'OEM Order Created Successfully',
      desc: `ID: ${newId} - ${newOemOrder.company}`,
      id: newId
    });
  };

  const handleCreateOemCustomer = (e) => {
    e.preventDefault();
    const newId = `CUST-${100 + customers.length + 1}`;
    const newCustomerObj = {
      id: newId,
      name: newOemCustomer.name,
      company: newOemCustomer.company,
      email: newOemCustomer.email,
      phone: newOemCustomer.phone,
      country: newOemCustomer.country,
      type: 'OEM',
      regDate: new Date().toISOString().split('T')[0],
      orders: 0,
      spend: 0,
      status: 'Active',
      notes: newOemCustomer.notes || 'New OEM Customer registered.',
      website: newOemCustomer.website || '',
      industry: newOemCustomer.industry || '',
      moq: Number(newOemCustomer.moq || 10000),
      interest: newOemCustomer.interest || '',
      source: newOemCustomer.source || 'Website',
      attachments: []
    };
    
    setCustomers(prev => [newCustomerObj, ...prev]);
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    logSystemAction(`[${timeStr}] OEM Customer Created | Customer: ${newOemCustomer.company} | ID: ${newId} | Created By: ${simulatedRole}`);

    setOemToast({
      show: true,
      title: 'OEM Customer Created Successfully',
      desc: newOemCustomer.company,
      id: newId
    });

    setShowNewOemCustomerModal(false);
    setNewOemCustomer({
      name: '',
      company: '',
      email: '',
      phone: '',
      country: '',
      notes: '',
      website: '',
      industry: '',
      moq: 10000,
      interest: 'Baby Wipes',
      source: 'Website'
    });
  };

  const handleUploadOemDoc = (orderId, docType) => {
    const docExists = oemOrders.find(o => o.id === orderId)?.documents.some(d => d.type === docType);
    setOemOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const newVer = docExists ? o.documents.filter(d => d.type === docType).length + 1 : 1;
        const newDoc = {
          name: `${docType.replace(/\s+/g, '')}_v${newVer}.pdf`,
          type: docType,
          size: '1.2 MB',
          date: new Date().toISOString().split('T')[0]
        };
        const updatedDocs = [...o.documents.filter(d => d.type !== docType), newDoc];
        
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        logSystemAction(`[${timeStr}] OEM Document Uploaded | Order ID: ${orderId} | File: ${newDoc.name} | By: ${simulatedRole}`);
        
        return { ...o, documents: updatedDocs };
      }
      return o;
    }));
    
    setOemToast({
      show: true,
      title: 'Document Uploaded Successfully',
      desc: `${docType} added to ${orderId}`,
      id: orderId
    });
  };

  const handleDeleteOemDoc = (orderId, docType) => {
    setOemOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedDocs = o.documents.filter(d => d.type !== docType);
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        logSystemAction(`[${timeStr}] OEM Document Deleted | Order ID: ${orderId} | Type: ${docType} | By: ${simulatedRole}`);
        return { ...o, documents: updatedDocs };
      }
      return o;
    }));
  };

  const getOrderStageDetails = (ord, stageName) => {
    const stages = OEM_WORKFLOW_STAGES.map(s => s.stage);
    const stageIdx = stages.indexOf(stageName);
    const currentIdx = stages.indexOf(ord.status);
    
    let manager = 'Vignesh Sullia';
    if (stageName === 'Production') manager = 'Anant Kumar';
    else if (stageName === 'QC') manager = 'Leigh Jenkins';
    else if (stageName === 'Packing' || stageName === 'Dispatch' || stageName === 'Delivered') manager = 'Rajesh Patel';
    
    if (stageIdx < currentIdx) {
      const orderDateObj = new Date(ord.orderDate);
      const stageDate = new Date(orderDateObj.getTime() + stageIdx * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return {
        date: stageDate,
        manager,
        status: 'Completed',
        notes: `Milestone completed on schedule.`
      };
    } else if (stageIdx === currentIdx) {
      return {
        date: new Date().toISOString().split('T')[0],
        manager,
        status: ord.status === 'Delivered' ? 'Completed' : 'Running',
        notes: ord.comments || 'Active stage operations currently running.'
      };
    } else {
      return {
        date: 'Pending',
        manager,
        status: 'Awaiting Previous Stage',
        notes: 'This stage has not started yet.'
      };
    }
  };

  const getWorkflowIcon = (iconName, size = 14) => {
    const iconMap = {
      MessageSquare,
      FileText,
      Award,
      Image,
      Layers,
      Factory,
      Shield,
      Package,
      Clock,
      CheckCircle2
    };
    const IconComponent = iconMap[iconName] || HelpCircle;
    return <IconComponent size={size} />;
  };

  // Add Product callback
  const createProduct = (e) => {
    e.preventDefault();
    const newSku = `BAP-NEW-${Math.floor(100 + Math.random() * 800)}`;
    const newProdObj = {
      id: `PROD-00${products.length + 1}`,
      name: newProduct.name,
      sku: newSku,
      category: newProduct.category,
      price: Number(newProduct.price),
      moq: Number(newProduct.moq),
      stock: Number(newProduct.stock),
      description: newProduct.description,
      images: ['/img/mother_baby_wipes.png']
    };
    setProducts(prev => [...prev, newProdObj]);
    logSystemAction(`Created new catalog product: ${newProduct.name} (${newSku})`);
    setShowNewProductModal(false);
    setNewProduct({ name: '', sku: '', category: 'Clinical PPE', price: 0, moq: 500, stock: 1000, description: '' });
  };

  // Edit Product callbacks
  const handleOpenProductEditor = (prod) => {
    setSelectedProduct(prod);
    setEditProductForm({ ...prod });
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!editProductForm) return;

    setProducts(prev => prev.map(p => p.id === editProductForm.id ? editProductForm : p));

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    logSystemAction(`[${timeStr}] Product SKU Updated | SKU: ${editProductForm.sku} | Name: ${editProductForm.name} | Updated By: ${simulatedRole}`);

    setOemToast({
      show: true,
      title: 'Product Catalog Updated',
      desc: `${editProductForm.name} changes saved successfully.`,
      id: editProductForm.sku
    });

    setSelectedProduct(null);
    setEditProductForm(null);
  };

  const handleDeleteProduct = (prodId) => {
    if (!window.confirm("Are you sure you want to delete this product from the catalog?")) {
      return;
    }

    setProducts(prev => prev.filter(p => p.id !== prodId));

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    logSystemAction(`[${timeStr}] Product SKU Deleted | ID: ${prodId} | Deleted By: ${simulatedRole}`);

    setOemToast({
      show: true,
      title: 'Product Deleted from Catalog',
      desc: 'The product SKU was permanently removed.',
      id: prodId
    });

    setSelectedProduct(null);
    setEditProductForm(null);
  };

  // B2C tracking update
  const shipB2cOrder = (orderId, trackingCode) => {
    if (!trackingCode) {
      alert('Please fill the courier tracking code.');
      return;
    }
    setB2cOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        logSystemAction(`Dispatched B2C Retail Order ${orderId} via tracking ${trackingCode}`);
        return { ...ord, status: 'Shipped', tracking: trackingCode };
      }
      return ord;
    }));
    setB2cActivityFeed(prev => [
      { id: Date.now(), text: `Order #${orderId} Shipped via DTDC`, time: 'Just now', type: 'ship' },
      ...prev
    ]);
    setOemToast({
      show: true,
      title: 'Order Dispatched',
      desc: `B2C Order ${orderId} marked as Shipped.`,
      id: `SHIP-${orderId}`
    });
  };

  // B2C refund handle
  const refundB2cOrder = (orderId) => {
    setB2cOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        logSystemAction(`Processed refund value for B2C Retail Order ${orderId}`);
        return { ...ord, status: 'Returned', refundStatus: 'Completed' };
      }
      return ord;
    }));
    setB2cActivityFeed(prev => [
      { id: Date.now(), text: `Refund for Order #${orderId} Processed`, time: 'Just now', type: 'refund' },
      ...prev
    ]);
    setOemToast({
      show: true,
      title: 'Refund Processed',
      desc: `B2C Order ${orderId} refund settled successfully.`,
      id: `REFUND-${orderId}`
    });
  };

  // Add CRM comment note
  const submitCrmNote = (e) => {
    e.preventDefault();
    if (!crmNote.trim()) return;
    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomer.id) {
        const fullNotes = c.notes ? `${c.notes}\n[Log Update]: ${crmNote}` : `[Log Update]: ${crmNote}`;
        logSystemAction(`Added note entry in HubSpot CRM logs for ${c.company}`);
        return { ...c, notes: fullNotes };
      }
      return c;
    }));
    setSelectedCustomer(prev => ({
      ...prev,
      notes: prev.notes ? `${prev.notes}\n[Log Update]: ${crmNote}` : `[Log Update]: ${crmNote}`
    }));
    setCrmNote('');
  };

  // Add CRM file upload simulation
  const handleCrmFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomer.id) {
        logSystemAction(`Uploaded asset: ${file.name} to client vault for ${c.company}`);
        return { ...c, attachments: [...c.attachments, file.name] };
      }
      return c;
    }));
    setSelectedCustomer(prev => ({
      ...prev,
      attachments: [...prev.attachments, file.name]
    }));
  };

  // GBP Review Feedback Reply submission
  const submitReviewReply = (revId) => {
    const replyText = reviewReplies[revId];
    if (!replyText) return;
    setReviews(prev => prev.map(rev => {
      if (rev.id === revId) {
        logSystemAction(`Submitted public reply response to Google Review ${revId} by ${rev.name}`);
        return { ...rev, reply: replyText };
      }
      return rev;
    }));
    setReviewReplies(prev => ({ ...prev, [revId]: '' }));
    alert('Google Business Profile public reply posted successfully!');
  };

  // Excel/CSV Simulated Export Engine
  const triggerSpreadsheetExport = (type, dataSet) => {
    let headers = [];
    if (dataSet === 'customers') {
      headers = ['Customer ID', 'Name', 'Company', 'Email', 'Type', 'Spend', 'Status'];
    } else if (dataSet === 'oem') {
      headers = ['Order Number', 'Company', 'Substrate', 'Qty', 'Unit Price', 'Total Amount', 'Status'];
    } else if (dataSet === 'finance') {
      headers = ['P&L Metric', 'Q1 Actual', 'Q2 Forecast', 'Growth rate'];
    }

    const rawRows = dataSet === 'customers' ? customers.map(c => `"${c.id}","${c.name}","${c.company}","${c.email}","${c.type}","${c.spend}","${c.status}"`).join("\n") : 
      dataSet === 'oem' ? oemOrders.map(o => `"${o.id}","${o.company}","${o.wipeType}","${o.quantity}","${o.unitPrice}","${o.amount}","${o.status}"`).join("\n") :
      `"Revenue","₹8,500,000","₹11,000,000","+29.4%"\n"Net Profit","₹4,100,000","₹5,500,000","+34.1%"\n"Expenses","₹4,400,000","₹5,500,000","+25.0%"`;

    const csvContentText = headers.join(",") + "\n" + rawRows;

    // Use Blob with UTF-8 BOM (\uFEFF) to make it Excel-compatible and prevent warning dialogs
    const blob = new Blob(["\uFEFF" + csvContentText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bapuji_export_${dataSet}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    logSystemAction(`Triggered spreadsheet export: bapuji_export_${dataSet} (${type.toUpperCase()})`);
  };

  const handleExportCSV = () => {
    const currentKPIs = getKPIValuesForRange(timeRange);
    let csv = `Bapuji Surgicals - Executive Analytics Report (${timeRange})\n`;
    csv += `Generated on,${new Date().toLocaleString()}\n\n`;
    
    csv += `Key Performance Indicators (KPIs)\n`;
    csv += `Metric,Value,Growth\n`;
    csv += `Revenue,₹${formatNumber(currentKPIs.revenue)},${currentKPIs.rG}\n`;
    csv += `Orders,${formatNumber(currentKPIs.orders)},${currentKPIs.oG}\n`;
    csv += `Profit,₹${formatNumber(currentKPIs.profit)},${currentKPIs.pG}\n`;
    csv += `Visitors,${formatNumber(currentKPIs.visitors)},${currentKPIs.vG}\n`;
    csv += `Conversion Rate,${currentKPIs.conversion}%,${currentKPIs.cG}\n\n`;
    
    csv += `Traffic Sources (GA4)\n`;
    csv += `Channel,Share\n`;
    GOOGLE_ANALYTICS_TRAFFIC.forEach(t => {
      csv += `"${t.name}",${t.value}%\n`;
    });
    csv += `\n`;
    
    csv += `Ad Campaign Performance\n`;
    csv += `Campaign,Spend,Leads,Conversions,ROAS,CTR,CPC\n`;
    MARKETING_ROAS.forEach(c => {
      csv += `"${c.platform}",₹${formatNumber(c.spend)},${c.leads},${c.conversions},${c.roas}x,2.4%,₹35\n`;
    });
    csv += `\n`;

    csv += `Geographical State Sales\n`;
    csv += `State,Hub,Sales\n`;
    GEOGRAPHIC_SALES.forEach(s => {
      csv += `"${s.name}","${s.cords}",₹${formatNumber(s.sales)}\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bapuji_analytics_report_${timeRange.toLowerCase().replace(' ', '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    logSystemAction(`Exported Analytics Report to CSV: ${timeRange}`);
  };

  const handleExportExcel = () => {
    const currentKPIs = getKPIValuesForRange(timeRange);
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          th { background-color: #0976BC; color: white; font-weight: bold; border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
          td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
          .title { font-size: 18px; font-weight: bold; color: #0976BC; margin-bottom: 10px; }
          .section-header { font-size: 14px; font-weight: bold; color: #334155; margin-top: 20px; margin-bottom: 8px; }
          .number { text-align: right; }
        </style>
      </head>
      <body>
        <div class="title">Bapuji Surgicals - Executive Analytics Report (${timeRange})</div>
        <div>Generated on: ${new Date().toLocaleString()}</div>
        
        <div class="section-header">Key Performance Indicators (KPIs)</div>
        <table>
          <thead>
            <tr>
              <th>KPI Metric</th>
              <th>Value</th>
              <th>Growth vs Prev Period</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Revenue</td>
              <td class="number">₹${formatNumber(currentKPIs.revenue)}</td>
              <td>${currentKPIs.rG}</td>
            </tr>
            <tr>
              <td>Orders</td>
              <td class="number">${formatNumber(currentKPIs.orders)}</td>
              <td>${currentKPIs.oG}</td>
            </tr>
            <tr>
              <td>Profit</td>
              <td class="number">₹${formatNumber(currentKPIs.profit)}</td>
              <td>${currentKPIs.pG}</td>
            </tr>
            <tr>
              <td>Visitors</td>
              <td class="number">${formatNumber(currentKPIs.visitors)}</td>
              <td>${currentKPIs.vG}</td>
            </tr>
            <tr>
              <td>Conversion Rate</td>
              <td class="number">${currentKPIs.conversion}%</td>
              <td>${currentKPIs.cG}</td>
            </tr>
          </tbody>
        </table>

        <div class="section-header">Traffic Sources (GA4)</div>
        <table>
          <thead>
            <tr>
              <th>Channel</th>
              <th>Share (%)</th>
            </tr>
          </thead>
          <tbody>
            ${GOOGLE_ANALYTICS_TRAFFIC.map(t => `
              <tr>
                <td>${t.name}</td>
                <td class="number">${t.value}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-header">Device Breakdown</div>
        <table>
          <thead>
            <tr>
              <th>Client Device Type</th>
              <th class="number">Audience Share (%)</th>
            </tr>
          </thead>
          <tbody>
            ${DEVICE_BREAKDOWN.map(d => `
              <tr>
                <td><strong>${d.name}</strong></td>
                <td class="number">${d.value}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-header">Ad Campaign Performance</div>
        <table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Spend (INR)</th>
              <th>Leads</th>
              <th>Conversions</th>
              <th>ROAS</th>
              <th>CTR</th>
              <th>CPC (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${MARKETING_ROAS.map(c => `
              <tr>
                <td>${c.platform}</td>
                <td class="number">₹${formatNumber(c.spend)}</td>
                <td class="number">${c.leads}</td>
                <td class="number">${c.conversions}</td>
                <td class="number">${c.roas}x</td>
                <td class="number">2.4%</td>
                <td class="number">₹35</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bapuji_analytics_report_${timeRange.toLowerCase().replace(' ', '_')}_${Date.now()}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    logSystemAction(`Exported Analytics Report to Excel: ${timeRange}`);
  };

  const handleGeneratePurchaseOrderPDF = (materials = rawMaterials.filter(mat => mat.status === 'Low Stock' || mat.status === 'Out of Stock')) => {
    const poItems = materials.length > 0 ? materials : rawMaterials;
    const poNumber = `PO-BS-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate the purchase order PDF.');
      return;
    }

    const parseQty = (value) => Number(String(value).replace(/[^0-9.]/g, '')) || 0;
    const unitOf = (value) => String(value).replace(/[0-9.,\s]/g, '').trim() || 'units';
    const suggestedQty = (mat) => {
      const available = parseQty(mat.available);
      const total = parseQty(mat.stock);
      if (mat.status === 'Out of Stock') return Math.max(total, 1000);
      return Math.max(Math.ceil((total * 0.65) - available), 250);
    };

    const rows = poItems.map((mat, index) => {
      const qty = suggestedQty(mat);
      const unit = unitOf(mat.stock);
      const estRate = mat.category === 'Chemicals' ? 480 : mat.category === 'Fabric' ? 135 : mat.category === 'Packaging' ? 4.5 : 220;
      const amount = qty * estRate;
      const specs = mat.category === 'Chemicals'
        ? 'COA, MSDS, batch traceability, sealed HDPE drums'
        : mat.category === 'Fabric'
          ? 'Medical grade roll, GSM tolerance +/- 5%, dust-free wrap'
          : mat.category === 'Packaging'
            ? 'Medical grade plastic, logo-ready finish'
            : 'OEM approved grade, sealed supplier packaging';
      return { ...mat, index: index + 1, qty, unit, estRate, amount, specs };
    });
    const subtotal = rows.reduce((sum, row) => sum + row.amount, 0);
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst;

    const html = `
      <html>
      <head>
        <title>${poNumber} | Bapuji Surgicals Purchase Order</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');
          * { box-sizing: border-box; }
          body { margin: 0; padding: 34px; font-family: 'Outfit', Arial, sans-serif; color: #111827; background: #f8fafc; }
          .sheet { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 70px rgba(15,23,42,0.12); }
          .hero { padding: 30px 34px; background: linear-gradient(135deg, #ffffff 0%, #f8fbff 48%, #eef8ff 100%); color: #0f172a; display: flex; justify-content: space-between; gap: 28px; border-bottom: 4px solid #0976BC; }
          .brand { display: flex; gap: 14px; align-items: center; }
          .logo { width: 172px; height: auto; object-fit: contain; }
          .brand h1 { margin: 0; font-size: 24px; letter-spacing: -0.04em; }
          .brand p, .meta p { margin: 4px 0 0; color: #64748b; font-size: 12px; }
          .meta { text-align: right; }
          .meta h2 { margin: 0; font-size: 22px; letter-spacing: -0.03em; color: #0976BC; }
          .content { padding: 30px 34px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 24px; }
          .card { border: 1px solid #e5e7eb; border-radius: 16px; padding: 14px; background: #f8fafc; }
          .label { font-size: 10px; color: #64748b; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
          .value { font-size: 14px; font-weight: 800; color: #111827; line-height: 1.35; }
          .po-title { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-bottom: 22px; }
          .po-title h2 { margin: 0; font-size: 28px; letter-spacing: -0.04em; color: #0f172a; }
          .po-title p { margin: 6px 0 0; color: #64748b; font-size: 12px; }
          .chip { display: inline-block; padding: 7px 11px; border-radius: 999px; background: #dcfce7; color: #15803d; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; }
          table { width: 100%; border-collapse: collapse; overflow: hidden; border-radius: 16px; }
          th { text-align: left; padding: 13px 12px; font-size: 10px; color: #64748b; background: #f1f5f9; text-transform: uppercase; letter-spacing: 0.08em; }
          td { padding: 14px 12px; font-size: 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
          td strong { font-size: 13px; }
          .muted { color: #64748b; font-size: 10px; line-height: 1.35; }
          .status { display: inline-block; padding: 5px 9px; border-radius: 999px; font-size: 10px; font-weight: 900; }
          .low { background: #fef3c7; color: #b45309; }
          .out { background: #fee2e2; color: #dc2626; }
          .totals { width: 310px; margin-left: auto; margin-top: 22px; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; }
          .total-row { display: flex; justify-content: space-between; padding: 11px 14px; font-size: 12px; border-bottom: 1px solid #e5e7eb; }
          .total-row:last-child { border-bottom: 0; background: #061827; color: #ffffff; font-size: 15px; font-weight: 900; }
          .terms { margin-top: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
          .notes { margin-top: 18px; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; background: #f8fafc; }
          .notes ul { margin: 10px 0 0 18px; padding: 0; color: #334155; font-size: 12px; line-height: 1.6; }
          .signature { margin-top: 28px; display: flex; justify-content: space-between; gap: 40px; }
          .line { flex: 1; padding-top: 34px; border-top: 1px solid #cbd5e1; font-size: 11px; color: #64748b; font-weight: 800; }
          .footer { padding: 18px 34px; background: #f8fafc; color: #64748b; font-size: 10px; display: flex; justify-content: space-between; }
          @media print { body { background: #ffffff; padding: 0; } .sheet { box-shadow: none; border-radius: 0; } }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="hero">
            <div class="brand">
              <img loading="lazy" class="logo" src="${window.location.origin}/img/bapuji logo.png" alt="Bapuji Surgicals" />
            </div>
            <div class="meta">
              <h2>${poNumber}</h2>
              <p>Created: ${new Date().toLocaleDateString('en-IN')}</p>
              <p>Status: Draft for supplier approval</p>
            </div>
          </div>
          <div class="content">
            <div class="po-title">
              <div>
                <h2>Purchase Order</h2>
                <p>Generated from Inventory module for critical production replenishment.</p>
              </div>
              <span class="chip">Procurement Draft</span>
            </div>
            <div class="grid">
              <div class="card"><div class="label">Vendor / Supplier</div><div class="value">Approved Raw Material Supplier<br/>Bengaluru Industrial Network</div><div class="muted">GSTIN: 29SUPPLIER0001Z5<br/>Email: procurement@supplier.example</div></div>
              <div class="card"><div class="label">Bill To</div><div class="value">Bapuji Surgicals<br/>Finance Department</div><div class="muted">Rajajinagar Industrial Area<br/>Bengaluru, Karnataka - 560010</div></div>
              <div class="card"><div class="label">Ship To</div><div class="value">Bapuji Surgicals Warehouse<br/>Receiving Bay 02</div><div class="muted">Attention: Inventory Manager<br/>Delivery slot: 9:00 AM - 5:00 PM</div></div>
              <div class="card"><div class="label">PO Date</div><div class="value">${new Date().toLocaleDateString('en-IN')}</div><div class="muted">Created by Admin Dashboard</div></div>
              <div class="card"><div class="label">Expected Delivery</div><div class="value">5-7 business days</div><div class="muted">Urgent production continuity request</div></div>
              <div class="card"><div class="label">Payment Terms</div><div class="value">50% advance / 50% before dispatch</div><div class="muted">Subject to final supplier invoice</div></div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Material</th>
                  <th>Category</th>
                  <th>Current Available</th>
                  <th>Order Qty</th>
                  <th>Specification</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map(row => `
                  <tr>
                    <td>${row.index}</td>
                    <td><strong>${row.name}</strong><br/><span style="color:#64748b">${row.id}</span></td>
                    <td>${row.category}</td>
                    <td>${row.available}</td>
                    <td><strong>${formatNumber(row.qty)} ${row.unit}</strong></td>
                    <td><span class="muted">${row.specs}</span></td>
                    <td>₹${formatNumber(row.estRate)}</td>
                    <td><strong>₹${formatNumber(Math.round(row.amount))}</strong></td>
                    <td><span class="status ${row.status === 'Out of Stock' ? 'out' : 'low'}">${row.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="totals">
              <div class="total-row"><span>Subtotal</span><strong>₹${formatNumber(Math.round(subtotal))}</strong></div>
              <div class="total-row"><span>GST 18%</span><strong>₹${formatNumber(Math.round(gst))}</strong></div>
              <div class="total-row"><span>Grand Total</span><strong>₹${formatNumber(Math.round(grandTotal))}</strong></div>
            </div>
            <div class="terms">
              <div class="card"><div class="label">Quality Documents</div><div class="value">COA / MSDS / Batch certificate required wherever applicable.</div></div>
              <div class="card"><div class="label">Inspection</div><div class="value">Material accepted after receiving QC and quantity verification.</div></div>
              <div class="card"><div class="label">Freight</div><div class="value">Supplier to coordinate dispatch details 24 hours before delivery.</div></div>
            </div>
            <div class="notes">
              <div class="label">Additional Procurement Instructions</div>
              <ul>
                <li>All material packaging must be sealed, labeled, and traceable to manufacturing batch or lot number.</li>
                <li>Short supply, substituted grade, or damaged packaging must be reported before dispatch.</li>
                <li>Invoice must reference PO number <strong>${poNumber}</strong> and include GST details.</li>
                <li>Receiving team may reject materials that do not match approved wet wipes production specifications.</li>
              </ul>
            </div>
            <div class="signature">
              <div class="line">Prepared by Inventory Manager</div>
              <div class="line">Approved by Admin / Procurement Head</div>
            </div>
          </div>
          <div class="footer">
            <span>Confidential procurement document generated from Bapuji Surgicals Admin Dashboard.</span>
            <span>${poNumber}</span>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    logSystemAction(`Generated raw material purchase order PDF: ${poNumber}`);
  };

  const handleGeneratePDF = () => {
    const currentKPIs = getKPIValuesForRange(timeRange);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate and download the PDF report.');
      return;
    }

    const html = `
      <html>
      <head>
        <title>Bapuji Surgicals Executive Analytics Report - ${timeRange}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
          body { 
            font-family: 'Outfit', sans-serif; 
            color: #1e293b; 
            background: #ffffff;
            padding: 40px; 
            margin: 0;
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            border-bottom: 3px solid #0976BC; 
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo-container {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-img {
            height: 50px;
            object-fit: contain;
          }
          .logo-text {
            font-size: 20px;
            font-weight: 800;
            color: #0976BC;
            line-height: 1;
          }
          .logo-subtext {
            font-size: 11px;
            font-weight: 400;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 3px;
          }
          .report-title { 
            font-size: 12px; 
            text-align: right; 
            color: #64748b; 
          }
          .report-title h1 { 
            margin: 0 0 6px 0; 
            font-size: 20px; 
            color: #0f172a; 
            font-weight: 800;
          }
          .section-title { 
            font-size: 14px; 
            font-weight: 800; 
            color: #0f172a; 
            margin-top: 35px; 
            margin-bottom: 15px;
            border-bottom: 1.5px solid #cbd5e1;
            padding-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .kpi-grid { 
            display: grid; 
            grid-template-columns: repeat(5, 1fr); 
            gap: 16px; 
            margin-bottom: 30px;
          }
          .kpi-card { 
            background: #f8fafc; 
            border: 1px solid #cbd5e1; 
            border-radius: 12px; 
            padding: 16px; 
            text-align: left;
          }
          .kpi-card span.label { 
            font-size: 10px; 
            color: #64748b; 
            font-weight: 700; 
            display: block; 
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .kpi-card h3 { 
            font-size: 18px; 
            font-weight: 800; 
            margin: 0; 
            color: #0976BC;
          }
          .kpi-card .growth-container {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-top: 6px;
          }
          .kpi-card .growth { 
            font-size: 11px; 
            color: #15803d; 
            font-weight: 700;
          }
          .kpi-card .vs-prev {
            font-size: 10px;
            color: #94a3b8;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 30px; 
          }
          th { 
            background-color: #f8fafc; 
            color: #475569; 
            font-weight: 700; 
            border-bottom: 2px solid #cbd5e1; 
            border-top: 1px solid #e2e8f0;
            border-left: 1px solid #e2e8f0;
            border-right: 1px solid #e2e8f0;
            padding: 10px 12px; 
            font-size: 11px;
            text-transform: uppercase;
            text-align: left;
          }
          td { 
            border: 1px solid #e2e8f0; 
            padding: 10px 12px; 
            font-size: 12px;
            color: #334155;
          }
          .footer { 
            margin-top: 50px; 
            text-align: center; 
            font-size: 11px; 
            color: #94a3b8; 
            border-top: 1px solid #e2e8f0; 
            padding-top: 20px;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-container">
            <img loading="lazy" class="logo-img" src="${window.location.origin}/img/bapuji logo.png" alt="Bapuji Surgicals Logo" />
          </div>
          <div class="report-title">
            <h1>Executive Analytics Report</h1>
            <div>Reporting Period: <strong>${timeRange}</strong></div>
          </div>
        </div>

        <div class="section-title">Key Performance Metrics Overview</div>
        <div class="kpi-grid">
          <div class="kpi-card">
            <span class="label">REVENUE</span>
            <h3>₹${formatNumber(currentKPIs.revenue)}</h3>
            <div class="growth-container">
              <span class="growth">${currentKPIs.rG}</span>
              <span class="vs-prev">vs prev</span>
            </div>
          </div>
          <div class="kpi-card">
            <span class="label">ORDERS</span>
            <h3>${formatNumber(currentKPIs.orders)}</h3>
            <div class="growth-container">
              <span class="growth">${currentKPIs.oG}</span>
              <span class="vs-prev">vs prev</span>
            </div>
          </div>
          <div class="kpi-card">
            <span class="label">PROFIT</span>
            <h3>₹${formatNumber(currentKPIs.profit)}</h3>
            <div class="growth-container">
              <span class="growth">${currentKPIs.pG}</span>
              <span class="vs-prev">vs prev</span>
            </div>
          </div>
          <div class="kpi-card">
            <span class="label">VISITORS</span>
            <h3>${formatNumber(currentKPIs.visitors)}</h3>
            <div class="growth-container">
              <span class="growth">${currentKPIs.vG}</span>
              <span class="vs-prev">vs prev</span>
            </div>
          </div>
          <div class="kpi-card">
            <span class="label">CONVERSION RATE</span>
            <h3>${currentKPIs.conversion}%</h3>
            <div class="growth-container">
              <span class="growth" style="color: ${currentKPIs.cGl ? '#15803d' : '#b91c1c'}">${currentKPIs.cG}</span>
              <span class="vs-prev">vs prev</span>
            </div>
          </div>
        </div>

        <div class="section-title">Google Analytics Traffic Shares</div>
        <table>
          <thead>
            <tr>
              <th>Channel Name</th>
              <th style="text-align: right;">Audience share</th>
            </tr>
          </thead>
          <tbody>
            ${GOOGLE_ANALYTICS_TRAFFIC.map(t => `
              <tr>
                <td><strong>${t.name} Traffic</strong></td>
                <td style="text-align: right;">${t.value}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">Device Breakdown Distribution</div>
        <table>
          <thead>
            <tr>
              <th>Device Client Type</th>
              <th style="text-align: right;">Audience Share (%)</th>
              <th style="text-align: right;">Growth Trend</th>
            </tr>
          </thead>
          <tbody>
            ${DEVICE_BREAKDOWN.map(d => `
              <tr>
                <td><strong>${d.name} Sessions</strong></td>
                <td style="text-align: right;">${d.value}%</td>
                <td style="text-align: right; font-weight: bold; color: ${d.name === 'Tablet' ? '#dc2626' : '#15803d'};">
                  ${d.name === 'Tablet' ? '↓ 1.5%' : d.name === 'Mobile' ? '↑ 8.2%' : '↑ 4.2%'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">Ad Campaign Conversion Returns</div>
        <table>
          <thead>
            <tr>
              <th>Platform Campaign</th>
              <th style="text-align: right;">Spend</th>
              <th style="text-align: right;">Leads</th>
              <th style="text-align: right;">Conversions</th>
              <th style="text-align: right;">CTR</th>
              <th style="text-align: right;">CPC</th>
              <th style="text-align: right;">Return-on-Ad-Spend</th>
            </tr>
          </thead>
          <tbody>
            ${MARKETING_ROAS.map(c => `
              <tr>
                <td><strong>${c.platform}</strong></td>
                <td style="text-align: right;">₹${formatNumber(c.spend)}</td>
                <td style="text-align: right;">${c.leads}</td>
                <td style="text-align: right;">${c.conversions}</td>
                <td style="text-align: right;">2.4%</td>
                <td style="text-align: right;">₹35</td>
                <td style="text-align: right; font-weight: bold; color: #0976BC;">${c.roas}x</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">Geographical State Sales</div>
        <table>
          <thead>
            <tr>
              <th>State Territory</th>
              <th>Major Distribution Hub</th>
              <th style="text-align: right;">Dispatch Volume (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${GEOGRAPHIC_SALES.map(s => `
              <tr>
                <td><strong>${s.name}</strong></td>
                <td>${s.cords}</td>
                <td style="text-align: right; font-weight: bold;">₹${formatNumber(s.sales)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          This document is generated dynamically from the Bapuji Surgicals SaaS Analytics Command Center.<br>
          © ${new Date().getFullYear()} Bapuji Surgicals. Confidential Document.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            }, 300);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    logSystemAction(`Generated PDF executive report: ${timeRange}`);
  };

  // Financial AR/AP Outstanding ledger counts
  const arTotal = 560000 + 240000; // Apollo B2B (Unpaid) + Surat B2B (Unpaid)
  const apTotal = 180000 + 350000; // Mock vendors raw supply

  const updateArInvoiceStatus = (invoiceId, status) => {
    setFinanceArLedger(prev => prev.map(invoice => (
      invoice.id === invoiceId ? { ...invoice, status } : invoice
    )));
    logSystemAction(`Finance AR invoice ${invoiceId} marked ${status}`);
  };

  const updateApBillStatus = (billId, status) => {
    setFinanceApLedger(prev => prev.map(bill => (
      bill.id === billId ? { ...bill, status } : bill
    )));
    logSystemAction(`Finance AP bill ${billId} marked ${status}`);
  };

  const updateFinanceRow = (setter, index, patch) => {
    setter(prev => prev.map((row, rowIndex) => (
      rowIndex === index ? { ...row, ...patch } : row
    )));
  };

  const updateFinanceById = (setter, idKey, id, patch) => {
    setter(prev => prev.map((row) => (
      row[idKey] === id ? { ...row, ...patch } : row
    )));
  };

  // Define sidebar menu configurations according to Roles
  const sidebarItems = [
    { label: 'Overview', role: ['Admin', 'Sales Manager', 'Production Manager', 'Support Team'], icon: Activity },
    { label: 'Analytics', role: ['Admin', 'Sales Manager'], icon: TrendingUp },
    { label: 'OEM Orders', role: ['Admin', 'Production Manager', 'Sales Manager'], icon: ClipboardList },
    { label: 'B2B Orders', role: ['Admin', 'Sales Manager'], icon: Package },
    { label: 'B2C Orders', role: ['Admin', 'Sales Manager'], icon: ShoppingCart },
    { label: 'Quotations', role: ['Admin', 'Sales Manager'], icon: FileText },
    { label: 'Customers', role: ['Admin', 'Sales Manager', 'Support Team'], icon: Users },
    { label: 'Products', role: ['Admin', 'Production Manager'], icon: Layers },
    { label: 'Inventory', role: ['Admin', 'Production Manager'], icon: Factory },
    { label: 'Leads', role: ['Admin', 'Sales Manager'], icon: Briefcase },
    { label: 'B2B Leads', role: ['Admin', 'Sales Manager'], icon: Briefcase },
    { label: 'Website CMS', role: ['Admin'], icon: Globe },
    { label: 'Marketing Hub', role: ['Admin', 'Support Team'], icon: Star },
    { label: 'Finance', role: ['Admin'], icon: DollarSign },
    { label: 'Settings', role: ['Admin'], icon: Settings },
  ];

  // Restrict access on role swap
  useEffect(() => {
    const currentConfig = sidebarItems.find(item => item.label === activeTab);
    if (currentConfig && !currentConfig.role.includes(simulatedRole)) {
      setActiveTab('Overview');
    }
  }, [simulatedRole]);

  return (
    <div className={darkMode ? 'dark-theme-wrapper' : ''} style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'var(--font-body)' }}>
      
      {/* Sidebar Styling overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          border-radius: 10px;
          color: #52525b;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
        }
        .sidebar-nav-link:hover {
          background-color: #f1f5f9;
          color: #09090b;
        }
        .sidebar-nav-link.active {
          background-color: #0976BC;
          color: #ffffff;
        }
        .erp-card {
          background: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
        }
        .erp-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }
        @media (max-width: 1200px) {
          .erp-kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .erp-kpi-grid {
            grid-template-columns: 1fr;
          }
        }
        .kanban-column {
          background-color: #f1f5f9;
          border-radius: 16px;
          padding: 16px;
          min-height: 500px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dropdown-fade-in {
          animation: dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes bellRing {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(12deg); }
          30% { transform: rotate(-12deg); }
          45% { transform: rotate(8deg); }
          60% { transform: rotate(-8deg); }
          75% { transform: rotate(4deg); }
          90% { transform: rotate(-4deg); }
        }
        .bell-ring-hover:hover .bell-icon {
          animation: bellRing 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          transform-origin: top center;
        }
        @keyframes badgePulse {
          0% {
            box-shadow: 0 0 0 0 rgba(9, 118, 188, 0.6);
            transform: scale(1);
          }
          50% {
            transform: scale(1.12);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(9, 118, 188, 0);
            transform: scale(1);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(9, 118, 188, 0);
            transform: scale(1);
          }
        }
        .badge-pulse {
          animation: badgePulse 2s infinite ease-in-out;
        }
        .bell-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background-color: #ffffff;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .bell-btn:hover {
          border-color: #94a3b8;
          background-color: #f8fafc;
          color: #0976BC;
          transform: translateY(-1px);
        }
        .bell-btn:active {
          transform: translateY(0);
        }

        /* Premium dashboard styles & animations */
        .analytics-grid-container {
          animation: cardEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.65) !important;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(241, 245, 249, 0.9) !important;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.01) !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -15px rgba(9, 118, 188, 0.08), 0 1px 4px 0 rgba(0, 0, 0, 0.01) !important;
          border-color: rgba(9, 118, 188, 0.15) !important;
        }
        @keyframes progressGrow {
          from { width: 0%; }
        }
        .progress-bar-fill-animate {
          animation: progressGrow 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .legend-pill-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 10px;
          border: 1px solid rgba(241, 245, 249, 0.6);
          background-color: rgba(253, 253, 253, 0.8);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .legend-pill-item:hover {
          transform: scale(1.03) translateX(2px);
          background-color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }
        .device-row-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px;
          border-radius: 8px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .device-row-item:hover {
          transform: translateX(4px);
        }
        .device-row-item:hover .device-icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }
        .device-icon-wrapper {
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .campaign-micro-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(241, 245, 249, 0.8);
          background-color: rgba(250, 250, 250, 0.5);
          backdrop-filter: blur(8px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .campaign-micro-card:hover {
          transform: translateY(-3px) scale(1.01);
          background-color: #ffffff;
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.01);
        }
        .roas-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 999px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .campaign-icon-wrapper {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .campaign-micro-card:hover .campaign-icon-wrapper {
          transform: scale(1.1);
        }
        @keyframes centralStatPop {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .central-stat-container {
          animation: centralStatPop 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Staggered load cards */
        .stagger-card-0 { animation: cardEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 0ms; }
        .stagger-card-1 { animation: cardEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 150ms; }
        .stagger-card-2 { animation: cardEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 300ms; }
        .stagger-card-3 { animation: cardEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 450ms; }
        .stagger-card-4 { animation: cardEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 600ms; }

        /* Vercel-style Spotlight card hover effect */
        .spotlight-card {
          position: relative !important;
          overflow: hidden !important;
        }
        .spotlight-card::before {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          background: radial-gradient(circle 130px at var(--mouse-x, 50px) var(--mouse-y, 50px), rgba(242, 144, 79, 0.12), transparent) !important;
          pointer-events: none !important;
          transition: opacity 0.5s ease !important;
          opacity: 0 !important;
          z-index: 1 !important;
        }
        .spotlight-card:hover::before {
          opacity: 1 !important;
        }
        .spotlight-card > * {
          position: relative;
          z-index: 2;
        }

        /* Animated Device Icons */
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 1px rgba(9, 118, 188, 0.2)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 6px rgba(9, 118, 188, 0.5)); transform: scale(1.05); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes subtleRotate {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        .animate-pulse-glow {
          animation: glowPulse 2s infinite ease-in-out !important;
        }
        .animate-float {
          animation: floatCard 2.5s infinite ease-in-out !important;
        }
        .animate-rotate {
          animation: subtleRotate 3.5s infinite ease-in-out !important;
        }

        /* Shimmer Loading State Keyframes */
        @keyframes shimmer {
          100% { background-position: -200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        /* Dark Mode CSS Variables / Core Overrides */
        .dark-theme-wrapper {
          background-color: #09090b !important;
          color: #f4f4f5 !important;
          min-height: 100vh;
        }
        .dark-theme-wrapper header, .dark-theme-wrapper aside {
          background-color: #09090b !important;
          border-color: rgba(63, 63, 70, 0.4) !important;
        }
        .dark-theme-wrapper .sidebar-nav-link {
          color: #a1a1aa !important;
        }
        .dark-theme-wrapper .sidebar-nav-link:hover {
          background-color: rgba(63, 63, 70, 0.3) !important;
          color: #ffffff !important;
        }
        .dark-theme-wrapper .sidebar-nav-link.active {
          background-color: #3b82f6 !important;
          color: #ffffff !important;
        }
        .dark-theme-wrapper .erp-card, .dark-theme-wrapper .glass-card {
          background: rgba(20, 20, 25, 0.8) !important;
          border: 1px solid rgba(63, 63, 70, 0.5) !important;
          color: #f4f4f5 !important;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.6) !important;
        }
        .dark-theme-wrapper .erp-card:hover, .dark-theme-wrapper .glass-card:hover {
          border-color: rgba(59, 130, 246, 0.3) !important;
          box-shadow: 0 20px 40px -15px rgba(59, 130, 246, 0.12) !important;
        }
        .dark-theme-wrapper h2, .dark-theme-wrapper h3, .dark-theme-wrapper h4, .dark-theme-wrapper strong {
          color: #ffffff !important;
        }
        .dark-theme-wrapper table th {
          color: #a1a1aa !important;
          border-color: rgba(63, 63, 70, 0.4) !important;
        }
        .dark-theme-wrapper table tr {
          border-color: rgba(63, 63, 70, 0.3) !important;
        }
        .dark-theme-wrapper td {
          color: #d4d4d8 !important;
        }
        .dark-theme-wrapper input, .dark-theme-wrapper select, .dark-theme-wrapper textarea, .dark-theme-wrapper .form-input {
          background-color: #18181b !important;
          border-color: rgba(63, 63, 70, 0.6) !important;
          color: #f4f4f5 !important;
        }
        .dark-theme-wrapper .bell-btn {
          background-color: rgba(20, 20, 25, 0.7) !important;
          border-color: rgba(63, 63, 70, 0.7) !important;
          color: #f4f4f5 !important;
        }
        .dark-theme-wrapper .bell-btn:hover {
          background-color: rgba(39, 39, 42, 0.8) !important;
          border-color: rgba(59, 130, 246, 0.4) !important;
          color: #3b82f6 !important;
        }

        /* Analytics Tab Header Responsiveness */
        .analytics-header-row {
          width: 100%;
        }
        @media (max-width: 640px) {
          .analytics-header-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px !important;
          }
          .analytics-range-selector {
            width: 100% !important;
            justify-content: space-between !important;
            overflow-x: auto;
          }
          .analytics-range-selector button {
            flex: 1 !important;
            text-align: center !important;
            padding: 6px 0 !important;
          }
          .analytics-header-actions {
            flex-direction: column !important;
            width: 100% !important;
            gap: 8px !important;
          }
          .analytics-action-btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }

        /* Active timeline node pulse glow */
        @keyframes activeNodePulse {
          0% { box-shadow: 0 0 0 0 rgba(9, 118, 188, 0.5); }
          70% { box-shadow: 0 0 0 10px rgba(9, 118, 188, 0); }
          100% { box-shadow: 0 0 0 0 rgba(9, 118, 188, 0); }
        }
        .active-node-pulse {
          animation: activeNodePulse 2.5s infinite !important;
        }

        @keyframes lineFill {
          from { width: 0; }
        }
        .animate-line-fill {
          animation: lineFill 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes successPop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-success-pop {
          animation: successPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes modalSlideUp {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-modal-slide-up {
          animation: modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes glowBorder {
          0%, 100% { border-color: rgba(9, 118, 188, 0.2); }
          50% { border-color: rgba(9, 118, 188, 0.6); }
        }
        .animate-glow-border {
          animation: glowBorder 2.5s infinite ease-in-out;
        }

        @keyframes toastSlideIn {
          from { transform: translate(120%, 0); opacity: 0; }
          to { transform: translate(0, 0); opacity: 1; }
        }
        .toast-slide-in {
          animation: toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .oem-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 440px;
          background-color: var(--card-bg, #ffffff);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.1);
          z-index: 150;
          display: flex;
          flex-direction: column;
          border-left: 1px solid rgba(63, 63, 70, 0.2);
          animation: drawerSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        .oem-drawer-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 140;
          animation: fadeIn 0.25s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Accessibilities focus and styles */
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #0976BC !important;
          box-shadow: 0 0 0 3px rgba(9, 118, 188, 0.15);
        }

        /* prefers-reduced-motion overrides */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-delay: 0s !important;
            animation-duration: 0s !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0s !important;
            scroll-behavior: auto !important;
          }
        }

        /* Mobile accordion rendering for timelines */
        @media (max-width: 768px) {
          .timeline-desktop-track {
            display: none !important;
          }
          .timeline-mobile-accordion {
            display: flex !important;
            flex-direction: column;
            gap: 8px;
          }
        }

        /* OEM card transitions & modern overrides */
        .oem-card-transition {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .oem-card-transition:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 20px 40px -15px rgba(9, 118, 188, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.01) !important;
          border-color: rgba(9, 118, 188, 0.25) !important;
        }

         /* B2B Dashboard Improvements */
         .b2b-kpi-card {
           background: #ffffff;
           border: 1px solid #e4e4e7;
           border-radius: 16px;
           padding: 20px;
           box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.03), 0 2px 8px -1px rgba(0, 0, 0, 0.02);
           transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
           position: relative;
           overflow: hidden;
         }
         .dark-theme-wrapper .b2b-kpi-card {
           background: rgba(20, 20, 25, 0.8) !important;
           border: 1px solid rgba(63, 63, 70, 0.5) !important;
           box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.6) !important;
         }
         .b2b-kpi-card:hover {
           transform: translateY(-4px) scale(1.02);
           box-shadow: 0 12px 30px -4px rgba(9, 118, 188, 0.1), 0 4px 12px -2px rgba(9, 118, 188, 0.05);
           border-color: rgba(9, 118, 188, 0.3);
         }
         .dark-theme-wrapper .b2b-kpi-card:hover {
           box-shadow: 0 12px 30px -4px rgba(59, 130, 246, 0.2), 0 4px 12px -2px rgba(59, 130, 246, 0.1) !important;
           border-color: rgba(59, 130, 246, 0.4) !important;
         }
         .b2b-row {
           transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
           position: relative;
         }
         .b2b-row:hover {
           background-color: rgba(9, 118, 188, 0.03) !important;
           transform: scale(1.002);
           box-shadow: inset 4px 0 0 0 #0976BC;
           cursor: pointer;
         }
         .dark-theme-wrapper .b2b-row:hover {
           background-color: rgba(59, 130, 246, 0.05) !important;
           box-shadow: inset 4px 0 0 0 #3b82f6 !important;
         }
         .b2b-badge {
            display: inline-flex !important;
            align-items: center !important;
            padding: 6px 12px !important;
            border-radius: 9999px !important;
            font-size: 0.72rem !important;
            font-weight: 700 !important;
            letter-spacing: 0.02em !important;
            text-transform: uppercase !important;
          }
          .b2b-badge-dot {
            width: 6px !important;
            height: 6px !important;
            border-radius: 50% !important;
            display: inline-block !important;
            margin-right: 6px !important;
          }
          .b2b-badge-delivered {
            background-color: rgba(16, 185, 129, 0.1) !important;
            color: #10B981 !important;
            border: 1px solid rgba(16, 185, 129, 0.2) !important;
            box-shadow: 0 2px 8px -2px rgba(16, 185, 129, 0.15) !important;
          }
          .b2b-badge-shipped {
            background-color: rgba(59, 130, 246, 0.1) !important;
            color: #3b82f6 !important;
            border: 1px solid rgba(59, 130, 246, 0.2) !important;
            box-shadow: 0 2px 8px -2px rgba(59, 130, 246, 0.15) !important;
          }
          .b2b-badge-pending {
            background-color: rgba(245, 158, 11, 0.1) !important;
            color: #f59e0b !important;
            border: 1px solid rgba(245, 158, 11, 0.2) !important;
            box-shadow: 0 2px 8px -2px rgba(245, 158, 11, 0.15) !important;
          }
          .b2b-badge-unpaid {
            background-color: rgba(239, 68, 68, 0.1) !important;
            color: #ef4444 !important;
            border: 1px solid rgba(239, 68, 68, 0.2) !important;
            box-shadow: 0 2px 8px -2px rgba(239, 68, 68, 0.15) !important;
            animation: b2bPulseRed 2s infinite !important;
          }
          @keyframes b2bPulseRed {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
          .b2b-search-input {
            width: 100%;
            max-width: 320px;
            padding: 10px 16px;
            padding-left: 40px;
            border-radius: 12px;
            border: 1px solid #e4e4e7;
            background: #ffffff;
            font-size: 0.88rem;
            transition: all 0.25s ease;
            outline: none;
          }
          .b2b-search-input:focus {
            border-color: #0976BC;
            box-shadow: 0 0 0 3px rgba(9, 118, 188, 0.15);
          }
          .dark-theme-wrapper .b2b-search-input {
            background: #18181b !important;
            border-color: rgba(63, 63, 70, 0.6) !important;
            color: #ffffff !important;
          }
          .dark-theme-wrapper .b2b-search-input:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25) !important;
          }
          .b2b-filter-select {
            padding: 8px 36px 8px 12px !important;
            border-radius: 10px !important;
            border: 1px solid #cbd5e1 !important;
            background-color: #ffffff !important;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") !important;
            background-position: right 8px center !important;
            background-repeat: no-repeat !important;
            background-size: 1.25rem !important;
            font-size: 0.82rem !important;
            font-weight: 500 !important;
            color: #334155 !important;
            outline: none !important;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
            cursor: pointer !important;
            appearance: none !important;
            -webkit-appearance: none !important;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
          }
          .dark-theme-wrapper .b2b-filter-select {
            background-color: #18181b !important;
            border-color: rgba(63, 63, 70, 0.6) !important;
            color: #ffffff !important;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") !important;
          }
          .b2b-filter-select:hover {
            border-color: #0976BC !important;
            background-color: #f8fafc !important;
          }
          .dark-theme-wrapper .b2b-filter-select:hover {
            border-color: #3b82f6 !important;
            background-color: #27272a !important;
          }
          .b2b-filter-select:focus {
            border-color: #0976BC !important;
            box-shadow: 0 0 0 2px rgba(9, 118, 188, 0.15) !important;
          }
          .dark-theme-wrapper .b2b-filter-select:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25) !important;
          }
          .b2b-filter-select-trigger {
            padding: 8px 12px !important;
            border-radius: 10px !important;
            border: 1px solid #cbd5e1 !important;
            background-color: #ffffff !important;
            font-size: 0.82rem !important;
            font-weight: 500 !important;
            color: #334155 !important;
            outline: none !important;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
            cursor: pointer !important;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 8px !important;
          }
          .dark-theme-wrapper .b2b-filter-select-trigger {
            background-color: #18181b !important;
            border-color: rgba(63, 63, 70, 0.6) !important;
            color: #ffffff !important;
          }
          .b2b-filter-select-trigger:hover {
            border-color: #0976BC !important;
            background-color: #f8fafc !important;
            transform: translateY(-1px) !important;
          }
          .dark-theme-wrapper .b2b-filter-select-trigger:hover {
            border-color: #3b82f6 !important;
            background-color: #27272a !important;
          }
          .b2b-filter-select-trigger:focus {
            border-color: #0976BC !important;
            box-shadow: 0 0 0 2px rgba(9, 118, 188, 0.15) !important;
          }
          .dark-theme-wrapper .b2b-filter-select-trigger:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25) !important;
          }
          .b2b-action-btn {
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
            border-radius: 10px !important;
            padding: 8px 16px !important;
            font-weight: 600 !important;
            font-size: 0.8rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            cursor: pointer !important;
          }
          .b2b-action-btn-primary {
            background-color: #0976BC !important;
            color: #ffffff !important;
            border: 1px solid #0976BC !important;
            box-shadow: 0 2px 4px rgba(9, 118, 188, 0.15) !important;
          }
          .b2b-action-btn-primary:hover {
            background-color: #075c94 !important;
            border-color: #075c94 !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(9, 118, 188, 0.3) !important;
          }
          .b2b-action-btn-outline {
            background-color: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            color: #475569 !important;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
          }
          .b2b-action-btn-outline:hover {
            background-color: #f8fafc !important;
            color: #0976BC !important;
            border-color: #cbd5e1 !important;
            transform: translateY(-1px) !important;
          }
          .dark-theme-wrapper .b2b-action-btn-outline {
            background-color: #18181b !important;
            border-color: rgba(63, 63, 70, 0.6) !important;
            color: #e4e4e7 !important;
          }
          .dark-theme-wrapper .b2b-action-btn-outline:hover {
            background-color: #27272a !important;
            color: #3b82f6 !important;
            border-color: #52525b !important;
          }
          .b2b-custom-select-option:hover {
            background-color: rgba(9, 118, 188, 0.05) !important;
            color: #0976BC !important;
          }
          .dark-theme-wrapper .b2b-custom-select-option:hover {
            background-color: rgba(59, 130, 246, 0.08) !important;
            color: #3b82f6 !important;
          }
          .b2b-custom-select-trigger:hover {
            border-color: #0976BC !important;
            transform: translateY(-1px) !important;
          }
          .dark-theme-wrapper .b2b-custom-select-trigger:hover {
            border-color: #3b82f6 !important;
          }
          @keyframes cardEntrance {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shipmentGlow {
            0% { box-shadow: 0 0 0 0 rgba(9, 118, 188, 0.4); }
            70% { box-shadow: 0 0 0 8px rgba(9, 118, 188, 0); }
            100% { box-shadow: 0 0 0 0 rgba(9, 118, 188, 0); }
          }
          @keyframes orderPulse {
            0% { transform: scale(1); opacity: 0.85; }
            50% { transform: scale(1.02); opacity: 1; }
            100% { transform: scale(1); opacity: 0.85; }
          }
          @keyframes badgeGlow {
            0% { border-color: rgba(9, 118, 188, 0.2); }
            50% { border-color: rgba(9, 118, 188, 0.6); }
            100% { border-color: rgba(9, 118, 188, 0.2); }
          }
          .b2c-glass-card {
            background: rgba(255, 255, 255, 0.72) !important;
            backdrop-filter: blur(18px) !important;
            -webkit-backdrop-filter: blur(18px) !important;
            border-radius: 20px !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06) !important;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
          .b2c-glass-card:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.09) !important;
          }
          .dark-theme-wrapper .b2c-glass-card {
            background: rgba(24, 24, 27, 0.82) !important;
            border-color: rgba(63, 63, 70, 0.4) !important;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2) !important;
          }
          .dark-theme-wrapper .b2c-glass-card:hover {
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3) !important;
          }

      `}} />

      {/* SIDEBAR NAVIGATION WRAPPER (SPACER) */}
      <div style={{
        width: sidebarCollapsed ? '76px' : '260px',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0
      }}>
        {/* SIDEBAR NAVIGATION (FIXED POSITION) */}
        <aside style={{ 
          width: sidebarCollapsed ? '76px' : '260px', 
          backgroundColor: theme.cardBg, 
          borderRight: theme.border,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 40
        }}>
        {/* Brand Header */}
        <div style={{ 
          padding: '20px 16px', 
          borderBottom: theme.border, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          gap: '12px'
        }}>
          {sidebarCollapsed ? (
            <img loading="lazy" src="/img/bapuji_logo_icon.png" 
              alt="Bapuji Logo" 
              onClick={() => setSidebarCollapsed(false)}
              style={{ height: '44px', width: '44px', objectFit: 'contain', cursor: 'pointer' }}
            />
          ) : (
            <>
              <img loading="lazy" src="/img/bapuji logo.png" alt="Bapuji Logo" style={{ height: '60px', objectFit: 'contain' }} />
              <button 
                onClick={() => setSidebarCollapsed(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', padding: '4px' }}
              >
                <ChevronLeft size={18} />
              </button>
            </>
          )}
        </div>

        {/* Navigation list */}
        <nav style={{ 
          flex: 1, 
          padding: sidebarCollapsed ? '20px 0' : '20px 12px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '4px', 
          overflowY: 'auto',
          alignItems: sidebarCollapsed ? 'center' : 'stretch'
        }}>
          {sidebarItems.map((item, idx) => {
            const Icon = item.icon;
            // Check role authorization limits
            if (!item.role.includes(simulatedRole)) return null;

            return (
              <div 
                key={idx}
                onClick={() => setActiveTab(item.label)}
                className={`sidebar-nav-link ${activeTab === item.label ? 'active' : ''}`}
                style={sidebarCollapsed ? { 
                  width: '48px', 
                  height: '48px', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  padding: 0,
                  gap: 0
                } : {}}
              >
                {sidebarCollapsed ? (
                  <Icon size={18} />
                ) : (
                  <>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Role Simulator Profile banner */}
        <div style={{ padding: '16px', borderTop: '1px solid #e4e4e7', backgroundColor: '#fdfdfd' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start', 
            gap: sidebarCollapsed ? 0 : '10px' 
          }}>
            {sidebarCollapsed ? (
              <div style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '50%', 
                backgroundColor: '#09090b', 
                color: '#ffffff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.85rem'
              }}>
                {simulatedRole.substring(0, 2).toUpperCase()}
              </div>
            ) : (
              <>
                <div style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '50%', 
                  backgroundColor: '#09090b', 
                  color: '#ffffff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}>
                  {simulatedRole.substring(0, 2).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {simulatedRole === 'Admin' ? 'Vignesh Sullia' : 'Staff Member'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#0976BC', fontWeight: 'bold' }}>{simulatedRole}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* HEADER BAR */}
        <header style={{ 
          height: '70px', 
          backgroundColor: theme.cardBg, 
          borderBottom: theme.border, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end', 
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          {/* Controls & Role simulator dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* Live Role Switcher (Simulator Dropdown) */}
            <div style={{ position: 'relative', zIndex: 45 }}>
              {/* Click Outside Overlay */}
              {roleDropdownOpen && (
                <div 
                  onClick={() => setRoleDropdownOpen(false)}
                  style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    zIndex: 46, 
                    background: 'transparent',
                    cursor: 'default'
                  }} 
                />
              )}

              {/* Dropdown Toggle Button */}
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: theme.border,
                  borderRadius: '10px',
                  padding: '7px 14px',
                  fontSize: '0.85rem',
                  backgroundColor: theme.cardBg,
                  color: theme.text,
                  fontWeight: '600',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  position: 'relative',
                  zIndex: 47
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#94a3b8';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                {React.createElement(ROLE_DETAILS[simulatedRole].icon, {
                  size: 15,
                  style: { color: ROLE_DETAILS[simulatedRole].color }
                })}
                <span style={{ color: theme.text }}>{ROLE_DETAILS[simulatedRole].label}</span>
                <ChevronDown 
                  size={14} 
                  style={{ 
                    color: '#64748b',
                    transform: roleDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} 
                />
              </button>

              {/* Dropdown Options Box */}
              {roleDropdownOpen && (
                <div
                  className="dropdown-fade-in"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    width: '230px',
                    backgroundColor: theme.cardBg,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: theme.border,
                    borderRadius: '12px',
                    padding: '5px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                    zIndex: 48,
                  }}
                >
                  <div style={{ padding: '6px 10px 4px 10px', fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Choose Simulator Role
                  </div>
                  {Object.entries(ROLE_DETAILS).map(([roleKey, details]) => {
                    const IconComponent = details.icon;
                    const isSelected = simulatedRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        onClick={() => {
                          setSimulatedRole(roleKey);
                          logSystemAction(`Simulated system role changed to ${roleKey}`);
                          setRoleDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 10px',
                          fontSize: '0.82rem',
                          backgroundColor: isSelected ? details.bg : 'transparent',
                          color: isSelected ? details.color : theme.text,
                          fontWeight: isSelected ? '700' : '500',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          marginBottom: '2px'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                            e.currentTarget.style.color = '#0f172a';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#475569';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <IconComponent size={15} style={{ color: details.color }} />
                          <span>{details.label}</span>
                        </div>
                        {isSelected && (
                          <Check size={13} style={{ color: details.color }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative', zIndex: 40 }}>
              {/* Click Outside Overlay for Notifications */}
              {showNotifications && (
                <div 
                  onClick={() => setShowNotifications(false)}
                  style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    zIndex: 41, 
                    background: 'transparent',
                    cursor: 'default'
                  }} 
                />
              )}

              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="bell-btn bell-ring-hover"
                style={{ position: 'relative', zIndex: 42 }}
              >
                <Bell size={22} className="bell-icon" style={{ transition: 'color 0.2s' }} />
                {unreadNotificationsCount > 0 && (
                  <span 
                    className="badge-pulse"
                    style={{ 
                      position: 'absolute', 
                      top: '-2px', 
                      right: '-2px', 
                      backgroundColor: '#0976BC', 
                      color: '#ffffff', 
                      borderRadius: '50%', 
                      width: '16px', 
                      height: '16px', 
                      fontSize: '0.65rem', 
                      fontWeight: '800',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '2px solid #ffffff',
                      boxSizing: 'content-box'
                    }}
                  >
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notification drop center */}
              {showNotifications && (
                <div 
                  className="dropdown-fade-in"
                  style={{ 
                    position: 'absolute', 
                    top: 'calc(100% + 6px)', 
                    right: 0, 
                    width: '330px', 
                    zIndex: 43, 
                    padding: '16px',
                    backgroundColor: theme.cardBg,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: theme.border,
                    borderRadius: '14px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: theme.text }}>Recent Notifications</span>
                    <button 
                      onClick={() => {
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        logSystemAction('Marked all system notifications as read');
                      }}
                      style={{ background: 'none', border: 'none', color: '#0976BC', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Clear all
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <div key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: !n.read ? 'bold' : 'normal', color: !n.read ? theme.text : theme.subtitle }}>{n.title}</span>
                          <span style={{ fontSize: '0.65rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{n.time}</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: theme.subtitle }}>{n.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => {
                setDarkMode(!darkMode);
                logSystemAction(`Toggled system appearance to ${!darkMode ? 'Dark' : 'Light'} Mode`);
              }}
              className="bell-btn"
              style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} style={{ color: '#f59e0b' }} /> : <Moon size={20} style={{ color: '#475569' }} />}
            </button>

          </div>
        </header>

        {/* WORKSPACE PAGE VIEW */}
        <main style={{ flex: 1, padding: '30px 24px', overflowY: 'auto' }}>
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div>
              {/* KPI TOP ROW SUMMARY */}
              <div className="erp-kpi-grid">
                <div className="erp-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: 600 }}>Total Revenue</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0' }}>₹85,00,000</h3>
                    <span style={{ fontSize: '0.72rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 'bold' }}>
                      <TrendingUp size={12} /> +12.4% <span style={{ color: '#a1a1aa', fontWeight: 'normal' }}>vs last month</span>
                    </span>
                  </div>
                  <div style={{ backgroundColor: 'rgba(9, 118, 188, 0.1)', padding: '12px', borderRadius: '12px', color: '#0976BC' }}>
                    <DollarSign size={24} />
                  </div>
                </div>

                <div className="erp-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: 600 }}>Total Orders</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0' }}>1,348</h3>
                    <span style={{ fontSize: '0.72rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 'bold' }}>
                      <TrendingUp size={12} /> +8.2% <span style={{ color: '#a1a1aa', fontWeight: 'normal' }}>vs last month</span>
                    </span>
                  </div>
                  <div style={{ backgroundColor: 'rgba(9, 118, 188, 0.1)', padding: '12px', borderRadius: '12px', color: '#0976BC' }}>
                    <ShoppingCart size={24} />
                  </div>
                </div>

                <div className="erp-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: 600 }}>OEM Contracts</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0' }}>5 Active</h3>
                    <span style={{ fontSize: '0.72rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 'bold' }}>
                      <Activity size={12} /> Sampling <span style={{ color: '#a1a1aa', fontWeight: 'normal' }}>phase active</span>
                    </span>
                  </div>
                  <div style={{ backgroundColor: 'rgba(9, 118, 188, 0.1)', padding: '12px', borderRadius: '12px', color: '#0976BC' }}>
                    <ClipboardList size={24} />
                  </div>
                </div>

                <div className="erp-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: 600 }}>Total Profit</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0' }}>₹41,00,000</h3>
                    <span style={{ fontSize: '0.72rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 'bold' }}>
                      <TrendingUp size={12} /> +14.1% <span style={{ color: '#a1a1aa', fontWeight: 'normal' }}>net increase</span>
                    </span>
                  </div>
                  <div style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)', padding: '12px', borderRadius: '12px', color: '#16a34a' }}>
                    <Award size={24} />
                  </div>
                </div>
              </div>

              {/* GRAPHS AND RECENT ACTIVITY ROWS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px', marginBottom: '24px' }}>
                
                {/* Recharts revenue line chart */}
                <div className="erp-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#09090b' }}>Financial Sales Trends</h4>
                      <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Comparing gross sales against cleanroom expenses</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: '#0976BC' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0976BC' }} /> Revenue
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: '#09090b' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#09090b' }} /> Expenses
                      </span>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REVENUE_ANALYTICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0976BC" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#0976BC" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#09090b" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#09090b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} />
                        <YAxis stroke="#a1a1aa" fontSize={11} />
                        <Tooltip />
                        <Area type="monotone" dataKey="Revenue" stroke="#0976BC" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                        <Area type="monotone" dataKey="Expenses" stroke="#09090b" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Selling Products List */}
                <div className="erp-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontWeight: 'bold', fontSize: '1rem' }}>Top Selling Formats</h4>
                    <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Product quantities and gross turnover</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {TOP_PRODUCTS.map((prod, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#09090b' }}>{prod.name}</span>
                          <span style={{ fontSize: '0.72rem', color: '#71717a' }}>{formatNumber(prod.Qty)} units sold</span>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0976BC' }}>₹{(prod.Revenue / 100000).toFixed(1)}L</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* GEO MAP AND AUDIT RECORDS SECTION */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
                {/* Geographic sales */}
                <div className="erp-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>Geographic sales (Statewide)</h4>
                    <span style={{ fontSize: '0.85rem', color: '#71717a' }}>Active state dispatch volumes</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {GEOGRAPHIC_SALES.map((state, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 'bold' }}>{state.name} ({state.cords})</span>
                          <span style={{ color: '#0976BC', fontWeight: 'bold' }}>₹{(state.sales / 100000).toFixed(1)} Lakhs</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px' }}>
                          <div style={{ width: `${(state.sales / 4800000) * 100}%`, height: '100%', backgroundColor: '#0976BC', borderRadius: '3px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit log updates preview */}
                <div className="erp-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>Recent ERP Audit Trails</h4>
                      <span style={{ fontSize: '0.85rem', color: '#71717a' }}>System event logs</span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('Settings')}
                      style={{ background: 'none', border: 'none', color: '#0976BC', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      View all logs
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxH: '220px', overflowY: 'auto' }}>
                    {auditLogs.slice(0, 5).map((log, idx) => (
                      <div key={`${log.id}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px', fontSize: '0.92rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ color: '#09090b', fontWeight: 'bold' }}>{log.action}</span>
                          <span style={{ fontSize: '0.82rem', color: '#71717a' }}>By {log.user}</span>
                        </div>
                        <span style={{ fontSize: '0.82rem', color: '#a1a1aa', whiteSpace: 'nowrap' }}>{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === 'Analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Header section with interactive control switches and export actions */}
              <div className="analytics-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: `1px solid ${theme.divider}`, paddingBottom: '16px' }}>
                {/* Range Selector Switch (Pills) */}
                <div className="analytics-range-selector" style={{ display: 'flex', backgroundColor: darkMode ? '#18181b' : '#f1f5f9', padding: '4px', borderRadius: '10px', border: darkMode ? '1px solid rgba(63,63,70,0.6)' : '1px solid #e2e8f0', gap: '2px' }}>
                  {['Today', '7 Days', '30 Days', '90 Days', 'Year'].map((range) => {
                    const isActive = timeRange === range;
                    return (
                      <button
                        key={range}
                        onClick={() => {
                          setTimeRange(range);
                          logSystemAction(`Changed analytics time range view to ${range}`);
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: isActive ? '700' : '500',
                          backgroundColor: isActive ? (darkMode ? '#3b82f6' : '#ffffff') : 'transparent',
                          color: isActive ? (darkMode ? '#ffffff' : '#0f172a') : (darkMode ? '#a1a1aa' : '#64748b'),
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: isActive && !darkMode ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                        }}
                      >
                        {range}
                      </button>
                    );
                  })}
                </div>
                
                {/* Export actions */}
                <div className="analytics-header-actions" style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={handleGeneratePDF}
                    className="btn btn-secondary analytics-action-btn" 
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.82rem', border: theme.border, borderRadius: '8px', backgroundColor: theme.cardBg, color: theme.text, cursor: 'pointer' }}
                  >
                    <FileText size={14} /> Generate PDF
                  </button>
                </div>
              </div>

              {/* 5-Column KPI Header above Analytics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                
                {/* Card 1: Revenue */}
                <div 
                  className="glass-card spotlight-card stagger-card-0" 
                  onMouseMove={handleMouseMove}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: theme.subtitle, fontWeight: 600 }}>Revenue</span>
                    <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 'bold' }}>
                      {getKPIValuesForRange(timeRange).rG}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                    {formatKPIValue('revenue', animatedValues.revenue)}
                  </h3>
                  {/* Mini Sparkline Chart */}
                  <div style={{ width: '100%', height: '30px', marginTop: '4px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{v:30},{v:45},{v:35},{v:60},{v:40},{v:55},{v:70}]} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
                        <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>vs previous period</span>
                </div>

                {/* Card 2: Orders */}
                <div 
                  className="glass-card spotlight-card stagger-card-1" 
                  onMouseMove={handleMouseMove}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: theme.subtitle, fontWeight: 600 }}>Orders</span>
                    <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 'bold' }}>
                      {getKPIValuesForRange(timeRange).oG}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                    {formatKPIValue('orders', animatedValues.orders)}
                  </h3>
                  <div style={{ width: '100%', height: '30px', marginTop: '4px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{v:100},{v:120},{v:110},{v:130},{v:125},{v:140},{v:150}]} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
                        <Line type="monotone" dataKey="v" stroke="#0976BC" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>vs previous period</span>
                </div>

                {/* Card 3: Profit */}
                <div 
                  className="glass-card spotlight-card stagger-card-2" 
                  onMouseMove={handleMouseMove}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: theme.subtitle, fontWeight: 600 }}>Profit</span>
                    <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 'bold' }}>
                      {getKPIValuesForRange(timeRange).pG}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                    {formatKPIValue('profit', animatedValues.profit)}
                  </h3>
                  <div style={{ width: '100%', height: '30px', marginTop: '4px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{v:20},{v:25},{v:22},{v:30},{v:28},{v:35},{v:42}]} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
                        <Line type="monotone" dataKey="v" stroke="#16a34a" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>vs previous period</span>
                </div>

                {/* Card 4: Visitors */}
                <div 
                  className="glass-card spotlight-card stagger-card-3" 
                  onMouseMove={handleMouseMove}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: theme.subtitle, fontWeight: 600 }}>Visitors</span>
                    <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 'bold' }}>
                      {getKPIValuesForRange(timeRange).vG}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                    {formatKPIValue('visitors', animatedValues.visitors)}
                  </h3>
                  <div style={{ width: '100%', height: '30px', marginTop: '4px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{v:500},{v:600},{v:550},{v:700},{v:650},{v:800},{v:900}]} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
                        <Line type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>vs previous week</span>
                </div>

                {/* Card 5: Conversion Rate */}
                <div 
                  className="glass-card spotlight-card stagger-card-4" 
                  onMouseMove={handleMouseMove}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: theme.subtitle, fontWeight: 600 }}>Conversion Rate</span>
                    <span style={{ 
                      fontSize: '0.72rem', 
                      color: getKPIValuesForRange(timeRange).cGl ? '#22c55e' : '#dc2626', 
                      fontWeight: 'bold' 
                    }}>
                      {getKPIValuesForRange(timeRange).cG}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                    {formatKPIValue('conversion', animatedValues.conversion)}
                  </h3>
                  <div style={{ width: '100%', height: '30px', marginTop: '4px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{v:4.2},{v:4.5},{v:4.3},{v:4.8},{v:4.6},{v:4.9},{v:5.1}]} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
                        <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>vs previous week</span>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="analytics-grid-container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                
                {/* Traffic sources pie chart */}
                <div 
                  className="glass-card spotlight-card" 
                  onMouseMove={handleMouseMove}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.divider}`, paddingBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '1.05rem', color: theme.text, margin: 0 }}>Acquisition Traffic Sources</h4>
                      <span style={{ fontSize: '0.78rem', color: theme.subtitle }}>GA4 Acquisition channel groupings</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#0976BC', backgroundColor: 'rgba(9, 118, 188, 0.08)', padding: '4px 10px', borderRadius: '20px' }}>
                      Live GA4
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', padding: '10px 0' }}>
                    {/* Donut Chart */}
                    <div style={{ width: '200px', height: '200px', position: 'relative' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <defs>
                            <linearGradient id="trafficGrad-0" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2e2e33" />
                              <stop offset="100%" stopColor="#09090b" />
                            </linearGradient>
                            <linearGradient id="trafficGrad-1" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0ea5e9" />
                              <stop offset="100%" stopColor="#0284c7" />
                            </linearGradient>
                            <linearGradient id="trafficGrad-2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#1d4ed8" />
                            </linearGradient>
                            <linearGradient id="trafficGrad-3" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#818cf8" />
                              <stop offset="100%" stopColor="#4f46e5" />
                            </linearGradient>
                            <linearGradient id="trafficGrad-4" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#34d399" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                          </defs>
                          <Pie
                            activeIndex={activeTrafficIndex}
                            activeShape={renderTrafficActiveShape}
                            data={GOOGLE_ANALYTICS_TRAFFIC}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={85}
                            paddingAngle={4}
                            dataKey="value"
                            onMouseEnter={(_, index) => setActiveTrafficIndex(index)}
                            onMouseLeave={() => setActiveTrafficIndex(null)}
                          >
                            {GOOGLE_ANALYTICS_TRAFFIC.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={`url(#trafficGrad-${index % 5})`}
                                stroke={activeTrafficIndex === index ? (darkMode ? '#ffffff' : '#0f172a') : 'transparent'}
                                strokeWidth={activeTrafficIndex === index ? 1.5 : 0}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Central Stat */}
                      <div className="central-stat-container" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        width: '130px',
                        transition: 'all 0.3s ease'
                      }}>
                        {activeTrafficIndex !== null ? (
                          <>
                            <span style={{ fontSize: '1.35rem', fontWeight: '800', color: theme.text, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                              {Math.round((13600 * GOOGLE_ANALYTICS_TRAFFIC[activeTrafficIndex].value) / 100).toLocaleString()}
                            </span>
                            <span style={{ fontSize: '0.62rem', color: ['#09090b', '#0976BC', '#3b82f6', '#6366f1', '#10b981'][activeTrafficIndex % 5], fontWeight: 'bold', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.03em' }}>
                              {GOOGLE_ANALYTICS_TRAFFIC[activeTrafficIndex].name}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: theme.text, fontWeight: '800', marginTop: '4px' }}>
                              {GOOGLE_ANALYTICS_TRAFFIC[activeTrafficIndex].value}% share
                            </span>
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: '1.45rem', fontWeight: '800', color: theme.text, lineHeight: 1, letterSpacing: '-0.02em' }}>13.6K</span>
                            <span style={{ fontSize: '0.62rem', color: theme.subtitle, fontWeight: 'bold', textTransform: 'uppercase', marginTop: '2px', letterSpacing: '0.05em' }}>Sessions</span>
                            <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 'bold', marginTop: '4px' }}>+12.8%</span>
                            <span style={{ fontSize: '0.58rem', color: theme.subtitle }}>vs last month</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Custom Modern Legend List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '180px' }}>
                      {GOOGLE_ANALYTICS_TRAFFIC.map((entry, index) => {
                        const colors = ['#09090b', '#0976BC', '#3b82f6', '#6366f1', '#10b981'];
                        const dotColor = colors[index % 5];
                        const total = GOOGLE_ANALYTICS_TRAFFIC.reduce((sum, item) => sum + item.value, 0);
                        const percentage = ((entry.value / total) * 100).toFixed(1);
                        const isHovered = activeTrafficIndex === index;
                        return (
                          <div 
                            key={entry.name} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              padding: '8px 12px', 
                              borderRadius: '10px', 
                              border: isHovered ? `1px solid ${dotColor}` : theme.border, 
                              backgroundColor: isHovered ? (darkMode ? 'rgba(39, 39, 42, 0.8)' : '#ffffff') : theme.itemBg,
                              transform: isHovered ? 'scale(1.02) translateX(2px)' : 'scale(1) translateX(0)',
                              boxShadow: isHovered ? `0 4px 12px ${dotColor}1a` : 'none',
                              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={() => setActiveTrafficIndex(index)}
                            onMouseLeave={() => setActiveTrafficIndex(null)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dotColor }} />
                              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: theme.subtitle }}>{entry.name}</span>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: theme.text }}>{formatNumber(entry.value)}</span>
                              <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: dotColor, backgroundColor: `${dotColor}12`, padding: '2px 8px', borderRadius: '12px' }}>{percentage}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Device breakdown and campaign details */}
                <div 
                  className="glass-card spotlight-card" 
                  onMouseMove={handleMouseMove}
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  
                  {/* Device Breakdown Header */}
                  <div>
                    <h4 style={{ fontWeight: 'bold', fontSize: '1.05rem', color: theme.text, margin: 0 }}>Device Breakdown</h4>
                    <span style={{ fontSize: '0.78rem', color: theme.subtitle }}>Sessions distribution by client type</span>
                  </div>

                  {/* Device List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {DEVICE_BREAKDOWN.map((d, idx) => {
                      const icons = { 'Desktop': Monitor, 'Mobile': Smartphone, 'Tablet': Tablet };
                      const Icon = icons[d.name] || Monitor;
                      const colors = { 'Desktop': '#0976BC', 'Mobile': '#10b981', 'Tablet': '#8b5cf6' };
                      const color = colors[d.name] || '#0976BC';
                      const bgs = { 'Desktop': 'rgba(9, 118, 188, 0.08)', 'Mobile': 'rgba(16, 185, 129, 0.08)', 'Tablet': 'rgba(139, 92, 246, 0.08)' };
                      const bg = bgs[d.name] || 'rgba(9, 118, 188, 0.08)';

                      const gradient = { 
                        'Desktop': 'linear-gradient(90deg, #0976BC, #3b82f6)', 
                        'Mobile': 'linear-gradient(90deg, #10b981, #34d399)', 
                        'Tablet': 'linear-gradient(90deg, #8b5cf6, #a78bfa)' 
                      }[d.name] || color;

                      const shadowGlow = {
                        'Desktop': '0 2px 8px rgba(9, 118, 188, 0.35)',
                        'Mobile': '0 2px 8px rgba(16, 185, 129, 0.35)',
                        'Tablet': '0 2px 8px rgba(139, 92, 246, 0.35)'
                      }[d.name] || 'none';

                      const animClasses = { 'Desktop': 'animate-pulse-glow', 'Mobile': 'animate-float', 'Tablet': 'animate-rotate' };
                      const animClass = animClasses[d.name] || '';
                      
                      return (
                        <div 
                          key={idx} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            padding: '4px 6px',
                            borderRadius: '10px',
                            transition: 'all 0.25s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(4px)';
                            const iconWrapper = e.currentTarget.querySelector('.device-icon-wrapper');
                            if (iconWrapper) {
                              iconWrapper.style.transform = 'scale(1.1) rotate(5deg)';
                              iconWrapper.style.backgroundColor = color;
                              iconWrapper.querySelector('svg').style.color = '#ffffff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                            const iconWrapper = e.currentTarget.querySelector('.device-icon-wrapper');
                            if (iconWrapper) {
                              iconWrapper.style.transform = 'scale(1) rotate(0deg)';
                              iconWrapper.style.backgroundColor = bg;
                              iconWrapper.querySelector('svg').style.color = color;
                            }
                          }}
                        >
                          <div 
                            className="device-icon-wrapper"
                            style={{ 
                              backgroundColor: bg, 
                              padding: '8px', 
                              borderRadius: '10px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              transition: 'all 0.25s ease'
                            }}
                          >
                            <Icon size={16} className={animClass} style={{ color: color, transition: 'all 0.25s ease' }} />
                          </div>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', lineHeight: 1 }}>
                              <span style={{ fontWeight: '700', color: theme.subtitle }}>{d.name}</span>
                              <span style={{ fontWeight: '800', color: theme.text, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {d.value}%
                                <span style={{ fontSize: '0.68rem', color: d.name === 'Tablet' ? '#dc2626' : '#22c55e', fontWeight: 'bold' }}>
                                  {d.name === 'Tablet' ? '↓ 1.5%' : d.name === 'Mobile' ? '↑ 8.2%' : '↑ 4.2%'}
                                </span>
                              </span>
                            </div>
                            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(226, 232, 240, 0.5)', borderRadius: '6px', overflow: 'hidden' }}>
                              <div 
                                className="progress-bar-fill-animate"
                                style={{ 
                                  width: `${d.value}%`, 
                                  height: '100%', 
                                  background: gradient, 
                                  borderRadius: '6px',
                                  boxShadow: shadowGlow
                                }} 
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(241,245,249,0.2), #f1f5f9, rgba(241,245,249,0.2))', margin: '4px 0' }} />

                  {/* Campaign List */}
                  <div>
                    <h4 style={{ fontWeight: 'bold', fontSize: '1.05rem', color: theme.text, margin: 0 }}>Ad Campaign Performance</h4>
                    <span style={{ fontSize: '0.78rem', color: theme.subtitle }}>Spend, leads and return-on-ad-spend</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Grid Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr', gap: '8px', padding: '0 12px 6px 12px', borderBottom: `1px solid ${theme.divider}`, fontSize: '0.72rem', fontWeight: 'bold', color: theme.subtitle, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <span>Campaign</span>
                      <span style={{ textAlign: 'right' }}>Spend</span>
                      <span style={{ textAlign: 'right' }}>Revenue</span>
                      <span style={{ textAlign: 'right' }}>ROAS</span>
                      <span style={{ textAlign: 'right' }}>CTR</span>
                      <span style={{ textAlign: 'right' }}>CPC</span>
                    </div>

                    {/* Grid Rows */}
                    {MARKETING_ROAS.map((ad, idx) => {
                      const platformInfo = {
                        'Google Search Ads': { icon: Globe, brandColor: '#4285F4', bg: 'rgba(66, 133, 244, 0.08)' },
                        'Facebook Retail Ads': { icon: Layers, brandColor: '#1877F2', bg: 'rgba(24, 119, 242, 0.08)' },
                        'LinkedIn B2B Ads': { icon: Briefcase, brandColor: '#0A66C2', bg: 'rgba(10, 102, 194, 0.08)' }
                      }[ad.platform] || { icon: Globe, brandColor: '#0976BC', bg: 'rgba(9, 118, 188, 0.08)' };
                      
                      const P_Icon = platformInfo.icon;
                      const revenueVal = ad.revenue || (ad.spend * ad.roas);
                      
                      return (
                        <div 
                          key={idx} 
                          className="campaign-micro-card spotlight-card"
                          onMouseMove={handleMouseMove}
                          style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr', 
                            gap: '8px', 
                            padding: '12px', 
                            borderRadius: '12px', 
                            border: theme.border, 
                            backgroundColor: theme.itemBg,
                            alignItems: 'center',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = platformInfo.brandColor;
                            e.currentTarget.style.backgroundColor = darkMode ? 'rgba(39, 39, 42, 0.8)' : '#ffffff';
                            e.currentTarget.style.boxShadow = `0 10px 20px -5px ${platformInfo.brandColor}12`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = theme.borderColorRaw;
                            e.currentTarget.style.backgroundColor = theme.itemBg;
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {/* Platform */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '28px', 
                              height: '28px', 
                              borderRadius: '50%', 
                              backgroundColor: platformInfo.bg, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: platformInfo.brandColor,
                              flexShrink: 0
                            }}>
                              <P_Icon size={14} />
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: theme.text }}>{ad.platform}</span>
                          </div>
                          
                          {/* Spend */}
                          <span style={{ fontSize: '0.78rem', color: theme.text, fontWeight: '700', textAlign: 'right' }}>
                            ₹{formatNumber(ad.spend)}
                          </span>
                          
                          {/* Revenue */}
                          <span style={{ fontSize: '0.78rem', color: theme.text, fontWeight: '700', textAlign: 'right' }}>
                            ₹{formatNumber(revenueVal)}
                          </span>
                          
                          {/* ROAS */}
                          <div style={{ textAlign: 'right' }}>
                            <span 
                              className="roas-badge"
                              style={{ 
                                fontSize: '0.72rem', 
                                fontWeight: '800', 
                                color: ad.roas >= 4.5 ? '#10b981' : '#0976BC', 
                                backgroundColor: ad.roas >= 4.5 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(9, 118, 188, 0.08)',
                                padding: '2px 8px', 
                                borderRadius: '999px',
                                border: ad.roas >= 4.5 ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(9, 118, 188, 0.15)',
                                display: 'inline-block'
                              }}
                            >
                              {ad.roas}x
                            </span>
                          </div>

                          {/* CTR */}
                          <span style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: '600', textAlign: 'right' }}>
                            {ad.ctr || '2.8%'}
                          </span>

                          {/* CPC */}
                          <span style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: '600', textAlign: 'right' }}>
                            {ad.cpc || '₹42'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Real Sales Heatmap Section */}
              <div 
                className="glass-card spotlight-card" 
                onMouseMove={handleMouseMove}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '8px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.divider}`, paddingBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontWeight: 'bold', fontSize: '1.05rem', color: theme.text, margin: 0 }}>Omnichannel Operations Heatmap</h4>
                    <span style={{ fontSize: '0.78rem', color: theme.subtitle }}>GitHub-style operations density tracking grid</span>
                  </div>
                  
                  {/* Metric Picker Pill */}
                  <div style={{ display: 'flex', backgroundColor: darkMode ? '#18181b' : '#f1f5f9', padding: '2px', borderRadius: '8px', border: darkMode ? '1px solid rgba(63,63,70,0.6)' : '1px solid #e2e8f0' }}>
                    {['Orders', 'Leads', 'Revenue'].map((m) => {
                      const isActive = heatmapMetric === m;
                      return (
                        <button
                          key={m}
                          onClick={() => {
                            setHeatmapMetric(m);
                            logSystemAction(`Toggled activity heatmap metric source to ${m}`);
                          }}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: isActive ? '700' : '500',
                            backgroundColor: isActive ? (darkMode ? '#3b82f6' : '#ffffff') : 'transparent',
                            color: isActive ? '#ffffff' : (darkMode ? '#a1a1aa' : '#64748b'),
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grid of days vs weeks */}
                <div style={{ overflowX: 'auto', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', minWidth: '700px' }}>
                    {/* Days Labels Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center', fontSize: '0.7rem', color: theme.subtitle, fontWeight: '700', paddingRight: '4px', paddingTop: '18px' }}>
                      <span style={{ height: '10px', lineHeight: '10px' }}>Mon</span>
                      <span style={{ height: '10px', lineHeight: '10px' }}></span>
                      <span style={{ height: '10px', lineHeight: '10px' }}>Wed</span>
                      <span style={{ height: '10px', lineHeight: '10px' }}></span>
                      <span style={{ height: '10px', lineHeight: '10px' }}>Fri</span>
                      <span style={{ height: '10px', lineHeight: '10px' }}></span>
                      <span style={{ height: '10px', lineHeight: '10px' }}>Sun</span>
                    </div>

                    {/* Weeks Columns */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                      {/* Month Names Labels */}
                      <div style={{ display: 'flex', fontSize: '0.7rem', color: theme.subtitle, fontWeight: '700', marginBottom: '4px' }}>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <span key={i} style={{ flex: 1, textAlign: 'left' }}>
                            {['Mar', 'Apr', 'May', 'Jun'][i % 4]}
                          </span>
                        ))}
                      </div>
                      
                      {/* Heatmap Cell Grid */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {generateHeatmapData(heatmapMetric).map((dayRow, dayIdx) => (
                          <div key={dayIdx} style={{ display: 'flex', gap: '4px' }}>
                            {dayRow.map((val, weekIdx) => {
                              const cellBg = getCellBg(val, heatmapMetric);
                              const formattedVal = heatmapMetric === 'Revenue' ? `₹${formatNumber(val)}` : val;
                              const tooltipText = `Week ${weekIdx + 1}, Day ${dayIdx + 1}: ${formattedVal} ${heatmapMetric}`;
                              return (
                                <div
                                  key={weekIdx}
                                  title={tooltipText}
                                  style={{
                                    flex: 1,
                                    height: '10px',
                                    minWidth: '10px',
                                    borderRadius: '2px',
                                    backgroundColor: cellBg,
                                    transition: 'all 0.15s ease',
                                    cursor: 'pointer'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.3)';
                                    e.currentTarget.style.zIndex = 10;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.zIndex = 1;
                                  }}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid Legend Footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: theme.subtitle }}>
                  <span>Less</span>
                  {[0, 2, 4, 6, 8].map((lvl) => {
                    const val = heatmapMetric === 'Revenue' ? lvl * 1000 : heatmapMetric === 'Leads' ? Math.floor(lvl / 2) : lvl;
                    return (
                      <div 
                        key={lvl} 
                        style={{ 
                          width: '10px', 
                          height: '10px', 
                          borderRadius: '2px', 
                          backgroundColor: getCellBg(val, heatmapMetric) 
                        }} 
                      />
                    );
                  })}
                  <span>More</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB: OEM ORDERS */}
          {activeTab === 'OEM Orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="analytics-grid-container">
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Custom OEM Manufacturing Orders</h2>
                  <span style={{ fontSize: '0.8rem', color: theme.subtitle }}>Real-time cleanroom pipeline trackers & ERP controllers</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setShowNewOemCustomerModal(true)}
                    className="btn btn-secondary" 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      padding: '10px 18px', 
                      fontSize: '0.85rem', 
                      border: theme.border, 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      fontWeight: 'bold',
                      backgroundColor: theme.cardBg,
                      color: theme.text,
                      boxShadow: theme.shadow,
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.borderColor = '#0976BC';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = theme.borderColorRaw;
                    }}
                  >
                    <Users size={16} /> Add OEM Customer
                  </button>
                  <button 
                    onClick={() => setShowNewOemModal(true)}
                    className="btn btn-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.85rem', backgroundColor: '#0976BC', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <Plus size={16} /> Create OEM Order
                  </button>
                  <button 
                    onClick={() => triggerSpreadsheetExport('csv', 'oem')}
                    className="btn btn-secondary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.85rem' }}
                  >
                    <FileSpreadsheet size={16} /> Export CSV
                  </button>
                </div>
              </div>

              {/* 5-Column OEM KPI Row Ribbon */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', flexWrap: 'wrap' }} className="erp-kpi-grid">
                {/* KPI 1: Active OEM Customers */}
                {(() => {
                  const val = customers.filter(c => c.type === 'OEM' && c.status === 'Active').length;
                  return (
                    <div className="glass-card stagger-card-0" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: theme.subtitle, fontWeight: 'bold', textTransform: 'uppercase' }}>Active OEM Clients</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: theme.text }}>{val}</h3>
                        <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 'bold' }}>↑ 12%</span>
                      </div>
                      <div style={{ width: '100%', height: '16px', marginTop: '4px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[{v:2},{v:3},{v:3},{v:3},{v:4},{v:4}]}>
                            <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* KPI 2: Orders In Production */}
                {(() => {
                  const val = oemOrders.filter(o => o.status === 'Production').length;
                  return (
                    <div className="glass-card stagger-card-1" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: theme.subtitle, fontWeight: 'bold', textTransform: 'uppercase' }}>In Production</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: theme.text }}>{val}</h3>
                        <span style={{ fontSize: '0.68rem', color: '#0976BC', fontWeight: 'bold' }}>Running</span>
                      </div>
                      <div style={{ width: '100%', height: '16px', marginTop: '4px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[{v:0},{v:1},{v:1},{v:2},{v:1},{v:1}]}>
                            <Line type="monotone" dataKey="v" stroke="#0976BC" strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* KPI 3: Orders Delayed */}
                {(() => {
                  const val = oemOrders.filter(o => o.health === 'red' || o.healthStatus === 'DELAYED').length;
                  return (
                    <div className="glass-card stagger-card-2" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: theme.subtitle, fontWeight: 'bold', textTransform: 'uppercase' }}>Delayed Pipeline</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: val > 0 ? '#EF4444' : theme.text }}>{val}</h3>
                        <span style={{ fontSize: '0.68rem', color: val > 0 ? '#EF4444' : theme.subtitle, fontWeight: 'bold' }}>{val > 0 ? 'Action Reqd' : 'No Delay'}</span>
                      </div>
                      <div style={{ width: '100%', height: '16px', marginTop: '4px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[{v:1},{v:0},{v:1},{v:1},{v:0},{v:1}]}>
                            <Line type="monotone" dataKey="v" stroke={val > 0 ? '#EF4444' : '#71717a'} strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* KPI 4: Monthly Revenue */}
                {(() => {
                  const val = oemOrders.reduce((sum, o) => sum + o.amount, 0);
                  return (
                    <div className="glass-card stagger-card-3" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: theme.subtitle, fontWeight: 'bold', textTransform: 'uppercase' }}>Monthly Revenue</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: theme.text }}>₹{(val / 100000).toFixed(1)}L</h3>
                        <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 'bold' }}>↑ 18%</span>
                      </div>
                      <div style={{ width: '100%', height: '16px', marginTop: '4px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[{v:12},{v:18},{v:15},{v:22},{v:19},{v:25}]}>
                            <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* KPI 5: Average Order Value */}
                {(() => {
                  const totalRev = oemOrders.reduce((sum, o) => sum + o.amount, 0);
                  const val = oemOrders.length ? Math.round(totalRev / oemOrders.length) : 0;
                  return (
                    <div className="glass-card stagger-card-4" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: theme.subtitle, fontWeight: 'bold', textTransform: 'uppercase' }}>Avg Order Value</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: theme.text }}>₹{(val / 100000).toFixed(2)}L</h3>
                        <span style={{ fontSize: '0.68rem', color: theme.subtitle, fontWeight: 'bold' }}>MOQ basis</span>
                      </div>
                      <div style={{ width: '100%', height: '16px', marginTop: '4px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[{v:35},{v:42},{v:38},{v:45},{v:40},{v:48}]}>
                            <Line type="monotone" dataKey="v" stroke="#0976BC" strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Filters Toolbar */}
              <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', border: theme.border }}>
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px', border: theme.border, borderRadius: '8px', padding: '6px 12px', backgroundColor: darkMode ? '#18181b' : '#ffffff' }}>
                  <Search size={16} style={{ color: theme.subtitle }} />
                  <input 
                    type="text" 
                    placeholder="Search by client company, spec or order ID..." 
                    value={oemSearch}
                    onChange={(e) => setOemSearch(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.82rem', color: theme.text }}
                    aria-label="Search OEM Orders"
                  />
                  {oemSearch && <X size={14} style={{ color: theme.subtitle, cursor: 'pointer' }} onClick={() => setOemSearch('')} />}
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 3, justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: theme.subtitle }}>Health</span>
                    <select 
                      value={oemStatusFilter} 
                      onChange={(e) => setOemStatusFilter(e.target.value)} 
                      className="form-input" 
                      style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px', border: theme.border, backgroundColor: theme.cardBg, color: theme.text }}
                      aria-label="Filter by Health"
                    >
                      <option value="All">All Health</option>
                      <option value="On Track">On Track</option>
                      <option value="Attention Needed">Attention Needed</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: theme.subtitle }}>Country</span>
                    <select 
                      value={oemCountryFilter} 
                      onChange={(e) => setOemCountryFilter(e.target.value)} 
                      className="form-input" 
                      style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px', border: theme.border, backgroundColor: theme.cardBg, color: theme.text }}
                      aria-label="Filter by Country"
                    >
                      <option value="All">All Countries</option>
                      <option value="India">India</option>
                      <option value="Japan">Japan</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: theme.subtitle }}>Active Stage</span>
                    <select 
                      value={oemStageFilter} 
                      onChange={(e) => setOemStageFilter(e.target.value)} 
                      className="form-input" 
                      style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px', border: theme.border, backgroundColor: theme.cardBg, color: theme.text }}
                      aria-label="Filter by Stage"
                    >
                      <option value="All">All Stages</option>
                      {OEM_WORKFLOW_STAGES.map(s => (
                        <option key={s.stage} value={s.stage}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Main Content Split-Screen Layout */}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                
                {/* LEFT COLUMN: FILTERED ORDER CARDS LIST */}
                <div style={{ flex: '3 1 650px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {filteredOemOrders.length === 0 ? (
                    <div className="glass-card" style={{ padding: '48px', textAlign: 'center', border: theme.border }}>
                      <AlertTriangle size={36} style={{ color: theme.subtitle, marginBottom: '12px' }} />
                      <h4 style={{ fontWeight: 'bold', color: theme.text }}>No OEM Custom Orders Found</h4>
                      <p style={{ fontSize: '0.8rem', color: theme.subtitle, margin: '4px 0 0 0' }}>Try adjusting your smart filters or query string.</p>
                    </div>
                  ) : (
                    filteredOemOrders.map((ord, oemIdx) => {
                      const stages = OEM_WORKFLOW_STAGES.map(s => s.stage);
                      const activeStageIndex = stages.indexOf(ord.status);
                      
                      const statusColors = {
                        'Inquiry': { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' },
                        'Quotation Sent': { bg: 'rgba(99, 102, 241, 0.08)', border: 'rgba(99, 102, 241, 0.2)', text: '#6366f1' },
                        'Sample Approval': { bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.2)', text: '#8b5cf6' },
                        'Artwork Approval': { bg: 'rgba(168, 85, 247, 0.08)', border: 'rgba(168, 85, 247, 0.2)', text: '#a855f7' },
                        'Raw Material Procurement': { bg: 'rgba(107, 114, 128, 0.08)', border: 'rgba(107, 114, 128, 0.2)', text: '#6b7280' },
                        'Production': { bg: 'rgba(249, 115, 22, 0.08)', border: 'rgba(249, 115, 22, 0.2)', text: '#f97316' },
                        'QC': { bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b' },
                        'Packing': { bg: 'rgba(244, 63, 94, 0.08)', border: 'rgba(244, 63, 94, 0.2)', text: '#f43f5e' },
                        'Dispatch': { bg: 'rgba(14, 165, 233, 0.08)', border: 'rgba(14, 165, 233, 0.2)', text: '#0ea5e9' },
                        'Delivered': { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)', text: '#10b981' }
                      }[ord.status] || { bg: 'rgba(113, 113, 122, 0.08)', border: 'rgba(113, 113, 122, 0.2)', text: '#71717a' };

                      const healthColors = {
                        'green': '#10B981',
                        'orange': '#F59E0B',
                        'red': '#EF4444'
                      }[ord.health] || '#10B981';

                      const completionPercentage = Math.round((activeStageIndex / (stages.length - 1)) * 100);

                      return (
                        <div 
                          key={ord.id} 
                          className="glass-card spotlight-card oem-card-transition"
                          onMouseMove={handleMouseMove}
                          style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '20px', 
                            padding: '24px', 
                            border: `2px solid ${healthColors}20`, 
                            borderRadius: '16px', 
                            position: 'relative',
                            boxShadow: `0 4px 20px -5px ${healthColors}05`
                          }}
                        >
                          {/* Card Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.72rem', color: theme.subtitle, fontWeight: 'bold', letterSpacing: '0.05em' }}>ORDER ID: {ord.id}</span>
                                <span style={{ fontSize: '0.72rem', color: theme.subtitle }}>•</span>
                                <span style={{ fontSize: '0.72rem', color: theme.subtitle }}>PLACED: {ord.orderDate}</span>
                                <span 
                                  style={{ 
                                    fontSize: '0.7rem', 
                                    fontWeight: 'bold', 
                                    padding: '2px 8px', 
                                    borderRadius: '12px', 
                                    backgroundColor: statusColors.bg, 
                                    border: `1px solid ${statusColors.border}`, 
                                    color: statusColors.text,
                                    textTransform: 'uppercase'
                                  }}
                                >
                                  {ord.status}
                                </span>
                                <span 
                                  style={{ 
                                    fontSize: '0.65rem', 
                                    fontWeight: '900', 
                                    padding: '2px 6px', 
                                    borderRadius: '6px', 
                                    backgroundColor: healthColors, 
                                    color: '#ffffff',
                                    letterSpacing: '0.03em'
                                  }}
                                >
                                  {ord.healthStatus || 'ON TRACK'}
                                </span>
                              </div>

                              <h3 
                                onClick={() => {
                                  const customer = customers.find(c => c.company === ord.company);
                                  if (customer) {
                                    setSelectedOemCustomer(customer);
                                  } else {
                                    setSelectedOemCustomer({
                                      id: 'CUST-TEMP',
                                      name: ord.contact,
                                      company: ord.company,
                                      email: ord.email || `${ord.contact.toLowerCase().replace(/\s+/g, '')}@${ord.company.toLowerCase().replace(/\s+/g, '')}.com`,
                                      phone: ord.phone || '+91 98845 00000',
                                      country: 'India',
                                      type: 'OEM',
                                      regDate: ord.orderDate,
                                      orders: 1,
                                      spend: ord.amount,
                                      status: 'Active',
                                      notes: 'Automatic drawer generated from active order record.',
                                      website: `www.${ord.company.toLowerCase().replace(/\s+/g, '')}.com`,
                                      industry: 'Healthcare Products',
                                      moq: 50000,
                                      interest: ord.product,
                                      source: 'Website'
                                    });
                                  }
                                }}
                                style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0', color: theme.text, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#0976BC'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = theme.text; }}
                              >
                                {ord.company} <ArrowUpRight size={14} style={{ opacity: 0.6 }} />
                              </h3>
                              
                              <span style={{ fontSize: '0.85rem', color: theme.subtitle, marginTop: '4px', display: 'block' }}>
                                Spec: <strong style={{ color: theme.text }}>{ord.product} ({ord.wipeType})</strong> | Fragrance: {ord.fragrance} | Packaging: {ord.packaging}
                              </span>

                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 10px', borderRadius: '999px', backgroundColor: darkMode ? 'rgba(9, 118, 188, 0.12)' : 'rgba(9, 118, 188, 0.08)', color: theme.text, border: `1px solid ${darkMode ? 'rgba(9, 118, 188, 0.22)' : 'rgba(9, 118, 188, 0.14)'}`, fontSize: '0.76rem', fontWeight: 700 }}>
                                  <Users size={13} /> {ord.contact || 'Contact pending'}
                                </span>
                                <a href={ord.phone ? `tel:${ord.phone}` : undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 10px', borderRadius: '999px', backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.18)', fontSize: '0.76rem', fontWeight: 800, textDecoration: 'none' }}>
                                  <Phone size={13} /> {ord.phone || 'Phone not added'}
                                </a>
                                <a href={ord.email ? `mailto:${ord.email}?subject=OEM RFQ ${ord.id} - Bapuji Surgicals` : undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 10px', borderRadius: '999px', backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.08)', color: '#4f46e5', border: '1px solid rgba(99, 102, 241, 0.18)', fontSize: '0.76rem', fontWeight: 800, textDecoration: 'none' }}>
                                  <MessageSquare size={13} /> {ord.email || 'Email not added'}
                                </a>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                              {/* SVG Circular Progress Ring */}
                              {(() => {
                                const size = 60;
                                const radius = size * 0.35;
                                const strokeWidth = size * 0.09;
                                const circumference = 2 * Math.PI * radius;
                                const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;
                                
                                let strokeColor = '#0976BC'; // blue
                                if (completionPercentage <= 30) strokeColor = '#F59E0B'; // orange
                                else if (completionPercentage >= 81) strokeColor = '#10B981'; // green
                                
                                return (
                                  <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                                      <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke={darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0, 0, 0, 0.06)'} strokeWidth={strokeWidth} />
                                      <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
                                    </svg>
                                    <span style={{ position: 'absolute', fontSize: '0.78rem', fontWeight: 'bold', color: theme.text }}>
                                      {completionPercentage}%
                                    </span>
                                  </div>
                                );
                              })()}

                              <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.75rem', color: theme.subtitle }}>Qty: <strong>{formatNumber(ord.quantity)}</strong> units</span>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0976BC', margin: '2px 0' }}>₹{formatNumber(ord.amount)}</h3>
                                <span style={{ fontSize: '0.72rem', color: theme.subtitle }}>Delivery: <strong style={{ color: theme.text }}>{ord.deliveryDate}</strong></span>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Timeline Visualizer */}
                          <div className="timeline-desktop-track" style={{ margin: '10px 0', overflowX: 'auto', paddingBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', minWidth: '760px', position: 'relative', padding: '12px 0' }}>
                              
                              {/* Background underlay connector track */}
                              <div style={{ 
                                position: 'absolute', 
                                top: '26px', 
                                left: '30px', 
                                right: '30px', 
                                height: '4px', 
                                backgroundColor: darkMode ? 'rgba(63, 63, 70, 0.4)' : '#e4e4e7', 
                                borderRadius: '2px',
                                zIndex: 1 
                              }} />
                              
                              {/* Glowing active path loader */}
                              <div 
                                className="animate-line-fill"
                                style={{ 
                                  position: 'absolute', 
                                  top: '26px', 
                                  left: '30px', 
                                  width: `${(activeStageIndex / (stages.length - 1)) * 92}%`, 
                                  height: '4px', 
                                  background: 'linear-gradient(90deg, #0976BC, #3b82f6, #10b981)', 
                                  borderRadius: '2px',
                                  boxShadow: `0 0 8px ${healthColors}60`,
                                  zIndex: 2,
                                  transition: 'width 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
                                }} 
                              />

                              {OEM_WORKFLOW_STAGES.map((ws, sIdx) => {
                                const isCompleted = sIdx <= activeStageIndex;
                                const isCurrent = sIdx === activeStageIndex;
                                const stageDetails = getOrderStageDetails(ord, ws.stage);
                                
                                return (
                                  <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, flex: 1, position: 'relative' }}>
                                    
                                    {/* Tooltip Hover popup */}
                                    {hoveredNode && hoveredNode.orderId === ord.id && hoveredNode.stage === ws.stage && (
                                      <div 
                                        className="animate-success-pop"
                                        style={{
                                          position: 'absolute',
                                          bottom: '44px',
                                          left: '50%',
                                          transform: 'translateX(-50%)',
                                          backgroundColor: darkMode ? '#18181b' : '#ffffff',
                                          border: `2px solid ${darkMode ? '#27272a' : '#cbd5e1'}`,
                                          borderRadius: '8px',
                                          padding: '10px 12px',
                                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                                          zIndex: 100,
                                          width: '180px',
                                          textAlign: 'left',
                                          fontSize: '0.72rem',
                                          lineHeight: '1.3'
                                        }}
                                      >
                                        <div style={{ fontWeight: 'bold', color: theme.text, marginBottom: '4px', borderBottom: `1px solid ${theme.divider}`, paddingBottom: '2px' }}>{ws.label}</div>
                                        <div style={{ color: theme.subtitle }}><strong>Date:</strong> {stageDetails.date}</div>
                                        <div style={{ color: theme.subtitle }}><strong>Manager:</strong> {stageDetails.manager}</div>
                                        <div style={{ color: theme.subtitle, margin: '2px 0' }}>
                                          <strong>Status:</strong> <span style={{ color: isCurrent ? '#F59E0B' : isCompleted ? '#10B981' : theme.subtitle, fontWeight: 'bold' }}>{stageDetails.status}</span>
                                        </div>
                                        <div style={{ color: theme.subtitle, fontStyle: 'italic', fontSize: '0.68rem', borderTop: `1px dashed ${theme.divider}`, paddingTop: '4px', marginTop: '4px' }}>
                                          {stageDetails.notes}
                                        </div>
                                      </div>
                                    )}

                                    <div 
                                      className={isCurrent ? 'active-node-pulse' : ''}
                                      style={{ 
                                        width: '32px', 
                                        height: '32px', 
                                        borderRadius: '50%', 
                                        backgroundColor: isCurrent ? '#0976BC' : isCompleted ? (darkMode ? '#18181b' : '#ffffff') : (darkMode ? '#18181b' : '#ffffff'), 
                                        border: isCurrent ? '2px solid #ffffff' : `2px solid ${isCompleted ? '#0976BC' : (darkMode ? '#3f3f46' : '#cbd5e1')}`,
                                        boxShadow: isCurrent ? '0 0 14px rgba(9, 118, 188, 0.6)' : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: isCurrent ? '#ffffff' : isCompleted ? '#0976BC' : (darkMode ? '#71717a' : '#94a3b8'),
                                        cursor: 'pointer',
                                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                                      }} 
                                      onMouseEnter={() => setHoveredNode({ orderId: ord.id, stage: ws.stage })}
                                      onMouseLeave={() => setHoveredNode(null)}
                                      onClick={() => {
                                        setOemOrders(prev => prev.map(o => {
                                          if (o.id === ord.id) {
                                            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            logSystemAction(`[${timeStr}] OEM Order Stage Changed | Order ID: ${ord.id} | Stage: ${ws.stage} | By: ${simulatedRole}`);
                                            
                                            setOemToast({
                                              show: true,
                                              title: 'Stage Modified Manually',
                                              desc: `Set status of ${ord.id} to ${ws.stage}`,
                                              id: ord.id
                                            });
                                            
                                            return { ...o, status: ws.stage };
                                          }
                                          return o;
                                        }));
                                      }}
                                    >
                                      {isCompleted && !isCurrent ? (
                                        <Check size={14} strokeWidth={3} className="animate-success-pop" />
                                      ) : (
                                        getWorkflowIcon(ws.icon, 14)
                                      )}
                                    </div>
                                    <span style={{ 
                                      fontSize: '0.68rem', 
                                      marginTop: '8px', 
                                      fontWeight: isCurrent || isCompleted ? 'bold' : 500,
                                      color: isCurrent ? '#0976BC' : isCompleted ? theme.text : theme.subtitle,
                                      textAlign: 'center',
                                      whiteSpace: 'nowrap',
                                      transition: 'color 0.25s ease'
                                    }}>
                                      {ws.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Mobile Timeline Accordion (Media Queries fallback) */}
                          <div className="timeline-mobile-accordion" style={{ display: 'none', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                            {OEM_WORKFLOW_STAGES.map((ws, sIdx) => {
                              const isCompleted = sIdx <= activeStageIndex;
                              const isCurrent = sIdx === activeStageIndex;
                              const stageDetails = getOrderStageDetails(ord, ws.stage);
                              
                              return (
                                <div 
                                  key={sIdx} 
                                  style={{ 
                                    border: theme.border, 
                                    borderRadius: '10px', 
                                    backgroundColor: isCurrent ? theme.accentLight : (isCompleted ? 'rgba(9, 118, 188, 0.02)' : 'transparent'),
                                    padding: '12px',
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <div style={{ 
                                        width: '28px', 
                                        height: '28px', 
                                        borderRadius: '50%', 
                                        backgroundColor: isCurrent ? '#0976BC' : isCompleted ? 'rgba(9, 118, 188, 0.1)' : 'transparent',
                                        border: `2px solid ${isCompleted ? '#0976BC' : (darkMode ? '#3f3f46' : '#cbd5e1')}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: isCurrent ? '#ffffff' : isCompleted ? '#0976BC' : (darkMode ? '#71717a' : '#94a3b8')
                                      }}>
                                        {getWorkflowIcon(ws.icon, 12)}
                                      </div>
                                      <span style={{ fontSize: '0.82rem', fontWeight: isCurrent || isCompleted ? 'bold' : 500, color: isCurrent ? '#0976BC' : theme.text }}>
                                        {ws.label}
                                      </span>
                                    </div>
                                    <span style={{ 
                                      fontSize: '0.7rem', 
                                      fontWeight: 'bold', 
                                      padding: '2px 8px', 
                                      borderRadius: '12px', 
                                      backgroundColor: isCurrent ? 'rgba(9,118,188,0.1)' : isCompleted ? 'rgba(16,185,129,0.1)' : 'rgba(113,113,122,0.1)',
                                      color: isCurrent ? '#0976BC' : isCompleted ? '#10B981' : '#71717a'
                                    }}>
                                      {stageDetails.status}
                                    </span>
                                  </div>
                                  
                                  <div style={{ marginTop: '8px', paddingLeft: '38px', borderTop: `1px dashed ${theme.divider}`, paddingTop: '8px', fontSize: '0.75rem', color: theme.subtitle }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                      <span><strong>Date:</strong> {stageDetails.date}</span>
                                      <span><strong>Manager:</strong> {stageDetails.manager}</span>
                                    </div>
                                    <p style={{ margin: '4px 0 0 0', fontStyle: 'italic' }}>{stageDetails.notes}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Team Avatars Block & Document Center */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr', gap: '20px', borderTop: `1px solid ${theme.divider}`, paddingTop: '16px', flexWrap: 'wrap' }}>
                            {/* Assigned Team */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '0.75rem', color: theme.subtitle, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ERP Assigned Operations Team</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <div title={`Sales Manager: ${ord.assignedTeam?.sales || 'Vignesh Sullia'}`} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#3b82f6', color: '#ffffff', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help', border: `2px solid ${darkMode ? '#1e1e24' : '#ffffff'}` }}>VS</div>
                                  <div title={`Production Manager: ${ord.assignedTeam?.production || 'Anant Kumar'}`} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#8b5cf6', color: '#ffffff', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help', border: `2px solid ${darkMode ? '#1e1e24' : '#ffffff'}`, marginLeft: '-8px' }}>AK</div>
                                  <div title={`QC Manager: ${ord.assignedTeam?.qc || 'Leigh Jenkins'}`} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#10b981', color: '#ffffff', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help', border: `2px solid ${darkMode ? '#1e1e24' : '#ffffff'}`, marginLeft: '-8px' }}>LJ</div>
                                </div>
                                <div style={{ fontSize: '0.78rem', color: theme.subtitle }}>
                                  Sales: <strong>VS</strong> | Prod: <strong>AK</strong> | QC: <strong>LJ</strong>
                                </div>
                              </div>
                            </div>

                            {/* OEM Document Center */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '0.75rem', color: theme.subtitle, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OEM Document Vault & Compliance Center</span>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['Artwork Files', 'Product Specifications', 'Agreements', 'Certificates', 'Purchase Orders'].map((docType) => {
                                  const matchingDoc = ord.documents?.find(d => d.type === docType);
                                  return (
                                    <div key={docType} style={{ position: 'relative' }}>
                                      {matchingDoc ? (
                                        <div 
                                          title={`${docType}: ${matchingDoc.name} (${matchingDoc.size}) uploaded on ${matchingDoc.date}`}
                                          style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '6px', 
                                            padding: '4px 10px', 
                                            borderRadius: '6px', 
                                            backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.08)' : '#ecfdf5', 
                                            border: `1px solid ${darkMode ? 'rgba(16, 185, 129, 0.2)' : '#a7f3d0'}`, 
                                            fontSize: '0.72rem', 
                                            color: '#10B981',
                                            fontWeight: 500,
                                            cursor: 'pointer'
                                          }}
                                        >
                                          <FileText size={12} />
                                          <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{matchingDoc.name}</span>
                                          <X 
                                            size={12} 
                                            style={{ marginLeft: '4px', cursor: 'pointer', color: '#ef4444' }} 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteOemDoc(ord.id, docType);
                                            }} 
                                          />
                                        </div>
                                      ) : (
                                        <div 
                                          onClick={() => handleUploadOemDoc(ord.id, docType)}
                                          title={`Click to mock upload ${docType}`}
                                          style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '4px', 
                                            padding: '4px 10px', 
                                            borderRadius: '6px', 
                                            border: `1px dashed ${darkMode ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1'}`, 
                                            fontSize: '0.72rem', 
                                            color: theme.subtitle,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#0976BC';
                                            e.currentTarget.style.color = '#0976BC';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = darkMode ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1';
                                            e.currentTarget.style.color = theme.subtitle;
                                          }}
                                        >
                                          <Plus size={10} />
                                          <span>{docType.split(' ')[0]}</span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Timeline status details footer */}
                          <div style={{ 
                            backgroundColor: darkMode ? 'rgba(39, 39, 42, 0.4)' : '#f8fafc', 
                            padding: '14px 18px', 
                            borderRadius: '12px', 
                            border: theme.border, 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{ fontSize: '0.82rem', color: theme.subtitle }}>
                              📢 <strong style={{ color: theme.text }}>Log Update:</strong> {ord.comments}
                            </span>
                            {ord.status !== 'Delivered' && (
                              <button 
                                onClick={() => updateOemStage(ord.id, ord.status)}
                                className="btn btn-primary"
                                style={{ 
                                  padding: '8px 16px', 
                                  fontSize: '0.75rem', 
                                  backgroundColor: darkMode ? '#ffffff' : '#09090b', 
                                  color: darkMode ? '#09090b' : '#ffffff', 
                                  border: 'none', 
                                  borderRadius: '8px', 
                                  fontWeight: 'bold', 
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.opacity = '0.9';
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.opacity = '1';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}
                              >
                                Advance to next stage
                              </button>
                            )}
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

                {/* RIGHT COLUMN: MANUFACTURING CAPACITY WIDGET */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${theme.divider}`, paddingBottom: '10px' }}>
                      <Factory size={18} style={{ color: '#0976BC' }} />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: 0, color: theme.text }}>Manufacturing Capacity</h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {/* Circular Gauge */}
                      <div style={{ position: 'relative', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width={64} height={64} style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx={32} cy={32} r={24} fill="transparent" stroke={darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'} strokeWidth={6} />
                          <circle cx={32} cy={32} r={24} fill="transparent" stroke="#0976BC" strokeWidth={6} strokeDasharray={2 * Math.PI * 24} strokeDashoffset={2 * Math.PI * 24 * (1 - 0.84)} strokeLinecap="round" />
                        </svg>
                        <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.8rem', fontWeight: 'bold', color: theme.text }}>84%</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: theme.subtitle }}>Cleanroom Utilization</span>
                        <h5 style={{ margin: '2px 0 0 0', fontSize: '0.85rem', fontWeight: 'bold', color: theme.text }}>Class 100 Atmosphere</h5>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: theme.subtitle, textTransform: 'uppercase' }}>Line Load Allocation</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {productionMetrics.map((pm, idx) => (
                          <div key={idx} style={{ fontSize: '0.72rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                              <span style={{ color: theme.text, fontWeight: 500 }}>{pm.machine.split(' ')[0]} ({pm.product.split(' ')[0]})</span>
                              <span style={{ color: pm.status === 'Maintenance' ? '#EF4444' : theme.text, fontWeight: 'bold' }}>{pm.utilization}%</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div 
                                style={{ 
                                  width: `${pm.utilization}%`, 
                                  height: '100%', 
                                  backgroundColor: pm.status === 'Maintenance' ? '#EF4444' : (pm.utilization > 85 ? '#0976BC' : '#10B981'), 
                                  borderRadius: '3px',
                                  transition: 'width 0.4s ease'
                                }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weekly Forecast Chart */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: `1px solid ${theme.divider}`, paddingTop: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: theme.subtitle, textTransform: 'uppercase' }}>Weekly Volume Forecast</span>
                      <div style={{ width: '100%', height: '110px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { day: 'Mon', qty: 24000 },
                            { day: 'Tue', qty: 32000 },
                            { day: 'Wed', qty: 28000 },
                            { day: 'Thu', qty: 45000 },
                            { day: 'Fri', qty: 38000 },
                            { day: 'Sat', qty: 15000 },
                            { day: 'Sun', qty: 8000 }
                          ]} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                            <XAxis dataKey="day" tick={{ fontSize: 9, fill: theme.subtitle }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 9, fill: theme.subtitle }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="qty" fill="#0976BC" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: B2B ORDERS */}
          {activeTab === 'B2B Orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* B2B STATS RIBBON */}
              <div className="erp-kpi-grid" style={{ marginBottom: 0 }}>
                
                {/* Stat 1: Gross Sales */}
                <div className="b2b-kpi-card spotlight-card" onMouseMove={handleMouseMove}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: 600 }}>Total B2B Revenue</span>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '6px 0 2px 0', color: theme.text }}>₹{formatNumber(b2bStats.total)}</h3>
                      <span style={{ fontSize: '0.72rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 'bold' }}>
                        <TrendingUp size={12} /> +14.8% <span style={{ color: '#a1a1aa', fontWeight: 'normal' }}>vs last month</span>
                      </span>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(9, 118, 188, 0.08)', color: '#0976BC' }}>
                      <DollarSign size={20} />
                    </div>
                  </div>
                </div>

                {/* Stat 2: Outstanding Receivables */}
                <div className="b2b-kpi-card spotlight-card" onMouseMove={handleMouseMove}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: 600 }}>Receivables Ledger</span>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '6px 0 2px 0', color: b2bStats.unpaid > 0 ? '#ef4444' : theme.text }}>
                        ₹{formatNumber(b2bStats.unpaid)}
                      </h3>
                      <span style={{ fontSize: '0.72rem', color: b2bStats.unpaid > 0 ? '#ef4444' : '#22c55e', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <AlertTriangle size={12} /> {b2bStats.unpaid > 0 ? 'Pending Settlement' : 'Clear / Fully Settled'}
                      </span>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: b2bStats.unpaid > 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)', color: b2bStats.unpaid > 0 ? '#ef4444' : '#10b981' }}>
                      <FileText size={20} />
                    </div>
                  </div>
                </div>

                {/* Stat 3: Pending Fulfilment */}
                <div className="b2b-kpi-card spotlight-card" onMouseMove={handleMouseMove}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: 600 }}>Pending Dispatch</span>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '6px 0 2px 0', color: theme.text }}>{b2bStats.pending} Orders</h3>
                      <span style={{ fontSize: '0.72rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 'bold' }}>
                        <Clock size={12} /> In Cleanroom Queue
                      </span>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b' }}>
                      <Clock size={20} />
                    </div>
                  </div>
                </div>

                {/* Stat 4: Active Hospital Accounts */}
                <div className="b2b-kpi-card spotlight-card" onMouseMove={handleMouseMove}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: 600 }}>Active Accounts</span>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '6px 0 2px 0', color: theme.text }}>{b2bStats.clients} Clients</h3>
                      <span style={{ fontSize: '0.72rem', color: '#0976BC', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 'bold' }}>
                        <CheckCircle2 size={12} /> KYC Validated
                      </span>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(9, 118, 188, 0.08)', color: '#0976BC' }}>
                      <Users size={20} />
                    </div>
                  </div>
                </div>

              </div>

              {/* SEARCH & FILTERS TOOLBAR */}
              <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', border: theme.border, overflow: 'visible', position: 'relative', zIndex: 30 }}>
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '8px', minWidth: '240px', border: theme.border, borderRadius: '12px', padding: '6px 12px', backgroundColor: darkMode ? '#18181b' : '#ffffff' }}>
                  <Search size={16} style={{ color: theme.subtitle }} />
                  <input 
                    type="text" 
                    placeholder="Search B2B order ID, client or items..." 
                    value={b2bSearchQuery}
                    onChange={(e) => setB2bSearchQuery(e.target.value)}
                    style={{ background: 'none', border: 'none', width: '100%', fontSize: '0.88rem', color: theme.text, outline: 'none' }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', position: 'relative' }}>
                  
                  {/* Custom Delivery Status Dropdown */}
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <button 
                      onClick={() => {
                        setB2bStatusDropdownOpen(!b2bStatusDropdownOpen);
                        setB2bPaymentDropdownOpen(false);
                      }}
                      className="b2b-filter-select-trigger"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        minWidth: '170px'
                      }}
                    >
                      <span>{b2bFilterStatus === 'All' ? 'All Delivery Statuses' : b2bFilterStatus}</span>
                      <ChevronDown 
                        size={14} 
                        style={{ 
                          transform: b2bStatusDropdownOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease'
                        }} 
                      />
                    </button>
                    {b2bStatusDropdownOpen && (
                      <>
                        <div 
                          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }}
                          onClick={() => setB2bStatusDropdownOpen(false)}
                        />
                        <div 
                          className="b2b-custom-select-dropdown"
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 6px)',
                            left: 0,
                            minWidth: '200px',
                            backgroundColor: darkMode ? '#18181b' : '#ffffff',
                            border: theme.border,
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                            padding: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            zIndex: 999,
                            animation: 'modalSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) both'
                          }}
                        >
                          {[
                            { value: 'All', label: 'All Delivery Statuses' },
                            { value: 'Pending', label: 'Pending' },
                            { value: 'Shipped', label: 'Shipped' },
                            { value: 'Delivered', label: 'Delivered' }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setB2bFilterStatus(opt.value);
                                setB2bStatusDropdownOpen(false);
                              }}
                              className={`b2b-custom-select-option ${b2bFilterStatus === opt.value ? 'b2b-custom-select-option-active' : ''}`}
                              style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: b2bFilterStatus === opt.value ? 'rgba(9, 118, 188, 0.08)' : 'transparent',
                                color: b2bFilterStatus === opt.value ? '#0976BC' : theme.text,
                                fontSize: '0.82rem',
                                fontWeight: b2bFilterStatus === opt.value ? '600' : '500',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                            >
                              {opt.label}
                              {b2bFilterStatus === opt.value && <Check size={12} />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Custom Invoice Settlement Dropdown */}
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <button 
                      onClick={() => {
                        setB2bPaymentDropdownOpen(!b2bPaymentDropdownOpen);
                        setB2bStatusDropdownOpen(false);
                      }}
                      className="b2b-filter-select-trigger"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        minWidth: '150px'
                      }}
                    >
                      <span>{b2bFilterPayment === 'All' ? 'All Invoices' : b2bFilterPayment}</span>
                      <ChevronDown 
                        size={14} 
                        style={{ 
                          transform: b2bPaymentDropdownOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease'
                        }} 
                      />
                    </button>
                    {b2bPaymentDropdownOpen && (
                      <>
                        <div 
                          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }}
                          onClick={() => setB2bPaymentDropdownOpen(false)}
                        />
                        <div 
                          className="b2b-custom-select-dropdown"
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 6px)',
                            left: 0,
                            minWidth: '180px',
                            backgroundColor: darkMode ? '#18181b' : '#ffffff',
                            border: theme.border,
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                            padding: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            zIndex: 999,
                            animation: 'modalSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) both'
                          }}
                        >
                          {[
                            { value: 'All', label: 'All Invoices' },
                            { value: 'Paid', label: 'Paid' },
                            { value: 'Unpaid', label: 'Unpaid' }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setB2bFilterPayment(opt.value);
                                setB2bPaymentDropdownOpen(false);
                              }}
                              className={`b2b-custom-select-option ${b2bFilterPayment === opt.value ? 'b2b-custom-select-option-active' : ''}`}
                              style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: b2bFilterPayment === opt.value ? 'rgba(9, 118, 188, 0.08)' : 'transparent',
                                color: b2bFilterPayment === opt.value ? '#0976BC' : theme.text,
                                fontSize: '0.82rem',
                                fontWeight: b2bFilterPayment === opt.value ? '600' : '500',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                            >
                              {opt.label}
                              {b2bFilterPayment === opt.value && <Check size={12} />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <button 
                    onClick={() => {
                      logSystemAction('Exported bulk B2B ledger report to CSV');
                      alert('Exporting B2B Wholesale Ledger data to CSV...');
                    }}
                    className="b2b-action-btn b2b-action-btn-outline"
                  >
                    <Download size={14} /> Export CSV
                  </button>

                  <button 
                    onClick={() => {
                      setOemToast({
                        show: true,
                        title: 'ERP Sync Initiated',
                        desc: 'Bapuji wholesale orders sync interface active.',
                        id: 'ERP-B2B'
                      });
                      logSystemAction('Triggered manual B2B wholesale ERP synchronization');
                    }}
                    className="b2b-action-btn b2b-action-btn-primary"
                  >
                    <Plus size={14} /> Sync B2B Order
                  </button>
                </div>
              </div>

              {/* REDESIGNED TABLE CARD */}
              <div className="glass-card" style={{ padding: 0, overflow: 'hidden', border: theme.border }}>
                <div style={{ padding: '20px', borderBottom: `1px solid ${theme.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: theme.text }}>Active Ledger Pipeline</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: theme.subtitle }}>Click any transaction row to slide open high-fidelity inventory & shipping logistics profile</p>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: theme.subtitle, fontWeight: '500' }}>
                    Showing {filteredB2bOrders.length} of {b2bOrders.length} records
                  </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${theme.divider}`, color: theme.subtitle, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '16px 20px', fontWeight: '600' }}>Order ID</th>
                        <th style={{ padding: '16px 20px', fontWeight: '600' }}>Wholesale Client</th>
                        <th style={{ padding: '16px 20px', fontWeight: '600' }}>Custom Formulation Wipes</th>
                        <th style={{ padding: '16px 20px', fontWeight: '600', textAlign: 'right' }}>Qty</th>
                        <th style={{ padding: '16px 20px', fontWeight: '600', textAlign: 'right' }}>Grand Total</th>
                        <th style={{ padding: '16px 20px', fontWeight: '600' }}>Fulfilment Track</th>
                        <th style={{ padding: '16px 20px', fontWeight: '600' }}>Invoice Audit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredB2bOrders.map((ord, idx) => (
                        <tr 
                          key={ord.id} 
                          className="b2b-row"
                          onClick={() => {
                            setSelectedB2bOrder(ord);
                            setShowB2bDrawer(true);
                          }}
                          style={{ 
                            borderBottom: `1px solid ${theme.divider}`, 
                            fontSize: '0.88rem',
                            animation: `cardEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) both`,
                            animationDelay: `${idx * 60}ms`
                          }}
                        >
                          <td style={{ padding: '16px 20px', fontWeight: '700', color: '#0976BC' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {ord.id}
                              <ArrowUpRight size={12} style={{ opacity: 0.5 }} />
                            </div>
                          </td>
                          <td style={{ padding: '16px 20px', fontWeight: '600', color: theme.text }}>{ord.businessName}</td>
                          <td style={{ padding: '16px 20px', color: theme.subtitle, fontSize: '0.82rem' }}>{ord.products}</td>
                          <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: '500', color: theme.text }}>{formatNumber(ord.qty)}</td>
                          <td style={{ padding: '16px 20px', fontWeight: '800', color: '#0976BC', textAlign: 'right' }}>₹{formatNumber(ord.amount)}</td>
                          <td style={{ padding: '16px 20px' }}>
                            <span className={`b2b-badge ${
                              ord.status === 'Delivered' ? 'b2b-badge-delivered' : ord.status === 'Shipped' ? 'b2b-badge-shipped' : 'b2b-badge-pending'
                            }`} style={{ display: 'inline-flex', alignItems: 'center' }}>
                              <span style={{ 
                                width: '6px', 
                                height: '6px', 
                                borderRadius: '50%', 
                                display: 'inline-block', 
                                marginRight: '6px',
                                backgroundColor: ord.status === 'Delivered' ? '#10B981' : ord.status === 'Shipped' ? '#3b82f6' : '#f59e0b'
                              }} />
                              {ord.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span className={ord.paymentStatus === 'Paid' ? 'b2b-badge-delivered' : 'b2b-badge-unpaid'} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                                {ord.paymentStatus}
                              </span>
                              {ord.paymentStatus !== 'Paid' && (
                                <button 
                                  onClick={() => {
                                    setB2bOrders(prev => prev.map(o => o.id === ord.id ? { ...o, paymentStatus: 'Paid' } : o));
                                    setOemToast({
                                      show: true,
                                      title: 'Ledger Audit Cleared',
                                      desc: `Payment settled for order ${ord.id}`,
                                      id: ord.id
                                    });
                                    logSystemAction(`Resolved outstanding receivables on B2B order ${ord.id}`);
                                  }}
                                  className="b2b-action-btn b2b-action-btn-primary"
                                  style={{ padding: '4px 8px', fontSize: '0.68rem' }}
                                >
                                  Mark Paid
                                </button>
                              )}
                              <button 
                                onClick={() => downloadOrderInvoice(ord)}
                                style={{ background: 'none', border: 'none', color: theme.subtitle, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                title="Download PDF Ledger"
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* B2B DETAIL DRAWER */}
              {showB2bDrawer && selectedB2bOrder && (
                <>
                  <div 
                    className="oem-drawer-backdrop" 
                    onClick={() => {
                      setShowB2bDrawer(false);
                      setSelectedB2bOrder(null);
                    }}
                  />
                  <div className="oem-drawer" style={{ '--card-bg': darkMode ? '#18181b' : '#ffffff', borderLeft: theme.border }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ padding: '24px', borderBottom: `1px solid ${theme.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.subtitle, fontWeight: 'bold' }}>B2B Wholesale Ledger</span>
                          <span className={selectedB2bOrder.paymentStatus === 'Paid' ? 'b2b-badge-delivered' : 'b2b-badge-unpaid'} style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 'bold' }}>
                            {selectedB2bOrder.paymentStatus}
                          </span>
                        </div>
                        <h2 style={{ margin: '4px 0 0 0', fontSize: '1.3rem', fontWeight: 800, color: theme.text }}>{selectedB2bOrder.id}</h2>
                      </div>
                      <button 
                        onClick={() => {
                          setShowB2bDrawer(false);
                          setSelectedB2bOrder(null);
                        }}
                        style={{ border: 'none', background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.text }}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      {/* TRACKING TIMELINE */}
                      <div style={{ padding: '16px', borderRadius: '12px', background: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: theme.border }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.subtitle }}>Fulfillment Status</h4>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '10px 0' }}>
                          <div style={{ position: 'absolute', top: '7px', left: '0', right: '0', height: '2px', backgroundColor: darkMode ? '#27272a' : '#e4e4e7', zIndex: 1 }} />
                          <div style={{ position: 'absolute', top: '7px', left: '0', width: selectedB2bOrder.status === 'Delivered' ? '100%' : selectedB2bOrder.status === 'Shipped' ? '50%' : '10%', height: '2px', backgroundColor: '#0976BC', zIndex: 2 }} />
                          
                          {['Ordered', 'Shipped', 'Delivered'].map((step, sIdx) => {
                            const isDone = selectedB2bOrder.status === 'Delivered' || 
                              (selectedB2bOrder.status === 'Shipped' && step !== 'Delivered') ||
                              (selectedB2bOrder.status === 'Pending' && step === 'Ordered');
                            return (
                              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                                <div style={{ 
                                  width: '16px', 
                                  height: '16px', 
                                  borderRadius: '50%', 
                                  backgroundColor: isDone ? '#0976BC' : (darkMode ? '#27272a' : '#cbd5e1'),
                                  border: `3px solid ${darkMode ? '#18181b' : '#ffffff'}`,
                                  boxShadow: isDone ? '0 0 6px rgba(9,118,188,0.5)' : 'none'
                                }} />
                                <span style={{ fontSize: '0.68rem', marginTop: '6px', fontWeight: isDone ? 'bold' : 'normal', color: isDone ? theme.text : theme.subtitle }}>{step}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* CLIENT ACCOUNT INFO */}
                      <div>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.subtitle }}>Account Profile</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Company:</span> <strong style={{ color: theme.text }}>{selectedB2bOrder.businessName}</strong></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Contact Person:</span> <span style={{ color: theme.text }}>{selectedB2bOrder.contactPerson}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>GSTIN Registration:</span> <code style={{ color: theme.text, background: darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>{selectedB2bOrder.gstin}</code></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Payment Terms:</span> <span style={{ color: theme.text }}>{selectedB2bOrder.paymentTerms}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Email Address:</span> <span style={{ color: theme.text }}>{selectedB2bOrder.email}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Phone Contact:</span> <span style={{ color: theme.text }}>{selectedB2bOrder.phone}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Invoice Number:</span> <code style={{ color: theme.text, background: darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>{selectedB2bOrder.invoiceNumber || 'Pending sync'}</code></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Email Delivery:</span> <span style={{ color: selectedB2bOrder.emailDeliveryStatus === 'failed' ? '#ef4444' : '#10b981', fontWeight: 800 }}>{selectedB2bOrder.emailDeliveryStatus || 'not_sent'}</span></div>
                          {selectedB2bOrder.emailLogs?.length > 0 && (
                            <div style={{ background: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: theme.border, borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <strong style={{ color: theme.text, fontSize: '0.8rem' }}>Email Delivery Logs</strong>
                              {selectedB2bOrder.emailLogs.slice(-3).map((log, idx) => (
                                <span key={idx} style={{ color: theme.subtitle, fontSize: '0.74rem' }}>{log.type} • {log.status} • {new Date(log.sentAt).toLocaleString()}</span>
                              ))}
                            </div>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                            <span style={{ color: theme.subtitle }}>Shipping Destination:</span>
                            <span style={{ color: theme.text, lineHeight: '1.4', background: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: theme.border }}>{selectedB2bOrder.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* LOGISTICS DETAILS */}
                      <div>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.subtitle }}>Carrier & Shipping</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Logistics Partner:</span> <span style={{ color: theme.text }}>{selectedB2bOrder.carrier}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Airway Bill Number (AWB):</span> <span style={{ color: theme.text, fontFamily: 'monospace', fontWeight: 'bold' }}>{selectedB2bOrder.awb}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Est. Handover Date:</span> <span style={{ color: theme.text }}>{selectedB2bOrder.estDelivery}</span></div>
                        </div>
                      </div>

                      {/* ITEMIZED TRANSACATION SHEET */}
                      <div>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.subtitle }}>Transaction Itemization</h4>
                        <div style={{ borderRadius: '8px', border: theme.border, overflow: 'hidden' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ background: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderBottom: `1px solid ${theme.divider}`, color: theme.subtitle }}>
                                <th style={{ padding: '8px 12px' }}>Product description</th>
                                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Unit Price</th>
                                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Qty</th>
                                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedB2bOrder.items?.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: `1px solid ${theme.divider}`, color: theme.text }}>
                                  <td style={{ padding: '8px 12px', fontWeight: '600' }}>{item.name}</td>
                                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>₹{formatNumber(item.unitPrice)}</td>
                                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>{formatNumber(item.qty)}</td>
                                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: '#0976BC' }}>₹{formatNumber(item.qty * item.unitPrice)}</td>
                                </tr>
                              ))}
                              <tr style={{ fontWeight: 'bold', background: darkMode ? 'rgba(255,255,255,0.02)' : '#fafafa', color: theme.text }}>
                                <td colSpan={3} style={{ padding: '10px 12px' }}>Invoice Total</td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0976BC', fontSize: '0.85rem' }}>₹{formatNumber(selectedB2bOrder.amount)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>

                    <div style={{ padding: '20px 24px', borderTop: `1px solid ${theme.divider}`, display: 'flex', gap: '10px', justifyContent: 'flex-end', backgroundColor: darkMode ? '#141419' : '#fafafa' }}>
                      {selectedB2bOrder.paymentStatus !== 'Paid' && (
                        <button 
                          onClick={() => {
                            setB2bOrders(prev => prev.map(o => o.id === selectedB2bOrder.id ? { ...o, paymentStatus: 'Paid' } : o));
                            setSelectedB2bOrder(prev => ({ ...prev, paymentStatus: 'Paid' }));
                            setOemToast({
                              show: true,
                              title: 'Ledger Audit Cleared',
                              desc: `Payment settled for order ${selectedB2bOrder.id}`,
                              id: selectedB2bOrder.id
                            });
                            logSystemAction(`Resolved outstanding receivables on B2B order ${selectedB2bOrder.id}`);
                          }}
                          className="b2b-action-btn b2b-action-btn-primary"
                        >
                          <Check size={14} /> Resolve Payment
                        </button>
                      )}
                      <button 
                        onClick={() => resendOrderInvoice(selectedB2bOrder)}
                        className="b2b-action-btn b2b-action-btn-outline"
                      >
                        <RefreshCw size={14} /> Re-send Invoice
                      </button>
                      <button 
                        onClick={() => downloadOrderInvoice(selectedB2bOrder)}
                        className="b2b-action-btn b2b-action-btn-outline"
                      >
                        <Download size={14} /> Download Invoice
                      </button>
                    </div>
                  </div>
                </>
              )}

            </div>
          )}

          {/* TAB: B2C ORDERS */}
          {activeTab === 'B2C Orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'cardEntrance 0.35s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
              
              {/* TOP HEADER & QUICK ACTIONS */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: theme.text }}>B2C Retail Ecommerce Orders</h2>
                  <span style={{ fontSize: '0.8rem', color: theme.subtitle }}>Direct customer portal sales & operations control center</span>
                </div>
                
                {/* QUICK ACTIONS */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => {
                      logSystemAction('Triggered new B2C order creation wizard');
                      alert('Launching B2C Order Creation Wizard...');
                    }}
                    className="b2b-action-btn b2b-action-btn-primary"
                  >
                    <Plus size={14} /> Create Order
                  </button>
                  <button 
                    onClick={() => {
                      logSystemAction('Exported B2C orders spreadsheet');
                      alert('Exporting B2C Orders ledger to CSV...');
                    }}
                    className="b2b-action-btn b2b-action-btn-outline"
                  >
                    <FileText size={14} /> Export CSV
                  </button>
                  <button 
                    onClick={() => {
                      logSystemAction('Printed shipment packing slips');
                      alert('Generating PDF packing slips and courier labels...');
                    }}
                    className="b2b-action-btn b2b-action-btn-outline"
                  >
                    <Printer size={14} /> Print Labels
                  </button>
                </div>
              </div>

              {/* 1. KPI SUMMARY ROW */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px' }}>
                
                {/* Card 1: Total Orders */}
                <div className="b2c-glass-card" style={{ padding: '16px', border: theme.border }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.subtitle }}>Total Orders</span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0', color: theme.text }}>{b2cStats.totalOrders}</h3>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '6px', backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: 'bold' }}>+12%</span>
                  </div>
                  <div style={{ height: '30px', marginTop: '10px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{v:10},{v:14},{v:12},{v:19},{v:15},{v:22}]}>
                        <Line type="monotone" dataKey="v" stroke="#0976BC" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 2: Revenue Today */}
                <div className="b2c-glass-card" style={{ padding: '16px', border: theme.border }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.subtitle }}>Revenue Today</span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0', color: theme.text }}>₹{formatNumber(b2cStats.revenueToday || 450)}</h3>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '6px', backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: 'bold' }}>+8%</span>
                  </div>
                  <div style={{ height: '30px', marginTop: '10px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{v:5},{v:12},{v:8},{v:15},{v:10},{v:18}]}>
                        <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 3: Revenue This Month */}
                <div className="b2c-glass-card" style={{ padding: '16px', border: theme.border }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.subtitle }}>Revenue Month</span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0', color: theme.text }}>₹{formatNumber(b2cStats.revenueThisMonth)}</h3>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '6px', backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: 'bold' }}>+18.4%</span>
                  </div>
                  <div style={{ height: '30px', marginTop: '10px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{v:100},{v:120},{v:110},{v:150},{v:130},{v:170}]}>
                        <Line type="monotone" dataKey="v" stroke="#0976BC" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 4: Pending Deliveries */}
                <div className="b2c-glass-card" style={{ padding: '16px', border: theme.border }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.subtitle }}>Pending Dispatch</span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0', color: theme.text }}>{b2cStats.pendingDeliveries}</h3>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '6px', backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontWeight: 'bold' }}>Active AWB</span>
                  </div>
                  <div style={{ height: '30px', marginTop: '10px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{v:3},{v:5},{v:4},{v:2},{v:6},{v:5}]}>
                        <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 5: Returns Requested */}
                <div className="b2c-glass-card" style={{ padding: '16px', border: theme.border }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.subtitle }}>Returns Requested</span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0', color: theme.text }}>{b2cStats.returnsRequested}</h3>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 'bold' }}>Needs Review</span>
                  </div>
                  <div style={{ height: '30px', marginTop: '10px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{v:1},{v:2},{v:1},{v:3},{v:2},{v:1}]}>
                        <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 6: Refund Amount */}
                <div className="b2c-glass-card" style={{ padding: '16px', border: theme.border }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.subtitle }}>Refund Settled</span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0', color: theme.text }}>₹{formatNumber(b2cStats.refundAmount)}</h3>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 'bold' }}>Fully Settled</span>
                  </div>
                  <div style={{ height: '30px', marginTop: '10px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{v:200},{v:400},{v:150},{v:500},{v:300},{v:600}]}>
                        <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* SEARCH & FILTERS TOOLBAR */}
              <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', border: theme.border, overflow: 'visible', position: 'relative', zIndex: 30 }}>
                {/* Search */}
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '8px', minWidth: '240px', border: theme.border, borderRadius: '12px', padding: '6px 12px', backgroundColor: darkMode ? '#18181b' : '#ffffff' }}>
                  <Search size={16} style={{ color: theme.subtitle }} />
                  <input 
                    type="text" 
                    placeholder="Search B2C order ID, buyer name or email..." 
                    value={b2cSearchQuery}
                    onChange={(e) => setB2cSearchQuery(e.target.value)}
                    style={{ background: 'none', border: 'none', width: '100%', fontSize: '0.88rem', color: theme.text, outline: 'none' }}
                  />
                </div>

                {/* Filters Row */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', position: 'relative' }}>
                  
                  {/* Status Dropdown */}
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <button 
                      onClick={() => {
                        setB2cStatusDropdownOpen(!b2cStatusDropdownOpen);
                        setB2cPaymentDropdownOpen(false);
                        setB2cValueDropdownOpen(false);
                      }}
                      className="b2b-filter-select-trigger"
                      style={{ minWidth: '150px' }}
                    >
                      <span>{b2cFilterStatus === 'All' ? 'All Statuses' : b2cFilterStatus}</span>
                      <ChevronDown size={14} style={{ transform: b2cStatusDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                    </button>
                    {b2cStatusDropdownOpen && (
                      <>
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} onClick={() => setB2cStatusDropdownOpen(false)} />
                        <div className="b2b-custom-select-dropdown" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: '180px', backgroundColor: darkMode ? '#18181b' : '#ffffff', border: theme.border, borderRadius: '12px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px', zIndex: 999 }}>
                          {['All', 'Pending', 'Shipped', 'Delivered', 'Returned'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => { setB2cFilterStatus(opt); setB2cStatusDropdownOpen(false); }}
                              className={`b2b-custom-select-option ${b2cFilterStatus === opt ? 'b2b-custom-select-option-active' : ''}`}
                              style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: b2cFilterStatus === opt ? 'rgba(9, 118, 188, 0.08)' : 'transparent', color: b2cFilterStatus === opt ? '#0976BC' : theme.text, fontSize: '0.82rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                              {opt === 'All' ? 'All Statuses' : opt}
                              {b2cFilterStatus === opt && <Check size={12} />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Payment Method Dropdown */}
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <button 
                      onClick={() => {
                        setB2cPaymentDropdownOpen(!b2cPaymentDropdownOpen);
                        setB2cStatusDropdownOpen(false);
                        setB2cValueDropdownOpen(false);
                      }}
                      className="b2b-filter-select-trigger"
                      style={{ minWidth: '160px' }}
                    >
                      <span>{b2cFilterPayment === 'All' ? 'All Payments' : b2cFilterPayment}</span>
                      <ChevronDown size={14} style={{ transform: b2cPaymentDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                    </button>
                    {b2cPaymentDropdownOpen && (
                      <>
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} onClick={() => setB2cPaymentDropdownOpen(false)} />
                        <div className="b2b-custom-select-dropdown" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: '180px', backgroundColor: darkMode ? '#18181b' : '#ffffff', border: theme.border, borderRadius: '12px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px', zIndex: 999 }}>
                          {['All', 'UPI (PhonePe)', 'UPI (GPay)', 'Credit Card', 'Cash on Delivery'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => { setB2cFilterPayment(opt); setB2cPaymentDropdownOpen(false); }}
                              className={`b2b-custom-select-option ${b2cFilterPayment === opt ? 'b2b-custom-select-option-active' : ''}`}
                              style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: b2cFilterPayment === opt ? 'rgba(9, 118, 188, 0.08)' : 'transparent', color: b2cFilterPayment === opt ? '#0976BC' : theme.text, fontSize: '0.82rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                              {opt === 'All' ? 'All Payments' : opt}
                              {b2cFilterPayment === opt && <Check size={12} />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Order Value Dropdown */}
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <button 
                      onClick={() => {
                        setB2cValueDropdownOpen(!b2cValueDropdownOpen);
                        setB2cStatusDropdownOpen(false);
                        setB2cPaymentDropdownOpen(false);
                      }}
                      className="b2b-filter-select-trigger"
                      style={{ minWidth: '150px' }}
                    >
                      <span>{b2cFilterValue === 'All' ? 'All Values' : b2cFilterValue === 'under1000' ? 'Under ₹1,000' : '₹1,000 & Above'}</span>
                      <ChevronDown size={14} style={{ transform: b2cValueDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                    </button>
                    {b2cValueDropdownOpen && (
                      <>
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} onClick={() => setB2cValueDropdownOpen(false)} />
                        <div className="b2b-custom-select-dropdown" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: '180px', backgroundColor: darkMode ? '#18181b' : '#ffffff', border: theme.border, borderRadius: '12px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px', zIndex: 999 }}>
                          {[
                            { value: 'All', label: 'All Values' },
                            { value: 'under1000', label: 'Under ₹1,000' },
                            { value: 'over1000', label: '₹1,000 & Above' }
                          ].map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => { setB2cFilterValue(opt.value); setB2cValueDropdownOpen(false); }}
                              className={`b2b-custom-select-option ${b2cFilterValue === opt.value ? 'b2b-custom-select-option-active' : ''}`}
                              style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: b2cFilterValue === opt.value ? 'rgba(9, 118, 188, 0.08)' : 'transparent', color: b2cFilterValue === opt.value ? '#0976BC' : theme.text, fontSize: '0.82rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                              {opt.label}
                              {b2cFilterValue === opt.value && <Check size={12} />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                </div>

                {/* Grid vs Table View Mode Switcher */}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', border: theme.border, borderRadius: '10px', padding: '4px', backgroundColor: darkMode ? '#141419' : '#f1f5f9' }}>
                  <button 
                    onClick={() => setB2cViewMode('table')}
                    style={{ border: 'none', background: b2cViewMode === 'table' ? (darkMode ? '#27272a' : '#ffffff') : 'none', color: b2cViewMode === 'table' ? '#0976BC' : theme.subtitle, padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <List size={14} /> Table
                  </button>
                  <button 
                    onClick={() => setB2cViewMode('card')}
                    style={{ border: 'none', background: b2cViewMode === 'card' ? (darkMode ? '#27272a' : '#ffffff') : 'none', color: b2cViewMode === 'card' ? '#0976BC' : theme.subtitle, padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Grid size={14} /> Card
                  </button>
                </div>

              </div>

              {/* MAIN DATA VIEW CONTAINER */}
              {b2cViewMode === 'table' ? (
                /* TABLE VIEW */
                <div className="erp-card" style={{ padding: 0, overflowX: 'auto', border: theme.border }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${theme.divider}`, color: theme.subtitle, fontSize: '0.82rem', background: darkMode ? 'rgba(255,255,255,0.01)' : '#fcfcfc' }}>
                        <th style={{ padding: '16px' }}>Order ID</th>
                        <th style={{ padding: '16px' }}>Buyer Name</th>
                        <th style={{ padding: '16px' }}>Format Product</th>
                        <th style={{ padding: '16px' }}>Order Val</th>
                        <th style={{ padding: '16px' }}>Delivery Address</th>
                        <th style={{ padding: '16px' }}>Fulfillment Status</th>
                        <th style={{ padding: '16px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredB2cOrders.map((ord) => (
                        <tr 
                          key={ord.id} 
                          className="b2b-row" 
                          onClick={() => { setSelectedB2cOrder(ord); setShowB2cDrawer(true); }}
                          style={{ borderBottom: `1px solid ${theme.divider}`, fontSize: '0.88rem', transition: 'all 0.2s ease', cursor: 'pointer' }}
                        >
                          
                          {/* Order ID Link */}
                          <td style={{ padding: '16px' }}>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedB2cOrder(ord); setShowB2cDrawer(true); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 'bold', color: '#0976BC', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              {ord.id} <ExternalLink size={12} />
                            </button>
                          </td>

                          {/* Customer Name Link */}
                          <td style={{ padding: '16px' }} onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => { setSelectedB2cCustomer(ord); setShowB2cCustomerDrawer(true); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: '600', color: theme.text }}
                            >
                              {ord.customerName}
                            </button>
                          </td>

                          <td style={{ padding: '16px', color: theme.subtitle }}>{ord.product} (x{ord.qty})</td>
                          
                          <td style={{ padding: '16px', fontWeight: 'bold', color: theme.text }}>₹{ord.value}</td>
                          
                          <td style={{ padding: '16px', fontSize: '0.78rem', color: theme.subtitle }}>{ord.address}</td>
                          
                          {/* Status Badge */}
                          <td style={{ padding: '16px' }}>
                            <span style={{ 
                              fontSize: '0.72rem', 
                              padding: '4px 10px', 
                              borderRadius: '20px', 
                              fontWeight: 'bold',
                              backgroundColor: ord.status === 'Delivered' ? 'rgba(34,197,94,0.1)' : ord.status === 'Shipped' ? 'rgba(59,130,246,0.1)' : ord.status === 'Returned' ? 'rgba(113,113,122,0.1)' : 'rgba(245,158,11,0.1)',
                              color: ord.status === 'Delivered' ? '#22c55e' : ord.status === 'Shipped' ? '#3b82f6' : ord.status === 'Returned' ? '#71717a' : '#f59e0b',
                              border: `1px solid ${ord.status === 'Delivered' ? 'rgba(34,197,94,0.2)' : ord.status === 'Shipped' ? 'rgba(59,130,246,0.2)' : ord.status === 'Returned' ? 'rgba(113,113,122,0.2)' : 'rgba(245,158,11,0.2)'}`,
                              animation: ord.status === 'Pending' ? 'orderPulse 1.8s infinite' : 'none'
                            }}>
                              {ord.status}
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td style={{ padding: '16px' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              {ord.status === 'Pending' && (
                                <button 
                                  onClick={() => shipB2cOrder(ord.id, 'DTDC-' + Math.floor(1000000 + Math.random() * 9000000))}
                                  className="b2b-action-btn b2b-action-btn-primary"
                                  style={{ padding: '5px 12px', fontSize: '0.72rem', height: 'auto' }}
                                >
                                  Ship Order
                                </button>
                              )}
                              {ord.status === 'Delivered' && (
                                <button 
                                  onClick={() => refundB2cOrder(ord.id)}
                                  className="b2b-action-btn b2b-action-btn-outline"
                                  style={{ padding: '5px 12px', fontSize: '0.72rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)', height: 'auto' }}
                                >
                                  Refund
                                </button>
                              )}
                              {ord.tracking ? (
                                <button
                                  onClick={() => { setSelectedB2cTracking(ord); setShowB2cTrackingDrawer(true); }}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.72rem', color: theme.subtitle, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <Truck size={12} /> {ord.tracking}
                                </button>
                              ) : (
                                ord.status !== 'Pending' && <span style={{ fontSize: '0.72rem', color: theme.subtitle }}>No Tracking</span>
                              )}
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* CARD VIEW (TABLETS / RESPONSIVE) */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                  {filteredB2cOrders.map((ord) => (
                    <div key={ord.id} className="b2c-glass-card" style={{ padding: '20px', border: theme.border, display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
                      
                      {/* Card Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {/* Avatar */}
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(9, 118, 188, 0.08)', color: '#0976BC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            {ord.customerName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <button 
                              onClick={() => { setSelectedB2cCustomer(ord); setShowB2cCustomerDrawer(true); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 'bold', color: theme.text, fontSize: '0.9rem', textAlign: 'left' }}
                            >
                              {ord.customerName}
                            </button>
                            <div style={{ fontSize: '0.75rem', color: theme.subtitle }}>{ord.id}</div>
                          </div>
                        </div>

                        <span style={{ 
                          fontSize: '0.72rem', 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontWeight: 'bold',
                          backgroundColor: ord.status === 'Delivered' ? 'rgba(34,197,94,0.1)' : ord.status === 'Shipped' ? 'rgba(59,130,246,0.1)' : ord.status === 'Returned' ? 'rgba(113,113,122,0.1)' : 'rgba(245,158,11,0.1)',
                          color: ord.status === 'Delivered' ? '#22c55e' : ord.status === 'Shipped' ? '#3b82f6' : ord.status === 'Returned' ? '#71717a' : '#f59e0b',
                          border: `1px solid ${ord.status === 'Delivered' ? 'rgba(34,197,94,0.2)' : ord.status === 'Shipped' ? 'rgba(59,130,246,0.2)' : ord.status === 'Returned' ? 'rgba(113,113,122,0.2)' : 'rgba(245,158,11,0.2)'}`
                        }}>
                          {ord.status}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div><strong style={{ color: theme.text }}>Product:</strong> <span style={{ color: theme.subtitle }}>{ord.product} (x{ord.qty})</span></div>
                        <div><strong style={{ color: theme.text }}>Value:</strong> <span style={{ color: '#0976BC', fontWeight: 'bold' }}>₹{ord.value}</span></div>
                        <div><strong style={{ color: theme.text }}>Address:</strong> <span style={{ color: theme.subtitle, fontSize: '0.78rem' }}>{ord.address}</span></div>
                        {ord.tracking && (
                          <div>
                            <strong style={{ color: theme.text }}>Tracking:</strong>{' '}
                            <button
                              onClick={() => { setSelectedB2cTracking(ord); setShowB2cTrackingDrawer(true); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.82rem', color: '#0976BC', fontWeight: '600', textDecoration: 'underline' }}
                            >
                              {ord.tracking}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card Actions Footer */}
                      <div style={{ borderTop: `1px solid ${theme.divider}`, paddingTop: '12px', display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: 'auto' }}>
                        <button
                          onClick={() => { setSelectedB2cOrder(ord); setShowB2cDrawer(true); }}
                          className="b2b-action-btn b2b-action-btn-outline"
                          style={{ padding: '5px 12px', fontSize: '0.72rem', height: 'auto' }}
                        >
                          View Details
                        </button>
                        
                        {ord.status === 'Pending' && (
                          <button 
                            onClick={() => shipB2cOrder(ord.id, 'DTDC-' + Math.floor(1000000 + Math.random() * 9000000))}
                            className="b2b-action-btn b2b-action-btn-primary"
                            style={{ padding: '5px 12px', fontSize: '0.72rem', height: 'auto' }}
                          >
                            Ship Order
                          </button>
                        )}
                        {ord.status === 'Delivered' && (
                          <button 
                            onClick={() => refundB2cOrder(ord.id)}
                            className="b2b-action-btn b2b-action-btn-outline"
                            style={{ padding: '5px 12px', fontSize: '0.72rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)', height: 'auto' }}
                          >
                            Refund
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}

              {/* REVENUE ANALYTICS & ACTIVITY FEED DUAL WIDGET PANEL */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginTop: '12px' }}>
                
                {/* Analytics Spark Chart Panel */}
                <div className="glass-card" style={{ padding: '20px', border: theme.border }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 700, color: theme.text }}>Operational Volume Trends</h4>
                  <div style={{ height: '160px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: '1 Jun', Orders: 5, Revenue: 2100 },
                        { name: '2 Jun', Orders: 8, Revenue: 3400 },
                        { name: '3 Jun', Orders: 12, Revenue: 5100 },
                        { name: '4 Jun', Orders: 7, Revenue: 2800 },
                        { name: '5 Jun', Orders: 14, Revenue: 6200 }
                      ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorB2cRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0976BC" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#0976BC" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke={theme.subtitle} style={{ fontSize: '0.72rem' }} />
                        <YAxis stroke={theme.subtitle} style={{ fontSize: '0.72rem' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="Revenue" stroke="#0976BC" strokeWidth={2} fillOpacity={1} fill="url(#colorB2cRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Live Activity Feed */}
                <div className="glass-card" style={{ padding: '20px', border: theme.border }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: theme.text }}>B2C Live Activity Feed</h4>
                    <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '20px', backgroundColor: 'rgba(9, 118, 188, 0.08)', color: '#0976BC', fontWeight: 600 }}>Real-time</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {b2cActivityFeed.map(feed => (
                      <div key={feed.id} style={{ display: 'flex', alignItems: 'start', gap: '10px', fontSize: '0.82rem' }}>
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          backgroundColor: feed.type === 'ship' ? '#3b82f6' : feed.type === 'refund' ? '#ef4444' : '#22c55e', 
                          marginTop: '5px',
                          boxShadow: `0 0 6px ${feed.type === 'ship' ? '#3b82f6' : feed.type === 'refund' ? '#ef4444' : '#22c55e'}`
                        }} />
                        <div style={{ flex: 1 }}>
                          <span style={{ color: theme.text, fontWeight: '500' }}>{feed.text}</span>
                          <div style={{ fontSize: '0.7rem', color: theme.subtitle }}>{feed.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* B2C Retail Order Details Drawer */}
          {showB2cDrawer && selectedB2cOrder && (
            <>
              <div 
                className="oem-drawer-backdrop" 
                onClick={() => setShowB2cDrawer(false)}
              />
              <div 
                className="oem-drawer" 
                style={{ 
                  width: '460px', 
                  '--card-bg': darkMode ? '#18181b' : '#ffffff', 
                  borderLeft: theme.border 
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div style={{ padding: '24px', borderBottom: `1px solid ${theme.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: theme.text }}>{selectedB2cOrder.id}</h3>
                      <span style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        backgroundColor: selectedB2cOrder.status === 'Delivered' ? '#dcfce7' : selectedB2cOrder.status === 'Shipped' ? '#e0f2fe' : selectedB2cOrder.status === 'Returned' ? '#f3f4f6' : '#fef9c3',
                        color: selectedB2cOrder.status === 'Delivered' ? '#16a34a' : selectedB2cOrder.status === 'Shipped' ? '#0369a1' : selectedB2cOrder.status === 'Returned' ? '#52525b' : '#ca8a04'
                      }}>
                        {selectedB2cOrder.status}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: theme.subtitle }}>B2C Direct Portal Sale</span>
                  </div>
                  <button 
                    onClick={() => setShowB2cDrawer(false)}
                    style={{ border: 'none', background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.text }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* 1. Fulfillment Timeline */}
                  <div style={{ padding: '16px', borderRadius: '12px', background: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: theme.border }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.subtitle }}>Order Timeline</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '10px 0' }}>
                      <div style={{ position: 'absolute', top: '7px', left: '0', right: '0', height: '2px', backgroundColor: darkMode ? '#27272a' : '#e4e4e7', zIndex: 1 }} />
                      <div style={{ position: 'absolute', top: '7px', left: '0', width: selectedB2cOrder.status === 'Delivered' ? '100%' : selectedB2cOrder.status === 'Shipped' ? '60%' : '20%', height: '2px', backgroundColor: '#0976BC', zIndex: 2 }} />
                      
                      {[
                        { label: 'Placed', icon: ShoppingCart },
                        { label: 'Paid', icon: CreditCard },
                        { label: 'Shipped', icon: Truck },
                        { label: 'Delivered', icon: CheckCircle }
                      ].map((step, sIdx) => {
                        const isDone = selectedB2cOrder.status === 'Delivered' || 
                          (selectedB2cOrder.status === 'Shipped' && step.label !== 'Delivered') ||
                          (selectedB2cOrder.status === 'Pending' && (step.label === 'Placed' || step.label === 'Paid'));
                        const IconComp = step.icon;
                        return (
                          <div key={step.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                            <div style={{ 
                              width: '24px', 
                              height: '24px', 
                              borderRadius: '50%', 
                              backgroundColor: isDone ? '#0976BC' : (darkMode ? '#27272a' : '#cbd5e1'),
                              border: `3px solid ${darkMode ? '#18181b' : '#ffffff'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              boxShadow: isDone ? '0 0 8px rgba(9,118,188,0.5)' : 'none',
                              animation: (isDone && selectedB2cOrder.status !== 'Delivered' && sIdx === 2) ? 'shipmentGlow 2s infinite' : 'none'
                            }}>
                              <IconComp size={10} />
                            </div>
                            <span style={{ fontSize: '0.65rem', marginTop: '6px', fontWeight: isDone ? 'bold' : 'normal', color: isDone ? theme.text : theme.subtitle }}>{step.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Customer Profile details link */}
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.subtitle }}>Buyer Profile</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: theme.subtitle }}>Name:</span> 
                        <button 
                          onClick={() => { setSelectedB2cCustomer(selectedB2cOrder); setShowB2cCustomerDrawer(true); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 'bold', color: '#0976BC', textDecoration: 'underline' }}
                        >
                          {selectedB2cOrder.customerName}
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Email:</span> <span style={{ color: theme.text }}>{selectedB2cOrder.email}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Phone:</span> <span style={{ color: theme.text }}>{selectedB2cOrder.phone}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Order Date:</span> <span style={{ color: theme.text }}>{selectedB2cOrder.date}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Invoice:</span> <code style={{ color: theme.text, background: darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>{selectedB2cOrder.invoiceNumber || 'Pending sync'}</code></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Email Delivery:</span> <span style={{ color: selectedB2cOrder.emailDeliveryStatus === 'failed' ? '#ef4444' : '#10b981', fontWeight: 800 }}>{selectedB2cOrder.emailDeliveryStatus || 'not_sent'}</span></div>
                      {selectedB2cOrder.emailLogs?.length > 0 && (
                        <div style={{ background: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: theme.border, borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <strong style={{ color: theme.text, fontSize: '0.8rem' }}>Email Delivery Logs</strong>
                          {selectedB2cOrder.emailLogs.slice(-3).map((log, idx) => (
                            <span key={idx} style={{ color: theme.subtitle, fontSize: '0.74rem' }}>{log.type} • {log.status} • {new Date(log.sentAt).toLocaleString()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. Shipping Destination */}
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.subtitle }}>Shipping Destination</h4>
                    <span style={{ display: 'block', color: theme.text, fontSize: '0.82rem', lineHeight: '1.4', background: darkMode ? 'rgba(255,255,255,0.02)' : '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: theme.border }}>
                      {selectedB2cOrder.address}
                    </span>
                  </div>

                  {/* 4. Transaction Itemization Invoice */}
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.subtitle }}>Transaction Itemization</h4>
                    <div style={{ borderRadius: '8px', border: theme.border, overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderBottom: `1px solid ${theme.divider}`, color: theme.subtitle }}>
                            <th style={{ padding: '8px 12px' }}>Product description</th>
                            <th style={{ padding: '8px 12px', textAlign: 'right' }}>Unit Price</th>
                            <th style={{ padding: '8px 12px', textAlign: 'right' }}>Qty</th>
                            <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedB2cOrder.items?.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: `1px solid ${theme.divider}`, color: theme.text }}>
                              <td style={{ padding: '8px 12px', fontWeight: '600' }}>{item.name}</td>
                              <td style={{ padding: '8px 12px', textAlign: 'right' }}>₹{formatNumber(item.unitPrice)}</td>
                              <td style={{ padding: '8px 12px', textAlign: 'right' }}>{formatNumber(item.qty)}</td>
                              <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: '#0976BC' }}>₹{formatNumber(item.qty * item.unitPrice)}</td>
                            </tr>
                          ))}
                          <tr style={{ fontWeight: 'bold', background: darkMode ? 'rgba(255,255,255,0.02)' : '#fafafa', color: theme.text }}>
                            <td colSpan={3} style={{ padding: '10px 12px' }}>Invoice Total</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0976BC', fontSize: '0.85rem' }}>₹{formatNumber(selectedB2cOrder.value)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 5. Payment details */}
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.subtitle }}>Payment Summary</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Payment Gateway:</span> <span style={{ color: theme.text }}>Razorpay Secure</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Method:</span> <span style={{ color: theme.text }}>{selectedB2cOrder.paymentMethod}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#22c55e', fontWeight: 'bold' }}>Success / Settled</span></div>
                    </div>
                  </div>

                  {/* 6. Refund Center block */}
                  {selectedB2cOrder.refundStatus !== 'None' && (
                    <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                      <h5 style={{ margin: '0 0 8px 0', color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold' }}>Returns & Refund Ledger</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Refund Status:</span> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{selectedB2cOrder.refundStatus}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Refund Flow:</span> <span style={{ color: theme.text }}>Refund Requested ➔ Approved ➔ Processed</span></div>
                      </div>
                    </div>
                  )}

                  {/* 7. Internal Notes */}
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.subtitle }}>Internal Notes</h4>
                    <textarea 
                      value={selectedB2cOrder.notes}
                      onChange={(e) => {
                        const val = e.target.value;
                        setB2cOrders(prev => prev.map(o => o.id === selectedB2cOrder.id ? { ...o, notes: val } : o));
                        setSelectedB2cOrder(prev => ({ ...prev, notes: val }));
                      }}
                      style={{ width: '100%', minHeight: '60px', padding: '8px 12px', fontSize: '0.8rem', border: theme.border, borderRadius: '8px', background: darkMode ? '#18181b' : '#ffffff', color: theme.text, outline: 'none' }}
                    />
                  </div>

                </div>

                {/* Footer Actions */}
                <div style={{ padding: '20px 24px', borderTop: `1px solid ${theme.divider}`, display: 'flex', gap: '10px', justifyContent: 'flex-end', backgroundColor: darkMode ? '#141419' : '#fafafa' }}>
                  {selectedB2cOrder.status === 'Pending' && (
                    <button
                      onClick={() => {
                        const awb = 'DTDC-' + Math.floor(1000000 + Math.random() * 9000000);
                        shipB2cOrder(selectedB2cOrder.id, awb);
                        setSelectedB2cOrder(prev => ({ ...prev, status: 'Shipped', tracking: awb }));
                      }}
                      className="b2b-action-btn b2b-action-btn-primary"
                    >
                      Ship Order
                    </button>
                  )}
                  {selectedB2cOrder.status === 'Delivered' && (
                    <button
                      onClick={() => {
                        refundB2cOrder(selectedB2cOrder.id);
                        setSelectedB2cOrder(prev => ({ ...prev, status: 'Returned', refundStatus: 'Completed' }));
                      }}
                      className="b2b-action-btn b2b-action-btn-outline"
                      style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                    >
                      Refund Order
                    </button>
                  )}
                  <button
                    onClick={() => resendOrderInvoice(selectedB2cOrder)}
                    className="b2b-action-btn b2b-action-btn-outline"
                  >
                    <RefreshCw size={14} /> Re-send Invoice
                  </button>
                  <button
                    onClick={() => downloadOrderInvoice(selectedB2cOrder)}
                    className="b2b-action-btn b2b-action-btn-outline"
                  >
                    <Download size={14} /> Download Invoice
                  </button>
                </div>
              </div>
            </>
          )}

          {/* B2C Customer Detail Drawer */}
          {showB2cCustomerDrawer && selectedB2cCustomer && (
            <>
              <div 
                className="oem-drawer-backdrop" 
                onClick={() => setShowB2cCustomerDrawer(false)}
              />
              <div 
                className="oem-drawer" 
                style={{ 
                  width: '440px', 
                  '--card-bg': darkMode ? '#18181b' : '#ffffff', 
                  borderLeft: theme.border 
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div style={{ padding: '24px', borderBottom: `1px solid ${theme.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: theme.text }}>Customer Drawer</h3>
                    <span style={{ fontSize: '0.8rem', color: theme.subtitle }}>Buyer account parameters</span>
                  </div>
                  <button 
                    onClick={() => setShowB2cCustomerDrawer(false)}
                    style={{ border: 'none', background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.text }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Profile Card */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(9, 118, 188, 0.08)', color: '#0976BC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.4rem' }}>
                      {selectedB2cCustomer.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: theme.text }}>{selectedB2cCustomer.customerName}</h4>
                      <span style={{ fontSize: '0.78rem', color: theme.subtitle }}>Direct Customer</span>
                    </div>
                  </div>

                  {/* Customer Metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ padding: '12px', borderRadius: '8px', border: theme.border, background: darkMode ? 'rgba(255,255,255,0.01)' : '#fafafa' }}>
                      <div style={{ fontSize: '0.7rem', color: theme.subtitle }}>LIFETIME SPEND</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: theme.text }}>₹4,850</div>
                    </div>
                    <div style={{ padding: '12px', borderRadius: '8px', border: theme.border, background: darkMode ? 'rgba(255,255,255,0.01)' : '#fafafa' }}>
                      <div style={{ fontSize: '0.7rem', color: theme.subtitle }}>AVG ORDER VALUE</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: theme.text }}>₹970</div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.subtitle }}>Contact Parameters</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Email:</span> <span style={{ color: theme.text }}>{selectedB2cCustomer.email}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Phone:</span> <span style={{ color: theme.text }}>{selectedB2cCustomer.phone}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Location:</span> <span style={{ color: theme.text }}>{selectedB2cCustomer.country || 'India'}</span></div>
                    </div>
                  </div>

                  {/* Recent activity Lists */}
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.subtitle }}>Recent Activity</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                      <div style={{ padding: '10px', borderRadius: '8px', border: theme.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>Order {selectedB2cCustomer.id}</strong>
                          <div style={{ fontSize: '0.72rem', color: theme.subtitle }}>Placed on {selectedB2cCustomer.date}</div>
                        </div>
                        <span style={{ fontWeight: 'bold', color: theme.text }}>₹{selectedB2cCustomer.value}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}

          {/* B2C Shipment Tracking Drawer */}
          {showB2cTrackingDrawer && selectedB2cTracking && (
            <>
              <div 
                className="oem-drawer-backdrop" 
                onClick={() => setShowB2cTrackingDrawer(false)}
              />
              <div 
                className="oem-drawer" 
                style={{ 
                  width: '420px', 
                  '--card-bg': darkMode ? '#18181b' : '#ffffff', 
                  borderLeft: theme.border 
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div style={{ padding: '24px', borderBottom: `1px solid ${theme.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: theme.text }}>Courier Airway Bill</h3>
                    <span style={{ fontSize: '0.8rem', color: theme.subtitle }}>Shipment Details & Tracking</span>
                  </div>
                  <button 
                    onClick={() => setShowB2cTrackingDrawer(false)}
                    style={{ border: 'none', background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.text }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Info block */}
                  <div style={{ padding: '16px', borderRadius: '12px', border: theme.border, background: darkMode ? 'rgba(255,255,255,0.01)' : '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: theme.subtitle }}>Carrier:</span> <strong style={{ color: theme.text }}>DTDC Express</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: theme.subtitle }}>Tracking ID:</span> <code style={{ color: '#0976BC', fontWeight: 'bold' }}>{selectedB2cTracking.tracking}</code></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: theme.subtitle }}>Est. Handover:</span> <span style={{ color: theme.text }}>{selectedB2cTracking.date}</span></div>
                  </div>

                  {/* Courier Milestones Timeline */}
                  <div>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.subtitle }}>Courier Route Scan</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '24px' }}>
                      {/* Vertical line connector */}
                      <div style={{ position: 'absolute', top: '4px', left: '7px', bottom: '4px', width: '2px', backgroundColor: darkMode ? '#27272a' : '#cbd5e1', zIndex: 1 }} />
                      
                      {[
                        { title: 'Delivered', desc: 'Package dropped off at buyer destination door.', time: '2026-06-04 14:22', done: selectedB2cTracking.status === 'Delivered' },
                        { title: 'Out For Delivery', desc: 'Dispatched with regional courier runner.', time: '2026-06-04 09:15', done: selectedB2cTracking.status === 'Delivered' },
                        { title: 'In Transit', desc: 'Arrived at sorting facility Bangalore Hub.', time: '2026-06-03 18:40', done: selectedB2cTracking.status === 'Delivered' || selectedB2cTracking.status === 'Shipped' },
                        { title: 'Picked Up', desc: 'Handed over from Compounding Warehouse.', time: '2026-06-03 11:20', done: true }
                      ].map((step, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                          {/* Dot */}
                          <div style={{ 
                            position: 'absolute', 
                            top: '4px', 
                            left: '-21px', 
                            width: '12px', 
                            height: '12px', 
                            borderRadius: '50%', 
                            backgroundColor: step.done ? '#0976BC' : (darkMode ? '#1c1917' : '#e2e8f0'),
                            border: `2px solid ${darkMode ? '#18181b' : '#ffffff'}`,
                            zIndex: 2,
                            boxShadow: step.done ? '0 0 6px rgba(9,118,188,0.4)' : 'none'
                          }} />
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: step.done ? theme.text : theme.subtitle }}>{step.title}</div>
                            <div style={{ fontSize: '0.72rem', color: theme.subtitle, marginTop: '2px' }}>{step.desc}</div>
                            <div style={{ fontSize: '0.65rem', color: theme.subtitle, marginTop: '4px' }}>{step.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              </div>
            </>
          )}

          {/* TAB: QUOTATIONS */}
          {activeTab === 'Quotations' && (() => {
            const quoteDraftsCount = quotations.filter(q => q.status === 'Draft').length;
            const quoteSentCount = quotations.filter(q => q.status === 'Sent').length;
            const quoteAcceptedCount = quotations.filter(q => q.status === 'Accepted').length;
            const quoteTotalProjectedVal = quotations.reduce((sum, q) => sum + (q.moq * q.price), 0);
            const quoteAvgMOQ = quotations.length ? Math.round(quotations.reduce((sum, q) => sum + q.moq, 0) / quotations.length) : 0;

            const filteredQuotations = quotations.filter(q => {
              const matchesSearch = q.id.toLowerCase().includes(quoteSearchQuery.toLowerCase()) ||
                                    q.customer.toLowerCase().includes(quoteSearchQuery.toLowerCase()) ||
                                    q.product.toLowerCase().includes(quoteSearchQuery.toLowerCase());
              const matchesStatus = quoteFilterStatus === 'All' || q.status === quoteFilterStatus;
              return matchesSearch && matchesStatus;
            });

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <style>{`
                  @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                  }
                  @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                  .quote-card-item:hover {
                    transform: translateY(-2px) scale(1.005);
                    border-color: #0976BC !important;
                    box-shadow: 0 12px 24px -10px rgba(9, 118, 188, 0.15) !important;
                  }
                  .quote-stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px -8px rgba(0,0,0,0.08) !important;
                  }
                `}</style>

                {/* Header Title & Action */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: theme.text }}>OEM Customized Quotations Ledger</h2>
                    <span style={{ fontSize: '0.8rem', color: theme.subtitle }}>Draft and send customized price matrix blueprints</span>
                  </div>
                  <button 
                    onClick={() => setShowNewQuoteModal(true)}
                    className="btn btn-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(9, 118, 188, 0.25)', transition: 'all 0.2s ease' }}
                  >
                    <Plus size={16} /> New Quotation Draft
                  </button>
                </div>

                {/* Modern KPI Stats Ribbon */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {/* Card 1: Total Projected Value */}
                  <div className="glass-card quote-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default', transition: 'all 0.3s ease', border: theme.border, backgroundColor: theme.cardBg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: 600 }}>Projected Value</span>
                      <TrendingUp size={14} style={{ color: '#22c55e' }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                      ₹{formatNumber(quoteTotalProjectedVal)}
                    </h3>
                    <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>Across all pipeline stages</span>
                  </div>

                  {/* Card 2: Accepted Quotes */}
                  <div className="glass-card quote-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default', transition: 'all 0.3s ease', border: theme.border, backgroundColor: theme.cardBg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: 600 }}>Accepted Blueprints</span>
                      <CheckCircle2 size={14} style={{ color: '#22c55e' }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                      {quoteAcceptedCount}
                    </h3>
                    <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>Converted to active orders</span>
                  </div>

                  {/* Card 3: Pending Negotiations */}
                  <div className="glass-card quote-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default', transition: 'all 0.3s ease', border: theme.border, backgroundColor: theme.cardBg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: 600 }}>Sent (Pending)</span>
                      <Clock size={14} style={{ color: '#0976BC' }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                      {quoteSentCount}
                    </h3>
                    <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>Awaiting client feedback</span>
                  </div>

                  {/* Card 4: Average MOQ Target */}
                  <div className="glass-card quote-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default', transition: 'all 0.3s ease', border: theme.border, backgroundColor: theme.cardBg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: 600 }}>Average MOQ</span>
                      <Percent size={14} style={{ color: '#8b5cf6' }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                      {formatNumber(quoteAvgMOQ)}
                    </h3>
                    <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>Units per formulation draft</span>
                  </div>
                </div>

                {/* Filter and Search Toolbar */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  backgroundColor: theme.cardBg, 
                  border: theme.border, 
                  borderRadius: '12px', 
                  padding: '12px 16px', 
                  gap: '16px', 
                  flexWrap: 'wrap' 
                }}>
                  {/* Search bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px', position: 'relative' }}>
                    <Search size={16} style={{ color: theme.subtitle, position: 'absolute', left: '12px' }} />
                    <input 
                      type="text" 
                      placeholder="Search quote ID, customer, formulation..." 
                      value={quoteSearchQuery}
                      onChange={(e) => setQuoteSearchQuery(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '10px 14px 10px 36px', 
                        fontSize: '0.85rem', 
                        borderRadius: '8px', 
                        border: theme.border, 
                        backgroundColor: theme.itemBg, 
                        color: theme.text,
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  </div>

                  {/* Status Filter Tabs */}
                  <div style={{ display: 'flex', backgroundColor: darkMode ? '#18181b' : '#f1f5f9', padding: '2px', borderRadius: '8px', border: theme.border }}>
                    {['All', 'Draft', 'Sent', 'Accepted', 'Expired'].map((status) => {
                      const isActive = quoteFilterStatus === status;
                      return (
                        <button
                          key={status}
                          onClick={() => setQuoteFilterStatus(status)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: isActive ? '700' : '500',
                            backgroundColor: isActive ? (darkMode ? '#3b82f6' : '#ffffff') : 'transparent',
                            color: isActive ? '#ffffff' : theme.subtitle,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Table Header grid labels */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1.2fr 2fr 2fr 1fr 1.2fr 1.2fr 1fr 1.5fr',
                  gap: '16px', 
                  padding: '0 20px', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  color: theme.subtitle, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  <span>Quote No</span>
                  <span>Target Customer</span>
                  <span>Product Requirement</span>
                  <span>MOQ</span>
                  <span>Unit price</span>
                  <span>Valid Until</span>
                  <span>Status</span>
                  <span style={{ textAlign: 'right' }}>Update actions</span>
                </div>

                {/* Quotations List items */}
                {filteredQuotations.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredQuotations.map((q) => {
                      const statusColors = {
                        Accepted: { bg: 'rgba(34, 197, 94, 0.08)', text: '#16a34a', border: '1px solid rgba(34, 197, 94, 0.2)' },
                        Sent: { bg: 'rgba(3, 105, 161, 0.08)', text: '#0284c7', border: '1px solid rgba(3, 105, 161, 0.2)' },
                        Draft: { bg: 'rgba(202, 138, 4, 0.08)', text: '#d97706', border: '1px solid rgba(202, 138, 4, 0.2)' },
                        Expired: { bg: 'rgba(113, 113, 122, 0.08)', text: '#52525b', border: '1px solid rgba(113, 113, 122, 0.2)' }
                      }[q.status] || { bg: '#f4f4f5', text: '#27272a', border: '1px solid #e4e4e7' };

                      return (
                        <div 
                          key={q.id}
                          onClick={() => setSelectedQuote(q)}
                          className="quote-card-item"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1.2fr 2fr 2fr 1fr 1.2fr 1.2fr 1fr 1.5fr',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px 20px',
                            backgroundColor: theme.cardBg,
                            border: theme.border,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                            position: 'relative'
                          }}
                        >
                          {/* Quote ID */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={15} style={{ color: '#0976BC' }} />
                            <span style={{ fontWeight: '800', color: theme.text }}>{q.id}</span>
                          </div>

                          {/* Customer */}
                          <div>
                            <div style={{ fontWeight: '700', color: theme.text, fontSize: '0.88rem' }}>{q.customer}</div>
                            <div style={{ fontSize: '0.7rem', color: theme.subtitle, marginTop: '2px' }}>OEM Target Account</div>
                          </div>

                          {/* Product Spec */}
                          <div>
                            <div style={{ fontWeight: '600', color: theme.text, fontSize: '0.85rem' }}>{q.product}</div>
                            <div style={{ fontSize: '0.7rem', color: theme.subtitle, marginTop: '2px' }}>Custom Formulation</div>
                          </div>

                          {/* MOQ */}
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: theme.text }}>{formatNumber(q.moq)}</div>
                            <div style={{ fontSize: '0.7rem', color: theme.subtitle, marginTop: '2px' }}>Units</div>
                          </div>

                          {/* Price */}
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0976BC' }}>₹{q.price}/unit</div>
                            <div style={{ fontSize: '0.7rem', color: theme.subtitle, marginTop: '2px' }}>Val: ₹{formatNumber(q.moq * q.price)}</div>
                          </div>

                          {/* Expiry */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={12} style={{ color: theme.subtitle }} />
                            <span style={{ fontSize: '0.8rem', color: theme.text, fontWeight: '500' }}>{q.validUntil}</span>
                          </div>

                          {/* Status */}
                          <div>
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontWeight: '700',
                              backgroundColor: statusColors.bg,
                              color: statusColors.text,
                              border: statusColors.border,
                              display: 'inline-block'
                            }}>
                              {q.status}
                            </span>
                          </div>

                          {/* Actions */}
                          <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            {q.status === 'Draft' && (
                              <button 
                                onClick={() => {
                                  updateQuoteStatus(q.id, 'Sent');
                                  logSystemAction(`Sent quotation ${q.id} to client`);
                                }}
                                className="btn btn-primary"
                                style={{ padding: '6px 12px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '6px' }}
                              >
                                <ArrowRight size={12} /> Send Quote
                              </button>
                            )}
                            {q.status === 'Sent' && (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button 
                                  onClick={() => updateQuoteStatus(q.id, 'Accepted')}
                                  style={{ padding: '6px 10px', fontSize: '0.72rem', backgroundColor: '#22c55e', border: 'none', color: '#ffffff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <Check size={12} /> Accept
                                </button>
                                <button 
                                  onClick={() => updateQuoteStatus(q.id, 'Rejected')}
                                  style={{ padding: '6px 10px', fontSize: '0.72rem', backgroundColor: '#ef4444', border: 'none', color: '#ffffff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <X size={12} /> Reject
                                </button>
                              </div>
                            )}
                            <button
                              onClick={() => setSelectedQuote(q)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: theme.border, backgroundColor: theme.cardBg, color: theme.text }}
                            >
                              <Eye size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', border: theme.border, borderRadius: '12px', backgroundColor: theme.cardBg }}>
                    <FolderOpen size={48} style={{ color: theme.subtitle, marginBottom: '12px' }} />
                    <span style={{ fontSize: '0.9rem', color: theme.subtitle, fontWeight: '600' }}>No matching quotations found</span>
                    <span style={{ fontSize: '0.78rem', color: theme.subtitle, marginTop: '4px' }}>Try adjusting search tags or filters</span>
                  </div>
                )}

                {/* Quotation Details Slide-In Drawer */}
                {selectedQuote && (
                  <div style={{
                    position: 'fixed',
                    top: 0, right: 0, bottom: 0, width: '400px',
                    backgroundColor: darkMode ? '#18181b' : '#ffffff',
                    boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
                    zIndex: 150,
                    borderLeft: theme.border,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideInRight 300ms cubic-bezier(0.16, 1, 0.3, 1)'
                  }}>
                    {/* Header */}
                    <div style={{ padding: '20px 24px', borderBottom: theme.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#0976BC', textTransform: 'uppercase', letterSpacing: '1px' }}>Custom Blueprint spec</span>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0 0 0', color: theme.text }}>{selectedQuote.id}</h3>
                      </div>
                      <button 
                        onClick={() => setSelectedQuote(null)}
                        style={{ border: 'none', background: 'transparent', color: theme.subtitle, cursor: 'pointer', padding: '4px' }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      {/* Customer Card */}
                      <div style={{ backgroundColor: theme.itemBg, padding: '16px', borderRadius: '12px', border: theme.border }}>
                        <span style={{ fontSize: '0.68rem', color: theme.subtitle, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Target Customer</span>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '4px 0 2px 0', color: theme.text }}>{selectedQuote.customer}</h4>
                        <span style={{ fontSize: '0.78rem', color: theme.subtitle }}>OEM Global Partner</span>
                      </div>

                      {/* Specifications */}
                      <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', color: theme.text, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Formulation Specifications</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: theme.border, paddingBottom: '6px' }}>
                            <span style={{ color: theme.subtitle }}>Wipe Formulation</span>
                            <span style={{ fontWeight: '600', color: theme.text }}>{selectedQuote.product}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: theme.border, paddingBottom: '6px' }}>
                            <span style={{ color: theme.subtitle }}>Minimum Order Qty (MOQ)</span>
                            <span style={{ fontWeight: '600', color: theme.text }}>{formatNumber(selectedQuote.moq)} units</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: theme.border, paddingBottom: '6px' }}>
                            <span style={{ color: theme.subtitle }}>Quoted Unit Price</span>
                            <span style={{ fontWeight: '700', color: '#0976BC' }}>₹{selectedQuote.price}/unit</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', paddingBottom: '6px' }}>
                            <span style={{ color: theme.subtitle }}>Total Blueprint Value</span>
                            <span style={{ fontWeight: '800', color: theme.text }}>₹{formatNumber(selectedQuote.moq * selectedQuote.price)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', color: theme.text, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Negotiation Timeline</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: theme.border, paddingLeft: '14px', marginLeft: '6px' }}>
                          <div style={{ position: 'relative' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0976BC', position: 'absolute', left: '-19px', top: '4px' }} />
                            <div style={{ fontSize: '0.75rem', color: theme.subtitle }}>Created Draft Blueprint</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: theme.text }}>Vignesh Sulia (Sales Desk)</div>
                          </div>
                          {selectedQuote.status !== 'Draft' && (
                            <div style={{ position: 'relative' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7', position: 'absolute', left: '-19px', top: '4px' }} />
                              <div style={{ fontSize: '0.75rem', color: theme.subtitle }}>Dispatched to Client</div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: theme.text }}>Email Delivery Verified</div>
                            </div>
                          )}
                          {selectedQuote.status === 'Accepted' && (
                            <div style={{ position: 'relative' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', position: 'absolute', left: '-19px', top: '4px' }} />
                              <div style={{ fontSize: '0.75rem', color: theme.subtitle }}>Accepted by Client</div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#22c55e' }}>Converted to OEM Order</div>
                            </div>
                          )}
                          {selectedQuote.status === 'Rejected' && (
                            <div style={{ position: 'relative' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', position: 'absolute', left: '-19px', top: '4px' }} />
                              <div style={{ fontSize: '0.75rem', color: theme.subtitle }}>Rejected/Closed</div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ef4444' }}>Declined by Buyer</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expiry alerts */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        padding: '12px 16px', 
                        borderRadius: '10px', 
                        backgroundColor: selectedQuote.status === 'Expired' ? 'rgba(239, 68, 68, 0.06)' : 'rgba(9, 118, 188, 0.06)',
                        border: selectedQuote.status === 'Expired' ? '1px solid rgba(239, 68, 68, 0.15)' : '1px solid rgba(9, 118, 188, 0.15)' 
                      }}>
                        <Clock size={15} style={{ color: selectedQuote.status === 'Expired' ? '#ef4444' : '#0976BC' }} />
                        <span style={{ fontSize: '0.78rem', color: selectedQuote.status === 'Expired' ? '#ef4444' : theme.text }}>
                          Valid until <strong>{selectedQuote.validUntil}</strong>
                        </span>
                      </div>

                    </div>

                    {/* Actions footer */}
                    <div style={{ padding: '20px 24px', borderTop: theme.border, display: 'flex', gap: '10px', backgroundColor: theme.itemBg }}>
                      {selectedQuote.status === 'Draft' && (
                        <button 
                          onClick={() => {
                            updateQuoteStatus(selectedQuote.id, 'Sent');
                            setSelectedQuote(prev => ({ ...prev, status: 'Sent' }));
                          }}
                          className="btn btn-primary"
                          style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                        >
                          <ArrowRight size={14} /> Send Quote
                        </button>
                      )}
                      {selectedQuote.status === 'Sent' && (
                        <>
                          <button 
                            onClick={() => {
                              updateQuoteStatus(selectedQuote.id, 'Accepted');
                              setSelectedQuote(prev => ({ ...prev, status: 'Accepted' }));
                            }}
                            className="btn btn-primary"
                            style={{ flex: 1, backgroundColor: '#22c55e', border: 'none' }}
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => {
                              updateQuoteStatus(selectedQuote.id, 'Rejected');
                              setSelectedQuote(prev => ({ ...prev, status: 'Rejected' }));
                            }}
                            className="btn btn-secondary"
                            style={{ flex: 1, backgroundColor: '#ef4444', color: '#ffffff', border: 'none' }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => setSelectedQuote(null)}
                        className="btn btn-secondary"
                        style={{ flex: selectedQuote.status === 'Accepted' || selectedQuote.status === 'Rejected' || selectedQuote.status === 'Expired' ? 1 : 'none', border: theme.border, backgroundColor: theme.cardBg, color: theme.text }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB: CUSTOMERS */}
          {activeTab === 'Customers' && (() => {
            const totalCustomers = customers.length;
            const totalLTV = customers.reduce((sum, c) => sum + c.spend, 0);
            const avgSpend = totalCustomers ? Math.round(totalLTV / totalCustomers) : 0;
            const activeAccounts = customers.filter(c => c.status === 'Active').length;

            const filteredCustomers = customers.filter(c => {
              const query = (customerSearchQuery || '').toLowerCase().trim();
              
              const matchesSearch = !query || 
                                    (c.id && c.id.toLowerCase().includes(query)) ||
                                    (c.name && c.name.toLowerCase().includes(query)) ||
                                    (c.company && c.company.toLowerCase().includes(query)) ||
                                    (c.email && c.email.toLowerCase().includes(query)) ||
                                    (c.phone && c.phone.toLowerCase().includes(query)) ||
                                    (c.country && c.country.toLowerCase().includes(query)) ||
                                    (c.notes && c.notes.toLowerCase().includes(query)) ||
                                    (c.website && c.website.toLowerCase().includes(query)) ||
                                    (c.industry && c.industry.toLowerCase().includes(query)) ||
                                    (c.interest && c.interest.toLowerCase().includes(query)) ||
                                    (c.source && c.source.toLowerCase().includes(query));
              
              const matchesType = customerFilterType === 'All' || c.type === customerFilterType;
              const matchesStatus = customerFilterStatus === 'All' || c.status === customerFilterStatus;
              
              return matchesSearch && matchesType && matchesStatus;
            });

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <style>{`
                  @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                  }
                  .customer-card-item:hover {
                    transform: translateY(-2px) scale(1.005);
                    border-color: #0976BC !important;
                    box-shadow: 0 12px 24px -10px rgba(9, 118, 188, 0.15) !important;
                  }
                  .customer-stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px -8px rgba(0,0,0,0.08) !important;
                  }
                `}</style>

                {/* Header Title & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: theme.text }}>Customer Accounts Registry</h2>
                    <span style={{ fontSize: '0.8rem', color: theme.subtitle }}>HubSpot-integrated buyer sheets</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => triggerSpreadsheetExport('csv', 'customers')}
                      className="btn btn-secondary" 
                      style={{ padding: '10px 18px', fontSize: '0.85rem', border: theme.border, backgroundColor: theme.cardBg, color: theme.text }}
                    >
                      Export CSV
                    </button>
                    <button 
                      onClick={() => triggerSpreadsheetExport('excel', 'customers')}
                      className="btn btn-secondary" 
                      style={{ padding: '10px 18px', fontSize: '0.85rem', border: theme.border, backgroundColor: theme.cardBg, color: theme.text }}
                    >
                      Export Excel
                    </button>
                  </div>
                </div>

                {/* KPI Ribbon */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {/* Card 1: Total LTV */}
                  <div className="glass-card customer-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default', transition: 'all 0.3s ease', border: theme.border, backgroundColor: theme.cardBg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: 600 }}>Lifetime Value (LTV)</span>
                      <TrendingUp size={14} style={{ color: '#22c55e' }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                      ₹{formatNumber(totalLTV)}
                    </h3>
                    <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>Aggregated sales volume</span>
                  </div>

                  {/* Card 2: Active Accounts */}
                  <div className="glass-card customer-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default', transition: 'all 0.3s ease', border: theme.border, backgroundColor: theme.cardBg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: 600 }}>Active Partners</span>
                      <CheckCircle2 size={14} style={{ color: '#22c55e' }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                      {activeAccounts} / {totalCustomers}
                    </h3>
                    <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>{Math.round((activeAccounts/totalCustomers)*100)}% active account ratio</span>
                  </div>

                  {/* Card 3: Avg Spend */}
                  <div className="glass-card customer-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default', transition: 'all 0.3s ease', border: theme.border, backgroundColor: theme.cardBg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: 600 }}>Average LTV</span>
                      <DollarSign size={14} style={{ color: '#0976BC' }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                      ₹{formatNumber(avgSpend)}
                    </h3>
                    <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>Average spend per account</span>
                  </div>

                  {/* Card 4: Segments */}
                  <div className="glass-card customer-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default', transition: 'all 0.3s ease', border: theme.border, backgroundColor: theme.cardBg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: 600 }}>Segments Ratio</span>
                      <Users size={14} style={{ color: '#8b5cf6' }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                      {customers.filter(c => c.type === 'OEM').length} OEM / {customers.filter(c => c.type === 'B2B').length} B2B
                    </h3>
                    <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>Distribution of business channels</span>
                  </div>
                </div>

                {/* Filter and Search Toolbar */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  backgroundColor: theme.cardBg, 
                  border: theme.border, 
                  borderRadius: '16px', 
                  padding: '16px 20px', 
                  gap: '16px', 
                  flexWrap: 'wrap',
                  boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}>
                  {/* Search bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '280px', position: 'relative' }}>
                    <Search size={16} style={{ color: customerSearchQuery ? '#0976BC' : theme.subtitle, position: 'absolute', left: '14px', transition: 'color 0.2s ease' }} />
                    <input 
                      type="text" 
                      placeholder="Search name, company, email, location..." 
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '12px 40px 12px 40px', 
                        fontSize: '0.88rem', 
                        borderRadius: '10px', 
                        border: customerSearchQuery ? '1px solid #0976BC' : theme.border, 
                        backgroundColor: theme.itemBg, 
                        color: theme.text,
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: customerSearchQuery ? '0 0 0 3px rgba(9, 118, 188, 0.15)' : 'none'
                      }}
                    />
                    {customerSearchQuery && (
                      <button 
                        onClick={() => setCustomerSearchQuery('')}
                        style={{ 
                          position: 'absolute', 
                          right: '14px', 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          color: theme.subtitle, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          padding: '2px'
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Segment filter & Status filter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {/* Channel selector */}
                    <div style={{ display: 'flex', backgroundColor: darkMode ? '#18181b' : '#f1f5f9', padding: '3px', borderRadius: '10px', border: theme.border }}>
                      {['All', 'B2B', 'OEM', 'B2C'].map((type) => {
                        const isActive = customerFilterType === type;
                        const count = type === 'All' ? customers.length : customers.filter(c => c.type === type).length;
                        return (
                          <button
                            key={type}
                            onClick={() => setCustomerFilterType(type)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              backgroundColor: isActive ? '#0976BC' : 'transparent',
                              color: isActive ? '#ffffff' : theme.subtitle,
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                              boxShadow: isActive ? '0 2px 8px rgba(9, 118, 188, 0.25)' : 'none'
                            }}
                          >
                            <span>{type}</span>
                            <span style={{ 
                              fontSize: '0.68rem', 
                              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : (darkMode ? '#27272a' : '#e4e4e7'), 
                              color: isActive ? '#ffffff' : theme.subtitle,
                              padding: '1px 6px', 
                              borderRadius: '4px',
                              fontWeight: 'bold'
                            }}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Status selector */}
                    <div style={{ display: 'flex', backgroundColor: darkMode ? '#18181b' : '#f1f5f9', padding: '3px', borderRadius: '10px', border: theme.border }}>
                      {['All', 'Active', 'Suspended'].map((status) => {
                        const isActive = customerFilterStatus === status;
                        const count = status === 'All' ? customers.length : customers.filter(c => c.status === status).length;
                        return (
                          <button
                            key={status}
                            onClick={() => setCustomerFilterStatus(status)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              backgroundColor: isActive ? '#0976BC' : 'transparent',
                              color: isActive ? '#ffffff' : theme.subtitle,
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                              boxShadow: isActive ? '0 2px 8px rgba(9, 118, 188, 0.25)' : 'none'
                            }}
                          >
                            <span>{status}</span>
                            <span style={{ 
                              fontSize: '0.68rem', 
                              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : (darkMode ? '#27272a' : '#e4e4e7'), 
                              color: isActive ? '#ffffff' : theme.subtitle,
                              padding: '1px 6px', 
                              borderRadius: '4px',
                              fontWeight: 'bold'
                            }}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Reset Button */}
                    {(customerSearchQuery || customerFilterType !== 'All' || customerFilterStatus !== 'All') && (
                      <button
                        onClick={() => {
                          setCustomerSearchQuery('');
                          setCustomerFilterType('All');
                          setCustomerFilterStatus('All');
                        }}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          border: theme.border,
                          backgroundColor: theme.itemBg,
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 6px rgba(239, 68, 68, 0.08)'
                        }}
                        title="Reset all filters"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.itemBg}
                      >
                        <RefreshCw size={14} className="reset-icon" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Table Header labels */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1.2fr 2.5fr 2fr 1.2fr 1fr 1.5fr 1fr',
                  gap: '16px', 
                  padding: '0 20px', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  color: theme.subtitle, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  <span>Customer ID</span>
                  <span>Contact Details</span>
                  <span>Company Name</span>
                  <span>Location</span>
                  <span>Segment</span>
                  <span>Spent Turnover</span>
                  <span style={{ textAlign: 'right' }}>Status</span>
                </div>

                {/* Customers row list */}
                {filteredCustomers.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredCustomers.map((c) => {
                      const typeColors = {
                        OEM: { bg: 'rgba(162, 28, 175, 0.08)', text: '#a21caf', border: '1px solid rgba(162, 28, 175, 0.2)' },
                        B2B: { bg: 'rgba(29, 78, 216, 0.08)', text: '#1d4ed8', border: '1px solid rgba(29, 78, 216, 0.2)' }
                      }[c.type] || { bg: 'rgba(113, 113, 122, 0.08)', text: '#3f3f46', border: '1px solid rgba(113, 113, 122, 0.2)' };

                      const initials = c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                      // Random gradient generator based on name hash for avatar visual
                      const nameHash = c.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                      const gradients = [
                        'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                        'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
                        'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                        'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
                      ];
                      const avatarGradient = gradients[nameHash % gradients.length];

                      return (
                        <div 
                          key={c.id}
                          onClick={() => setSelectedCustomer(c)}
                          className="customer-card-item"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1.2fr 2.5fr 2fr 1.2fr 1fr 1.5fr 1fr',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px 20px',
                            backgroundColor: theme.cardBg,
                            border: theme.border,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                            position: 'relative'
                          }}
                        >
                          {/* Column 1: ID */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '8px', 
                              background: avatarGradient, 
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.78rem',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }}>
                              {initials}
                            </div>
                            <span style={{ fontWeight: '800', color: theme.text }}>{c.id}</span>
                          </div>

                          {/* Column 2: Name / Email */}
                          <div>
                            <div style={{ fontWeight: '700', color: theme.text, fontSize: '0.88rem' }}>{c.name}</div>
                            <div style={{ fontSize: '0.7rem', color: theme.subtitle, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>{c.email}</span>
                            </div>
                          </div>

                          {/* Column 3: Company */}
                          <div>
                            <div style={{ fontWeight: '600', color: theme.text, fontSize: '0.85rem' }}>{c.company}</div>
                            <div style={{ fontSize: '0.7rem', color: theme.subtitle, marginTop: '2px' }}>Enterprise Buyer</div>
                          </div>

                          {/* Column 4: Country */}
                          <div style={{ fontSize: '0.82rem', color: theme.text, fontWeight: '500' }}>
                            {c.country}
                          </div>

                          {/* Column 5: Segment */}
                          <div>
                            <span style={{
                              fontSize: '0.68rem',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontWeight: '700',
                              backgroundColor: typeColors.bg,
                              color: typeColors.text,
                              border: typeColors.border,
                              display: 'inline-block'
                            }}>
                              {c.type}
                            </span>
                          </div>

                          {/* Column 6: Spent Turnover */}
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0976BC' }}>₹{formatNumber(c.spend)}</div>
                            <div style={{ fontSize: '0.7rem', color: theme.subtitle, marginTop: '2px' }}>Total LTV Volume</div>
                          </div>

                          {/* Column 7: Status */}
                          <div style={{ textAlign: 'right' }}>
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontWeight: '700',
                              backgroundColor: c.status === 'Active' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                              color: c.status === 'Active' ? '#16a34a' : '#ef4444',
                              border: c.status === 'Active' ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                              display: 'inline-block'
                            }}>
                              {c.status}
                            </span>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', border: theme.border, borderRadius: '12px', backgroundColor: theme.cardBg }}>
                    <FolderOpen size={48} style={{ color: theme.subtitle, marginBottom: '12px' }} />
                    <span style={{ fontSize: '0.9rem', color: theme.subtitle, fontWeight: '600' }}>No partners matching query</span>
                    <span style={{ fontSize: '0.78rem', color: theme.subtitle, marginTop: '4px' }}>Verify customer criteria filters</span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB: PRODUCTS */}
          {activeTab === 'Products' && (() => {
            const totalSKUs = products.length;
            const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
            const avgMOQ = Math.round(products.reduce((sum, p) => sum + p.moq, 0) / products.length);
            const highestPrice = Math.max(...products.map(p => p.price));

            const filteredProducts = products.filter(prod => {
              const query = (productSearch || '').toLowerCase().trim();
              const matchesSearch = !query || 
                                    (prod.sku && prod.sku.toLowerCase().includes(query)) ||
                                    (prod.name && prod.name.toLowerCase().includes(query)) ||
                                    (prod.description && prod.description.toLowerCase().includes(query)) ||
                                    (prod.category && prod.category.toLowerCase().includes(query));
              const matchesCategory = productCategoryFilter === 'All' || prod.category === productCategoryFilter;
              return matchesSearch && matchesCategory;
            });

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <style>{`
                  @keyframes productCardEntrance {
                    from { opacity: 0; transform: translateY(24px) scale(0.98); filter: blur(4px); }
                    to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                  }
                  @keyframes shineSweep {
                    0% { left: -100%; }
                    100% { left: 200%; }
                  }
                  .catalog-product-card {
                    animation: productCardEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                  }
                  .catalog-product-card:hover {
                    transform: translateY(-4px) scale(1.01);
                    border-color: #0976BC !important;
                    box-shadow: 0 16px 32px -12px rgba(9, 118, 188, 0.15), 0 4px 12px rgba(0,0,0,0.02) !important;
                  }
                  .catalog-product-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.15), transparent);
                    transform: skewX(-25deg);
                    transition: 0.75s;
                  }
                  .catalog-product-card:hover::before {
                    animation: shineSweep 1.2s ease-in-out;
                  }
                  .product-image-zoom {
                    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                  }
                  .catalog-product-card:hover .product-image-zoom {
                    transform: scale(1.08) rotate(1deg);
                  }
                  .product-stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px -8px rgba(0,0,0,0.08) !important;
                  }
                  .catalog-product-card:hover .edit-pill {
                    opacity: 1 !important;
                    transform: translateX(0) !important;
                  }
                `}</style>

                {/* Header Title & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: theme.text }}>Wet Wipes Catalog Manager</h2>
                    <span style={{ fontSize: '0.8rem', color: theme.subtitle }}>Manage enterprise formulation sheets, branding dimensions & packaging sizes</span>
                  </div>
                  <button 
                    onClick={() => setShowNewProductModal(true)}
                    className="btn btn-primary" 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      padding: '10px 18px', 
                      fontSize: '0.85rem',
                      backgroundColor: '#0976BC',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(9, 118, 188, 0.25)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#075d96'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0976BC'}
                  >
                    <Plus size={16} /> Add Catalog Product
                  </button>
                </div>

                {/* KPI Ribbon Block */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {/* Card 1: Total SKUs */}
                  <div className="glass-card product-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default', transition: 'all 0.3s ease', border: theme.border, backgroundColor: theme.cardBg, padding: '16px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: 600 }}>Catalog SKUs</span>
                      <Layers size={14} style={{ color: '#0976BC' }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                      {totalSKUs} Formats
                    </h3>
                    <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>Total registered wet wipes types</span>
                  </div>

                  {/* Card 2: Total Stock */}
                  <div 
                    className="glass-card product-stat-card" 
                    onClick={() => setShowStockBreakdownModal(true)}
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '8px', 
                      cursor: 'pointer', 
                      transition: 'all 0.3s ease', 
                      border: theme.border, 
                      backgroundColor: theme.cardBg, 
                      padding: '16px', 
                      borderRadius: '12px' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: 600 }}>Total Warehouse Stock</span>
                      <Package size={14} style={{ color: '#10b981' }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                      {formatNumber(totalStock)} Units
                    </h3>
                    <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>Finished wipes inventory level (Click to view)</span>
                  </div>

                  {/* Card 3: Average MOQ */}
                  <div className="glass-card product-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default', transition: 'all 0.3s ease', border: theme.border, backgroundColor: theme.cardBg, padding: '16px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: 600 }}>Average MOQ Level</span>
                      <Percent size={14} style={{ color: '#f59e0b' }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                      {formatNumber(avgMOQ)} MOQ
                    </h3>
                    <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>Average buyer MOQ requirement</span>
                  </div>

                  {/* Card 4: Top Tier Pricing */}
                  <div className="glass-card product-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default', transition: 'all 0.3s ease', border: theme.border, backgroundColor: theme.cardBg, padding: '16px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: 600 }}>Top Tier Pricing</span>
                      <DollarSign size={14} style={{ color: '#8b5cf6' }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.text, margin: '2px 0' }}>
                      ₹{formatNumber(highestPrice)} / unit
                    </h3>
                    <span style={{ fontSize: '0.65rem', color: theme.subtitle }}>Highest catalog price rate</span>
                  </div>
                </div>

                {/* Filter and Search Toolbar */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  backgroundColor: theme.cardBg, 
                  border: theme.border, 
                  borderRadius: '16px', 
                  padding: '16px 20px', 
                  gap: '16px', 
                  flexWrap: 'wrap',
                  boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}>
                  {/* Search bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '280px', position: 'relative' }}>
                    <Search size={16} style={{ color: productSearch ? '#0976BC' : theme.subtitle, position: 'absolute', left: '14px', transition: 'color 0.2s ease' }} />
                    <input 
                      type="text" 
                      placeholder="Search name, SKU, category, substrate details..." 
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '12px 40px 12px 40px', 
                        fontSize: '0.88rem', 
                        borderRadius: '10px', 
                        border: productSearch ? '1px solid #0976BC' : theme.border, 
                        backgroundColor: theme.itemBg, 
                        color: theme.text,
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: productSearch ? '0 0 0 3px rgba(9, 118, 188, 0.15)' : 'none'
                      }}
                    />
                    {productSearch && (
                      <button 
                        onClick={() => setProductSearch('')}
                        style={{ 
                          position: 'absolute', 
                          right: '14px', 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          color: theme.subtitle, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          padding: '2px'
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Category Filter selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', backgroundColor: darkMode ? '#18181b' : '#f1f5f9', padding: '3px', borderRadius: '10px', border: theme.border }}>
                      {['All', 'Clinical PPE', 'Hospital Wipes', 'Baby Care', 'Sanitizers'].map((cat) => {
                        const isActive = productCategoryFilter === cat;
                        const count = cat === 'All' ? products.length : products.filter(p => p.category === cat).length;
                        return (
                          <button
                            key={cat}
                            onClick={() => setProductCategoryFilter(cat)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              backgroundColor: isActive ? '#0976BC' : 'transparent',
                              color: isActive ? '#ffffff' : theme.subtitle,
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                              boxShadow: isActive ? '0 2px 8px rgba(9, 118, 188, 0.25)' : 'none'
                            }}
                          >
                            <span>{cat}</span>
                            <span style={{ 
                              fontSize: '0.68rem', 
                              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : (darkMode ? '#27272a' : '#e4e4e7'), 
                              color: isActive ? '#ffffff' : theme.subtitle,
                              padding: '1px 6px', 
                              borderRadius: '4px',
                              fontWeight: 'bold'
                            }}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Reset Button */}
                    {(productSearch || productCategoryFilter !== 'All') && (
                      <button
                        onClick={() => {
                          setProductSearch('');
                          setProductCategoryFilter('All');
                        }}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          border: theme.border,
                          backgroundColor: theme.itemBg,
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 6px rgba(239, 68, 68, 0.08)'
                        }}
                        title="Reset all filters"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.itemBg}
                      >
                        <RefreshCw size={14} className="reset-icon" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    {filteredProducts.map((prod, index) => {
                      const isLowStock = prod.stock < 10000;
                      
                      // Nice visual theme mapping for different product categories
                      const catBadgeStyles = {
                        'Clinical PPE': { bg: 'rgba(6, 182, 212, 0.08)', text: '#0891b2', border: '1px solid rgba(6, 182, 212, 0.2)' },
                        'Hospital Wipes': { bg: 'rgba(236, 72, 153, 0.08)', text: '#db2777', border: '1px solid rgba(236, 72, 153, 0.2)' },
                        'Baby Care': { bg: 'rgba(245, 158, 11, 0.08)', text: '#d97706', border: '1px solid rgba(245, 158, 11, 0.2)' },
                        'Sanitizers': { bg: 'rgba(139, 92, 246, 0.08)', text: '#7c3aed', border: '1px solid rgba(139, 92, 246, 0.2)' }
                      }[prod.category] || { bg: 'rgba(113, 113, 122, 0.08)', text: '#52525b', border: '1px solid rgba(113, 113, 122, 0.2)' };

                      return (
                        <div 
                          key={prod.id} 
                          className="glass-card catalog-product-card" 
                          onClick={() => handleOpenProductEditor(prod)}
                          style={{ 
                            display: 'flex', 
                            gap: '20px', 
                            padding: '20px',
                            borderRadius: '16px',
                            border: theme.border,
                            backgroundColor: theme.cardBg,
                            animationDelay: `${index * 0.05}s`,
                            cursor: 'pointer'
                          }}
                        >
                          {/* Image Container with Hover zoom */}
                          <div style={{ 
                            width: '140px', 
                            height: '140px', 
                            borderRadius: '12px', 
                            overflow: 'hidden', 
                            border: theme.border, 
                            position: 'relative', 
                            backgroundColor: theme.itemBg,
                            flexShrink: 0
                          }}>
                            <img loading="lazy" src={prod.images && prod.images[0] ? prod.images[0] : '/placeholder.png'} 
                              alt={prod.name} 
                              className="product-image-zoom"
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }} 
                            />
                            <div style={{
                              position: 'absolute',
                              bottom: '6px',
                              right: '6px',
                              backgroundColor: 'rgba(0,0,0,0.65)',
                              backdropFilter: 'blur(4px)',
                              color: '#ffffff',
                              fontSize: '0.62rem',
                              fontWeight: 'bold',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Eye size={10} /> 1/1
                            </div>
                          </div>

                          {/* Info Column */}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ 
                                fontSize: '0.72rem', 
                                padding: '3px 8px', 
                                borderRadius: '6px', 
                                fontWeight: '700',
                                backgroundColor: catBadgeStyles.bg,
                                color: catBadgeStyles.text,
                                border: catBadgeStyles.border
                              }}>
                                {prod.category}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.72rem', color: theme.subtitle, fontFamily: 'monospace', fontWeight: 'bold' }}>
                                  {prod.sku}
                                </span>
                                <div className="edit-pill" style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.65rem',
                                  color: '#0976BC',
                                  fontWeight: 'bold',
                                  backgroundColor: 'rgba(9, 118, 188, 0.08)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  opacity: 0,
                                  transform: 'translateX(4px)',
                                  transition: 'all 0.2s ease'
                                }}>
                                  <Edit3 size={10} /> Edit
                                </div>
                              </div>
                            </div>

                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: theme.text, margin: 0 }}>
                              {prod.name}
                            </h3>

                            <p style={{ 
                              fontSize: '0.82rem', 
                              color: theme.subtitle, 
                              lineHeight: 1.45, 
                              margin: 0,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {prod.description}
                            </p>
                            
                            {/* Stock Indicator Status line */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginTop: '2px' }}>
                              <span style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: isLowStock ? '#ef4444' : '#22c55e',
                                display: 'inline-block'
                              }} />
                              <span style={{ color: isLowStock ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>
                                {isLowStock ? 'Restock Advised' : 'Optimal Stock'}
                              </span>
                            </div>

                            {/* Divider */}
                            <div style={{ borderTop: theme.border, margin: '8px 0', opacity: 0.5 }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.65rem', color: theme.subtitle, textTransform: 'uppercase', fontWeight: 600 }}>MOQ / Stock</span>
                                <span style={{ fontSize: '0.8rem', color: theme.text, fontWeight: '700' }}>
                                  {prod.moq} MOQ <span style={{ color: theme.subtitle }}>|</span> {formatNumber(prod.stock)} units
                                </span>
                              </div>
                              
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <span style={{ fontSize: '0.65rem', color: theme.subtitle, textTransform: 'uppercase', fontWeight: 600 }}>Bulk Price</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0976BC' }}>
                                  ₹{prod.price}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px', border: theme.border, borderRadius: '16px', backgroundColor: theme.cardBg }}>
                    <FolderOpen size={48} style={{ color: theme.subtitle, marginBottom: '16px' }} />
                    <span style={{ fontSize: '1rem', color: theme.text, fontWeight: '700' }}>No products matching search query</span>
                    <span style={{ fontSize: '0.8rem', color: theme.subtitle, marginTop: '4px' }}>Try adjusting your categories or search parameters</span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB: INVENTORY */}
          {activeTab === 'Inventory' && (() => {
            const parseQty = (value) => Number(String(value).replace(/[^0-9.]/g, '')) || 0;
            const getQtyUnit = (value) => String(value).replace(/[0-9.,\s]/g, '').trim() || 'units';
            const formatQtyWithUnit = (value, unit) => `${formatNumber(Number(value || 0))} ${unit}`;
            const materialStats = rawMaterials.reduce((acc, mat) => {
              const total = parseQty(mat.stock);
              const available = parseQty(mat.available);
              const reserved = parseQty(mat.reserved);
              return {
                totalItems: acc.totalItems + 1,
                totalAvailable: acc.totalAvailable + available,
                totalReserved: acc.totalReserved + reserved,
                lowCount: acc.lowCount + (mat.status === 'Low Stock' || mat.status === 'Out of Stock' ? 1 : 0),
                fabricCount: acc.fabricCount + (mat.category === 'Fabric' ? 1 : 0),
                chemicalCount: acc.chemicalCount + (mat.category === 'Chemicals' ? 1 : 0),
                totalStock: acc.totalStock + total
              };
            }, { totalItems: 0, totalAvailable: 0, totalReserved: 0, lowCount: 0, fabricCount: 0, chemicalCount: 0, totalStock: 0 });

            const categories = Array.from(new Set(rawMaterials.map(mat => mat.category)));
            const statusTheme = (status) => {
              if (status === 'Out of Stock') return { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.22)', glow: 'rgba(239, 68, 68, 0.16)', gradient: 'linear-gradient(90deg, #ef4444, #b91c1c)' };
              if (status === 'Low Stock') return { bg: 'rgba(245, 158, 11, 0.14)', color: '#d97706', border: 'rgba(245, 158, 11, 0.24)', glow: 'rgba(245, 158, 11, 0.18)', gradient: 'linear-gradient(90deg, #f59e0b, #f97316)' };
              return { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: 'rgba(16, 185, 129, 0.22)', glow: 'rgba(16, 185, 129, 0.14)', gradient: 'linear-gradient(90deg, #10b981, #0976BC)' };
            };
            const beginRawMaterialEdit = (mat) => {
              setEditingRawMaterialId(mat.id);
              setRawMaterialDraft({
                stock: String(parseQty(mat.stock)),
                available: String(parseQty(mat.available)),
                reserved: String(parseQty(mat.reserved)),
                status: mat.status
              });
            };
            const saveRawMaterialEdit = (mat) => {
              const unit = getQtyUnit(mat.stock);
              const nextStatus = rawMaterialDraft.status;
              setRawMaterials(prev => prev.map(item => item.id === mat.id ? {
                ...item,
                stock: formatQtyWithUnit(rawMaterialDraft.stock, unit),
                available: formatQtyWithUnit(rawMaterialDraft.available, unit),
                reserved: formatQtyWithUnit(rawMaterialDraft.reserved, unit),
                status: nextStatus
              } : item));
              setEditingRawMaterialId(null);
              setRawMaterialDraft({ stock: '', available: '', reserved: '', status: 'In Stock' });
            };

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <style>{`
                  @keyframes inventoryRise {
                    from { opacity: 0; transform: translateY(18px); filter: blur(8px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                  }
                  @keyframes inventoryPulse {
                    0%, 100% { transform: scale(1); opacity: 0.55; }
                    50% { transform: scale(1.18); opacity: 0.9; }
                  }
                  .inventory-modern-card {
                    animation: inventoryRise 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
                    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease, border-color 0.28s ease;
                  }
                  .inventory-modern-card:hover {
                    transform: translateY(-4px);
                    box-shadow: ${darkMode ? '0 22px 42px rgba(0,0,0,0.28)' : '0 22px 42px rgba(15,23,42,0.09)'};
                    border-color: rgba(9, 118, 188, 0.28) !important;
                  }
                  .inventory-material-row {
                    animation: inventoryRise 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
                    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
                  }
                  .inventory-material-row:hover {
                    transform: translateX(4px);
                    box-shadow: ${darkMode ? '0 18px 34px rgba(0,0,0,0.25)' : '0 18px 34px rgba(15,23,42,0.08)'};
                    border-color: rgba(9, 118, 188, 0.28) !important;
                  }
                `}</style>

                <div style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '26px',
                  border: theme.border,
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(9,118,188,0.18), rgba(16,185,129,0.08) 45%, rgba(24,24,27,0.92))'
                    : 'linear-gradient(135deg, #ffffff 0%, #eef8ff 45%, #f2fff8 100%)',
                  padding: '28px',
                  boxShadow: darkMode ? '0 20px 50px rgba(0,0,0,0.22)' : '0 20px 50px rgba(15,23,42,0.07)'
                }}>
                  <div style={{
                    position: 'absolute',
                    right: '-90px',
                    top: '-90px',
                    width: '260px',
                    height: '260px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(9,118,188,0.18), transparent 68%)',
                    animation: 'inventoryPulse 4s ease-in-out infinite'
                  }} />
                  <div style={{
                    position: 'absolute',
                    right: '120px',
                    bottom: '-120px',
                    width: '260px',
                    height: '260px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16,185,129,0.16), transparent 68%)',
                    animation: 'inventoryPulse 5s ease-in-out infinite'
                  }} />

                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 11px', borderRadius: '999px', backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(9,118,188,0.08)', color: '#0976BC', fontSize: '0.72rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        <Factory size={14} /> Live Supply Room
                      </div>
                      <h2 style={{ margin: '14px 0 8px', fontSize: 'clamp(1.75rem, 3vw, 2.55rem)', lineHeight: 1, fontWeight: 950, letterSpacing: '-0.05em', color: theme.text }}>
                        Factory Raw Materials
                      </h2>
                      <p style={{ margin: 0, maxWidth: '620px', color: theme.subtitle, fontSize: '0.95rem', lineHeight: 1.6 }}>
                        Track compounding chemicals, fabric rolls, fragrance oils, and packaging inputs with live-style stock health and OEM reservations.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {categories.map((category) => (
                        <span key={category} style={{
                          padding: '10px 14px',
                          borderRadius: '999px',
                          border: theme.border,
                          backgroundColor: theme.cardBg,
                          color: theme.text,
                          fontSize: '0.78rem',
                          fontWeight: 850,
                          boxShadow: darkMode ? 'none' : '0 10px 24px rgba(15,23,42,0.05)'
                        }}>
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }}>
                  {[
                    { label: 'Material SKUs', value: materialStats.totalItems, suffix: 'items', icon: Layers, color: '#0976BC', delay: '0ms' },
                    { label: 'Available Stock', value: formatNumber(materialStats.totalAvailable), suffix: 'units/kg/L', icon: CheckCircle, color: '#10b981', delay: '70ms' },
                    { label: 'OEM Reserved', value: formatNumber(materialStats.totalReserved), suffix: 'allocated', icon: Clock, color: '#8b5cf6', delay: '140ms' },
                    { label: 'Attention Needed', value: materialStats.lowCount, suffix: 'materials', icon: AlertTriangle, color: '#ef4444', delay: '210ms' }
                  ].map((metric) => {
                    const MetricIcon = metric.icon;
                    return (
                      <div key={metric.label} className="inventory-modern-card" style={{
                        animationDelay: metric.delay,
                        padding: '18px',
                        borderRadius: '20px',
                        border: theme.border,
                        backgroundColor: theme.cardBg,
                        boxShadow: darkMode ? 'none' : '0 14px 32px rgba(15,23,42,0.05)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                          <span style={{ fontSize: '0.75rem', color: theme.subtitle, fontWeight: 850 }}>{metric.label}</span>
                          <span style={{ width: '34px', height: '34px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${metric.color}18`, color: metric.color }}>
                            <MetricIcon size={17} />
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
                          <strong style={{ fontSize: '1.55rem', lineHeight: 1, color: theme.text }}>{metric.value}</strong>
                          <span style={{ fontSize: '0.72rem', color: theme.subtitle, fontWeight: 750 }}>{metric.suffix}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{
                  borderRadius: '22px',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  background: darkMode ? 'rgba(127, 29, 29, 0.18)' : 'linear-gradient(90deg, rgba(254,242,242,0.95), rgba(255,251,235,0.8))',
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  boxShadow: darkMode ? 'none' : '0 14px 34px rgba(239,68,68,0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '42px', height: '42px', borderRadius: '14px', backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertTriangle size={21} />
                    </span>
                    <div>
                      <strong style={{ display: 'block', color: darkMode ? '#fecaca' : '#991b1b', fontSize: '0.92rem' }}>Procurement alert</strong>
                      <span style={{ display: 'block', marginTop: '2px', color: darkMode ? '#fca5a5' : '#7f1d1d', fontSize: '0.82rem', fontWeight: 650 }}>
                        Chlorhexidine Gluconate is low and plastic flip lids are out of stock. Raise purchase order before production scheduling.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGeneratePurchaseOrderPDF()}
                    style={{ height: '40px', padding: '0 16px', borderRadius: '999px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', fontSize: '0.78rem', fontWeight: 850, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Create PO
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '18px', alignItems: 'start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {rawMaterials.map((mat, index) => {
                      const total = parseQty(mat.stock);
                      const available = parseQty(mat.available);
                      const reserved = parseQty(mat.reserved);
                      const unit = getQtyUnit(mat.stock);
                      const percent = Math.min(Math.round((available / Math.max(total, 1)) * 100), 100);
                      const isEditing = editingRawMaterialId === mat.id;
                      const currentStatus = isEditing ? rawMaterialDraft.status : mat.status;
                      const styleSet = statusTheme(currentStatus);
                      return (
                        <div key={mat.id} className="inventory-material-row" style={{
                          animationDelay: `${index * 55}ms`,
                          padding: '16px',
                          borderRadius: '20px',
                          border: theme.border,
                          backgroundColor: theme.cardBg,
                          display: 'grid',
                          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(170px, 0.7fr)',
                          gap: '18px',
                          alignItems: 'center'
                        }}>
                          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', minWidth: 0 }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '16px', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: styleSet.bg, color: styleSet.color, border: `1px solid ${styleSet.border}`, boxShadow: `0 12px 24px ${styleSet.glow}` }}>
                              {mat.category === 'Chemicals' ? <FlaskConical size={22} /> : mat.category === 'Packaging' ? <Package size={22} /> : mat.category === 'Fabric' ? <Layers size={22} /> : <Activity size={22} />}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap' }}>
                                <strong style={{ color: theme.text, fontSize: '0.96rem' }}>{mat.name}</strong>
                                <span style={{ padding: '4px 8px', borderRadius: '999px', backgroundColor: theme.itemBg, color: theme.subtitle, fontSize: '0.68rem', fontWeight: 850 }}>{mat.id}</span>
                              </div>
                              {isEditing ? (
                                <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(110px, 1fr))', gap: '8px', maxWidth: '680px' }}>
                                  {[
                                    ['stock', 'Total'],
                                    ['available', 'Available'],
                                    ['reserved', 'Reserved']
                                  ].map(([field, label]) => (
                                    <label key={field} style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.66rem', color: theme.subtitle, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                      {label}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '36px', padding: '0 10px', borderRadius: '12px', border: '1px solid rgba(9, 118, 188, 0.25)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : '#ffffff', boxShadow: darkMode ? 'none' : '0 8px 18px rgba(9,118,188,0.06)' }}>
                                        <input
                                          type="number"
                                          min="0"
                                          value={rawMaterialDraft[field]}
                                          onChange={(event) => setRawMaterialDraft(prev => ({ ...prev, [field]: event.target.value }))}
                                          style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: theme.text, fontSize: '0.82rem', fontWeight: 900 }}
                                        />
                                        <span style={{ color: theme.subtitle, fontSize: '0.72rem', fontWeight: 850 }}>{unit}</span>
                                      </div>
                                    </label>
                                  ))}
                                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.66rem', color: theme.subtitle, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Status
                                    <select
                                      value={rawMaterialDraft.status}
                                      onChange={(event) => setRawMaterialDraft(prev => ({ ...prev, status: event.target.value }))}
                                      style={{
                                        height: '36px',
                                        padding: '0 10px',
                                        borderRadius: '12px',
                                        border: `1px solid ${styleSet.border}`,
                                        backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : '#ffffff',
                                        color: styleSet.color,
                                        outline: 'none',
                                        fontSize: '0.78rem',
                                        fontWeight: 900,
                                        boxShadow: darkMode ? 'none' : `0 8px 18px ${styleSet.glow}`
                                      }}
                                    >
                                      <option value="In Stock">In Stock</option>
                                      <option value="Low Stock">Low Stock</option>
                                      <option value="Out of Stock">Out of Stock</option>
                                    </select>
                                  </label>
                                </div>
                              ) : (
                                <div style={{ marginTop: '7px', display: 'flex', gap: '12px', flexWrap: 'wrap', color: theme.subtitle, fontSize: '0.75rem', fontWeight: 750 }}>
                                  <span>{mat.category}</span>
                                  <span>Total: {mat.stock}</span>
                                  <span>Reserved: {mat.reserved}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ color: styleSet.color, fontWeight: 900, fontSize: '0.88rem' }}>{isEditing ? `${formatNumber(Number(rawMaterialDraft.available || 0))} ${unit}` : mat.available}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                <span style={{ padding: '5px 9px', borderRadius: '999px', backgroundColor: styleSet.bg, color: styleSet.color, fontSize: '0.7rem', fontWeight: 900 }}>{mat.status}</span>
                                {isEditing ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => saveRawMaterialEdit(mat)}
                                      style={{ width: '30px', height: '30px', borderRadius: '10px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                      aria-label={`Save ${mat.name} stock`}
                                    >
                                      <Check size={15} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingRawMaterialId(null);
                                        setRawMaterialDraft({ stock: '', available: '', reserved: '', status: 'In Stock' });
                                      }}
                                      style={{ width: '30px', height: '30px', borderRadius: '10px', border: theme.border, backgroundColor: theme.itemBg, color: theme.subtitle, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                      aria-label={`Cancel ${mat.name} stock edit`}
                                    >
                                      <X size={15} />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => beginRawMaterialEdit(mat)}
                                    style={{ height: '30px', padding: '0 10px', borderRadius: '999px', border: '1px solid rgba(9, 118, 188, 0.22)', backgroundColor: darkMode ? 'rgba(9,118,188,0.12)' : 'rgba(9,118,188,0.08)', color: '#0976BC', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 900 }}
                                    aria-label={`Edit ${mat.name} stock`}
                                  >
                                    <Edit3 size={13} /> Edit
                                  </button>
                                )}
                              </div>
                            </div>
                            <div style={{ height: '8px', borderRadius: '999px', backgroundColor: darkMode ? '#27272a' : '#e5e7eb', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${percent}%`, borderRadius: '999px', background: styleSet.gradient, transition: 'background 0.25s ease, width 0.25s ease' }} />
                            </div>
                            <div style={{ marginTop: '6px', color: theme.subtitle, fontSize: '0.68rem', fontWeight: 750 }}>{percent}% available</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '92px' }}>
                    <div style={{ padding: '20px', borderRadius: '22px', border: theme.border, backgroundColor: theme.cardBg, boxShadow: darkMode ? 'none' : '0 16px 36px rgba(15,23,42,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                        <div>
                          <h3 style={{ margin: 0, color: theme.text, fontSize: '1rem', fontWeight: 900 }}>Category Mix</h3>
                          <span style={{ color: theme.subtitle, fontSize: '0.76rem', fontWeight: 650 }}>Material families in procurement</span>
                        </div>
                        <PieChart size={22} style={{ color: '#0976BC' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {categories.map((category) => {
                          const count = rawMaterials.filter(mat => mat.category === category).length;
                          const width = Math.max(12, Math.round((count / rawMaterials.length) * 100));
                          return (
                            <div key={category}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.78rem', fontWeight: 850, color: theme.text }}>
                                <span>{category}</span>
                                <span>{count} items</span>
                              </div>
                              <div style={{ height: '9px', borderRadius: '999px', backgroundColor: darkMode ? '#27272a' : '#e5e7eb', overflow: 'hidden' }}>
                                <div style={{ width: `${width}%`, height: '100%', borderRadius: '999px', background: category === 'Chemicals' ? '#8b5cf6' : category === 'Fabric' ? '#0976BC' : category === 'Packaging' ? '#ef4444' : '#10b981' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ padding: '20px', borderRadius: '22px', border: theme.border, backgroundColor: darkMode ? 'rgba(9,118,188,0.12)' : '#eff8ff' }}>
                      <h3 style={{ margin: 0, color: theme.text, fontSize: '1rem', fontWeight: 900 }}>Next Purchase Actions</h3>
                      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                          'Reorder Chlorhexidine Gluconate before QC batch freeze.',
                          'Source plastic flip lids from alternate supplier.',
                          'Reserve 600 kg fabric buffer for active OEM production.'
                        ].map((task, index) => (
                          <div key={task} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: theme.text, fontSize: '0.8rem', fontWeight: 700, lineHeight: 1.45 }}>
                            <span style={{ width: '22px', height: '22px', flex: '0 0 auto', borderRadius: '8px', backgroundColor: index === 0 ? '#ef4444' : '#0976BC', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 900 }}>{index + 1}</span>
                            <span>{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB: B2B LEADS */}
          {activeTab === 'B2B Leads' && <B2BLeadsPanel user={user} theme={theme} />}

          {/* TAB: LEADS (KANBAN FUNNEL) */}
          {activeTab === 'Leads' && (() => {
            const leadStages = [
              { label: 'New', color: '#0976BC', glow: 'rgba(9,118,188,0.18)', probability: 12 },
              { label: 'Contacted', color: '#6366f1', glow: 'rgba(99,102,241,0.18)', probability: 28 },
              { label: 'Qualified', color: '#8b5cf6', glow: 'rgba(139,92,246,0.18)', probability: 46 },
              { label: 'Proposal Sent', color: '#f59e0b', glow: 'rgba(245,158,11,0.2)', probability: 68 },
              { label: 'Won', color: '#10b981', glow: 'rgba(16,185,129,0.18)', probability: 100 },
              { label: 'Lost', color: '#ef4444', glow: 'rgba(239,68,68,0.16)', probability: 0 }
            ];
            const activePipeline = leads.filter((lead) => lead.status !== 'Lost');
            const pipelineValue = activePipeline.reduce((sum, lead) => sum + lead.amount, 0);
            const weightedForecast = leads.reduce((sum, lead) => {
              const stage = leadStages.find((item) => item.label === lead.status);
              return sum + (lead.amount * ((stage?.probability || 0) / 100));
            }, 0);
            const wonRevenue = leads.filter((lead) => lead.status === 'Won').reduce((sum, lead) => sum + lead.amount, 0);
            const topLead = leads.reduce((best, lead) => (lead.amount > best.amount ? lead : best), leads[0]);

            return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <style>{`
                @keyframes leadRise {
                  from { opacity: 0; transform: translateY(18px) scale(0.98); }
                  to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes leadGlow {
                  0%, 100% { transform: translate3d(0,0,0) scale(1); opacity: 0.55; }
                  50% { transform: translate3d(18px,-12px,0) scale(1.08); opacity: 0.85; }
                }
                @keyframes leadBreathe {
                  0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 8px var(--lead-glow), 0 0 0 0 var(--lead-glow);
                  }
                  50% {
                    transform: scale(1.08);
                    box-shadow: 0 0 0 14px rgba(255,255,255,0), 0 0 28px 4px var(--lead-glow);
                  }
                }
                .lead-breath-dot {
                  position: relative;
                  animation: leadBreathe 2.8s ease-in-out infinite;
                  transform-origin: center;
                }
                .lead-stage-column {
                  transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease;
                }
                .lead-stage-column:hover {
                  transform: translateY(-4px);
                  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
                  border-color: rgba(9, 118, 188, 0.16);
                }
                .lead-modern-card {
                  animation: leadRise 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
                  transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease;
                }
                .lead-modern-card:hover {
                  transform: translateY(-5px);
                  box-shadow: 0 22px 52px rgba(15, 23, 42, 0.14);
                  border-color: rgba(9, 118, 188, 0.26);
                }
                .lead-status-picker {
                  position: relative;
                }
                .lead-status-trigger {
                  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
                }
                .lead-status-trigger:hover {
                  transform: translateY(-1px);
                  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.10);
                }
                .lead-status-menu {
                  animation: leadRise 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
                }
                .lead-status-option {
                  transition: background 180ms ease, transform 180ms ease;
                }
                .lead-status-option:hover {
                  transform: translateX(3px);
                }
              `}</style>

              <div style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '28px',
                padding: '28px',
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(7,12,22,0.96), rgba(9,118,188,0.42))'
                  : 'linear-gradient(135deg, #ffffff 0%, #eff8ff 48%, #f7fbff 100%)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(9,118,188,0.12)'}`,
                boxShadow: '0 28px 80px rgba(15,23,42,0.10)'
              }}>
                <div style={{
                  position: 'absolute',
                  right: '-80px',
                  top: '-110px',
                  width: '280px',
                  height: '280px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(9,118,188,0.26), rgba(9,118,188,0))',
                  animation: 'leadGlow 7s ease-in-out infinite'
                }} />
                <div style={{
                  position: 'absolute',
                  left: '48%',
                  bottom: '-130px',
                  width: '330px',
                  height: '330px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(16,185,129,0.18), rgba(16,185,129,0))',
                  animation: 'leadGlow 8s ease-in-out infinite reverse'
                }} />

                <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) repeat(3, minmax(160px, 0.35fr))', gap: '18px', alignItems: 'stretch' }}>
                  <div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '999px',
                      background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(9,118,188,0.10)',
                      color: darkMode ? '#dbeafe' : '#075985',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      letterSpacing: '0.02em',
                      marginBottom: '14px'
                    }}>
                      <Activity size={14} /> LIVE PIPELINE
                    </span>
                    <h2 style={{ fontSize: '2.2rem', lineHeight: 1.02, fontWeight: 900, color: theme.text, margin: 0, letterSpacing: '-0.045em' }}>
                      Website OEM & B2B Leads Funnel
                    </h2>
                    <p style={{ margin: '10px 0 0', fontSize: '0.95rem', color: theme.muted, maxWidth: '620px', lineHeight: 1.6 }}>
                      Move high-value hospital, distributor, and OEM opportunities through a visual revenue pipeline.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowNewLeadModal(true)}
                      style={{
                        marginTop: '18px',
                        height: '44px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '9px',
                        padding: '0 18px',
                        borderRadius: '999px',
                        border: '1px solid rgba(9,118,188,0.22)',
                        background: darkMode ? 'rgba(255,255,255,0.09)' : 'linear-gradient(135deg, #0976BC, #0ea5e9)',
                        color: '#ffffff',
                        fontSize: '0.84rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow: '0 16px 34px rgba(9,118,188,0.24)',
                        transition: 'transform 220ms ease, box-shadow 220ms ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 20px 44px rgba(9,118,188,0.30)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 16px 34px rgba(9,118,188,0.24)';
                      }}
                    >
                      <Plus size={17} /> Add Lead
                    </button>
                  </div>

                  {[
                    { label: 'Open pipeline', value: `INR ${formatNumber(pipelineValue)}`, icon: Briefcase, color: '#0976BC' },
                    { label: 'Weighted forecast', value: `INR ${formatNumber(Math.round(weightedForecast))}`, icon: TrendingUp, color: '#10b981' },
                    { label: 'Closed won', value: `INR ${formatNumber(wonRevenue)}`, icon: CheckCircle2, color: '#f59e0b' }
                  ].map((metric) => {
                    const MetricIcon = metric.icon;
                    return (
                      <div key={metric.label} style={{
                        padding: '18px',
                        borderRadius: '22px',
                        background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.76)',
                        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.82)'}`,
                        boxShadow: '0 18px 45px rgba(15,23,42,0.08)',
                        backdropFilter: 'blur(18px)'
                      }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: metric.color, background: `${metric.color}18`, marginBottom: '18px' }}>
                          <MetricIcon size={18} />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: theme.muted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{metric.label}</div>
                        <div style={{ marginTop: '6px', color: theme.text, fontSize: '1.05rem', fontWeight: 900 }}>{metric.value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {showNewLeadModal && (
                <div style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 1200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  background: 'rgba(2, 6, 23, 0.46)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <form onSubmit={createLead} style={{
                    width: 'min(680px, 100%)',
                    borderRadius: '30px',
                    padding: '24px',
                    background: darkMode ? 'rgba(15,23,42,0.98)' : '#ffffff',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.10)' : 'rgba(226,232,240,0.95)'}`,
                    boxShadow: '0 34px 90px rgba(15,23,42,0.30)',
                    animation: 'leadRise 260ms cubic-bezier(0.22, 1, 0.36, 1) both'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '18px', marginBottom: '20px' }}>
                      <div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 10px', borderRadius: '999px', background: 'rgba(9,118,188,0.10)', color: '#0976BC', fontSize: '0.7rem', fontWeight: 900, marginBottom: '10px' }}>
                          <Plus size={14} /> NEW OPPORTUNITY
                        </span>
                        <h3 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 950, color: theme.text, letterSpacing: '-0.03em' }}>Add pipeline lead</h3>
                        <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: theme.muted }}>Create a new OEM or B2B opportunity card.</p>
                      </div>
                      <button type="button" onClick={() => setShowNewLeadModal(false)} style={{ width: '38px', height: '38px', borderRadius: '14px', border: '1px solid rgba(148,163,184,0.28)', background: darkMode ? 'rgba(255,255,255,0.06)' : '#f8fafc', color: theme.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={18} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
                      {[
                        { key: 'company', label: 'Company', placeholder: 'Hospital / distributor name' },
                        { key: 'name', label: 'Contact Person', placeholder: 'Decision maker name' },
                        { key: 'email', label: 'Email', placeholder: 'email@company.com' },
                        { key: 'phone', label: 'Phone', placeholder: '+91 90000 00000' },
                        { key: 'website', label: 'Website Link', placeholder: 'https://company.com' },
                        { key: 'amount', label: 'Deal Value', placeholder: '1500000', type: 'number' }
                      ].map((field) => (
                        <label key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '0.76rem', color: theme.muted, fontWeight: 850 }}>
                          {field.label}
                          <input
                            type={field.type || 'text'}
                            value={newLead[field.key]}
                            onChange={(e) => setNewLead({ ...newLead, [field.key]: e.target.value })}
                            placeholder={field.placeholder}
                            style={{
                              height: '44px',
                              borderRadius: '15px',
                              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.10)' : '#dbe4ee'}`,
                              background: darkMode ? 'rgba(2,6,23,0.55)' : '#f8fafc',
                              color: theme.text,
                              padding: '0 13px',
                              fontSize: '0.86rem',
                              fontWeight: 750,
                              outline: 'none'
                            }}
                          />
                        </label>
                      ))}

                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '22px' }}>
                      <button type="button" onClick={() => setShowNewLeadModal(false)} style={{ height: '44px', padding: '0 18px', borderRadius: '999px', border: '1px solid rgba(148,163,184,0.30)', background: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc', color: theme.text, fontWeight: 850, cursor: 'pointer' }}>
                        Cancel
                      </button>
                      <button type="submit" style={{ height: '44px', padding: '0 20px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #0976BC, #10b981)', color: '#ffffff', fontWeight: 950, cursor: 'pointer', boxShadow: '0 16px 32px rgba(9,118,188,0.24)' }}>
                        Add Lead
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {leadToDelete && (
                <div style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 1250,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  background: 'rgba(2, 6, 23, 0.50)',
                  backdropFilter: 'blur(12px)'
                }}>
                  <div style={{
                    width: 'min(460px, 100%)',
                    borderRadius: '30px',
                    padding: '24px',
                    background: darkMode ? 'rgba(15,23,42,0.98)' : '#ffffff',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.10)' : 'rgba(254,202,202,0.95)'}`,
                    boxShadow: '0 34px 90px rgba(15,23,42,0.34)',
                    animation: 'leadRise 240ms cubic-bezier(0.22, 1, 0.36, 1) both'
                  }}>
                    <div style={{ width: '54px', height: '54px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(254,226,226,0.95), rgba(255,247,237,0.95))', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 18px 34px rgba(239,68,68,0.15)' }}>
                      <Trash2 size={23} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 950, color: theme.text, letterSpacing: '-0.03em' }}>Delete this lead?</h3>
                    <p style={{ margin: '9px 0 0', color: theme.muted, fontSize: '0.9rem', lineHeight: 1.55 }}>
                      This will remove <strong style={{ color: theme.text }}>{leadToDelete.company}</strong> from the funnel. This action cannot be undone.
                    </p>

                    <div style={{
                      marginTop: '18px',
                      padding: '14px',
                      borderRadius: '18px',
                      background: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`
                    }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 900 }}>{leadToDelete.id}</div>
                      <div style={{ marginTop: '4px', color: theme.text, fontWeight: 900 }}>{leadToDelete.name}</div>
                      <div style={{ marginTop: '3px', color: theme.muted, fontSize: '0.8rem', fontWeight: 750 }}>INR {formatNumber(leadToDelete.amount)}</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '22px' }}>
                      <button type="button" onClick={() => setLeadToDelete(null)} style={{ height: '44px', padding: '0 18px', borderRadius: '999px', border: '1px solid rgba(148,163,184,0.30)', background: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc', color: theme.text, fontWeight: 850, cursor: 'pointer' }}>
                        Cancel
                      </button>
                      <button type="button" onClick={deleteLead} style={{ height: '44px', padding: '0 20px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #ef4444, #f97316)', color: '#ffffff', fontWeight: 950, cursor: 'pointer', boxShadow: '0 16px 32px rgba(239,68,68,0.24)' }}>
                        Delete Lead
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))', gap: '18px', alignItems: 'stretch' }}>
                <div style={{
                  borderRadius: '28px',
                  padding: '20px',
                  background: darkMode ? 'rgba(15,23,42,0.86)' : '#ffffff',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                  boxShadow: '0 20px 54px rgba(15,23,42,0.10)'
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hot account</span>
                  <h3 style={{ margin: '9px 0 8px', fontSize: '1.2rem', lineHeight: 1.2, fontWeight: 950, color: theme.text }}>{topLead.company}</h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: theme.muted, lineHeight: 1.55 }}>
                    Highest value opportunity in the board. Keep quotation, sample dispatch, and follow-up tasks moving together.
                  </p>
                  <div style={{ marginTop: '16px', height: '9px', borderRadius: '999px', background: '#e5e7eb', overflow: 'hidden' }}>
                    <div style={{ width: '78%', height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #f59e0b, #10b981, #0976BC)' }} />
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 850, color: theme.muted }}>
                    <span>Deal pulse</span>
                    <span>78%</span>
                  </div>
                </div>

                <div style={{
                  borderRadius: '28px',
                  padding: '20px',
                  background: darkMode ? 'rgba(15,23,42,0.86)' : 'linear-gradient(180deg, #ffffff, #f8fbff)',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                  boxShadow: '0 20px 54px rgba(15,23,42,0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 950, color: theme.text }}>Smart actions</h3>
                    <RefreshCw size={16} color="#0976BC" />
                  </div>
                  {[
                    'Send sample kit reminder to qualified leads',
                    'Create proposal follow-up for OEM accounts',
                    'Flag lost deals for price objection review'
                  ].map((action) => (
                    <div key={action} style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                      padding: '12px 0',
                      borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eef2f7'}`
                    }}>
                      <CheckCircle2 size={16} color="#10b981" style={{ flex: '0 0 auto', marginTop: '2px' }} />
                      <span style={{ fontSize: '0.8rem', lineHeight: 1.45, color: theme.muted, fontWeight: 750 }}>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '18px', alignItems: 'start' }}>
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '4px 4px 18px' }}>
                  {leadStages.map((stage) => {
                    const columnLeads = leads.filter((lead) => lead.status === stage.label);
                    const columnValue = columnLeads.reduce((sum, lead) => sum + lead.amount, 0);
                    return (
                      <div key={stage.label} className="lead-stage-column" style={{
                        minWidth: '282px',
                        minHeight: '520px',
                        borderRadius: '28px',
                        padding: '16px',
                        background: darkMode ? 'rgba(15,23,42,0.78)' : 'linear-gradient(180deg, rgba(248,251,255,0.98), rgba(238,245,252,0.88))',
                        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.16)'}`,
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75)',
                        overflow: 'visible'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="lead-breath-dot" style={{ '--lead-glow': stage.glow, width: '10px', height: '10px', borderRadius: '999px', background: stage.color, boxShadow: `0 0 0 8px ${stage.glow}` }} />
                              <span style={{ fontWeight: 900, fontSize: '0.92rem', color: theme.text }}>{stage.label}</span>
                            </div>
                            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: theme.muted, fontWeight: 700 }}>
                              INR {formatNumber(columnValue)}
                            </div>
                          </div>
                          <span style={{
                            background: stage.glow,
                            color: stage.color,
                            fontSize: '0.72rem',
                            fontWeight: 900,
                            borderRadius: '999px',
                            minWidth: '32px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {columnLeads.length}
                          </span>
                        </div>

                        <div style={{ height: '7px', borderRadius: '999px', background: darkMode ? 'rgba(255,255,255,0.08)' : '#e5eaf0', overflow: 'hidden', marginBottom: '16px' }}>
                          <div style={{ width: `${Math.max(stage.probability, 6)}%`, height: '100%', borderRadius: '999px', background: `linear-gradient(90deg, ${stage.color}, #10b981)` }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          {columnLeads.length === 0 && (
                            <div style={{
                              height: '170px',
                              borderRadius: '22px',
                              border: `1px dashed ${darkMode ? 'rgba(255,255,255,0.16)' : 'rgba(148,163,184,0.42)'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: theme.muted,
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              textAlign: 'center',
                              padding: '18px'
                            }}>
                              Ready for the next opportunity
                            </div>
                          )}

                          {columnLeads.map((lead, index) => (
                            <div key={lead.id} className="lead-modern-card" style={{
                              animationDelay: `${index * 70}ms`,
                              padding: '16px',
                              borderRadius: '24px',
                              background: darkMode ? 'rgba(2,6,23,0.72)' : 'rgba(255,255,255,0.92)',
                              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(226,232,240,0.95)'}`,
                              boxShadow: '0 16px 38px rgba(15,23,42,0.09)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px',
                              position: 'relative',
                              zIndex: openLeadStatusMenu === lead.id ? 100 : 1,
                              overflow: 'visible'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 900 }}>{lead.id}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                  <span style={{ fontSize: '0.68rem', color: stage.color, background: stage.glow, borderRadius: '999px', padding: '5px 8px', fontWeight: 900 }}>
                                    {stage.probability}% fit
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setLeadToDelete(lead)}
                                    title="Delete lead"
                                    style={{
                                      width: '28px',
                                      height: '28px',
                                      borderRadius: '11px',
                                      border: '1px solid rgba(239,68,68,0.16)',
                                      background: darkMode ? 'rgba(239,68,68,0.10)' : 'rgba(254,242,242,0.92)',
                                      color: '#ef4444',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      boxShadow: '0 10px 22px rgba(239,68,68,0.08)',
                                      transition: 'transform 180ms ease, background 180ms ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.transform = 'translateY(-1px) scale(1.04)';
                                      e.currentTarget.style.background = 'rgba(254,226,226,0.98)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                      e.currentTarget.style.background = darkMode ? 'rgba(239,68,68,0.10)' : 'rgba(254,242,242,0.92)';
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              <h4 style={{ fontSize: '0.98rem', lineHeight: 1.24, fontWeight: 900, color: theme.text, margin: 0 }}>{lead.company}</h4>

                              <div style={{ display: 'grid', gap: '8px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: theme.muted, fontWeight: 700 }}>
                                  <Users size={14} color={stage.color} /> {lead.name}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: theme.muted, fontWeight: 700 }}>
                                  <Globe size={14} color={stage.color} /> {lead.source}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: theme.muted, fontWeight: 700 }}>
                                  <Phone size={14} color={stage.color} /> {lead.phone}
                                </span>
                                {lead.website && (
                                  <a
                                    href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: stage.color, fontWeight: 850, textDecoration: 'none' }}
                                  >
                                    <ExternalLink size={14} color={stage.color} /> Website
                                  </a>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eef2f7'}` }}>
                                <div>
                                  <div style={{ fontSize: '0.68rem', color: theme.muted, fontWeight: 800, textTransform: 'uppercase' }}>Deal value</div>
                                  <div style={{ marginTop: '3px', fontSize: '1rem', fontWeight: 950, color: stage.color }}>INR {formatNumber(lead.amount)}</div>
                                </div>
                                <ArrowUpRight size={18} color={stage.color} />
                              </div>

                              <div className="lead-status-picker" style={{ zIndex: openLeadStatusMenu === lead.id ? 120 : 2 }}>
                                <button
                                  type="button"
                                  className="lead-status-trigger"
                                  onClick={() => setOpenLeadStatusMenu(openLeadStatusMenu === lead.id ? null : lead.id)}
                                  style={{
                                    width: '100%',
                                    minHeight: '42px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px',
                                    fontSize: '0.78rem',
                                    fontWeight: 900,
                                    padding: '10px 12px',
                                    border: `1px solid ${stage.color}3d`,
                                    borderRadius: '16px',
                                    color: theme.text,
                                    background: darkMode ? 'rgba(15,23,42,0.9)' : `linear-gradient(135deg, #ffffff, ${stage.glow})`,
                                    outline: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                                    <span style={{ width: '9px', height: '9px', borderRadius: '999px', background: stage.color, boxShadow: `0 0 0 5px ${stage.glow}` }} />
                                    {lead.status}
                                  </span>
                                  <ChevronDown size={16} color={stage.color} style={{ transform: openLeadStatusMenu === lead.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 180ms ease' }} />
                                </button>

                                {openLeadStatusMenu === lead.id && (
                                  <div className="lead-status-menu" style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: 'calc(100% + 8px)',
                                    zIndex: 999,
                                    padding: '8px',
                                    borderRadius: '18px',
                                    background: darkMode ? 'rgba(2,6,23,0.98)' : 'rgba(255,255,255,0.98)',
                                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(226,232,240,0.95)'}`,
                                    boxShadow: '0 22px 46px rgba(15,23,42,0.18)',
                                    backdropFilter: 'blur(18px)'
                                  }}>
                                    {leadStages.map((item) => {
                                      const isSelected = item.label === lead.status;
                                      return (
                                        <button
                                          key={item.label}
                                          type="button"
                                          className="lead-status-option"
                                          onClick={() => {
                                            moveLeadStatus(lead.id, item.label);
                                            setOpenLeadStatusMenu(null);
                                          }}
                                          style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '10px',
                                            padding: '10px 11px',
                                            border: 0,
                                            borderRadius: '13px',
                                            color: isSelected ? item.color : theme.text,
                                            background: isSelected ? item.glow : 'transparent',
                                            cursor: 'pointer',
                                            fontSize: '0.78rem',
                                            fontWeight: isSelected ? 950 : 800,
                                            textAlign: 'left'
                                          }}
                                        >
                                          <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: item.color, boxShadow: `0 0 0 4px ${item.glow}` }} />
                                            {item.label}
                                          </span>
                                          {isSelected && <Check size={14} color={item.color} />}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'none', flexDirection: 'column', gap: '16px', position: 'sticky', top: '92px' }}>
                  <div style={{
                    borderRadius: '28px',
                    padding: '20px',
                    background: darkMode ? 'rgba(15,23,42,0.86)' : '#ffffff',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                    boxShadow: '0 20px 54px rgba(15,23,42,0.10)'
                  }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hot account</span>
                    <h3 style={{ margin: '9px 0 8px', fontSize: '1.2rem', lineHeight: 1.2, fontWeight: 950, color: theme.text }}>{topLead.company}</h3>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: theme.muted, lineHeight: 1.55 }}>
                      Highest value opportunity in the board. Keep quotation, sample dispatch, and follow-up tasks moving together.
                    </p>
                    <div style={{ marginTop: '16px', height: '9px', borderRadius: '999px', background: '#e5e7eb', overflow: 'hidden' }}>
                      <div style={{ width: '78%', height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #f59e0b, #10b981, #0976BC)' }} />
                    </div>
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 850, color: theme.muted }}>
                      <span>Deal pulse</span>
                      <span>78%</span>
                    </div>
                  </div>

                  <div style={{
                    borderRadius: '28px',
                    padding: '20px',
                    background: darkMode ? 'rgba(15,23,42,0.86)' : 'linear-gradient(180deg, #ffffff, #f8fbff)',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                    boxShadow: '0 20px 54px rgba(15,23,42,0.08)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 950, color: theme.text }}>Smart actions</h3>
                      <RefreshCw size={16} color="#0976BC" />
                    </div>
                    {[
                      'Send sample kit reminder to qualified leads',
                      'Create proposal follow-up for OEM accounts',
                      'Flag lost deals for price objection review'
                    ].map((action) => (
                      <div key={action} style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start',
                        padding: '12px 0',
                        borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eef2f7'}`
                      }}>
                        <CheckCircle2 size={16} color="#10b981" style={{ flex: '0 0 auto', marginTop: '2px' }} />
                        <span style={{ fontSize: '0.8rem', lineHeight: 1.45, color: theme.muted, fontWeight: 750 }}>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kanban columns */}
              <div style={{ display: 'none', gap: '16px', overflowX: 'auto', paddingBottom: '12px' }}>
                {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'].map((columnTitle) => {
                  const columnLeads = leads.filter(lead => lead.status === columnTitle);
                  return (
                    <div key={columnTitle} className="kanban-column" style={{ minWidth: '240px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#475569' }}>{columnTitle}</span>
                        <span style={{ 
                          backgroundColor: '#cbd5e1', 
                          color: '#1e293b', 
                          fontSize: '0.72rem', 
                          fontWeight: 'bold', 
                          borderRadius: '50%',
                          width: '20px', 
                          height: '20px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          {columnLeads.length}
                        </span>
                      </div>
                      
                      {columnLeads.map((lead) => (
                        <div key={lead.id} className="erp-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'default' }}>
                          <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 'bold' }}>{lead.id}</span>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{lead.company}</h4>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Person: {lead.name}</span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Source: {lead.source}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#0976BC' }}>₹{formatNumber(lead.amount)}</span>
                          
                          {/* Column move controls */}
                          <div style={{ display: 'flex', gap: '4px', justify: 'space-between', marginTop: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
                            <select 
                              value={lead.status}
                              onChange={(e) => moveLeadStatus(lead.id, e.target.value)}
                              style={{ width: '100%', fontSize: '0.7rem', padding: '2px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Qualified">Qualified</option>
                              <option value="Proposal Sent">Proposal Sent</option>
                              <option value="Won">Won</option>
                              <option value="Lost">Lost</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
            );
          })()}

          {/* TAB: WEBSITE CMS (LIVE REALTIME PREVIEW) */}
          {activeTab === 'Website CMS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Website Content Manager & Media</h2>
                <span style={{ fontSize: '0.8rem', color: '#71717a' }}>Visual side-by-side Live CMS editor sandbox</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px' }}>
                
                {/* Left: Input editing form */}
                <div className="erp-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>Home Hero CMS Editor</h3>
                  
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Hero Main Title Header</label>
                    <input 
                      type="text" 
                      value={cmsHome.heroTitle}
                      onChange={(e) => updateCmsHome({ heroTitle: e.target.value })}
                      onBlur={(e) => logSystemAction(`CMS Title edited: "${e.target.value.substring(0,25)}..."`)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Hero Subtext Description</label>
                    <textarea 
                      value={cmsHome.heroDesc}
                      onChange={(e) => updateCmsHome({ heroDesc: e.target.value })}
                      className="form-input"
                      style={{ minHeight: '80px', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>CTA Primary Label</label>
                      <input 
                        type="text" 
                        value={cmsHome.heroCtaPrimary}
                        onChange={(e) => updateCmsHome({ heroCtaPrimary: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>CTA Secondary Label</label>
                      <input 
                        type="text" 
                        value={cmsHome.heroCtaSecondary}
                        onChange={(e) => updateCmsHome({ heroCtaSecondary: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px', marginTop: '10px' }}>Home Hero Images CMS</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                    {(cmsHome.heroImages || DEFAULT_CMS_HOME.heroImages).slice(0, 3).map((imageSrc, index) => (
                      <div key={`hero-image-${index}`} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ height: '86px', borderRadius: '14px', overflow: 'hidden', border: '1px solid #dbe4ee', backgroundColor: '#f8fafc' }}>
                          <img loading="lazy" src={imageSrc} alt={`Hero CMS ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <input
                          type="text"
                          value={imageSrc}
                          onChange={(e) => updateCmsHeroImage(index, e.target.value)}
                          placeholder="/img/example.png or https://..."
                          className="form-input"
                          style={{ height: '38px', fontSize: '0.72rem' }}
                        />
                        <label style={{ height: '34px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#0976BC', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(9,118,188,0.16)' }}>
                          Upload Image
                          <input type="file" accept="image/*" onChange={(e) => uploadCmsImage('heroImages', e.target.files?.[0], index)} style={{ display: 'none' }} />
                        </label>
                      </div>
                    ))}
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px', marginTop: '10px' }}>About Page Text CMS</h3>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>About Section Body</label>
                    <textarea 
                      value={cmsHome.aboutText}
                      onChange={(e) => updateCmsHome({ aboutText: e.target.value })}
                      className="form-input"
                      style={{ minHeight: '100px', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>About Section Image</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '12px', alignItems: 'center' }}>
                      <div style={{ height: '96px', borderRadius: '14px', overflow: 'hidden', border: '1px solid #dbe4ee', backgroundColor: '#f8fafc' }}>
                        <img loading="lazy" src={cmsHome.aboutImage || DEFAULT_CMS_HOME.aboutImage} alt="About CMS" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                          type="text"
                          value={cmsHome.aboutImage || DEFAULT_CMS_HOME.aboutImage}
                          onChange={(e) => updateCmsHome({ aboutImage: e.target.value })}
                          placeholder="/img/about_factory_modern.png or https://..."
                          className="form-input"
                          style={{ height: '40px', fontSize: '0.76rem' }}
                        />
                        <label style={{ height: '36px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#0976BC', fontSize: '0.76rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(9,118,188,0.16)' }}>
                          Upload About Image
                          <input type="file" accept="image/*" onChange={(e) => uploadCmsImage('aboutImage', e.target.files?.[0])} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Live Sandboxed Visual preview */}
                <div className="erp-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', border: '2px solid #cbd5e1', backgroundColor: '#e2e8f0' }}>
                  <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                    <span>🖥️ LIVE MOBILE PREVIEW SANDBOX (REAL-TIME REACT PREVIEW)</span>
                    <span style={{ color: '#16a34a', fontWeight: 'bold' }}>● Ready / Synchronized</span>
                  </div>
                  
                  {/* Visual mockup frame */}
                  <div style={{ 
                    flex: 1, 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    padding: '24px', 
                    overflowY: 'auto',
                    maxHeight: '520px',
                    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
                  }}>
                    {/* Simulated website Header */}
                    <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '20px' }}>
                      <img loading="lazy" src="/img/bapuji logo.png" alt="Bapuji Logo" style={{ height: '20px' }} />
                      <div style={{ width: '18px', height: '18px', borderRadius: '4px', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column', gap: '3px', padding: '3px', boxSizing: 'border-box' }}>
                        <div style={{ width: '100%', height: '2px', backgroundColor: '#09090b' }} />
                        <div style={{ width: '100%', height: '2px', backgroundColor: '#09090b' }} />
                        <div style={{ width: '100%', height: '2px', backgroundColor: '#09090b' }} />
                      </div>
                    </div>

                    {/* Simulated website hero */}
                    <div style={{ 
                      backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,41,59,0.72) 100%), url("${(cmsHome.heroImages || DEFAULT_CMS_HOME.heroImages)[0]}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '12px', 
                      padding: '24px 16px', 
                      color: '#ffffff', 
                      textAlign: 'center',
                      marginBottom: '24px'
                    }}>
                      <span style={{ fontSize: '0.62rem', backgroundColor: '#334155', padding: '3px 8px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Dermatologically Tested
                      </span>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '10px 0', lineHeight: 1.25, color: '#ffffff' }}>
                        {cmsHome.heroTitle}
                      </h2>
                      <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4, margin: '0 0 16px 0' }}>
                        {cmsHome.heroDesc}
                      </p>
                      <div style={{ display: 'flex', justify: 'center', gap: '10px' }}>
                        <button style={{ backgroundColor: '#ffffff', color: '#09090b', padding: '6px 14px', borderRadius: '24px', fontSize: '0.72rem', fontWeight: 'bold', border: 'none' }}>
                          {cmsHome.heroCtaPrimary}
                        </button>
                        <button style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: '6px 14px', borderRadius: '24px', fontSize: '0.72rem', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' }}>
                          {cmsHome.heroCtaSecondary}
                        </button>
                      </div>
                    </div>

                    {/* Simulated About section */}
                    <div style={{ padding: '0 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <div style={{ width: '3px', height: '14px', backgroundColor: '#0976BC', borderRadius: '2px' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>About Us</span>
                      </div>
                      <p style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                        {cmsHome.aboutText}
                      </p>
                      <div style={{ marginTop: '14px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <img loading="lazy" src={cmsHome.aboutImage || DEFAULT_CMS_HOME.aboutImage} alt="About section preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: GOOGLE REVIEWS (GBP RESPONSE CONTEXT) */}
          {(activeTab === 'Google Reviews' || activeTab === 'Marketing Hub') && (() => {
            const avgRating = reviews.length ? reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length : 0;
            const repliedCount = reviews.filter((rev) => rev.reply).length;
            const pendingCount = reviews.length - repliedCount;
            const highIntentCount = reviews.filter((rev) => rev.rating >= 4).length;
            const ratingBreakdown = [5, 4, 3, 2, 1].map((rating) => ({
              rating,
              count: reviews.filter((rev) => rev.rating === rating).length
            }));
            const adPerformance = [
              { channel: 'Google Ads', spend: 128000, leads: 64, conversions: 18, roas: 4.6, cpl: 2000, status: 'Scaling well', color: '#0976BC', icon: Search },
              { channel: 'Meta Ads', spend: 94000, leads: 81, conversions: 14, roas: 3.2, cpl: 1160, status: 'Good lead volume', color: '#6366f1', icon: Smartphone },
              { channel: 'Organic Social', spend: 18000, leads: 22, conversions: 5, roas: 2.4, cpl: 818, status: 'Needs stronger content', color: '#10b981', icon: Users },
            ];
            const totalAdSpend = adPerformance.reduce((sum, item) => sum + item.spend, 0);
            const totalMarketingLeads = adPerformance.reduce((sum, item) => sum + item.leads, 0);
            const totalMarketingConversions = adPerformance.reduce((sum, item) => sum + item.conversions, 0);
            const blendedCpl = Math.round(totalAdSpend / Math.max(totalMarketingLeads, 1));
            const socialHealth = [
              { label: 'Instagram engagement', value: '6.8%', state: 'Healthy', color: '#10b981' },
              { label: 'Facebook reach', value: '42.4K', state: 'Stable', color: '#0976BC' },
              { label: 'LinkedIn B2B clicks', value: '1,284', state: 'Improving', color: '#6366f1' },
              { label: 'Content consistency', value: '3/wk', state: 'Needs push', color: '#f59e0b' },
            ];
            const ownerInsights = [
              { text: 'Google Ads is producing the strongest buyer intent. Keep budget active on OEM and hospital wet wipes keywords.', tone: '#10b981' },
              { text: 'Meta Ads has cheaper leads, but conversion quality is lower than Google. Retarget catalogue visitors.', tone: '#f59e0b' },
              { text: 'Organic social is improving awareness, but posting frequency should increase for consistent reach.', tone: '#0976BC' },
            ];

            return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Marketing, Ads & Reputation Command Center</h2>
                  <span style={{ fontSize: '0.8rem', color: '#71717a' }}>Owner overview for Google Ads, Meta Ads, social media, and Google reviews</span>
                </div>
              </div>

              <style>{`
                @keyframes reviewFloatIn {
                  from { opacity: 0; transform: translateY(18px) scale(0.985); filter: blur(8px); }
                  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                }
                @keyframes reviewPulse {
                  0%, 100% { transform: scale(1); opacity: 0.65; }
                  50% { transform: scale(1.08); opacity: 0.95; }
                }
                .review-modern-card {
                  animation: reviewFloatIn 560ms cubic-bezier(0.22, 1, 0.36, 1) both;
                  transition: transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease;
                }
                .review-modern-card:hover {
                  transform: translateY(-5px);
                  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.13);
                  border-color: rgba(9, 118, 188, 0.22);
                }
                .review-reply-input:focus {
                  border-color: rgba(9, 118, 188, 0.42) !important;
                  box-shadow: 0 0 0 4px rgba(9, 118, 188, 0.10);
                }
              `}</style>

              <div style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '30px',
                padding: '28px',
                background: darkMode ? 'linear-gradient(135deg, rgba(7,12,22,0.96), rgba(9,118,188,0.36))' : 'linear-gradient(135deg, #ffffff 0%, #fff7ed 42%, #eef8ff 100%)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(245,158,11,0.18)'}`,
                boxShadow: '0 28px 80px rgba(15,23,42,0.10)'
              }}>
                <div style={{ position: 'absolute', right: '-80px', top: '-90px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.25), rgba(245,158,11,0))', animation: 'reviewPulse 6s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', left: '46%', bottom: '-140px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(9,118,188,0.16), rgba(9,118,188,0))', animation: 'reviewPulse 7s ease-in-out infinite reverse' }} />

                <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) repeat(4, minmax(150px, 0.28fr))', gap: '18px', alignItems: 'stretch' }}>
                  <div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '999px', background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(245,158,11,0.12)', color: '#f59e0b', fontSize: '0.74rem', fontWeight: 900, marginBottom: '14px' }}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" /> OWNER MARKETING LIVE
                    </span>
                    <h2 style={{ fontSize: '2.15rem', lineHeight: 1.04, fontWeight: 950, color: theme.text, margin: 0, letterSpacing: '-0.045em' }}>
                      Marketing Performance & Reputation Hub
                    </h2>
                    <p style={{ margin: '10px 0 0', fontSize: '0.95rem', color: theme.muted, maxWidth: '640px', lineHeight: 1.6 }}>
                      See if ads, social content, and reviews are actually helping Bapuji generate quality wet wipes leads.
                    </p>
                  </div>

                  {[
                    { label: 'Ad spend', value: `INR ${formatNumber(totalAdSpend)}`, icon: CreditCard, color: '#0976BC' },
                    { label: 'Marketing leads', value: totalMarketingLeads, icon: Users, color: '#10b981' },
                    { label: 'Blended CPL', value: `INR ${formatNumber(blendedCpl)}`, icon: Percent, color: '#f59e0b' },
                    { label: 'Review rating', value: `${avgRating.toFixed(1)} / 5`, icon: Award, color: '#ef4444' }
                  ].map((metric) => {
                    const MetricIcon = metric.icon;
                    return (
                      <div key={metric.label} style={{ padding: '18px', borderRadius: '22px', background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.78)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.82)'}`, boxShadow: '0 18px 45px rgba(15,23,42,0.08)', backdropFilter: 'blur(18px)' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: metric.color, background: `${metric.color}18`, marginBottom: '16px' }}>
                          <MetricIcon size={18} />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: theme.muted, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{metric.label}</div>
                        <div style={{ marginTop: '6px', color: theme.text, fontSize: '1.12rem', fontWeight: 950 }}>{metric.value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) 0.85fr', gap: '18px', alignItems: 'stretch' }}>
                <div className="review-modern-card" style={{ borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.82)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.06rem', fontWeight: 950, color: theme.text }}>Paid Ads Performance</h3>
                      <span style={{ fontSize: '0.78rem', color: theme.muted, fontWeight: 750 }}>Google Ads, Meta Ads, and organic social lead quality overview.</span>
                    </div>
                    <span style={{ padding: '8px 10px', borderRadius: '999px', background: 'rgba(16,185,129,0.12)', color: '#10b981', fontSize: '0.74rem', fontWeight: 950 }}>
                      {totalMarketingConversions} conversions
                    </span>
                  </div>

                  <div style={{ display: 'grid', gap: '12px' }}>
                    {adPerformance.map((channel, index) => {
                      const ChannelIcon = channel.icon;
                      const leadShare = Math.min((channel.leads / Math.max(totalMarketingLeads, 1)) * 100, 100);
                      return (
                        <div key={channel.channel} style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) repeat(4, minmax(90px, 0.35fr))', gap: '12px', alignItems: 'center', padding: '15px', borderRadius: '22px', background: darkMode ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #f8fafc, #ffffff)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eef2f7'}`, animation: `reviewFloatIn 520ms ${index * 80}ms cubic-bezier(0.22, 1, 0.36, 1) both` }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '38px', height: '38px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: channel.color, background: `${channel.color}18` }}>
                                <ChannelIcon size={18} />
                              </div>
                              <div>
                                <strong style={{ color: theme.text, fontSize: '0.9rem' }}>{channel.channel}</strong>
                                <div style={{ marginTop: '4px', color: channel.color, fontSize: '0.72rem', fontWeight: 900 }}>{channel.status}</div>
                              </div>
                            </div>
                            <div style={{ marginTop: '12px', height: '8px', borderRadius: '999px', background: '#e5e7eb', overflow: 'hidden' }}>
                              <div style={{ width: `${leadShare}%`, height: '100%', borderRadius: '999px', background: `linear-gradient(90deg, ${channel.color}, #10b981)` }} />
                            </div>
                          </div>
                          <div><span style={{ color: theme.muted, fontSize: '0.68rem', fontWeight: 850 }}>Spend</span><strong style={{ display: 'block', color: theme.text, fontSize: '0.84rem' }}>INR {formatNumber(channel.spend)}</strong></div>
                          <div><span style={{ color: theme.muted, fontSize: '0.68rem', fontWeight: 850 }}>Leads</span><strong style={{ display: 'block', color: channel.color, fontSize: '0.9rem' }}>{channel.leads}</strong></div>
                          <div><span style={{ color: theme.muted, fontSize: '0.68rem', fontWeight: 850 }}>CPL</span><strong style={{ display: 'block', color: theme.text, fontSize: '0.84rem' }}>INR {formatNumber(channel.cpl)}</strong></div>
                          <div><span style={{ color: theme.muted, fontSize: '0.68rem', fontWeight: 850 }}>ROAS</span><strong style={{ display: 'block', color: channel.roas >= 3 ? '#10b981' : '#f59e0b', fontSize: '0.9rem' }}>{channel.roas}x</strong></div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="review-modern-card" style={{ borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.82)' : 'linear-gradient(180deg, #ffffff, #f8fbff)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
                  <h3 style={{ margin: 0, fontSize: '1.06rem', fontWeight: 950, color: theme.text }}>Social Media Health</h3>
                  <span style={{ display: 'block', marginTop: '4px', color: theme.muted, fontSize: '0.78rem', fontWeight: 750 }}>Is brand awareness moving in the right direction?</span>
                  <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
                    {socialHealth.map((item) => (
                      <div key={item.label} style={{ padding: '14px', borderRadius: '20px', background: darkMode ? 'rgba(255,255,255,0.04)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eef2f7'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                          <span style={{ color: theme.text, fontSize: '0.84rem', fontWeight: 900 }}>{item.label}</span>
                          <strong style={{ color: item.color, fontSize: '0.9rem' }}>{item.value}</strong>
                        </div>
                        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: item.color, background: `${item.color}12`, borderRadius: '999px', padding: '5px 8px', fontSize: '0.68rem', fontWeight: 900 }}>{item.state}</span>
                          <span style={{ width: '44%', height: '7px', borderRadius: '999px', background: '#e5e7eb', overflow: 'hidden' }}>
                            <span style={{ display: 'block', width: item.state === 'Needs push' ? '44%' : '76%', height: '100%', borderRadius: '999px', background: `linear-gradient(90deg, ${item.color}, #10b981)` }} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                {ownerInsights.map((insight, index) => (
                  <div key={insight.text} className="review-modern-card" style={{ animationDelay: `${index * 80}ms`, padding: '16px', borderRadius: '22px', background: `${insight.tone}10`, border: `1px solid ${insight.tone}22`, color: theme.text, display: 'flex', gap: '11px', alignItems: 'flex-start' }}>
                    <AlertTriangle size={17} color={insight.tone} style={{ flex: '0 0 auto', marginTop: '2px' }} />
                    <span style={{ fontSize: '0.82rem', lineHeight: 1.5, fontWeight: 780 }}>{insight.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '18px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reviews.map((rev, index) => {
                    const sentimentColor = rev.rating >= 4 ? '#10b981' : rev.rating === 3 ? '#f59e0b' : '#ef4444';
                    return (
                      <div key={rev.id} className="review-modern-card" style={{ animationDelay: `${index * 70}ms`, borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.82)' : 'rgba(255,255,255,0.94)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(226,232,240,0.9)'}`, boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '18px', background: `linear-gradient(135deg, ${sentimentColor}22, rgba(9,118,188,0.12))`, color: sentimentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '1rem', boxShadow: `0 14px 28px ${sentimentColor}18`, flex: '0 0 auto' }}>
                              {rev.name.substring(0, 1)}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.95rem', fontWeight: 950, color: theme.text }}>{rev.name}</span>
                                <span style={{ fontSize: '0.68rem', fontWeight: 900, color: sentimentColor, background: `${sentimentColor}14`, borderRadius: '999px', padding: '5px 8px' }}>
                                  {rev.rating >= 4 ? 'Positive' : rev.rating === 3 ? 'Watch' : 'Critical'}
                                </span>
                              </div>
                              <span style={{ display: 'block', marginTop: '4px', fontSize: '0.76rem', color: theme.muted, fontWeight: 750 }}>Reviewed: {rev.date}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', flex: '0 0 auto' }}>
                            {[...Array(5)].map((star, i) => (
                              <Star key={i} size={16} fill={i < rev.rating ? '#f59e0b' : 'none'} stroke={i < rev.rating ? '#f59e0b' : '#cbd5e1'} />
                            ))}
                          </div>
                        </div>

                        <p style={{ fontSize: '0.96rem', color: theme.text, lineHeight: 1.7, margin: '18px 0 0', fontWeight: 650 }}>
                          "{rev.review}"
                        </p>

                        <div style={{ marginTop: '16px', padding: '14px', borderRadius: '20px', background: darkMode ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #f8fafc, #ffffff)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e8eef5'}` }}>
                          {rev.reply ? (
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: theme.muted }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '12px', background: 'rgba(16,185,129,0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                                <CheckCircle2 size={16} />
                              </div>
                              <div style={{ fontSize: '0.84rem', lineHeight: 1.55 }}>
                                <strong style={{ color: theme.text }}>Official Public Response:</strong> {rev.reply}
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '10px', alignItems: 'center' }}>
                              <input
                                className="review-reply-input"
                                type="text"
                                placeholder="Draft public reply to this review..."
                                value={reviewReplies[rev.id] || ''}
                                onChange={(e) => setReviewReplies({ ...reviewReplies, [rev.id]: e.target.value })}
                                style={{ height: '44px', padding: '0 14px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '15px', outline: 'none', background: darkMode ? 'rgba(2,6,23,0.65)' : '#ffffff', color: theme.text, fontWeight: 750 }}
                              />
                              <button onClick={() => submitReviewReply(rev.id)} style={{ height: '44px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 16px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #0976BC, #10b981)', color: '#ffffff', fontSize: '0.78rem', fontWeight: 950, cursor: 'pointer', boxShadow: '0 14px 30px rgba(9,118,188,0.22)' }}>
                                <MessageSquare size={15} /> Post Reply
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ position: 'sticky', top: '92px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.86)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 20px 54px rgba(15,23,42,0.08)' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 950, color: theme.text }}>Rating mix</h3>
                    <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
                      {ratingBreakdown.map((row) => (
                        <div key={row.rating} style={{ display: 'grid', gridTemplateColumns: '34px 1fr 24px', gap: '10px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 900, color: theme.text }}>{row.rating}★</span>
                          <div style={{ height: '8px', borderRadius: '999px', background: '#e5e7eb', overflow: 'hidden' }}>
                            <div style={{ width: `${reviews.length ? (row.count / reviews.length) * 100 : 0}%`, height: '100%', borderRadius: '999px', background: row.rating >= 4 ? 'linear-gradient(90deg, #f59e0b, #10b981)' : 'linear-gradient(90deg, #f59e0b, #ef4444)' }} />
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 900, color: theme.muted }}>{row.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.86)' : 'linear-gradient(180deg, #ffffff, #f8fbff)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 20px 54px rgba(15,23,42,0.08)' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trust signal</span>
                    <h3 style={{ margin: '8px 0 8px', fontSize: '1.15rem', fontWeight: 950, color: theme.text }}>{highIntentCount} high-intent reviews</h3>
                    <p style={{ margin: 0, color: theme.muted, fontSize: '0.82rem', lineHeight: 1.55 }}>
                      Positive reviews are buyer-facing proof for OEM quality, dispatch reliability, and clinical packaging standards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Feed list */}
              <div style={{ display: 'none', flexDirection: 'column', gap: '20px' }}>
                {reviews.map((rev) => (
                  <div key={rev.id} className="erp-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#cbd5e1', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                          {rev.name.substring(0, 1)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{rev.name}</span>
                          <span style={{ fontSize: '0.7rem', color: '#71717a' }}>Reviewed: {rev.date}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                        {[...Array(5)].map((star, i) => (
                          <Star key={i} size={14} fill={i < rev.rating ? '#f59e0b' : 'none'} stroke={i < rev.rating ? 'none' : '#cbd5e1'} />
                        ))}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#3f3f46', lineHeight: 1.5, margin: 0 }}>
                      "{rev.review}"
                    </p>

                    {/* Official public reply box */}
                    <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                      {rev.reply ? (
                        <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                          💬 <strong>Official Public Response:</strong> {rev.reply}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <input 
                            type="text" 
                            placeholder="Draft public reply to this review..."
                            value={reviewReplies[rev.id] || ''}
                            onChange={(e) => setReviewReplies({ ...reviewReplies, [rev.id]: e.target.value })}
                            style={{ flex: 1, padding: '8px 12px', fontSize: '0.78rem', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
                          />
                          <button 
                            onClick={() => submitReviewReply(rev.id)}
                            className="btn btn-primary"
                            style={{ padding: '8px 14px', fontSize: '0.72rem' }}
                          >
                            Post Reply
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
            );
          })()}

          {/* TAB: FINANCE */}
          {activeTab === 'Finance' && (() => {
            const openAr = financeArLedger.filter((invoice) => invoice.status !== 'Collected');
            const openAp = financeApLedger.filter((bill) => bill.status !== 'Paid');
            const liveArTotal = openAr.reduce((sum, invoice) => sum + invoice.amount, 0);
            const liveApTotal = openAp.reduce((sum, bill) => sum + bill.amount, 0);
            const overdueAr = financeArLedger.filter((invoice) => invoice.status === 'Overdue').reduce((sum, invoice) => sum + invoice.amount, 0);
            const pendingApprovalAp = financeApLedger.filter((bill) => bill.status === 'Approval Needed').length;
            const netCashExposure = liveArTotal - liveApTotal;
            const pnlRows = financePnlRows;
            const ownerDailySummary = financeOwnerSummary.map((item) => ({
              ...item,
              value: item.computed === 'ar' ? liveArTotal : item.computed === 'ap' ? liveApTotal : item.value
            }));
            const bankAccounts = financeBankAccounts;
            const projectProfitability = financeProjects;
            const approvalItems = financeApprovals;
            const smartAlerts = financeAlerts;
            const recentTransactions = financeTransactions;
            const financeInputStyle = {
              width: '100%',
              minWidth: 0,
              height: '34px',
              borderRadius: '11px',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : '#dbe4ee'}`,
              background: darkMode ? 'rgba(2,6,23,0.62)' : '#ffffff',
              color: theme.text,
              padding: '0 9px',
              fontSize: '0.76rem',
              fontWeight: 800,
              outline: 'none'
            };

            return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Financial Ledger & Receivables/Payables</h2>
                <span style={{ fontSize: '0.8rem', color: '#71717a' }}>Profit & Loss reports and raw material supplier invoices</span>
              </div>

              <style>{`
                @keyframes financeRise {
                  from { opacity: 0; transform: translateY(18px) scale(0.985); filter: blur(8px); }
                  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                }
                @keyframes financeOrbit {
                  0%, 100% { transform: translate3d(0,0,0) scale(1); opacity: 0.55; }
                  50% { transform: translate3d(16px,-12px,0) scale(1.08); opacity: 0.9; }
                }
                .finance-card {
                  animation: financeRise 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
                  transition: transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease;
                }
                .finance-card:hover {
                  transform: translateY(-4px);
                  box-shadow: 0 26px 70px rgba(15, 23, 42, 0.13);
                  border-color: rgba(9, 118, 188, 0.20);
                }
                .finance-action {
                  transition: transform 180ms ease, box-shadow 180ms ease;
                }
                .finance-action:hover {
                  transform: translateY(-1px);
                  box-shadow: 0 14px 30px rgba(9, 118, 188, 0.18);
                }
                .finance-balanced-row {
                  align-items: stretch;
                }
                .finance-module-card {
                  min-height: 360px;
                  height: 360px;
                  display: flex;
                  flex-direction: column;
                  overflow: hidden;
                }
                .finance-module-card.is-compact {
                  min-height: 320px;
                  height: 320px;
                }
                .finance-module-body {
                  flex: 1;
                  overflow-y: auto;
                  padding-right: 2px;
                }
                .finance-module-body::-webkit-scrollbar {
                  width: 6px;
                }
                .finance-module-body::-webkit-scrollbar-thumb {
                  background: rgba(9, 118, 188, 0.22);
                  border-radius: 999px;
                }
              `}</style>

              <div className="finance-card" style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '30px',
                padding: '28px',
                background: darkMode ? 'linear-gradient(135deg, rgba(7,12,22,0.96), rgba(9,118,188,0.34))' : 'linear-gradient(135deg, #ffffff 0%, #eef8ff 48%, #f7fff8 100%)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(9,118,188,0.12)'}`,
                boxShadow: '0 28px 80px rgba(15,23,42,0.10)'
              }}>
                <div style={{ position: 'absolute', right: '-90px', top: '-110px', width: '290px', height: '290px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.20), rgba(16,185,129,0))', animation: 'financeOrbit 7s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', left: '48%', bottom: '-150px', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(9,118,188,0.18), rgba(9,118,188,0))', animation: 'financeOrbit 8s ease-in-out infinite reverse' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) repeat(4, minmax(150px, 0.28fr))', gap: '18px', alignItems: 'stretch' }}>
                  <div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '999px', background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(9,118,188,0.10)', color: '#0976BC', fontSize: '0.74rem', fontWeight: 900, marginBottom: '14px' }}>
                      <CreditCard size={14} /> ACCOUNTING OPERATIONS
                    </span>
                    <h2 style={{ margin: 0, fontSize: '2.15rem', lineHeight: 1.04, fontWeight: 950, color: theme.text, letterSpacing: '-0.045em' }}>
                      Finance Control Room
                    </h2>
                    <p style={{ margin: '10px 0 0', maxWidth: '650px', color: theme.muted, fontSize: '0.95rem', lineHeight: 1.6 }}>
                      AR collections, AP approvals, payment scheduling, GST watch, and accountant audit tasks in one workspace.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFinanceEditMode(prev => !prev);
                        logSystemAction(`Finance accountant edit mode ${financeEditMode ? 'disabled' : 'enabled'}`);
                      }}
                      style={{
                        marginTop: '16px',
                        height: '42px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '9px',
                        padding: '0 16px',
                        borderRadius: '999px',
                        border: `1px solid ${financeEditMode ? 'rgba(16,185,129,0.28)' : 'rgba(9,118,188,0.18)'}`,
                        background: financeEditMode ? 'linear-gradient(135deg, #10b981, #0976BC)' : '#eff6ff',
                        color: financeEditMode ? '#ffffff' : '#0976BC',
                        fontSize: '0.78rem',
                        fontWeight: 950,
                        cursor: 'pointer',
                        boxShadow: financeEditMode ? '0 16px 34px rgba(16,185,129,0.22)' : 'none'
                      }}
                    >
                      <Edit3 size={15} /> {financeEditMode ? 'Editing Enabled' : 'Edit Finance Data'}
                    </button>
                  </div>

                  {[
                    { label: 'Receivable open', value: `INR ${formatNumber(liveArTotal)}`, icon: TrendingUp, color: '#ca8a04' },
                    { label: 'Payable open', value: `INR ${formatNumber(liveApTotal)}`, icon: TrendingDown, color: '#ef4444' },
                    { label: 'Cash exposure', value: `INR ${formatNumber(netCashExposure)}`, icon: DollarSign, color: netCashExposure >= 0 ? '#10b981' : '#ef4444' },
                    { label: 'AP approvals', value: pendingApprovalAp, icon: ShieldAlert, color: '#0976BC' }
                  ].map((metric) => {
                    const MetricIcon = metric.icon;
                    return (
                      <div key={metric.label} style={{ padding: '18px', borderRadius: '22px', background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.78)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.82)'}`, boxShadow: '0 18px 45px rgba(15,23,42,0.08)', backdropFilter: 'blur(18px)' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: metric.color, background: `${metric.color}18`, marginBottom: '16px' }}>
                          <MetricIcon size={18} />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: theme.muted, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{metric.label}</div>
                        <div style={{ marginTop: '6px', color: theme.text, fontSize: '1.08rem', fontWeight: 950 }}>{metric.value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '18px', alignItems: 'start' }}>
                <div style={{ display: 'grid', gap: '18px' }}>
                  <div className="finance-card" style={{ borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.82)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 950, color: theme.text }}>Accounts Receivable Work Queue</h3>
                        <span style={{ fontSize: '0.78rem', color: theme.muted, fontWeight: 750 }}>Aging, collection priority, customer follow-up, receipt posting</span>
                      </div>
                      <span style={{ padding: '8px 10px', borderRadius: '999px', background: 'rgba(202,138,4,0.12)', color: '#ca8a04', fontSize: '0.75rem', fontWeight: 900 }}>Overdue INR {formatNumber(overdueAr)}</span>
                    </div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {financeArLedger.map((invoice, index) => {
                        const statusColor = invoice.status === 'Collected' ? '#10b981' : invoice.status === 'Overdue' ? '#ef4444' : invoice.status === 'Due Soon' ? '#f59e0b' : '#0976BC';
                        return (
                          <div key={invoice.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) 140px 130px auto', gap: '14px', alignItems: 'center', padding: '15px', borderRadius: '20px', background: darkMode ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #f8fafc, #ffffff)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eef2f7'}`, animation: `financeRise 520ms ${index * 70}ms cubic-bezier(0.22, 1, 0.36, 1) both` }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <strong style={{ color: theme.text, fontSize: '0.9rem' }}>{invoice.customer}</strong>
                                <span style={{ fontSize: '0.68rem', color: statusColor, background: `${statusColor}14`, borderRadius: '999px', padding: '5px 8px', fontWeight: 900 }}>{invoice.status}</span>
                              </div>
                              <div style={{ marginTop: '5px', color: theme.muted, fontSize: '0.76rem', fontWeight: 750 }}>{invoice.id} • Due {invoice.dueDate} • {invoice.notes}</div>
                            </div>
                            <strong style={{ color: statusColor, fontSize: '0.95rem' }}>INR {formatNumber(invoice.amount)}</strong>
                            <span style={{ color: theme.muted, fontSize: '0.76rem', fontWeight: 800 }}>{invoice.owner}</span>
                            <button className="finance-action" onClick={() => updateArInvoiceStatus(invoice.id, invoice.status === 'Collected' ? 'Open' : 'Collected')} style={{ height: '38px', padding: '0 14px', borderRadius: '999px', border: 'none', background: invoice.status === 'Collected' ? '#e5e7eb' : 'linear-gradient(135deg, #10b981, #0976BC)', color: invoice.status === 'Collected' ? '#334155' : '#ffffff', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>
                              {invoice.status === 'Collected' ? 'Reopen' : 'Post Receipt'}
                            </button>
                            {financeEditMode && (
                              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1.2fr 120px 120px 110px 1fr', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                                <input value={invoice.customer} onChange={(e) => updateFinanceById(setFinanceArLedger, 'id', invoice.id, { customer: e.target.value })} style={financeInputStyle} />
                                <input type="number" value={invoice.amount} onChange={(e) => updateFinanceById(setFinanceArLedger, 'id', invoice.id, { amount: Number(e.target.value) || 0 })} style={financeInputStyle} />
                                <input value={invoice.dueDate} onChange={(e) => updateFinanceById(setFinanceArLedger, 'id', invoice.id, { dueDate: e.target.value })} style={financeInputStyle} />
                                <select value={invoice.status} onChange={(e) => updateFinanceById(setFinanceArLedger, 'id', invoice.id, { status: e.target.value })} style={financeInputStyle}>
                                  <option value="Open">Open</option>
                                  <option value="Due Soon">Due Soon</option>
                                  <option value="Overdue">Overdue</option>
                                  <option value="Collected">Collected</option>
                                </select>
                                <input value={invoice.notes} onChange={(e) => updateFinanceById(setFinanceArLedger, 'id', invoice.id, { notes: e.target.value })} style={financeInputStyle} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="finance-card" style={{ borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.82)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 950, color: theme.text }}>Accounts Payable Payment Run</h3>
                        <span style={{ fontSize: '0.78rem', color: theme.muted, fontWeight: 750 }}>Vendor bills, GL coding, matching status, approval routing</span>
                      </div>
                      <button onClick={() => triggerSpreadsheetExport('csv', 'finance')} className="finance-action" style={{ height: '38px', padding: '0 14px', borderRadius: '999px', border: '1px solid rgba(9,118,188,0.18)', background: '#eff6ff', color: '#0976BC', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>
                        Export Ledger
                      </button>
                    </div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {financeApLedger.map((bill, index) => {
                        const statusColor = bill.status === 'Paid' ? '#10b981' : bill.status === 'Scheduled' ? '#0976BC' : '#f59e0b';
                        return (
                          <div key={bill.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) 135px 150px auto', gap: '14px', alignItems: 'center', padding: '15px', borderRadius: '20px', background: darkMode ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #ffffbf, #ffffff)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eef2f7'}`, animation: `financeRise 520ms ${index * 80}ms cubic-bezier(0.22, 1, 0.36, 1) both` }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <strong style={{ color: theme.text, fontSize: '0.9rem' }}>{bill.vendor}</strong>
                                <span style={{ fontSize: '0.68rem', color: statusColor, background: `${statusColor}14`, borderRadius: '999px', padding: '5px 8px', fontWeight: 900 }}>{bill.status}</span>
                              </div>
                              <div style={{ marginTop: '5px', color: theme.muted, fontSize: '0.76rem', fontWeight: 750 }}>{bill.id} • {bill.gl} • {bill.match}</div>
                            </div>
                            <strong style={{ color: statusColor, fontSize: '0.95rem' }}>INR {formatNumber(bill.amount)}</strong>
                            <span style={{ color: theme.muted, fontSize: '0.76rem', fontWeight: 800 }}>Due {bill.dueDate}</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {bill.status === 'Approval Needed' && (
                                <button className="finance-action" onClick={() => updateApBillStatus(bill.id, 'Scheduled')} style={{ height: '36px', padding: '0 12px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #0976BC, #6366f1)', color: '#ffffff', fontSize: '0.72rem', fontWeight: 900, cursor: 'pointer' }}>Approve</button>
                              )}
                              {bill.status === 'Scheduled' && (
                                <button className="finance-action" onClick={() => updateApBillStatus(bill.id, 'Paid')} style={{ height: '36px', padding: '0 12px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #10b981, #0976BC)', color: '#ffffff', fontSize: '0.72rem', fontWeight: 900, cursor: 'pointer' }}>Pay</button>
                              )}
                              {bill.status === 'Paid' && <CheckCircle2 size={20} color="#10b981" />}
                            </div>
                            {financeEditMode && (
                              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1.1fr 120px 120px 1fr 130px', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                                <input value={bill.vendor} onChange={(e) => updateFinanceById(setFinanceApLedger, 'id', bill.id, { vendor: e.target.value })} style={financeInputStyle} />
                                <input type="number" value={bill.amount} onChange={(e) => updateFinanceById(setFinanceApLedger, 'id', bill.id, { amount: Number(e.target.value) || 0 })} style={financeInputStyle} />
                                <input value={bill.dueDate} onChange={(e) => updateFinanceById(setFinanceApLedger, 'id', bill.id, { dueDate: e.target.value })} style={financeInputStyle} />
                                <input value={bill.gl} onChange={(e) => updateFinanceById(setFinanceApLedger, 'id', bill.id, { gl: e.target.value })} style={financeInputStyle} />
                                <select value={bill.status} onChange={(e) => updateFinanceById(setFinanceApLedger, 'id', bill.id, { status: e.target.value })} style={financeInputStyle}>
                                  <option value="Approval Needed">Approval Needed</option>
                                  <option value="Scheduled">Scheduled</option>
                                  <option value="Paid">Paid</option>
                                </select>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div style={{ position: 'sticky', top: '92px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="finance-card" style={{ borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.86)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 20px 54px rgba(15,23,42,0.08)' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 950, color: theme.text }}>Quarter P&L Snapshot</h3>
                    <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
                      {pnlRows.map((row) => (
                        <div key={row.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 850, color: theme.text }}>
                            {financeEditMode ? (
                              <>
                                <input value={row.label} onChange={(e) => updateFinanceRow(setFinancePnlRows, pnlRows.indexOf(row), { label: e.target.value })} style={{ ...financeInputStyle, width: '54%' }} />
                                <input type="number" value={row.value} onChange={(e) => updateFinanceRow(setFinancePnlRows, pnlRows.indexOf(row), { value: Number(e.target.value) || 0 })} style={{ ...financeInputStyle, width: '38%', color: row.color }} />
                              </>
                            ) : (
                              <>
                                <span>{row.label}</span>
                                <span style={{ color: row.color }}>INR {formatNumber(row.value)}</span>
                              </>
                            )}
                          </div>
                          <div style={{ marginTop: '7px', height: '8px', borderRadius: '999px', background: '#e5e7eb', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min((row.value / 8500000) * 100, 100)}%`, height: '100%', borderRadius: '999px', background: `linear-gradient(90deg, ${row.color}, #10b981)` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="finance-card" style={{ borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.86)' : 'linear-gradient(180deg, #ffffff, #f8fbff)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 20px 54px rgba(15,23,42,0.08)' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accountant tasks</span>
                    {[
                      `${pendingApprovalAp} vendor bills awaiting approval`,
                      `INR ${formatNumber(overdueAr)} overdue collections priority`,
                      'GST liability review before monthly filing',
                      'Export ledger for accountant reconciliation'
                    ].map((task) => (
                      <div key={task} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 0', borderTop: '1px solid #eef2f7' }}>
                        <CheckCircle2 size={16} color="#10b981" style={{ flex: '0 0 auto', marginTop: '2px' }} />
                        <span style={{ fontSize: '0.8rem', color: theme.muted, lineHeight: 1.45, fontWeight: 760 }}>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="finance-card" style={{ borderRadius: '30px', padding: '22px', background: darkMode ? 'rgba(15,23,42,0.82)' : 'linear-gradient(135deg, #ffffff, #f8fbff)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', alignItems: 'center', marginBottom: '18px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 950, color: theme.text }}>Owner's Daily Financial Summary</h3>
                    <span style={{ fontSize: '0.8rem', color: theme.muted, fontWeight: 750 }}>Fast health check for revenue, expenses, cash, dues, and project activity.</span>
                  </div>
                  <span style={{ padding: '8px 11px', borderRadius: '999px', background: 'rgba(16,185,129,0.12)', color: '#10b981', fontSize: '0.74rem', fontWeight: 950 }}>Live accountant view</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: '14px' }}>
                  {ownerDailySummary.map((item, index) => {
                    const ItemIcon = item.icon;
                    return (
                      <div key={item.label} style={{ padding: '16px', borderRadius: '22px', background: darkMode ? 'rgba(255,255,255,0.05)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eef2f7'}`, animation: `financeRise 520ms ${index * 55}ms cubic-bezier(0.22, 1, 0.36, 1) both` }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, background: `${item.color}16` }}>
                            <ItemIcon size={17} />
                          </div>
                          <ArrowUpRight size={16} color={item.color} />
                        </div>
                        {financeEditMode && !item.computed ? (
                          <div style={{ display: 'grid', gap: '7px' }}>
                            <input value={item.label} onChange={(e) => updateFinanceRow(setFinanceOwnerSummary, index, { label: e.target.value })} style={financeInputStyle} />
                            <input type="number" value={item.value} onChange={(e) => updateFinanceRow(setFinanceOwnerSummary, index, { value: Number(e.target.value) || 0 })} style={financeInputStyle} />
                          </div>
                        ) : (
                          <>
                            <div style={{ color: theme.muted, fontSize: '0.72rem', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.035em' }}>{item.label}</div>
                            <div style={{ marginTop: '6px', color: theme.text, fontSize: typeof item.value === 'number' && item.value < 100 ? '1.3rem' : '1.02rem', fontWeight: 950 }}>
                              {typeof item.value === 'number' && item.value >= 100 ? `INR ${formatNumber(item.value)}` : item.value}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="finance-balanced-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <div className="finance-card finance-module-card" style={{ borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.82)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 950, color: theme.text }}>Banking & Cash Flow</h3>
                  <span style={{ display: 'block', marginTop: '4px', color: theme.muted, fontSize: '0.78rem', fontWeight: 750 }}>Bank reconciliation, daily bank balance, deposits, withdrawals, and loan exposure.</span>
                  <div className="finance-module-body" style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
                    {bankAccounts.map((account, index) => {
                      const isLoan = account.balance < 0;
                      return (
                        <div key={account.name} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 140px 80px', gap: '12px', alignItems: 'center', padding: '14px', borderRadius: '20px', background: darkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eef2f7'}` }}>
                          <div>
                            {financeEditMode ? (
                              <div style={{ display: 'grid', gap: '7px' }}>
                                <input value={account.name} onChange={(e) => updateFinanceRow(setFinanceBankAccounts, index, { name: e.target.value })} style={financeInputStyle} />
                                <input value={account.type} onChange={(e) => updateFinanceRow(setFinanceBankAccounts, index, { type: e.target.value })} style={financeInputStyle} />
                              </div>
                            ) : (
                              <>
                                <strong style={{ color: theme.text, fontSize: '0.88rem' }}>{account.name}</strong>
                                <div style={{ marginTop: '4px', color: theme.muted, fontSize: '0.74rem', fontWeight: 760 }}>{account.type}</div>
                              </>
                            )}
                          </div>
                          {financeEditMode ? (
                            <input type="number" value={account.balance} onChange={(e) => updateFinanceRow(setFinanceBankAccounts, index, { balance: Number(e.target.value) || 0 })} style={{ ...financeInputStyle, color: isLoan ? '#ef4444' : '#10b981' }} />
                          ) : (
                            <strong style={{ color: isLoan ? '#ef4444' : '#10b981', fontSize: '0.92rem' }}>{isLoan ? '-' : ''}INR {formatNumber(Math.abs(account.balance))}</strong>
                          )}
                          {financeEditMode ? (
                            <input value={account.movement} onChange={(e) => updateFinanceRow(setFinanceBankAccounts, index, { movement: e.target.value })} style={financeInputStyle} />
                          ) : (
                            <span style={{ color: isLoan ? '#f59e0b' : '#0976BC', fontSize: '0.74rem', fontWeight: 900 }}>{account.movement}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="finance-card finance-module-card" style={{ borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.82)' : 'linear-gradient(180deg, #ffffff, #fffaf0)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#fde68a'}`, boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 950, color: theme.text }}>GST / TDS / Payroll Watch</h3>
                  <div className="finance-module-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '16px', alignContent: 'start' }}>
                    {financeTaxWatch.map((tax, index) => (
                      <div key={tax.label} style={{ padding: '14px', borderRadius: '18px', background: darkMode ? 'rgba(255,255,255,0.04)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#f1f5f9'}` }}>
                        {financeEditMode ? (
                          <div style={{ display: 'grid', gap: '7px' }}>
                            <input value={tax.label} onChange={(e) => updateFinanceRow(setFinanceTaxWatch, index, { label: e.target.value })} style={financeInputStyle} />
                            <input type="number" value={tax.value} onChange={(e) => updateFinanceRow(setFinanceTaxWatch, index, { value: Number(e.target.value) || 0 })} style={{ ...financeInputStyle, color: tax.color }} />
                          </div>
                        ) : (
                          <>
                            <div style={{ color: theme.muted, fontSize: '0.72rem', fontWeight: 850 }}>{tax.label}</div>
                            <div style={{ marginTop: '6px', color: tax.color, fontWeight: 950 }}>INR {formatNumber(tax.value)}</div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="finance-balanced-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <div className="finance-card finance-module-card" style={{ borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.82)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 950, color: theme.text }}>Project Profitability</h3>
                  <div className="finance-module-body" style={{ display: 'grid', gap: '13px', marginTop: '16px' }}>
                    {projectProfitability.map((project, index) => {
                      const color = project.margin >= 25 ? '#10b981' : project.margin >= 15 ? '#f59e0b' : '#ef4444';
                      return (
                        <div key={project.project} style={{ padding: '14px', borderRadius: '20px', background: darkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eef2f7'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: theme.text, fontWeight: 900, fontSize: '0.86rem' }}>
                            {financeEditMode ? (
                              <>
                                <input value={project.project} onChange={(e) => updateFinanceRow(setFinanceProjects, index, { project: e.target.value })} style={{ ...financeInputStyle, width: '68%' }} />
                                <input type="number" value={project.margin} onChange={(e) => updateFinanceRow(setFinanceProjects, index, { margin: Number(e.target.value) || 0 })} style={{ ...financeInputStyle, width: '80px', color }} />
                              </>
                            ) : (
                              <>
                                <span>{project.project}</span>
                                <span style={{ color }}>{project.margin}%</span>
                              </>
                            )}
                          </div>
                          <div style={{ marginTop: '8px', height: '8px', borderRadius: '999px', background: '#e5e7eb', overflow: 'hidden' }}>
                            <div style={{ width: `${project.margin}%`, height: '100%', borderRadius: '999px', background: `linear-gradient(90deg, ${color}, #0976BC)` }} />
                          </div>
                          {financeEditMode ? (
                            <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                              <input type="number" value={project.revenue} onChange={(e) => updateFinanceRow(setFinanceProjects, index, { revenue: Number(e.target.value) || 0 })} style={financeInputStyle} />
                              <input type="number" value={project.cost} onChange={(e) => updateFinanceRow(setFinanceProjects, index, { cost: Number(e.target.value) || 0 })} style={financeInputStyle} />
                            </div>
                          ) : (
                            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', color: theme.muted, fontSize: '0.74rem', fontWeight: 760 }}>
                              <span>Revenue INR {formatNumber(project.revenue)}</span>
                              <span>Cost INR {formatNumber(project.cost)}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="finance-card finance-module-card" style={{ borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.82)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 950, color: theme.text }}>Approval Center</h3>
                  <div className="finance-module-body" style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
                    {approvalItems.map((item, index) => (
                      <div key={item.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '12px', alignItems: 'center', padding: '14px', borderRadius: '20px', background: darkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eef2f7'}` }}>
                        <div>
                          {financeEditMode ? (
                            <div style={{ display: 'grid', gap: '7px' }}>
                              <input value={item.title} onChange={(e) => updateFinanceRow(setFinanceApprovals, index, { title: e.target.value })} style={financeInputStyle} />
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <input value={item.owner} onChange={(e) => updateFinanceRow(setFinanceApprovals, index, { owner: e.target.value })} style={financeInputStyle} />
                                <input value={item.stage} onChange={(e) => updateFinanceRow(setFinanceApprovals, index, { stage: e.target.value })} style={financeInputStyle} />
                              </div>
                            </div>
                          ) : (
                            <>
                              <strong style={{ color: theme.text, fontSize: '0.86rem' }}>{item.title}</strong>
                              <div style={{ marginTop: '4px', color: theme.muted, fontSize: '0.74rem', fontWeight: 760 }}>{item.id} • {item.owner} • {item.stage}</div>
                            </>
                          )}
                        </div>
                        <button className="finance-action" onClick={() => logSystemAction(`Finance approval reviewed: ${item.id}`)} style={{ height: '36px', padding: '0 12px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #0976BC, #6366f1)', color: '#ffffff', fontSize: '0.72rem', fontWeight: 900, cursor: 'pointer' }}>
                          Review
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="finance-balanced-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <div className="finance-card finance-module-card is-compact" style={{ borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.82)' : 'linear-gradient(180deg, #ffffff, #f8fbff)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 950, color: theme.text }}>AI Financial Insights</h3>
                  <div className="finance-module-body" style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
                    {smartAlerts.map((alert, index) => (
                      <div key={alert.text} style={{ display: 'flex', gap: '10px', padding: '12px', borderRadius: '18px', background: `${alert.tone}10`, border: `1px solid ${alert.tone}20`, color: theme.text, fontSize: '0.8rem', fontWeight: 780, lineHeight: 1.45 }}>
                        <AlertTriangle size={16} color={alert.tone} style={{ flex: '0 0 auto', marginTop: '2px' }} />
                        {financeEditMode ? (
                          <input value={alert.text} onChange={(e) => updateFinanceRow(setFinanceAlerts, index, { text: e.target.value })} style={financeInputStyle} />
                        ) : (
                          alert.text
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="finance-card finance-module-card is-compact" style={{ borderRadius: '28px', padding: '20px', background: darkMode ? 'rgba(15,23,42,0.82)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 950, color: theme.text }}>Recent Transactions</h3>
                    <span style={{ fontSize: '0.72rem', color: '#0976BC', fontWeight: 900 }}>Audit ready</span>
                  </div>
                  <div className="finance-module-body" style={{ display: 'grid', gap: '10px' }}>
                    {recentTransactions.map((txn, index) => (
                      <div key={txn.id} style={{ display: 'grid', gridTemplateColumns: '90px minmax(0, 1fr) 130px 90px', gap: '10px', alignItems: 'center', padding: '12px', borderRadius: '18px', background: darkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eef2f7'}` }}>
                        <span style={{ color: theme.muted, fontSize: '0.74rem', fontWeight: 900 }}>{txn.id}</span>
                        {financeEditMode ? (
                          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '8px' }}>
                            <input value={txn.type} onChange={(e) => updateFinanceRow(setFinanceTransactions, index, { type: e.target.value })} style={financeInputStyle} />
                            <input value={txn.party} onChange={(e) => updateFinanceRow(setFinanceTransactions, index, { party: e.target.value })} style={financeInputStyle} />
                          </div>
                        ) : (
                          <span style={{ color: theme.text, fontSize: '0.82rem', fontWeight: 850 }}>{txn.type} • {txn.party}</span>
                        )}
                        {financeEditMode ? (
                          <input type="number" value={txn.amount} onChange={(e) => updateFinanceRow(setFinanceTransactions, index, { amount: Number(e.target.value) || 0 })} style={{ ...financeInputStyle, color: '#0976BC' }} />
                        ) : (
                          <strong style={{ color: '#0976BC', fontSize: '0.82rem' }}>INR {formatNumber(txn.amount)}</strong>
                        )}
                        {financeEditMode ? (
                          <input value={txn.status} onChange={(e) => updateFinanceRow(setFinanceTransactions, index, { status: e.target.value })} style={financeInputStyle} />
                        ) : (
                          <span style={{ color: '#10b981', background: 'rgba(16,185,129,0.10)', borderRadius: '999px', padding: '6px 8px', fontSize: '0.68rem', fontWeight: 900, textAlign: 'center' }}>{txn.status}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AR/AP KPI row */}
              <div style={{ display: 'none', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="erp-card">
                  <span style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: 'bold' }}>Accounts Receivable (AR)</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0', color: '#ca8a04' }}>₹{formatNumber(arTotal)}</h3>
                  <span style={{ fontSize: '0.7rem', color: '#71717a' }}>Unpaid invoice ledger values for B2B wholesalers</span>
                </div>
                <div className="erp-card">
                  <span style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: 'bold' }}>Accounts Payable (AP)</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0', color: '#dc2626' }}>₹{formatNumber(apTotal)}</h3>
                  <span style={{ fontSize: '0.7rem', color: '#71717a' }}>Pending raw chemical compound & fabric supplier debts</span>
                </div>
              </div>

              {/* Sheet breakdown for finance data exports */}
              <div style={{ display: 'none', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                <div className="erp-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Profit & Loss Quarter Sheet</h3>
                    <button 
                      onClick={() => triggerSpreadsheetExport('csv', 'finance')}
                      className="btn btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      Export P&L
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justify: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ fontWeight: 'bold' }}>Revenue Turnover</span>
                      <span>₹85,00,000</span>
                    </div>
                    <div style={{ display: 'flex', justify: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ fontWeight: 'bold' }}>Expenses (Factory Overhead)</span>
                      <span>₹44,00,000</span>
                    </div>
                    <div style={{ display: 'flex', justify: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ fontWeight: 'bold' }}>Tax Liability (GST 18%)</span>
                      <span>₹7,38,000</span>
                    </div>
                    <div style={{ display: 'flex', justify: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', color: '#16a34a', fontWeight: 'bold' }}>
                      <span>Net profit margin</span>
                      <span>₹33,62,000</span>
                    </div>
                  </div>
                </div>

                <div className="erp-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Accounts Receivables Due list</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justify: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold' }}>Apollo Pharmacy</span>
                      <span style={{ color: '#ca8a04', fontWeight: 'bold' }}>₹5,60,000 <span style={{ fontSize: '0.65rem', color: '#a1a1aa' }}>(Due 15 days)</span></span>
                    </div>
                    <div style={{ display: 'flex', justify: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold' }}>Surat Surgical Supply</span>
                      <span style={{ color: '#ca8a04', fontWeight: 'bold' }}>₹2,40,000 <span style={{ fontSize: '0.65rem', color: '#a1a1aa' }}>(Due 8 days)</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
          })()}

          {/* TAB: SETTINGS & AUDIT LOGS */}
          {activeTab === 'Settings' && (() => {
            return (
              <div style={{
                minHeight: '68vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px'
              }}>
                <div style={{
                  width: 'min(620px, 100%)',
                  textAlign: 'center',
                  borderRadius: '32px',
                  padding: '46px 34px',
                  background: darkMode ? 'rgba(15,23,42,0.88)' : '#ffffff',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                  boxShadow: '0 28px 80px rgba(15,23,42,0.10)'
                }}>
                  <div style={{
                    width: '86px',
                    height: '86px',
                    borderRadius: '28px',
                    margin: '0 auto 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(245,158,11,0.12))',
                    color: '#ef4444'
                  }}>
                    <AlertTriangle size={38} />
                  </div>
                  <div style={{ fontSize: '4rem', lineHeight: 1, fontWeight: 950, color: theme.text, letterSpacing: '-0.06em' }}>
                    404
                  </div>
                  <h2 style={{ margin: '12px 0 8px', fontSize: '1.6rem', fontWeight: 950, color: theme.text }}>
                    Settings page not found
                  </h2>
                  <p style={{ margin: '0 auto', maxWidth: '430px', color: theme.muted, fontSize: '0.95rem', lineHeight: 1.6 }}>
                    This settings area is currently unavailable.
                  </p>
                </div>
              </div>
            );
            const settingsSections = [
              { name: 'Company Settings', icon: Factory, desc: 'Company identity, GST, branches, contact and email setup' },
              { name: 'User & Roles', icon: UserCheck, desc: 'Users, roles, passwords and department permissions' },
              { name: 'Finance Settings', icon: CreditCard, desc: 'Accounting, GST, invoice numbering and payment terms' },
              { name: 'Sales Settings', icon: ShoppingCart, desc: 'Lead stages, sales pipeline, order statuses and pricing rules' },
              { name: 'Production Settings', icon: Activity, desc: 'Workflow, raw materials, QC, batch and target rules' },
              { name: 'Inventory Settings', icon: Package, desc: 'Warehouses, reorder levels, categories and units' },
              { name: 'Marketing Settings', icon: TrendingUp, desc: 'Lead sources, campaigns, assignment and templates' },
              { name: 'Website CMS Settings', icon: Globe, desc: 'Banners, SEO, contact forms, routing and publishing' },
              { name: 'Notifications', icon: Bell, desc: 'Email, WhatsApp and dashboard alert rules' },
              { name: 'Documents & Templates', icon: FileText, desc: 'Quotation, invoice, PO, challan and numbering formats' },
              { name: 'Security', icon: Shield, desc: '2FA, password policy, restrictions and activity logs' },
              { name: 'Automation', icon: RefreshCw, desc: 'Smart reminders, auto assignment and report generation' },
              { name: 'Dashboard Preferences', icon: Monitor, desc: 'Team dashboards and visible widgets' },
              { name: 'Activity Logs', icon: List, desc: 'Audit trail and user action history' },
            ];
            const permissionModules = ['Finance', 'Inventory', 'Orders', 'Reports', 'Marketing Hub', 'Production', 'Website CMS', 'Settings'];
            const roles = ['Super Admin', 'Owner', 'Accounts Manager', 'Sales Manager', 'Marketing Manager', 'Production Manager', 'Inventory Manager', 'Employee'];
            const settingsGroups = {
              'Company Settings': [
                { title: 'Company Information', items: ['Company Name', 'Logo', 'GST Number', 'PAN Number', 'CIN Number', 'Registered Address', 'Contact Details'] },
                { title: 'Branch Management', items: ['Head Office', 'Warehouse', 'Manufacturing Unit', 'Sales Offices'] },
                { title: 'Email Settings', items: ['Default sender email', 'SMTP provider', 'Reply-to inbox', 'Department routing'] },
              ],
              'User & Roles': [
                { title: 'Users', items: ['Add User', 'Edit User', 'Deactivate User', 'Reset Password'] },
                { title: 'Roles', items: roles },
                { title: 'Permissions', items: permissionModules },
              ],
              'Finance Settings': [
                { title: 'Accounting Setup', items: ['Financial Year', 'Currency', 'Tax Structure', 'Chart of Accounts'] },
                { title: 'GST Settings', items: ['GST Rate Master', 'HSN Codes', 'GST Filing Details', 'Purchase Register', 'Sales Register'] },
                { title: 'Payment Methods', items: ['Bank Transfer', 'UPI', 'Credit Terms', 'Cheque'] },
                { title: 'Invoice Settings', items: ['Invoice Prefix', 'Auto Invoice Numbering', 'Payment Terms'] },
              ],
              'Sales Settings': [
                { title: 'Sales Workflow', items: ['Lead Stages', 'Sales Pipeline', 'Order Statuses'] },
                { title: 'Customer Categories', items: ['Distributor', 'Dealer', 'Hospital', 'Retail Customer', 'Government Customer'] },
                { title: 'Pricing Rules', items: ['Dealer Price', 'Distributor Price', 'Retail Price'] },
              ],
              'Production Settings': [
                { title: 'Production Workflow', items: ['Raw Material Setup', 'Manufacturing Stages', 'Quality Check Stages'] },
                { title: 'Batch Settings', items: ['Batch Number Generation', 'Expiry Date Rules', 'Manufacturing Date Rules'] },
                { title: 'Production Targets', items: ['Daily Target', 'Weekly Target', 'Monthly Target'] },
              ],
              'Inventory Settings': [
                { title: 'Warehouse Settings', items: ['Warehouse Locations', 'Stock Rules', 'Reorder Levels'] },
                { title: 'Product Categories', items: ['Surgical Products', 'Consumables', 'Instruments', 'OEM Products'] },
                { title: 'Units', items: ['PCS', 'BOX', 'PACK', 'CARTON'] },
              ],
              'Marketing Settings': [
                { title: 'Lead Sources', items: ['Website', 'Google Ads', 'Facebook Ads', 'LinkedIn', 'Referral', 'Trade Shows'] },
                { title: 'Campaign Categories', items: ['Product Launch', 'Promotions', 'Events', 'Email Marketing'] },
                { title: 'Marketing Automation', items: ['Lead Assignment Rules', 'Follow-up Reminders', 'Email Templates'] },
              ],
              'Website CMS Settings': [
                { title: 'Website Configuration', items: ['Banner Management', 'Product Page Settings', 'SEO Settings'] },
                { title: 'Contact Forms', items: ['Lead Routing', 'Email Notifications', 'Spam Protection'] },
                { title: 'Blog Settings', items: ['Categories', 'Authors', 'Publishing Permissions'] },
              ],
              Notifications: [
                { title: 'Email Notifications', items: ['New Order', 'Payment Received', 'Low Stock Alert', 'Production Delay', 'New Lead'] },
                { title: 'WhatsApp Notifications', items: ['Order Confirmation', 'Payment Reminder', 'Delivery Updates'] },
                { title: 'Dashboard Alerts', items: ['GST Due', 'Vendor Payment Due', 'Salary Processing Due'] },
              ],
              'Documents & Templates': [
                { title: 'Templates', items: ['Quotation Template', 'Invoice Template', 'Purchase Order Template', 'Delivery Challan Template'] },
                { title: 'Document Numbering', items: ['INV-2026-0001', 'PO-2026-0001', 'QT-2026-0001'] },
              ],
              Security: [
                { title: 'Authentication', items: ['Two-Factor Authentication', 'Password Policy', 'Login Restrictions'] },
                { title: 'Activity Logs', items: ['Login History', 'User Actions', 'Audit Trail'] },
              ],
              Automation: [
                { title: 'Smart Automations', items: ['Auto Lead Assignment', 'Auto Payment Reminder', 'Auto Low Stock Alerts', 'Auto GST Reminder', 'Auto Report Generation'] },
              ],
              'Dashboard Preferences': [
                { title: 'Marketing Dashboard', items: ['Leads', 'Campaign Performance', 'Conversion Rate'] },
                { title: 'Accounts Dashboard', items: ['Revenue', 'Expenses', 'GST', 'Outstanding Payments'] },
                { title: 'Production Dashboard', items: ['Production Status', 'Raw Materials', 'Pending Jobs'] },
                { title: 'Sales Dashboard', items: ['Orders', 'Revenue', 'Customer Activity'] },
              ],
              'Activity Logs': [
                { title: 'Audit Trail', items: auditLogs.slice(0, 8).map(log => `${log.action} - ${log.user}`) },
              ],
            };
            const selectedGroups = settingsGroups[activeSettingsSection] || [];
            const activeMeta = settingsSections.find(section => section.name === activeSettingsSection) || settingsSections[0];
            const ActiveIcon = activeMeta.icon;

            return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Organization Settings Control Center</h2>
                <span style={{ fontSize: '0.8rem', color: '#71717a' }}>Centralized access, department workflows, templates, notifications, security and automation controls</span>
              </div>

              <style>{`
                @keyframes settingsRise {
                  from { opacity: 0; transform: translateY(16px) scale(0.985); filter: blur(8px); }
                  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                }
                @keyframes settingsGlow {
                  0%, 100% { transform: scale(1); opacity: 0.55; }
                  50% { transform: scale(1.08); opacity: 0.9; }
                }
                .settings-control-card {
                  animation: settingsRise 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
                  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
                }
                .settings-control-card:hover {
                  transform: translateY(-3px);
                  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.12);
                  border-color: rgba(9, 118, 188, 0.22);
                }
                .settings-menu-scroll {
                  height: calc(100vh - 150px);
                  max-height: 820px;
                  min-height: 520px;
                  overflow-y: auto;
                  overflow-x: hidden;
                  overscroll-behavior: contain;
                  scrollbar-width: thin;
                  scrollbar-color: rgba(9, 118, 188, 0.28) transparent;
                }
                .settings-menu-scroll::-webkit-scrollbar {
                  width: 7px;
                }
                .settings-menu-scroll::-webkit-scrollbar-track {
                  background: transparent;
                }
                .settings-menu-scroll::-webkit-scrollbar-thumb {
                  background: rgba(9, 118, 188, 0.28);
                  border-radius: 999px;
                }
              `}</style>

              <div className="settings-control-card" style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '30px',
                padding: '28px',
                background: darkMode ? 'linear-gradient(135deg, rgba(7,12,22,0.96), rgba(9,118,188,0.34))' : 'linear-gradient(135deg, #ffffff 0%, #eef8ff 48%, #f8fff8 100%)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(9,118,188,0.12)'}`,
                boxShadow: '0 28px 80px rgba(15,23,42,0.10)'
              }}>
                <div style={{ position: 'absolute', right: '-90px', top: '-110px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(9,118,188,0.20), rgba(9,118,188,0))', animation: 'settingsGlow 7s ease-in-out infinite' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) repeat(4, minmax(150px, 0.25fr))', gap: '18px', alignItems: 'stretch' }}>
                  <div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '999px', background: 'rgba(9,118,188,0.10)', color: '#0976BC', fontSize: '0.74rem', fontWeight: 900, marginBottom: '14px' }}>
                      <Settings size={14} /> CENTRAL ADMIN
                    </span>
                    <h2 style={{ margin: 0, fontSize: '2.15rem', lineHeight: 1.04, fontWeight: 950, color: theme.text, letterSpacing: '-0.045em' }}>
                      Company Control Panel
                    </h2>
                    <p style={{ margin: '10px 0 0', color: theme.muted, fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '660px' }}>
                      Configure Bapuji Surgicals roles, finance, inventory, production, sales, marketing, CMS, documents, security and automation from one scalable settings hub.
                    </p>
                  </div>
                  {[
                    { label: 'Settings areas', value: settingsSections.length, icon: Grid, color: '#0976BC' },
                    { label: 'Role profiles', value: roles.length, icon: UserCheck, color: '#10b981' },
                    { label: 'Permission modules', value: permissionModules.length, icon: Shield, color: '#f59e0b' },
                    { label: 'Audit events', value: auditLogs.length, icon: List, color: '#6366f1' },
                  ].map((metric) => {
                    const MetricIcon = metric.icon;
                    return (
                      <div key={metric.label} style={{ padding: '18px', borderRadius: '22px', background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.78)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.82)'}`, boxShadow: '0 18px 45px rgba(15,23,42,0.08)' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: metric.color, background: `${metric.color}18`, marginBottom: '16px' }}>
                          <MetricIcon size={18} />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: theme.muted, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{metric.label}</div>
                        <div style={{ marginTop: '6px', color: theme.text, fontSize: '1.2rem', fontWeight: 950 }}>{metric.value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '320px minmax(0, 1fr)', gap: '20px', alignItems: 'start', minHeight: 0 }}>
                <div className="settings-control-card settings-menu-scroll" style={{ position: 'sticky', top: '92px', borderRadius: '28px', padding: '14px', background: darkMode ? 'rgba(15,23,42,0.84)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 18px 48px rgba(15,23,42,0.08)', display: 'grid', gap: '8px', alignContent: 'start' }}>
                  {settingsSections.map((section) => {
                    const SectionIcon = section.icon;
                    const isActive = activeSettingsSection === section.name;
                    return (
                      <button
                        key={section.name}
                        type="button"
                        onClick={() => setActiveSettingsSection(section.name)}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '38px minmax(0, 1fr)',
                          gap: '10px',
                          alignItems: 'center',
                          textAlign: 'left',
                          padding: '12px',
                          borderRadius: '18px',
                          border: `1px solid ${isActive ? 'rgba(9,118,188,0.24)' : 'transparent'}`,
                          background: isActive ? 'linear-gradient(135deg, rgba(9,118,188,0.12), rgba(16,185,129,0.08))' : 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ width: '38px', height: '38px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? '#0976BC' : theme.muted, background: isActive ? 'rgba(9,118,188,0.12)' : '#f8fafc' }}>
                          <SectionIcon size={17} />
                        </span>
                        <span>
                          <strong style={{ display: 'block', color: theme.text, fontSize: '0.84rem' }}>{section.name}</strong>
                          <span style={{ display: 'block', marginTop: '3px', color: theme.muted, fontSize: '0.7rem', lineHeight: 1.35 }}>{section.desc}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div className="settings-control-card" style={{ borderRadius: '28px', padding: '22px', background: darkMode ? 'rgba(15,23,42,0.84)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 18px 48px rgba(15,23,42,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(9,118,188,0.12)', color: '#0976BC' }}>
                        <ActiveIcon size={23} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, color: theme.text, fontSize: '1.4rem', fontWeight: 950 }}>{activeSettingsSection}</h3>
                        <p style={{ margin: '5px 0 0', color: theme.muted, fontSize: '0.86rem', lineHeight: 1.45 }}>{activeMeta.desc}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))', gap: '16px' }}>
                    {selectedGroups.map((group, groupIndex) => (
                      <div key={group.title} className="settings-control-card" style={{ animationDelay: `${groupIndex * 70}ms`, borderRadius: '26px', padding: '18px', background: darkMode ? 'rgba(15,23,42,0.82)' : '#ffffff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, boxShadow: '0 16px 42px rgba(15,23,42,0.07)', minHeight: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <h4 style={{ margin: 0, color: theme.text, fontSize: '0.98rem', fontWeight: 950 }}>{group.title}</h4>
                          <span style={{ color: '#0976BC', background: 'rgba(9,118,188,0.10)', borderRadius: '999px', padding: '5px 8px', fontSize: '0.68rem', fontWeight: 900 }}>{group.items.length} items</span>
                        </div>
                        <div style={{ display: 'grid', gap: '9px' }}>
                          {group.items.map((item, itemIndex) => (
                            <label key={`${group.title}-${item}`} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center', padding: '10px 12px', borderRadius: '16px', background: darkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eef2f7'}` }}>
                              <span style={{ color: theme.text, fontSize: '0.8rem', fontWeight: 820, lineHeight: 1.35 }}>{item}</span>
                              <input
                                type="checkbox"
                                defaultChecked={itemIndex < Math.ceil(group.items.length * 0.72)}
                                onChange={(e) => logSystemAction(`${activeSettingsSection}: ${item} ${e.target.checked ? 'enabled' : 'disabled'}`)}
                                style={{ width: '18px', height: '18px', accentColor: '#0976BC' }}
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="erp-card" style={{ display: 'none', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>SMTP Resend API keys</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Resend Domain Key</label>
                    <input type="password" value="••••••••••••••••••••••••••••" disabled className="form-input" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Default Notification recipient email</label>
                    <input type="text" value="vigneshsullia78@gmail.com" disabled className="form-input" style={{ fontWeight: 'bold' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.78rem', color: '#71717a' }}>
                  <span>✓ Automatically email vigneshsullia78@gmail.com upon: New orders, low stock warnings, or OEM Customized RFQ uploads.</span>
                </div>
              </div>

              {/* Full Audit log history */}
              <div className="erp-card" style={{ display: 'none', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Full Audit Trail Log Database</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {auditLogs.map((log, idx) => (
                    <div key={`${log.id}-${idx}`} style={{ display: 'flex', justify: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: 'bold', color: '#09090b' }}>{log.action}</span>
                        <span style={{ fontSize: '0.72rem', color: '#71717a' }}>Action issued by: {log.user}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            );
          })()}

        </main>

      </div>

      {/* --- GLOBAL SEARCH MODAL (OVERLAY) --- */}
      {showSearchModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(9, 9, 11, 0.4)', 
          backdropFilter: 'blur(4px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 100 
        }} onClick={() => setShowSearchModal(false)}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '16px', 
            width: '100%', 
            maxWidth: '560px', 
            padding: '20px', 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e4e4e7'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px', marginBottom: '16px' }}>
              <Search size={18} style={{ color: '#a1a1aa' }} />
              <input 
                type="text" 
                placeholder="Search products, customers, quotes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', color: '#09090b' }}
                autoFocus
              />
              <button onClick={() => { setShowSearchModal(false); setSearchQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}>
                <X size={18} />
              </button>
            </div>

            {/* Results listing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
              {searchQuery ? (
                filteredSearchResults.length > 0 ? (
                  filteredSearchResults.map((res, index) => (
                    <div 
                      key={index}
                      onClick={() => {
                        setActiveTab(res.tab);
                        setShowSearchModal(false);
                        setSearchQuery('');
                      }}
                      style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justify: 'space-between', alignItems: 'center', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{res.title}</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{res.desc}</span>
                      </div>
                      <span style={{ fontSize: '0.65rem', backgroundColor: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        {res.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <span style={{ padding: '16px', textAlign: 'center', fontSize: '0.85rem', color: '#71717a' }}>No results match "{searchQuery}"</span>
                )
              ) : (
                <span style={{ padding: '16px', textAlign: 'center', fontSize: '0.82rem', color: '#a1a1aa' }}>Type keywords to search across the Bapuji ERP database</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- HUBSPOT CRM CUSTOMER SLIDE-IN DRAWER --- */}
      {selectedCustomer && (
        <div style={{ 
          position: 'fixed', 
          top: 0, right: 0, bottom: 0, 
          width: '420px', 
          backgroundColor: darkMode ? '#18181b' : '#ffffff', 
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)', 
          zIndex: 150, 
          display: 'flex', 
          flexDirection: 'column',
          borderLeft: theme.border,
          animation: 'slideInRight 300ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Drawer header */}
          <div style={{ padding: '20px 24px', borderBottom: theme.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#0976BC', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>HubSpot CRM Profile</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0 0 0', color: theme.text }}>{selectedCustomer.company}</h3>
            </div>
            <button 
              onClick={() => setSelectedCustomer(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.subtitle, padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer content */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Visual Profile Card */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              backgroundColor: theme.itemBg, 
              padding: '16px', 
              borderRadius: '12px', 
              border: theme.border 
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #0976BC 0%, #0284c7 100%)', 
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}>
                {selectedCustomer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: theme.text, margin: 0 }}>{selectedCustomer.name}</h4>
                <span style={{ fontSize: '0.78rem', color: theme.subtitle }}>Account ID: {selectedCustomer.id}</span>
              </div>
            </div>

            {/* Profile Info fields */}
            <div>
              <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: theme.text, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Person</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: theme.border, paddingBottom: '6px' }}>
                  <span style={{ color: theme.subtitle }}>Email Address</span>
                  <span style={{ fontWeight: '600', color: theme.text }}>{selectedCustomer.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: theme.border, paddingBottom: '6px' }}>
                  <span style={{ color: theme.subtitle }}>Phone Number</span>
                  <span style={{ fontWeight: '600', color: theme.text }}>{selectedCustomer.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px' }}>
                  <span style={{ color: theme.subtitle }}>Region Location</span>
                  <span style={{ fontWeight: '600', color: theme.text }}>{selectedCustomer.country}</span>
                </div>
              </div>
            </div>

            {/* Order stats */}
            <div>
              <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: theme.text, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order History Details</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: theme.border, paddingBottom: '6px' }}>
                  <span style={{ color: theme.subtitle }}>Account Segment</span>
                  <span style={{ fontWeight: '700', color: '#0976BC' }}>{selectedCustomer.type} Partner</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: theme.border, paddingBottom: '6px' }}>
                  <span style={{ color: theme.subtitle }}>Total Placed Orders</span>
                  <span style={{ fontWeight: '600', color: theme.text }}>{selectedCustomer.orders} batches</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px' }}>
                  <span style={{ color: theme.subtitle }}>Turnover Value</span>
                  <span style={{ fontWeight: '800', color: theme.text }}>₹{formatNumber(selectedCustomer.spend)}</span>
                </div>
              </div>
            </div>

            {/* Notes logs creator */}
            <div>
              <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: theme.text, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>HubSpot CRM Activity Notes</h4>
              <p style={{ 
                fontSize: '0.8rem', 
                color: theme.text, 
                whiteSpace: 'pre-line', 
                border: theme.border, 
                padding: '12px', 
                borderRadius: '8px', 
                backgroundColor: theme.itemBg, 
                marginBottom: '10px', 
                maxHeight: '140px', 
                overflowY: 'auto',
                lineHeight: 1.5
              }}>
                {selectedCustomer.notes}
              </p>
              
              <form onSubmit={submitCrmNote} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Append log note..."
                  value={crmNote}
                  onChange={(e) => setCrmNote(e.target.value)}
                  style={{ 
                    flex: 1, 
                    padding: '8px 12px', 
                    fontSize: '0.78rem', 
                    border: theme.border, 
                    borderRadius: '6px', 
                    outline: 'none',
                    backgroundColor: theme.itemBg,
                    color: theme.text
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                  Add Note
                </button>
              </form>
            </div>

            {/* Client Vault Document Attachment Uploader */}
            <div>
              <h4 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: theme.text, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Client Vault Assets</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                {selectedCustomer.attachments && selectedCustomer.attachments.length > 0 ? (
                  selectedCustomer.attachments.map((file, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#0976BC', fontWeight: 'bold' }}>
                      <FileText size={14} /> <span>{file}</span>
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: '0.75rem', color: theme.subtitle }}>No custom artwork layouts or PO uploaded yet.</span>
                )}
              </div>

              {/* Drag drop simulation */}
              <div style={{ 
                border: '2px dashed rgba(9, 118, 188, 0.25)', 
                borderRadius: '8px', 
                padding: '16px', 
                textAlign: 'center', 
                cursor: 'pointer',
                backgroundColor: theme.itemBg,
                transition: 'border-color 0.2s ease'
              }} onClick={() => document.getElementById('crm-file-upload').click()}>
                <span style={{ fontSize: '0.72rem', color: theme.subtitle, display: 'block' }}>Drag & Drop PO/Artwork PDFs here or click to upload</span>
                <input 
                  type="file" 
                  id="crm-file-upload" 
                  style={{ display: 'none' }} 
                  onChange={handleCrmFileUpload}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- WET WIPES PRODUCT EDIT DRAWER --- */}
      {selectedProduct && editProductForm && (
        <div style={{ 
          position: 'fixed', 
          top: 0, right: 0, bottom: 0, 
          width: '440px', 
          backgroundColor: darkMode ? '#18181b' : '#ffffff', 
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)', 
          zIndex: 150, 
          display: 'flex', 
          flexDirection: 'column',
          borderLeft: theme.border,
          animation: 'slideInRight 300ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Drawer header */}
          <div style={{ padding: '20px 24px', borderBottom: theme.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#0976BC', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>SKU formulation sheet</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0 0 0', color: theme.text }}>Edit Catalog Item</h3>
            </div>
            <button 
              onClick={() => {
                setSelectedProduct(null);
                setEditProductForm(null);
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.subtitle, padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer content */}
          <form onSubmit={handleSaveProduct} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Product Card visualizer */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                backgroundColor: theme.itemBg, 
                padding: '16px', 
                borderRadius: '12px', 
                border: theme.border 
              }}>
                <div style={{ 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  border: theme.border,
                  backgroundColor: theme.cardBg
                }}>
                  <img loading="lazy" src={editProductForm.images && editProductForm.images[0] ? editProductForm.images[0] : '/placeholder.png'} alt={editProductForm.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: theme.text, margin: 0 }}>{editProductForm.name || 'Untitled SKU'}</h4>
                  <span style={{ fontSize: '0.75rem', color: theme.subtitle, fontFamily: 'monospace' }}>SKU: {editProductForm.sku || 'BAP-NEW'}</span>
                  <div style={{ fontSize: '0.75rem', color: '#0976BC', fontWeight: 'bold', marginTop: '4px' }}>₹{editProductForm.price}/unit</div>
                </div>
              </div>

              {/* Edit Image Field */}
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem', color: theme.subtitle, fontWeight: '700', marginBottom: '8px', display: 'block' }}>Product Image Preview</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {[
                    '/img/mother_baby_wipes.png',
                    '/img/kitchen_wipes.png',
                    '/img/after_shave_wipes.png',
                    '/img/automobile_wipes.png',
                    '/img/pet_wipes.png',
                    '/img/women_wipes_1780255607971.png'
                  ].map((imgUrl) => {
                    const isSelected = editProductForm.images && editProductForm.images[0] === imgUrl;
                    return (
                      <button
                        type="button"
                        key={imgUrl}
                        onClick={() => setEditProductForm({ ...editProductForm, images: [imgUrl] })}
                        style={{
                          height: '56px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #0976BC' : theme.border,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          padding: 0,
                          backgroundColor: theme.cardBg,
                          transition: 'all 0.2s ease',
                          transform: isSelected ? 'scale(1.05)' : 'none'
                        }}
                      >
                        <img loading="lazy" src={imgUrl} alt="Preset select" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fields Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: '700', marginBottom: '4px', display: 'block' }}>Product Title Name</label>
                  <input 
                    type="text" 
                    value={editProductForm.name} 
                    onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '10px 12px', 
                      fontSize: '0.85rem', 
                      borderRadius: '8px', 
                      border: theme.border, 
                      backgroundColor: theme.cardBg, 
                      color: theme.text,
                      outline: 'none'
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: '700', marginBottom: '4px', display: 'block' }}>SKU Code</label>
                    <input 
                      type="text" 
                      value={editProductForm.sku} 
                      onChange={(e) => setEditProductForm({ ...editProductForm, sku: e.target.value })}
                      style={{ 
                        width: '100%', 
                        padding: '10px 12px', 
                        fontSize: '0.85rem', 
                        borderRadius: '8px', 
                        border: theme.border, 
                        backgroundColor: theme.cardBg, 
                        color: theme.text,
                        outline: 'none',
                        fontFamily: 'monospace'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: '700', marginBottom: '4px', display: 'block' }}>Product Category</label>
                    <select 
                      value={editProductForm.category} 
                      onChange={(e) => setEditProductForm({ ...editProductForm, category: e.target.value })}
                      style={{ 
                        width: '100%', 
                        padding: '10px 12px', 
                        fontSize: '0.85rem', 
                        borderRadius: '8px', 
                        border: theme.border, 
                        backgroundColor: theme.cardBg, 
                        color: theme.text,
                        outline: 'none'
                      }}
                    >
                      <option value="Clinical PPE">Clinical PPE</option>
                      <option value="Hospital Wipes">Hospital Wipes</option>
                      <option value="Baby Care">Baby Care</option>
                      <option value="Sanitizers">Sanitizers</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: '700', marginBottom: '4px', display: 'block' }}>Unit Price (₹)</label>
                    <input 
                      type="number" 
                      value={editProductForm.price} 
                      onChange={(e) => setEditProductForm({ ...editProductForm, price: Number(e.target.value) })}
                      style={{ 
                        width: '100%', 
                        padding: '10px 12px', 
                        fontSize: '0.85rem', 
                        borderRadius: '8px', 
                        border: theme.border, 
                        backgroundColor: theme.cardBg, 
                        color: theme.text,
                        outline: 'none'
                      }}
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: '700', marginBottom: '4px', display: 'block' }}>MOQ Req.</label>
                    <input 
                      type="number" 
                      value={editProductForm.moq} 
                      onChange={(e) => setEditProductForm({ ...editProductForm, moq: Number(e.target.value) })}
                      style={{ 
                        width: '100%', 
                        padding: '10px 12px', 
                        fontSize: '0.85rem', 
                        borderRadius: '8px', 
                        border: theme.border, 
                        backgroundColor: theme.cardBg, 
                        color: theme.text,
                        outline: 'none'
                      }}
                      required
                      min="10"
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: '700', marginBottom: '4px', display: 'block' }}>Stock Level</label>
                    <input 
                      type="number" 
                      value={editProductForm.stock} 
                      onChange={(e) => setEditProductForm({ ...editProductForm, stock: Number(e.target.value) })}
                      style={{ 
                        width: '100%', 
                        padding: '10px 12px', 
                        fontSize: '0.85rem', 
                        borderRadius: '8px', 
                        border: theme.border, 
                        backgroundColor: theme.cardBg, 
                        color: theme.text,
                        outline: 'none'
                      }}
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem', color: theme.subtitle, fontWeight: '700', marginBottom: '4px', display: 'block' }}>Substrate Formulation Description</label>
                  <textarea 
                    rows={4}
                    value={editProductForm.description} 
                    onChange={(e) => setEditProductForm({ ...editProductForm, description: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '10px 12px', 
                      fontSize: '0.85rem', 
                      borderRadius: '8px', 
                      border: theme.border, 
                      backgroundColor: theme.cardBg, 
                      color: theme.text,
                      outline: 'none',
                      resize: 'none',
                      lineHeight: 1.45
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Drawer action footer */}
            <div style={{ padding: '20px 24px', borderTop: theme.border, display: 'flex', gap: '12px', backgroundColor: theme.itemBg }}>
              <button 
                type="button" 
                onClick={() => handleDeleteProduct(editProductForm.id)} 
                style={{ 
                  padding: '10px 16px', 
                  borderRadius: '8px', 
                  fontSize: '0.82rem', 
                  fontWeight: 'bold', 
                  backgroundColor: 'transparent', 
                  color: '#ef4444', 
                  border: '1px solid #ef4444',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Delete SKU
              </button>
              
              <div style={{ flex: 1 }} />

              <button 
                type="button" 
                onClick={() => {
                  setSelectedProduct(null);
                  setEditProductForm(null);
                }} 
                style={{ 
                  padding: '10px 16px', 
                  borderRadius: '8px', 
                  fontSize: '0.82rem', 
                  fontWeight: 'bold', 
                  backgroundColor: 'transparent', 
                  color: theme.subtitle, 
                  border: theme.border,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Cancel
              </button>

              <button 
                type="submit" 
                style={{ 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  fontSize: '0.82rem', 
                  fontWeight: 'bold', 
                  backgroundColor: '#0976BC', 
                  color: '#ffffff', 
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(9, 118, 188, 0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#075d96'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0976BC'}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- WAREHOUSE STOCK BREAKDOWN MODAL --- */}
      {showStockBreakdownModal && (() => {
        const totalWarehouseStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
        const inventoryCategories = ['All', ...Array.from(new Set(products.map(product => product.category)))];
        const filteredInventory = products.filter(product => {
          const query = stockSearchQuery.toLowerCase().trim();
          const matchesCategory = stockCategoryFilter === 'All' || product.category === stockCategoryFilter;
          const matchesSearch = !query ||
            product.name.toLowerCase().includes(query) ||
            product.sku.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query);
          return matchesCategory && matchesSearch;
        });
        const availableUnits = products.reduce((sum, product) => sum + Math.max(Number(product.stock || 0) - Math.round(Number(product.stock || 0) * 0.18), 0), 0);
        const reservedUnits = totalWarehouseStock - availableUnits;
        const lowStockCount = products.filter(product => Number(product.stock || 0) < Math.max(Number(product.moq || 0) * 3, 15000)).length;

        const getStockHealth = (product) => {
          const stock = Number(product.stock || 0);
          const reorderPoint = Math.max(Number(product.moq || 0) * 3, 5000);
          if (stock <= reorderPoint) return { label: 'Reorder Soon', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
          if (stock <= reorderPoint * 2) return { label: 'Watch', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' };
          return { label: 'Healthy', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
        };

        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.68)' : 'rgba(15, 23, 42, 0.36)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              zIndex: 170
            }}
            onClick={() => setShowStockBreakdownModal(false)}
          >
            <div
              style={{
                width: 'min(1120px, 100%)',
                maxHeight: '88vh',
                backgroundColor: theme.cardBg,
                color: theme.text,
                border: theme.border,
                borderRadius: '24px',
                boxShadow: darkMode ? '0 28px 90px rgba(0,0,0,0.6)' : '0 28px 90px rgba(15, 23, 42, 0.18)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                animation: 'modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  padding: '24px 28px',
                  borderBottom: theme.border,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '20px',
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(9, 118, 188, 0.14), rgba(16, 185, 129, 0.08))'
                    : 'linear-gradient(135deg, rgba(9, 118, 188, 0.08), rgba(16, 185, 129, 0.08))'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      color: '#10b981'
                    }}>
                      <Package size={20} />
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Warehouse Inventory
                    </span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: '1.65rem', lineHeight: 1.1, fontWeight: 900, color: theme.text }}>
                    {formatNumber(totalWarehouseStock)} Units in Finished Stock
                  </h2>
                  <p style={{ margin: '8px 0 0', color: theme.subtitle, fontSize: '0.9rem' }}>
                    Inventory stock list by SKU with total stock, available units, reserved quantities, and reorder status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStockBreakdownModal(false)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    border: theme.border,
                    backgroundColor: theme.itemBg,
                    color: theme.subtitle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  aria-label="Close warehouse stock list"
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '20px 28px', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px', borderBottom: theme.border }}>
                {[
                  { label: 'Total Stock', value: `${formatNumber(totalWarehouseStock)} Units`, icon: Package, color: '#10b981' },
                  { label: 'Available to Sell', value: `${formatNumber(availableUnits)} Units`, icon: CheckCircle, color: '#0976BC' },
                  { label: 'Reserved / Orders', value: `${formatNumber(reservedUnits)} Units`, icon: Clock, color: '#f59e0b' },
                  { label: 'Needs Attention', value: `${lowStockCount} SKUs`, icon: AlertTriangle, color: '#ef4444' }
                ].map((metric) => {
                  const MetricIcon = metric.icon;
                  return (
                    <div key={metric.label} style={{
                      padding: '16px',
                      borderRadius: '16px',
                      border: theme.border,
                      backgroundColor: theme.itemBg,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: theme.subtitle }}>{metric.label}</span>
                        <MetricIcon size={16} style={{ color: metric.color }} />
                      </div>
                      <strong style={{ fontSize: '1.08rem', color: theme.text }}>{metric.value}</strong>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', borderBottom: theme.border }}>
                <div style={{ position: 'relative', flex: '1 1 320px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: theme.subtitle }} />
                  <input
                    value={stockSearchQuery}
                    onChange={(event) => setStockSearchQuery(event.target.value)}
                    placeholder="Search inventory by SKU, product, or category..."
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: '12px',
                      border: theme.border,
                      backgroundColor: theme.itemBg,
                      color: theme.text,
                      padding: '0 16px 0 42px',
                      outline: 'none',
                      fontSize: '0.86rem',
                      fontWeight: 600
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {inventoryCategories.map((category) => {
                    const isActive = stockCategoryFilter === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setStockCategoryFilter(category)}
                        style={{
                          height: '38px',
                          padding: '0 14px',
                          borderRadius: '999px',
                          border: isActive ? '1px solid #0976BC' : theme.border,
                          backgroundColor: isActive ? '#0976BC' : theme.itemBg,
                          color: isActive ? '#ffffff' : theme.subtitle,
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ padding: '18px 28px 28px', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 0.78fr 0.82fr 0.72fr 0.9fr', gap: '12px', padding: '0 12px 10px', color: theme.subtitle, fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  <span>Product / SKU</span>
                  <span>Total Stock</span>
                  <span>Available Stock</span>
                  <span>Reserved</span>
                  <span>Status</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredInventory.length > 0 ? filteredInventory.map((product, index) => {
                    const stock = Number(product.stock || 0);
                    const reserved = Math.round(stock * 0.18);
                    const available = Math.max(stock - reserved, 0);
                    const progress = Math.min(Math.round((stock / Math.max(totalWarehouseStock, 1)) * 100 * products.length), 100);
                    const health = getStockHealth(product);
                    const binCode = `WH-${String(index + 1).padStart(2, '0')}-${product.category.split(' ')[0].slice(0, 3).toUpperCase()}`;

                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          setSelectedProduct(product);
                          setEditProductForm({ ...product });
                          setShowStockBreakdownModal(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'grid',
                          gridTemplateColumns: '1.45fr 0.78fr 0.82fr 0.72fr 0.9fr',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '14px 12px',
                          borderRadius: '16px',
                          border: theme.border,
                          backgroundColor: theme.cardBg,
                          color: theme.text,
                          cursor: 'pointer',
                          textAlign: 'left',
                          boxShadow: darkMode ? 'none' : '0 10px 24px rgba(15, 23, 42, 0.04)',
                          transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.transform = 'translateY(-2px)';
                          event.currentTarget.style.borderColor = 'rgba(9, 118, 188, 0.32)';
                          event.currentTarget.style.boxShadow = darkMode ? 'none' : '0 16px 30px rgba(15, 23, 42, 0.08)';
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.transform = 'translateY(0)';
                          event.currentTarget.style.borderColor = '';
                          event.currentTarget.style.boxShadow = darkMode ? 'none' : '0 10px 24px rgba(15, 23, 42, 0.04)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '12px', overflow: 'hidden', border: theme.border, backgroundColor: theme.itemBg, flex: '0 0 auto' }}>
                            <img loading="lazy" src={product.images?.[0] || '/placeholder.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: theme.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', color: theme.subtitle, fontSize: '0.72rem', fontWeight: 700 }}>
                              <code style={{ fontFamily: 'monospace' }}>{product.sku}</code>
                              <span>•</span>
                              <span>{product.category}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <strong style={{ display: 'block', fontSize: '1rem', color: theme.text }}>{formatNumber(stock)}</strong>
                          <span style={{ display: 'block', marginTop: '4px', fontSize: '0.68rem', color: theme.subtitle, fontWeight: 800, fontFamily: 'monospace' }}>{binCode}</span>
                        </div>

                        <div>
                          <strong style={{ display: 'block', fontSize: '0.92rem', color: theme.text }}>{formatNumber(available)}</strong>
                          <div style={{ height: '6px', borderRadius: '999px', backgroundColor: darkMode ? '#27272a' : '#e5e7eb', overflow: 'hidden', marginTop: '7px' }}>
                            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #0976BC, #10b981)', borderRadius: '999px' }} />
                          </div>
                        </div>

                        <span style={{ fontSize: '0.86rem', fontWeight: 850, color: '#f59e0b' }}>{formatNumber(reserved)}</span>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <span style={{
                            padding: '7px 10px',
                            borderRadius: '999px',
                            backgroundColor: health.bg,
                            color: health.color,
                            fontSize: '0.72rem',
                            fontWeight: 900,
                            whiteSpace: 'nowrap'
                          }}>
                            {health.label}
                          </span>
                          <ArrowRight size={16} style={{ color: theme.subtitle }} />
                        </div>
                      </button>
                    );
                  }) : (
                    <div style={{
                      padding: '36px',
                      borderRadius: '18px',
                      border: theme.border,
                      backgroundColor: theme.itemBg,
                      textAlign: 'center',
                      color: theme.subtitle,
                      fontWeight: 700
                    }}>
                      No inventory items match your search.
                    </div>
                  )}
                </div>

                <div style={{
                  marginTop: '16px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: theme.border,
                  backgroundColor: theme.itemBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  color: theme.subtitle,
                  fontSize: '0.78rem',
                  fontWeight: 750
                }}>
                  <span>Showing {filteredInventory.length} finished inventory stock item{filteredInventory.length === 1 ? '' : 's'}</span>
                  <span>Total listed stock: {formatNumber(filteredInventory.reduce((sum, item) => sum + Number(item.stock || 0), 0))} units</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* --- NEW QUOTATION MODAL (OVERLAY) --- */}
      {showNewQuoteModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(9, 9, 11, 0.5)', 
          backdropFilter: 'blur(6px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 100 
        }} onClick={() => setShowNewQuoteModal(false)}>
          <div style={{ 
            backgroundColor: theme.cardBg, 
            borderRadius: '16px', 
            width: '100%', 
            maxWidth: '460px', 
            padding: '24px', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: theme.border,
            color: theme.text
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', color: theme.text }}>Draft Custom OEM Quotation</h3>
            
            <form onSubmit={createQuotation} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: theme.subtitle, fontWeight: '600' }}>Client Company Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. PureCare Brands Ltd" 
                  value={newQuote.customer}
                  onChange={(e) => setNewQuote({ ...newQuote, customer: e.target.value })}
                  className="form-input" 
                  style={{ backgroundColor: theme.itemBg, color: theme.text, border: theme.border }}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: theme.subtitle, fontWeight: '600' }}>Product Formulation Spec</label>
                <input 
                  type="text" 
                  placeholder="e.g. Menthol face wipes 60 GSM" 
                  value={newQuote.product}
                  onChange={(e) => setNewQuote({ ...newQuote, product: e.target.value })}
                  className="form-input" 
                  style={{ backgroundColor: theme.itemBg, color: theme.text, border: theme.border }}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.subtitle, fontWeight: '600' }}>Target MOQ</label>
                  <input 
                    type="number" 
                    value={newQuote.moq}
                    onChange={(e) => setNewQuote({ ...newQuote, moq: e.target.value })}
                    className="form-input" 
                    style={{ backgroundColor: theme.itemBg, color: theme.text, border: theme.border }}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.subtitle, fontWeight: '600' }}>Quoted Unit Price (INR)</label>
                  <input 
                    type="number" 
                    value={newQuote.price}
                    onChange={(e) => setNewQuote({ ...newQuote, price: e.target.value })}
                    className="form-input" 
                    style={{ backgroundColor: theme.itemBg, color: theme.text, border: theme.border }}
                    required
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, fontWeight: 'bold' }}>Save Draft</button>
                <button type="button" onClick={() => setShowNewQuoteModal(false)} className="btn btn-secondary" style={{ flex: 1, border: theme.border, backgroundColor: theme.cardBg, color: theme.text }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- NEW CATALOG PRODUCT MODAL (OVERLAY) --- */}
      {showNewProductModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(9, 9, 11, 0.4)', 
          backdropFilter: 'blur(4px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 100 
        }} onClick={() => setShowNewProductModal(false)}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '16px', 
            width: '100%', 
            maxWidth: '520px', 
            padding: '24px', 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e4e4e7',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', marginBottom: '16px' }}>Add Product to Catalog</h3>
            
            <form onSubmit={createProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Product Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Menthol face wipes" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="form-input" 
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Category</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="form-input"
                  >
                    <option value="Clinical PPE">Clinical PPE</option>
                    <option value="Hospital Wipes">Hospital Wipes</option>
                    <option value="Baby Care">Baby Care</option>
                    <option value="Sanitizers">Sanitizers</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Base Price (INR)</label>
                  <input 
                    type="number" 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="form-input" 
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Standard MOQ</label>
                  <input 
                    type="number" 
                    value={newProduct.moq}
                    onChange={(e) => setNewProduct({ ...newProduct, moq: e.target.value })}
                    className="form-input" 
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Available Stock</label>
                  <input 
                    type="number" 
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="form-input" 
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Detailed description</label>
                <textarea 
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="form-input"
                  style={{ minHeight: '60px', fontSize: '0.8rem' }}
                />
              </div>

              {/* Product Image Editor (Crop & Reorder UI Mockup) */}
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569' }}>📸 Product Image Manager & Cropper</span>
                  <span style={{ fontSize: '0.65rem', color: '#0976BC', fontWeight: 'bold' }}>Simulated Editor</span>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {reorderedImages.map((img, idx) => (
                    <div key={idx} style={{ width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', position: 'relative' }}>
                      <img loading="lazy" src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button" 
                        onClick={() => {
                          setReorderedImages(prev => prev.filter((_, i) => i !== idx));
                          logSystemAction('Removed product image catalog reference');
                        }}
                        style={{ position: 'absolute', top: 2, right: 2, backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: '#ffffff', borderRadius: '50%', width: '14px', height: '14px', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justify: 'center' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Drag-drop simulation box */}
                  <div style={{ width: '60px', height: '60px', border: '2px dashed #cbd5e1', borderRadius: '6px', display: 'flex', alignItems: 'center', justify: 'center', cursor: 'pointer', color: '#64748b' }}>
                    <Plus size={16} />
                  </div>
                </div>

                {/* Simulated Cropping Tools Controls */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                  <button 
                    type="button" 
                    onClick={() => setCropBox(prev => ({ ...prev, scale: Math.min(prev.scale + 0.1, 2) }))}
                    style={{ padding: '4px 8px', fontSize: '0.7rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', cursor: 'pointer' }}
                  >
                    Zoom +
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setCropBox(prev => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.5) }))}
                    style={{ padding: '4px 8px', fontSize: '0.7rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', cursor: 'pointer' }}
                  >
                    Zoom -
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setCropBox(prev => ({ ...prev, rotate: (prev.rotate + 90) % 360 }))}
                    style={{ padding: '4px 8px', fontSize: '0.7rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', cursor: 'pointer' }}
                  >
                    Rotate 90°
                  </button>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: 'auto' }}>Scale: {cropBox.scale.toFixed(1)}x | Rotate: {cropBox.rotate}°</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Product</button>
                <button type="button" onClick={() => setShowNewProductModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- NEW OEM ORDER MODAL (OVERLAY) --- */}
      {showNewOemModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(9, 9, 11, 0.4)', 
          backdropFilter: 'blur(4px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 100 
        }} onClick={() => setShowNewOemModal(false)}>
          <div style={{ 
            backgroundColor: theme.cardBg, 
            borderRadius: '16px', 
            width: '100%', 
            maxWidth: '520px', 
            padding: '24px', 
            boxShadow: theme.shadow,
            border: theme.border,
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px', color: theme.text }}>Create OEM Manufacturing Order</h3>
            
            <form onSubmit={handleCreateOemOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Company Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. PureCare Brands Ltd" 
                  value={newOemOrder.company}
                  onChange={(e) => setNewOemOrder({ ...newOemOrder, company: e.target.value })}
                  className="form-input" 
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Contact Person</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sarah Jenkins" 
                  value={newOemOrder.contact}
                  onChange={(e) => setNewOemOrder({ ...newOemOrder, contact: e.target.value })}
                  className="form-input" 
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Product Specifications</label>
                <input 
                  type="text" 
                  placeholder="e.g. Baby Wipes Custom Roll" 
                  value={newOemOrder.product}
                  onChange={(e) => setNewOemOrder({ ...newOemOrder, product: e.target.value })}
                  className="form-input" 
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Substrate Material</label>
                  <select 
                    value={newOemOrder.wipeType}
                    onChange={(e) => setNewOemOrder({ ...newOemOrder, wipeType: e.target.value })}
                    className="form-input"
                  >
                    <option value="Rayon 60 GSM">Rayon 60 GSM</option>
                    <option value="Bamboo 50 GSM">Bamboo 50 GSM</option>
                    <option value="Spunlace 70 GSM">Spunlace 70 GSM</option>
                    <option value="Polyester Blend">Polyester Blend</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Fragrance Infusion</label>
                  <select 
                    value={newOemOrder.fragrance}
                    onChange={(e) => setNewOemOrder({ ...newOemOrder, fragrance: e.target.value })}
                    className="form-input"
                  >
                    <option value="Organic Aloe Vera">Organic Aloe Vera</option>
                    <option value="Rose water infusion">Rose water infusion</option>
                    <option value="Fresh Citrus">Fresh Citrus</option>
                    <option value="Lavender extract">Lavender extract</option>
                    <option value="Unscented">Unscented</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Order Quantity (Units)</label>
                  <input 
                    type="number" 
                    min="10000"
                    value={newOemOrder.quantity}
                    onChange={(e) => setNewOemOrder({ ...newOemOrder, quantity: e.target.value })}
                    className="form-input" 
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Unit Price (INR)</label>
                  <input 
                    type="number" 
                    min="1"
                    value={newOemOrder.unitPrice}
                    onChange={(e) => setNewOemOrder({ ...newOemOrder, unitPrice: e.target.value })}
                    className="form-input" 
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Packaging Configurations</label>
                <select 
                  value={newOemOrder.packaging}
                  onChange={(e) => setNewOemOrder({ ...newOemOrder, packaging: e.target.value })}
                  className="form-input"
                >
                  <option value="Flip Lid 80-Pack Pack">Flip Lid 80-Pack Pack</option>
                  <option value="Single Sachet Carton">Single Sachet Carton</option>
                  <option value="Double Reseal Flowpack">Double Reseal Flowpack</option>
                  <option value="Canister 120-Pack">Canister 120-Pack</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Comments / Formulation Notes</label>
                <textarea 
                  value={newOemOrder.comments}
                  onChange={(e) => setNewOemOrder({ ...newOemOrder, comments: e.target.value })}
                  placeholder="e.g. Requires 70% IPA chemical validation..."
                  className="form-input"
                  style={{ minHeight: '60px', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: '#0976BC', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Create Order</button>
                <button type="button" onClick={() => setShowNewOemModal(false)} className="btn btn-secondary" style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- OEM CUSTOMER PROFILE DRAWER --- */}
      {selectedOemCustomer && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(6px)',
          zIndex: 200,
          display: 'flex',
          justifyContent: 'flex-end',
          animation: 'oemFadeIn 0.3s ease'
        }} onClick={() => setSelectedOemCustomer(null)}>
          <div style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: theme.cardBg,
            borderLeft: theme.border,
            boxShadow: theme.shadow,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            animation: 'oemSlideInRight 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // spring feel
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes oemFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes oemSlideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}} />

            {/* Header */}
            <div style={{ padding: '24px', borderBottom: `1px solid ${theme.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: theme.accent, fontWeight: 'bold', letterSpacing: '0.05em' }}>OEM CUSTOMER PROFILE</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '4px 0 0 0', color: theme.text }}>{selectedOemCustomer.company}</h3>
              </div>
              <button 
                onClick={() => setSelectedOemCustomer(null)}
                style={{ 
                  background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
                  border: 'none', 
                  borderRadius: '50%',
                  cursor: 'pointer', 
                  color: theme.subtitle, 
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = theme.subtitle; }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body content */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* ID Badge & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  padding: '4px 8px', 
                  borderRadius: '6px', 
                  backgroundColor: theme.itemBg, 
                  border: theme.border,
                  color: theme.text
                }}>
                  {selectedOemCustomer.id}
                </span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  padding: '4px 8px', 
                  borderRadius: '6px', 
                  backgroundColor: selectedOemCustomer.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                  color: selectedOemCustomer.status === 'Active' ? '#10B981' : '#F59E0B'
                }}>
                  ● {selectedOemCustomer.status || 'Active'}
                </span>
              </div>

              {/* General details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Users size={16} style={{ color: theme.accent }} />
                  <div style={{ fontSize: '0.85rem', color: theme.subtitle }}>
                    Contact Person: <strong style={{ color: theme.text }}>{selectedOemCustomer.name}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <FileText size={16} style={{ color: theme.accent }} />
                  <div style={{ fontSize: '0.85rem', color: theme.subtitle }}>
                    Email: <a href={`mailto:${selectedOemCustomer.email}`} style={{ color: theme.accent, textDecoration: 'none' }}>{selectedOemCustomer.email}</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Phone size={16} style={{ color: theme.accent }} />
                  <div style={{ fontSize: '0.85rem', color: theme.subtitle }}>
                    Phone: <span style={{ color: theme.text }}>{selectedOemCustomer.phone}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Globe size={16} style={{ color: theme.accent }} />
                  <div style={{ fontSize: '0.85rem', color: theme.subtitle }}>
                    Country: <span style={{ color: theme.text }}>{selectedOemCustomer.country}</span>
                  </div>
                </div>

                {selectedOemCustomer.website && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Globe size={16} style={{ color: theme.accent }} />
                    <div style={{ fontSize: '0.85rem', color: theme.subtitle }}>
                      Website: <a href={`https://${selectedOemCustomer.website}`} target="_blank" rel="noopener noreferrer" style={{ color: theme.accent, textDecoration: 'none' }}>{selectedOemCustomer.website}</a>
                    </div>
                  </div>
                )}
              </div>

              <hr style={{ border: 0, borderTop: `1px solid ${theme.divider}`, margin: 0 }} />

              {/* Industry & MOQ details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ backgroundColor: theme.itemBg, padding: '12px', borderRadius: '10px', border: theme.border }}>
                  <span style={{ fontSize: '0.7rem', color: theme.subtitle, display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>Industry</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: theme.text, marginTop: '4px', display: 'block' }}>
                    {selectedOemCustomer.industry || 'Manufacturing'}
                  </span>
                </div>
                <div style={{ backgroundColor: theme.itemBg, padding: '12px', borderRadius: '10px', border: theme.border }}>
                  <span style={{ fontSize: '0.7rem', color: theme.subtitle, display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>MOQ Requirement</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: theme.text, marginTop: '4px', display: 'block' }}>
                    {formatNumber ? formatNumber(selectedOemCustomer.moq || 10000) : selectedOemCustomer.moq} Units
                  </span>
                </div>
              </div>

              {/* Product interest and lead source */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ backgroundColor: theme.itemBg, padding: '12px', borderRadius: '10px', border: theme.border }}>
                  <span style={{ fontSize: '0.7rem', color: theme.subtitle, display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>Product Interest</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: theme.text, marginTop: '4px', display: 'block' }}>
                    {selectedOemCustomer.interest || 'Wet Wipes formulation'}
                  </span>
                </div>
                <div style={{ backgroundColor: theme.itemBg, padding: '12px', borderRadius: '10px', border: theme.border }}>
                  <span style={{ fontSize: '0.7rem', color: theme.subtitle, display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>Lead Source</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: theme.text, marginTop: '4px', display: 'block' }}>
                    {selectedOemCustomer.source || 'Website'}
                  </span>
                </div>
              </div>

              <hr style={{ border: 0, borderTop: `1px solid ${theme.divider}`, margin: 0 }} />

              {/* Financial performance stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: theme.subtitle, display: 'block' }}>Total Batches / Orders</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.text, marginTop: '4px', display: 'block' }}>
                    {selectedOemCustomer.orders}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: theme.subtitle, display: 'block' }}>Lifetime Revenue</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981', marginTop: '4px', display: 'block' }}>
                    ₹{formatNumber ? formatNumber(selectedOemCustomer.spend) : selectedOemCustomer.spend}
                  </span>
                </div>
              </div>

              <div style={{ backgroundColor: theme.itemBg, padding: '12px', borderRadius: '10px', border: theme.border }}>
                <span style={{ fontSize: '0.7rem', color: theme.subtitle, display: 'block', fontWeight: 'bold' }}>Last Order Date</span>
                <span style={{ fontSize: '0.85rem', color: theme.text, fontWeight: 'bold', marginTop: '4px', display: 'block' }}>
                  {selectedOemCustomer.regDate}
                </span>
              </div>

              <hr style={{ border: 0, borderTop: `1px solid ${theme.divider}`, margin: 0 }} />

              {/* Internal Notes */}
              <div>
                <h4 style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '8px', color: theme.text }}>Internal Administrative Notes</h4>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: theme.subtitle, 
                  backgroundColor: theme.itemBg, 
                  border: theme.border, 
                  borderRadius: '10px', 
                  padding: '12px',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-line'
                }}>
                  {selectedOemCustomer.notes}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '20px 24px', borderTop: `1px solid ${theme.divider}`, display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setSelectedOemCustomer(null)}
                className="btn btn-secondary" 
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- NEW OEM CUSTOMER MODAL (OVERLAY) --- */}
      {showNewOemCustomerModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(9, 9, 11, 0.4)', 
          backdropFilter: 'blur(6px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 210
        }} onClick={() => setShowNewOemCustomerModal(false)}>
          <div style={{ 
            backgroundColor: theme.cardBg, 
            borderRadius: '16px', 
            width: '90%', 
            maxWidth: '580px', 
            padding: '24px', 
            boxShadow: theme.shadow,
            border: theme.border,
            maxHeight: '90vh',
            overflowY: 'auto',
            animation: 'oemModalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }} onClick={(e) => e.stopPropagation()}>
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes oemModalSlideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `}} />
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px', color: theme.text }}>Register New OEM Customer Account</h3>
            
            <form onSubmit={handleCreateOemCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Contact Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aurelia Miller" 
                    value={newOemCustomer.name}
                    onChange={(e) => setNewOemCustomer({ ...newOemCustomer, name: e.target.value })}
                    className="form-input" 
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Company Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aurelia Healthcare" 
                    value={newOemCustomer.company}
                    onChange={(e) => setNewOemCustomer({ ...newOemCustomer, company: e.target.value })}
                    className="form-input" 
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Corporate Email</label>
                  <input 
                    type="email" 
                    placeholder="aurelia@healthcare.com" 
                    value={newOemCustomer.email}
                    onChange={(e) => setNewOemCustomer({ ...newOemCustomer, email: e.target.value })}
                    className="form-input" 
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="+1 (555) 349-2041" 
                    value={newOemCustomer.phone}
                    onChange={(e) => setNewOemCustomer({ ...newOemCustomer, phone: e.target.value })}
                    className="form-input" 
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Corporate Website</label>
                  <input 
                    type="text" 
                    placeholder="e.g. www.aureliahealth.com" 
                    value={newOemCustomer.website}
                    onChange={(e) => setNewOemCustomer({ ...newOemCustomer, website: e.target.value })}
                    className="form-input" 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Country</label>
                  <input 
                    type="text" 
                    placeholder="e.g. United States" 
                    value={newOemCustomer.country}
                    onChange={(e) => setNewOemCustomer({ ...newOemCustomer, country: e.target.value })}
                    className="form-input" 
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Industry Vertical</label>
                  <select 
                    value={newOemCustomer.industry}
                    onChange={(e) => setNewOemCustomer({ ...newOemCustomer, industry: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select Industry</option>
                    <option value="Healthcare & Medical">Healthcare & Medical</option>
                    <option value="Cosmetics & Skincare">Cosmetics & Skincare</option>
                    <option value="FMCG / Retail">FMCG / Retail</option>
                    <option value="Hospitality & Spa">Hospitality & Spa</option>
                    <option value="Industrial Cleaning">Industrial Cleaning</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>MOQ Requirement</label>
                  <input 
                    type="number" 
                    value={newOemCustomer.moq}
                    onChange={(e) => setNewOemCustomer({ ...newOemCustomer, moq: e.target.value })}
                    className="form-input" 
                    min="1000"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Product Interest</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Biodegradable Baby Wipes" 
                    value={newOemCustomer.interest}
                    onChange={(e) => setNewOemCustomer({ ...newOemCustomer, interest: e.target.value })}
                    className="form-input" 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Lead Source</label>
                  <select 
                    value={newOemCustomer.source}
                    onChange={(e) => setNewOemCustomer({ ...newOemCustomer, source: e.target.value })}
                    className="form-input"
                  >
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Trade Show">Trade Show</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Email Campaign">Email Campaign</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: theme.text }}>Internal Account Notes</label>
                <textarea 
                  value={newOemCustomer.notes}
                  onChange={(e) => setNewOemCustomer({ ...newOemCustomer, notes: e.target.value })}
                  placeholder="Additional information about MOQ negotiations, formula requests, or cleanroom demands..."
                  className="form-input"
                  style={{ minHeight: '60px', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: '#0976BC', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Register Customer</button>
                <button type="button" onClick={() => setShowNewOemCustomerModal(false)} className="btn btn-secondary" style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- FLOATING SUCCESS TOAST --- */}
      {oemToast.show && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: darkMode ? '#1e1b4b' : '#ecfdf5',
          border: `1px solid ${darkMode ? '#312e81' : '#a7f3d0'}`,
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          maxWidth: '360px',
          animation: 'toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes toastSlideIn {
              from { transform: translate(100%, -20px); opacity: 0; }
              to { transform: translate(0, 0); opacity: 1; }
            }
          `}} />
          
          <div style={{
            backgroundColor: '#10b981',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0
          }}>
            <Check size={14} strokeWidth={3} />
          </div>

          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: '0 0 2px 0', color: darkMode ? '#ffffff' : '#065f46' }}>
              {oemToast.title}
            </h4>
            {oemToast.id && (
              <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#0976BC', display: 'block', marginBottom: '2px' }}>
                {oemToast.id}
              </span>
            )}
            <p style={{ fontSize: '0.78rem', margin: 0, color: darkMode ? '#cbd5e1' : '#047857', opacity: 0.9 }}>
              {oemToast.desc}
            </p>
          </div>

          <button 
            onClick={() => setOemToast(prev => ({ ...prev, show: false }))}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: darkMode ? '#a5b4fc' : '#059669',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.7
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          >
            <X size={16} />
          </button>
        </div>
      )}

    </div>
  );
};

const B2BLeadsPanel = ({ user, theme }) => {
  const [leads, setLeads] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/users/b2b-requests', {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
    .then(res => res.json())
    .then(data => { setLeads(Array.isArray(data) ? data : []); setLoading(false); })
    .catch(err => { console.error(err); setLoading(false); });
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`/api/users/b2b-requests/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ status: newStatus })
      });
      setLeads(leads.map(l => l._id === id ? { ...l, b2bProfile: { ...l.b2bProfile, verificationStatus: newStatus } } : l));
    } catch (err) { alert('Failed to update status'); }
  };

  if (loading) return <div style={{ padding: 40, color: theme?.text || '#000' }}>Loading B2B Leads...</div>;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ color: theme?.text || '#000', marginBottom: '24px' }}>B2B Enterprise Leads</h2>
      <div style={{ background: theme?.cardBg || '#fff', border: theme?.border || '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: theme?.text || '#000' }}>
          <thead style={{ background: 'rgba(9, 118, 188, 0.05)', borderBottom: theme?.border || '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px' }}>Application ID</th>
              <th style={{ padding: '16px' }}>Company</th>
              <th style={{ padding: '16px' }}>Contact</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>Manager</th>
              <th style={{ padding: '16px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead._id} style={{ borderBottom: theme?.border || '1px solid #e2e8f0' }}>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{lead.b2bProfile?.applicationId || 'N/A'}</td>
                <td style={{ padding: '16px' }}>{lead.b2bProfile?.companyName || 'N/A'}</td>
                <td style={{ padding: '16px' }}>{lead.name}<br/><span style={{fontSize:'0.8rem',color:'#64748b'}}>{lead.email}</span></td>
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '6px 12px', background: '#f1f5f9', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {lead.b2bProfile?.verificationStatus?.replace('_', ' ').toUpperCase() || 'NEW'}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>{lead.b2bProfile?.assignedManager || 'Unassigned'}</td>
                <td style={{ padding: '16px' }}>
                  <select 
                    value={lead.b2bProfile?.verificationStatus || 'new'}
                    onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                    style={{ padding: '8px', borderRadius: '8px', border: theme?.border || '1px solid #cbd5e1', background: theme?.cardBg || '#fff', color: theme?.text || '#000' }}
                  >
                    <option value="new">New</option>
                    <option value="under_review">Under Review</option>
                    <option value="contacted">Contacted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="converted">Converted</option>
                  </select>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center' }}>No B2B Leads found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

