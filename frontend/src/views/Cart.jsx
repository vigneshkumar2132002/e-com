'use client';
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, CreditCard, FileText, Landmark, User, ShieldAlert } from 'lucide-react';
import { addLiveOrder, createDashboardOrderId } from '../lib/orderStore';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const { user  } = useAuth();
  const { cartItems,
    removeFromCart,
    updateQty,
    clearCart,
    getItemUnitPrice,
    getCartSubtotal
   } = useCart();

  const router = useRouter();

  // Form states
  const [street, setStreet] = useState(user?.shippingAddress?.street || '');
  const [city, setCity] = useState(user?.shippingAddress?.city || '');
  const [state, setState] = useState(user?.shippingAddress?.state || '');
  const [zipCode, setZipCode] = useState(user?.shippingAddress?.zipCode || '');
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isApprovedB2B = user && user.role === 'b2b' && user.b2bProfile?.verificationStatus === 'approved';

  // Automatically select correct B2B payment method
  useState(() => {
    if (isApprovedB2B) {
      setPaymentMethod('purchase_order');
    }
  }, [isApprovedB2B]);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <ShoppingBag size={48} style={{ color: 'var(--text-muted)' }} />
          <h2 style={{ fontSize: '1.8rem' }}>Your shopping cart is empty</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Add products from the catalog to build your order.</p>
          <Link href="/catalog" className="btn btn-primary" style={{ marginTop: '10px' }}>
            Go to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Cost calculations
  const subtotal = getCartSubtotal(user);
  const gstRate = 0.12; // 12% Medical GST in India
  const tax = Math.round(subtotal * gstRate);
  
  // B2B shipping is often bulk freight (quote later or custom fee). Let's set retail shipping as ₹100, free over ₹1000.
  const isFreeShipping = subtotal >= 1000;
  const shipping = isApprovedB2B ? 0 : (isFreeShipping ? 0 : 100);
  const total = subtotal + tax + shipping;

  const publishCheckoutOrderToDashboard = (dbOrder, forcedPaymentStatus) => {
    const orderType = isApprovedB2B ? 'b2b' : 'b2c';
    const today = new Date().toISOString().slice(0, 10);
    const address = [street, city, state, zipCode, 'India'].filter(Boolean).join(', ');
    const items = cartItems.map((item) => ({
      name: item.name,
      sku: item.product,
      category: isApprovedB2B ? 'B2B Wholesale' : 'Retail Ecommerce',
      qty: item.qty,
      unitPrice: getItemUnitPrice(item, user)
    }));
    const totalQty = items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    const productSummary = items.length === 1
      ? `${items[0].name} (x${items[0].qty})`
      : `${items.length} products / ${totalQty} units`;

    if (orderType === 'b2b') {
      addLiveOrder('b2b', {
        id: dbOrder?._id ? `ORD-B2B-${String(dbOrder._id).slice(-6).toUpperCase()}` : createDashboardOrderId('b2b'),
        businessName: user?.b2bProfile?.companyName || user?.companyName || user?.name || 'Website B2B Customer',
        products: productSummary,
        qty: totalQty,
        amount: total,
        status: 'Pending',
        paymentStatus: forcedPaymentStatus || (paymentMethod === 'purchase_order' ? 'Unpaid' : 'Pending'),
        date: today,
        contactPerson: user?.name || 'Website Buyer',
        email: user?.email || '',
        phone: user?.phone || user?.b2bProfile?.phone || '',
        address,
        gstin: user?.b2bProfile?.gstin || user?.gstin || 'Pending GST capture',
        paymentTerms: paymentMethod === 'purchase_order' ? 'Purchase Order / Net 30 Days' : 'Advance payment',
        carrier: 'Dispatch team to assign',
        awb: 'Awaiting Label Generation',
        estDelivery: 'To be scheduled',
        items
      });
      return;
    }

    addLiveOrder('b2c', {
      id: dbOrder?._id ? `ORD-B2C-${String(dbOrder._id).slice(-6).toUpperCase()}` : createDashboardOrderId('b2c'),
      customerName: user?.name || 'Website Customer',
      product: productSummary,
      qty: totalQty,
      value: total,
      address,
      tracking: '',
      status: 'Pending',
      date: today,
      phone: user?.phone || '',
      email: user?.email || '',
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay / Card',
      country: 'India',
      notes: 'Synced from live website checkout.',
      refundStatus: 'None',
      items
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login?redirect=cart');
      return;
    }

    if (!street || !city || !state || !zipCode) {
      setError('Please fill in complete delivery address details.');
      return;
    }

    if (paymentMethod === 'purchase_order' && !purchaseOrderNumber) {
      setError('B2B orders require a valid Purchase Order (PO) reference number.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product,
        name: item.name,
        qty: item.qty,
        price: getItemUnitPrice(item, user),
        image: item.image
      }));

      // 1. Create unpaid order in database first
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress: { street, city, state, zipCode, country: 'India' },
          billingAddress: { street, city, state, zipCode, country: 'India' },
          paymentMethod,
          purchaseOrderNumber: paymentMethod === 'purchase_order' ? purchaseOrderNumber : undefined,
          taxAmount: tax,
          shippingAmount: shipping,
          totalAmount: total
        })
      });

      const dbOrder = await orderRes.json();
      if (!orderRes.ok) throw new Error(dbOrder.message || 'Failed to place order');

      // 2. Handle payment routing
      if (paymentMethod === 'credit_card') {
        // Initialize Razorpay
        const rpayScriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!rpayScriptLoaded) {
          throw new Error('Razorpay SDK failed to load. Please check your internet connectivity.');
        }

        // Initialize transaction on backend
        const rpayOrderRes = await fetch('/api/orders/razorpay-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ amount: total })
        });

        const rpayOrder = await rpayOrderRes.json();
        if (!rpayOrderRes.ok) throw new Error(rpayOrder.message || 'Razorpay initialization failed');

        if (rpayOrder.mock) {
          // MOCK PAYMENTS FLOW
          const confirmPayment = window.confirm(
            `[MOCK PAYMENT GATEWAY]\n\nDo you want to simulate a successful payment of ₹${total} via Razorpay?`
          );

          if (!confirmPayment) {
            setError('Payment simulation cancelled.');
            setSubmitting(false);
            return;
          }

          // Send verification payload to backend
          const verifyRes = await fetch('/api/orders/razorpay-verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
              razorpay_order_id: rpayOrder.id,
              razorpay_payment_id: `pay_mock_${Date.now()}`,
              razorpay_signature: 'mock_signature',
              db_order_id: dbOrder._id
            })
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.message || 'Mock payment verification failed');

          publishCheckoutOrderToDashboard(dbOrder, 'Paid');
          clearCart();
          alert('Mock payment successful! Order placed.');
          router.push('/profile');
        } else {
          // REAL PAYMENTS FLOW
          const options = {
            key: rpayOrder.key_id,
            amount: rpayOrder.amount,
            currency: rpayOrder.currency,
            name: 'Bapuji Surgicals',
            description: 'Surgical Supplies Purchase',
            order_id: rpayOrder.id,
            handler: async function (response) {
              try {
                setSubmitting(true);
                const verifyRes = await fetch('/api/orders/razorpay-verify', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    db_order_id: dbOrder._id
                  })
                });

                const verifyData = await verifyRes.json();
                if (!verifyRes.ok) throw new Error(verifyData.message || 'Verification failed');

                publishCheckoutOrderToDashboard(dbOrder, 'Paid');
                clearCart();
                alert('Payment received! Order placed successfully.');
                router.push('/profile');
              } catch (err) {
                setError(`Payment Verification Failed: ${err.message}`);
                setSubmitting(false);
              }
            },
            prefill: {
              name: user.name,
              email: user.email
            },
            theme: {
              color: '#0b8497'
            },
            modal: {
              ondismiss: function () {
                setSubmitting(false);
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        }
      } else {
        // Cash on Delivery or Invoice
        publishCheckoutOrderToDashboard(dbOrder, paymentMethod === 'cod' ? 'Unpaid' : 'Pending');
        clearCart();
        alert('Order placed successfully!');
        router.push('/profile');
      }
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px 100px 24px' }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '30px' }}>Your Shopping Cart</h1>

      <style dangerouslySetInnerHTML={{ __html: `
        .cart-layout-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          align-items: flex-start;
        }
        @media (max-width: 900px) {
          .cart-layout-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }
      `}} />

      <div className="cart-layout-grid">
        {/* Cart Item List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cartItems.map((item) => {
            const unitPrice = getItemUnitPrice(item, user);
            const itemTotal = unitPrice * item.qty;

            return (
              <div key={item.product} className="glass-card" style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                <img loading="lazy" src={item.image} 
                  alt={item.name} 
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}
                />

                <div style={{ flex: '1', minWidth: '200px' }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{item.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Unit Price: ₹{unitPrice} 
                    {isApprovedB2B && item.b2bPricing?.length > 0 && (
                      <span style={{ color: 'var(--secondary)', marginLeft: '8px' }}>(B2B Wholesaler Discount)</span>
                    )}
                  </span>
                </div>

                {/* Quantity Editor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => updateQty(item.product, item.qty - 1)} 
                    className="btn btn-secondary" 
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  >
                    -
                  </button>
                  <span style={{ width: '30px', textAlign: 'center', fontWeight: 'bold' }}>{item.qty}</span>
                  <button 
                    onClick={() => updateQty(item.product, item.qty + 1)} 
                    className="btn btn-secondary" 
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  >
                    +
                  </button>
                </div>

                {/* Item Total Price */}
                <div style={{ minWidth: '80px', textAlign: 'right' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>₹{itemTotal}</span>
                </div>

                {/* Delete */}
                <button 
                  onClick={() => removeFromCart(item.product)} 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary Card and Checkout */}
        <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '1.3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Order Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Items Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimated GST (12%)</span>
              <span>₹{tax}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping Fee</span>
              <span>{shipping === 0 ? <span style={{ color: 'var(--secondary)' }}>Free</span> : `₹${shipping}`}</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              <span>Order Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Checkout Credentials */}
          {user ? (
            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px', marginTop: '10px' }}>
                Delivery Details
              </h3>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Street Address</label>
                <input 
                  type="text" 
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="form-input" 
                  required
                />
              </div>

              <div className="responsive-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">City</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-input" 
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">State</label>
                  <input 
                    type="text" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="form-input" 
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">PIN / ZIP Code</label>
                <input 
                  type="text" 
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="form-input" 
                  required
                />
              </div>

              <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px', marginTop: '10px' }}>
                Payment Method
              </h3>

              {isApprovedB2B ? (
                // B2B Payment methods
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="purchase_order" 
                      checked={paymentMethod === 'purchase_order'}
                      onChange={() => setPaymentMethod('purchase_order')}
                    />
                    <FileText size={16} /> Purchase Order Invoice (Net 30 days)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="net_banking" 
                      checked={paymentMethod === 'net_banking'}
                      onChange={() => setPaymentMethod('net_banking')}
                    />
                    <Landmark size={16} /> Direct Bank/NEFT Wire Transfer
                  </label>

                  {paymentMethod === 'purchase_order' && (
                    <div className="form-group" style={{ marginTop: '6px', marginBottom: 0 }}>
                      <label className="form-label">PO Reference Number</label>
                      <input 
                        type="text" 
                        placeholder="PO-2026-XXXX" 
                        value={purchaseOrderNumber}
                        onChange={(e) => setPurchaseOrderNumber(e.target.value)}
                        className="form-input" 
                        required
                      />
                    </div>
                  )}
                </div>
              ) : (
                // B2C Payment methods
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="credit_card" 
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                    />
                    <CreditCard size={16} /> Credit / Debit Card
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="cod" 
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <User size={16} /> Cash on Delivery (COD)
                  </label>

                  {paymentMethod === 'credit_card' && (
                    <div style={{
                      marginTop: '6px',
                      padding: '12px',
                      background: 'var(--primary-glow)',
                      border: '1px solid rgba(0, 180, 216, 0.15)',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.4'
                    }}>
                      You will pay securely via **Razorpay**. Supports UPI, Cards, Netbanking, and Wallets.
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div style={{ color: 'var(--accent)', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <ShieldAlert size={14} /> {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={submitting}
                className="btn btn-primary glow-hover" 
                style={{ width: '100%', height: '48px', marginTop: '10px' }}
              >
                {submitting ? 'Processing Order...' : 'Confirm and Place Order'}
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                You must sign in to save your address details and submit your order.
              </div>
              <Link href="/login?redirect=cart" className="btn btn-primary" style={{ width: '100%' }}>
                Log In / Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

