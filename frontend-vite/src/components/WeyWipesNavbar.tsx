import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';

interface NavLink {
  label: string;
  path: string;
}

interface WeyWipesNavbarProps {
  cartCount?: number;
  onLoginClick?: () => void;
  onCtaClick?: () => void;
  user?: {
    name: string;
    role?: string;
  } | null;
}

export const WeyWipesNavbar: React.FC<WeyWipesNavbarProps> = ({
  cartCount = 0,
  onLoginClick = () => {},
  onCtaClick = () => {},
  user = null,
}) => {
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll for header morphing
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll and blur background when mega menu is open
  useEffect(() => {
    if (isMegaOpen) {
      document.body.style.overflow = 'hidden';
      const appContainer = document.getElementById('__next') || document.getElementById('root') || document.querySelector('main');
      if (appContainer) {
        appContainer.style.transition = 'filter 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
        appContainer.style.filter = 'blur(6px)';
      }
    } else {
      document.body.style.overflow = 'unset';
      const appContainer = document.getElementById('__next') || document.getElementById('root') || document.querySelector('main');
      if (appContainer) {
        appContainer.style.filter = 'none';
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      const appContainer = document.getElementById('__next') || document.getElementById('root') || document.querySelector('main');
      if (appContainer) {
        appContainer.style.filter = 'none';
      }
    };
  }, [isMegaOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMegaOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const leftLinks: NavLink[] = [
    { label: 'Products', path: '/catalog' },
    { label: 'OEM', path: '/oem' },
    { label: 'Reviews', path: '#reviews' },
    { label: 'FAQ', path: '#faq' },
  ];

  const megaMenuLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Product', path: '/catalog' },
    { label: 'OEM', path: '/oem' },
    { label: 'Contact', path: '/contact' },
  ];

  const industryLinks = [
    { label: 'Baby care', path: '/catalog?category=baby' },
    { label: 'Gym wipes', path: '/catalog?category=gym' },
    { label: 'Hospital wipes', path: '/catalog?category=hospital' },
    { label: 'Beauty wipes', path: '/catalog?category=beauty' },
  ];

  const companyLinks = [
    { label: 'About', path: '/#about' },
    { label: 'Careers', path: '/oem' },
    { label: 'Contact', path: '/oem#contact' },
    { label: 'Blog', path: '/catalog' },
  ];

  return (
    <>
      {/* Floating Morphing Navbar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-1/2 -translate-x-1/2 flex items-center justify-between z-[100] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled 
            ? 'top-4 w-[calc(100%-32px)] max-w-[1600px] h-[72px] bg-black/72 backdrop-blur-[18px] border border-white/6 rounded-full px-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]'
            : 'top-3 w-[calc(100%-24px)] h-[88px] bg-transparent border-none rounded-none px-9 shadow-none'
        }`}
      >
        {/* LEFT SECTION: small nav links */}
        <div className="hidden md:flex items-center gap-7">
          {leftLinks.map((link, idx) => (
            <motion.a
              key={idx}
              href={link.path}
              className={`text-[15px] font-medium transition-colors duration-200 ${
                isScrolled ? 'text-white/85 hover:text-white' : 'text-white/95 hover:text-white'
              }`}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* CENTER: brand image centered perfectly with scale scroll-transitions */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <a href="/" className="flex items-center justify-center">
            <img 
              src="/img/bapuji logo.png" 
              alt="Bapuji Surgicals Logo" 
              className={`object-contain brightness-0 invert transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isScrolled ? 'h-10' : 'h-[52px]'
              }`}
            />
          </a>
        </div>

        {/* RIGHT SECTION: Cart bag indicator, CTA, profile, grid icon */}
        <div className="flex items-center gap-5 z-10">
          {/* Sleek Cart indicator */}
          {cartCount > 0 && (
            <motion.a 
              href="/cart"
              whileHover={{ scale: 1.05 }}
              className="relative p-2 text-white/85 hover:text-white"
            >
              <ShoppingBag size={19} />
              <span className="absolute -top-1 -right-1 bg-[#6A4A17] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </motion.a>
          )}

          {/* User state or login */}
          {user ? (
            <a href="/profile" className="hidden sm:inline-block text-[15px] font-medium text-white/85 hover:text-white transition-colors">
              {user.name.split(' ')[0]}
            </a>
          ) : (
            <button 
              onClick={onLoginClick}
              className="hidden sm:inline-block text-[15px] font-medium text-white/85 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
            >
              Log in
            </button>
          )}

          {/* Main CTA Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            onClick={onCtaClick}
            className={`hidden md:flex bg-white text-black rounded-full font-semibold text-[15px] border-0 cursor-pointer items-center justify-center hover:bg-neutral-100 shadow-sm transition-all duration-500 ${
              isScrolled ? 'h-12 px-7' : 'h-11 px-6'
            }`}
          >
            Become a partner
          </motion.button>

          {/* Circular Grid Menu Icon Button */}
          <motion.button
            onClick={() => setIsMegaOpen(true)}
            whileHover={{ scale: 1.05, rotate: 15 }}
            className={`bg-[#6A4A17] rounded-full flex items-center justify-center border-0 cursor-pointer transition-all duration-500 ${
              isScrolled ? 'w-12 h-12' : 'w-11 h-11'
            }`}
            aria-label="Open Menu"
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white rounded-full" />
              ))}
            </div>
          </motion.button>
        </div>
      </motion.nav>

      {/* Animate Mega Menu Panel */}
      <AnimatePresence>
        {isMegaOpen && (
          <>
            {/* Dark glass backdrop to capture outside clicks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMegaOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[110]"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[90px] left-2 right-2 bottom-2 md:bottom-3 bg-[#F5F3EF] rounded-t-[32px] md:rounded-[32px] p-8 md:p-12 z-[120] overflow-y-auto flex flex-col justify-between shadow-[0_-20px_60px_rgba(0,0,0,0.4)]"
            >
              {/* TOP ROW */}
              <div className="flex items-center justify-end md:justify-between w-100 mb-8 md:mb-10">
                <span className="hidden md:inline text-[14px] font-semibold text-[#8B8B8B] uppercase tracking-wider">
                  Menu
                </span>
                
                <div className="flex items-center gap-5">
                  {user ? (
                    <a href="/profile" className="text-base font-medium text-[#111] hover:text-[#6A4A17] transition-colors" onClick={() => setIsMegaOpen(false)}>
                      Hi, {user.name.split(' ')[0]}
                    </a>
                  ) : (
                    <button 
                      onClick={() => { setIsMegaOpen(false); onLoginClick(); }}
                      className="text-base font-medium text-[#111] hover:text-[#6A4A17] bg-transparent border-0 cursor-pointer"
                    >
                      Log in
                    </button>
                  )}
                  
                  <button 
                    onClick={() => { setIsMegaOpen(false); onCtaClick(); }}
                    className="h-12 px-7 bg-[#111] text-white rounded-full font-semibold text-[15px] border-0 cursor-pointer flex items-center justify-center hover:bg-neutral-800 transition-all hover:scale-[1.02]"
                  >
                    Become a partner
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsMegaOpen(false)}
                    className="w-12 h-12 bg-[#111] rounded-full flex items-center justify-center border-0 cursor-pointer"
                    aria-label="Close Menu"
                  >
                    <X className="text-white w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* MAIN MENU LINKS */}
              <div className="flex flex-col gap-4 md:gap-5 items-start my-auto">
                {megaMenuLinks.map((link, idx) => (
                  <motion.a
                    key={idx}
                    href={link.path}
                    onClick={() => setIsMegaOpen(false)}
                    className="text-[40px] sm:text-[56px] md:text-[72px] font-medium tracking-tight text-[#111] leading-[0.95] hover:text-[#6A4A17]"
                    whileHover={{ x: 12 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>

              {/* BOTTOM COLUMNS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 border-t border-black/8 pt-8 md:pt-10 w-full mt-8">
                {/* Column 1 */}
                <div className="flex flex-col gap-3">
                  <span className="text-[12px] font-bold text-[#8B8B8B] uppercase tracking-wider">
                    Industries
                  </span>
                  <div className="flex flex-col gap-2">
                    {industryLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.path}
                        onClick={() => setIsMegaOpen(false)}
                        className="text-[14px] text-[#222] hover:text-[#6A4A17] transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-3">
                  <span className="text-[12px] font-bold text-[#8B8B8B] uppercase tracking-wider">
                    Company
                  </span>
                  <div className="flex flex-col gap-2">
                    {companyLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.path}
                        onClick={() => setIsMegaOpen(false)}
                        className="text-[14px] text-[#222] hover:text-[#6A4A17] transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default WeyWipesNavbar;
