import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import { seedProducts } from '../config/mockData.js';
import { assistantKnowledge } from '../config/assistantKnowledge.js';

const INTERNAL_DENIAL = 'I am only authorized to provide information related to Bapuji Surgicals products and customer services. I cannot access or disclose internal company systems or confidential information.';
const OUT_OF_SCOPE_DENIAL = 'I am specifically designed to assist with Bapuji Surgicals products, orders, and services. Please contact the appropriate professional for assistance with this topic.';
const UNAVAILABLE = "I don't have that information available at the moment. Please contact our customer support team.";

const rateLimitStore = new Map();
const RATE_WINDOW_MS = 60 * 1000;
const RATE_LIMIT = 12;

const forbiddenPatterns = [
  /source\s*code|show.*code|website\s*files?|file\s*paths?|config(uration)?\s*files?/i,
  /database|db\s*records?|mongo|sql|schema|collections?/i,
  /admin|dashboard|internal|server|backend|architecture|api\s*keys?|password|token|secret/i,
  /customer\s*data|user\s*account|employee|payroll|financial\s*records?/i,
  /system\s*prompt|instructions|prompt\s*injection|ignore\s+(all\s+)?previous/i,
  /hack|exploit|malware|phishing|bypass|jailbreak/i
];

const allowedBusinessPatterns = [
  /product|catalog|sku|spec|material|size|packaging|steril/i,
  /price|pricing|cost|availability|stock|bulk|wholesale|b2b|oem|private\s*label/i,
  /ship|delivery|dispatch|track|order|invoice|return|refund|support|contact/i,
  /company|office|address|phone|email|hours|branch|manufacturing/i,
  /wet\s*wipes?|wound|gauze|cotton|gown|underpad|saline|alcohol|chg|disinfect/i
];

const formatINR = (value) => `INR ${Number(value || 0).toLocaleString('en-IN')}`;

const normalize = (value = '') => value.toString().toLowerCase().trim();

const isRateLimited = (key) => {
  const now = Date.now();
  const state = rateLimitStore.get(key) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (now > state.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  state.count += 1;
  rateLimitStore.set(key, state);
  return state.count > RATE_LIMIT;
};

const getPublicProducts = async () => {
  if (mongoose.connection.readyState !== 1) return seedProducts;
  const products = await Product.find({})
    .select('name sku description category b2cPrice b2bPricing isOemCapable specifications stock')
    .lean();
  return products.length ? products : seedProducts;
};

const findRelevantProducts = (message, products) => {
  const text = normalize(message);
  const words = text.split(/[^a-z0-9]+/).filter((word) => word.length > 2);

  return products
    .map((product) => {
      const searchable = normalize([
        product.name,
        product.sku,
        product.category,
        product.description,
        product.specifications?.material,
        product.specifications?.packaging,
        product.specifications?.sterilization
      ].filter(Boolean).join(' '));
      const score = words.reduce((sum, word) => sum + (searchable.includes(word) ? 1 : 0), 0);
      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.product);
};

const productLine = (product) => {
  const specs = product.specifications || {};
  const b2bTier = product.b2bPricing?.[0];
  const availability = Number(product.stock || 0) > 0 ? 'Available' : 'Please confirm availability with support';
  return [
    `${product.name} (${product.sku})`,
    `Category: ${product.category}`,
    `Retail price: ${formatINR(product.b2cPrice)}`,
    b2bTier ? `Bulk pricing starts around ${formatINR(b2bTier.price)} from ${b2bTier.minQty}+ units` : null,
    specs.material ? `Material: ${specs.material}` : null,
    specs.size ? `Size: ${specs.size}` : null,
    specs.packaging ? `Packaging: ${specs.packaging}` : null,
    specs.sterilization ? `Sterilization: ${specs.sterilization}` : null,
    `OEM capable: ${product.isOemCapable ? 'Yes' : 'No'}`,
    `Availability: ${availability}`
  ].filter(Boolean).join('\n');
};

const supportFooter = () => (
  `\n\nFor support: ${assistantKnowledge.company.email} | ${assistantKnowledge.company.phone} | Contact page: ${assistantKnowledge.company.contactPage}`
);

const buildRestrictedAnswer = async (message) => {
  const text = normalize(message);

  if (!text) return 'Please type your question about Bapuji Surgicals products, orders or services.';
  if (forbiddenPatterns.some((pattern) => pattern.test(text))) return INTERNAL_DENIAL;
  if (!allowedBusinessPatterns.some((pattern) => pattern.test(text))) return OUT_OF_SCOPE_DENIAL;

  if (/track|order\s*status|where.*order|dispatch/i.test(text)) {
    return `Please share your Order ID so our team can help with tracking. You can also check the customer dashboard for order status updates.${supportFooter()}`;
  }

  if (/return|refund|cancel/i.test(text)) {
    return `${assistantKnowledge.returns.summary}\n${assistantKnowledge.returns.nextStep}${supportFooter()}`;
  }

  if (/ship|delivery|dispatch/i.test(text)) {
    return `${assistantKnowledge.shipping.summary}\n${assistantKnowledge.shipping.tracking}${supportFooter()}`;
  }

  if (/company|office|address|phone|email|contact|branch|hours|manufacturing/i.test(text)) {
    return [
      `${assistantKnowledge.company.name}: ${assistantKnowledge.company.description}`,
      `Office: ${assistantKnowledge.company.office}`,
      `Manufacturing: ${assistantKnowledge.company.manufacturing}`,
      `Email: ${assistantKnowledge.company.email}`,
      `Phone: ${assistantKnowledge.company.phone}`,
      `Contact page: ${assistantKnowledge.company.contactPage}`
    ].join('\n');
  }

  if (/oem|private\s*label|custom|manufactur/i.test(text)) {
    return `${assistantKnowledge.oem.summary}\n${assistantKnowledge.oem.nextStep}${supportFooter()}`;
  }

  const products = await getPublicProducts();
  const relevantProducts = findRelevantProducts(message, products);

  if (relevantProducts.length > 0) {
    return `Here are relevant public catalog matches:\n\n${relevantProducts.map(productLine).join('\n\n')}${supportFooter()}`;
  }

  if (/product|catalog|recommend|available|price|sku/i.test(text)) {
    const featured = products.slice(0, 4).map((product) => `${product.name} (${product.sku}) - ${formatINR(product.b2cPrice)}`).join('\n');
    return `I can help with product details from the public catalog. Some available catalog items are:\n${featured}${supportFooter()}`;
  }

  return UNAVAILABLE;
};

export const chatWithAssistant = async (req, res) => {
  try {
    const message = `${req.body?.message || ''}`.slice(0, 1000);
    const rateKey = req.ip || req.headers['x-forwarded-for'] || 'unknown';

    if (isRateLimited(rateKey)) {
      return res.status(429).json({
        reply: 'Too many assistant messages. Please wait a moment and try again.'
      });
    }

    const reply = await buildRestrictedAnswer(message);
    res.json({
      reply,
      scope: 'restricted_customer_support',
      canAccessInternalSystems: false
    });
  } catch (error) {
    res.status(500).json({ reply: UNAVAILABLE, message: error.message });
  }
};
