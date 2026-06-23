import Product from '../models/productModel.js';

// @desc    Fetch all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  const category = req.query.category;
  const search = req.query.search;
  
  let query = {};
  if (category) {
    query.category = category;
  }
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  try {
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const { 
    name, 
    sku, 
    description, 
    category, 
    images, 
    b2cPrice, 
    b2bPricing, 
    isOemCapable, 
    specifications, 
    stock 
  } = req.body;

  try {
    const skuExists = await Product.findOne({ sku });
    if (skuExists) {
      return res.status(400).json({ message: 'Product SKU already exists' });
    }

    const product = new Product({
      name,
      sku,
      description,
      category,
      images: images || ['/assets/placeholder.png'],
      b2cPrice,
      b2bPricing: b2bPricing || [],
      isOemCapable: isOemCapable || false,
      specifications,
      stock: stock || 0
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  const { 
    name, 
    description, 
    category, 
    images, 
    b2cPrice, 
    b2bPricing, 
    isOemCapable, 
    specifications, 
    stock 
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.images = images || product.images;
      product.b2cPrice = b2cPrice !== undefined ? b2cPrice : product.b2cPrice;
      product.b2bPricing = b2bPricing || product.b2bPricing;
      product.isOemCapable = isOemCapable !== undefined ? isOemCapable : product.isOemCapable;
      product.specifications = specifications || product.specifications;
      product.stock = stock !== undefined ? stock : product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
