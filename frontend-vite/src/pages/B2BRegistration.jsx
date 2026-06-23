import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Upload, Building, FileText, CheckCircle2, ShieldAlert, X, Lock, MapPin, User } from 'lucide-react';

const B2BRegistration = () => {
  const { registerB2B } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstinOrTaxId, setGstinOrTaxId] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentFile) {
      setError('Please upload a valid drug license or corporate registry document.');
      return;
    }
    
    setError('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('companyName', companyName);
    formData.append('gstinOrTaxId', gstinOrTaxId);
    formData.append('document', documentFile);

    // Structure address
    const address = { street, city, state, zipCode, country: 'India' };
    formData.append('shippingAddress', JSON.stringify(address));

    try {
      await registerB2B(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      setError(err.message || 'B2B Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '24px' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.03)',
          padding: '48px 40px',
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#e6f4ea',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e7e34',
            marginBottom: '8px'
          }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em', margin: 0 }}>Application Submitted</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.98rem', margin: 0 }}>
            Thank you for applying to the Bapuji Surgicals Wholesaler Program. We have received your registration details and drug license / GSTIN documents.
          </p>
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '20px',
            borderRadius: '16px',
            fontSize: '0.88rem',
            lineHeight: '1.5',
            color: '#64748b',
            textAlign: 'left'
          }}>
            Our administrative compliance officers will review your documents within 24-48 business hours. You will receive an email verification update once your wholesale account status is unlocked.
          </div>
          <span style={{ fontSize: '0.85rem', color: '#0976BC', fontWeight: 600 }}>Redirecting to Login portal in a few seconds...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="b2b-split-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .b2b-split-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
          font-family: var(--font-display), system-ui, sans-serif;
        }

        .b2b-brand-panel {
          width: 40%;
          background: linear-gradient(135deg, #032b45 0%, #0976BC 100%);
          padding: 60px 48px;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        .b2b-brand-panel::before {
          content: '';
          position: absolute;
          top: -20%;
          right: -20%;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          filter: blur(40px);
        }

        .b2b-brand-logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }

        .b2b-brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #eaf5fc;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .b2b-brand-badge::before {
          content: '';
          display: inline-block;
          width: 3px;
          height: 12px;
          background-color: #38bdf8;
          border-radius: 2px;
        }

        .b2b-brand-title {
          font-size: clamp(2rem, 3vw, 2.8rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.25;
          margin: 20px 0;
          color: #ffffff;
        }

        .b2b-brand-desc {
          font-size: 1.05rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 48px;
        }

        .b2b-benefit-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .b2b-benefit-card {
          display: flex;
          gap: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        .b2b-benefit-card:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .b2b-benefit-icon-wrapper {
          color: #38bdf8;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: rgba(56, 189, 248, 0.1);
          border-radius: 12px;
        }

        .b2b-benefit-info h4 {
          font-size: 1.05rem;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: #ffffff;
        }

        .b2b-benefit-info p {
          font-size: 0.88rem;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .b2b-compliance-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 60px;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          background: rgba(0, 0, 0, 0.15);
          padding: 12px 20px;
          border-radius: 30px;
          align-self: flex-start;
        }

        .b2b-form-panel {
          width: 60%;
          background-color: #ffffff;
          padding: 80px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-sizing: border-box;
        }

        .b2b-form-container {
          max-width: 680px;
          width: 100%;
          margin: 0 auto;
        }

        .b2b-form-header {
          margin-bottom: 40px;
        }

        .b2b-form-header h2 {
          font-size: 2.2rem;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.03em;
          margin-bottom: 12px;
        }

        .b2b-form-header p {
          color: var(--text-secondary);
          font-size: 1.02rem;
          line-height: 1.5;
          margin: 0;
        }

        .b2b-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .b2b-form-row {
          margin-bottom: 24px;
        }

        .b2b-form-col-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .b2b-form-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-bottom: 8px;
        }

        .b2b-input-modern {
          width: 100%;
          padding: 14px 16px;
          font-size: 0.95rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background-color: #f8fafc;
          color: #1a1a1a;
          transition: all 0.3s ease;
          box-sizing: border-box;
          font-family: inherit;
          outline: none;
        }
        .b2b-input-modern:focus {
          border-color: #0976BC;
          background-color: #ffffff;
          box-shadow: 0 0 0 4px rgba(9, 118, 188, 0.08);
        }

        .b2b-form-section-title {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #0976BC;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 8px;
          margin: 32px 0 20px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .b2b-upload-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 36px 24px;
          background-color: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          box-sizing: border-box;
          width: 100%;
        }
        .b2b-upload-dropzone:hover {
          border-color: #0976BC;
          background-color: rgba(9, 118, 188, 0.02);
        }

        .b2b-upload-icon-wrapper {
          color: #64748b;
          margin-bottom: 12px;
          transition: color 0.3s ease;
        }
        .b2b-upload-dropzone:hover .b2b-upload-icon-wrapper {
          color: #0976BC;
        }

        .b2b-upload-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .b2b-upload-desc {
          font-size: 0.8rem;
          color: #64748b;
        }

        .b2b-file-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          margin-top: 12px;
          box-sizing: border-box;
          width: 100%;
        }

        .b2b-file-info {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #166534;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .b2b-file-remove-btn {
          background: none;
          border: none;
          color: #166534;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          transition: background-color 0.2s;
          outline: none;
        }
        .b2b-file-remove-btn:hover {
          background-color: #dcfce7;
        }

        .b2b-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 52px;
          background-color: #0976BC;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 32px;
          outline: none;
        }
        .b2b-submit-btn:hover:not(:disabled) {
          background-color: #1a1a1a;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
        }
        .b2b-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 1024px) {
          .b2b-split-container {
            flex-direction: column;
          }
          .b2b-brand-panel, .b2b-form-panel {
            width: 100%;
          }
          .b2b-brand-panel {
            padding: 60px 32px;
          }
          .b2b-form-panel {
            padding: 60px 32px 80px 32px;
          }
        }

        @media (max-width: 600px) {
          .b2b-form-grid, .b2b-form-col-3 {
            grid-template-columns: 1fr;
          }
        }
      `}} />

      {/* Left panel */}
      <div className="b2b-brand-panel">
        <div>
          <div className="b2b-brand-logo-container">
            <span className="b2b-brand-badge">B2B Program</span>
          </div>
          <h1 className="b2b-brand-title">Register your B2B account</h1>
          <p className="b2b-brand-desc">
            Unlock clinical contract manufacturing rates, volume-tiered discounts, and seamless proforma invoicing for your medical establishment.
          </p>

          <div className="b2b-benefit-list">
            <div className="b2b-benefit-card">
              <div className="b2b-benefit-icon-wrapper">
                <Building size={20} />
              </div>
              <div className="b2b-benefit-info">
                <h4>Wholesale pricing</h4>
                <p>Access direct manufacturer costs and tiered wholesaler quotes on bulk packages automatically.</p>
              </div>
            </div>

            <div className="b2b-benefit-card">
              <div className="b2b-benefit-icon-wrapper">
                <FileText size={20} />
              </div>
              <div className="b2b-benefit-info">
                <h4>Net 30 Credit terms</h4>
                <p>Upload Purchase Orders to place orders on credit with structured 30-day bank settlement terms.</p>
              </div>
            </div>

            <div className="b2b-benefit-card">
              <div className="b2b-benefit-icon-wrapper">
                <ShieldCheck size={20} />
              </div>
              <div className="b2b-benefit-info">
                <h4>Verified compliance</h4>
                <p>Tax-compliant invoicing (GST reporting) paired with Class 100 ISO cleanroom certifications.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="b2b-compliance-badge">
          <CheckCircle2 size={16} style={{ color: '#38bdf8' }} />
          <span>Class 100 / ISO 13485 sterile dispatch validated.</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="b2b-form-panel">
        <div className="b2b-form-container">
          <div className="b2b-form-header">
            <h2>Apply for Wholesaler Credentials</h2>
            <p>Complete the B2B verification form to unlock contract access.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="b2b-form-section-title">
              <Building size={16} />
              <span>Corporate Details</span>
            </div>

            <div className="b2b-form-grid">
              <div className="form-group">
                <label className="b2b-form-label">Company / Hospital Name</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="b2b-input-modern" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="b2b-form-label">GSTIN / Tax ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. 29AAAAA0000A1Z5"
                  value={gstinOrTaxId}
                  onChange={(e) => setGstinOrTaxId(e.target.value)}
                  className="b2b-input-modern" 
                  required 
                />
              </div>
            </div>

            <div className="b2b-form-section-title">
              <User size={16} />
              <span>Account Manager</span>
            </div>

            <div className="b2b-form-grid">
              <div className="form-group">
                <label className="b2b-form-label">Contact Person Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="b2b-input-modern" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="b2b-form-label">Official Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="b2b-input-modern" 
                  required 
                />
              </div>
            </div>

            <div className="b2b-form-row">
              <label className="b2b-form-label">Secure Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="b2b-input-modern" 
                  required 
                />
              </div>
            </div>

            <div className="b2b-form-section-title">
              <MapPin size={16} />
              <span>Registered Address</span>
            </div>

            <div className="b2b-form-row">
              <label className="b2b-form-label">Street Address</label>
              <input 
                type="text" 
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="b2b-input-modern" 
                required 
              />
            </div>

            <div className="b2b-form-col-3">
              <div className="form-group">
                <label className="b2b-form-label">City</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="b2b-input-modern" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="b2b-form-label">State</label>
                <input 
                  type="text" 
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="b2b-input-modern" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="b2b-form-label">PIN Code</label>
                <input 
                  type="text" 
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="b2b-input-modern" 
                  required 
                />
              </div>
            </div>

            <div className="b2b-form-section-title">
              <Upload size={16} />
              <span>Credentials Upload</span>
            </div>

            <div className="b2b-form-row">
              <label className="b2b-form-label">Drug License / Business Registry Document</label>
              
              <input 
                type="file" 
                id="b2b-file-upload"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                style={{ display: 'none' }}
                required={!documentFile}
              />

              {!documentFile ? (
                <label htmlFor="b2b-file-upload" className="b2b-upload-dropzone">
                  <div className="b2b-upload-icon-wrapper">
                    <Upload size={28} />
                  </div>
                  <span className="b2b-upload-title">Click to upload credentials</span>
                  <span className="b2b-upload-desc">PDF, JPG, PNG or DOCX (Max 10MB)</span>
                </label>
              ) : (
                <div className="b2b-file-card">
                  <div className="b2b-file-info">
                    <FileText size={18} style={{ color: '#166534' }} />
                    <span>{documentFile.name}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setDocumentFile(null)}
                    className="b2b-file-remove-btn"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div style={{ color: 'var(--accent)', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '20px', background: 'rgba(220, 53, 69, 0.05)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(220, 53, 69, 0.15)' }}>
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={submitting}
              className="b2b-submit-btn"
            >
              {submitting ? 'Submitting Application...' : 'Apply for Wholesaler Credentials'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default B2BRegistration;
