import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ClipboardList, MapPin, Settings, Landmark, Mail, ShieldAlert, Award, FileText } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address edit fields
  const [name, setName] = useState(user?.name || '');
  const [street, setStreet] = useState(user?.shippingAddress?.street || '');
  const [city, setCity] = useState(user?.shippingAddress?.city || '');
  const [state, setState] = useState(user?.shippingAddress?.state || '');
  const [zipCode, setZipCode] = useState(user?.shippingAddress?.zipCode || '');
  
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders/myorders', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setMsg('');
    setUpdating(true);
    try {
      const address = { street, city, state, zipCode, country: 'India' };
      await updateProfile({
        name,
        shippingAddress: address,
        billingAddress: address
      });
      setMsg('Profile and address parameters updated successfully.');
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/invoice`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!res.ok) {
        throw new Error('Failed to download invoice PDF');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>Please sign in to view your profile details.</div>;

  return (
    <div className="container" style={{ padding: '40px 24px 100px 24px' }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '30px' }}>Your Profile</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 0.85fr) minmax(0, 1.35fr)',
        gap: '40px',
        alignItems: 'flex-start'
      }}>
        {/* Left Column: Account Details & Editing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* User Bio Card */}
          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #007bff, #0056b3)',
                color: 'var(--text-primary)',
                fontSize: '1.6rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)'
              }}>
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{user.name}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Role: <strong>{user.role === 'admin' ? 'Admin' : user.role === 'b2b' ? 'B2B Wholesale Partner' : 'Retail Customer'}</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} /> {user.email}
              </div>
              
              {user.role === 'b2b' && user.b2bProfile && (
                <div style={{
                  marginTop: '12px',
                  padding: '16px',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>B2B Company Info</h4>
                  <div><strong>Company:</strong> {user.b2bProfile.companyName}</div>
                  <div><strong>GSTIN:</strong> {user.b2bProfile.gstinOrTaxId}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <strong>Verification:</strong> 
                    <span className={`badge ${
                      user.b2bProfile.verificationStatus === 'approved' ? 'badge-approved' : 
                      user.b2bProfile.verificationStatus === 'pending' ? 'badge-pending' : 
                      'badge-rejected'
                    }`} style={{ fontSize: '0.65rem' }}>
                      {user.b2bProfile.verificationStatus}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Edit Address Form */}
          <form onSubmit={handleUpdateInfo} className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Settings size={16} style={{ color: 'var(--secondary)' }} /> Edit Personal Details
            </h3>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input" 
                required 
              />
            </div>

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
              <label className="form-label">PIN Code</label>
              <input 
                type="text" 
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="form-input" 
                required 
              />
            </div>

            {msg && (
              <div style={{ fontSize: '0.8rem', color: msg.startsWith('Error') ? 'var(--accent)' : 'var(--secondary)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <ShieldAlert size={14} /> {msg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={updating}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {updating ? 'Saving changes...' : 'Save Settings'}
            </button>
          </form>
        </div>

        {/* Right Column: Order History Log */}
        <div className="glass-card" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
            <ClipboardList size={22} style={{ color: 'var(--secondary)' }} /> Order History & Dispatches
          </h2>

          {loadingOrders ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading client dispatches...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              You have not placed any orders yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map((order) => (
                <div key={order._id} style={{
                  border: '1px solid var(--border-color)',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <strong>Order ID:</strong> {order._id} | <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <span className={`badge ${
                      order.orderStatus === 'delivered' ? 'badge-approved' : 
                      order.orderStatus === 'shipped' ? 'badge-approved' : 
                      order.orderStatus === 'cancelled' ? 'badge-rejected' : 
                      'badge-pending'
                    }`} style={{ fontSize: '0.65rem' }}>
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Order items list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '2px solid var(--primary-glow)', paddingLeft: '12px' }}>
                    {order.orderItems?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#fff' }}>
                        <span>{item.name} <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>x{item.qty}</span></span>
                        <span>₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px dashed var(--border-color)' }} />

                  {/* Order Footer summary */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    gap: '10px'
                  }}>
                    <div>
                      <strong>Payment Status:</strong>{' '}
                      <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-approved' : 'badge-pending'}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                        {order.paymentStatus}
                      </span>
                    </div>

                    {order.purchaseOrderNumber && (
                      <div>
                        <strong>PO Number:</strong> <code style={{ color: 'var(--secondary)' }}>{order.purchaseOrderNumber}</code>
                      </div>
                    )}

                    {order.trackingNumber && (
                      <div>
                        <strong>Tracking ID:</strong> <span style={{ color: 'var(--primary-light)' }}>{order.trackingNumber}</span>
                      </div>
                    )}

                    {order.orderType === 'b2b' && (
                      <button 
                        onClick={() => handleDownloadInvoice(order._id)}
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      >
                        <FileText size={14} /> Download Invoice
                      </button>
                    )}

                    <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#fff' }}>
                      Total: ₹{order.totalAmount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
