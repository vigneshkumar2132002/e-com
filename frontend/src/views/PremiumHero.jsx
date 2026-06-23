import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const PremiumHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  const breathingGlow = {
    opacity: [0.3, 0.5, 0.3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center"
      >
        <div className="text-white font-bold text-xl">Bapuji OEM</div>
        <div className="flex gap-8 items-center">
          <a href="#" className="text-gray-300 hover:text-white transition">
            Solutions
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition">
            About
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition">
            Contact
          </a>
          <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
            Get Started
          </button>
        </div>
      </motion.nav>

      {/* Hero Container */}
      <div className="relative w-full h-full flex items-center justify-between px-8 md:px-16">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Radial Gradient Spotlight */}
          <motion.div
            animate={breathingGlow}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle 800px at ${
                50 + mousePosition.x * 10
              }% ${50 + mousePosition.y * 10}%, 
                rgba(242, 154, 74, 0.3) 0%, 
                rgba(142, 42, 0, 0.15) 30%, 
                rgba(26, 5, 0, 0.4) 60%, 
                rgba(0, 0, 0, 0.95) 100%)`,
            }}
          />

          {/* Vignette Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

          {/* Film Grain Overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-soft-light"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='400' height='400' fill='%23fff' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
              backgroundSize: '400px 400px',
            }}
          />
        </div>

        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full md:w-1/2 max-w-2xl"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 mb-8"
          >
            <span className="text-xl">âœ“</span>
            <span className="text-sm font-medium text-gray-300">
              Dermatologically Tested
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-[64px] md:text-[88px] font-semibold leading-[0.95] tracking-[-0.04em] text-white mb-6"
          >
            Premium Wet Wipes Manufactured for Modern Brands
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-[#D0D0D0] mb-8 max-w-[520px] leading-relaxed"
          >
            Custom OEM wet wipes solutions for baby care, hygiene, beauty,
            fitness, and healthcare brands worldwide. Enterprise-grade
            manufacturing with white-label customization.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4"
          >
            <button className="bg-white text-black px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-100 transition transform hover:scale-105 duration-300 flex items-center gap-2">
              Explore Products
              <ArrowRight size={18} />
            </button>
            <button className="bg-[#0976BC] text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white hover:text-black transition transform hover:scale-105 duration-300 border border-transparent">
              Get a Quote
            </button>
          </motion.div>
        </motion.div>

        {/* Right Product Image Section */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          className="hidden md:flex relative z-10 w-1/2 h-full items-center justify-center"
        >
          <motion.div animate={floatingAnimation} className="w-full h-full flex items-center justify-center">
            {/* Product Placeholder with Cinematic Effect */}
            <div className="relative w-full max-w-md h-4/5">
              {/* Glow around product */}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-transparent to-transparent blur-3xl rounded-full" />

              {/* Product Container */}
              <div className="relative h-full w-full flex items-center justify-center">
                {/* Product Image Fallback */}
                <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl flex items-center justify-center">
                  {/* Simulated Premium Product Image */}
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      viewBox="0 0 400 500"
                      className="w-full h-full object-contain p-8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Product Package SVG */}
                      <defs>
                        <linearGradient
                          id="productGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#F29A4A" />
                          <stop offset="50%" stopColor="#FF8C42" />
                          <stop offset="100%" stopColor="#E67E22" />
                        </linearGradient>
                        <linearGradient
                          id="shimmer"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                          <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                      </defs>

                      {/* Main Product Box */}
                      <rect
                        x="80"
                        y="80"
                        width="240"
                        height="340"
                        rx="20"
                        fill="url(#productGradient)"
                      />

                      {/* Product Highlight */}
                      <rect
                        x="100"
                        y="100"
                        width="200"
                        height="300"
                        rx="15"
                        fill="url(#shimmer)"
                        opacity="0.6"
                      />

                      {/* Premium Badge */}
                      <circle cx="200" cy="150" r="60" fill="rgba(255,255,255,0.1)" />
                      <text
                        x="200"
                        y="155"
                        textAnchor="middle"
                        fontSize="24"
                        fontWeight="bold"
                        fill="white"
                      >
                        Premium
                      </text>
                      <text
                        x="200"
                        y="175"
                        textAnchor="middle"
                        fontSize="14"
                        fill="white"
                      >
                        Wet Wipes
                      </text>

                      {/* Product Details */}
                      <text
                        x="200"
                        y="260"
                        textAnchor="middle"
                        fontSize="16"
                        fontWeight="600"
                        fill="white"
                      >
                        Custom OEM Solutions
                      </text>
                      <text
                        x="200"
                        y="285"
                        textAnchor="middle"
                        fontSize="12"
                        fill="rgba(255,255,255,0.8)"
                      >
                        100% Dermatologically Tested
                      </text>
                      <text
                        x="200"
                        y="305"
                        textAnchor="middle"
                        fontSize="12"
                        fill="rgba(255,255,255,0.8)"
                      >
                        Enterprise Grade Manufacturing
                      </text>

                      {/* Decorative Elements */}
                      <circle
                        cx="120"
                        cy="120"
                        r="8"
                        fill="rgba(255,255,255,0.4)"
                      />
                      <circle
                        cx="280"
                        cy="140"
                        r="6"
                        fill="rgba(255,255,255,0.3)"
                      />
                      <circle
                        cx="110"
                        cy="380"
                        r="5"
                        fill="rgba(255,255,255,0.25)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-8 left-8 z-10 flex gap-12"
      >
        {/* Stat 1 */}
        <div>
          <div className="text-sm font-semibold text-white mb-2">Trusted</div>
          <div className="text-xs text-gray-400">1M+ wipes manufactured</div>
        </div>

        {/* Stat 2 */}
        <div>
          <div className="text-sm font-semibold text-white mb-2">Safe</div>
          <div className="text-xs text-gray-400">Dermatologically tested</div>
        </div>

        {/* Stat 3 */}
        <div>
          <div className="text-sm font-semibold text-white mb-2">Custom OEM</div>
          <div className="text-xs text-gray-400">Private label solutions</div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 right-8 text-gray-500 text-xs"
      >
        Scroll to explore
      </motion.div>
    </div>
  );
};

export default PremiumHero;

