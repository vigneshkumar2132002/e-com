import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ChevronLeft, ShoppingCart, Layers, FileSpreadsheet, Settings, AlertCircle } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

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

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    alert(`${qty} units of ${product.name} added to cart!`);
  };

  if (loading) return <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading product specifications...</div>;
  if (error) return <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--accent)' }}>Error: {error}</div>;
  if (!product) return null;

  return (
    <div className="container" style={{ padding: '40px 24px 100px 24px' }}>
      {/* Back button */}
      <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.95rem' }}>
        <ChevronLeft size={16} /> Back to Catalog
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '50px'
      }}>
        {/* Product Image */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '10px', overflow: 'hidden' }}>
            <img 
              src={product.images?.[0] || '/assets/placeholder.png'} 
              alt={product.name} 
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: 'calc(var(--radius-lg) - 10px)'
              }}
            />
          </div>
          
          {/* Quality badge list */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <Settings size={14} style={{ color: 'var(--secondary)' }} /> Sterilizable Materials
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <Layers size={14} style={{ color: 'var(--secondary)' }} /> Autoclave Safe
            </div>
          </div>
        </div>

        {/* Product Info details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
              <span className="badge badge-category">{product.category}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SKU: {product.sku}</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>{product.name}</h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{product.description}</p>
          </div>

          {/* Pricing Box */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Retail Price (B2C)</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>₹{product.b2cPrice}</span>
              </div>
              
              {isApprovedB2B && (
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>Wholesale Access Active</span>
                </div>
              )}
            </div>

            {/* Wholesale Tier Table */}
            {product.b2bPricing && product.b2bPricing.length > 0 && (
              <div style={{ marginTop: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <FileSpreadsheet size={16} style={{ color: 'var(--secondary)' }} /> Wholesale Tier Discounts
                </h4>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ textAlign: 'left', padding: '6px 0' }}>Order Volume</th>
                      <th style={{ textAlign: 'right', padding: '6px 0' }}>Price / Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* B2C Tier representation */}
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '8px 0' }}>1 - {product.b2bPricing[0].minQty - 1} units</td>
                      <td style={{ textAlign: 'right', padding: '8px 0' }}>₹{product.b2cPrice}</td>
                    </tr>
                    {product.b2bPricing.map((tier, index) => {
                      const nextTier = product.b2bPricing[index + 1];
                      const qtyRange = nextTier ? `${tier.minQty} - ${nextTier.minQty - 1}` : `${tier.minQty}+`;
                      return (
                        <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: isApprovedB2B ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          <td style={{ padding: '8px 0', fontWeight: isApprovedB2B ? 500 : 400 }}>{qtyRange} units</td>
                          <td style={{ textAlign: 'right', padding: '8px 0', fontWeight: 600, color: isApprovedB2B ? 'var(--secondary)' : 'inherit' }}>₹{tier.price}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {!isApprovedB2B && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <AlertCircle size={14} />
                    <span>Apply for B2B verification to unlock these bulk discount rates.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action section (Add to cart / OEM Customization trigger) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  max={product.stock}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="form-input" 
                  style={{ width: '90px', padding: '8px 12px' }}
                />
              </div>
              <button 
                onClick={handleAddToCart}
                className="btn btn-primary glow-hover" 
                style={{ flex: '1', height: '48px', alignSelf: 'flex-end' }}
              >
                <ShoppingCart size={18} /> Add To Shopping Cart
              </button>
            </div>

            {product.isOemCapable && (
              <div style={{
                background: 'rgba(11, 17, 22, 0.5)',
                border: '1px dashed var(--border-color)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>Custom OEM Manufacturing Available</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  This product is manufactured in-house. We can customize dimensions, raw material GSM, ETO sterilization packaging, and print hospital branding logos.
                </p>
                <Link 
                  to={`/oem?category=${product.category}&name=${encodeURIComponent(product.name)}`}
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.85rem', width: 'fit-content', padding: '6px 16px' }}
                >
                  Configure OEM Custom Quote
                </Link>
              </div>
            )}
          </div>

          {/* Technical Specs Table */}
          {product.specifications && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Technical Specifications</h3>
              <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    value && (
                      <tr key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '8px 0', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 500, color: '#fff' }}>{value}</td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
