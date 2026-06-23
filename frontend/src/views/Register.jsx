'use client';
import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, MapPin, ShieldAlert } from 'lucide-react';

const Register = () => {
  const { registerB2C, user  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push(redirect ? `/${redirect}` : '/');
    }
  }, [user, router, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const shippingAddress = { street, city, state, zipCode, country: 'India' };
      await registerB2C({ name, email, password, shippingAddress });
    } catch (err) {
      setError(err.message || 'Registration failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px 100px 24px', maxWidth: '520px' }}>
      <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign up to buy cotton dressings and surgical protective gear directly.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} /> Full Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input" 
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} /> Email Address
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input" 
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} /> Secure Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input" 
              required 
            />
          </div>

          {/* Delivery fields */}
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px', marginTop: '10px' }}>
            Delivery Location
          </h3>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} /> Street Address
            </label>
            <input 
              type="text" 
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="form-input" 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">City</label>
              <input 
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-input" 
                required 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">State</label>
              <input 
                type="text" 
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="form-input" 
                required 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">ZIP / PIN Code</label>
            <input 
              type="text" 
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="form-input" 
              required 
            />
          </div>

          {error && (
            <div style={{ color: 'var(--accent)', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <ShieldAlert size={14} /> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={submitting}
            className="btn btn-primary glow-hover" 
            style={{ width: '100%', height: '48px', marginTop: '10px' }}
          >
            {submitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--secondary)', fontWeight: 600 }}>
            Sign In
          </Link>
          <div style={{ marginTop: '10px' }}>
            Are you a Hospital or Clinic buyer?{' '}
            <Link href="/register-b2b" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
              Register for Wholesaler Discounts
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
