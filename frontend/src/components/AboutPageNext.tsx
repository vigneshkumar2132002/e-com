'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { CheckCircle2, Factory, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface MetricItem {
  num: string;
  title: string;
  desc: string;
}

interface CapabilityItem {
  name: string;
  desc: string;
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=500&q=80",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&q=80",
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80",
  "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=500&q=80",
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&q=80",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&q=80",
  "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=80",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80",
  "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500&q=80",
  "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=500&q=80",
  "https://images.unsplash.com/photo-1607619056574-7b8d304e3b24?w=500&q=80",
  "https://images.unsplash.com/photo-1607619280004-9844c8c2c19c?w=500&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80",
  "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&q=80",
  "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=500&q=80",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80",
  "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&q=80"
];

const IMAGES_CONFIG = [
  { x0: '-9vw', y0: '-6vh', dx: -1.0, dy: -1.1, endScale: 2.7 },
  { x0:  '6vw', y0: '-9vh', dx:  1.1, dy: -1.0, endScale: 2.9 },
  { x0:  '4vw', y0:  '8vh', dx:  1.2, dy:  1.0, endScale: 2.5 },
  { x0: '-8vw', y0:  '7vh', dx: -1.0, dy:  1.2, endScale: 3.0 },
  { x0: '-5vw', y0: '-8vh', dx: -1.2, dy: -1.0, endScale: 2.6 },
  { x0:  '9vw', y0: '-4vh', dx:  1.3, dy: -1.0, endScale: 2.8 },
  { x0:  '7vw', y0:  '6vh', dx:  1.0, dy:  1.3, endScale: 3.1 },
  { x0: '-7vw', y0:  '5vh', dx: -1.1, dy:  1.0, endScale: 2.5 },
  { x0: '-6vw', y0: '-9vh', dx: -1.0, dy: -1.2, endScale: 3.0 },
  { x0:  '5vw', y0: '-7vh', dx:  1.2, dy: -1.1, endScale: 2.7 },
  { x0:  '8vw', y0:  '4vh', dx:  1.0, dy:  1.0, endScale: 2.8 },
  { x0: '-4vw', y0:  '8vh', dx: -1.3, dy:  1.0, endScale: 2.6 },
  { x0: '-8vw', y0: '-5vh', dx: -1.0, dy: -1.0, endScale: 2.9 },
  { x0:  '6vw', y0: '-8vh', dx:  1.1, dy: -1.2, endScale: 3.1 },
  { x0:  '9vw', y0:  '5vh', dx:  1.0, dy:  1.1, endScale: 2.7 },
  { x0: '-5vw', y0:  '9vh', dx: -1.2, dy:  1.1, endScale: 2.5 },
  { x0: '-9vw', y0: '-7vh', dx: -1.0, dy: -1.0, endScale: 2.8 },
  { x0:  '4vw', y0: '-6vh', dx:  1.0, dy: -1.0, endScale: 3.0 },
  { x0:  '7vw', y0:  '8vh', dx:  1.1, dy:  1.0, endScale: 2.6 },
];

export const AboutPageNext: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      setScale(Math.min(scaleX, scaleY, 1));
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 1. Hero Scroll Setup
  const heroTrackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroTrackRef,
    offset: ["start start", "end end"]
  });

  const STAGGER = 0.03;
  const DUR = 0.40;

  // Image explosion transforms
  const imgTransforms = IMAGES_CONFIG.map((cfg, idx) => {
    const t0 = idx * STAGGER;
    const tEnd = Math.min(t0 + DUR, 1.0);
    const tMid = t0 + (DUR * 0.2);
    
    const exitX = `${cfg.dx * 60}vw`;
    const exitY = `${cfg.dy * 60}vh`;

    const scale = useTransform(heroScroll, [0, t0, tEnd], [0.2, 0.2, cfg.endScale]);
    const opacity = useTransform(heroScroll, [0, t0, tMid, tEnd - 0.02, tEnd], [0, 0, 1, 1, 0]);
    const x = useTransform(heroScroll, [0, t0, tEnd], [cfg.x0, cfg.x0, exitX]);
    const y = useTransform(heroScroll, [0, t0, tEnd], [cfg.y0, cfg.y0, exitY]);
    const filter = useTransform(heroScroll, [0, t0, tMid], ["blur(5px)", "blur(5px)", "blur(0px)"]);

    return { scale, opacity, x, y, filter };
  });

  // Progress Bar vertical line fill
  const progressHeight = useTransform(heroScroll, [0, 0.95], ["0%", "100%"]);

  const lineBgPos1 = useTransform(heroScroll, [0.05, 0.27], ["100% 0", "0% 0"]);
  const lineBgPos2 = useTransform(heroScroll, [0.27, 0.49], ["100% 0", "0% 0"]);
  const lineBgPos3 = useTransform(heroScroll, [0.49, 0.71], ["100% 0", "0% 0"]);

  const baseLineStyle = {
    backgroundImage: 'linear-gradient(to right, #18181b 50%, rgba(24, 24, 27, 0.16) 50%)',
    backgroundSize: '200% 100%',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text' as const,
    color: 'transparent',
  };

  // Subtext reveal
  const subtextOpacity = useTransform(heroScroll, [0.71, 0.88], [0, 1]);
  const subtextY = useTransform(heroScroll, [0.71, 0.88], [24, 0]);

  // Indicator fade out
  const indicatorOpacity = useTransform(heroScroll, [0, 0.15], [1, 0]);

  // 2. Statement Section Scroll
  const statementRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: statementScroll } = useScroll({
    target: statementRef,
    offset: ["start end", "end start"]
  });
  
  const statementScale = useTransform(statementScroll, [0, 0.5, 1], [0.95, 1.05, 0.95]);
  const statementOpacity = useTransform(statementScroll, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const statementScaleSpring = useSpring(statementScale, { stiffness: 100, damping: 30 });

  // 3. Custodian Pinned Section Scroll
  const custodianTrackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: custodianScroll } = useScroll({
    target: custodianTrackRef,
    offset: ["start start", "end end"]
  });

  const clipInset = useTransform(custodianScroll, [0, 0.7], [50, 0]);
  const clipPathStyle = useTransform(clipInset, (val) => `inset(${val}%)`);
  const custodianImageScale = useTransform(custodianScroll, [0, 0.7], [1.3, 1.0]);
  const custodianProgressHeight = useTransform(custodianScroll, [0, 1.0], ["0%", "100%"]);

  const leftWords = "We take being a partner in patient care seriously.".split(" ");
  const rightWords = "Manufacturing dependable healthcare products improves lives, and we’re here to be the most reliable partner on that journey.".split(" ");

  const leftWordOpacities = leftWords.map((_, idx) => {
    const start = 0.25 + (idx * 0.03);
    const end = start + 0.15;
    return useTransform(custodianScroll, [start, end], [0.2, 1]);
  });

  const rightWordOpacities = rightWords.map((_, idx) => {
    const start = 0.38 + (idx * 0.02);
    const end = start + 0.15;
    return useTransform(custodianScroll, [start, end], [0.2, 1]);
  });

  const metrics: MetricItem[] = [
    { num: '45+', title: 'Years of Experience', desc: 'Pioneering surgical and medical hygiene manufacturing since 1980.' },
    { num: '500+', title: 'Healthcare Partners', desc: 'Supplying top-tier medical clinics, hospitals, and pharmacies.' },
    { num: 'India & Global', title: 'Supply Network', desc: 'Seamless logistical supply coordinate distributions across continents.' },
    { num: 'Trusted', title: 'Manufacturing Standards', desc: 'Fully compliant cleanroom facilities under strict regulatory guidelines.' }
  ];

  const capabilities: CapabilityItem[] = [
    { name: 'Surgical Dressings', desc: 'Demineralized gauze pads, roller bandages, and cotton rolls.' },
    { name: 'Advanced Wound Care', desc: 'Pre-operative CHG cloths, saline wound wipes, and antiseptics.' },
    { name: 'Sterilization Reels & Pouches', desc: 'Airtight packaging pouches with integrated chemical sterility indicators.' },
    { name: 'Hygiene Care Products', desc: 'Dermatologically tested wet wipes, bamboo cloths, and sanitizers.' },
    { name: 'Medical Packaging Solutions', desc: 'Custom lidding films, dispenser canisters, and custom pouches.' },
    { name: 'OEM & Healthcare Manufacturing', desc: 'Bespoke private-brand formulations and cleanroom contract compounding.' }
  ];

  return (
    <div ref={containerRef} className="bg-white text-[#0A0A0A] font-sans overflow-x-hidden selection:bg-[#0976BC]/20 selection:text-[#0976BC]">
      {/* Film Grain Overlay */}
      <div className="fixed inset-0 z-[99] pointer-events-none opacity-[0.03] mix-blend-soft-light" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />

      {/* SECTION 1 — HERO INTRO (Framer Motion Scroll Explosion) */}
      <section ref={heroTrackRef} className="relative w-full h-[500vh]">
        <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center bg-white">
          <div className="sp-about-hero-canvas" style={{ transform: `scale(${scale})` }}>
          
          {/* Flying Images Stage */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
            {HERO_IMAGES.map((imgUrl, i) => (
              <motion.img 
                key={i}
                src={imgUrl} 
                alt=""
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 'clamp(140px, 15vw, 240px)',
                  height: 'clamp(180px, 20vw, 320px)',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                  translateX: '-50%',
                  translateY: '-50%',
                  x: imgTransforms[i].x,
                  y: imgTransforms[i].y,
                  scale: imgTransforms[i].scale,
                  opacity: imgTransforms[i].opacity,
                  filter: imgTransforms[i].filter,
                }}
              />
            ))}
          </div>

          {/* Progress vertical track */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[40vh] bg-neutral-100 z-20 overflow-hidden">
            <motion.div style={{ height: progressHeight }} className="w-full bg-[#18181b]" />
          </div>

          {/* Text Caption */}
          <div className="relative z-30 max-w-[960px] flex flex-col items-center gap-6 px-6 text-center">
            <span className="text-xs font-bold text-[#0976BC] uppercase tracking-wider mb-2">
              SINCE 1980
            </span>
            <h1 className="text-[32px] sm:text-[56px] md:text-[80px] leading-[1.1] font-semibold tracking-[-0.04em] text-neutral-900 m-0">
              <motion.span style={{ ...baseLineStyle, backgroundPosition: lineBgPos1 }} className="block">Building Trust in Healthcare,</motion.span>
              <motion.span style={{ ...baseLineStyle, backgroundPosition: lineBgPos2 }} className="block">Delivering Dependable Solutions,</motion.span>
              <motion.span style={{ ...baseLineStyle, backgroundPosition: lineBgPos3 }} className="block">One Product at a Time.</motion.span>
            </h1>
            
            <motion.p 
              style={{ opacity: subtextOpacity, y: subtextY }}
              className="text-[16px] sm:text-[20px] leading-relaxed text-gray-500 max-w-[640px] m-0"
            >
              For over four decades, Bapuji Surgicals has been delivering reliable surgical, hygiene, and wound care solutions trusted by hospitals, healthcare professionals, and distributors across India and beyond.
            </motion.p>
          </div>

          {/* Scroll Indicator */}
          <motion.div style={{ opacity: indicatorOpacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-gray-400 text-xs font-semibold uppercase tracking-widest">
            <span>Scroll to explore our journey</span>
            <motion.div 
              animate={{ y: [0, 12, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#18181b] rounded-full"
            />
          </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — STORY SECTION */}
      <section className="relative w-full max-w-[1440px] mx-auto px-6 md:px-12 py-32 md:py-48 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 md:gap-24 box-border">
        {/* Left Sticky Column */}
        <div className="lg:sticky lg:top-[140px] lg:self-start flex flex-col items-start">
          <span className="text-xs font-bold text-[#0976BC] uppercase tracking-wider mb-6">OUR FOUNDATION</span>
          <h2 className="text-[36px] md:text-[56px] leading-[1.05] font-semibold tracking-tight text-neutral-900 m-0">
            Healthcare is built on precision, safety, and trust. So are we.
          </h2>
        </div>

        {/* Right Content Column */}
        <div className="flex flex-col gap-16">
          <p className="text-[20px] md:text-[24px] leading-relaxed text-gray-600 m-0">
            Founded in Bengaluru in 1980, Bapuji Surgicals began with a simple mission — to create dependable healthcare products that improve patient care and support medical professionals every day.
          </p>

          <p className="text-base leading-relaxed text-gray-500 m-0 -mt-10">
            What started as a focused surgical supplies company has evolved into a trusted manufacturing partner serving hospitals, distributors, and healthcare institutions with high-quality medical and hygiene solutions.
          </p>

          {/* Cards */}
          <div className="flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0.2, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="bg-white border border-neutral-100 rounded-3xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col gap-4 hover:translate-y-[-4px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 text-lg font-bold text-neutral-900">
                <CheckCircle2 className="text-[#0976BC]" size={22} />
                <span>Decades of Trust</span>
              </div>
              <p className="text-base leading-relaxed text-gray-500 m-0">
                Over 45 years of continuous production under strict quality guidelines, delivering surgical supplies to top-tier hospitals and clinic networks.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0.2, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-white border border-neutral-100 rounded-3xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col gap-4 hover:translate-y-[-4px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 text-lg font-bold text-neutral-900">
                <Factory className="text-[#0976BC]" size={22} />
                <span>Precision Manufacturing</span>
              </div>
              <p className="text-base leading-relaxed text-gray-500 m-0">
                We leverage cleanroom facilities conforming to Class 100 guidelines to build certified surgical, wound, and patient hygiene supplies.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0.2, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white border border-neutral-100 rounded-3xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col gap-4 hover:translate-y-[-4px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 text-lg font-bold text-neutral-900">
                <ShieldCheck className="text-[#0976BC]" size={22} />
                <span>Global Supply Network</span>
              </div>
              <p className="text-base leading-relaxed text-gray-500 m-0">
                Our products are compliant with international validation guidelines (ISO 13485), facilitating bulk logistics shipments across continents.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FULLSCREEN STATEMENT */}
      <section ref={statementRef} className="relative w-full min-h-screen py-40 md:py-48 bg-[#0A0A0A] text-white flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        {/* Soft rotating background glow */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          className="absolute w-[80%] h-[80%] bg-[#0976BC]/10 rounded-full blur-[140px] pointer-events-none"
        />

        <div className="relative z-10 max-w-[960px] mx-auto flex flex-col items-center gap-8">
          <motion.h2 
            style={{ scale: statementScaleSpring, opacity: statementOpacity }}
            className="text-[40px] sm:text-[72px] md:text-[96px] leading-[0.95] font-bold tracking-tight text-white m-0"
          >
            45+ Years of<br />
            Manufacturing Excellence.
          </motion.h2>
          <motion.p 
            style={{ opacity: statementOpacity }}
            className="text-lg sm:text-[20px] leading-relaxed text-neutral-300 max-w-[680px] m-0"
          >
            From surgical dressings and wound care to sterilization packaging and hygiene products, every product is built with uncompromising attention to quality, safety, and consistency.
          </motion.p>
        </div>
      </section>

      {/* SECTION 4 — SPLIT LAYOUT */}
      <section className="relative w-full max-w-[1440px] mx-auto px-6 md:px-12 py-32 md:py-48 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center box-border">
        {/* Left Column: Visual */}
        <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-[600px] bg-neutral-200 group">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80" 
            alt="Sterile cleanroom manufacturing" 
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8 md:p-10 text-white">
            <div>
              <div className="text-[20px] md:text-[24px] font-bold">State-of-the-Art Operations</div>
              <p className="m-2 opacity-80 text-sm md:text-base">Class 100 cleanrooms certified to international standards.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Capabilities */}
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#0976BC] uppercase tracking-wider mb-6">WHAT WE DO</span>
          <h2 className="text-[36px] md:text-[56px] leading-[1.05] font-semibold tracking-tight text-neutral-900 mb-6 m-0">
            Designed for Modern Healthcare Needs.
          </h2>
          <p className="text-[16px] md:text-[18px] leading-relaxed text-gray-500 mb-10 m-0">
            Our product ecosystem supports healthcare providers with dependable solutions across surgical care, infection prevention, patient hygiene, and medical packaging. We manufacture products that are engineered for performance, safety, and reliability — helping healthcare systems operate with confidence.
          </p>

          <div className="flex flex-col">
            {capabilities.map((feature, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0.3, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex items-center justify-between py-5 border-b border-neutral-100 cursor-pointer group hover:pl-3 hover:border-[#0976BC] transition-all duration-300"
              >
                <div>
                  <div className="text-lg md:text-[20px] font-semibold text-neutral-900 group-hover:text-[#0976BC] transition-colors duration-300">{feature.name}</div>
                  <p className="m-1 text-gray-500 text-xs md:text-sm">{feature.desc}</p>
                </div>
                <ArrowRight className="text-neutral-300 group-hover:text-[#0976BC] group-hover:translate-x-1 transition-all duration-300" size={20} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4.5 — CLINICAL CUSTODIAN PINNED SECTION (Framer Motion Clip Path Clone) */}
      <section ref={custodianTrackRef} className="relative w-full h-[200vh]">
        <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-white">
          
          {/* Vertical Progress Bar */}
          <div className="absolute left-1/2 top-0 w-[1px] h-full bg-neutral-100 z-20">
            <motion.div style={{ height: custodianProgressHeight }} className="w-full bg-[#18181b]" />
          </div>

          {/* Pinned Image Frame with Zoom */}
          <motion.div 
            style={{ clipPath: clipPathStyle }}
            className="absolute inset-0 w-full h-full z-10 overflow-hidden"
          >
            <motion.img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&auto=format&fit=crop&q=80" 
              alt="Medical laboratory compounding" 
              style={{ scale: custodianImageScale }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
          </motion.div>

          {/* Split Text Content */}
          <div className="relative z-30 w-full max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 md:gap-32 text-white pointer-events-none">
            <div className="text-[32px] sm:text-[56px] md:text-[60px] leading-[1.05] font-semibold tracking-tight">
              {leftWords.map((word, idx) => (
                <motion.span 
                  key={idx}
                  style={{ opacity: leftWordOpacities[idx] }}
                  className="inline-block mr-3"
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <div className="text-lg sm:text-[22px] leading-relaxed text-neutral-300 flex items-end">
              <div>
                {rightWords.map((word, idx) => (
                  <motion.span 
                    key={idx}
                    style={{ opacity: rightWordOpacities[idx] }}
                    className="inline-block mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5 — PARALLAX / STICKY SECTION */}
      <section className="relative w-full max-w-[1440px] mx-auto px-6 md:px-12 py-32 md:py-48 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 md:gap-24 border-t border-neutral-100 box-border">
        {/* Left Sticky Column */}
        <div className="lg:sticky lg:top-[140px] lg:self-start flex flex-col items-start">
          <span className="text-xs font-bold text-[#0976BC] uppercase tracking-wider mb-6">OUR APPROACH</span>
          <h2 className="text-[32px] md:text-[56px] leading-[1.05] font-bold tracking-tight text-neutral-900 m-0">
            Quality isn’t a department.<br />
            <span className="text-[#0976BC]">It’s our culture.</span>
          </h2>
        </div>

        {/* Right Content Column */}
        <div className="flex flex-col justify-center gap-6">
          <p className="text-[20px] md:text-[22px] leading-relaxed text-gray-600 m-0">
            Every process at Bapuji Surgicals is guided by strict quality protocols, modern manufacturing practices, and a commitment to delivering healthcare products that meet global standards.
          </p>
          <p className="text-base font-bold text-neutral-900 m-0">
            Because in healthcare, every detail matters.
          </p>
        </div>
      </section>

      {/* SECTION 6 — METRICS SECTION */}
      <section className="relative w-full max-w-[1440px] mx-auto px-6 md:px-12 py-32 box-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0.3, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="bg-white border border-neutral-100 rounded-3xl p-10 flex flex-col gap-4 shadow-[0_10px_35px_rgba(0,0,0,0.01)] hover:translate-y-[-6px] hover:shadow-[0_20px_45px_rgba(0,0,0,0.03)] hover:border-[#0976BC]/15 transition-all duration-300"
            >
              <div className={`font-bold text-[#0976BC] leading-none ${metric.num.length > 5 ? 'text-[32px] md:text-[38px] mt-2' : 'text-[48px] md:text-[56px]'}`}>{metric.num}</div>
              <div className="text-lg md:text-xl font-bold text-neutral-900">{metric.title}</div>
              <p className="text-gray-500 text-sm leading-relaxed m-0">{metric.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — VISION SECTION */}
      <section className="relative w-full max-w-[1440px] mx-auto px-6 md:px-12 py-32 flex flex-col gap-10 box-border">
        <span className="text-xs font-bold text-[#0976BC] uppercase tracking-wider">OUR VISION</span>
        <motion.h2 
          initial={{ opacity: 0.3, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[32px] sm:text-[56px] md:text-[72px] leading-[1.05] font-bold tracking-tight text-neutral-900 max-w-[1080px] m-0 -mt-4"
        >
          To make healthcare safer, cleaner, and more accessible through innovative medical and hygiene solutions.
        </motion.h2>
        <p className="text-[18px] md:text-[20px] leading-relaxed text-gray-500 max-w-[800px] m-0 -mt-4">
          We continue to evolve with changing healthcare needs by investing in better manufacturing, advanced materials, and customer-focused innovation — while staying committed to the values that built our legacy.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-8 h-auto lg:h-[480px] mt-8">
          <div className="rounded-3xl overflow-hidden relative h-[300px] lg:h-full">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80" 
              alt="Medical laboratory compounding" 
              className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
            />
          </div>
          <div className="rounded-3xl overflow-hidden relative h-[300px] lg:h-full">
            <img 
              src="https://images.unsplash.com/photo-1620271937166-4aa8d8d3a74f?w=800&auto=format&fit=crop&q=80" 
              alt="Sterile patient care wipes pack" 
              className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* SECTION 8 — FINAL CTA */}
      <section className="relative w-full py-40 md:py-48 bg-[#F8FAFB] text-center flex flex-col items-center justify-center gap-10 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute w-[70%] h-[70%] bg-[#0976BC]/3 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-[880px] mx-auto flex flex-col items-center gap-6">
          <motion.h2 
            initial={{ opacity: 0.3, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[40px] sm:text-[72px] md:text-[88px] leading-[1.05] font-bold tracking-tight text-neutral-900 m-0"
          >
            Driven by Care.<br />
            Powered by Trust.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0.3, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-[18px] md:text-[20px] leading-relaxed text-gray-500 max-w-[620px] m-0"
          >
            Partner with Bapuji Surgicals for healthcare solutions built on decades of experience, quality manufacturing, and long-term reliability.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0.3, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5 z-10 w-full sm:w-auto px-6 max-w-[320px] sm:max-w-none box-border"
        >
          <Link href="/catalog" className="h-14 px-9 bg-[#0A0A0A] hover:bg-neutral-800 text-white font-semibold rounded-full flex items-center justify-center no-underline hover:scale-102 transition-all duration-300">
            Explore Products
          </Link>
          <Link href="/oem" className="h-14 px-9 bg-transparent hover:bg-neutral-50 text-neutral-900 border border-neutral-200 font-semibold rounded-full flex items-center justify-center no-underline hover:scale-102 transition-all duration-300">
            Contact Us
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPageNext;
