'use client';
import React, { useEffect } from 'react';
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
  const isHomePage = pathname === '/';
  const isWeyWipes = pathname === '/weywipes';

  // 1. Initialize Lenis smooth scroll globally
  useEffect(() => {
    if (window.innerWidth < 768) {
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
