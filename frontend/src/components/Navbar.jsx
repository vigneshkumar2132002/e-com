'use client';
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { User as UserIcon, Shield, Layers, LogOut, X, ShoppingCart } from 'lucide-react';
import { MenuToggle } from '@/components/ui/menu-toggle';

const Navbar = () => {
  const { user, logout  } = useAuth();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const router = useRouter();
  const pathname = usePathname();
  const location = { pathname };

  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let frameId;
    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 18);
    };
    const handleScroll = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      frameId = requestAnimationFrame(updateScrollState);
    };
    const normalizedPath = (location.pathname || '').toLowerCase().replace(/\/$/, '');
    if (normalizedPath === '' || normalizedPath === '/contact' || normalizedPath === '/oem' || normalizedPath === '/catalog' || normalizedPath === '/about' || normalizedPath === '/careers' || normalizedPath === '/register-b2b') {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    } else {
      frameId = requestAnimationFrame(() => setIsScrolled(true));
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [location.pathname]);

  // Close mega menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMegaOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Manage body scroll lock and main content blur when mega menu is open
  useEffect(() => {
    if (isMegaOpen) {
      document.body.style.overflow = 'hidden';
      // Apply blur to main layout content
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.style.transition = 'filter 0.4s ease';
        mainEl.style.filter = 'blur(6px)';
      }
    } else {
      document.body.style.overflow = 'unset';
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.style.filter = 'none';
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.style.filter = 'none';
      }
    };
  }, [isMegaOpen]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleFaqClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById('faq');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleReviewsClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById('reviews');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isApprovedB2B = user && user.role === 'b2b' && user.b2bProfile?.verificationStatus === 'approved';
  const isPendingB2B = user && user.role === 'b2b' && user.b2bProfile?.verificationStatus === 'pending';

  const normalizedPath = (location.pathname || '').toLowerCase().replace(/\/$/, '');
  const isLightPage = normalizedPath === '/contact' || normalizedPath === '/oem' || normalizedPath === '/catalog' || normalizedPath === '/about';
  const hasOriginalLogoBeforeScroll = normalizedPath === '/contact' || normalizedPath === '/catalog' || normalizedPath === '/oem' || normalizedPath === '/about';

  return (
    <>
      {/* Floating Superpower-style Navbar */}
      <div className={`wey-navbar-stage ${isScrolled ? 'is-scrolled' : ''}`}>
        <nav className={`wey-navbar-container ${isScrolled ? 'is-scrolled' : ''} ${isLightPage ? 'is-light-nav' : ''} ${hasOriginalLogoBeforeScroll ? 'has-original-logo-before-scroll' : ''}`}>
          
          {/* Left Section: Small Nav Links (hidden on mobile) */}
          <div className="wey-navbar-left">
            <Link href="/" className="wey-navbar-link">Home</Link>
            <Link href="/about" className="wey-navbar-link">About</Link>
            <Link href="/catalog" className="wey-navbar-link">Products</Link>
            <Link href="/oem" className="wey-navbar-link">OEM</Link>
            <Link href="/contact" className="wey-navbar-link">Contact</Link>
          </div>

          <div className="wey-navbar-logo-wrapper">
            <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <img loading="lazy" src="/img/bapuji logo.png" 
                alt="Bapuji Surgicals Logo" 
                className="wey-logo-img"
              />
            </Link>
          </div>

          {/* Right Section: Login and CTA */}
          <div className="wey-navbar-right">
            <Link href="/register-b2b" className="wey-navbar-cta">
              B2B Service
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="wey-navbar-login" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  minWidth: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Status / Login */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {isApprovedB2B && (
                  <span className="badge badge-approved" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    B2B
                  </span>
                )}
                {user.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="wey-navbar-link"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
                  >
                    <Shield size={13} /> Admin
                  </Link>
                )}
                <Link 
                  href="/profile" 
                  className="wey-navbar-login"
                  aria-label="Open profile"
                  title="Profile"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <UserIcon size={21} strokeWidth={2} />
                </Link>
              </div>
            ) : (
              <Link href="/login" className="wey-navbar-login">
                Log in
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Cart Icon - Absolutely positioned to avoid breaking grid-btn CSS */}
        <div className="mobile-cart-wrapper">
          <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: isScrolled ? '#fff' : '#111' }}>
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-8px',
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '9px',
                fontWeight: 'bold',
                borderRadius: '50%',
                minWidth: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          .mobile-cart-wrapper {
            display: none;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 64px;
            z-index: 50;
            pointer-events: auto;
          }
          @media (max-width: 1024px) {
            .mobile-cart-wrapper {
              display: flex;
              right: 72px;
            }
            .hide-on-mobile {
              display: none !important;
            }
            .show-on-mobile {
              display: flex !important;
              align-items: center;
              justify-content: center;
            }
          }
          .show-on-mobile {
            display: none;
          }
          @media (max-width: 480px) {
            .mobile-cart-wrapper {
              right: 66px;
            }
          }
        `}} />

        {/* Separate Grid Menu Trigger Button */}
        <div className="wey-navbar-grid-btn">
          <MenuToggle 
            open={isMegaOpen} 
            onOpenChange={setIsMegaOpen}
            className="size-11" 
            stroke={isScrolled ? '#ffffff' : '#111111'}
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Backdrop overlay behind mega menu */}
      {isMegaOpen && (
        <div 
          className="wey-mega-backdrop"
          onClick={() => setIsMegaOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 110
          }}
        />
      )}

      {/* Fullscreen Floating Mega Menu */}
      <div className={`wey-mega-menu ${isMegaOpen ? 'is-open' : ''}`}>
        
        {/* Top Row */}
        <div className="wey-mega-top">
          {user ? (
            <div className="wey-mega-user-left">
              <Link href="/profile" className="wey-mega-user-profile-link hide-on-mobile" style={{ textTransform: 'capitalize' }} onClick={() => setIsMegaOpen(false)}>
                Hi, {user.name.split(' ')[0]}
              </Link>
              <button 
                onClick={() => { setIsMegaOpen(false); handleLogout(); }} 
                className="wey-mega-user-logout-btn hide-on-mobile"
              >
                Log out
              </button>
              <Link href="/profile" className="show-on-mobile wey-mega-user-icon-mobile" onClick={() => setIsMegaOpen(false)}>
                <UserIcon size={24} color="#000" />
              </Link>
            </div>
          ) : (
            <div className="wey-mega-title">Menu</div>
          )}
          <div className="wey-mega-top-actions">
            {!user && (
              <Link href="/login" className="wey-mega-login" onClick={() => setIsMegaOpen(false)}>
                Log in
              </Link>
            )}
            
            <Link href="/register-b2b" className="wey-mega-cta" onClick={() => setIsMegaOpen(false)}>
              Become a partner
            </Link>
            
            <button 
              className="wey-mega-close-btn" 
              onClick={() => setIsMegaOpen(false)}
              aria-label="Close Mega Menu"
            >
              <X className="wey-mega-close-x" />
            </button>
          </div>
        </div>

        {/* Main Menu Links (Large Typography) */}
        <div className="wey-mega-links-container">
          <Link href="/" className="wey-mega-link" onClick={() => setIsMegaOpen(false)}>Home</Link>
          <Link href="/about" className="wey-mega-link" onClick={() => setIsMegaOpen(false)}>About</Link>
          <Link href="/catalog" className="wey-mega-link" onClick={() => setIsMegaOpen(false)}>Products</Link>
          <Link href="/oem" className="wey-mega-link" onClick={() => setIsMegaOpen(false)}>OEM Services</Link>
          <Link href="/register-b2b" className="wey-mega-link" onClick={() => setIsMegaOpen(false)}>B2B Services</Link>
          <Link href="/contact" className="wey-mega-link" onClick={() => setIsMegaOpen(false)}>Contact</Link>
        </div>

        {/* Mobile Quick Actions (Visible only on mobile) */}
        <div className="wey-mega-mobile-actions show-on-mobile" style={{ flexDirection: 'column', gap: '12px', marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.1)', width: '100%', alignItems: 'flex-start' }}>
          <a href="tel:+1234567890" className="wey-mega-col-link" style={{ fontSize: '16px', fontWeight: '600' }} onClick={() => setIsMegaOpen(false)}>Call Now</a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="wey-mega-col-link" style={{ fontSize: '16px', fontWeight: '600' }} onClick={() => setIsMegaOpen(false)}>WhatsApp</a>
          <Link href="/oem" className="wey-mega-col-link" style={{ fontSize: '16px', fontWeight: '600' }} onClick={() => setIsMegaOpen(false)}>Get Quote</Link>
        </div>

        {/* Bottom Columns */}
        <div className="wey-mega-bottom">
          <div className="wey-mega-col">
            <div className="wey-mega-col-title">Industries</div>
            <Link href="/catalog?category=baby" className="wey-mega-col-link" onClick={() => setIsMegaOpen(false)}>Baby care</Link>
            <Link href="/catalog?category=gym" className="wey-mega-col-link" onClick={() => setIsMegaOpen(false)}>Gym wipes</Link>
            <Link href="/catalog?category=hospital" className="wey-mega-col-link" onClick={() => setIsMegaOpen(false)}>Hospital wipes</Link>
            <Link href="/catalog?category=beauty" className="wey-mega-col-link" onClick={() => setIsMegaOpen(false)}>Beauty wipes</Link>
          </div>

          <div className="wey-mega-col">
            <div className="wey-mega-col-title">Company</div>
            <Link href="/careers" className="wey-mega-col-link" onClick={() => setIsMegaOpen(false)}>Careers</Link>
            <Link href="/contact" className="wey-mega-col-link" onClick={() => setIsMegaOpen(false)}>Contact</Link>
            <Link href="/catalog" className="wey-mega-col-link" onClick={() => setIsMegaOpen(false)}>Blog</Link>
          </div>
        </div>

      </div>
    </>
  );
};

export default Navbar;

