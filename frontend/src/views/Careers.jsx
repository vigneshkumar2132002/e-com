'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, ArrowRight, X, Upload, Check, ChevronDown, Clock, Building } from 'lucide-react';
import Link from 'next/link';
import { HeroContainer, HeroContent, HeroMedia, HeroFloatingCard } from '../components/HeroContainer';

const Careers = () => {
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [activeJob, setActiveJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', coverLetter: '' });

  const locations = ['All', 'Mumbai', 'Hyderabad', 'Chennai', 'Kolkata'];

  const jobs = [
    {
      id: 1,
      title: 'Senior Area Sales Manager',
      location: 'Mumbai',
      type: 'Full-time',
      category: 'Sales',
      desc: 'Drive sales growth, manage corporate hospital grids, and cultivate retail & wholesale distributor networks across the Mumbai Metropolitan Region.',
      reqs: ['5+ years B2B medical devices or consumables sales experience.', 'Proven track record of managing corporate hospital clients.', 'Excellent negotiation and communication skills.']
    },
    {
      id: 2,
      title: 'Senior Manager',
      location: 'Hyderabad',
      type: 'Full-time',
      category: 'Operations',
      desc: 'Supervise regional logistics hub operations, lead local account executives, and coordinate product dispatch networks across the Telangana region.',
      reqs: ['7+ years experience in logistics or operational management.', 'Strong team leadership and logistics optimization capabilities.', 'Experience in healthcare distribution operations is highly valued.']
    },
    {
      id: 3,
      title: 'Senior Representative',
      location: 'Chennai',
      type: 'Full-time',
      category: 'Sales',
      desc: 'Cultivate direct hospital partnerships, represent our premium surgical dressings and hygiene care portfolios, and secure corporate procurement contracts.',
      reqs: ['3+ years in clinical client relations or pharmaceutical sales.', 'Deep familiarity with the Chennai hospital networks and key procurers.', 'Highly motivated and target-oriented approach.']
    },
    {
      id: 4,
      title: 'Senior Area Sales Manager',
      location: 'Kolkata',
      type: 'Full-time',
      category: 'Sales',
      desc: 'Lead sales development representatives, establish hospital group purchase agreements, and build robust supply-chain networks in West Bengal.',
      reqs: ['5+ years sales leadership experience in clinical sectors.', 'Strong analytical skills for business expansion and regional growth.', 'Strong relationships with hospital purchase managers.']
    },
    {
      id: 5,
      title: 'Senior Manager',
      location: 'Chennai',
      type: 'Full-time',
      category: 'Operations',
      desc: 'Direct cleanroom manufacturing assembly operations, lead ISO 13485 compliance audits, and coordinate supply-chain logistics at our Chennai facility.',
      reqs: ['8+ years experience in medical device or sterile cleanroom manufacturing.', 'Thorough understanding of ISO compliance, GMP, and quality control protocols.', 'Degrees in Chemical or Mechanical Engineering preferred.']
    }
  ];

  const filteredJobs = selectedLocation === 'All' 
    ? jobs 
    : jobs.filter(job => job.location.toLowerCase() === selectedLocation.toLowerCase());

  const handleApplyClick = (job) => {
    setActiveJob(job);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setSelectedFile(null);
    setFormData({ name: '', email: '', phone: '', coverLetter: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API request submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const scrollToOpenings = () => {
    const element = document.getElementById('openings-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="careers-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .careers-page {
          background-color: #ffffff;
          color: #000000;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
          padding-bottom: 120px;
        }

        .careers-main {
          max-width: 1200px;
          margin: -60px auto 0 auto;
          padding: 0 40px;
          box-sizing: border-box;
          position: relative;
          z-index: 5;
        }

        .careers-intro-card {
          border: 1px solid rgba(0, 0, 0, 0.04);
          background-color: #FAF9F6;
          border-radius: 24px;
          padding: 60px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.01);
          margin-bottom: 60px;
        }

        .careers-intro-title {
          font-family: var(--font-display), sans-serif;
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin: 0 0 24px 0;
          color: #000000;
        }

        .careers-p {
          font-size: 1.15rem;
          line-height: 1.7;
          color: rgba(0, 0, 0, 0.7);
          margin: 0 0 20px 0;
        }

        .careers-p:last-child {
          margin-bottom: 0;
        }

        /* Filter bar */
        .careers-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .careers-section-title {
          font-family: var(--font-display), sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #000000;
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
        }

        .careers-section-title::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 22px;
          background-color: #0976BC;
          border-radius: 2px;
        }

        .location-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-btn {
          background-color: #FAF9F6;
          color: rgba(0,0,0,0.65);
          border: 1px solid rgba(0,0,0,0.06);
          padding: 8px 18px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .filter-btn:hover {
          background-color: rgba(9, 118, 188, 0.05);
          color: #0976BC;
          border-color: rgba(9, 118, 188, 0.15);
        }

        .filter-btn.active {
          background-color: #0976BC;
          color: #ffffff;
          border-color: #0976BC;
          box-shadow: 0 4px 12px rgba(9, 118, 188, 0.15);
        }

        /* Jobs Grid */
        .careers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 30px;
        }

        .job-card {
          border: 1px solid rgba(0, 0, 0, 0.05);
          background-color: #ffffff;
          border-radius: 24px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.005);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
          overflow: hidden;
        }

        .job-card::after {
          content: '';
          position: absolute;
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(9, 118, 188, 0.03) 0%, transparent 70%);
          top: -30px;
          right: -30px;
          pointer-events: none;
        }

        .job-card:hover {
          transform: translateY(-4px);
          border-color: rgba(9, 118, 188, 0.15);
          box-shadow: 0 20px 45px rgba(9, 118, 188, 0.04);
        }

        .job-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .job-badges {
          display: flex;
          gap: 8px;
        }

        .job-badge {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .job-badge.type {
          background-color: rgba(9, 118, 188, 0.06);
          color: #0976BC;
        }

        .job-badge.location {
          background-color: rgba(0, 0, 0, 0.04);
          color: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .job-title {
          font-family: var(--font-display), sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #000000;
          margin: 10px 0 0 0;
        }

        .job-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(0,0,0,0.6);
          margin: 0;
          flex-grow: 1;
        }

        .job-reqs {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid rgba(0, 0, 0, 0.04);
          padding-top: 18px;
          margin: 0;
        }

        .job-req-item {
          font-size: 0.88rem;
          color: rgba(0,0,0,0.75);
          display: flex;
          align-items: flex-start;
          gap: 8px;
          line-height: 1.4;
        }

        .job-req-item svg {
          color: #0976BC;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .apply-btn {
          border: 1px solid rgba(0,0,0,0.1);
          background-color: transparent;
          color: #000000;
          height: 48px;
          border-radius: 24px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          width: 100%;
          text-decoration: none;
        }

        .job-card:hover .apply-btn {
          background-color: #000000;
          color: #ffffff;
          border-color: #000000;
        }

        .apply-btn:hover {
          background-color: #0976BC !important;
          color: #ffffff !important;
          border-color: #0976BC !important;
          transform: translateY(-1px);
        }

        /* Modal Overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .app-modal {
          background-color: #ffffff;
          border-radius: 28px;
          width: 100%;
          max-width: 580px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
          overflow: hidden;
          position: relative;
        }

        .modal-header {
          padding: 32px 40px 24px 40px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .modal-title-area {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .modal-title {
          font-family: var(--font-display), sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #000000;
          margin: 0;
        }

        .modal-subtitle {
          font-size: 0.9rem;
          color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0;
        }

        .close-modal-btn {
          background: rgba(0, 0, 0, 0.04);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(0, 0, 0, 0.7);
          transition: all 0.2s ease;
        }

        .close-modal-btn:hover {
          background: rgba(0, 0, 0, 0.08);
          color: #000000;
          transform: scale(1.05);
        }

        .modal-form {
          padding: 32px 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: rgba(0, 0, 0, 0.6);
        }

        .form-input {
          border: 1px solid rgba(0,0,0,0.1);
          background-color: #FAF9F6;
          border-radius: 12px;
          height: 48px;
          padding: 0 16px;
          font-size: 0.95rem;
          font-family: inherit;
          color: #000000;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #0976BC;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(9, 118, 188, 0.1);
        }

        .form-textarea {
          border: 1px solid rgba(0,0,0,0.1);
          background-color: #FAF9F6;
          border-radius: 12px;
          padding: 16px;
          font-size: 0.95rem;
          font-family: inherit;
          color: #000000;
          resize: vertical;
          min-height: 100px;
          transition: all 0.2s ease;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #0976BC;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(9, 118, 188, 0.1);
        }

        .file-upload-box {
          border: 2px dashed rgba(0,0,0,0.08);
          background-color: #FAF9F6;
          border-radius: 14px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .file-upload-box:hover {
          border-color: #0976BC;
          background-color: rgba(9, 118, 188, 0.02);
        }

        .file-upload-icon {
          color: #0976BC;
        }

        .file-upload-text {
          font-size: 0.9rem;
          color: rgba(0,0,0,0.65);
          font-weight: 500;
          text-align: center;
        }

        .file-upload-text span {
          color: #0976BC;
          font-weight: 700;
        }

        .file-upload-sub {
          font-size: 0.75rem;
          color: rgba(0,0,0,0.4);
        }

        .submit-btn {
          height: 54px;
          background-color: #0976BC;
          color: #ffffff;
          border: none;
          border-radius: 27px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 10px;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(9, 118, 188, 0.2);
        }

        .submit-btn:hover {
          background-color: #0867a5;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(9, 118, 188, 0.3);
        }

        /* Success screen */
        .modal-success-screen {
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 20px;
        }

        .success-circle {
          width: 72px;
          height: 72px;
          background-color: rgba(9, 118, 188, 0.08);
          color: #0976BC;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }

        .success-title {
          font-family: var(--font-display), sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #000000;
          margin: 0;
        }

        .success-text {
          font-size: 1.05rem;
          line-height: 1.6;
          color: rgba(0, 0, 0, 0.6);
          margin: 0;
          max-width: 440px;
        }

        .done-btn {
          height: 48px;
          background-color: #000000;
          color: #ffffff;
          padding: 0 32px;
          border-radius: 24px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          margin-top: 15px;
          transition: all 0.2s ease;
        }

        .done-btn:hover {
          background-color: #0976BC;
          transform: translateY(-1px);
        }

        @media (max-width: 992px) {
          .careers-main {
            padding: 0 24px;
          }
          .careers-intro-card {
            padding: 40px 24px;
          }
          .careers-grid {
            grid-template-columns: 1fr;
          }
        }
      `}} />

      {/* Cinematic Hero Section */}
      <HeroContainer 
        backgroundStyle={{ 
          backgroundImage: "url('/img/careers_team.png')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }} 
        className="cinematic-hero-container-custom"
      >
        {/* Premium dark gradient overlay for text legibility */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(1, 13, 22, 0.95) 0%, rgba(1, 13, 22, 0.75) 45%, rgba(1, 13, 22, 0.2) 100%)',
          zIndex: 1
        }} />
        
        {/* Black Edge Vignette */}
        <div className="cinematic-vignette" style={{ zIndex: 2 }} />
        
        {/* Procedural Film Grain Overlay */}
        <div className="film-grain" style={{ zIndex: 2 }} />

        {/* Left Column Content */}
        <HeroContent>
          <div className="premium-hero-label cinematic-badge">
            <Check size={14} style={{ marginRight: '6px' }} /> Join Our Mission
          </div>
          
          <h1 className="premium-hero-heading cinematic-title" style={{ fontSize: 'clamp(2.5rem, 4.2vw, 3.8rem)', lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff', margin: 0 }}>
            Careers at<br />
            Bapuji Surgicals
          </h1>
          
          <p className="premium-hero-description cinematic-subtext" style={{ color: 'rgba(255, 255, 255, 0.82)', fontSize: '18px', lineHeight: '1.5', maxWidth: '480px', marginTop: '20px', marginBottom: '28px' }}>
            Work with us. Explore remote-friendly, flexible opportunities and join our mission to make work life simpler, more pleasant and more productive.
          </p>
          
          <div className="premium-hero-buttons cinematic-actions">
            <button onClick={scrollToOpenings} className="btn-cinematic-primary">
              View Openings
              <ArrowRight size={16} />
            </button>
            <Link href="/contact" className="btn-cinematic-secondary">
              Contact HR
            </Link>
          </div>
        </HeroContent>
      </HeroContainer>

      {/* Main Content Area */}
      <main className="careers-main" id="openings-section">
        {/* Introduction Panel */}
        <motion.div 
          className="careers-intro-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="careers-intro-title">Grow Your Career in Medical Manufacturing</h2>
          <p className="careers-p">
            For over four decades, Bapuji Surgicals has supported hospitals and healthcare infrastructures nationwide with precision products. We place a premium not only on the quality and safety of our medical devices and hygiene supplies, but also on the professional advancement and well-being of our team members.
          </p>
          <p className="careers-p">
            By joining Bapuji Surgicals, you become part of a collaborative, values-driven team of engineers, sales specialists, and logistics coordinators. We encourage continuous learning, flexible workflows, and operational ownership to help you achieve your career aspirations.
          </p>
        </motion.div>

        {/* Section Heading & Location Filters */}
        <div className="careers-section-header">
          <h3 className="careers-section-title">Open Opportunities</h3>
          <div className="location-filters">
            {locations.map((loc) => (
              <button
                key={loc}
                className={`filter-btn ${selectedLocation === loc ? 'active' : ''}`}
                onClick={() => setSelectedLocation(loc)}
              >
                {loc === 'All' ? 'All Locations' : loc}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings Grid */}
        <motion.div 
          className="careers-grid"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="job-card"
              >
                <div className="job-card-header">
                  <div className="job-badges">
                    <span className="job-badge type">{job.type}</span>
                    <span className="job-badge location">
                      <MapPin size={12} /> {job.location}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{job.category}</span>
                </div>

                <h4 className="job-title">{job.title}</h4>
                <p className="job-desc">{job.desc}</p>

                <div className="job-reqs">
                  {job.reqs.map((req, index) => (
                    <div key={index} className="job-req-item">
                      <Check size={14} />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className="apply-btn"
                  onClick={() => handleApplyClick(job)}
                >
                  Apply Now
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Application Modal Portal */}
      <AnimatePresence>
        {activeJob && (
          <div className="modal-overlay" onClick={() => setActiveJob(null)}>
            <motion.div 
              className="app-modal"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {!isSubmitted ? (
                <>
                  <div className="modal-header">
                    <div className="modal-title-area">
                      <h4 className="modal-title">Submit Application</h4>
                      <p className="modal-subtitle">
                        <Building size={14} /> {activeJob.title} — {activeJob.location}
                      </p>
                    </div>
                    <button 
                      className="close-modal-btn"
                      onClick={() => setActiveJob(null)}
                      aria-label="Close form"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Full Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                        className="form-input" 
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="form-group font-sans">
                      <label className="form-label" htmlFor="email">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                        className="form-input" 
                        placeholder="johndoe@example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required 
                        className="form-input" 
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Resume / CV</label>
                      <input 
                        type="file" 
                        id="resume-file" 
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        required 
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="resume-file" className="file-upload-box">
                        <Upload size={24} className="file-upload-icon" />
                        <span className="file-upload-text">
                          {selectedFile ? (
                            <span>Selected: {selectedFile.name}</span>
                          ) : (
                            <>Click to <span>upload resume</span> or drag & drop</>
                          )}
                        </span>
                        <span className="file-upload-sub">Supports PDF, DOC, DOCX up to 10MB</span>
                      </label>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="coverLetter">Brief Message / Cover Letter</label>
                      <textarea 
                        id="coverLetter" 
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                        className="form-textarea" 
                        placeholder="Why would you be a good fit for this role?"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="submit-btn"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      {!isSubmitting && <ArrowRight size={16} />}
                    </button>
                  </form>
                </>
              ) : (
                <div className="modal-success-screen">
                  <div className="success-circle">
                    <Check size={36} />
                  </div>
                  <h4 className="success-title">Application Submitted!</h4>
                  <p className="success-text">
                    Thank you for applying for the <strong>{activeJob.title}</strong> role in <strong>{activeJob.location}</strong>. Our human resources department will review your resume and contact you if your qualifications match the profile.
                  </p>
                  <button 
                    className="done-btn"
                    onClick={() => setActiveJob(null)}
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Careers;
