import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ShieldCheck, Truck, ArrowRight, Check, Factory, Microscope, Layers3, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const handleScrollStage = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const height = containerRef.current.clientHeight;
      const viewportHeight = window.innerHeight;
      const totalScrollable = height - viewportHeight;

      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      setCurrentStage(Math.min(Math.floor(progress * 4), 3));
    };

    window.addEventListener('scroll', handleScrollStage);
    window.addEventListener('resize', handleScrollStage);
    handleScrollStage();

    return () => {
      window.removeEventListener('scroll', handleScrollStage);
      window.removeEventListener('resize', handleScrollStage);
    };
  }, []);

  const stageMedia = [
    {
      step: '01 Heritage',
      title: 'A legacy of precision since 1980',
      desc: 'Bapuji Surgicals began with a focused commitment to dependable surgical and healthcare products for hospitals, clinics, distributors, and care providers.',
      cta: 'Explore our legacy',
      image: '/img/about_hero_cleanroom.png'
    },
    {
      step: '02 Quality Systems',
      title: 'Every product moves through rigorous quality checks',
      desc: 'From material selection to final packing, our processes are built around safety, consistency, and the stringent benchmarks expected in healthcare.',
      cta: 'View quality pillars',
      image: '/img/about_quality.png'
    },
    {
      step: '03 Product Depth',
      title: 'Solutions across dressings, hygiene care, reels and pouches',
      desc: 'Our portfolio supports everyday clinical needs and advanced wound care requirements with reliable, ready-to-use medical consumables.',
      cta: 'Browse products',
      image: '/img/about_factory_modern.png'
    },
    {
      step: '04 Care Partnership',
      title: 'Built for long-term customer confidence',
      desc: 'We keep growing around one mission: raising the standard of care through integrity, dependable service, and enduring partnerships.',
      cta: 'Start a conversation',
      image: '/img/about_delivery.png'
    }
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const sectionScale = useTransform(scrollYProgress, [0.9, 1], [1, 0.98]);
  const sectionOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0.9]);

  return (
    <section
      ref={containerRef}
      className="dotted-bg about-home-scroll-section"
      style={{
        position: 'relative',
        height: '400vh',
        overflow: 'clip',
        backgroundColor: '#F5F3EF',
        zIndex: 10
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(9, 118, 188, 0.03) 0%, transparent 60%)',
          opacity: 0.5
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div
        className="about-home-scroll-sticky"
        style={{
          position: 'sticky',
          top: '70px',
          height: 'calc(100vh - 70px)',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 48px',
          overflow: 'hidden'
        }}
      >
        <motion.div
          className="about-home-scroll-inner"
          style={{
            display: 'flex',
            width: '100%',
            maxWidth: '1520px',
            margin: '0 auto',
            height: '85%',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '80px',
            flexDirection: 'row',
            padding: '0 12px',
            boxSizing: 'border-box',
            scale: sectionScale,
            opacity: sectionOpacity
          }}
          animate={{
            scale: currentStage === 3 ? 0.98 : 1,
            opacity: currentStage === 3 ? 0.95 : 1
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="about-home-scroll-image"
            style={{
              flex: 1.35,
              height: '100%',
              position: 'relative',
              borderRadius: '32px',
              overflow: 'hidden',
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(0,0,0,0.03)'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage}
                initial={{ scale: 1.15, opacity: 0, filter: 'blur(12px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                exit={{ scale: 1.08, opacity: 0, filter: 'blur(12px)' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  willChange: 'transform, opacity, filter'
                }}
              >
                <img
                  src={stageMedia[currentStage].image}
                  alt={stageMedia[currentStage].title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div
            className="about-home-scroll-copy"
            style={{
              flex: 1,
              display: 'flex',
              gap: '48px',
              maxWidth: '600px',
              height: '100%',
              alignItems: 'center'
            }}
          >
            <div
              className="about-home-scroll-rail"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '320px',
                justifyContent: 'space-between',
                position: 'relative',
                width: '4px'
              }}
            >
              <div style={{ position: 'absolute', top: 0, bottom: 0, width: '2px', backgroundColor: 'rgba(0,0,0,0.05)', zIndex: 0 }} />

              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '2px',
                  backgroundColor: '#0976BC',
                  zIndex: 1,
                  originY: 0
                }}
                animate={{ height: `${(currentStage / 3) * 100}%` }}
                transition={{ type: 'spring', stiffness: 50, damping: 15 }}
              />

              {[0, 1, 2, 3].map((step) => {
                const isActive = currentStage === step;
                const isCompleted = currentStage > step;

                return (
                  <div key={step} style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor: isActive || isCompleted ? '#0976BC' : '#E5E5E5',
                        borderColor: isActive ? 'rgba(9, 118, 188, 0.4)' : 'transparent',
                        scale: isActive ? 1.05 : 1
                      }}
                      transition={{
                        scale: isActive ? { duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } : { duration: 0.3 }
                      }}
                      style={{
                        width: isActive || isCompleted ? '24px' : '10px',
                        height: isActive || isCompleted ? '24px' : '10px',
                        borderRadius: '50%',
                        borderWidth: isActive ? '4px' : '0px',
                        borderStyle: 'solid',
                        boxShadow: isActive ? '0 0 20px rgba(9, 118, 188, 0.4)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <AnimatePresence>
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Check size={16} strokeWidth={3} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage}
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0 }}
                      style={{ willChange: 'transform, opacity, filter' }}
                    >
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        color: '#0976BC',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}>
                        {stageMedia[currentStage].step}
                      </span>
                    </motion.div>
                  </div>

                  <div style={{ overflow: 'hidden', paddingBottom: '4px' }}>
                    <motion.h3
                      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                      style={{
                        fontSize: '2.4rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        margin: 0,
                        lineHeight: '1.15',
                        letterSpacing: '-0.03em',
                        willChange: 'transform, opacity, filter'
                      }}
                    >
                      {stageMedia[currentStage].title}
                    </motion.h3>
                  </div>

                  <div style={{ overflow: 'hidden' }}>
                    <motion.p
                      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.15rem',
                        lineHeight: '1.7',
                        margin: 0,
                        willChange: 'transform, opacity, filter'
                      }}
                    >
                      {stageMedia[currentStage].desc}
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    style={{ marginTop: '24px' }}
                  >
                    <Link to={currentStage === 2 ? '/catalog' : currentStage === 3 ? '/contact' : '/about'} className="btn-cinematic-primary" style={{ display: 'inline-flex' }}>
                      {stageMedia[currentStage].cta}
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const About = () => {
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

  const storyHighlights = [
    {
      icon: Factory,
      title: 'Manufacturing legacy',
      text: 'Established in 1980, Bapuji Surgicals has grown into a trusted manufacturer and supplier of surgical dressings, hygiene care products, reels, pouches, labels, tags, and advanced wound dressings.'
    },
    {
      icon: Microscope,
      title: 'Quality-first systems',
      text: 'Every product is shaped by strict quality assurance, modern production methods, and dependable protocols that help our customers meet demanding healthcare benchmarks.'
    },
    {
      icon: Layers3,
      title: 'Broad product depth',
      text: 'Our portfolio supports hospitals, healthcare providers, and distributors with reliable solutions built for everyday clinical requirements and specialized care needs.'
    },
    {
      icon: HeartPulse,
      title: 'Care-led mission',
      text: 'As we grow, our focus remains clear: raise the standard of care through integrity, customer confidence, consistent service, and long-term partnerships.'
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

        .about-main {
          width: 100%;
          margin: -60px auto 0 auto;
          padding: 0 40px;
          box-sizing: border-box;
          position: relative;
          z-index: 5;
        }

        .about-story-section {
          max-width: 1180px;
          margin: 0 auto;
          border: 1px solid rgba(8, 42, 68, 0.08);
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(246, 250, 252, 0.92)),
            linear-gradient(90deg, rgba(9, 118, 188, 0.08), rgba(37, 167, 128, 0.06));
          border-radius: 8px;
          padding: clamp(28px, 5vw, 58px);
          box-shadow: 0 24px 80px rgba(11, 31, 48, 0.08);
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(280px, 0.82fr) minmax(0, 1.18fr);
          gap: clamp(28px, 5vw, 58px);
        }

        .about-story-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(9, 118, 188, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(9, 118, 188, 0.055) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: linear-gradient(120deg, rgba(0,0,0,0.65), transparent 70%);
          pointer-events: none;
        }

        .about-story-section::after {
          content: '';
          position: absolute;
          top: 0;
          left: -35%;
          width: 32%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.58), transparent);
          transform: skewX(-16deg);
          animation: aboutSheen 5.8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          pointer-events: none;
        }

        .about-story-intro,
        .about-story-list {
          position: relative;
          z-index: 2;
        }

        .about-story-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          border: 1px solid rgba(9, 118, 188, 0.16);
          background: rgba(255, 255, 255, 0.78);
          color: #075f98;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 0.74rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          box-shadow: 0 10px 24px rgba(9, 118, 188, 0.06);
        }

        .about-story-title {
          font-family: var(--font-display), sans-serif;
          font-size: clamp(2.4rem, 5vw, 4.7rem);
          font-weight: 800;
          line-height: 0.98;
          letter-spacing: 0;
          color: #071923;
          margin: 26px 0 18px;
        }

        .about-story-title span {
          color: #0976BC;
        }

        .about-story-lead {
          max-width: 430px;
          margin: 0;
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          line-height: 1.72;
          color: rgba(7, 25, 35, 0.68);
        }

        .about-story-proof {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 30px;
        }

        .about-proof-pill {
          border: 1px solid rgba(7, 25, 35, 0.08);
          background: rgba(255, 255, 255, 0.72);
          border-radius: 8px;
          padding: 14px;
          min-height: 88px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease;
        }

        .about-proof-pill:hover {
          transform: translateY(-4px);
          border-color: rgba(9, 118, 188, 0.22);
          box-shadow: 0 16px 34px rgba(9, 118, 188, 0.08);
        }

        .about-proof-value {
          font-family: var(--font-display), sans-serif;
          font-size: 1.9rem;
          font-weight: 800;
          line-height: 1;
          color: #071923;
        }

        .about-proof-label {
          margin-top: 10px;
          font-size: 0.78rem;
          font-weight: 700;
          color: rgba(7, 25, 35, 0.52);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .about-story-list {
          display: grid;
          gap: 14px;
        }

        .about-story-item {
          border: 1px solid rgba(7, 25, 35, 0.08);
          background: rgba(255, 255, 255, 0.82);
          border-radius: 8px;
          padding: 18px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 16px;
          align-items: flex-start;
          position: relative;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease;
        }

        .about-story-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 3px;
          height: 100%;
          background: linear-gradient(180deg, #0976BC, #25A780);
          transform: scaleY(0.28);
          transform-origin: top;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .about-story-item:hover {
          transform: translateX(6px);
          border-color: rgba(9, 118, 188, 0.2);
          box-shadow: 0 18px 44px rgba(11, 31, 48, 0.08);
        }

        .about-story-item:hover::before {
          transform: scaleY(1);
        }

        .about-story-icon {
          width: 46px;
          height: 46px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #0976BC;
          background: linear-gradient(135deg, rgba(9, 118, 188, 0.11), rgba(37, 167, 128, 0.1));
          border: 1px solid rgba(9, 118, 188, 0.12);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease, color 0.4s ease;
        }

        .about-story-item:hover .about-story-icon {
          transform: rotate(-4deg) scale(1.06);
          background: #0976BC;
          color: #ffffff;
        }

        .about-story-item h3 {
          margin: 0 0 8px;
          font-size: clamp(1rem, 1.7vw, 1.18rem);
          font-weight: 800;
          color: #071923;
          letter-spacing: 0;
        }

        .about-story-item p {
          margin: 0;
          font-size: 0.98rem;
          line-height: 1.68;
          color: rgba(7, 25, 35, 0.62);
        }

        @keyframes aboutSheen {
          0%, 42% {
            left: -38%;
          }
          76%, 100% {
            left: 108%;
          }
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

        .mh-card {
          background: #fff;
          border-radius: 24px;
          padding: 48px;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 10px 40px rgba(0,0,0,0.02);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
          position: sticky;
          top: calc(120px + var(--idx) * 20px);
          margin-bottom: 24px;
        }
        .mh-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 20px 50px rgba(9, 118, 188, 0.08);
          border-color: rgba(9, 118, 188, 0.1);
          z-index: 10;
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

        .mh-right {
          display: flex;
          flex-direction: column;
          gap: 32px;
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

        @media (max-width: 992px) {
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
          .about-story-section {
            grid-template-columns: 1fr;
          }
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
          .about-home-scroll-sticky {
            top: 64px !important;
            height: auto !important;
            min-height: calc(100vh - 64px) !important;
            padding: 28px 22px !important;
            align-items: flex-start !important;
          }
          .about-home-scroll-inner {
            flex-direction: column !important;
            height: auto !important;
            min-height: calc(100vh - 120px) !important;
            gap: 30px !important;
            justify-content: center !important;
          }
          .about-home-scroll-image {
            flex: none !important;
            width: 100% !important;
            height: min(46vh, 420px) !important;
            border-radius: 24px !important;
          }
          .about-home-scroll-copy {
            flex: none !important;
            width: 100% !important;
            max-width: 680px !important;
            height: auto !important;
            gap: 28px !important;
          }
          .about-home-scroll-rail {
            height: 240px !important;
          }
        }

        @media (max-width: 768px) {
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
          .about-main {
            padding: 0 16px;
            margin-top: -32px;
          }
          .about-story-section {
            padding: 28px 18px;
          }
          .about-story-proof {
            grid-template-columns: 1fr;
          }
          .about-story-item {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 16px;
          }
          .about-home-scroll-section {
            height: 360vh !important;
          }
          .about-home-scroll-sticky {
            padding: 22px 16px !important;
          }
          .about-home-scroll-inner {
            gap: 22px !important;
            padding: 0 !important;
          }
          .about-home-scroll-copy {
            gap: 20px !important;
          }
          .about-home-scroll-copy h3 {
            font-size: clamp(1.75rem, 8vw, 2.35rem) !important;
            letter-spacing: 0 !important;
          }
          .about-home-scroll-copy p {
            font-size: 1rem !important;
            line-height: 1.6 !important;
          }
          .about-home-scroll-rail {
            height: 220px !important;
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
        }

        /* Horizontal stats row below narrative card */
        .about-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          max-width: 1180px;
          margin: 40px auto 0;
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

        @media (max-width: 768px) {
          .about-stats-row {
            grid-template-columns: 1fr;
          gap: 20px;
          }
        }
      `}} />

      {/* Cinematic Hero Section aligned like Home page */}
      <div className="cinematic-hero-wrapper">
        <div 
          className="cinematic-hero-container"
          style={{
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: "url('/img/medical_factory_hero.png')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center'
          }}
        >
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
              <Link to="/catalog" className="btn-cinematic-primary">
                Explore Products
              </Link>
              <Link to="/oem" className="btn-cinematic-secondary">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Narrative Storytelling Section */}
      <StorySection />

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
                  <img src={pillar.img} alt={pillar.title} className="pillar-img" />
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
          <Link to="/catalog" className="cta-btn-primary">
            Explore products
            <ArrowRight size={16} />
          </Link>
          <Link to="/oem" className="cta-btn-secondary">
            Start an OEM inquiry
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
