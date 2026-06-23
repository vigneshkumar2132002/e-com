'use client';
import React, { useState, useEffect } from 'react';
import { Shield, Database, FileText, Lock, Cookie, Globe, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    { id: 'introduction', label: 'Introduction', icon: Shield },
    { id: 'access', label: '1. Access', icon: Database },
    { id: 'consent', label: '2. Consent', icon: FileText },
    { id: 'control', label: '3. Control & Correction', icon: Lock },
    { id: 'changes', label: '4. Changes', icon: FileText },
    { id: 'collected', label: '5. Information We Collect', icon: Database },
    { id: 'how-we-collect', label: '6. Collection Methods', icon: FileText },
    { id: 'use', label: '7. How We Use Information', icon: FileText },
    { id: 'sharing', label: '8. Sharing & Transfer', icon: Globe },
    { id: 'cookies', label: '9. Cookie Usage', icon: Cookie },
    { id: 'security', label: '10. Security Practices', icon: Lock },
    { id: 'links', label: '11. Third-Party Links', icon: Globe },
    { id: 'rectification', label: '12. Rectification', icon: FileText },
    { id: 'compliance', label: '13. Compliance with Laws', icon: Shield },
    { id: 'storage', label: '14. Term of Storage', icon: Database },
    { id: 'grievance', label: '15. Grievance Officer', icon: Mail },
    { id: 'quality', label: 'Quality Policy', icon: Shield }
  ];

  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -60% 0px',
      threshold: 0
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Auto-scroll the active item in the sidebar so it's always visible
  useEffect(() => {
    const activeBtn = document.getElementById('nav-' + activeSection);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSection]);

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -120; 
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.1) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px', color: '#000000', minHeight: '100vh', fontFamily: 'var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif', paddingBottom: '100px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        html {
          scroll-behavior: smooth;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .privacy-hero-wrapper {
          padding: 24px;
          animation: fadeUp 0.4s ease-out forwards;
        }

        .privacy-hero {
          width: 98%;
          max-width: none;
          margin: 0 auto;
          background-color: #0f172a;
          background-image: linear-gradient(135deg, #1e293b 0%, #020617 100%);
          border-radius: 32px;
          padding: 120px 40px;
          text-align: center;
          color: #ffffff;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .privacy-title {
          font-family: var(--font-display), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(3rem, 6vw, 4.5rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          margin: 0 0 16px 0;
          line-height: 1.1;
          color: #ffffff;
        }

        .privacy-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.85);
          margin: 0 0 8px 0;
          font-weight: 400;
        }

        .privacy-date {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          font-weight: 400;
        }

        .privacy-layout {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 40px 100px 40px;
          display: grid;
          grid-template-columns: 25% 75%;
          gap: 60px;
          animation: fadeUp 0.4s ease-out forwards;
          animation-delay: 0.1s;
          opacity: 0;
        }

        .privacy-sidebar-wrapper {
          position: relative;
        }

        .privacy-sidebar {
          position: sticky;
          top: 120px;
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - 160px);
          overflow-y: auto;
          padding-right: 12px;
          scroll-behavior: smooth;
        }

        .privacy-sidebar::-webkit-scrollbar {
          width: 4px;
        }
        
        .privacy-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .privacy-sidebar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
        }

        .privacy-sidebar-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #000000;
          margin: 0 0 24px 16px;
        }

        .privacy-nav-item {
          background: transparent;
          border: none;
          text-align: left;
          font-size: 0.95rem;
          color: rgba(0, 0, 0, 0.6);
          padding: 12px 16px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 999px;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }

        .privacy-nav-item:hover {
          background-color: rgba(0, 0, 0, 0.04);
          color: #000000;
          transform: translateY(-1px);
        }

        .privacy-nav-item.active {
          background-color: #111827;
          color: #ffffff;
          font-weight: 500;
        }

        .privacy-nav-item.active .privacy-nav-icon {
          color: #38bdf8;
          opacity: 1;
        }

        .privacy-nav-icon {
          width: 16px;
          height: 16px;
          opacity: 0.8;
        }

        .privacy-mobile-nav {
          display: none;
        }

        .privacy-content {
          max-width: 900px;
          display: flex;
          flex-direction: column;
        }

        .privacy-section {
          scroll-margin-top: 120px;
          padding-bottom: 40px;
          margin-bottom: 40px;
        }

        .privacy-section-title {
          font-family: var(--font-display), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.75rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          margin: 0 0 16px 0;
          color: #000000;
          line-height: 1.1;
        }

        .privacy-p {
          font-size: 1.125rem;
          line-height: 1.8;
          color: rgba(0, 0, 0, 0.8);
          margin: 0 0 16px 0;
          max-width: 75ch;
        }

        .privacy-p:last-child {
          margin-bottom: 0;
        }

        .privacy-link {
          color: #000000;
          text-decoration: underline;
          text-underline-offset: 4px;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        
        .privacy-link:hover {
          color: #0976BC;
        }

        .privacy-list {
          list-style: disc;
          padding-left: 24px;
          margin: 0 0 24px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 75ch;
        }

        .privacy-list-item {
          font-size: 1.125rem;
          color: rgba(0, 0, 0, 0.8);
          line-height: 1.8;
        }

        @media (max-width: 1024px) {
          .privacy-hero-wrapper {
            padding: 16px;
          }
          
          .privacy-hero {
            padding: 80px 24px;
            border-radius: 24px;
          }

          .privacy-title {
            font-size: clamp(2.5rem, 8vw, 3rem);
          }

          .privacy-subtitle {
            font-size: 1.05rem;
          }
          
          .privacy-layout {
            grid-template-columns: 1fr;
            padding: 40px 24px 80px 24px;
            gap: 40px;
          }
          
          .privacy-sidebar-wrapper {
            display: none;
          }

          .privacy-mobile-nav {
            display: block;
            margin-bottom: 20px;
          }

          .privacy-mobile-select {
            width: 100%;
            padding: 14px 20px;
            font-size: 1rem;
            font-weight: 500;
            background-color: #ffffff;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 12px;
            appearance: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          }

          .privacy-section {
            padding-bottom: 30px;
            margin-bottom: 30px;
          }

          .privacy-section-title {
            font-size: 1.5rem;
            margin-bottom: 12px;
          }

          .privacy-p, .privacy-list-item {
            font-size: 1rem;
            line-height: 1.7;
          }
        }
      `}} />

      <div className="privacy-hero-wrapper">
        <header className="privacy-hero">
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-subtitle">How Bapuji Surgicals collects, uses, and protects your information.</p>
          <p className="privacy-date">Last Updated: May 31, 2026</p>
        </header>
      </div>

      <div className="privacy-layout">
        {/* Sticky Sidebar Navigation (Left) */}
        <div className="privacy-sidebar-wrapper">
          <aside className="privacy-sidebar">
            <h3 className="privacy-sidebar-title">Table of contents</h3>
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  id={`nav-${sec.id}`}
                  onClick={() => handleScrollTo(sec.id)}
                  className={`privacy-nav-item ${activeSection === sec.id ? 'active' : ''}`}
                >
                  <Icon className="privacy-nav-icon" strokeWidth={2.5} />
                  {sec.label}
                </button>
              );
            })}
          </aside>
        </div>

        {/* Content Panel (Right) */}
        <main className="privacy-content">
          <div className="privacy-mobile-nav">
            <select 
              className="privacy-mobile-select"
              value={activeSection}
              onChange={(e) => handleScrollTo(e.target.value)}
            >
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>{sec.label}</option>
              ))}
            </select>
          </div>

          <section id="introduction" className="privacy-section">
            <h2 className="privacy-section-title">Introduction</h2>
            <p className="privacy-p">
              At Bapuji Surgicals, we respect the privacy of every user of our website. Your privacy is important to us, and we strive to take reasonable care and protection of the information we receive from you, the User. In this regard, we adhere to the applicable governing laws in India.
            </p>
            <p className="privacy-p">
              This Privacy Policy applies to the collection, storage, processing, disclosure, and transfer of your Personal Information (defined below) as per the above-mentioned laws, particularly when you use the website <a href="https://www.bapujisurgicals.com" target="_blank" rel="noopener noreferrer" className="privacy-link">www.bapujisurgicals.com</a>.
            </p>
            <p className="privacy-p">
              The terms <strong>'You'</strong> or <strong>'Your'</strong> refer to you as the User (registered or unregistered), and the terms <strong>'We'</strong>, <strong>'Us'</strong>, and <strong>'Our'</strong> refer to Bapuji Surgicals.
            </p>
          </section>

          <section id="access" className="privacy-section">
            <h2 className="privacy-section-title">1. Access</h2>
            <p className="privacy-p">
              We collect your Personal Information directly from you, from third parties, and automatically through our Website. This may include device details, login times, IP address, and other usage data listed under section 5 below.
            </p>
          </section>

          <section id="consent" className="privacy-section">
            <h2 className="privacy-section-title">2. Consent</h2>
            <p className="privacy-p">
              By using our Website or Services, you agree to the collection and use of your Personal Information as described in this policy. If you do not agree with the terms outlined here, please refrain from sharing your data or utilizing our platforms.
            </p>
          </section>

          <section id="control" className="privacy-section">
            <h2 className="privacy-section-title">3. Control Over Your Personal Information</h2>
            <p className="privacy-p">
              You may withdraw consent or request rectification of your Personal Information at any time by emailing us at: <a href="mailto:info@bapujisurgicals.com" className="privacy-link">info@bapujisurgicals.com</a>. Upon receiving your request, we will take appropriate actions to address it in accordance with applicable laws.
            </p>
          </section>

          <section id="changes" className="privacy-section">
            <h2 className="privacy-section-title">4. Changes to the Privacy Policy</h2>
            <p className="privacy-p">
              We may update this Privacy Policy periodically to reflect changes in our information practices or legal obligations. We encourage you to review this page regularly for the latest details.
            </p>
          </section>

          <section id="collected" className="privacy-section">
            <h2 className="privacy-section-title">5. Personal Information Collected</h2>
            <p className="privacy-p">
              We collect information that identifies or can be associated with you. This includes, but is not limited to:
            </p>
            <ul className="privacy-list">
              <li className="privacy-list-item"><strong>Contact Details:</strong> Name, postal address, phone number, and email address</li>
              <li className="privacy-list-item"><strong>Account Credentials:</strong> Username, password, and registration logs</li>
              <li className="privacy-list-item"><strong>Usage Analytics:</strong> Interaction history, session frequency, and page duration</li>
              <li className="privacy-list-item"><strong>Transaction Logs:</strong> Orders, invoices, custom RFQ technical blueprints, and uploaded design files</li>
              <li className="privacy-list-item"><strong>Device Signature:</strong> IP address, browser type, cookies, and hardware configuration</li>
              <li className="privacy-list-item"><strong>Preferences:</strong> Communication logs and customized manufacturing preferences</li>
              <li className="privacy-list-item"><strong>Voluntary Submissions:</strong> Any information provided during direct email or contact forms</li>
            </ul>
          </section>

          <section id="how-we-collect" className="privacy-section">
            <h2 className="privacy-section-title">6. How We Collect Personal Information</h2>
            <p className="privacy-p">
              We gather information using clean, transparent protocols:
            </p>
            <ul className="privacy-list">
              <li className="privacy-list-item">Digital inquiry, custom specs forms, and RFQ inputs</li>
              <li className="privacy-list-item">Direct email, phone calls, or active chats</li>
              <li className="privacy-list-item">B2B client and OEM account registrations</li>
              <li className="privacy-list-item">HTTP cookies and local device logs</li>
              <li className="privacy-list-item">Usage interactions recorded during platform navigation</li>
            </ul>
          </section>

          <section id="use" className="privacy-section">
            <h2 className="privacy-section-title">7. Use of Personal Information</h2>
            <p className="privacy-p">
              The information we gather is used to improve operational cycles and B2B relations:
            </p>
            <ul className="privacy-list">
              <li className="privacy-list-item">Provisioning, customizing, and scaling our medical supplies and services</li>
              <li className="privacy-list-item">Enhancing website functionality, speed, and overall user experience</li>
              <li className="privacy-list-item">Conducting research, statistical analysis, and service improvements</li>
              <li className="privacy-list-item">Connecting with you via SMS, WhatsApp, phone, or email to provide updates</li>
              <li className="privacy-list-item">Distributing targeted promotions, news, and catalog updates</li>
              <li className="privacy-list-item">Enforcing legal terms, protecting against fraud, and complying with audits</li>
              <li className="privacy-list-item">Aggregating anonymous analytics data for backend insights</li>
            </ul>
          </section>

          <section id="sharing" className="privacy-section">
            <h2 className="privacy-section-title">8. Sharing & Transfer of Personal Information</h2>
            <p className="privacy-p">
              With your authorization, we may share information within India or internationally with logistics providers, payment gateways, and cloud service providers. We implement standard contractual safeguards to ensure data protection.
            </p>
          </section>

          <section id="cookies" className="privacy-section">
            <h2 className="privacy-section-title">9. Use of Cookies</h2>
            <p className="privacy-p">
              We use session and persistent cookies to remember configurations and optimize platform speed. You can easily instruct your web browser to reject cookies, though doing so might affect some platform functionalities.
            </p>
          </section>

          <section id="security" className="privacy-section">
            <h2 className="privacy-section-title">10. Security</h2>
            <p className="privacy-p">
              We secure database servers using SSL encryption, access tokens, and role-based validation. While we implement industry-standard practices, no digital storage or transmission is 100% secure.
            </p>
          </section>

          <section id="links" className="privacy-section">
            <h2 className="privacy-section-title">11. Third-Party References & Links</h2>
            <p className="privacy-p">
              Our website may contain links to external pages. We are not responsible for the privacy actions of third-party platforms. We recommend checking their respective policies before sharing data.
            </p>
            <p className="privacy-p">
              <strong>Do-not-track:</strong> We currently do not listen or respond to browser "Do-Not-Track" headers.
            </p>
          </section>

          <section id="rectification" className="privacy-section">
            <h2 className="privacy-section-title">12. Rectification/Correction</h2>
            <p className="privacy-p">
              If you need to view, correct, or request deletion of your stored records, reach out directly to <a href="mailto:info@bapujisurgicals.com" className="privacy-link">info@bapujisurgicals.com</a>.
            </p>
          </section>

          <section id="compliance" className="privacy-section">
            <h2 className="privacy-section-title">13. Compliance with Laws</h2>
            <p className="privacy-p">
              If this policy conflicts with the governing laws of your country of access, you are not authorized to use our platform or register for services.
            </p>
          </section>

          <section id="storage" className="privacy-section">
            <h2 className="privacy-section-title">14. Term of Storage</h2>
            <p className="privacy-p">
              Personal Information is stored securely for at least 3 years from your last active login/interaction, or for as long as required by relevant legal and tax mandates.
            </p>
          </section>

          <section id="grievance" className="privacy-section">
            <h2 className="privacy-section-title">15. Grievance Officer</h2>
            <p className="privacy-p">
              If you have any complaints or data-privacy concerns, contact our Grievance Officer directly via: <a href="mailto:info@bapujisurgicals.com" className="privacy-link">info@bapujisurgicals.com</a>.
            </p>
          </section>

          <section id="quality" className="privacy-section">
            <h2 className="privacy-section-title">Quality Policy</h2>
            <p className="privacy-p">
              At Bapuji Surgicals, our goal is to design, manufacture, and deliver surgical consumables and contract-manufactured wipes that meet international standards of medical safety.
            </p>
            <p className="privacy-p">
              Our Quality Assurance (QA) and Quality Control (QC) teams are committed to the following tenets of cleanroom excellence:
            </p>
            <ul className="privacy-list">
              <li className="privacy-list-item">Operating strictly under ISO 9001 and GMP manufacturing protocols.</li>
              <li className="privacy-list-item">Maintaining Class 100 sterile environments for sensitive chemical compounding.</li>
              <li className="privacy-list-item">Enforcing multi-stage lab verification on fiber density, absorbency, and compound dilution.</li>
              <li className="privacy-list-item">Continuously auditing logistics packaging to guarantee sterile seal longevity.</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
