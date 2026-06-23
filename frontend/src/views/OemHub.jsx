'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '../context/AuthContext';
import { WetWipesScrollytelling } from '../components/WetWipesScrollytelling';
import { Cpu, Send, CheckCircle2, ShieldAlert, ListFilter, ClipboardList, Eye } from 'lucide-react';
import { addLiveOrder, createDashboardOrderId } from '../lib/orderStore';

const VideoScrubber = ({ scrollProgress, videoSrc }) => {
  const videoRef = useRef(null);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Handle video loading state and metadata binding
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      console.log("Video loaded metadata: duration =", video.duration);
      setVideoDuration(video.duration);
      setIsLoaded(true);
      setLoadError(null);
    };

    const handleError = (e) => {
      console.error("Video load error:", e);
      setLoadError("Failed to load 3D video. Check format or connection.");
    };

    // If metadata is already loaded (readyState >= 1)
    if (video.readyState >= 1) {
      handleLoaded();
    } else {
      video.addEventListener('loadedmetadata', handleLoaded);
      video.addEventListener('loadeddata', handleLoaded);
      video.addEventListener('canplay', handleLoaded);
    }

    video.addEventListener('error', handleError);

    // Force load initiation
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('loadeddata', handleLoaded);
      video.removeEventListener('canplay', handleLoaded);
      video.removeEventListener('error', handleError);
    };
  }, [videoSrc]);

  // Update target time when scroll progress changes
  useEffect(() => {
    if (videoDuration > 0) {
      targetTimeRef.current = scrollProgress * videoDuration;
    }
  }, [scrollProgress, videoDuration]);

  // Easing loop using requestAnimationFrame
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLoaded) return;

    const updateVideoTime = () => {
      if (video.readyState < 1) {
        animationFrameRef.current = requestAnimationFrame(updateVideoTime);
        return;
      }

      // Linear interpolation (easing)
      const diff = targetTimeRef.current - currentTimeRef.current;
      
      try {
        if (Math.abs(diff) > 0.005) {
          currentTimeRef.current += diff * 0.12; // Easing coefficient
          // Bound safety
          if (currentTimeRef.current < 0) currentTimeRef.current = 0;
          if (currentTimeRef.current > videoDuration) currentTimeRef.current = videoDuration;
          video.currentTime = currentTimeRef.current;
        } else if (video.currentTime !== targetTimeRef.current) {
          currentTimeRef.current = targetTimeRef.current;
          video.currentTime = targetTimeRef.current;
        }
      } catch (err) {
        console.warn("Seeking error:", err);
      }

      animationFrameRef.current = requestAnimationFrame(updateVideoTime);
    };

    animationFrameRef.current = requestAnimationFrame(updateVideoTime);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLoaded, videoDuration]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <video
        ref={videoRef}
        src={videoSrc}
        playsInline
        muted
        preload="auto"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scale(1.1)',
          transformOrigin: 'bottom center',
          backgroundColor: '#ffffff',
          pointerEvents: 'none',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease'
        }}
      />
      
      {loadError && (
        <div style={{
          position: 'absolute',
          color: 'var(--accent)',
          fontSize: '0.9rem',
          textAlign: 'center',
          padding: '20px',
          background: 'rgba(220, 53, 69, 0.05)',
          border: '1px dashed rgba(220, 53, 69, 0.2)',
          borderRadius: '12px',
          maxWidth: '300px',
          zIndex: 10
        }}>
          <span>{loadError}</span>
        </div>
      )}

      {!isLoaded && !loadError && (
        <div style={{
          position: 'absolute',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid rgba(255,255,255,0.1)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span>Loading 3D interactive model...</span>
        </div>
      )}
    </div>
  );
};

const formatNumber = (num) => {
  if (num === null || num === undefined) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString().slice(0, 10);
};

const OemHub = () => {
  const { user  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Configurator Step Wizard state
  const [step, setStep] = useState(1);

  // Selected base product category
  const [category, setCategory] = useState(searchParams.get('category') || 'household-wipes');
  const [baseProductName, setBaseProductName] = useState(searchParams.get('name') || '');

  // Specifications
  const [material, setMaterial] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [sterilization, setSterilization] = useState('ETO Sterile');
  const [packaging, setPackaging] = useState('Custom Logo Box');
  const [description, setDescription] = useState('');
  const [targetQuantity, setTargetQuantity] = useState(1000); // default large minimum for OEM

  // Contact Info
  const [companyName, setCompanyName] = useState(user?.b2bProfile?.companyName || '');
  const [contactPerson, setContactPerson] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');

  // File
  const [designFile, setDesignFile] = useState(null);

  // States
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailNotice, setEmailNotice] = useState('');
  const [myInquiries, setMyInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Suggestion presets
  const materialPresets = [
    "50 GSM Spunlace Non-woven",
    "Organic Biodegradable Bamboo",
    "60 GSM Woodpulp Polyester",
    "Dispersible Flushable Fabric"
  ];

  const dimensionPresets = [
    "15cm x 20cm",
    "10cm x 12cm",
    "18cm x 22cm",
    "20cm x 20cm"
  ];

  // Scroll animation state
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (user) {
      fetchMyInquiries();
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.clientHeight;
      const viewportHeight = window.innerHeight;
      
      const totalScrollable = containerHeight - viewportHeight;
      if (totalScrollable <= 0) return;
      
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const fetchMyInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch('/api/oem/myinquiries', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setMyInquiries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleFileChange = (e) => {
    setDesignFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (targetQuantity < 500) {
      setError('OEM manufacturing requires a minimum quantity of 500 units.');
      return;
    }

    setError('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('companyName', companyName);
    formData.append('contactPerson', contactPerson);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('productCategory', category);
    formData.append('material', material);
    formData.append('dimensions', dimensions);
    formData.append('sterilization', sterilization);
    formData.append('packaging', packaging);
    formData.append('description', `Base Product: ${baseProductName || 'None'}. Custom Specs: ${description}`);
    formData.append('targetQuantity', targetQuantity);
    if (designFile) {
      formData.append('designFile', designFile);
    }

    const publishOemInquiryToDashboard = (backendInquiry = null) => {
      const today = new Date().toISOString().slice(0, 10);
      const unitPrice = targetQuantity < 1000 ? 28 : targetQuantity < 5000 ? 24 : 19;
      const productLabel = baseProductName || category.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

      addLiveOrder('oem', {
        id: backendInquiry?._id ? `OEM-${String(backendInquiry._id).slice(-6).toUpperCase()}` : createDashboardOrderId('oem'),
        company: companyName || user?.b2bProfile?.companyName || 'Website OEM Inquiry',
        contact: contactPerson || user?.name || 'Website Buyer',
        email,
        phone,
        product: productLabel,
        wipeType: material || 'Custom substrate',
        fragrance: sterilization || 'Custom formula',
        packaging,
        quantity: Number(targetQuantity || 0),
        unitPrice,
        amount: Number(targetQuantity || 0) * unitPrice,
        orderDate: today,
        deliveryDate: addDays(today, 45),
        status: 'Inquiry',
        comments: `Synced from website OEM configurator. Specs: ${description || 'Awaiting detailed notes'}`,
        health: 'green',
        healthStatus: 'NEW WEBSITE RFQ',
        assignedTeam: { sales: 'Vignesh Sullia', production: 'Pending assignment', qc: 'Pending assignment' },
        documents: designFile
          ? [{ name: designFile.name, type: 'Website Upload', size: 'Client file', date: today }]
          : []
      });
    };

    try {
      let backendInquiry = null;

      try {
        const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : undefined;
        const res = await fetch('/api/oem', {
          method: 'POST',
          ...(headers ? { headers } : {}),
          body: formData
        });

        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          backendInquiry = data?.inquiry || null;
          if (data?.emailStatus?.status === 'sent') {
            setEmailNotice('Confirmation email sent to the customer with the PDF attachment.');
          } else if (data?.emailStatus?.status === 'mock') {
            setEmailNotice('Email template and PDF were generated in backend mock mode. Add real SMTP credentials to send it physically.');
          } else if (data?.emailStatus?.message) {
            setEmailNotice(`Email status: ${data.emailStatus.message}`);
          } else {
            setEmailNotice('OEM request saved. Email delivery status was not returned by the server.');
          }
        } else {
          setEmailNotice('OEM saved locally, but backend email/PDF was not confirmed.');
          console.warn('OEM backend save/email skipped; dashboard local sync will continue.', data?.message || res.statusText);
        }
      } catch (backendError) {
        setEmailNotice('OEM saved locally, but backend email/PDF was not confirmed.');
        console.warn('OEM backend save/email skipped; dashboard local sync will continue.', backendError);
      }

      publishOemInquiryToDashboard(backendInquiry);

      setSuccess(true);
      setStep(1); // Reset configuration wizard step
      setBaseProductName('');
      setDescription('');
      setMaterial('');
      setDimensions('');
      setDesignFile(null);
      fetchMyInquiries();
      
      setTimeout(() => {
        setSuccess(false);
        setEmailNotice('');
      }, 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptQuote = async (inquiryId) => {
    try {
      const res = await fetch(`/api/oem/${inquiryId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        alert('Quotation quote accepted! Our factory billing desk will issue a proforma invoice shortly.');
        fetchMyInquiries();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Calculate text opacity and vertical offsets based on scroll progress
  const opIntro = Math.max(0, 1 - scrollProgress / 0.08);
  const opIntroY = scrollProgress * -100;

  const op1 = Math.max(0, 1 - Math.abs(scrollProgress - 0.24) / 0.12);
  const op1Y = (scrollProgress - 0.24) * -120;

  const op2 = Math.max(0, 1 - Math.abs(scrollProgress - 0.46) / 0.12);
  const op2Y = (scrollProgress - 0.46) * -120;

  const op3 = Math.max(0, 1 - Math.abs(scrollProgress - 0.68) / 0.12);
  const op3Y = (scrollProgress - 0.68) * -120;

  const op4 = Math.max(0, 1 - Math.abs(scrollProgress - 0.88) / 0.10);
  const op4Y = (scrollProgress - 0.88) * -120;

  // Fade out entire scrubber section past 0.94 progress
  const wrapperOpacity = Math.max(0, 1 - Math.max(0, scrollProgress - 0.94) / 0.06);

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <WetWipesScrollytelling />

      {/* Main specification form container */}
      <div className="container oem-main-content" style={{ padding: '80px 24px 100px 24px' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '60px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent)', fontWeight: '700' }}>
            OEM Manufacturing Studio
          </span>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Configure Custom Manufacturing Specs</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.5' }}>
            Configure your private label parameters below to draft an RFQ blueprint directly to our production line. We will calculate tiered cost estimates within 24 business hours.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'flex-start' }} className="oem-configurator-grid-responsive">
          <style dangerouslySetInnerHTML={{ __html: `
            @media (min-width: 992px) {
              .oem-configurator-grid-responsive {
                grid-template-columns: 1fr 1.3fr !important;
              }
            }
          `}} />

          {/* Left Column: Live Technical Blueprint Mockup */}
          <div className="oem-blueprint-card">
            <div className="oem-blueprint-header">
              <h3>Technical Specification Blueprint</h3>
              <span className="oem-blueprint-badge">RFQ DRAFT</span>
            </div>
            <div className="oem-blueprint-body">
              <div className="oem-blueprint-image-container">
                <img loading="lazy" src="/img/oem_wipes_mockup.png" alt="OEM Wet Wipes Mockup" />
              </div>
              
              <div className="oem-blueprint-specs">
                <div className="oem-blueprint-spec-row">
                  <span className="oem-blueprint-spec-label">Product Category</span>
                  <span className="oem-blueprint-spec-val" style={{ textTransform: 'capitalize' }}>
                    {category.replace('-', ' ')}
                  </span>
                </div>
                <div className="oem-blueprint-spec-row">
                  <span className="oem-blueprint-spec-label">Base Substrate</span>
                  <span className="oem-blueprint-spec-val">{material || 'Not Selected'}</span>
                </div>
                <div className="oem-blueprint-spec-row">
                  <span className="oem-blueprint-spec-label">Wipe Dimensions</span>
                  <span className="oem-blueprint-spec-val">{dimensions || 'Not Specified'}</span>
                </div>
                <div className="oem-blueprint-spec-row">
                  <span className="oem-blueprint-spec-label">Sterilization Protocol</span>
                  <span className="oem-blueprint-spec-val">{sterilization}</span>
                </div>
                <div className="oem-blueprint-spec-row">
                  <span className="oem-blueprint-spec-label">Outer Packaging</span>
                  <span className="oem-blueprint-spec-val">{packaging}</span>
                </div>
                <div className="oem-blueprint-spec-row">
                  <span className="oem-blueprint-spec-label">Order Volume</span>
                  <span className="oem-blueprint-spec-val">{formatNumber(targetQuantity)} Units</span>
                </div>
              </div>

              {/* Price Estimation */}
              <div className="oem-blueprint-price-box">
                <div className="oem-blueprint-price-label">
                  <span className="oem-blueprint-price-title">Est. Unit Price</span>
                  <span className="oem-blueprint-price-unit">
                    ₹{targetQuantity < 1000 ? '28.00' : targetQuantity < 5000 ? '24.00' : '19.00'}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="oem-blueprint-price-title">Est. Total Blueprint Cost</span>
                  <div className="oem-blueprint-price-total">
                    ₹{formatNumber(targetQuantity * (targetQuantity < 1000 ? 28 : targetQuantity < 5000 ? 24 : 19))}
                  </div>
                </div>
              </div>

              {/* Quality & Cleanroom Certification Badges */}
              <div className="oem-blueprint-stamps">
                <div className="oem-stamp-pill">
                  <CheckCircle2 size={12} style={{ color: '#28a745' }} /> ISO 9001 Certified
                </div>
                <div className="oem-stamp-pill">
                  <CheckCircle2 size={12} style={{ color: '#28a745' }} /> GMP Manufactured
                </div>
                <div className="oem-stamp-pill">
                  <CheckCircle2 size={12} style={{ color: '#28a745' }} /> Class 100 Sterile Room
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Step Configuration Wizard */}
          <div className="glass-card" style={{ padding: '40px' }}>
            {/* Wizard Header Progress Bar */}
            <div className="oem-wizard-header">
              <div className="oem-wizard-steps">
                {/* Visual indicator progress bar */}
                <div 
                  className="oem-wizard-progress-bar" 
                  style={{ width: `${((step - 1) / 2) * 98}%` }}
                />
                
                <div className={`oem-step-item ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`} onClick={() => setStep(1)}>
                  <div className="oem-step-indicator">1</div>
                  <span className="oem-step-label">Materials</span>
                </div>
                <div className={`oem-step-item ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`} onClick={() => {
                  if (material && dimensions) {
                    setError('');
                    setStep(2);
                  } else {
                    setError('Please specify materials and dimensions first.');
                  }
                }}>
                  <div className="oem-step-indicator">2</div>
                  <span className="oem-step-label">Packaging</span>
                </div>
                <div className={`oem-step-item ${step === 3 ? 'active' : ''}`} onClick={() => {
                  if (material && dimensions && description) {
                    setError('');
                    setStep(3);
                  } else if (!material || !dimensions) {
                    setError('Please specify materials and dimensions first.');
                  } else {
                    setError('Please specify custom packaging instructions first.');
                  }
                }}>
                  <div className="oem-step-indicator">3</div>
                  <span className="oem-step-label">Submit</span>
                </div>
              </div>
            </div>

            {success && (
              <div style={{
                background: 'rgba(40, 167, 69, 0.08)',
                border: '1px solid rgba(40, 167, 69, 0.25)',
                padding: '16px',
                borderRadius: '12px',
                color: '#28a745',
                fontSize: '0.9rem',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <CheckCircle2 size={18} style={{ flex: '0 0 auto', marginTop: '2px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>OEM Request submitted successfully! Our production desk will review specs and issue a price quotation shortly.</span>
                  {emailNotice && (
                    <span style={{ fontSize: '0.78rem', color: '#047857', lineHeight: 1.4 }}>
                      {emailNotice}
                    </span>
                  )}
                </div>
              </div>
            )}

            {!user ? (
              <div style={{
                background: 'rgba(220, 53, 69, 0.05)',
                border: '1px dashed rgba(220, 53, 69, 0.2)',
                padding: '24px',
                borderRadius: '12px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <p style={{ color: 'var(--text-secondary)' }}>You must be logged in to submit customized contract manufacturing blueprints and RFQs.</p>
                <Link href="/login?redirect=oem" className="btn btn-primary" style={{ width: 'fit-content', margin: '0 auto' }}>
                  Log In to Account
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* STEP 1: Chemical & Material Selection */}
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Base Product Category</label>
                      <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        className="form-input"
                        style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)' }}
                      >
                        <option value="household-wipes">Household Wipes</option>
                        <option value="mens-care-wipes">Mens Care Wipes</option>
                        <option value="baby-wipes">Baby Wipes</option>
                        <option value="pet-wipes">Pet Wipes</option>
                        <option value="personal-care-wipes">Personal Care Wipes</option>
                        <option value="automobile-wipes">Automobile Wipes</option>
                        <option value="other">Other / Custom Contract</option>
                      </select>
                    </div>

                    {baseProductName && (
                      <div style={{ background: 'var(--primary-glow)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                        Base product pre-selected: <strong>{baseProductName}</strong>
                      </div>
                    )}

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Material (GSM / Substrate)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 50 GSM Spunlace Non-woven" 
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        className="form-input"
                        required
                      />
                      <div className="oem-suggestions-wrapper">
                        {materialPresets.map((preset) => (
                          <span 
                            key={preset} 
                            className="oem-suggestion-badge"
                            onClick={() => setMaterial(preset)}
                          >
                            {preset}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Wipe Dimensions</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 15cm x 20cm" 
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        className="form-input"
                        required
                      />
                      <div className="oem-suggestions-wrapper">
                        {dimensionPresets.map((preset) => (
                          <span 
                            key={preset} 
                            className="oem-suggestion-badge"
                            onClick={() => setDimensions(preset)}
                          >
                            {preset}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Sterilization Protocol</label>
                      <div className="oem-option-grid">
                        <div 
                          className={`oem-option-card ${sterilization === 'ETO Sterile' ? 'active' : ''}`}
                          onClick={() => setSterilization('ETO Sterile')}
                        >
                          <span className="oem-option-card-title">
                            ETO Gas Sterile
                          </span>
                          <span className="oem-option-card-desc">Ethylene Oxide gas sterilization for heat/moisture sensitive parts.</span>
                        </div>
                        <div 
                          className={`oem-option-card ${sterilization === 'Gamma Sterile' ? 'active' : ''}`}
                          onClick={() => setSterilization('Gamma Sterile')}
                        >
                          <span className="oem-option-card-title">
                            Gamma Radiation
                          </span>
                          <span className="oem-option-card-desc">Deep penetrating Cobalt-60 radiation for complete micro destruction.</span>
                        </div>
                        <div 
                          className={`oem-option-card ${sterilization === 'Autoclaved' ? 'active' : ''}`}
                          onClick={() => setSterilization('Autoclaved')}
                        >
                          <span className="oem-option-card-title">
                            High Steam Autoclave
                          </span>
                          <span className="oem-option-card-desc">High-pressure steam autoclave sterilization for chemical-free purity.</span>
                        </div>
                        <div 
                          className={`oem-option-card ${sterilization === 'Non-Sterile' ? 'active' : ''}`}
                          onClick={() => setSterilization('Non-Sterile')}
                        >
                          <span className="oem-option-card-title">
                            Non-Sterile Bulk
                          </span>
                          <span className="oem-option-card-desc">Standard bulk manufacturing without post-sterilization lines.</span>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div style={{ color: 'var(--accent)', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <ShieldAlert size={14} /> {error}
                      </div>
                    )}

                    <button 
                      type="button" 
                      onClick={() => {
                        if (!material || !dimensions) {
                          setError('Please fill in material and dimensions.');
                        } else {
                          setError('');
                          setStep(2);
                        }
                      }}
                      className="btn btn-primary"
                      style={{ height: '48px', marginTop: '10px' }}
                    >
                      Continue to Packaging & Branding
                    </button>
                  </div>
                )}

                {/* STEP 2: Packaging & Instructions */}
                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Outer Packaging Type</label>
                      <div className="oem-option-grid">
                        <div 
                          className={`oem-option-card ${packaging === 'Custom Logo Box' ? 'active' : ''}`}
                          onClick={() => setPackaging('Custom Logo Box')}
                        >
                          <span className="oem-option-card-title">
                            Custom Logo Carton
                          </span>
                          <span className="oem-option-card-desc">Full-color customized retail boxes printed with your brand vectors.</span>
                        </div>
                        <div 
                          className={`oem-option-card ${packaging === 'Hospital Branded Pouches' ? 'active' : ''}`}
                          onClick={() => setPackaging('Hospital Branded Pouches')}
                        >
                          <span className="oem-option-card-title">
                            Sterile Pouches
                          </span>
                          <span className="oem-option-card-desc">Individual medical-grade foil seal pouches with direct printing.</span>
                        </div>
                        <div 
                          className={`oem-option-card ${packaging === 'Bapuji Generic Pack' ? 'active' : ''}`}
                          onClick={() => setPackaging('Bapuji Generic Pack')}
                        >
                          <span className="oem-option-card-title">
                            Bapuji Standard Pack
                          </span>
                          <span className="oem-option-card-desc">Standard Bapuji clinical packaging - fastest lead time.</span>
                        </div>
                        <div 
                          className={`oem-option-card ${packaging === 'Unbranded Bulk Pack' ? 'active' : ''}`}
                          onClick={() => setPackaging('Unbranded Bulk Pack')}
                        >
                          <span className="oem-option-card-title">
                            Neutral Unbranded
                          </span>
                          <span className="oem-option-card-desc">Shipped in plain white bags and unmarked heavy-duty cardboard boxes.</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Upload Design Blueprint / Brand Logo</label>
                      <div 
                        className="oem-file-zone"
                        onClick={() => document.getElementById('oem-file-input').click()}
                      >
                        <ClipboardList size={28} style={{ color: 'var(--accent)' }} />
                        <span className="oem-file-zone-text">
                          {designFile ? `Selected: ${designFile.name}` : 'Click to select or drag design PDF/images here'}
                        </span>
                        <span className="oem-file-zone-sub">Supports PDF, JPG, PNG (Max 10MB)</span>
                        <input 
                          id="oem-file-input"
                          type="file" 
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Custom Specifications & Instructions</label>
                      <textarea 
                        placeholder="Detail any special active formulas, lid styles, fold mechanics, barcode structures, or regulatory tags..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-input"
                        style={{ minHeight: '120px', resize: 'vertical' }}
                        required
                      />
                    </div>

                    {error && (
                      <div style={{ color: 'var(--accent)', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <ShieldAlert size={14} /> {error}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                      <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="btn btn-secondary"
                        style={{ height: '48px' }}
                      >
                        Back
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          if (!description) {
                            setError('Please provide custom manufacturing specifications.');
                          } else {
                            setError('');
                            setStep(3);
                          }
                        }}
                        className="btn btn-primary"
                        style={{ height: '48px' }}
                      >
                        Continue to Procurement Contact
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Procurement & Quantity details */}
                {step === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Target Manufacturing Quantity (min 500)</label>
                      <input 
                        type="number" 
                        min="500"
                        value={targetQuantity}
                        onChange={(e) => setTargetQuantity(parseInt(e.target.value) || 500)}
                        className="form-input"
                        required
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <span>500-999: ₹28/unit</span>
                        <span>1,000-4,999: ₹24/unit</span>
                        <span>5,000+: ₹19/unit</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Procurement Contact Details
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Company Name</label>
                        <input 
                          type="text" 
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Contact Person</label>
                        <input 
                          type="text" 
                          value={contactPerson}
                          onChange={(e) => setContactPerson(e.target.value)}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Email Address</label>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Phone Number</label>
                        <input 
                          type="text" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <div style={{ color: 'var(--accent)', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <ShieldAlert size={14} /> {error}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                      <button 
                        type="button" 
                        onClick={() => setStep(2)}
                        className="btn btn-secondary"
                        style={{ height: '48px' }}
                      >
                        Back
                      </button>
                      <button 
                        type="submit" 
                        disabled={submitting}
                        className="btn btn-primary glow-hover" 
                        style={{ height: '48px' }}
                      >
                        {submitting ? 'Submitting Blueprints...' : 'Send OEM Inquiry To Factory'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* My Active OEM Inquiries List - B2B Ledger */}
          {user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="oem-configurator-grid-responsive-span-all">
              <style dangerouslySetInnerHTML={{ __html: `
                @media (min-width: 992px) {
                  .oem-configurator-grid-responsive-span-all {
                    grid-column: 1 / span 2 !important;
                  }
                }
              `}} />
              
              <div className="glass-card" style={{ padding: '30px' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <ClipboardList size={20} style={{ color: 'var(--accent)' }} /> Active OEM Quotations Ledger
                </h2>

                {loadingInquiries ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                    Retrieving your B2B customization logs...
                  </div>
                ) : myInquiries.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                    You have not submitted any custom OEM blueprints yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {myInquiries.map((inq) => (
                      <div 
                        key={inq._id} 
                        className={`oem-ledger-card ${inq.status}`}
                      >
                        <div className="oem-ledger-header">
                          <span className="oem-ledger-title">
                            RFQ-BAP-2026-{inq._id.substring(inq._id.length - 6).toUpperCase()}
                          </span>
                          <span className={`badge ${
                            inq.status === 'quoted' ? 'badge-approved' : 
                            inq.status === 'accepted' ? 'badge-approved' : 
                            inq.status === 'reviewing' ? 'badge-pending' : 
                            'badge-pending'
                          }`} style={{ fontSize: '0.65rem', textTransform: 'capitalize' }}>
                            {inq.status}
                          </span>
                        </div>
                        
                        <div className="oem-ledger-grid">
                          <div className="oem-ledger-item">
                            Category: <span>{inq.productCategory.replace('-', ' ')}</span>
                          </div>
                          <div className="oem-ledger-item">
                            Date: <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="oem-ledger-item">
                            Substrate: <span>{inq.specifications?.material || 'Custom'}</span>
                          </div>
                          <div className="oem-ledger-item">
                            Dimensions: <span>{inq.specifications?.dimensions || 'Custom'}</span>
                          </div>
                          <div className="oem-ledger-item">
                            Sterilization: <span>{inq.specifications?.sterilization || 'ETO'}</span>
                          </div>
                          <div className="oem-ledger-item">
                            Volume: <span>{formatNumber(inq.targetQuantity)} Units</span>
                          </div>
                        </div>

                        {inq.quotedPrice && (
                          <div style={{
                            marginTop: '14px',
                            background: 'rgba(252, 95, 43, 0.04)',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(252, 95, 43, 0.12)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Factory Quoted Price</span>
                              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)' }}>
                                ₹{inq.quotedPrice} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ unit</span>
                              </span>
                            </div>
                            {inq.status === 'quoted' && (
                              <button 
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to accept this official manufacturing quotation?")) {
                                    handleAcceptQuote(inq._id);
                                  }
                                }}
                                className="btn btn-primary"
                                style={{ padding: '6px 14px', fontSize: '0.75rem', height: 'auto' }}
                              >
                                Accept Quote
                              </button>
                            )}
                          </div>
                        )}

                        {inq.adminFeedback && (
                          <div style={{ marginTop: '10px', fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'var(--bg-surface-elevated)', padding: '8px 12px', borderRadius: '6px' }}>
                            <strong>Factory Feedback:</strong> "{inq.adminFeedback}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OemHub;

