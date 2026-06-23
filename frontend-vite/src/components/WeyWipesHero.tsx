import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface WeyWipesHeroProps {
  onExploreProducts?: () => void;
  onGetQuote?: () => void;
  onLogin?: () => void;
  onBecomePartner?: () => void;
  onMenuToggle?: () => void;
}

export const WeyWipesHero: React.FC<WeyWipesHeroProps> = ({
  onExploreProducts = () => {},
  onGetQuote = () => {},
  onLogin = () => {},
  onBecomePartner = () => {},
  onMenuToggle = () => {},
}) => {
  return (
    <div className="bg-[#F5F3EF] w-full min-h-screen overflow-hidden flex flex-col justify-center items-center box-border select-none">
      {/* Standalone Keyframe Styles for Premium Animated Film Grain */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes weywipes-grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -4%); }
          20% { transform: translate(-6%, 2%); }
          30% { transform: translate(3%, -8%); }
          40% { transform: translate(-2%, 8%); }
          50% { transform: translate(-6%, 4%); }
          60% { transform: translate(6%, 0%); }
          70% { transform: translate(0%, 6%); }
          80% { transform: translate(2%, 12%); }
          90% { transform: translate(-4%, 4%); }
        }
        .grain-layer {
          animation: weywipes-grain 6s steps(8) infinite;
          background-size: 300px 300px;
        }
        @media (max-width: 768px) {
          .mobile-hero-height {
            height: auto;
            min-height: calc(100vh - 24px);
            padding-bottom: 60px;
          }
        }
      `}} />

      {/* Main Fullscreen Hero Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-[calc(100%-24px)] h-[calc(100vh-24px)] mobile-hero-height m-3 rounded-[20px] overflow-hidden relative bg-[#050505] flex flex-col justify-between box-border border border-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.8)] z-10"
      >
        {/* ========================================================
            BACKGROUND GLOW SYSTEM (Multiple Layered Radial Gradients)
            ======================================================== */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Layer 1: Ambient Base Dark Reddish/Orange Warm Glow */}
          <motion.div
            animate={{
              scale: [1, 1.06, 1],
              opacity: [0.65, 0.85, 0.65],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-[120%] h-[120%] -top-[10%] -left-[10%] mix-blend-screen"
            style={{
              background: 'radial-gradient(circle at 75% 55%, #140401 0%, #000000 65%)'
            }}
          />

          {/* Layer 2: Rich Deep Auburn / Orange Glow Layer */}
          <motion.div
            animate={{
              scale: [0.96, 1.04, 0.96],
              opacity: [0.7, 0.9, 0.7],
              rotate: [0, 3, 0]
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-[140%] h-[140%] -top-[20%] -left-[20%] mix-blend-screen"
            style={{
              background: 'radial-gradient(circle at 68% 48%, #6A2207 0%, rgba(106, 34, 7, 0.1) 50%, transparent 100%)'
            }}
          />

          {/* Layer 3: Warm Orange Spotlight Center (F2A24D) */}
          <motion.div
            animate={{
              scale: [1.02, 0.95, 1.02],
              x: [-15, 15, -15],
              y: [-10, 10, -10],
              opacity: [0.85, 0.98, 0.85]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-full h-full mix-blend-screen"
            style={{
              background: 'radial-gradient(circle at 63% 45%, rgba(242, 162, 77, 0.5) 0%, rgba(242, 162, 77, 0.15) 30%, transparent 60%)'
            }}
          />

          {/* Vignette Edges */}
          <div className="absolute inset-0 bg-radial-vignette" style={{
            background: 'radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.98) 100%)'
          }} />
        </div>

        {/* ========================================================
            FILM GRAIN OVERLAY
            ======================================================== */}
        <div className="absolute -inset-[10%] z-10 pointer-events-none opacity-[0.04] mix-blend-soft-light overflow-hidden">
          <div className="grain-layer w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }} />
        </div>

        {/* ========================================================
            NAVBAR (Exact Superpower Spacing & Composition)
            ======================================================== */}
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 right-0 h-[88px] px-9 flex items-center justify-between z-40"
        >
          {/* NAVBAR LEFT: Small Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {['Products', 'OEM', 'Manufacturing'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-[15px] font-medium text-white/85 hover:text-white transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>

          {/* NAVBAR CENTER: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <a href="/" className="text-[42px] font-bold text-white tracking-[-0.05em] leading-none hover:opacity-95 transition-opacity">
              WeyWipes
            </a>
          </div>

          {/* NAVBAR RIGHT: Buttons & Menu Grid Icon */}
          <div className="flex items-center gap-5">
            <button
              onClick={onLogin}
              className="text-[15px] font-medium text-white/85 hover:text-white bg-transparent border-none cursor-pointer transition-colors duration-300 mr-2"
            >
              Log in
            </button>

            <button
              onClick={onBecomePartner}
              className="h-11 px-6 bg-white text-black font-semibold text-[15px] rounded-full border-none cursor-pointer hover:bg-neutral-100 transition-all duration-300 hover:scale-[1.03]"
            >
              Become a partner
            </button>

            {/* Circular Menu Button with 3x3 Dot Grid */}
            <button
              onClick={onMenuToggle}
              className="w-11 h-11 bg-white/10 hover:bg-white/15 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-300 hover:scale-[1.05]"
              aria-label="Toggle Menu"
            >
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-white rounded-full" />
                ))}
              </div>
            </button>
          </div>
        </motion.nav>

        {/* ========================================================
            MAIN HERO LAYOUT (Left Content & Floating Image)
            ======================================================== */}
        <div className="flex-1 w-full max-w-[1440px] mx-auto px-14 flex items-center relative z-20 md:flex-row flex-col-reverse justify-center md:justify-start gap-12 md:gap-0 mt-[88px] md:mt-0">
          
          {/* LEFT HERO CONTENT */}
          <div className="w-full md:max-w-[560px] flex flex-col items-start text-left relative md:absolute md:left-14 md:top-1/2 md:-translate-y-1/2 md:mt-0 mt-6 z-30">
            {/* Small Top Label */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-2 text-[14px] font-medium text-white/85 mb-6"
            >
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/10 text-white text-[10px]">
                ✓
              </span>
              OEM Wet Wipes Manufacturing
            </motion.div>

            {/* Main Heading (Exact breaks & sizing) */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="text-[48px] sm:text-[72px] md:text-[96px] leading-[0.92] tracking-[-0.06em] font-medium text-white m-0"
              >
                Elevating hygiene<br />
                with premium<br />
                wet wipes
              </motion.h1>
            </div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-[18px] md:text-[24px] line-height-[1.45] text-white/82 max-w-[500px] mt-6 m-0"
            >
              Private label wet wipes solutions designed for modern global brands across baby care, beauty, healthcare, fitness, and personal hygiene industries.
            </motion.p>

            {/* Button Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="flex gap-4 mt-8 w-full sm:w-auto"
            >
              {/* Primary Explore button */}
              <motion.button
                onClick={onExploreProducts}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="h-[56px] px-8 bg-white text-black font-semibold text-[16px] rounded-full border-none cursor-pointer hover:bg-neutral-100 shadow-lg flex items-center justify-center transition-colors duration-200"
              >
                Explore Products
              </motion.button>

              {/* Secondary quote button */}
              <motion.button
                onClick={onGetQuote}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="h-[56px] px-8 bg-white/5 border border-white/10 text-white font-semibold text-[16px] rounded-full cursor-pointer hover:bg-white/10 hover:border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg transition-colors duration-200"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
                }}
              >
                Get a Quote
              </motion.button>
            </motion.div>
          </div>

          {/* MAIN HERO IMAGE (Center-Right composition with slow float) */}
          <div className="w-full md:w-[55%] h-[40vh] md:h-full md:absolute md:right-0 md:top-0 flex items-center justify-center z-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -16, 0]
              }}
              transition={{
                opacity: { duration: 1.2, delay: 0.5 },
                scale: { duration: 1.2, delay: 0.5 },
                y: {
                  duration: 6,
                  ease: "easeInOut",
                  repeat: Infinity
                }
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src="/img/luxury_wet_wipes.png"
                alt="Premium Wet Wipes Custom Packaging"
                className="max-w-[85%] max-h-[85%] md:max-w-[80%] md:max-h-[80%] object-contain select-none filter drop-shadow-[0_30px_70px_rgba(0,0,0,0.8)]"
              />
            </motion.div>
          </div>
        </div>

        {/* ========================================================
            BOTTOM LAYOUT ROW (Stats Row & Floating Help Card)
            ======================================================== */}
        <div className="w-full max-w-[1440px] mx-auto px-14 h-[100px] flex items-center justify-between relative z-30 pb-9 md:flex-row flex-col gap-6 md:gap-0 mt-6 md:mt-0">
          
          {/* BOTTOM LEFT FEATURE ROW */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex items-center gap-10 md:self-center self-start"
          >
            {[
              { title: 'Trusted', text: '1M+ wipes produced' },
              { title: 'Safe', text: 'Dermatologically tested' },
              { title: 'OEM Ready', text: 'Global private label solutions' }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold text-white/50 uppercase tracking-widest leading-none">
                  {stat.title}
                </span>
                <span className="text-[15px] font-medium text-white/90 leading-normal">
                  {stat.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* BOTTOM RIGHT FLOATING CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ 
              opacity: { duration: 1.0, delay: 0.95 },
              x: { duration: 1.0, delay: 0.95 },
              type: 'spring',
              stiffness: 400,
              damping: 18
            }}
            className="md:self-center self-end"
          >
            <a
              href="/oem"
              className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] backdrop-blur-lg rounded-[24px] py-3.5 px-5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] group no-underline cursor-pointer transition-colors duration-300 hover:bg-white/[0.06]"
            >
              <span className="text-[14px] font-medium text-white/95 leading-none">
                Need OEM wet wipes support?
              </span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-semibold text-[13px] shadow-[0_2px_10px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-300">
                →
              </div>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WeyWipesHero;
