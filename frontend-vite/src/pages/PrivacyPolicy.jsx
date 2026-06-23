import React, { useState, useEffect } from 'react';

const PrivacyPolicy = () => {
  // Navigation sections for the sticky sidebar
  const sections = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'access', label: '1. Access' },
    { id: 'consent', label: '2. Consent' },
    { id: 'control', label: '3. Control & Correction' },
    { id: 'changes', label: '4. Changes' },
    { id: 'collected', label: '5. Information We Collect' },
    { id: 'how-we-collect', label: '6. Collection Methods' },
    { id: 'use', label: '7. How We Use Information' },
    { id: 'sharing', label: '8. Sharing & Transfer' },
    { id: 'cookies', label: '9. Cookie Usage' },
    { id: 'security', label: '10. Security Practices' },
    { id: 'links', label: '11. Third-Party Links' },
    { id: 'rectification', label: '12. Rectification' },
    { id: 'compliance', label: '13. Compliance with Laws' },
    { id: 'storage', label: '14. Term of Storage' },
    { id: 'grievance', label: '15. Grievance Officer' },
    { id: 'quality', label: 'Quality Policy' }
  ];

  const [activeSection, setActiveSection] = useState('introduction');

  // Handle intersection observer to auto-highlight active section on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
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

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      // Offset for navigation navbar
      const yOffset = -120; 
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', fontFamily: 'var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .privacy-hero {
          padding: 140px 24px 80px 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          text-align: center;
          background: radial-gradient(circle at top, rgba(9, 118, 188, 0.02) 0%, transparent 60%);
        }
        .privacy-title {
          font-family: var(--font-display), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(2.5rem, 5vw, 3.8rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 16px;
          line-height: 1.1;
        }
        .privacy-meta {
          font-size: 0.8rem;
          color: #0976BC;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 700;
          display: inline-block;
          margin-bottom: 10px;
        }
        .privacy-layout {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 40px;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 60px;
          position: relative;
        }
        .privacy-sidebar {
          position: sticky;
          top: 140px;
          height: fit-content;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border-right: 1px solid rgba(0, 0, 0, 0.05);
          padding-right: 24px;
        }
        .privacy-nav-item {
          background: none;
          border: none;
          text-align: left;
          font-size: 0.88rem;
          color: rgba(0, 0, 0, 0.55);
          padding: 10px 14px;
          cursor: pointer;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
          width: 100%;
        }
        .privacy-nav-item:hover {
          color: #000000;
          background-color: rgba(0, 0, 0, 0.02);
          transform: translateX(2px);
        }
        .privacy-nav-item.active {
          color: #0976BC;
          background-color: rgba(9, 118, 188, 0.05);
          font-weight: 600;
        }
        .privacy-content {
          display: flex;
          flex-direction: column;
          gap: 70px;
        }
        .privacy-section {
          scroll-margin-top: 150px;
        }
        .privacy-section-title {
          font-family: var(--font-display), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
          color: #000000;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .privacy-section-title::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 20px;
          background-color: #0976BC;
          border-radius: 2px;
        }
        .privacy-p {
          font-size: 1.05rem;
          line-height: 1.7;
          color: rgba(0, 0, 0, 0.7);
          margin-bottom: 18px;
        }
        .privacy-link {
          color: #0976BC;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid rgba(9, 118, 188, 0.2);
          transition: all 0.2s ease;
        }
        .privacy-link:hover {
          border-bottom-color: #0976BC;
          background-color: rgba(9, 118, 188, 0.03);
        }
        .privacy-list {
          list-style: none;
          padding: 0;
          margin: 24px 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .privacy-list-item {
          font-size: 1.02rem;
          color: rgba(0, 0, 0, 0.7);
          line-height: 1.6;
          padding-left: 28px;
          position: relative;
        }
        .privacy-list-item::before {
          content: '✓';
          color: #0976BC;
          position: absolute;
          left: 0;
          top: 2px;
          font-weight: 700;
          font-size: 0.95rem;
        }
        .quality-card {
          background-color: rgba(9, 118, 188, 0.015);
          border: 1px solid rgba(9, 118, 188, 0.07);
          border-radius: 20px;
          padding: 50px;
          margin-top: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.01);
        }
        @media (max-width: 992px) {
          .privacy-layout {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 50px 24px;
          }
          .privacy-sidebar {
            display: none;
          }
        }
      `}} />

      <header className="privacy-hero">
        <span className="privacy-meta">Compliance Blueprint</span>
        <h1 className="privacy-title">Privacy & Quality Policies</h1>
        <p style={{ fontSize: '0.95rem', color: 'rgba(0, 0, 0, 0.45)', margin: 0, fontWeight: 500 }}>
          Last Reviewed & Updated: May 31, 2026
        </p>
      </header>

      <div className="privacy-layout">
        {/* Sticky Sidebar Navigation */}
        <aside className="privacy-sidebar">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => handleScrollTo(sec.id)}
              className={`privacy-nav-item ${activeSection === sec.id ? 'active' : ''}`}
            >
              {sec.label}
            </button>
          ))}
        </aside>

        {/* Content Panel */}
        <main className="privacy-content">
          {/* Introduction */}
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

          {/* 1. Access */}
          <section id="access" className="privacy-section">
            <h2 className="privacy-section-title">1. Access</h2>
            <p className="privacy-p">
              We collect your Personal Information directly from you, from third parties, and automatically through our Website. This may include device details, login times, IP address, and other usage data listed under section 5 below.
            </p>
          </section>

          {/* 2. Consent */}
          <section id="consent" className="privacy-section">
            <h2 className="privacy-section-title">2. Consent</h2>
            <p className="privacy-p">
              By using our Website or Services, you agree to the collection and use of your Personal Information as described in this policy. If you do not agree with the terms outlined here, please refrain from sharing your data or utilizing our platforms.
            </p>
          </section>

          {/* 3. Control Over Your Personal Information */}
          <section id="control" className="privacy-section">
            <h2 className="privacy-section-title">3. Control Over Your Personal Information</h2>
            <p className="privacy-p">
              You may withdraw consent or request rectification of your Personal Information at any time by emailing us at: <a href="mailto:info@bapujisurgicals.com" className="privacy-link">info@bapujisurgicals.com</a>. Upon receiving your request, we will take appropriate actions to address it in accordance with applicable laws.
            </p>
          </section>

          {/* 4. Changes to the Privacy Policy */}
          <section id="changes" className="privacy-section">
            <h2 className="privacy-section-title">4. Changes to the Privacy Policy</h2>
            <p className="privacy-p">
              We may update this Privacy Policy periodically to reflect changes in our information practices or legal obligations. We encourage you to review this page regularly for the latest details.
            </p>
          </section>

          {/* 5. Personal Information Collected */}
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

          {/* 6. How We Collect Personal Information */}
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

          {/* 7. Use of Personal Information */}
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

          {/* 8. Sharing and Transferring Personal Information */}
          <section id="sharing" className="privacy-section">
            <h2 className="privacy-section-title">8. Sharing & Transfer of Personal Information</h2>
            <p className="privacy-p">
              With your authorization, we may share information within India or internationally with logistics providers, payment gateways, and cloud service providers. We implement standard contractual safeguards to ensure data protection.
            </p>
          </section>

          {/* 9. Use of Cookies */}
          <section id="cookies" className="privacy-section">
            <h2 className="privacy-section-title">9. Use of Cookies</h2>
            <p className="privacy-p">
              We use session and persistent cookies to remember configurations and optimize platform speed. You can easily instruct your web browser to reject cookies, though doing so might affect some platform functionalities.
            </p>
          </section>

          {/* 10. Security */}
          <section id="security" className="privacy-section">
            <h2 className="privacy-section-title">10. Security</h2>
            <p className="privacy-p">
              We secure database servers using SSL encryption, access tokens, and role-based validation. While we implement industry-standard practices, no digital storage or transmission is 100% secure.
            </p>
          </section>

          {/* 11. Third-Party References and Links */}
          <section id="links" className="privacy-section">
            <h2 className="privacy-section-title">11. Third-Party References & Links</h2>
            <p className="privacy-p">
              Our website may contain links to external pages. We are not responsible for the privacy actions of third-party platforms. We recommend checking their respective policies before sharing data.
            </p>
            <p className="privacy-p">
              <strong>Do-not-track:</strong> We currently do not listen or respond to browser "Do-Not-Track" headers.
            </p>
          </section>

          {/* 12. Rectification/Correction */}
          <section id="rectification" className="privacy-section">
            <h2 className="privacy-section-title">12. Rectification/Correction</h2>
            <p className="privacy-p">
              If you need to view, correct, or request deletion of your stored records, reach out directly to <a href="mailto:info@bapujisurgicals.com" className="privacy-link">info@bapujisurgicals.com</a>.
            </p>
          </section>

          {/* 13. Compliance with Laws */}
          <section id="compliance" className="privacy-section">
            <h2 className="privacy-section-title">13. Compliance with Laws</h2>
            <p className="privacy-p">
              If this policy conflicts with the governing laws of your country of access, you are not authorized to use our platform or register for services.
            </p>
          </section>

          {/* 14. Term of Storage */}
          <section id="storage" className="privacy-section">
            <h2 className="privacy-section-title">14. Term of Storage</h2>
            <p className="privacy-p">
              Personal Information is stored securely for at least 3 years from your last active login/interaction, or for as long as required by relevant legal and tax mandates.
            </p>
          </section>

          {/* 15. Grievance Officer */}
          <section id="grievance" className="privacy-section">
            <h2 className="privacy-section-title">15. Grievance Officer</h2>
            <p className="privacy-p">
              If you have any complaints or data-privacy concerns, contact our Grievance Officer directly via: <a href="mailto:info@bapujisurgicals.com" className="privacy-link">info@bapujisurgicals.com</a>.
            </p>
          </section>

          {/* Quality Policy Card */}
          <section id="quality" className="privacy-section quality-card">
            <h2 className="privacy-section-title" style={{ fontSize: '1.85rem', marginBottom: '24px' }}>Quality Policy</h2>
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
