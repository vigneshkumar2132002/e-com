import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User as UserIcon, Shield, Layers, LogOut, X } from 'lucide-react';
import { MenuToggle } from '@/components/ui/MenuToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 18);
    };
    const normalizedPath = location.pathname.toLowerCase().replace(/\/$/, '');
    if (normalizedPath === '' || normalizedPath === '/contact' || normalizedPath === '/oem' || normalizedPath === '/catalog' || normalizedPath === '/about' || normalizedPath === '/careers' || normalizedPath === '/register-b2b') {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    } else {
      setIsScrolled(true);
    }
    return () => window.removeEventListener('scroll', handleScroll);
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
    navigate('/');
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

  const normalizedPath = location.pathname.toLowerCase().replace(/\/$/, '');
  const isLightPage = normalizedPath === '/contact' || normalizedPath === '/oem' || normalizedPath === '/catalog';
  const hasOriginalLogoBeforeScroll = normalizedPath === '/contact' || normalizedPath === '/catalog' || normalizedPath === '/oem';

  return (
    <>
      {/* Floating Superpower-style Navbar */}
      <div className={`wey-navbar-stage ${isScrolled ? 'is-scrolled' : ''}`}>
        <nav className={`wey-navbar-container ${isScrolled ? 'is-scrolled' : ''} ${isLightPage ? 'is-light-nav' : ''} ${hasOriginalLogoBeforeScroll ? 'has-original-logo-before-scroll' : ''}`}>
          
          {/* Left Section: Small Nav Links (hidden on mobile) */}
          <div className="wey-navbar-left">
            <Link to="/" className="wey-navbar-link">Home</Link>
            <Link to="/about" className="wey-navbar-link">About</Link>
            <Link to="/catalog" className="wey-navbar-link">Products</Link>
            <Link to="/oem" className="wey-navbar-link">OEM</Link>
            <Link to="/contact" className="wey-navbar-link">Contact</Link>
          </div>

          <div className="wey-navbar-logo-wrapper">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <img 
                src="/img/bapuji logo.png" 
                alt="Bapuji Surgicals Logo" 
                className="wey-logo-img"
              />
            </Link>
          </div>

          {/* Right Section: Login and CTA */}
          <div className="wey-navbar-right">
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
                    to="/admin" 
                    className="wey-navbar-link"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
                  >
                    <Shield size={13} /> Admin
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="wey-navbar-login"
                  style={{ fontSize: '14px', textTransform: 'capitalize' }}
                >
                  {user.name.split(' ')[0]}
                </Link>
              </div>
            ) : (
              <Link to="/login" className="wey-navbar-login">
                Log in
              </Link>
            )}

            {/* Primary CTA button */}
            <Link to="/register-b2b" className="wey-navbar-cta">
              B2B Service
            </Link>
          </div>
        </nav>

        {/* Separate Grid Menu Trigger Button */}
        <div className="wey-navbar-grid-btn">
          <MenuToggle 
            open={isMegaOpen} 
            onOpenChange={setIsMegaOpen}
            strokeWidth={1.5}
            className="size-11"
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
              <Link to="/profile" className="wey-mega-user-profile-link" style={{ textTransform: 'capitalize' }} onClick={() => setIsMegaOpen(false)}>
                Hi, {user.name.split(' ')[0]}
              </Link>
              <button 
                onClick={() => { setIsMegaOpen(false); handleLogout(); }} 
                className="wey-mega-user-logout-btn"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="wey-mega-title">Menu</div>
          )}
          <div className="wey-mega-top-actions">
            {!user && (
              <Link to="/login" className="wey-mega-login" onClick={() => setIsMegaOpen(false)}>
                Log in
              </Link>
            )}
            
            <Link to="/register-b2b" className="wey-mega-cta" onClick={() => setIsMegaOpen(false)}>
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
          <Link to="/" className="wey-mega-link" onClick={() => setIsMegaOpen(false)}>Home</Link>
          <Link to="/about" className="wey-mega-link" onClick={() => setIsMegaOpen(false)}>About Us</Link>
          <Link to="/catalog" className="wey-mega-link" onClick={() => setIsMegaOpen(false)}>Product</Link>
          <Link to="/oem" className="wey-mega-link" onClick={() => setIsMegaOpen(false)}>OEM</Link>
          <Link to="/contact" className="wey-mega-link" onClick={() => setIsMegaOpen(false)}>Contact</Link>
        </div>

        {/* Bottom Columns */}
        <div className="wey-mega-bottom">
          <div className="wey-mega-col">
            <div className="wey-mega-col-title">Industries</div>
            <Link to="/catalog?category=baby" className="wey-mega-col-link" onClick={() => setIsMegaOpen(false)}>Baby care</Link>
            <Link to="/catalog?category=gym" className="wey-mega-col-link" onClick={() => setIsMegaOpen(false)}>Gym wipes</Link>
            <Link to="/catalog?category=hospital" className="wey-mega-col-link" onClick={() => setIsMegaOpen(false)}>Hospital wipes</Link>
            <Link to="/catalog?category=beauty" className="wey-mega-col-link" onClick={() => setIsMegaOpen(false)}>Beauty wipes</Link>
          </div>

          <div className="wey-mega-col">
            <div className="wey-mega-col-title">Company</div>
            <Link to="/careers" className="wey-mega-col-link" onClick={() => setIsMegaOpen(false)}>Careers</Link>
            <Link to="/contact" className="wey-mega-col-link" onClick={() => setIsMegaOpen(false)}>Contact</Link>
            <Link to="/catalog" className="wey-mega-col-link" onClick={() => setIsMegaOpen(false)}>Blog</Link>
          </div>
        </div>

      </div>
    </>
  );
};

export default Navbar;
