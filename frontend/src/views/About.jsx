'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, ShieldCheck, Truck, ArrowRight, Check, Factory, Microscope, Layers3 } from 'lucide-react';
import Link from 'next/link';
import { HeroContainer, HeroContent, HeroMedia, HeroFeatures, HeroFloatingCard } from '../components/HeroContainer';

// Smooth counting up animation with exponent ease-out curve
const RollingNumber = ({ value, suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const end = parseInt(value, 10);
    if (isNaN(end)) {
      setDisplayValue(value);
      return;
    }

    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentValue = Math.floor(easeProgress * end);
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
};

const WordReveal = ({ text }) => {
  const words = text.split(" ");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.04 } }
      }}
      style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.28em" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const StorySection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 15 });
  const [currentStage, setCurrentStage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      if (v < 0.33) setCurrentStage(0);
      else if (v < 0.66) setCurrentStage(1);
      else setCurrentStage(2);
    });
  }, [scrollYProgress]);

  const stages = [
    {
      id: '01',
      title: 'A Legacy of Precision',
      text: "Established in 1980, Bapuji Surgicals has built a strong reputation as a leading manufacturer and supplier of top-notch surgical and healthcare products. With over 45 years of industry expertise, we specialize in crafting Surgical Dressings.",
      img: '/img/medical_factory_hero.png'
    },
    {
      id: '02',
      title: 'Innovation and Quality',
      text: "Our unwavering dedication to quality shines through in every single item we produce. By leveraging cutting-edge technology and adhering to rigorous quality assurance protocols, we ensure that our offerings consistently meet the most stringent industry benchmarks.",
      img: '/img/about_quality.png'
    },
    {
      id: '03',
      title: 'Expanding Healthcare Reach',
      text: "Our diverse product portfolio caters to a wide spectrum of sectors, ranging from healthcare providers to distributors. We take immense pride in delivering groundbreaking wound care and hygiene solutions that contribute to enhanced patient outcomes.",
      img: '/img/about_customization.png'
    }
  ];

  const sectionScale = useTransform(scrollYProgress, [0.95, 1], [1, 0.98]);
  const sectionOpacity = useTransform(scrollYProgress, [0.95, 1], [1, 0.9]);

  if (isMobile) {
    return (
      <section style={{ backgroundColor: '#ffffff', padding: '60px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <span style={{ color: '#0976BC', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>Our Heritage</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '8px', lineHeight: 1.1, color: '#000', letterSpacing: '-0.02em' }}>
            A legacy of precision since 1980.
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
          {stages.map((stage, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div style={{ width: '100%', height: '240px', borderRadius: '16px', overflow: 'hidden' }}>
                <img loading="lazy" src={stage.img} alt={stage.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: '#000' }}>{stage.id}. {stage.title}</h3>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'rgba(0,0,0,0.7)', margin: 0 }}>{stage.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} style={{ height: '300vh', position: 'relative', backgroundColor: '#ffffff', zIndex: 10 }}>
      <motion.div 
        className="story-sticky-container"
        style={{ 
          position: 'sticky', top: 0, height: '100vh', display: 'flex', overflow: 'hidden',
          scale: sectionScale, opacity: sectionOpacity
        }}
      >
        {/* Ambient Gradient Motion */}
        <motion.div 
          style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(9, 118, 188, 0.03) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Progress Rail (Left edge) */}
        <div style={{ width: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '120px 0', zIndex: 2, position: 'relative', borderRight: '1px solid rgba(0,0,0,0.03)' }}>
           <div style={{ position: 'relative', height: '100%', width: '2px', backgroundColor: 'rgba(0,0,0,0.05)' }}>
             <motion.div style={{ position: 'absolute', top: 0, width: '100%', backgroundColor: '#0976BC', height: useTransform(smoothProgress, [0, 1], ['0%', '100%']) }} />
             <motion.div 
               style={{
                 position: 'absolute', top: useTransform(smoothProgress, [0, 1], ['0%', '100%']), left: '-4px', width: '10px', height: '10px',
                 backgroundColor: '#0976BC', borderRadius: '50%', boxShadow: '0 0 15px rgba(9, 118, 188, 0.8)'
               }} 
             />
           </div>
        </div>

        {/* Story Text Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10vh 6vw', zIndex: 1, position: 'relative', justifyContent: 'center' }}>
          <div style={{ marginBottom: '60px' }}>
             <span style={{ color: '#0976BC', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>Our Heritage</span>
             <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 800, marginTop: '12px', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#000' }}>
               A legacy of precision<br />since 1980.
             </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '650px', position: 'relative' }}>
            {stages.map((stage, idx) => {
              const isActive = currentStage === idx;
              return (
                <motion.div 
                  key={idx} 
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0.2,
                    filter: isActive ? 'blur(0px)' : 'blur(10px)',
                    y: isActive ? 0 : 12,
                    scale: isActive ? 1 : 0.98
                  }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'flex', gap: '24px', willChange: 'opacity, filter, transform' }}
                >
                  <div style={{ color: isActive ? '#0976BC' : 'rgba(0,0,0,0.5)', fontWeight: 700, fontSize: '1.2rem', fontFamily: 'var(--font-display), sans-serif', transition: 'color 0.8s ease' }}>
                    {stage.id}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: '#000' }}>{stage.title}</h3>
                    <p style={{ fontSize: '1.15rem', lineHeight: 1.7, color: 'rgba(0, 0, 0, 0.8)', margin: 0, fontWeight: 400 }}>
                      {stage.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Image & Stats Column */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF9F6', zIndex: 1, borderLeft: '1px solid rgba(0,0,0,0.03)' }}>
          
          {/* Synchronized Images */}
          <div style={{ position: 'relative', width: '80%', height: '50vh', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
             {stages.map((stage, idx) => {
               const isActive = currentStage === idx;
               return (
                 <motion.img 
                   key={idx}
                   src={stage.img} 
                   alt={stage.title}
                   initial={false}
                   animate={{
                     opacity: isActive ? 1 : 0,
                     scale: isActive ? 1 : (currentStage > idx ? 1.05 : 1.1),
                     filter: isActive ? 'blur(0px)' : 'blur(10px)'
                   }}
                   transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                   style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, willChange: 'opacity, filter, transform' }}
                 />
               );
             })}
          </div>

          {/* Premium Count-Up Stats */}
          <div style={{ display: 'flex', gap: '40px', marginTop: '60px' }}>
             {[
               { label: "Experience", val: 45 },
               { label: "Partners", val: 500 },
               { label: "Portfolio", val: 14 }
             ].map((stat, i) => (
               <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
               >
                 <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(0,0,0,0.5)', fontWeight: 700 }}>{stat.label}</span>
                 <span style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0976BC', lineHeight: 1, letterSpacing: '-0.04em', fontFamily: 'var(--font-display), sans-serif' }}>
                    <RollingNumber value={stat.val} suffix="+" />
                 </span>
               </motion.div>
             ))}
          </div>

        </div>
      </motion.div>
    </section>
  );
};

const ModernHeritage = () => {
  const heritageStages = [
    {
      id: '01',
      title: 'A Legacy of Precision',
      text: "Established in 1980, Bapuji Surgicals has built a strong reputation as a leading manufacturer and supplier of dependable surgical and healthcare products.",
      meta: 'Since 1980',
      icon: Factory,
      image: '/img/medical_factory_hero.png'
    },
    {
      id: '02',
      title: 'Innovation and Quality',
      text: "Modern production methods and rigorous quality checks help every product meet demanding healthcare benchmarks with consistency.",
      meta: 'Quality systems',
      icon: Microscope,
      image: '/img/about_quality.png'
    },
    {
      id: '03',
      title: 'Expanding Healthcare Reach',
      text: "A broad portfolio supports hospitals, care providers, distributors, and specialized wound care needs with reliable supply depth.",
      meta: 'Clinical reach',
      icon: Layers3,
      image: '/img/about_customization.png'
    }
  ];

  const stats = [
    { label: "Years Experience", val: 45 },
    { label: "Partner Network", val: 500 },
    { label: "Product Portfolio", val: 14 }
  ];

  const [activeStage, setActiveStage] = useState(0);

  return (
    <section className="modern-heritage-section">
      <style dangerouslySetInnerHTML={{ __html: `
        .modern-heritage-section {
          padding: clamp(80px, 9vw, 132px) 0;
          background:
            linear-gradient(180deg, #ffffff 0%, #f7fbfd 50%, #ffffff 100%);
          position: relative;
          overflow: hidden;
        }
        .modern-heritage-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(9, 118, 188, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(9, 118, 188, 0.045) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(circle at 30% 35%, rgba(0,0,0,0.72), transparent 62%);
          pointer-events: none;
        }
        .mh-container {
          width: min(96vw, 1720px);
          max-width: none;
          margin: 0 auto;
          padding: 0 clamp(18px, 2.2vw, 36px);
          display: grid;
          grid-template-columns: minmax(480px, 0.92fr) minmax(620px, 1.08fr);
          gap: clamp(42px, 5vw, 96px);
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .mh-left {
          position: sticky;
          top: 104px;
          align-self: start;
        }
        .mh-title-wrap {
          margin-bottom: 34px;
        }
        .mh-eyebrow {
          color: #0976BC;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 16px;
        }
        .mh-title {
          font-size: clamp(2.5rem, 4vw, 4.9rem);
          font-weight: 800;
          line-height: 1.04;
          letter-spacing: 0;
          color: #071923;
          margin: 0;
          white-space: nowrap;
        }
        .mh-lead {
          max-width: 620px;
          margin: 22px 0 0;
          color: rgba(7, 25, 35, 0.68);
          font-size: 1.08rem;
          line-height: 1.72;
        }
        .mh-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 28px;
        }
        .mh-stat-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 112px;
          padding: 18px;
          border: 1px solid rgba(7, 25, 35, 0.08);
          background: rgba(255, 255, 255, 0.78);
          box-shadow: 0 18px 42px rgba(9, 118, 188, 0.06);
          justify-content: center;
        }
        .mh-stat-num {
          font-size: clamp(2.1rem, 3.4vw, 3.15rem);
          font-weight: 800;
          color: #0976BC;
          line-height: 1;
          font-family: var(--font-display), sans-serif;
        }
        .mh-stat-label {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 800;
          color: rgba(7, 25, 35, 0.54);
        }

        .mh-left-image {
          width: 100%;
          height: clamp(360px, 32vw, 520px);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 34px 80px rgba(7, 25, 35, 0.14);
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.7);
        }
        .mh-left-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, transparent 45%, rgba(4, 21, 32, 0.62)),
            linear-gradient(90deg, rgba(9, 118, 188, 0.24), transparent 52%);
          pointer-events: none;
        }
        .mh-left-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .mh-left-image:hover img {
          transform: scale(1.05);
        }
        .mh-image-caption {
          position: absolute;
          left: 20px;
          right: 20px;
          bottom: 18px;
          z-index: 2;
          color: #fff;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-end;
        }
        .mh-image-caption strong {
          display: block;
          font-size: 1.05rem;
          line-height: 1.2;
        }
        .mh-image-caption span {
          display: block;
          margin-top: 6px;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.76);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 800;
        }
        
        .mh-right {
          display: grid;
          gap: 14px;
          position: relative;
          margin-top: clamp(34px, 4vw, 72px);
        }
        .mh-card {
          background: rgba(255,255,255,0.82);
          border-radius: 8px;
          padding: clamp(26px, 3.1vw, 44px);
          border: 1px solid rgba(7, 25, 35, 0.08);
          box-shadow: 0 16px 52px rgba(7, 25, 35, 0.055);
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease, border-color 0.45s ease, background-color 0.45s ease;
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 22px;
          align-items: start;
          cursor: default;
        }
        .mh-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background: #0976BC;
          transform: scaleY(var(--reveal, 0.18));
          transform-origin: top;
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mh-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 0%, rgba(9, 118, 188, 0.08) 45%, transparent 70%);
          transform: translateX(-105%);
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }
        .mh-card.is-active,
        .mh-card:hover {
          --reveal: 1;
          transform: translateX(-10px);
          background: #ffffff;
          border-color: rgba(9, 118, 188, 0.22);
          box-shadow: 0 28px 70px rgba(7, 25, 35, 0.1);
        }
        .mh-card.is-active::after,
        .mh-card:hover::after {
          transform: translateX(105%);
        }
        .mh-card-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin: 0;
        }
        .mh-card-num {
          background: rgba(9, 118, 188, 0.08);
          color: #0976BC;
          width: 54px;
          height: 54px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
        }
        .mh-card-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #25A780;
          background: rgba(37, 167, 128, 0.1);
        }
        .mh-card-copy {
          min-width: 0;
        }
        .mh-card-meta {
          display: block;
          color: #0976BC;
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          font-weight: 800;
          margin-bottom: 8px;
        }
        .mh-card-title {
          font-size: clamp(1.25rem, 2vw, 1.75rem);
          font-weight: 800;
          color: #111;
          margin: 0 0 12px;
          line-height: 1.16;
        }
        .mh-card-text {
          font-size: clamp(1.05rem, 1.15vw, 1.2rem);
          line-height: 1.72;
          color: rgba(7, 25, 35, 0.66);
          margin: 0;
        }

        @media (min-width: 1600px) {
          .mh-container {
            width: min(97vw, 1840px);
            grid-template-columns: minmax(560px, 0.95fr) minmax(760px, 1.05fr);
          }
        }

        @media (max-width: 1023px) {
          .mh-container {
            width: min(100%, 920px);
            grid-template-columns: 1fr;
            gap: 60px;
          }
          .mh-left {
            position: relative;
            top: 0;
          }
          .mh-stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          }
          .mh-title {
            white-space: normal;
          }
          .mh-right {
            margin-top: 0;
          }
        }
        @media (max-width: 767px) {
          .mh-card {
            transform: none !important;
            grid-template-columns: 1fr;
          }
          .mh-card-header {
            flex-direction: row;
            justify-content: space-between;
          }
          .mh-stats-grid {
            grid-template-columns: 1fr;
          }
          .mh-left-image {
            height: 300px;
          }
        }
      `}} />

      <div className="mh-container">
        {/* Left Sticky Side */}
        <div className="mh-left">
          <motion.div 
            className="mh-title-wrap"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="mh-eyebrow">Our Heritage</span>
            <h2 className="mh-title">
              A legacy of precision since 1980.
            </h2>
            <p className="mh-lead">
              Four decades of surgical supply experience, redesigned around modern manufacturing, reliable quality systems, and healthcare partnerships that scale.
            </p>
          </motion.div>

          <div className="mh-stats-grid">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                className="mh-stat-box"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              >
                <span className="mh-stat-num">
                  <RollingNumber value={stat.val} suffix="+" />
                </span>
                <span className="mh-stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mh-left-image"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <motion.img
              key={activeStage}
              loading="lazy"
              src={heritageStages[activeStage].image}
              alt={heritageStages[activeStage].title}
              initial={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="mh-image-caption">
              <div>
                <strong>{heritageStages[activeStage].title}</strong>
                <span>{heritageStages[activeStage].meta}</span>
              </div>
              <span>{heritageStages[activeStage].id}</span>
            </div>
          </motion.div>
        </div>

        {/* Right Scroll Side */}
        <div className="mh-right">
          {heritageStages.map((stage, idx) => (
            <motion.div 
              key={idx}
              className={`mh-card ${activeStage === idx ? 'is-active' : ''}`}
              style={{ '--idx': idx }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              onViewportEnter={() => setActiveStage(idx)}
              onMouseEnter={() => setActiveStage(idx)}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {(() => {
                const Icon = stage.icon;
                return (
              <div className="mh-card-header">
                <div className="mh-card-num">{stage.id}</div>
                <div className="mh-card-icon"><Icon size={20} /></div>
              </div>
                );
              })()}
              <div className="mh-card-copy">
                <span className="mh-card-meta">{stage.meta}</span>
                <h3 className="mh-card-title">{stage.title}</h3>
              <p className="mh-card-text">{stage.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const heroVideoRef = useRef(null);
  const pillars = [
    {
      title: 'Customization',
      text: 'We customize our products to suit your specific needs - from size and material to packaging and branding - ensuring reliable, ready-to-use solutions for every healthcare setting.',
      icon: Sparkles,
      img: '/img/about_customization.png'
    },
    {
      title: 'Quality',
      text: 'We prioritize quality at every step, using premium materials and strict quality control to ensure our products are safe, effective, and consistent with medical standards.',
      icon: ShieldCheck,
      img: '/img/about_quality.png'
    },
    {
      title: 'Delivery',
      text: 'We ensure timely and reliable delivery with well-managed logistics, so you get your products safely and on schedule, every time.',
      icon: Truck,
      img: '/img/about_delivery.png'
    }
  ];



  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
    }
  };

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    const startAt = 0;
    const endAt = 163;

    const playSegment = () => {
      if (video.currentTime < startAt || video.currentTime >= endAt) {
        video.currentTime = startAt;
      }
      video.muted = true;
      video.play().catch(() => {});
    };

    const handleTimeUpdate = () => {
      if (video.currentTime >= endAt) {
        video.currentTime = startAt;
        video.play().catch(() => {});
      }
    };

    video.addEventListener('loadedmetadata', playSegment);
    video.addEventListener('timeupdate', handleTimeUpdate);
    playSegment();

    return () => {
      video.removeEventListener('loadedmetadata', playSegment);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  return (
    <div className="about-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .about-page {
          background-color: #ffffff;
          color: #000000;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
          padding-bottom: 120px;
        }

        .about-page .about-video-hero .cinematic-content {
          transform: translateY(46px);
        }

        .about-main {
          max-width: 1000px;
          margin: -60px auto 0 auto;
          padding: 0 40px;
          box-sizing: border-box;
          position: relative;
          z-index: 5;
        }

        .about-desc-card {
          border: 1px solid rgba(0, 0, 0, 0.04);
          background-color: #FAF9F6;
          border-radius: 24px;
          padding: 60px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.01);
        }

        .about-p {
          font-size: 1.15rem;
          line-height: 1.7;
          color: rgba(0, 0, 0, 0.7);
          margin: 0;
        }

        .about-p strong {
          color: #000000;
          font-weight: 700;
        }

        /* Pillars Section */
        .pillars-section {
          max-width: 1200px;
          margin: 120px auto 0 auto;
          padding: 0 40px;
          box-sizing: border-box;
        }

        .section-title {
          font-family: var(--font-display), sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 50px;
          color: #000000;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-title::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 22px;
          background-color: #0976BC;
          border-radius: 2px;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .pillar-card {
          border: 1px solid rgba(0, 0, 0, 0.05);
          background-color: #ffffff;
          border-radius: 20px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .pillar-card:hover {
          transform: translateY(-4px);
          border-color: rgba(9, 118, 188, 0.15);
          box-shadow: 0 20px 40px rgba(9, 118, 188, 0.03);
        }

        .pillar-img-container {
          width: 100%;
          height: 180px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .pillar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .pillar-card:hover .pillar-img {
          transform: scale(1.05);
        }

        .pillar-icon-box {
          background-color: rgba(9, 118, 188, 0.06);
          color: #0976BC;
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .pillar-card:hover .pillar-icon-box {
          background-color: #0976BC;
          color: #ffffff;
          transform: scale(1.05);
        }

        .pillar-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #000000;
          letter-spacing: -0.01em;
        }

        .pillar-text {
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(0, 0, 0, 0.65);
          margin: 0;
        }

        /* Stats Section */
        .stats-section {
          background-color: #FAF9F6;
          border-top: 1px solid rgba(0,0,0,0.02);
          border-bottom: 1px solid rgba(0,0,0,0.02);
          margin-top: 120px;
          padding: 80px 24px;
        }

        .stats-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 60px;
          text-align: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stat-number {
          font-family: var(--font-display), sans-serif;
          font-size: clamp(3rem, 6vw, 4.5rem);
          font-weight: 800;
          color: #0976BC;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .stat-label {
          font-size: 1.05rem;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* CTA Section */
        .cta-section {
          max-width: 800px;
          margin: 120px auto 0 auto;
          padding: 0 24px;
          text-align: center;
        }

        .cta-title {
          font-family: var(--font-display), sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
        }

        .cta-desc {
          font-size: 1.1rem;
          color: rgba(0, 0, 0, 0.55);
          margin-bottom: 36px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .cta-btn-primary {
          background-color: #000000;
          color: #ffffff;
          padding: 14px 28px;
          border-radius: 30px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .cta-btn-primary:hover {
          background-color: #0976BC;
          transform: translateY(-1px);
        }

        .cta-btn-secondary {
          border: 1px solid rgba(0,0,0,0.1);
          color: #000000;
          padding: 14px 28px;
          border-radius: 30px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .cta-btn-secondary:hover {
          background-color: rgba(0,0,0,0.02);
          border-color: rgba(0,0,0,0.25);
          transform: translateY(-1px);
        }

        @media (max-width: 1023px) {
          .about-hero-split {
            grid-template-columns: 1fr;
            padding: 140px 40px 60px 40px;
            gap: 40px;
          }
          .about-hero-stats {
            gap: 24px;
          }
          .pillars-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .stats-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 767px) {
          .about-hero-split {
            padding: 120px 24px 40px 24px;
          }
          .about-hero-btns {
            flex-direction: column;
          }
          .about-hero-btn-primary, .about-hero-btn-secondary {
            width: 100%;
            justify-content: center;
          }
          .about-hero-stats {
            flex-direction: column;
            gap: 20px;
          }
          .about-desc-card {
            padding: 40px 24px;
          }
          .pillars-section {
            padding: 0 24px;
          }
          .stats-container {
            padding: 0 24px;
          }
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          .cta-btn-primary, .cta-btn-secondary {
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }
        @media (max-width: 1023px) {
          .story-split {
            flex-direction: column !important;
          }
          .story-left-col {
            flex: none !important;
            height: 50vh;
            padding: 32px 24px !important;
          }
          .story-paragraphs {
            gap: 20px !important;
          }
          .story-paragraphs p {
            font-size: 1.1rem !important;
          }
          .story-right-col {
            flex: none !important;
            height: 50vh;
            padding: 24px !important;
          }
          .story-right-visual {
            display: none !important;
          }
          .story-right-content {
            gap: 24px !important;
            justify-content: center !important;
          }
          .story-right-stats {
            flex-direction: row !important;
            flex-wrap: wrap;
            gap: 20px !important;
          }
          .story-rail {
            display: none !important;
          }
        }

        /* Horizontal stats row below narrative card */
        .about-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 40px;
          width: 100%;
        }

        .about-stat-card {
          border: 1px solid rgba(0, 0, 0, 0.04);
          background-color: #FAF9F6;
          border-radius: 24px;
          padding: 36px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.01);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .about-stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(9, 118, 188, 0.15);
          box-shadow: 0 15px 30px rgba(9, 118, 188, 0.03);
        }

        .about-stat-card::after {
          content: '';
          position: absolute;
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(9, 118, 188, 0.05) 0%, transparent 70%);
          top: -30px;
          right: -30px;
          pointer-events: none;
        }

        .about-stat-card-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: rgba(0, 0, 0, 0.45);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .about-stat-card-number {
          font-family: var(--font-display), sans-serif;
          font-size: 3.2rem;
          font-weight: 800;
          color: #0976BC;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        @media (max-width: 767px) {
          .about-stats-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}} />

      {/* Cinematic Hero Section aligned like Home page */}
      <div className="cinematic-hero-wrapper">
        <div 
          className="cinematic-hero-container about-video-hero"
          style={{
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#010d16'
          }}
        >
          <video
            ref={heroVideoRef}
            className="about-hero-video"
            src="/video/bapuji-corporate-hero.mp4"
            muted
            autoPlay
            playsInline
            preload="metadata"
            aria-label="Bapuji Surgicals corporate video"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 78%',
              transform: 'scale(1.16)',
              zIndex: 0
            }}
          />
          {/* Premium dark gradient overlay for text legibility */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(1, 13, 22, 0.78) 0%, rgba(1, 13, 22, 0.45) 38%, rgba(1, 13, 22, 0.10) 72%, rgba(1, 13, 22, 0.04) 100%)',
            zIndex: 1
          }} />
          
          {/* Black Edge Vignette */}
          <div className="cinematic-vignette" style={{ zIndex: 2 }} />
          
          {/* Procedural Film Grain Overlay */}
          <div className="film-grain" style={{ zIndex: 2 }} />

          {/* Left Column Content */}
          <div className="cinematic-content">
            <div className="cinematic-badge">
              <Check size={14} style={{ marginRight: '6px' }} /> Established in 1980
            </div>
            
            <h1 className="cinematic-title">
              Bapuji Surgicals<br />
              Trusted in Care
            </h1>
            
            <p className="cinematic-subtext">
              Providing precision surgical dressings, hygiene care, sterilization reels, and advanced wound care solutions to hospitals and distributors worldwide.
            </p>
            
            <div className="cinematic-actions">
              <Link href="/catalog" className="btn-cinematic-primary">
                Explore Products
              </Link>
              <Link href="/oem" className="btn-cinematic-secondary">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ModernHeritage />

      {/* Pillars Section */}
      <section className="pillars-section">
        <h2 className="section-title">Core Pillars</h2>
        <motion.div 
          className="pillars-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div key={idx} className="pillar-card" variants={itemVariants}>
                <div className="pillar-img-container">
                  <img loading="lazy" src={pillar.img} alt={pillar.title} className="pillar-img" />
                </div>
                <div className="pillar-icon-box">
                  <Icon size={24} />
                </div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-text">{pillar.text}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Stats integrated in split hero above */}

      {/* Final Call to Action */}
      <section className="cta-section">
        <h2 className="cta-title">Precision Consumables for Care</h2>
        <p className="cta-desc">
          Partner with Bapuji Surgicals for reliable medical dressings, hygiene items, and custom contract manufacturing.
        </p>
        <div className="cta-buttons">
          <Link href="/catalog" className="cta-btn-primary">
            Explore products
            <ArrowRight size={16} />
          </Link>
          <Link href="/oem" className="cta-btn-secondary">
            Start an OEM inquiry
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;

