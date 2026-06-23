'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Factory,
  Globe2,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
  Users
} from 'lucide-react';
import { LocationMap } from '../components/ui/expand-map';

const inquiryOptions = [
  { value: 'OEM / Private Label', team: 'OEM projects desk', eta: 'Same business day' },
  { value: 'Wholesale / B2B Supply', team: 'Wholesale sales desk', eta: 'Within 24 hours' },
  { value: 'Order, Invoice or Dispatch', team: 'Operations support', eta: 'Priority queue' },
  { value: 'Product Catalogue', team: 'Product advisory desk', eta: 'Within 24 hours' },
  { value: 'General Enquiry', team: 'Front office', eta: 'Within 24 hours' }
];

const contactPaths = [
  {
    icon: Factory,
    title: 'OEM & Private Label',
    text: 'Custom wet wipes, packaging, formula, substrate and production enquiries.',
    href: '/oem',
    accent: '#0976BC'
  },
  {
    icon: PackageCheck,
    title: 'Wholesale & Hospital Supply',
    text: 'Bulk requirements for clinics, hospitals, distributors and procurement teams.',
    href: '/register-b2b',
    accent: '#00A884'
  },
  {
    icon: Headphones,
    title: 'Order Support',
    text: 'Dispatch, invoices, delivery timelines, returns and account assistance.',
    href: 'mailto:info@bapujisurgicals.com',
    accent: '#F59E0B'
  }
];

const branches = [
  {
    state: 'Karnataka',
    city: 'Bangalore HQ',
    type: 'Corporate Office',
    address: "#301, 14th B' Cross, 7th Main, 6th Sector, HSR Layout, Bangalore - 560102",
    icon: Building2
  },
  {
    state: 'Tamil Nadu',
    city: 'Hosur',
    type: 'Manufacturing Unit',
    address: 'Sy No. 126/12, Bagalur to Berigai Main Road, Near Gudichettulu Bus Stop, Krishnagiri - 635105',
    icon: Factory
  },
  {
    state: 'Telangana',
    city: 'Hyderabad',
    type: 'Distribution Office',
    address: 'Vyshnavi Milk Ground, Shop No. 6 7, Kachiguda Road, Hyderabad - 500027',
    icon: Truck
  },
  {
    state: 'West Bengal',
    city: 'Kolkata',
    type: 'Regional Branch',
    address: '36/1E/1J, East Topsia Road, Kolkata - 700039',
    icon: MapPin
  },
  {
    state: 'Delhi NCR',
    city: 'Ghaziabad',
    type: 'North India Desk',
    address: 'E-218, Sector-17, Kavi Nagar, Ghaziabad - 201001',
    icon: Users
  },
  {
    state: 'Maharashtra',
    city: 'Mumbai',
    type: 'Regional Branch',
    address: 'Shop No. 4, 5 and 6 Part B, Ami Jharna CHS, IC Colony, Borivali West - 400103',
    icon: MapPin
  },
  {
    state: 'Kerala',
    city: 'Cochin',
    type: 'Regional Branch',
    address: 'Near Suvarna Library, 43/3384-A2, Pallissery Road, Kochi Ernakulam - 682025',
    icon: MapPin
  }
];

const responseStats = [
  { value: '< 24h', label: 'business response' },
  { value: '6+', label: 'regional support desks' },
  { value: '1980', label: 'service legacy' }
];

const routingSteps = [
  'Choose the right department',
  'Share product or order details',
  'Get routed to the right desk'
];

const createTicketId = () => `BS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: 'OEM / Private Label',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [ticketId, setTicketId] = useState('BS-2026-0000');
  const activeRoute = inquiryOptions.find((item) => item.value === formData.inquiryType) || inquiryOptions[0];

  useEffect(() => {
    setTicketId(createTicketId());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');
    setTimeout(() => {
      const submissions = JSON.parse(localStorage.getItem('bapujiContactSubmissions') || '[]');
      localStorage.setItem(
        'bapujiContactSubmissions',
        JSON.stringify([
          {
            ...formData,
            id: ticketId,
            createdAt: new Date().toISOString(),
            status: 'New'
          },
          ...submissions
        ].slice(0, 25))
      );
      setStatus('success');
      setTicketId(createTicketId());
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        inquiryType: 'OEM / Private Label',
        message: ''
      });
      setTimeout(() => setStatus(''), 4500);
    }, 850);
  };

  return (
    <main className="contact-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .contact-page {
          min-height: 100vh;
          background:
            linear-gradient(90deg, rgba(9, 118, 188, 0.055) 1px, transparent 1px),
            linear-gradient(180deg, rgba(9, 118, 188, 0.045) 1px, transparent 1px),
            linear-gradient(180deg, #f8fbff 0%, #ffffff 38%, #f6f9fc 100%);
          background-size: 72px 72px, 72px 72px, auto;
          color: #111827;
          font-family: var(--font-body), Inter, -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
        }

        .contact-shell {
          width: min(1320px, calc(100% - 32px));
          margin: 0 auto;
        }

        .contact-hero {
          position: relative;
          padding: 126px 0 42px;
        }

        .contact-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) 440px;
          gap: 24px;
          align-items: stretch;
        }

        .contact-hero-copy {
          min-height: 586px;
          border-radius: 28px;
          padding: clamp(28px, 5vw, 58px);
          background:
            linear-gradient(135deg, rgba(10, 19, 33, 0.98), rgba(11, 37, 59, 0.94)),
            linear-gradient(120deg, rgba(9, 118, 188, 0.28), rgba(0, 168, 132, 0.13));
          color: #ffffff;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 34px 90px rgba(15, 23, 42, 0.18);
        }

        .contact-hero-copy::before {
          content: '';
          position: absolute;
          inset: -30%;
          background:
            linear-gradient(115deg, transparent 0 34%, rgba(255,255,255,0.10) 34% 34.4%, transparent 34.4% 100%),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.055) 0 1px, transparent 1px 74px);
          opacity: 0.34;
          transform: rotate(-8deg);
          animation: contactDrift 16s ease-in-out infinite alternate;
        }

        .contact-hero-copy::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 160px;
          background: linear-gradient(0deg, rgba(0,0,0,0.28), transparent);
          pointer-events: none;
        }

        @keyframes contactDrift {
          from { transform: translate3d(-16px, -8px, 0) rotate(-8deg); }
          to { transform: translate3d(18px, 12px, 0) rotate(-8deg); }
        }

        .contact-kicker {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          padding: 9px 13px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.86);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
          backdrop-filter: blur(18px);
        }

        .contact-title {
          position: relative;
          z-index: 2;
          margin: 26px 0 18px;
          max-width: 920px;
          font-family: var(--font-display), Inter, sans-serif;
          font-size: clamp(3.1rem, 6.4vw, 6.15rem);
          line-height: 0.96;
          letter-spacing: 0;
          font-weight: 800;
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff;
          text-shadow: 0 18px 46px rgba(0,0,0,0.32);
        }

        .contact-description {
          position: relative;
          z-index: 2;
          max-width: 720px;
          color: rgba(255,255,255,0.84) !important;
          font-size: clamp(1rem, 1.4vw, 1.18rem);
          line-height: 1.72;
          margin: 0;
        }

        .contact-hero-actions {
          position: relative;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 32px;
        }

        .contact-btn {
          height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 999px;
          padding: 0 22px;
          text-decoration: none;
          font-weight: 800;
          font-size: 0.94rem;
          transition: transform 0.28s ease, box-shadow 0.28s ease, background 0.28s ease;
          white-space: nowrap;
        }

        .contact-btn-primary {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 18px 38px rgba(0,0,0,0.18);
        }

        .contact-btn-secondary {
          color: #ffffff;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.18);
        }

        .contact-btn:hover {
          transform: translateY(-2px);
        }

        .contact-stat-row {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 34px;
        }

        .contact-routing {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 12px;
        }

        .contact-routing-step {
          min-height: 74px;
          padding: 14px;
          border-radius: 18px;
          background: rgba(255,255,255,0.075);
          border: 1px solid rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.84) !important;
          font-size: 0.82rem;
          font-weight: 800;
          line-height: 1.35;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .contact-routing-step strong {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(255,255,255,0.14);
          color: #ffffff;
          font-size: 0.76rem;
        }

        .contact-stat {
          padding: 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.13);
          border: 1px solid rgba(255,255,255,0.16);
          backdrop-filter: blur(14px);
        }

        .contact-stat strong {
          display: block;
          font-size: 1.35rem;
          line-height: 1;
          color: #ffffff !important;
        }

        .contact-stat span {
          display: block;
          margin-top: 7px;
          color: rgba(255,255,255,0.70) !important;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0;
        }

        .contact-form-panel {
          border-radius: 28px;
          padding: 22px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(148,163,184,0.22);
          box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
          backdrop-filter: blur(22px);
          animation: contactRise 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
          align-self: stretch;
        }

        @keyframes contactRise {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .contact-form-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          padding: 8px 6px 20px;
        }

        .contact-form-title {
          margin: 0;
          font-size: 1.35rem;
          letter-spacing: 0;
          font-weight: 900;
          color: #111827 !important;
        }

        .contact-form-text {
          margin: 6px 0 0;
          color: #64748b !important;
          line-height: 1.55;
          font-size: 0.9rem;
        }

        .contact-ticket {
          flex: 0 0 auto;
          padding: 8px 11px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #00875f;
          font-size: 0.72rem;
          font-weight: 900;
        }

        .contact-form {
          display: grid;
          gap: 14px;
        }

        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .contact-field {
          display: grid;
          gap: 7px;
        }

        .contact-field label {
          color: #475569 !important;
          font-size: 0.76rem;
          font-weight: 900;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .contact-input,
        .contact-select,
        .contact-textarea {
          width: 100%;
          border: 1px solid rgba(148,163,184,0.28);
          background: rgba(248,250,252,0.86);
          color: #0f172a !important;
          border-radius: 17px;
          padding: 15px 16px;
          outline: none;
          font: inherit;
          font-size: 0.95rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          box-sizing: border-box;
        }

        .route-preview {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 12px;
          align-items: center;
          padding: 13px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(9,118,188,0.08), rgba(0,168,132,0.08));
          border: 1px solid rgba(9,118,188,0.12);
        }

        .route-preview-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          color: #0976BC;
          background: rgba(255,255,255,0.82);
        }

        .route-preview strong {
          display: block;
          font-size: 0.9rem;
          color: #0f172a;
        }

        .route-preview span {
          display: block;
          margin-top: 3px;
          color: #64748b !important;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .contact-textarea {
          min-height: 128px;
          resize: vertical;
        }

        .contact-input:focus,
        .contact-select:focus,
        .contact-textarea:focus {
          border-color: rgba(9,118,188,0.72);
          background: #ffffff;
          box-shadow: 0 0 0 5px rgba(9,118,188,0.08);
        }

        .contact-submit {
          height: 56px;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, #0976BC, #00A884);
          color: #ffffff;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 18px 38px rgba(9,118,188,0.20);
          transition: transform 0.28s ease, filter 0.28s ease;
        }

        .contact-submit:hover {
          transform: translateY(-2px);
          filter: saturate(1.08);
        }

        .contact-submit:disabled {
          cursor: wait;
          opacity: 0.72;
          transform: none;
        }

        .contact-success {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 13px 14px;
          border-radius: 18px;
          background: #ecfdf5;
          color: #047857;
          border: 1px solid rgba(16,185,129,0.16);
          font-size: 0.88rem;
          font-weight: 800;
        }

        .contact-paths {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 16px;
        }

        .contact-path {
          min-height: 190px;
          padding: 22px;
          border-radius: 26px;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(148,163,184,0.18);
          text-decoration: none;
          color: #0f172a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 18px 50px rgba(15,23,42,0.07);
          transition: transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease;
        }

        .contact-path:hover {
          transform: translateY(-4px);
          border-color: rgba(9,118,188,0.24);
          box-shadow: 0 24px 60px rgba(15,23,42,0.11);
        }

        .contact-path-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          color: #ffffff;
        }

        .contact-path h3 {
          margin: 20px 0 8px;
          font-size: 1.05rem;
          letter-spacing: 0;
        }

        .contact-path p {
          margin: 0;
          color: #64748b;
          line-height: 1.55;
          font-size: 0.9rem;
        }

        .contact-path span {
          margin-top: 18px;
          color: #0976BC;
          font-size: 0.84rem;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .contact-section {
          padding: 58px 0 0;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 20px;
        }

        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #0976BC;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .section-heading h2 {
          margin: 10px 0 0;
          font-size: clamp(2rem, 4vw, 3.65rem);
          line-height: 1;
          letter-spacing: 0;
          font-weight: 900;
        }

        .section-heading p {
          max-width: 430px;
          margin: 0;
          color: #64748b;
          line-height: 1.65;
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .contact-detail-card {
          padding: 24px;
          border-radius: 26px;
          background: #ffffff;
          border: 1px solid rgba(148,163,184,0.18);
          box-shadow: 0 18px 55px rgba(15,23,42,0.06);
        }

        .contact-detail-card h3 {
          margin: 14px 0 8px;
          font-size: 1.04rem;
          letter-spacing: 0;
        }

        .contact-detail-card p,
        .contact-detail-card a {
          color: #64748b;
          line-height: 1.62;
          text-decoration: none;
          font-size: 0.94rem;
        }

        .contact-detail-card a:hover {
          color: #0976BC;
        }

        .detail-icon {
          width: 44px;
          height: 44px;
          border-radius: 15px;
          display: grid;
          place-items: center;
          background: #eef7ff;
          color: #0976BC;
        }

        .map-card {
          margin-top: 18px;
          padding: 22px;
          border-radius: 32px;
          background: linear-gradient(135deg, #ffffff, #f4f9ff);
          border: 1px solid rgba(148,163,184,0.2);
          box-shadow: 0 20px 70px rgba(15,23,42,0.08);
          display: grid;
          grid-template-columns: minmax(260px, 0.56fr) minmax(0, 1.44fr);
          gap: 24px;
          align-items: center;
          overflow: hidden;
        }

        .map-copy {
          padding: 24px 8px 24px 6px;
        }

        .map-visual {
          min-width: 0;
        }

        .map-copy h3 {
          margin: 0 0 10px;
          font-size: 1.45rem;
          letter-spacing: 0;
        }

        .map-copy p {
          margin: 0 0 18px;
          color: #64748b;
          line-height: 1.65;
        }

        .map-copy a {
          text-decoration: none;
          width: fit-content;
        }

        .branch-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .branch-card {
          position: relative;
          padding: 20px;
          border-radius: 24px;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(148,163,184,0.18);
          box-shadow: 0 16px 44px rgba(15,23,42,0.055);
          overflow: hidden;
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }

        .branch-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(9,118,188,0.09), transparent 38%);
          opacity: 0;
          transition: opacity 0.28s ease;
        }

        .branch-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 24px 64px rgba(15,23,42,0.09);
        }

        .branch-card:hover::before {
          opacity: 1;
        }

        .branch-card > * {
          position: relative;
          z-index: 1;
        }

        .branch-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 18px;
        }

        .branch-icon {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #0976BC;
        }

        .branch-state {
          color: #0976BC;
          background: #eef7ff;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 0.72rem;
          font-weight: 900;
        }

        .branch-card h3 {
          margin: 0 0 5px;
          font-size: 1.08rem;
          letter-spacing: 0;
        }

        .branch-type {
          color: #00A884;
          font-size: 0.78rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0;
        }

        .branch-address {
          margin: 12px 0 0;
          color: #64748b;
          line-height: 1.58;
          font-size: 0.9rem;
        }

        @media (max-width: 1020px) {
          .contact-hero-grid,
          .map-card {
            grid-template-columns: 1fr;
          }

          .map-copy {
            padding: 8px 4px 0;
          }

          .contact-hero-copy {
            min-height: 520px;
          }

          .contact-paths,
          .branch-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 720px) {
          .contact-shell {
            width: min(100% - 24px, 1320px);
          }

          .contact-hero {
            padding-top: 104px;
          }

          .contact-hero-copy,
          .contact-form-panel,
          .map-card {
            border-radius: 24px;
          }

          .contact-hero-copy {
            min-height: auto;
            padding: 28px;
          }

          .contact-title {
            font-size: clamp(3rem, 16vw, 4.4rem);
          }

          .contact-stat-row,
          .contact-routing,
          .contact-info-grid,
          .contact-paths,
          .branch-grid,
          .field-grid {
            grid-template-columns: 1fr;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .contact-form-top {
            flex-direction: column;
          }
        }
      `}} />

      <section className="contact-hero">
        <div className="contact-shell">
          <div className="contact-hero-grid">
            <div className="contact-hero-copy">
              <div>
                <span className="contact-kicker">
                  <Sparkles size={14} />
                  Bapuji Surgicals Support Desk
                </span>
                <h1 className="contact-title">Contact Bapuji Surgicals</h1>
                <p className="contact-description">
                  Fast support for OEM wet wipes manufacturing, wholesale hospital supply, invoices, dispatch updates and regional procurement coordination across India.
                </p>
                <div className="contact-hero-actions">
                  <a href="tel:+919379919832" className="contact-btn contact-btn-primary">
                    <Phone size={17} /> Call now
                  </a>
                  <a href="mailto:info@bapujisurgicals.com" className="contact-btn contact-btn-secondary">
                    <Mail size={17} /> Email support
                  </a>
                </div>
              </div>

              <div className="contact-stat-row">
                {responseStats.map((stat) => (
                  <div className="contact-stat" key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="contact-routing">
                {routingSteps.map((step, index) => (
                  <div className="contact-routing-step" key={step}>
                    <strong>{index + 1}</strong>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="contact-form-panel">
              <div className="contact-form-top">
                <div>
                  <h2 className="contact-form-title">Send a message</h2>
                  <p className="contact-form-text">Create a clean support request with the details our team needs.</p>
                </div>
                <span className="contact-ticket">{ticketId}</span>
              </div>

              {status === 'success' && (
                <div className="contact-success">
                  <CheckCircle2 size={18} />
                  <span>Message captured. Our team will contact you shortly.</span>
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="field-grid">
                  <div className="contact-field">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" className="contact-input" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="company">Company</label>
                    <input id="company" name="company" className="contact-input" value={formData.company} onChange={handleChange} placeholder="Hospital / company" />
                  </div>
                </div>

                <div className="field-grid">
                  <div className="contact-field">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" className="contact-input" value={formData.email} onChange={handleChange} placeholder="name@company.com" required />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" type="tel" name="phone" className="contact-input" value={formData.phone} onChange={handleChange} placeholder="+91" />
                  </div>
                </div>

                <div className="contact-field">
                  <label htmlFor="inquiryType">Department</label>
                  <select id="inquiryType" name="inquiryType" className="contact-select" value={formData.inquiryType} onChange={handleChange}>
                    {inquiryOptions.map((item) => (
                      <option key={item.value}>{item.value}</option>
                    ))}
                  </select>
                </div>

                <div className="route-preview">
                  <div className="route-preview-icon">
                    <ShieldCheck size={19} />
                  </div>
                  <div>
                    <strong>Routes to {activeRoute.team}</strong>
                    <span>Expected response: {activeRoute.eta}</span>
                  </div>
                </div>

                <div className="contact-field">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" className="contact-textarea" value={formData.message} onChange={handleChange} placeholder="Tell us what you need, expected quantity, delivery city, or order ID." required />
                </div>

                <button className="contact-submit" type="submit" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending request...' : 'Send request'}
                  <Send size={17} />
                </button>
              </form>
            </aside>
          </div>

          <div className="contact-paths">
            {contactPaths.map((item) => {
              const Icon = item.icon;
              const CardTag = item.href.startsWith('mailto:') ? 'a' : Link;
              const cardProps = item.href.startsWith('mailto:')
                ? { href: item.href }
                : { href: item.href };

              return (
                <CardTag className="contact-path" key={item.title} {...cardProps}>
                  <div>
                    <div className="contact-path-icon" style={{ background: `linear-gradient(135deg, ${item.accent}, #0f172a)` }}>
                      <Icon size={22} />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                  <span>Open route <ArrowRight size={14} /></span>
                </CardTag>
              );
            })}
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-shell">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow"><ShieldCheck size={15} /> Direct contact channels</span>
              <h2>Reach the right desk faster.</h2>
            </div>
            <p>For urgent dispatch, invoice, OEM and procurement enquiries, use the direct phone or email routes below.</p>
          </div>

          <div className="contact-info-grid">
            <div className="contact-detail-card">
              <div className="detail-icon"><MapPin size={21} /></div>
              <h3>Corporate Office</h3>
              <p>#301, 14th B' Cross, 7th Main, 6th Sector, HSR Layout, Bangalore - 560102, Karnataka, India</p>
            </div>
            <div className="contact-detail-card">
              <div className="detail-icon"><Phone size={21} /></div>
              <h3>Phone Support</h3>
              <p><a href="tel:+918041600320">+91 80-41600320</a><br /><a href="tel:+919379919832">+91 9379919832</a></p>
            </div>
            <div className="contact-detail-card">
              <div className="detail-icon"><Mail size={21} /></div>
              <h3>Email Desk</h3>
              <p><a href="mailto:info@bapujisurgicals.com">info@bapujisurgicals.com</a><br />For order, invoice, catalogue and OEM coordination.</p>
            </div>
            <div className="contact-detail-card">
              <div className="detail-icon"><Clock3 size={21} /></div>
              <h3>Working Hours</h3>
              <p>Monday to Friday: 09:00 AM to 07:00 PM IST<br />Saturday and Sunday: Closed</p>
            </div>
          </div>

          <div className="map-card">
            <div className="map-copy">
              <span className="section-eyebrow"><Globe2 size={15} /> Headquarters location</span>
              <h3>Bapuji Surgicals, HSR Layout</h3>
              <p>Use the interactive map to locate the corporate office or open the location directly in Google Maps.</p>
              <a href="https://maps.app.goo.gl/K41f2A6crZF7owMZ9" target="_blank" rel="noopener noreferrer" className="contact-btn contact-btn-primary">
                Open in Google Maps <ArrowRight size={16} />
              </a>
            </div>
            <div className="map-visual">
              <LocationMap location="Bapuji Surgicals" coordinates="12.9145 N, 77.6333 E" />
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" style={{ paddingBottom: '90px' }}>
        <div className="contact-shell">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow"><MessageCircle size={15} /> Regional network</span>
              <h2>Branch offices and production support.</h2>
            </div>
            <p>Regional desks help with stock movement, hospital supply coordination and manufacturing handovers.</p>
          </div>

          <div className="branch-grid">
            {branches.map((branch) => {
              const Icon = branch.icon;
              return (
                <article className="branch-card" key={`${branch.city}-${branch.state}`}>
                  <div className="branch-top">
                    <div className="branch-icon"><Icon size={19} /></div>
                    <span className="branch-state">{branch.state}</span>
                  </div>
                  <h3>{branch.city}</h3>
                  <div className="branch-type">{branch.type}</div>
                  <p className="branch-address">{branch.address}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
