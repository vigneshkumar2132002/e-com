import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Search, Filter, Layers, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const isApprovedB2B = user && user.role === 'b2b' && user.b2bProfile?.verificationStatus === 'approved';
  const isPendingB2B = user && user.role === 'b2b' && user.b2bProfile?.verificationStatus === 'pending';

  useEffect(() => {
    fetchProducts();
  }, [category]); // reload on category change

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products';
      const params = [];
      if (category) params.push(`category=${category}`);
      if (search) params.push(`search=${search}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load products');
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="catalog-container">
      {/* Styles injected locally to build the visual design from the reference video */}
      <style dangerouslySetInnerHTML={{ __html: `
        .catalog-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px 100px 24px;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
          box-sizing: border-box;
        }

        /* Catalog Hero section */
        .catalog-hero {
          background: linear-gradient(135deg, #021b2d 0%, #010d16 100%);
          border-radius: 24px;
          padding: 60px;
          position: relative;
          overflow: hidden;
          margin-bottom: 60px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .catalog-hero-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(9, 118, 188, 0.15) 0%, transparent 70%);
          top: -100px;
          right: -100px;
          pointer-events: none;
        }

        .catalog-hero-title {
          font-family: var(--font-display), sans-serif;
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin-bottom: 20px;
        }

        .catalog-hero-desc {
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 32px;
          max-width: 540px;
        }

        /* Category Masonry Collage */
        .category-collage-section {
          margin-bottom: 80px;
        }

        .category-section-title {
          font-family: var(--font-display), sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #000000;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .category-section-title::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 22px;
          background-color: #0976BC;
          border-radius: 2px;
        }

        .category-collage-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: 200px;
          gap: 24px;
        }

        .category-collage-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.01);
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .category-collage-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(9, 118, 188, 0.08);
          border-color: rgba(9, 118, 188, 0.15);
        }

        .category-card-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .category-collage-card:hover .category-card-bg {
          transform: scale(1.05);
        }

        .category-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(1, 13, 22, 0.85) 0%, rgba(1, 13, 22, 0.4) 60%, rgba(1, 13, 22, 0.1) 100%);
          z-index: 1;
        }

        .category-card-content {
          position: absolute;
          bottom: 28px;
          left: 28px;
          right: 28px;
          z-index: 2;
          color: #ffffff;
        }

        .category-card-name {
          font-family: var(--font-display), sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }

        .category-card-count {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        /* Products Listing Area */
        .products-section-title {
          font-family: var(--font-display), sans-serif;
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          text-align: center;
          margin-bottom: 12px;
          color: #000000;
        }

        .products-section-subtitle {
          text-align: center;
          color: rgba(0, 0, 0, 0.5);
          font-size: 1.05rem;
          margin-bottom: 40px;
        }

        /* Centered Filter Tabs */
        .products-filter-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 50px;
        }

        .filter-tab-btn {
          background-color: #FAF9F6;
          color: rgba(0, 0, 0, 0.65);
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 10px 24px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .filter-tab-btn:hover {
          background-color: rgba(9, 118, 188, 0.05);
          color: #0976BC;
          border-color: rgba(9, 118, 188, 0.15);
        }

        .filter-tab-btn.active {
          background-color: #0976BC;
          color: #ffffff;
          border-color: #0976BC;
          box-shadow: 0 4px 12px rgba(9, 118, 188, 0.15);
        }

        /* High Fidelity Product Cards */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }

        .product-card {
          background-color: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.005);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(9, 118, 188, 0.04);
          border-color: rgba(9, 118, 188, 0.12);
        }

        .product-card-img-wrapper {
          width: 100%;
          height: 200px;
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          background-color: #F8F8FA;
        }

        .product-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover .product-card-img {
          transform: scale(1.04);
        }

        .product-rating-stars {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
          color: #ff9500;
          font-size: 0.9rem;
        }

        .product-rating-count {
          color: rgba(0, 0, 0, 0.4);
          font-size: 0.8rem;
          margin-left: 4px;
        }

        .product-card-price-row {
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
        }

        .product-card-btn {
          background-color: #000000;
          color: #ffffff;
          border: none;
          height: 38px;
          padding: 0 16px;
          border-radius: 19px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .product-card-btn:hover {
          background-color: #0976BC;
          transform: translateY(-1px);
        }

        /* Media Queries */
        @media (max-width: 992px) {
          .catalog-container {
            padding: 60px 24px;
          }
          .catalog-hero {
            grid-template-columns: 1fr;
            padding: 40px;
          }
          .category-collage-grid {
            grid-auto-rows: 160px;
          }
        }

        @media (max-width: 768px) {
          .category-collage-grid {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .category-collage-card {
            height: 180px;
          }
        }
      `}} />

      {/* Hero Header */}
      <div className="catalog-hero">
        <div className="catalog-hero-glow" />
        <div>
          <span className="cinematic-badge" style={{ marginBottom: '16px', display: 'inline-flex', background: 'rgba(255, 255, 255, 0.08)', padding: '6px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)' }}>
            <CheckCircle2 size={14} style={{ marginRight: '6px' }} /> Certified Medical Supplies
          </span>
          <h1 className="catalog-hero-title">Explore Our Surgical & Healthcare Catalog</h1>
          <p className="catalog-hero-desc">
            Explore our range of hospital-grade wound dressings, cotton roll packs, surgical apparel, and advanced sterilization supplies calibrated for strict clinical standards.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: '1', minWidth: '280px', maxWidth: '450px', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search products (e.g. gauze, cotton, gowns)..." 
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingRight: '48px', height: '48px', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff' }}
            />
            <button type="submit" style={{
              position: 'absolute',
              right: '4px',
              top: '4px',
              bottom: '4px',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              padding: '0 16px'
            }}>
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Hero right-side visual image mockup */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/img/careers_team.png" 
            alt="Bapuji Catalog" 
            style={{ width: '100%', maxWidth: '340px', height: 'auto', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }} 
          />
        </div>
      </div>

      {/* B2B Status Alerts */}
      {isApprovedB2B ? (
        <div style={{
          background: 'rgba(40, 167, 69, 0.08)',
          border: '1px solid rgba(40, 167, 69, 0.25)',
          padding: '16px 20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#28a745',
          fontSize: '0.95rem',
          marginBottom: '40px'
        }}>
          <CheckCircle2 size={20} />
          <div>
            <strong>B2B Wholesaler Program Active.</strong> Tiered contract wholesale pricing is automatically applied to your cart based on purchase volumes.
          </div>
        </div>
      ) : isPendingB2B ? (
        <div style={{
          background: 'rgba(255, 193, 7, 0.08)',
          border: '1px solid rgba(255, 193, 7, 0.25)',
          padding: '16px 20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#ffc107',
          fontSize: '0.95rem',
          marginBottom: '40px'
        }}>
          <HelpCircle size={20} />
          <div>
            <strong>B2B Verification Pending.</strong> Your credentials are currently being reviewed by Bapuji Admin. Retail prices are shown below. We will notify you when wholesale prices are unlocked.
          </div>
        </div>
      ) : (
        user && user.role === 'b2c' && (
          <div style={{
            background: 'rgba(0, 180, 216, 0.05)',
            border: '1px solid rgba(0, 180, 216, 0.15)',
            padding: '16px 20px',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.9rem',
            marginBottom: '40px'
          }}>
            <div style={{ color: 'var(--text-secondary)' }}>
              Are you a Hospital, Pharmacy, or Clinical Procurement Officer? Log in or apply for a B2B wholesaler account.
            </div>
            <Link to="/register-b2b" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Apply for Wholesale Prices <ChevronRight size={14} />
            </Link>
          </div>
        )
      )}

      {/* Category Collage Grid Section (Mosaic design as in the reference video) */}
      <section className="category-collage-section">
        <h2 className="category-section-title">Shop by Category</h2>
        <div className="category-collage-grid">
          
          {/* Card 1: Wound Care (Tall, spans 6 columns, 2 rows) */}
          <div 
            className="category-collage-card" 
            style={{ gridColumn: 'span 6', gridRow: 'span 2' }}
            onClick={() => {
              setCategory('wound-care');
              document.getElementById('products-listing-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="category-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&auto=format&fit=crop&q=80')" }} />
            <div className="category-card-overlay" />
            <div className="category-card-content">
              <h3 className="category-card-name">Wound Care</h3>
              <span className="category-card-count">Explore dressings, gauze & rolls</span>
            </div>
          </div>

          {/* Card 2: Surgical Apparel (Wide, spans 6 columns, 1 row) */}
          <div 
            className="category-collage-card" 
            style={{ gridColumn: 'span 6', gridRow: 'span 1' }}
            onClick={() => {
              setCategory('apparel');
              document.getElementById('products-listing-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="category-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80')" }} />
            <div className="category-card-overlay" />
            <div className="category-card-content">
              <h3 className="category-card-name">Surgical Apparel</h3>
              <span className="category-card-count">Drapes, gowns & protective wear</span>
            </div>
          </div>

          {/* Card 3: Hygiene (Spans 3 columns, 1 row) */}
          <div 
            className="category-collage-card" 
            style={{ gridColumn: 'span 3', gridRow: 'span 1' }}
            onClick={() => {
              setCategory('hygiene');
              document.getElementById('products-listing-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="category-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1620271937166-4aa8d8d3a74f?w=800&auto=format&fit=crop&q=80')" }} />
            <div className="category-card-overlay" />
            <div className="category-card-content">
              <h3 className="category-card-name">Hygiene</h3>
              <span className="category-card-count">Wet wipes & care packs</span>
            </div>
          </div>

          {/* Card 4: Sterilization (Spans 3 columns, 1 row) */}
          <div 
            className="category-collage-card" 
            style={{ gridColumn: 'span 3', gridRow: 'span 1' }}
            onClick={() => {
              setCategory('sterilization');
              document.getElementById('products-listing-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="category-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&auto=format&fit=crop&q=80')" }} />
            <div className="category-card-overlay" />
            <div className="category-card-content">
              <h3 className="category-card-name">Sterilization</h3>
              <span className="category-card-count">Reels, pouches & indicators</span>
            </div>
          </div>

        </div>
      </section>

      {/* Products Listing Section */}
      <section id="products-listing-section" style={{ paddingTop: '40px' }}>
        <h2 className="products-section-title">Our Products Collections</h2>
        <p className="products-section-subtitle">
          Explore hospital-grade medical consumables matching your clinic or distribution requirements.
        </p>

        {/* Filter Tabs */}
        <div className="products-filter-tabs">
          <button 
            onClick={() => setCategory('')} 
            className={`filter-tab-btn ${category === '' ? 'active' : ''}`}
          >
            All Products
          </button>
          <button 
            onClick={() => setCategory('wound-care')} 
            className={`filter-tab-btn ${category === 'wound-care' ? 'active' : ''}`}
          >
            Wound Care
          </button>
          <button 
            onClick={() => setCategory('apparel')} 
            className={`filter-tab-btn ${category === 'apparel' ? 'active' : ''}`}
          >
            Surgical Apparel
          </button>
          <button 
            onClick={() => setCategory('hygiene')} 
            className={`filter-tab-btn ${category === 'hygiene' ? 'active' : ''}`}
          >
            Hygiene
          </button>
          <button 
            onClick={() => setCategory('sterilization')} 
            className={`filter-tab-btn ${category === 'sterilization' ? 'active' : ''}`}
          >
            Sterilization
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            Loading products from inventory...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--accent)' }}>
            Error: {error}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            No products matched your search or category filters.
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const firstB2bTier = product.b2bPricing?.[0];
              const maxB2bDiscount = product.b2bPricing?.[product.b2bPricing.length - 1];

              // Mock rating based on product name length/id to keep high fidelity as in the video
              const rating = ((product._id.charCodeAt(product._id.length - 1) % 5) * 0.2 + 4.1).toFixed(1);
              const reviewCount = (product._id.charCodeAt(product._id.length - 2) * 2) + 12;

              return (
                <div key={product._id} className="product-card">
                  {/* Thumbnail wrapper */}
                  <div className="product-card-img-wrapper">
                    <Link to={`/product/${product._id}`}>
                      <img 
                        src={product.images?.[0] || '/assets/placeholder.png'} 
                        alt={product.name} 
                        className="product-card-img"
                      />
                    </Link>
                  </div>

                  {/* Badges & Category */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge badge-category" style={{ fontSize: '0.7rem' }}>{product.category}</span>
                      {product.isOemCapable && (
                        <span className="badge badge-approved" style={{ fontSize: '0.7rem', color: 'var(--primary-light)', backgroundColor: 'var(--primary-glow)' }}>OEM</span>
                      )}
                    </div>
                    
                    <Link to={`/product/${product._id}`}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>{product.name}</h3>
                    </Link>
                    
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', height: '36px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.5' }}>
                      {product.description}
                    </p>

                    {/* Rating row matching the video references */}
                    <div className="product-rating-stars">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      <span style={{ color: 'rgba(0,0,0,0.6)', fontWeight: 600, fontSize: '0.8rem', marginLeft: '4px' }}>{rating}</span>
                      <span className="product-rating-count">({reviewCount})</span>
                    </div>
                  </div>

                  {/* Pricing row */}
                  <div className="product-card-price-row">
                    {isApprovedB2B && firstB2bTier ? (
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>B2C Price: <del>₹{product.b2cPrice}</del></span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)' }}>
                          ₹{maxB2bDiscount?.price} - ₹{firstB2bTier?.price}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block' }}>Wholesale Tiers Active</span>
                      </div>
                    ) : (
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Retail Price</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>₹{product.b2cPrice}</span>
                      </div>
                    )}

                    <button 
                      onClick={() => {
                        addToCart(product, 1);
                        alert(`${product.name} added to cart!`);
                      }}
                      className="product-card-btn"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Catalog;
