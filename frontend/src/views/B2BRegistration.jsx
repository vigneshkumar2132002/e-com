'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ShieldCheck, Upload, Building, FileText, CheckCircle2, ShieldAlert, X, 
  Lock, MapPin, User, ChevronRight, Activity, Truck, Settings, Phone, 
  Briefcase, ArrowRight, ArrowDown, ChevronDown, Package, Globe, Star
} from 'lucide-react';

// Reusable CountUp component
const CountUp = ({ end, suffix = '', title }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <div ref={nodeRef} className="b2b-stat-card">
      <div className="b2b-stat-number">{count}{suffix}</div>
      <div className="b2b-stat-title">{title}</div>
    </div>
  );
};

export default function B2BRegistration() {
  const { registerB2B } = useAuth();
  const router = useRouter();

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form Data State
  const [formData, setFormData] = useState({
    companyName: '',
    gstinOrTaxId: '',
    businessType: 'Hospital',
    expectedMonthlyPurchase: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    message: ''
  });
  const [documentFile, setDocumentFile] = useState(null);

  // Status state
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  // Persist form data
  useEffect(() => {
    const savedData = localStorage.getItem('b2bFormData');
    const savedStep = localStorage.getItem('b2bFormStep');
    if (savedData) {
      setFormData(prev => ({ ...prev, ...JSON.parse(savedData) }));
    }
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    localStorage.setItem('b2bFormData', JSON.stringify(newFormData));
  };

  const nextStep = () => {
    const next = currentStep + 1;
    setCurrentStep(next);
    localStorage.setItem('b2bFormStep', next);
    // Analytics
    console.log(`[Analytics] Step ${next} Reached`);
  };

  const prevStep = () => {
    const prev = currentStep - 1;
    setCurrentStep(prev);
    localStorage.setItem('b2bFormStep', prev);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Document size exceeds 10MB limit');
        return;
      }
      const validMimes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validMimes.includes(file.type)) {
        setError('Invalid document format. Use PDF, JPG, PNG or DOCX.');
        return;
      }
      setDocumentFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentFile) {
      setError('Please upload your business registration document.');
      return;
    }
    
    console.log('[Analytics] Form Submitted');
    setError('');
    setSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append('leadSource', 'Website');
    data.append('document', documentFile);

    const address = { 
      street: formData.street, 
      city: formData.city, 
      state: formData.state, 
      zipCode: formData.zipCode, 
      country: formData.country 
    };
    data.append('shippingAddress', JSON.stringify(address));

    try {
      const res = await registerB2B(data);
      // Clear persistence
      localStorage.removeItem('b2bFormData');
      localStorage.removeItem('b2bFormStep');
      
      setSuccessData({
        applicationId: res.applicationId || `B2B-2026-${Math.floor(Math.random() * 1000)}`
      });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('registration-form').scrollIntoView({ behavior: 'smooth' });
    console.log('[Analytics] Form Started');
  };

  // Parallax setup for Hero
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);

  if (successData) {
    return (
      <div className="b2b-success-container">
        <style dangerouslySetInnerHTML={{ __html: `
          .b2b-success-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; padding: 24px; font-family: system-ui, sans-serif; }
          .b2b-success-card { background: #ffffff; border-radius: 24px; padding: 60px 48px; max-width: 600px; width: 100%; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 24px; }
          .b2b-success-icon { width: 88px; height: 88px; border-radius: 50%; background: #ecfdf5; color: #10b981; display: grid; place-items: center; margin-bottom: 8px; }
          .b2b-success-title { font-size: 2.2rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.03em; }
          .b2b-success-ref { background: #f1f5f9; padding: 12px 24px; border-radius: 999px; font-family: monospace; font-size: 1.1rem; color: #334155; font-weight: 700; border: 1px dashed #cbd5e1; }
          .b2b-success-desc { color: #475569; line-height: 1.6; font-size: 1.05rem; margin: 0; }
          .b2b-success-actions { display: flex; gap: 16px; margin-top: 16px; width: 100%; }
          .b2b-success-btn-primary { flex: 1; padding: 16px; background: #0976BC; color: #fff; border-radius: 12px; font-weight: 700; text-decoration: none; transition: 0.2s; }
          .b2b-success-btn-primary:hover { background: #075985; }
          .b2b-success-btn-secondary { flex: 1; padding: 16px; background: #f1f5f9; color: #0f172a; border-radius: 12px; font-weight: 700; text-decoration: none; transition: 0.2s; }
          .b2b-success-btn-secondary:hover { background: #e2e8f0; }
        `}} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="b2b-success-card">
          <div className="b2b-success-icon">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="b2b-success-title">Application Received</h2>
          <div className="b2b-success-ref">Reference: {successData.applicationId}</div>
          <p className="b2b-success-desc">
            Your B2B Wholesale application has been successfully submitted. Our enterprise onboarding team will review your documents and contact you within 24–48 hours to activate your clinical contract rates.
          </p>
          <div className="b2b-success-actions">
            <a href="/downloads/Bapuji_Catalogue.pdf" className="b2b-success-btn-primary">Download Catalogue</a>
            <a href="/" className="b2b-success-btn-secondary">Return Home</a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="b2b-premium-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .b2b-premium-page { font-family: var(--font-display), system-ui, sans-serif; background: #ffffff; color: #0f172a; overflow-x: hidden; }
        
        /* Typography & Utilities */
        .b2b-section { padding: 100px 5%; max-width: 1400px; margin: 0 auto; box-sizing: border-box; }
        .b2b-section-header { text-align: center; margin-bottom: 64px; }
        .b2b-section-title { font-size: clamp(2.5rem, 4vw, 3.5rem); font-weight: 800; letter-spacing: -0.04em; color: #0f172a; margin-bottom: 16px; }
        .b2b-section-desc { font-size: 1.15rem; color: #64748b; max-width: 600px; margin: 0 auto; line-height: 1.6; }
        
        /* Hero Section */
        .b2b-hero { position: relative; height: 90vh; min-height: 700px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #0f172a; color: #fff; text-align: center; }
        .b2b-hero-bg { position: absolute; inset: 0; opacity: 0.4; background-image: url('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2000&auto=format&fit=crop'); background-size: cover; background-position: center; }
        .b2b-hero-gradient { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(15,23,42,0.3) 0%, #0f172a 100%); }
        .b2b-hero-content { position: relative; z-index: 10; max-width: 800px; padding: 0 24px; }
        .b2b-hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 24px; backdrop-filter: blur(10px); }
        .b2b-hero-title { font-size: clamp(3rem, 6vw, 5rem); font-weight: 900; letter-spacing: -0.04em; line-height: 1.1; margin-bottom: 24px; background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .b2b-hero-desc { font-size: 1.25rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 40px; }
        .b2b-hero-actions { display: flex; gap: 16px; justify-content: center; }
        .b2b-btn-primary { padding: 18px 36px; background: #0976BC; color: #fff; border-radius: 999px; font-size: 1.05rem; font-weight: 700; border: none; cursor: pointer; transition: 0.3s; display: inline-flex; align-items: center; gap: 8px; }
        .b2b-btn-primary:hover { background: #075985; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(9,118,188,0.3); }
        .b2b-btn-outline { padding: 18px 36px; background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.3); border-radius: 999px; font-size: 1.05rem; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .b2b-btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; }

        /* Why Partner Section */
        .b2b-benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .b2b-benefit-card { padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 24px; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .b2b-benefit-card:hover { transform: translateY(-8px); background: #ffffff; box-shadow: 0 20px 40px rgba(15,23,42,0.06); border-color: #cbd5e1; }
        .b2b-benefit-icon { width: 56px; height: 56px; background: #e0f2fe; color: #0284c7; border-radius: 16px; display: grid; place-items: center; margin-bottom: 24px; }
        .b2b-benefit-title { font-size: 1.3rem; font-weight: 800; margin-bottom: 12px; color: #0f172a; }
        .b2b-benefit-desc { font-size: 1rem; color: #64748b; line-height: 1.6; }

        /* Workflow Timeline */
        .b2b-workflow { background: #0f172a; color: #fff; padding: 120px 5%; }
        .b2b-workflow-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; max-width: 1200px; margin: 0 auto; position: relative; }
        .b2b-step-card { position: relative; padding: 32px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; }
        .b2b-step-num { font-size: 3rem; font-weight: 900; color: rgba(255,255,255,0.1); position: absolute; top: 20px; right: 24px; }
        .b2b-step-icon { color: #38bdf8; margin-bottom: 20px; }
        .b2b-step-title { font-size: 1.25rem; font-weight: 800; margin-bottom: 10px; }
        .b2b-step-desc { font-size: 0.95rem; color: rgba(255,255,255,0.6); line-height: 1.5; }

        /* Stats Section */
        .b2b-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 80px; padding-top: 80px; border-top: 1px solid #e2e8f0; }
        .b2b-stat-card { text-align: center; }
        .b2b-stat-number { font-size: 3.5rem; font-weight: 900; color: #0976BC; letter-spacing: -0.05em; line-height: 1; margin-bottom: 8px; }
        .b2b-stat-title { font-size: 1rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }

        /* Product Categories */
        .b2b-categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
        .b2b-category-card { position: relative; height: 300px; border-radius: 24px; overflow: hidden; cursor: pointer; }
        .b2b-category-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .b2b-category-card:hover .b2b-category-bg { transform: scale(1.08); }
        .b2b-category-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.9), transparent); display: flex; align-items: flex-end; padding: 32px; }
        .b2b-category-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0; }

        /* Requirements / Accordion */
        .b2b-req-grid { display: flex; flex-direction: column; gap: 16px; max-width: 800px; margin: 0 auto; }
        .b2b-accordion { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
        .b2b-acc-summary { padding: 24px; display: flex; align-items: center; justify-content: space-between; font-size: 1.15rem; font-weight: 700; cursor: pointer; user-select: none; }
        .b2b-acc-summary::-webkit-details-marker { display: none; }
        .b2b-acc-content { padding: 0 24px 24px; color: #64748b; line-height: 1.6; }

        /* Form UX */
        .b2b-form-section { background: #f8fafc; padding: 120px 5%; }
        .b2b-form-wrapper { max-width: 800px; margin: 0 auto; background: #fff; border-radius: 32px; box-shadow: 0 25px 50px -12px rgba(15,23,42,0.08); padding: 48px; border: 1px solid #e2e8f0; }
        
        .b2b-progress-bar { display: flex; justify-content: space-between; margin-bottom: 48px; position: relative; }
        .b2b-progress-bar::before { content: ''; position: absolute; top: 16px; left: 0; right: 0; height: 2px; background: #e2e8f0; z-index: 1; }
        .b2b-progress-step { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .b2b-step-circle { width: 34px; height: 34px; border-radius: 50%; background: #fff; border: 2px solid #cbd5e1; display: grid; place-items: center; font-weight: 700; color: #94a3b8; transition: 0.3s; }
        .b2b-progress-step.active .b2b-step-circle { border-color: #0976BC; color: #0976BC; }
        .b2b-progress-step.completed .b2b-step-circle { background: #0976BC; border-color: #0976BC; color: #fff; }
        .b2b-step-label { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .b2b-form-group { margin-bottom: 24px; }
        .b2b-form-label { display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 8px; }
        .b2b-input { width: 100%; padding: 16px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 1rem; color: #0f172a; transition: 0.2s; box-sizing: border-box; background: #fff; }
        .b2b-input:focus { outline: none; border-color: #0976BC; box-shadow: 0 0 0 4px rgba(9,118,188,0.1); }
        .b2b-select { width: 100%; padding: 16px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 1rem; color: #0f172a; background: #fff; appearance: none; }
        
        .b2b-form-actions { display: flex; justify-content: space-between; margin-top: 48px; padding-top: 32px; border-top: 1px solid #e2e8f0; }
        .b2b-btn-back { padding: 16px 32px; background: transparent; color: #64748b; border: none; font-weight: 700; font-size: 1rem; cursor: pointer; }
        .b2b-btn-next { padding: 16px 40px; background: #0f172a; color: #fff; border-radius: 12px; font-weight: 700; font-size: 1rem; border: none; cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; gap: 8px; }
        .b2b-btn-next:hover { background: #334155; transform: translateY(-1px); }

        .b2b-file-drop { border: 2px dashed #cbd5e1; border-radius: 16px; padding: 48px 24px; text-align: center; cursor: pointer; transition: 0.2s; background: #f8fafc; }
        .b2b-file-drop:hover { border-color: #0976BC; background: #f0f9ff; }
        
        /* Mobile */
        @media (max-width: 768px) {
          .b2b-workflow-grid, .b2b-stats { grid-template-columns: 1fr; gap: 24px; }
          .b2b-hero-title { font-size: 2.5rem; }
          .b2b-form-wrapper { padding: 32px 20px; }
          .b2b-step-label { display: none; }
        }
      `}} />

      {/* SECTION 1: HERO */}
      <section className="b2b-hero">
        <motion.div style={{ y: y1 }} className="b2b-hero-bg" />
        <div className="b2b-hero-gradient" />
        <div className="b2b-hero-content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="b2b-hero-badge"><ShieldCheck size={16} color="#38bdf8" /> Bapuji Enterprise Program</div>
            <h1 className="b2b-hero-title">Become a B2B Partner</h1>
            <p className="b2b-hero-desc">
              Wholesale and distribution solutions for healthcare institutions, pharmacies, retailers, and commercial organizations. Access clinical contract rates today.
            </p>
            <div className="b2b-hero-actions">
              <button onClick={scrollToForm} className="b2b-btn-primary">Apply Now <ArrowDown size={18}/></button>
              <a href="/downloads/Bapuji_Catalogue.pdf" className="b2b-btn-outline">Download Catalogue</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: WHY PARTNER WITH US */}
      <section className="b2b-section">
        <div className="b2b-section-header">
          <h2 className="b2b-section-title">Why Partner With Us</h2>
          <p className="b2b-section-desc">Experience the difference of direct manufacturer access combined with enterprise-grade dedicated support.</p>
        </div>
        <div className="b2b-benefits-grid">
          {[
            { title: 'Competitive Pricing', desc: 'Direct manufacturer costs and tiered wholesaler quotes automatically applied.', icon: Activity },
            { title: 'Fast Delivery', desc: 'Priority nationwide dispatch straight from our Class 100 sterile cleanrooms.', icon: Truck },
            { title: 'Quality Assured', desc: 'Batch certificates including ISO 13485 & CE validation with every shipment.', icon: ShieldCheck },
            { title: 'Dedicated Support', desc: 'Assigned packing engineer and a dedicated B2B account operation coordinator.', icon: Phone },
            { title: 'Private Label Options', desc: 'Custom logo graphics and hospital branding on cartons and reseal packs.', icon: Settings }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="b2b-benefit-card"
            >
              <div className="b2b-benefit-icon"><item.icon size={28} /></div>
              <h3 className="b2b-benefit-title">{item.title}</h3>
              <p className="b2b-benefit-desc">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* SECTION 5: STATISTICS */}
        <div className="b2b-stats">
          <CountUp end={500} suffix="+" title="Business Partners" />
          <CountUp end={50} suffix="+" title="Cities Served" />
          <CountUp end={1} suffix="M+" title="Products Delivered" />
          <CountUp end={98} suffix="%" title="Customer Satisfaction" />
        </div>
      </section>

      {/* SECTION 3: B2B WORKFLOW */}
      <section className="b2b-workflow">
        <div className="b2b-section-header">
          <h2 className="b2b-section-title" style={{ color: '#fff' }}>The Partnership Process</h2>
          <p className="b2b-section-desc" style={{ color: '#94a3b8' }}>A streamlined workflow designed to get your establishment verified and ready to order.</p>
        </div>
        <div className="b2b-workflow-grid">
          {[
            { step: '01', title: 'Submit Application', desc: 'Complete the multi-step form with your business credentials.', icon: FileText },
            { step: '02', title: 'Account Verification', desc: 'Our compliance team reviews your GST and licenses.', icon: ShieldCheck },
            { step: '03', title: 'Business Approval', desc: 'Your account is unlocked with a dedicated Sales Manager.', icon: CheckCircle2 },
            { step: '04', title: 'Pricing Allocation', desc: 'Custom wholesale pricing tiers are applied to your profile.', icon: Activity },
            { step: '05', title: 'Order Placement', desc: 'Upload Purchase Orders and buy on Net 30 credit terms.', icon: Package },
            { step: '06', title: 'Delivery', desc: 'Secure palletized dispatch directly to your loading dock.', icon: Truck }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="b2b-step-card"
            >
              <div className="b2b-step-num">{item.step}</div>
              <item.icon size={32} className="b2b-step-icon" />
              <h3 className="b2b-step-title">{item.title}</h3>
              <p className="b2b-step-desc">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 6: PRODUCT CATEGORIES */}
      <section className="b2b-section">
        <div className="b2b-section-header">
          <h2 className="b2b-section-title">Wholesale Categories</h2>
          <p className="b2b-section-desc">Explore our sterile, high-quality production lines ready for bulk hospital allocation.</p>
        </div>
        <div className="b2b-categories">
          {[
            { title: 'Medical Consumables', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600' },
            { title: 'Surgical Products', img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600' },
            { title: 'Diagnostic Supplies', img: 'https://images.unsplash.com/photo-1628177142898-93e46e46248c?w=600' },
            { title: 'Hospital Essentials', img: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600' }
          ].map((cat, i) => (
            <div key={i} className="b2b-category-card">
              <div className="b2b-category-bg" style={{ backgroundImage: `url(${cat.img})` }} />
              <div className="b2b-category-overlay">
                <h3 className="b2b-category-title">{cat.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: REQUIREMENTS & FAQ */}
      <section className="b2b-section" style={{ background: '#f8fafc', borderRadius: '48px', padding: '80px 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', maxWidth: '1200px', margin: '0 auto' }}>
          
          <div>
            <h2 className="b2b-section-title" style={{ fontSize: '2.5rem' }}>Eligibility Requirements</h2>
            <p className="b2b-section-desc" style={{ marginLeft: 0, marginBottom: '32px' }}>Please ensure you meet these criteria before applying.</p>
            <div className="b2b-req-grid">
              <details className="b2b-accordion">
                <summary className="b2b-acc-summary">Valid Business Registration <ChevronDown size={20}/></summary>
                <div className="b2b-acc-content">You must be a registered business entity (Private Limited, LLC, Partnership, or Sole Proprietorship) with valid incorporation documents.</div>
              </details>
              <details className="b2b-accordion">
                <summary className="b2b-acc-summary">GST Number <ChevronDown size={20}/></summary>
                <div className="b2b-acc-content">A valid Indian GSTIN is required for tax-compliant invoicing and interstate waybill generation.</div>
              </details>
              <details className="b2b-accordion">
                <summary className="b2b-acc-summary">Drug License (If applicable) <ChevronDown size={20}/></summary>
                <div className="b2b-acc-content">If you are purchasing restricted surgical or diagnostic goods, a Form 20/21 or 20B/21B wholesale drug license is mandatory.</div>
              </details>
              <details className="b2b-accordion">
                <summary className="b2b-acc-summary">Minimum Order Quantity <ChevronDown size={20}/></summary>
                <div className="b2b-acc-content">Standard MOQ is 1,000 units per SKU for wholesale pricing, and 10,000 units for custom OEM branding.</div>
              </details>
            </div>
          </div>

          <div>
            <h2 className="b2b-section-title" style={{ fontSize: '2.5rem' }}>Frequently Asked Questions</h2>
            <p className="b2b-section-desc" style={{ marginLeft: 0, marginBottom: '32px' }}>Quick answers regarding our B2B terms.</p>
            <div className="b2b-req-grid">
              <details className="b2b-accordion">
                <summary className="b2b-acc-summary">What are the Payment Terms? <ChevronDown size={20}/></summary>
                <div className="b2b-acc-content">Approved accounts get Net 30 days credit. Initial orders require 50% advance for unverified accounts.</div>
              </details>
              <details className="b2b-accordion">
                <summary className="b2b-acc-summary">How is Shipping handled? <ChevronDown size={20}/></summary>
                <div className="b2b-acc-content">We dispatch via preferred logistics partners (e.g., VRL, SafeExpress) directly to your warehouse. Freight is billed at actuals.</div>
              </details>
              <details className="b2b-accordion">
                <summary className="b2b-acc-summary">How long is the Approval Time? <ChevronDown size={20}/></summary>
                <div className="b2b-acc-content">Once documents are submitted, our compliance desk approves accounts within 24–48 business hours.</div>
              </details>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 9 & 10: REGISTRATION FORM */}
      <section id="registration-form" className="b2b-form-section">
        <div className="b2b-section-header">
          <h2 className="b2b-section-title">Wholesale Application</h2>
          <p className="b2b-section-desc">Join 500+ healthcare institutions sourcing directly from Bapuji Surgicals.</p>
        </div>

        <div className="b2b-form-wrapper">
          {/* Progress Bar */}
          <div className="b2b-progress-bar">
            {[
              { step: 1, label: 'Business' },
              { step: 2, label: 'Contact' },
              { step: 3, label: 'Documents' },
              { step: 4, label: 'Review' }
            ].map((s) => (
              <div key={s.step} className={`b2b-progress-step ${currentStep === s.step ? 'active' : ''} ${currentStep > s.step ? 'completed' : ''}`}>
                <div className="b2b-step-circle">{currentStep > s.step ? <CheckCircle2 size={16} /> : s.step}</div>
                <div className="b2b-step-label">{s.label}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="b2b-form-group">
                    <label className="b2b-form-label">Company / Hospital Name</label>
                    <input name="companyName" value={formData.companyName} onChange={handleInputChange} className="b2b-input" required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="b2b-form-group">
                      <label className="b2b-form-label">GSTIN / Tax ID</label>
                      <input name="gstinOrTaxId" value={formData.gstinOrTaxId} onChange={handleInputChange} className="b2b-input" required />
                    </div>
                    <div className="b2b-form-group">
                      <label className="b2b-form-label">Business Type</label>
                      <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="b2b-select">
                        <option>Hospital / Clinic</option>
                        <option>Pharmacy Retail</option>
                        <option>Distributor</option>
                        <option>Corporate OEM</option>
                      </select>
                    </div>
                  </div>
                  <div className="b2b-form-group">
                    <label className="b2b-form-label">Expected Monthly Purchase Value (₹)</label>
                    <select name="expectedMonthlyPurchase" value={formData.expectedMonthlyPurchase} onChange={handleInputChange} className="b2b-select" required>
                      <option value="">Select an estimate</option>
                      <option>Under ₹1,000,00</option>
                      <option>₹1,000,00 - ₹5,000,00</option>
                      <option>₹5,000,00 - ₹20,000,00</option>
                      <option>Over ₹20,000,00</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="b2b-form-group">
                      <label className="b2b-form-label">Contact Person</label>
                      <input name="name" value={formData.name} onChange={handleInputChange} className="b2b-input" required />
                    </div>
                    <div className="b2b-form-group">
                      <label className="b2b-form-label">Phone Number</label>
                      <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="b2b-input" required />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="b2b-form-group">
                      <label className="b2b-form-label">Official Email</label>
                      <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="b2b-input" required />
                    </div>
                    <div className="b2b-form-group">
                      <label className="b2b-form-label">Account Password</label>
                      <input name="password" type="password" value={formData.password} onChange={handleInputChange} className="b2b-input" required />
                    </div>
                  </div>
                  <div className="b2b-form-group">
                    <label className="b2b-form-label">Street Address</label>
                    <input name="street" value={formData.street} onChange={handleInputChange} className="b2b-input" required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div className="b2b-form-group"><label className="b2b-form-label">City</label><input name="city" value={formData.city} onChange={handleInputChange} className="b2b-input" required /></div>
                    <div className="b2b-form-group"><label className="b2b-form-label">State</label><input name="state" value={formData.state} onChange={handleInputChange} className="b2b-input" required /></div>
                    <div className="b2b-form-group"><label className="b2b-form-label">PIN Code</label><input name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="b2b-input" required /></div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="b2b-form-group">
                    <label className="b2b-form-label">Upload Business Document (GST / License)</label>
                    <input type="file" id="doc-upload" onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.jpg,.png,.docx" />
                    
                    {!documentFile ? (
                      <label htmlFor="doc-upload" className="b2b-file-drop">
                        <Upload size={32} color="#64748b" style={{ marginBottom: '16px' }} />
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Click to upload document</h4>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Max size 10MB. Accepted: PDF, JPG, PNG, DOCX.</p>
                      </label>
                    ) : (
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#166534', fontWeight: 700 }}>
                          <FileText size={24} /> {documentFile.name}
                        </div>
                        <button type="button" onClick={() => setDocumentFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#166534' }}><X size={20}/></button>
                      </div>
                    )}
                  </div>
                  <div className="b2b-form-group">
                    <label className="b2b-form-label">Additional Message (Optional)</label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} className="b2b-input" rows="4" placeholder="Any specific requirements or products you are looking for?" />
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px' }}>Review Application</h3>
                  <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'grid', gap: '16px' }}>
                    <div><strong>Company:</strong> {formData.companyName}</div>
                    <div><strong>Contact:</strong> {formData.name} ({formData.email})</div>
                    <div><strong>Address:</strong> {formData.street}, {formData.city}, {formData.state} {formData.zipCode}</div>
                    <div><strong>Document:</strong> {documentFile ? documentFile.name : 'Missing!'}</div>
                  </div>
                  {error && (
                    <div style={{ padding: '16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldAlert size={18}/> {error}
                    </div>
                  )}
                  <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    By submitting, you agree to our B2B Wholesale Terms & Conditions. Our compliance desk will review your details shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="b2b-form-actions">
              {currentStep > 1 ? (
                <button type="button" onClick={prevStep} className="b2b-btn-back">Back</button>
              ) : <div></div>}

              {currentStep < 4 ? (
                <button type="button" onClick={nextStep} className="b2b-btn-next">Next Step <ArrowRight size={18}/></button>
              ) : (
                <button type="submit" disabled={submitting} className="b2b-btn-next" style={{ background: '#0976BC' }}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <style dangerouslySetInnerHTML={{ __html: `
        .b2b-mobile-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; padding: 16px; background: #fff; box-shadow: 0 -10px 20px rgba(0,0,0,0.05); z-index: 100; border-top: 1px solid #e2e8f0; }
        @media (max-width: 768px) { .b2b-mobile-cta { display: block; } }
      `}} />
      <div className="b2b-mobile-cta">
        <button onClick={scrollToForm} style={{ width: '100%', padding: '16px', background: '#0976BC', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem' }}>
          Apply for B2B Account
        </button>
      </div>

    </div>
  );
}
