import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Globe, Shield } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState(''); // '', 'submitting', 'success'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      setTimeout(() => {
        setStatus('');
      }, 5000);
    }, 1200);
  };

  const branches = [
    {
      state: 'Telangana',
      city: 'Hyderabad',
      address: 'Vyshnavi Milk, GROUND, 3-2-19 SHOP NO. 6 7, Madihray Kaveri Tower, Kachiguda Road, Hyderabad - 500027, Telangana'
    },
    {
      state: 'West Bengal',
      city: 'Kolkata',
      address: '36/1E/1J, EAST TOPSIA ROAD, Kolkata - 700039, West Bengal'
    },
    {
      state: 'Delhi NCR',
      city: 'Delhi / Ghaziabad',
      address: 'E-218, SECTOR-17, KAVI NAGAR, Ghaziabad - 201001, Uttar Pradesh'
    },
    {
      state: 'Maharashtra',
      city: 'Mumbai',
      address: 'Shop No. 4, 5 and 6 Part B, Ground Floor, Ami Jharna CHS ltd, Mumbai, IC Colony, borivali west, Mumbai Suburban - 400103, Maharashtra'
    },
    {
      state: 'Kerala',
      city: 'Cochin',
      address: 'NEAR SUVARNA LIBRARY, 43/3384-A2, Pallissery Road, Kochi Ernakulam - 682025, Kerala'
    },
    {
      state: 'Tamil Nadu',
      city: 'Production Unit',
      address: 'Sy No. 126/12, Bagalur to Berigai Main Road, Near Gudichettulu Bus Stop, Hosur, Thummanapalli Krishnagiri - 635105, Tamil Nadu'
    }
  ];

  return (
    <div className="contact-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .contact-page {
          background-color: #ffffff;
          color: #000000;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
          padding-bottom: 100px;
        }

        .contact-hero {
          background: radial-gradient(circle at 80% 20%, rgba(9, 118, 188, 0.02) 0%, transparent 60%), #FAF9F6;
          padding: 140px 24px 80px 24px;
          text-align: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        }

        .contact-hero-subtitle {
          color: #0976BC;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 12px;
          display: inline-block;
        }

        .contact-hero-title {
          font-family: var(--font-display), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin-bottom: 20px;
          color: #000000;
        }

        .contact-hero-description {
          max-width: 600px;
          margin: 0 auto;
          color: rgba(0, 0, 0, 0.6);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .contact-grid {
          max-width: 1200px;
          margin: 60px auto 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 60px;
          box-sizing: border-box;
        }

        .contact-info-card {
          background-color: #FAF9F6;
          border: 1px solid rgba(0, 0, 0, 0.03);
          border-radius: 20px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .contact-hq-title {
          font-family: var(--font-display), sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #000000;
          margin-bottom: 6px;
        }

        .contact-hq-meta {
          font-size: 0.85rem;
          color: #0976BC;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .contact-row {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .contact-icon-box {
          background-color: rgba(9, 118, 188, 0.06);
          color: #0976BC;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .contact-row-title {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          color: rgba(0, 0, 0, 0.45);
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .contact-row-text {
          font-size: 1rem;
          color: rgba(0, 0, 0, 0.75);
          line-height: 1.5;
        }

        .contact-row-link, .contact-row-link:hover {
          color: #0976BC !important;
          text-decoration: none;
          font-weight: 600;
          position: relative;
          display: inline-block;
        }

        .contact-row-link::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 1.5px;
          bottom: -1px;
          left: 0;
          background-color: #0976BC;
          transform-origin: bottom left;
          transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .contact-row-link:hover::after {
          transform: scaleX(1);
        }

        .contact-form-card {
          background-color: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.01);
        }

        .form-title {
          font-family: var(--font-display), sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: #000000;
        }

        .form-subtitle {
          color: rgba(0, 0, 0, 0.45);
          font-size: 0.95rem;
          margin-bottom: 24px;
        }

        .form-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 20px;
        }

        .form-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: rgba(0, 0, 0, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-input {
          background-color: #fcfcfc;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 0.95rem;
          font-family: var(--font-body), sans-serif;
          color: #000000;
          outline: none;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          border-color: #0976BC;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(9, 118, 188, 0.08);
        }

        .form-textarea {
          resize: vertical;
          min-height: 110px;
        }

        .form-submit-btn {
          width: 100%;
          background-color: #000000;
          color: #ffffff;
          border: none;
          border-radius: 30px;
          padding: 14px 28px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .form-submit-btn:hover {
          background-color: #0976BC;
          transform: translateY(-1px);
        }

        .form-submit-btn:disabled {
          background-color: rgba(0,0,0,0.3);
          cursor: not-allowed;
          transform: none;
        }

        .form-success {
          background-color: rgba(40, 167, 69, 0.05);
          border: 1px solid rgba(40, 167, 69, 0.15);
          color: #28a745;
          border-radius: 12px;
          padding: 16px;
          font-size: 0.95rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Branches Grid Section */
        .branches-section {
          max-width: 1200px;
          margin: 100px auto 0 auto;
          padding: 0 40px;
          box-sizing: border-box;
        }

        .branches-title {
          font-family: var(--font-display), sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 40px;
          color: #000000;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .branches-title::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 22px;
          background-color: #0976BC;
          border-radius: 2px;
        }

        .branches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }

        .branch-card {
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 16px;
          padding: 28px;
          background-color: #ffffff;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .branch-card:hover {
          transform: translateY(-2px);
          border-color: rgba(9, 118, 188, 0.15);
          box-shadow: 0 10px 30px rgba(9, 118, 188, 0.02);
        }

        .branch-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .branch-city {
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #000000;
        }

        .branch-state-badge {
          background-color: rgba(9, 118, 188, 0.05);
          color: #0976BC;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.02em;
        }

        .branch-address {
          font-size: 0.92rem;
          line-height: 1.6;
          color: rgba(0, 0, 0, 0.6);
        }

        @media (max-width: 900px) {
          .contact-hero {
            padding: 100px 24px 60px 24px;
          }
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 0 24px;
          }
          .contact-info-card {
            padding: 30px 20px;
          }
          .contact-form-card {
            padding: 30px 20px;
          }
          .branches-section {
            padding: 0 24px;
            margin-top: 60px;
          }
          .branches-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}} />

      {/* Hero Block */}
      <section className="contact-hero">
        <span className="contact-hero-subtitle">Operations & Logistics Support</span>
        <h1 className="contact-hero-title">Contact Us</h1>
        <p className="contact-hero-description">
          Formulate private label specifications, query wholesale orders, or connect with our regional operations offices across India.
        </p>
      </section>

      {/* Main Form & Info Grid */}
      <div className="contact-grid">
        {/* Left Column: Bangalore HQ */}
        <div className="contact-info-card">
          <div>
            <span className="contact-hq-meta">Global Headquarters</span>
            <h3 className="contact-hq-title">Corporate Office, Bangalore</h3>
          </div>

          {/* Address */}
          <div className="contact-row">
            <div className="contact-icon-box">
              <MapPin size={20} />
            </div>
            <div>
              <div className="contact-row-title">Address</div>
              <div className="contact-row-text">
                #301, 14th B' Cross, 7th Main,<br />
                6th Sector, HSR Layout,<br />
                Bangalore - 560102, Karnataka, INDIA
              </div>
            </div>
          </div>

          {/* Telephones */}
          <div className="contact-row">
            <div className="contact-icon-box">
              <Phone size={20} />
            </div>
            <div>
              <div className="contact-row-title">Telephones</div>
              <div className="contact-row-text">
                <strong>Landline:</strong> +91 80-41600320<br />
                <strong>Mobile:</strong> +91 9379919832
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="contact-row">
            <div className="contact-icon-box">
              <Mail size={20} />
            </div>
            <div>
              <div className="contact-row-title">Electronic Mail</div>
              <div className="contact-row-text">
                <a href="mailto:info@bapujisurgicals.com" className="contact-row-link">
                  info@bapujisurgicals.com
                </a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="contact-row">
            <div className="contact-icon-box">
              <Clock size={20} />
            </div>
            <div>
              <div className="contact-row-title">Office Hours</div>
              <div className="contact-row-text">
                Monday - Friday: 09:00am to 07:00pm IST<br />
                Saturday & Sunday: Closed
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="contact-form-card">
          <h3 className="form-title">Get in Touch</h3>
          <p className="form-subtitle">Submit your query below and our team will get back to you within 24 business hours.</p>

          {status === 'success' && (
            <div className="form-success">
              <span>✓ Message sent successfully! An operations officer will contact you shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-input-group">
              <label className="form-label">Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="contact-form-inputs-responsive">
              <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 600px) {
                  .contact-form-inputs-responsive {
                    grid-template-columns: 1fr !important;
                    gap: 0px !important;
                  }
                }
              `}} />
              <div className="form-input-group">
                <label className="form-label">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-input-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-input-group">
              <label className="form-label">Message*</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="form-input form-textarea"
                required
              />
            </div>

            <button
              type="submit"
              className="form-submit-btn"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending...' : 'Send'}
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Regional Branch Offices Section */}
      <section className="branches-section">
        <h2 className="branches-title">Branch Offices</h2>
        <div className="branches-grid">
          {branches.map((branch, index) => (
            <div key={index} className="branch-card">
              <div className="branch-header">
                <span className="branch-city">{branch.city}</span>
                <span className="branch-state-badge">{branch.state}</span>
              </div>
              <p className="branch-address">{branch.address}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;
