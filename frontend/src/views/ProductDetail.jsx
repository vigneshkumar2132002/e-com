'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Minus,
  Plus,
  ShoppingCart,
  Sparkles,
  Wand2,
  Heart,
  Star,
  Clock,
  Package,
  Truck,
  Search
} from 'lucide-react';

const formatINR = (value) => `INR ${Number(value || 0).toLocaleString('en-IN')}`;

const titleCase = (value = '') => value.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="accordion-content"
          >
            <div className="accordion-content-inner">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [selectedPackSize, setSelectedPackSize] = useState('50 Wipes');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { user } = useAuth();
  const { addToCart } = useCart();

  const isApprovedB2B = user && user.role === 'b2b' && user.b2bProfile?.verificationStatus === 'approved';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Product not found');
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const images = useMemo(() => {
    if (!product?.images?.length) return ['/assets/placeholder.png'];
    return product.images;
  }, [product]);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    if (!isApprovedB2B || !product.b2bPricing?.length) return product.b2cPrice;
    const sortedTiers = [...product.b2bPricing].sort((a, b) => b.minQty - a.minQty);
    return sortedTiers.find((tier) => qty >= tier.minQty)?.price || product.b2cPrice;
  }, [isApprovedB2B, product, qty]);

  const stockStatus = useMemo(() => {
    const stock = Number(product?.stock || 0);
    if (stock <= 0) return { label: 'Confirm availability', tone: 'warning' };
    if (stock < 50) return { label: 'Limited stock', tone: 'warning' };
    return { label: 'In stock', tone: 'success' };
  }, [product]);

  const handleQtyChange = (nextQty) => {
    const stock = Number(product?.stock || 9999);
    setQty(Math.max(1, Math.min(stock || 9999, nextQty)));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page product-detail-center">
        <div className="product-loader" />
        <p>Loading premium product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page product-detail-center">
        <AlertCircle size={30} />
        <p>{error}</p>
        <Link href="/catalog" className="product-back-link">Back to catalog</Link>
      </div>
    );
  }

  if (!product) return null;

  const packSizes = ['10 Wipes', '25 Wipes', '50 Wipes', '80 Wipes', '100 Wipes'];
  const specs = Object.entries(product.specifications || {}).filter(([, value]) => Boolean(value));

  // High-quality mock reviews
  const mockReviews = [
    { name: 'Dr. Alex Mathio', rating: 5, date: '13 Oct 2024', text: '"Bapuji Surgicals dedication to quality and sterile practices resonates strongly with our clinics, positioning the brand as a responsible choice in healthcare supplies."', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop' },
    { name: 'Sarah L., Pharmacy Manager', rating: 5, date: '02 Nov 2024', text: '"Excellent moisture retention and the packaging is very premium. Our patients love the sensitive skin formulation."', img: 'https://images.unsplash.com/photo-1594824436998-d1d4025d57b5?w=100&h=100&fit=crop' }
  ];

  // Mock related products
  const relatedProducts = [
    { title: 'Clinical Sterile Wipes', price: 212, oldPrice: 242, rating: 4.8, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60' },
    { title: 'Antibacterial Bed Bath', price: 145, rating: 4.5, img: '/img/about_hero_cleanroom.png' },
    { title: 'Gentle Baby Wipes', price: 180, rating: 4.9, img: '/img/Bapuji.png' },
    { title: 'Face & Surface Sanitizing', price: 120, oldPrice: 150, rating: 5.0, img: 'https://images.unsplash.com/photo-1627850993540-0de0f00f07fa?w=500&h=600&fit=crop' }
  ];

  return (
    <main className="product-detail-page">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg-color: #ffffff;
          --surface: #ffffff;
          --text-dark: #111827;
          --text-muted: #6b7280;
          --border: #e5e7eb;
          --primary: #111827;
          --radius-card: 24px;
        }

        .product-detail-page {
          min-height: 100vh;
          background-color: var(--bg-color);
          color: var(--text-dark);
          font-family: var(--font-body), Inter, sans-serif;
          padding: 0 0 80px;
        }

        .product-shell {
          max-width: 1300px;
          margin: 0 auto;
          padding: 40px 24px 0;
        }

        .product-header-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        
        .product-header-nav a {
          color: var(--text-dark);
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .top-filter-bar-wrapper {
          width: 100%;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          position: relative;
          z-index: 10;
        }

        .top-filter-bar {
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
        }
        
        .top-filter-bar::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }

        .filter-dropdown {
          padding: 10px 16px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--surface);
          font-size: 0.85rem;
          color: var(--text-dark);
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 0.2s;
        }

        .filter-dropdown:hover {
          border-color: var(--text-dark);
        }

        .filter-search {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 18px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: #f9fafb;
          flex: 1;
          min-width: 250px;
          transition: all 0.2s;
        }

        .filter-search:focus-within {
          background: #ffffff;
          border-color: #0976BC;
          box-shadow: 0 0 0 3px rgba(9,118,188,0.1);
        }

        .filter-search input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 0.9rem;
          background: transparent;
        }

        .filter-pill {
          padding: 10px 18px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--surface);
          font-size: 0.85rem;
          color: var(--text-dark);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        
        .filter-pill:hover {
          border-color: var(--text-dark);
        }

        .product-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }

        /* LEFT GALLERY */
        .product-gallery {
          position: sticky;
          top: 100px;
          display: flex;
          flex-direction: row;
          gap: 24px;
        }

        .main-image-container {
          flex: 1;
          border-radius: var(--radius-card);
          overflow: hidden;
          background: #ffffff;
          position: relative;
        }

        .main-image-container img {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .thumbnail-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 64px;
        }

        .thumbnail-btn {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .thumbnail-btn.active {
          border-color: var(--primary);
        }

        .thumbnail-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* RIGHT INFO */
        .product-info {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .category-pill {
          display: inline-block;
          padding: 6px 12px;
          border: 1px solid var(--border);
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          width: fit-content;
        }

        .product-title {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.1;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .delivery-timer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: var(--surface);
          border-radius: 12px;
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .delivery-timer svg {
          color: var(--primary);
        }

        .section-label {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--text-dark);
        }

        .size-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .size-pill {
          padding: 12px 20px;
          border-radius: 999px;
          background: var(--surface);
          border: 1px solid transparent;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-muted);
        }

        .size-pill.active {
          background: var(--primary);
          color: white;
        }
        
        .size-pill:hover:not(.active) {
          border-color: var(--border);
          color: var(--text-dark);
        }

        .features-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 8px;
        }

        .feature-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .feature-badge svg {
          color: #10b981;
        }

        .action-row {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .qty-pill {
          display: flex;
          align-items: center;
          background: var(--surface);
          border-radius: 999px;
          padding: 4px;
        }

        .qty-pill button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: transparent;
          cursor: pointer;
          display: grid;
          place-items: center;
          color: var(--text-dark);
          transition: background 0.2s;
        }
        
        .qty-pill button:hover {
          background: #f3f4f6;
        }

        .qty-pill span {
          width: 40px;
          text-align: center;
          font-weight: 600;
          font-size: 1rem;
        }

        .btn-add-cart {
          flex: 1;
          border-radius: 999px;
          background: var(--primary);
          color: white;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .btn-add-cart:hover {
          background: #1f2937;
          transform: translateY(-2px);
        }

        .btn-wishlist {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--surface);
          border: 1px solid var(--border);
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-dark);
        }

        .btn-wishlist:hover {
          border-color: var(--text-dark);
        }

        /* ACCORDIONS */
        .accordions-container {
          background: var(--surface);
          border-radius: var(--radius-card);
          padding: 12px 24px;
          margin-top: 12px;
        }

        .accordion-item {
          border-bottom: 1px solid var(--border);
        }

        .accordion-item:last-child {
          border-bottom: none;
        }

        .accordion-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          background: none;
          border: none;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-dark);
          cursor: pointer;
        }

        .accordion-content {
          overflow: hidden;
        }

        .accordion-content-inner {
          padding-bottom: 20px;
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .shipping-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 12px;
        }

        .shipping-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        
        .shipping-item svg {
          color: var(--text-dark);
        }

        .shipping-text p {
          margin: 0;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .shipping-text strong {
          display: block;
          font-size: 0.9rem;
          color: var(--text-dark);
          margin-top: 2px;
        }

        /* REVIEWS SECTION */
        .reviews-section {
          margin-top: 80px;
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 32px;
          letter-spacing: -0.02em;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 40px;
        }

        .review-score-block {
          display: flex;
          gap: 24px;
        }

        .review-large-score {
          font-size: 5rem;
          line-height: 1;
          font-weight: 400;
          letter-spacing: -0.05em;
        }

        .review-large-score span {
          font-size: 2rem;
          color: var(--text-muted);
        }

        .review-bars {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          justify-content: center;
        }

        .review-bar-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .review-bar-track {
          flex: 1;
          height: 6px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .review-bar-fill {
          height: 100%;
          background: var(--text-dark);
          border-radius: 999px;
        }

        .review-card {
          background: var(--surface);
          border-radius: var(--radius-card);
          padding: 24px;
          position: relative;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .review-header-left h4 {
          margin: 0 0 4px 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .review-stars {
          display: flex;
          gap: 2px;
          color: #fbbf24;
        }

        .review-date {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .review-text {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .review-user-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        /* RELATED PRODUCTS */
        .related-section {
          margin-top: 100px;
          text-align: center;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 40px;
        }

        .related-card {
          text-align: left;
          cursor: pointer;
        }

        .related-card-img {
          width: 100%;
          aspect-ratio: 4/5;
          border-radius: 16px;
          overflow: hidden;
          background: #f3f4f6;
          margin-bottom: 16px;
        }

        .related-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .related-card:hover .related-card-img img {
          transform: scale(1.05);
        }

        .related-title {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .related-stars {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .related-stars svg {
          color: #fbbf24;
        }

        .related-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .related-price {
          font-weight: 700;
          font-size: 1rem;
        }

        .related-old-price {
          color: var(--text-muted);
          text-decoration: line-through;
          font-size: 0.85rem;
        }

        .related-discount {
          background: #fee2e2;
          color: #ef4444;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* OEM BANNER */
        .oem-banner {
          background: var(--surface);
          border-radius: var(--radius-card);
          padding: 24px;
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid var(--border);
        }

        .oem-banner-text h3 {
          margin: 0 0 4px 0;
          font-size: 1.05rem;
        }

        .oem-banner-text p {
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .btn-oem {
          padding: 10px 20px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: transparent;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-oem:hover {
          border-color: var(--primary);
        }

        /* RESPONSIVE */
        @media (max-width: 1023px) {
          .product-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          @media (max-width: 1023px) {
            .product-gallery {
              flex-direction: column-reverse;
            }
            .thumbnail-col {
              flex-direction: row;
              width: 100%;
              overflow-x: auto;
            }
            .thumbnail-btn {
              flex: 0 0 64px;
            }
          }

          .reviews-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .related-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 767px) {
          .top-filter-bar {
            flex-wrap: wrap;
            padding: 12px 16px;
          }
          .filter-search {
            min-width: 100%;
            order: -1; /* Push search bar to the top on mobile */
          }
        }

        @media (max-width: 480px) {
          .product-detail-page {
            padding: 0 0 60px;
          }

          .product-shell {
            padding: 24px 16px 0;
          }

          .product-title {
            font-size: 2rem;
          }

          .product-header-nav {
            margin-bottom: 20px;
          }

          .action-row {
            flex-direction: column;
          }

          .qty-pill {
            width: fit-content;
          }

          .btn-add-cart {
            padding: 16px;
          }

          .btn-wishlist {
            display: none;
          }

          .oem-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .shipping-grid {
            grid-template-columns: 1fr;
          }
        }
      `}} />

      <div className="top-filter-bar-wrapper">
        <div className="top-filter-bar">
          <div className="filter-dropdown">
            Categories <ChevronDown size={14} />
          </div>
          <div className="filter-dropdown">
            New Product <ChevronDown size={14} />
          </div>
          <div className="filter-search">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
            <Sparkles size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="filter-pill">Clinical</div>
            <div className="filter-pill">Baby</div>
            <div className="filter-pill">Sanitizing</div>
            <div className="filter-pill">OEM</div>
          </div>
        </div>
      </div>

      <div className="product-shell">
        <div className="product-header-nav">
          <Link href="/catalog"><ArrowLeft size={16} /></Link>
          <span>Product details</span>
        </div>

        <div className="product-grid">
          {/* Left Gallery */}
          <div className="product-gallery">
            <div className="thumbnail-col">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  className={`thumbnail-btn ${activeImage === idx ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                >
                  <img loading="lazy" src={img} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="main-image-container"
              >
                <img loading="lazy" src={images[activeImage]} alt={product.name} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Info */}
          <div className="product-info">
            <div>
              <span className="category-pill">{titleCase(product.category) || 'Medical Grade'}</span>
            </div>
            
            <div>
              <h1 className="product-title">{product.name}</h1>
              <p className="product-price">{formatINR(unitPrice)}</p>
            </div>

            <div className="delivery-timer">
              <Clock size={18} />
              <span>Order in 02:30:25 to get next day delivery</span>
            </div>

            {/* Premium Feature Badges */}
            <div className="features-row">
              <span className="feature-badge"><Check size={16} /> Dermatologically Tested</span>
              <span className="feature-badge"><Check size={16} /> Alcohol Free</span>
              <span className="feature-badge"><Check size={16} /> Safe for Sensitive Skin</span>
              {product.isOemCapable && <span className="feature-badge"><Check size={16} /> OEM Available</span>}
            </div>

            {/* Pack Size Selector */}
            <div>
              <div className="section-label">Select Pack Size</div>
              <div className="size-selector">
                {packSizes.map(size => (
                  <button 
                    key={size}
                    className={`size-pill ${selectedPackSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedPackSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Row */}
            <div className="action-row">
              <div className="qty-pill">
                <button onClick={() => handleQtyChange(qty - 1)}><Minus size={18} /></button>
                <span>{qty}</span>
                <button onClick={() => handleQtyChange(qty + 1)}><Plus size={18} /></button>
              </div>
              <button className="btn-add-cart" onClick={handleAddToCart}>
                {added ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>
              <button className="btn-wishlist">
                <Heart size={20} />
              </button>
            </div>

            {/* B2B / OEM Block */}
            {product.isOemCapable && (
              <div className="oem-banner">
                <div className="oem-banner-text">
                  <h3>Private Label Manufacturing Available</h3>
                  <p>Custom packaging, MOQ information, and lead times.</p>
                </div>
                <Link href="/oem">
                  <button className="btn-oem">Request Consultation</button>
                </Link>
              </div>
            )}

            {/* Accordions */}
            <div className="accordions-container">
              <AccordionItem title="Description & Specifications" defaultOpen={true}>
                <p>{product.description}</p>
                <ul style={{ margin: '12px 0 0 20px', padding: 0 }}>
                  {specs.map(([k, v]) => (
                    <li key={k}><strong>{titleCase(k)}:</strong> {v}</li>
                  ))}
                </ul>
              </AccordionItem>
              <AccordionItem title="Shipping">
                <div className="shipping-grid">
                  <div className="shipping-item">
                    <Check size={20} />
                    <div className="shipping-text">
                      <p>Discount</p>
                      <strong>Disc 50%</strong>
                    </div>
                  </div>
                  <div className="shipping-item">
                    <Package size={20} />
                    <div className="shipping-text">
                      <p>Package</p>
                      <strong>Regular Package</strong>
                    </div>
                  </div>
                  <div className="shipping-item">
                    <Truck size={20} />
                    <div className="shipping-text">
                      <p>Delivery Time</p>
                      <strong>3-4 Working Days</strong>
                    </div>
                  </div>
                  <div className="shipping-item">
                    <Clock size={20} />
                    <div className="shipping-text">
                      <p>Estimation Arrive</p>
                      <strong>10 - 12 October 2024</strong>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <section className="reviews-section">
          <h2 className="section-title">Rating & Reviews</h2>
          <div className="reviews-grid">
            <div>
              <div className="review-score-block">
                <div className="review-large-score">4.5<span>/5</span></div>
                <div className="review-bars">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div className="review-bar-row" key={star}>
                      <Star size={12} fill={star >= 4 ? '#fbbf24' : 'transparent'} stroke={star >= 4 ? '#fbbf24' : '#d1d5db'} /> {star}
                      <div className="review-bar-track">
                        <div className="review-bar-fill" style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '2%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '12px' }}>(50 New Reviews)</p>
            </div>
            
            <div className="review-card-container">
              <div className="review-card">
                <div className="review-header">
                  <div className="review-header-left">
                    <h4>{mockReviews[0].name}</h4>
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="#fbbf24" stroke="none" />)}
                    </div>
                  </div>
                  <span className="review-date">{mockReviews[0].date}</span>
                </div>
                <p className="review-text">{mockReviews[0].text}</p>
                <img loading="lazy" src={mockReviews[0].img} alt={mockReviews[0].name} className="review-user-img" />
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="related-section">
          <h2 className="section-title">You might also like</h2>
          <div className="related-grid">
            {relatedProducts.map((rel, idx) => (
              <Link href="/catalog" key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="related-card">
                  <div className="related-card-img">
                    <img loading="lazy" src={rel.img} alt={rel.title} />
                  </div>
                  <h4 className="related-title">{rel.title}</h4>
                  <div className="related-stars">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="#fbbf24" stroke="none" />)}
                    <span style={{ color: 'var(--text-dark)', fontWeight: '600', marginLeft: '4px' }}>{rel.rating}</span>/5
                  </div>
                  <div className="related-price-row">
                    <span className="related-price">${rel.price}</span>
                    {rel.oldPrice && <span className="related-old-price">${rel.oldPrice}</span>}
                    {rel.oldPrice && <span className="related-discount">-20%</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
};

export default ProductDetail;

