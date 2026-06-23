'use client';
import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

const Login = () => {
  const { login, user  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      await login(email, password);
      // navigation is handled by useEffect
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '80px 24px', maxWidth: '480px' }}>
      <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to manage your medical orders & B2B profiles.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
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
              <Lock size={14} /> Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {submitting ? 'Verifying Account...' : 'Sign In'}
          </button>
        </form>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: 'var(--secondary)', fontWeight: 600 }}>
            Sign Up (B2C Customers)
          </Link>
          <div style={{ marginTop: '10px' }}>
            Are you a medical buyer?{' '}
            <Link href="/register-b2b" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
              Apply for Wholesaler Portal
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
