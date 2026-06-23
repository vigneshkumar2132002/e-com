'use client';
import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  CreditCard,
  FileText,
  Headphones,
  Lock,
  LogOut,
  Mail,
  MapPin,
  PackageCheck,
  Pencil,
  Save,
  ShieldCheck,
  Truck,
  UserRound,
  WalletCards,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, loading, updateProfile, logout } = useAuth();
  const [activePanel, setActivePanel] = useState('personal');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) return;

    const [first = '', ...rest] = (user.name || '').split(' ');
    setFirstName(first);
    setLastName(rest.join(' '));
    setStreet(user.shippingAddress?.street || '');
    setCity(user.shippingAddress?.city || '');
    setState(user.shippingAddress?.state || '');
    setZipCode(user.shippingAddress?.zipCode || '');
    fetchMyOrders();
  }, [user]);

  const fetchMyOrders = async () => {
    if (!user?.token) return;

    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders/myorders', {
        headers: { Authorization: `Bearer ${user.token}` },
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
      const fullName = `${firstName} ${lastName}`.trim();
      const address = { street, city, state, zipCode, country: 'India' };
      await updateProfile({
        name: fullName,
        shippingAddress: address,
        billingAddress: address,
      });
      setMsg('Profile information updated successfully.');
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/invoice`, {
        headers: { Authorization: `Bearer ${user.token}` },
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

  const handleResendInvoice = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/resend-invoice`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend invoice email');
      }
      alert(data.message || 'Invoice email resent successfully.');
      fetchMyOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const accountMenu = [
    { id: 'personal', label: 'Personal Information', icon: UserRound },
    { id: 'orders', label: 'My Orders', icon: ClipboardList },
    { id: 'address', label: 'Manage Address', icon: MapPin },
    { id: 'payment', label: 'Payment Method', icon: CreditCard },
    { id: 'password', label: 'Password Manager', icon: Lock },
  ];

  if (loading) {
    return (
      <div className="profile-empty-state">
        <style dangerouslySetInnerHTML={{ __html: profileStyles }} />
        <div className="profile-empty-card">
          <h1>Checking account</h1>
          <p>Loading your saved session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-empty-state">
        <style dangerouslySetInnerHTML={{ __html: profileStyles }} />
        <div className="profile-empty-card">
          <div className="profile-empty-code">404</div>
          <h1>Account not found</h1>
          <p>Please sign in to view your profile details.</p>
          <a href="/login">Sign in</a>
        </div>
      </div>
    );
  }

  const initials = (user.name || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const roleLabel = user.role === 'admin'
    ? 'Admin'
    : user.role === 'b2b'
      ? 'B2B Wholesale Partner'
      : 'Retail Customer';

  return (
    <div className="profile-page">
      <style dangerouslySetInnerHTML={{ __html: profileStyles }} />

      <section className="profile-hero">
        <div className="profile-hero-inner">
          <p>Home / My Account</p>
          <h1>My Account</h1>
        </div>
      </section>

      <section className="profile-account-shell">
        <aside className="profile-sidebar" aria-label="Account sections">
          {accountMenu.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`profile-side-link ${activePanel === item.id ? 'is-active' : ''}`}
                onClick={() => setActivePanel(item.id)}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
          <button type="button" className="profile-side-link" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <div className="profile-main-panel">
          <div className="profile-user-row">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">{initials}</div>
              <button type="button" className="profile-avatar-edit" aria-label="Edit profile photo">
                <Pencil size={15} />
              </button>
            </div>
            <div>
              <div className="profile-user-kicker">{roleLabel}</div>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
            {user.role === 'b2b' && user.b2bProfile && (
              <div className="profile-verification">
                <ShieldCheck size={18} />
                {user.b2bProfile.verificationStatus || 'pending'}
              </div>
            )}
          </div>

          {(activePanel === 'personal' || activePanel === 'address') && (
            <form onSubmit={handleUpdateInfo} className="profile-form">
              <div className="profile-form-grid">
                <label>
                  <span>First Name *</span>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </label>
                <label>
                  <span>Last Name</span>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </label>
              </div>

              <label>
                <span>Email *</span>
                <input value={user.email || ''} readOnly />
              </label>

              <label>
                <span>Street Address *</span>
                <input value={street} onChange={(e) => setStreet(e.target.value)} required />
              </label>

              <div className="profile-form-grid">
                <label>
                  <span>City *</span>
                  <input value={city} onChange={(e) => setCity(e.target.value)} required />
                </label>
                <label>
                  <span>State *</span>
                  <input value={state} onChange={(e) => setState(e.target.value)} required />
                </label>
              </div>

              <label>
                <span>PIN Code *</span>
                <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
              </label>

              {msg && (
                <div className={`profile-message ${msg.startsWith('Error') ? 'is-error' : ''}`}>
                  {msg}
                </div>
              )}

              <button type="submit" className="profile-save-btn" disabled={updating}>
                <Save size={16} />
                {updating ? 'Saving changes...' : 'Update Changes'}
              </button>
            </form>
          )}

          {activePanel === 'orders' && (
            <div className="profile-orders-panel">
              <div className="profile-panel-heading">
                <h3>Order History</h3>
                <p>Track dispatches, invoices, and payment status.</p>
              </div>

              {loadingOrders ? (
                <div className="profile-muted-box">Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div className="profile-muted-box">You have not placed any orders yet.</div>
              ) : (
                <div className="profile-order-list">
                  {orders.map((order) => (
                    <article key={order._id} className="profile-order-card">
                      <div className="profile-order-top">
                        <div>
                          <span>Order ID</span>
                          <strong>{order._id}</strong>
                        </div>
                        <mark>{order.orderStatus}</mark>
                      </div>

                      <div className="profile-order-items">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx}>
                            <span>{item.name} x{item.qty}</span>
                            <strong>Rs. {item.price * item.qty}</strong>
                          </div>
                        ))}
                      </div>

                      <div className="profile-order-foot">
                        <span>Total: Rs. {order.totalAmount}</span>
                        <div>
                          <button type="button" onClick={() => handleDownloadInvoice(order._id)}>
                            <FileText size={14} />
                            Invoice
                          </button>
                          <button type="button" onClick={() => handleResendInvoice(order._id)}>
                            <Mail size={14} />
                            Re-send
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activePanel === 'payment' && (
            <div className="profile-placeholder-panel">
              <WalletCards size={30} />
              <h3>Payment Method</h3>
              <p>Saved payment methods will appear here once checkout payment storage is enabled.</p>
            </div>
          )}

          {activePanel === 'password' && (
            <div className="profile-placeholder-panel">
              <Lock size={30} />
              <h3>Password Manager</h3>
              <p>Password update controls can be connected here when the backend endpoint is ready.</p>
            </div>
          )}
        </div>
      </section>

      <section className="profile-benefits">
        <div>
          <PackageCheck size={34} />
          <h3>Quality Assured</h3>
          <p>Certified medical and hygiene manufacturing standards.</p>
        </div>
        <div>
          <Truck size={34} />
          <h3>Reliable Dispatch</h3>
          <p>Order updates, invoices, and shipment records in one place.</p>
        </div>
        <div>
          <Headphones size={34} />
          <h3>24x7 Support</h3>
          <p>Our team is available for B2B and customer assistance.</p>
        </div>
      </section>
    </div>
  );
};

const profileStyles = `
  .profile-page {
    background: #ffffff;
    color: #111827;
    min-height: 100vh;
  }

  .profile-hero {
    min-height: 190px;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(circle at 12% 20%, rgba(9, 118, 188, 0.08), transparent 22%),
      radial-gradient(circle at 80% 30%, rgba(34, 197, 94, 0.08), transparent 20%),
      #f6f8fb;
    border-bottom: 1px solid #edf1f5;
    margin-top: -100px;
    padding-top: 100px;
  }

  .profile-hero-inner {
    text-align: center;
  }

  .profile-hero p {
    margin: 0 0 10px;
    color: #64748b;
    font-size: 14px;
  }

  .profile-hero h1 {
    margin: 0;
    font-size: 44px;
    line-height: 1;
    letter-spacing: -0.04em;
    color: #111827;
  }

  .profile-account-shell {
    width: min(1180px, calc(100% - 96px));
    margin: 72px auto 56px;
    display: grid;
    grid-template-columns: 310px minmax(0, 1fr);
    gap: 36px;
    align-items: start;
  }

  .profile-sidebar {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .profile-side-link {
    height: 58px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 20px;
    border: 1px solid #eef2f7;
    border-radius: 12px;
    background: #ffffff;
    color: #111827;
    font-size: 16px;
    font-weight: 600;
    font-family: var(--font-body);
    text-align: left;
    cursor: pointer;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.03);
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  }

  .profile-side-link:hover {
    transform: translateX(3px);
    border-color: rgba(9, 118, 188, 0.22);
  }

  .profile-side-link.is-active {
    background: #ffc917;
    border-color: #ffc917;
    color: #101828;
  }

  .profile-main-panel {
    min-height: 560px;
  }

  .profile-user-row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 22px;
    align-items: center;
    margin-bottom: 34px;
  }

  .profile-avatar-wrap {
    position: relative;
    width: 104px;
    height: 104px;
  }

  .profile-avatar {
    width: 104px;
    height: 104px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0976bc, #16a34a);
    color: #ffffff;
    font-size: 34px;
    font-weight: 800;
    box-shadow: 0 18px 42px rgba(9, 118, 188, 0.22);
  }

  .profile-avatar-edit {
    position: absolute;
    right: 2px;
    bottom: 4px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 3px solid #ffffff;
    background: #148f62;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .profile-user-kicker {
    color: #0976bc;
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .profile-user-row h2 {
    margin: 4px 0;
    font-size: 30px;
    line-height: 1.1;
    color: #101828;
    text-transform: capitalize;
  }

  .profile-user-row p {
    margin: 0;
    color: #64748b;
  }

  .profile-verification {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 999px;
    background: #ecfdf5;
    color: #047857;
    font-size: 13px;
    font-weight: 800;
    text-transform: capitalize;
  }

  .profile-form {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .profile-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px;
  }

  .profile-form label {
    display: flex;
    flex-direction: column;
    gap: 9px;
    color: #111827;
    font-size: 14px;
    font-weight: 700;
  }

  .profile-form input {
    width: 100%;
    height: 52px;
    border: 1px solid #e8edf3;
    border-radius: 999px;
    padding: 0 20px;
    background: #ffffff;
    color: #111827;
    font-size: 15px;
    font-family: var(--font-body);
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .profile-form input:focus {
    border-color: rgba(9, 118, 188, 0.48);
    box-shadow: 0 0 0 4px rgba(9, 118, 188, 0.08);
  }

  .profile-form input[readonly] {
    color: #64748b;
    background: #f8fafc;
  }

  .profile-save-btn {
    width: max-content;
    height: 54px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 0;
    border-radius: 999px;
    padding: 0 28px;
    background: #148f62;
    color: #ffffff;
    font-weight: 800;
    font-family: var(--font-body);
    cursor: pointer;
    box-shadow: 0 16px 32px rgba(20, 143, 98, 0.2);
  }

  .profile-save-btn:disabled {
    opacity: 0.68;
    cursor: wait;
  }

  .profile-message {
    width: fit-content;
    padding: 10px 14px;
    border-radius: 999px;
    background: #ecfdf5;
    color: #047857;
    font-size: 13px;
    font-weight: 700;
  }

  .profile-message.is-error {
    background: #fef2f2;
    color: #b91c1c;
  }

  .profile-panel-heading {
    margin-bottom: 22px;
  }

  .profile-panel-heading h3,
  .profile-placeholder-panel h3 {
    margin: 0 0 6px;
    color: #111827;
    font-size: 28px;
    letter-spacing: -0.03em;
  }

  .profile-panel-heading p,
  .profile-placeholder-panel p {
    margin: 0;
    color: #64748b;
  }

  .profile-muted-box,
  .profile-placeholder-panel {
    min-height: 260px;
    border: 1px dashed #d8e1eb;
    border-radius: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
    text-align: center;
    color: #64748b;
    background: #f8fafc;
  }

  .profile-placeholder-panel svg {
    color: #0976bc;
  }

  .profile-order-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .profile-order-card {
    border: 1px solid #e8edf3;
    border-radius: 20px;
    padding: 20px;
    background: #ffffff;
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.04);
  }

  .profile-order-top,
  .profile-order-foot,
  .profile-order-items div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
  }

  .profile-order-top span {
    display: block;
    margin-bottom: 4px;
    color: #94a3b8;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .profile-order-top strong {
    font-size: 13px;
    color: #111827;
  }

  .profile-order-top mark {
    border-radius: 999px;
    padding: 7px 12px;
    background: #fff7d6;
    color: #9a6b00;
    font-size: 12px;
    font-weight: 800;
    text-transform: capitalize;
  }

  .profile-order-items {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding: 16px 0;
    margin: 16px 0;
    border-top: 1px solid #eef2f7;
    border-bottom: 1px solid #eef2f7;
    color: #475569;
    font-size: 14px;
  }

  .profile-order-foot span {
    color: #111827;
    font-size: 17px;
    font-weight: 800;
  }

  .profile-order-foot div {
    display: flex;
    gap: 8px;
  }

  .profile-order-foot button {
    height: 38px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: 1px solid #dce5ef;
    border-radius: 999px;
    background: #ffffff;
    color: #111827;
    padding: 0 14px;
    font-weight: 700;
    cursor: pointer;
  }

  .profile-benefits {
    width: min(1180px, calc(100% - 96px));
    margin: 0 auto 76px;
    padding-top: 38px;
    border-top: 1px solid #eef2f7;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 34px;
  }

  .profile-benefits div {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 18px;
    align-items: center;
  }

  .profile-benefits svg {
    grid-row: span 2;
    color: #148f62;
    strokeWidth: 1.7;
  }

  .profile-benefits h3 {
    margin: 0;
    font-size: 18px;
    color: #111827;
  }

  .profile-benefits p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
  }

  .profile-empty-state {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    padding: 64px 24px;
  }

  .profile-empty-card {
    width: min(420px, 100%);
    text-align: center;
    background: #ffffff;
    border: 1px solid #e8edf3;
    border-radius: 24px;
    padding: 42px;
    box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
  }

  .profile-empty-code {
    color: #0976bc;
    font-size: 72px;
    line-height: 1;
    font-weight: 900;
  }

  .profile-empty-card h1 {
    margin: 14px 0 8px;
    font-size: 30px;
  }

  .profile-empty-card p {
    margin: 0 0 24px;
    color: #64748b;
  }

  .profile-empty-card a {
    display: inline-flex;
    height: 46px;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    border-radius: 999px;
    background: #148f62;
    color: #ffffff;
    font-weight: 800;
  }
`;

export default Profile;
