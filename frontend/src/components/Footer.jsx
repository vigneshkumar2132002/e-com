'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';

const Footer = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // '', 'loading', 'success'

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setName('');
      setEmail('');
      // Clear success message after 4 seconds
      setTimeout(() => {
        setStatus('');
      }, 4000);
    }, 800);
  };

  return (
    <footer className="vk-footer">
      <style dangerouslySetInnerHTML={{ __html: `
        .vk-footer {
          background-color: #ffffff;
          color: #000000;
          padding: 80px 0 60px 0;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
          border-top: 1px solid rgba(0, 0, 0, 0.04);
          margin-top: auto;
          width: 100%;
        }

        .vk-footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          box-sizing: border-box;
        }

        .vk-footer-grid {
          display: grid;
          grid-template-columns: 2.2fr 1fr 1fr;
          gap: 80px;
          margin-bottom: 60px;
        }

        .vk-footer-newsletter {
          display: flex;
          flex-direction: column;
        }

        .vk-footer-newsletter-title {
          font-family: var(--font-display), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 40px;
          color: #000000;
        }

        .vk-footer-form {
          width: 100%;
          max-width: 480px;
        }

        .vk-footer-input-group {
          margin-bottom: 24px;
          position: relative;
          width: 100%;
        }

        .vk-footer-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.15);
          padding: 12px 0;
          font-size: 0.95rem;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
          color: #000000;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .vk-footer-input::placeholder {
          color: rgba(0, 0, 0, 0.4);
        }

        .vk-footer-input:focus {
          border-bottom-color: #000000;
        }

        .vk-footer-email-row {
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.15);
          margin-bottom: 20px;
          position: relative;
          transition: border-color 0.3s ease;
        }

        .vk-footer-email-row:focus-within {
          border-bottom-color: #000000;
        }

        .vk-footer-email-row .vk-footer-input {
          border-bottom: none;
          padding-right: 120px; /* Space for absolute button */
        }

        .vk-footer-submit-btn {
          position: absolute;
          right: 0;
          bottom: 8px;
          background: #000000;
          color: #ffffff;
          border: none;
          border-radius: 24px;
          padding: 10px 24px;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: transform 0.2s ease, background-color 0.2s ease;
          z-index: 2;
        }

        .vk-footer-submit-btn:hover {
          background-color: #0976BC; /* Blue color of Bapuji logo */
          transform: translateY(-1px);
        }

        .vk-footer-submit-dot {
          width: 6px;
          height: 6px;
          background-color: #ff3b30;
          border-radius: 50%;
          display: inline-block;
        }

        .vk-footer-col-title {
          font-family: var(--font-display), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 24px;
          color: #000000;
          letter-spacing: -0.01em;
        }

        .vk-footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .vk-footer-link {
          color: rgba(0, 0, 0, 0.6);
          text-decoration: none;
          font-size: 0.95rem;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
          transition: color 0.2s ease, transform 0.2s ease;
          display: inline-block;
        }

        .vk-footer-link:hover {
          color: #000000;
          transform: translateX(2px);
        }

        .vk-footer-address-text {
          color: rgba(0, 0, 0, 0.6);
          font-size: 0.95rem;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
        }

        .vk-footer-contact-box {
          margin-top: 36px;
        }

        .vk-footer-contact-text {
          color: rgba(0, 0, 0, 0.6);
          font-size: 0.95rem;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
          text-decoration: none;
          transition: color 0.2s ease;
          display: block;
          margin-bottom: 8px;
        }

        .vk-footer-contact-text:hover {
          color: #000000;
        }

        .vk-footer-divider {
          border: none;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          margin: 50px 0 30px 0;
        }

        .vk-footer-sub-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .vk-footer-designed-by {
          color: rgba(0, 0, 0, 0.45);
          font-size: 0.85rem;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .vk-footer-social-circles {
          display: flex;
          gap: 12px;
        }

        .vk-footer-social-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000000;
          text-decoration: none;
          transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }

        .vk-footer-social-circle:hover {
          background-color: #0976BC;
          border-color: #0976BC;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .vk-footer-logo-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          margin-bottom: 10px;
          user-select: none;
          width: 100%;
        }

        .vk-footer-logo-img {
          width: 100%;
          height: auto;
          max-width: 450px;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .vk-footer-logo-img:hover {
          transform: scale(1.01);
        }

        .vk-footer-success-msg {
          color: #28a745;
          font-size: 0.85rem;
          margin-top: 8px;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .show-on-mobile {
          display: none;
        }

        @media (max-width: 1023px) {
          .hide-on-mobile {
            display: none !important;
          }
          .show-on-mobile {
            display: block !important;
          }
          .vk-footer {
            padding: 60px 0 40px 0;
          }
          .vk-footer-container {
            padding: 0 24px;
          }
          .vk-footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }
          .vk-footer-newsletter-title {
            font-size: clamp(1.6rem, 6vw, 3.2rem);
            margin-bottom: 24px;
            line-height: 1.1;
          }
          .vk-footer-col-title {
            font-size: 1.05rem;
            margin-bottom: 20px;
          }
          .vk-footer-link, .vk-footer-address-text, .vk-footer-contact-text {
            font-size: 0.9rem;
          }
          .vk-footer-sub-row {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
            margin-bottom: 30px;
          }
          .vk-footer-social-circles {
            align-self: flex-start;
          }
          .vk-footer-logo-img {
            max-width: 240px;
          }
        }
        
        @media (max-width: 767px) {
          .vk-footer-grid {
            text-align: center;
          }
          .vk-footer-newsletter {
            align-items: center;
          }
          .vk-footer-newsletter-title {
            text-align: center;
          }
          .vk-footer-links-list {
            align-items: center;
          }
          .vk-footer-sub-row {
            align-items: center;
            text-align: center;
          }
          .vk-footer-social-circles {
            align-self: center;
          }
          .vk-footer-form {
            text-align: center;
          }
          .vk-footer-email-row .vk-footer-input {
            text-align: center;
          }
          .vk-footer-input {
            text-align: center;
          }
        }
      `}} />

      <div className="vk-footer-container">
        <div className="vk-footer-grid">
          {/* Column 1: Newsletter */}
          <div className="vk-footer-newsletter">
            <h2 className="vk-footer-newsletter-title">
              Subscribe our<br />newsletter
            </h2>
            <form onSubmit={handleSubscribe} className="vk-footer-form">
              <div className="vk-footer-input-group">
                <input
                  type="text"
                  placeholder="Your name*"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="vk-footer-input"
                  required
                />
              </div>
              <div className="vk-footer-email-row">
                <input
                  type="email"
                  placeholder="Your email*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="vk-footer-input"
                  required
                />
                <button type="submit" className="vk-footer-submit-btn" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Submitting...' : 'Submit'}
                  {status !== 'loading' && <span className="vk-footer-submit-dot"></span>}
                </button>
              </div>
              {status === 'success' && (
                <div className="vk-footer-success-msg">
                  ✓ Thank you! You've successfully subscribed to our newsletter.
                </div>
              )}
            </form>
          </div>

          {/* Column 2: Quick links */}
          <div className="vk-footer-col">
            <h3 className="vk-footer-col-title">Quick links</h3>
            <ul className="vk-footer-links-list">
              <li><Link href="/" className="vk-footer-link">Home</Link></li>
              <li><Link href="/about" className="vk-footer-link">About Us</Link></li>
              <li><Link href="/catalog" className="vk-footer-link">Products</Link></li>
              <li><Link href="/oem" className="vk-footer-link">OEM Hub</Link></li>
              <li><Link href="/contact" className="vk-footer-link">Contact</Link></li>
              <li><Link href="/careers" className="vk-footer-link">Careers</Link></li>
              <li><Link href="/privacy-policy" className="vk-footer-link">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 3: Address & Contact */}
          <div className="vk-footer-col">
            <h3 className="vk-footer-col-title">Address</h3>
            <div className="vk-footer-address-text">
              #301, 14th B' Cross, 7th Main,<br />
              6th Sector, HSR Layout,<br />
              Bangalore - 560102, Karnataka, INDIA
            </div>
            
            <div className="vk-footer-contact-box">
              <h3 className="vk-footer-col-title" style={{ marginBottom: '16px' }}>Contact</h3>
              <a href="tel:+918041600320" className="vk-footer-contact-text">
                Landline: +91 80-41600320
              </a>
              <a href="tel:+919379919832" className="vk-footer-contact-text">
                Mobile: +91 9379919832
              </a>
              <a href="mailto:info@bapujisurgicals.com" className="vk-footer-contact-text" style={{ textTransform: 'none' }}>
                info@bapujisurgicals.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="vk-footer-divider" />

        {/* Sub-footer Row */}
        <div className="vk-footer-sub-row">
          <div className="vk-footer-designed-by hide-on-mobile">
            © {new Date().getFullYear()} Bapuji Surgicals. All rights reserved.
          </div>
          <div className="vk-footer-social-circles">
            {/* WhatsApp */}
            <a 
              href="https://wa.me/919379919832" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="vk-footer-social-circle"
              title="Chat on WhatsApp"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
            {/* Phone call shortcut */}
            <a 
              href="tel:+919379919832" 
              className="vk-footer-social-circle"
              title="Call us"
            >
              <Phone size="18" strokeWidth="1.8" />
            </a>
          </div>
        </div>

        {/* Giant branding logo at bottom */}
        <div className="vk-footer-logo-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <img loading="lazy" src="/img/bapuji logo.png" 
            alt="Bapuji Surgicals" 
            className="vk-footer-logo-img"
          />
          <div className="vk-footer-designed-by" style={{ color: 'rgba(0, 0, 0, 0.4)', fontSize: '0.85rem' }}>
            Designed by VK.Studio.
          </div>
          <div className="vk-footer-designed-by show-on-mobile" style={{ color: 'rgba(0, 0, 0, 0.4)', fontSize: '0.85rem', marginTop: '4px' }}>
            &copy; {new Date().getFullYear()} Bapuji Surgicals. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

