'use client';
import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
// import LoadingScreen from './LoadingScreen';
import RestrictedAssistantWidget from './RestrictedAssistantWidget';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const isHomePage = pathname === '/';
  const isWeyWipes = pathname === '/weywipes';

  useEffect(() => {
    const updateViewportState = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    updateViewportState();
    window.addEventListener('resize', updateViewportState);

    return () => {
      window.removeEventListener('resize', updateViewportState);
    };
  }, []);

  // 1. Initialize Lenis smooth scroll globally
  useEffect(() => {
    if (window.innerWidth < 1024) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard expo easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // keep touch device default scroll feel for responsiveness
      touchMultiplier: 2,
      infinite: false,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);
    window.lenis = lenis;

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      window.lenis = null;
    };
  }, []);

  // 2. Reset scroll position to top on route change
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  const normalizedPath = (pathname || '').toLowerCase().replace(/\/$/, '');
  const isAdminPage = normalizedPath === '/admin';
  const noPadding = isHomePage || 
                    normalizedPath === '/contact' || 
                    isWeyWipes || 
                    normalizedPath === '/oem' || 
                    normalizedPath === '/about' ||
                    normalizedPath === '/careers' ||
                    isAdminPage;

  if (isSmallScreen) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        background: '#f8fafc',
        color: '#0f172a',
        textAlign: 'center'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '520px',
          border: '1px solid rgba(15, 23, 42, 0.12)',
          borderRadius: '24px',
          background: '#ffffff',
          padding: '42px 28px',
          boxShadow: '0 24px 70px rgba(15, 23, 42, 0.10)'
        }}>
          <div style={{
            fontSize: '72px',
            lineHeight: '1',
            fontWeight: 800,
            letterSpacing: '-0.06em',
            color: '#0976bc'
          }}>
            404
          </div>
          <h1 style={{
            margin: '18px 0 10px',
            fontSize: '28px',
            lineHeight: '1.15',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#0f172a'
          }}>
            Desktop view only
          </h1>
          <p style={{
            margin: 0,
            fontSize: '15px',
            lineHeight: 1.6,
            color: '#64748b'
          }}>
            This page is currently available only on desktop screens. Please open it on a laptop or desktop browser.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        {/* <LoadingScreen /> Removed global loading screen to exclusively use Home page intro */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-base)'
        }}>
          {!isWeyWipes && !isAdminPage && <Navbar />}
          
          <main style={{ 
            flex: '1 0 auto',
            paddingTop: noPadding ? '0px' : '100px'
          }}>
            {children}
          </main>

          {!isWeyWipes && !isAdminPage && <Footer />}
          {!isWeyWipes && !isAdminPage && <RestrictedAssistantWidget />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
