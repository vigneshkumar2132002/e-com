'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Search, ShoppingBag, SlidersHorizontal, Sparkles, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const categories = [
  { id: 'all', label: 'All wipes' },
  { id: 'baby', label: 'Baby' },
  { id: 'personal', label: 'Personal' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'home', label: 'Home' },
  { id: 'pet', label: 'Pet' },
  { id: 'auto', label: 'Auto' }
];

const wipeProducts = [
  {
    _id: 'retail-baby-wipes-80',
    name: 'Baby Wipes',
    category: 'baby',
    use: 'Gentle daily care',
    b2cPrice: 149,
    pack: '80 wipes',
    image: '/img/wetwipes-cutouts/baby-wipes-cutout.png',
    description: 'Soft, alcohol-free wipes for infant care, travel bags and everyday family hygiene.',
    tags: ['Alcohol free', 'Soft touch']
  },
  {
    _id: 'retail-personal-wipes-30',
    name: 'Personal Care Wipes',
    category: 'personal',
    use: 'Freshness on the go',
    b2cPrice: 99,
    pack: '30 wipes',
    image: '/img/wetwipes-cutouts/personal-wipes-cutout.png',
    description: 'Compact personal hygiene wipes for travel, work, gym bags and daily freshness.',
    tags: ['Travel pack', 'Daily use']
  },
  {
    _id: 'retail-women-wipes-30',
    name: 'Women Wipes',
    category: 'personal',
    use: 'Personal freshness',
    b2cPrice: 119,
    pack: '30 wipes',
    image: '/img/wetwipes-cutouts/women-wipes-cutout.png',
    description: 'Gentle cleansing wipes made for personal care routines and convenient everyday use.',
    tags: ['Gentle care', 'Fresh feel']
  },
  {
    _id: 'retail-men-wipes-30',
    name: 'Men Wipes',
    category: 'personal',
    use: 'Grooming essentials',
    b2cPrice: 129,
    pack: '30 wipes',
    image: '/img/wetwipes-cutouts/men-wipes-cutout.png',
    description: 'Larger grooming wipes for commute, post-workout freshness and quick cleanups.',
    tags: ['Grooming', 'Post workout']
  },
  {
    _id: 'retail-makeup-wipes-25',
    name: 'Makeup Remover Wipes',
    category: 'beauty',
    use: 'Beauty cleansing',
    b2cPrice: 139,
    pack: '25 wipes',
    image: '/img/catalog-wipes/makeup-remover-wipes-cutout.png',
    description: 'Soft facial wipes for makeup removal, cleansing and simple night-time routines.',
    tags: ['Face care', 'Soft cleanse']
  },
  {
    _id: 'retail-after-wax-wipes-20',
    name: 'After Wax Wipes',
    category: 'beauty',
    use: 'Post-wax comfort',
    b2cPrice: 89,
    pack: '20 wipes',
    image: '/img/catalog-wipes/after-wax-wipes-cutout.png',
    description: 'Convenient post-wax wipes for salon kits, personal grooming and skin cleanup.',
    tags: ['Salon care', 'Soothing']
  },
  {
    _id: 'retail-after-shave-wipes-20',
    name: 'After Shave Wipes',
    category: 'beauty',
    use: 'Shaving cleanup',
    b2cPrice: 89,
    pack: '20 wipes',
    image: '/img/catalog-wipes/after-shave-wipes-cutout.png',
    description: 'Refreshing wipes for shaving routines, grooming pouches and quick face cleanup.',
    tags: ['Refresh', 'Grooming']
  },
  {
    _id: 'retail-pet-wipes-60',
    name: 'Pet Wipes',
    category: 'pet',
    use: 'Coat and paw care',
    b2cPrice: 169,
    pack: '60 wipes',
    image: '/img/wetwipes-cutouts/pet-wipes-cutout.png',
    description: 'Pet-safe grooming wipes for paws, coat touch-ups and after-walk cleanup.',
    tags: ['Paw care', 'Pet safe']
  },
  {
    _id: 'retail-household-wipes-80',
    name: 'Household Wipes',
    category: 'home',
    use: 'Surface cleaning',
    b2cPrice: 159,
    pack: '80 wipes',
    image: '/img/wetwipes-cutouts/household-wipes-cutout.png',
    description: 'Ready-to-use cleaning wipes for counters, appliances, home surfaces and quick spills.',
    tags: ['Surface clean', 'Home care']
  },
  {
    _id: 'retail-kitchen-wipes-60',
    name: 'Kitchen Wipes',
    category: 'home',
    use: 'Kitchen cleanup',
    b2cPrice: 149,
    pack: '60 wipes',
    image: '/img/catalog-wipes/kitchen-wipes-cutout.png',
    description: 'Practical kitchen wipes for counters, handles, dining surfaces and everyday messes.',
    tags: ['Kitchen', 'Quick clean']
  },
  {
    _id: 'retail-auto-wipes-40',
    name: 'Automobile Wipes',
    category: 'auto',
    use: 'Interior detailing',
    b2cPrice: 179,
    pack: '40 wipes',
    image: '/img/wetwipes-cutouts/automobile-wipes-cutout.png',
    description: 'Car care wipes for dashboard, interior touchpoints and quick detailing routines.',
    tags: ['Car care', 'Detailing']
  }
];

const formatPrice = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(value);

const categoryAliases = {
  baby: 'baby',
  beauty: 'beauty',
  personal: 'personal',
  'personal-care': 'personal',
  household: 'home',
  home: 'home',
  pet: 'pet',
  automobile: 'auto',
  auto: 'auto',
  gym: 'personal'
};

const heroProductLayout = [
  { x: -0.38, y: -0.18, rotate: -14, delay: 0.02 },
  { x: -0.22, y: -0.25, rotate: -6, delay: 0.08 },
  { x: -0.06, y: -0.21, rotate: 5, delay: 0.14 },
  { x: 0.1, y: -0.24, rotate: 12, delay: 0.2 },
  { x: 0.29, y: -0.17, rotate: 16, delay: 0.26 },
  { x: -0.34, y: 0.16, rotate: 10, delay: 0.32 },
  { x: -0.17, y: 0.2, rotate: -8, delay: 0.38 },
  { x: 0.01, y: 0.18, rotate: 0, delay: 0.44 },
  { x: 0.18, y: 0.2, rotate: 8, delay: 0.5 },
  { x: 0.36, y: 0.15, rotate: -10, delay: 0.56 },
  { x: 0, y: 0, rotate: 0, delay: 0.62 }
];

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeOut = (value) => 1 - Math.pow(1 - value, 3);

const Catalog = () => {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [addedProduct, setAddedProduct] = useState('');
  const [heroProgress, setHeroProgress] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category')?.toLowerCase();
    if (category && categoryAliases[category]) {
      setActiveCategory(categoryAliases[category]);
    }
  }, []);

  useEffect(() => {
    let frameId = 0;

    const updateHeroProgress = () => {
      frameId = 0;
      const hero = heroRef.current;
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      const scrollableDistance = Math.max(1, rect.height - window.innerHeight);
      setHeroProgress(clamp(-rect.top / scrollableDistance));
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateHeroProgress);
    };

    updateHeroProgress();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return wipeProducts.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesQuery = !normalizedQuery || [
        product.name,
        product.use,
        product.description,
        product.pack,
        ...product.tags
      ].join(' ').toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      images: [product.image],
      stock: 100,
      b2bPricing: []
    });
    setAddedProduct(product._id);
    window.setTimeout(() => setAddedProduct(''), 1400);
  };

  return (
    <main className="retail-catalog-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .retail-catalog-page {
          min-height: 100vh;
          background: #ffffff;
          color: #071923;
          font-family: var(--font-body), Arial, sans-serif;
          padding: 118px 0 96px;
        }

        .retail-catalog-shell {
          width: min(96vw, 1560px);
          margin: 0 auto;
          padding: 0 clamp(16px, 2.2vw, 34px);
        }

        .retail-scroll-hero {
          position: relative;
          min-height: 250vh;
          margin: 8px 0 28px;
        }

        .retail-hero-sticky {
          position: sticky;
          top: 0;
          min-height: 100svh;
          display: grid;
          place-items: center;
          padding: clamp(76px, 8vw, 116px) 0 clamp(22px, 4vw, 42px);
          overflow: hidden;
        }

        .retail-hero {
          position: relative;
          width: 100%;
          min-height: min(760px, calc(100svh - 126px));
          border: 1px solid rgba(9, 118, 188, 0.13);
          border-radius: 38px;
          background:
            radial-gradient(circle at 50% 48%, rgba(9, 118, 188, 0.13), transparent 36%),
            linear-gradient(135deg, #f7fbfd 0%, #ffffff 62%);
          box-shadow: 0 26px 86px rgba(7, 25, 35, 0.08);
          overflow: hidden;
        }

        .retail-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(9, 118, 188, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(9, 118, 188, 0.045) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(circle at center, rgba(0,0,0,0.58), transparent 72%);
          pointer-events: none;
        }

        .retail-hero::after {
          content: '';
          position: absolute;
          inset: 16px;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 28px;
          pointer-events: none;
        }

        .retail-hero-copy {
          position: absolute;
          inset: clamp(30px, 5vw, 68px) auto auto clamp(30px, 5vw, 68px);
          z-index: 4;
          width: min(650px, 54%);
          transition: opacity 0.2s linear, transform 0.2s linear;
        }

        .retail-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 18px;
          color: #0976BC;
          font-size: 0.86rem;
          font-weight: 850;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .retail-title {
          max-width: 760px;
          margin: 0;
          font-size: clamp(2.8rem, 5vw, 5.9rem);
          line-height: 0.98;
          font-weight: 900;
          letter-spacing: 0;
        }

        .retail-title span {
          color: #0976BC;
        }

        .retail-lead {
          max-width: 620px;
          margin: 24px 0 0;
          color: rgba(7, 25, 35, 0.64);
          font-size: 1.08rem;
          line-height: 1.75;
        }

        .retail-hero-stage {
          position: relative;
          z-index: 2;
          width: 100%;
          min-height: min(760px, calc(100svh - 126px));
        }

        .retail-hero-product {
          position: absolute;
          left: 50%;
          top: 51%;
          width: clamp(112px, 10.8vw, 198px);
          height: clamp(156px, 15vw, 276px);
          object-fit: contain;
          opacity: 0;
          filter: drop-shadow(0 22px 28px rgba(7, 25, 35, 0.15));
          will-change: transform, opacity;
          transition: filter 0.2s ease;
        }

        .retail-hero-product:hover {
          filter: drop-shadow(0 28px 34px rgba(9, 118, 188, 0.18));
        }

        .retail-hero-badge {
          position: absolute;
          left: 50%;
          bottom: clamp(24px, 5vw, 54px);
          z-index: 5;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 9px;
          border: 1px solid rgba(9, 118, 188, 0.12);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.86);
          padding: 11px 14px;
          color: #071923;
          font-size: 0.88rem;
          font-weight: 850;
          box-shadow: 0 18px 42px rgba(7, 25, 35, 0.1);
          backdrop-filter: blur(12px);
        }

        .retail-hero-badge svg {
          color: #0976BC;
        }

        .retail-hero-points {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        .retail-point {
          min-height: 0;
          border: 1px solid rgba(9, 118, 188, 0.1);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.8);
          padding: 11px 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(7, 25, 35, 0.62);
          font-size: 0.82rem;
          font-weight: 850;
        }

        .retail-point svg {
          color: #0976BC;
        }

        .retail-scroll-cue {
          position: absolute;
          right: clamp(26px, 4vw, 58px);
          bottom: clamp(24px, 4vw, 44px);
          z-index: 5;
          color: rgba(7, 25, 35, 0.48);
          font-size: 0.82rem;
          font-weight: 850;
          writing-mode: vertical-rl;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .retail-toolbar {
          position: sticky;
          top: 84px;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 20px 0 30px;
          padding: 18px;
          border: 1px solid rgba(9, 118, 188, 0.18);
          border-radius: 28px;
          background:
            linear-gradient(135deg, rgba(247, 251, 253, 0.96), rgba(255, 255, 255, 0.92));
          backdrop-filter: blur(16px);
          box-shadow: 0 20px 60px rgba(7, 25, 35, 0.08);
        }

        .retail-toolbar-top {
          display: grid;
          grid-template-columns: minmax(280px, 520px) 1fr;
          gap: 18px;
          align-items: end;
        }

        .retail-search-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .retail-search-title {
          color: #0976BC;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .retail-search {
          min-height: 64px;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 8px 10px 8px 8px;
          border: 1px solid rgba(9, 118, 188, 0.2);
          border-radius: 20px;
          background: #ffffff;
          color: rgba(7, 25, 35, 0.48);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 12px 32px rgba(7, 25, 35, 0.05);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .retail-search:focus-within {
          border-color: rgba(9, 118, 188, 0.55);
          box-shadow: 0 0 0 4px rgba(9, 118, 188, 0.08), 0 16px 40px rgba(7, 25, 35, 0.08);
        }

        .retail-search-icon {
          width: 48px;
          height: 48px;
          border-radius: 15px;
          background: #0976BC;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }

        .retail-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #071923;
          font: inherit;
          font-weight: 700;
          min-width: 0;
        }

        .retail-search input::placeholder {
          color: rgba(7, 25, 35, 0.45);
        }

        .retail-clear-search {
          min-width: 72px;
          height: 42px;
          border: 1px solid rgba(9, 118, 188, 0.14);
          border-radius: 999px;
          background: rgba(247, 251, 253, 0.9);
          color: rgba(7, 25, 35, 0.72);
          font-weight: 850;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        .retail-clear-search:hover,
        .retail-clear-search:focus-visible {
          background: #0976BC;
          border-color: #0976BC;
          color: #ffffff;
          outline: none;
        }

        .retail-filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .retail-filter-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(7, 25, 35, 0.64);
          font-size: 0.84rem;
          font-weight: 850;
        }

        .retail-categories {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 2px;
        }

        .retail-categories::-webkit-scrollbar {
          display: none;
        }

        .retail-chip {
          height: 44px;
          border: 1px solid rgba(9, 118, 188, 0.16);
          border-radius: 999px;
          padding: 0 18px;
          background: #ffffff;
          color: rgba(7, 25, 35, 0.72);
          font-weight: 850;
          white-space: nowrap;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }

        .retail-chip:hover,
        .retail-chip.is-active {
          background: #0976BC;
          border-color: #0976BC;
          color: #ffffff;
          transform: translateY(-1px);
        }

        .retail-section-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin: 0 0 18px;
        }

        .retail-section-head h2 {
          margin: 0;
          font-size: clamp(1.8rem, 3vw, 3.1rem);
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: 0;
        }

        .retail-section-head p {
          margin: 0;
          color: rgba(7, 25, 35, 0.58);
          font-weight: 750;
        }

        .retail-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .retail-card {
          border: 1px solid rgba(9, 118, 188, 0.11);
          border-radius: 24px;
          background: #ffffff;
          overflow: hidden;
          box-shadow: 0 16px 46px rgba(7, 25, 35, 0.05);
          transition: transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease;
        }

        .retail-card:hover {
          transform: translateY(-5px);
          border-color: rgba(9, 118, 188, 0.25);
          box-shadow: 0 24px 70px rgba(9, 118, 188, 0.1);
        }

        .retail-card-media {
          position: relative;
          margin: 12px 12px 0;
          border-radius: 20px;
          background: transparent;
          aspect-ratio: 1.12 / 1;
          overflow: hidden;
        }

        .retail-card-media img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 12px 18px 10px;
          display: block;
          filter: drop-shadow(0 18px 22px rgba(7, 25, 35, 0.12));
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .retail-card:hover .retail-card-media img {
          transform: scale(1.06);
        }

        .retail-pack {
          position: absolute;
          top: 12px;
          left: 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          color: #0976BC;
          padding: 7px 10px;
          font-size: 0.76rem;
          font-weight: 900;
          box-shadow: 0 10px 24px rgba(7, 25, 35, 0.08);
        }

        .retail-card-body {
          padding: 18px 18px 20px;
        }

        .retail-use {
          display: block;
          margin-bottom: 8px;
          color: #0976BC;
          font-size: 0.76rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .retail-product-title {
          margin: 0;
          color: #071923;
          font-size: 1.18rem;
          line-height: 1.16;
          font-weight: 900;
        }

        .retail-product-desc {
          min-height: 74px;
          margin: 12px 0 14px;
          color: rgba(7, 25, 35, 0.58);
          font-size: 0.92rem;
          line-height: 1.55;
        }

        .retail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 16px;
        }

        .retail-tags span {
          border-radius: 999px;
          background: rgba(9, 118, 188, 0.07);
          color: rgba(7, 25, 35, 0.72);
          padding: 6px 9px;
          font-size: 0.74rem;
          font-weight: 850;
        }

        .retail-card-footer {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          align-items: center;
        }

        .retail-price {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .retail-price strong {
          color: #071923;
          font-size: 1.32rem;
          line-height: 1;
          font-weight: 950;
        }

        .retail-price small {
          color: rgba(7, 25, 35, 0.5);
          font-weight: 750;
        }

        .retail-add {
          height: 44px;
          border: 0;
          border-radius: 999px;
          padding: 0 16px;
          background: #071923;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 900;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .retail-add:hover,
        .retail-add.is-added {
          background: #0976BC;
          transform: translateY(-1px);
        }

        .retail-empty {
          grid-column: 1 / -1;
          border: 1px dashed rgba(9, 118, 188, 0.24);
          border-radius: 24px;
          padding: 42px 24px;
          text-align: center;
          color: rgba(7, 25, 35, 0.62);
          font-weight: 800;
        }

        .retail-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-top: 26px;
          border: 1px solid rgba(9, 118, 188, 0.12);
          border-radius: 24px;
          padding: 22px;
          background: #f7fbfd;
        }

        .retail-bottom-bar p {
          margin: 0;
          color: rgba(7, 25, 35, 0.62);
          line-height: 1.55;
        }

        .retail-cart-link {
          height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 999px;
          background: #0976BC;
          color: #ffffff;
          padding: 0 20px;
          text-decoration: none;
          font-weight: 900;
          white-space: nowrap;
        }

        @media (max-width: 1180px) {
          .retail-scroll-hero {
            min-height: 235vh;
          }

          .retail-hero-copy {
            width: min(620px, calc(100% - 56px));
          }

          .retail-hero-product {
            width: clamp(96px, 14vw, 158px);
            height: clamp(134px, 19vw, 222px);
          }

          .retail-scroll-cue {
            display: none;
          }

          .retail-toolbar {
            position: static;
          }

          .retail-toolbar-top {
            grid-template-columns: 1fr;
          }

          .retail-categories {
            justify-content: flex-start;
          }

          .retail-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .retail-catalog-page {
            padding-top: 72px;
          }

          .retail-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .retail-section-head,
          .retail-bottom-bar {
            align-items: flex-start;
            flex-direction: column;
          }

          .retail-hero-points {
            gap: 8px;
          }

          .retail-scroll-hero {
            min-height: 220vh;
          }

          .retail-hero-sticky {
            padding-top: 76px;
          }

          .retail-hero {
            min-height: calc(100svh - 100px);
            border-radius: 28px;
          }

          .retail-hero-copy {
            inset: 28px 24px auto;
            width: auto;
          }

          .retail-hero-product {
            width: clamp(72px, 20vw, 122px);
            height: clamp(104px, 28vw, 172px);
          }

          .retail-search {
            min-height: 58px;
          }

          .retail-search-icon {
            width: 44px;
            height: 44px;
          }
        }

        @media (max-width: 560px) {
          .retail-scroll-hero {
            min-height: 210vh;
            margin-top: 0;
          }

          .retail-hero::after {
            inset: 10px;
            border-radius: 20px;
          }

          .retail-title {
            font-size: clamp(2.35rem, 13vw, 3.7rem);
          }

          .retail-lead {
            font-size: 1rem;
            line-height: 1.62;
          }

          .retail-hero-badge {
            font-size: 0.8rem;
            padding: 9px 11px;
          }

          .retail-grid {
            grid-template-columns: 1fr;
          }

          .retail-card-footer {
            grid-template-columns: 1fr;
          }

          .retail-add,
          .retail-cart-link {
            width: 100%;
            justify-content: center;
          }

          .retail-toolbar {
            padding: 12px;
            border-radius: 22px;
          }

          .retail-search {
            align-items: stretch;
            flex-wrap: wrap;
            padding: 8px;
          }

          .retail-search input {
            min-height: 44px;
            flex: 1 1 calc(100% - 62px);
          }

          .retail-clear-search {
            width: 100%;
          }

          .retail-chip {
            height: 42px;
            padding: 0 15px;
          }
        }
      `}} />

      <div className="retail-catalog-shell">
        <section className="retail-scroll-hero" ref={heroRef}>
          <div className="retail-hero-sticky">
            <div className="retail-hero">
              <div
                className="retail-hero-copy"
                style={{
                  opacity: clamp(1 - heroProgress * 1.8, 0, 1),
                  transform: `translateY(${-28 * heroProgress}px)`
                }}
              >
                <span className="retail-eyebrow">
                  <ShoppingBag size={18} />
                  Bapuji retail wipes
                </span>
                <h1 className="retail-title">
                  Scroll to reveal <span>every wipe.</span>
                </h1>
                <p className="retail-lead">
                  Baby, beauty, personal care, pet, household and automobile wipe packets unfold into view before you shop.
                </p>
                <div className="retail-hero-points">
                  <div className="retail-point"><Sparkles size={16} /> 11 wipe types</div>
                  <div className="retail-point"><Truck size={16} /> Retail-ready packs</div>
                  <div className="retail-point"><Check size={16} /> Quality checked</div>
                </div>
              </div>

              <div className="retail-hero-stage" aria-label="Scroll reveal of all retail wipe products">
                {wipeProducts.map((product, index) => {
                  const layout = heroProductLayout[index];
                  const reveal = easeOut(clamp((heroProgress - layout.delay) / 0.3));
                  const settle = easeOut(clamp((heroProgress - 0.72) / 0.2));
                  const scale = 0.44 + reveal * 0.58 - settle * 0.05;
                  const x = layout.x * 100 * reveal * (1 - settle * 0.05);
                  const y = layout.y * 100 * reveal + settle * -3;
                  const rotate = layout.rotate * reveal;
                  const opacity = clamp(reveal * 1.18);

                  return (
                    <img
                      key={product._id}
                      className="retail-hero-product"
                      src={product.image}
                      alt={product.name}
                      style={{
                        opacity,
                        transform: `translate(calc(-50% + ${x}vw), calc(-50% + ${y}vh)) rotate(${rotate}deg) scale(${scale})`,
                        zIndex: 2 + index
                      }}
                    />
                  );
                })}
              </div>

              <div
                className="retail-hero-badge"
                style={{
                  opacity: clamp((heroProgress - 0.58) / 0.24),
                  transform: `translateX(-50%) translateY(${18 * (1 - clamp((heroProgress - 0.58) / 0.24))}px)`
                }}
              >
                <ShoppingBag size={17} />
                All products revealed
              </div>
              <div className="retail-scroll-cue">Scroll</div>
            </div>
          </div>
        </section>

        <section id="products" aria-label="Retail wipes catalog">
          <div className="retail-toolbar">
            <div className="retail-toolbar-top">
              <div className="retail-search-wrap">
                <span className="retail-search-title">Find your wipes</span>
                <label className="retail-search">
                  <span className="retail-search-icon">
                    <Search size={19} />
                  </span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search baby, pet, makeup, kitchen..."
                  />
                  {query && (
                    <button
                      type="button"
                      className="retail-clear-search"
                      onClick={() => setQuery('')}
                    >
                      Clear
                    </button>
                  )}
                </label>
              </div>

              <div className="retail-filter-group">
                <span className="retail-filter-label">
                  <SlidersHorizontal size={16} />
                  Filter by type
                </span>
                <div className="retail-categories" aria-label="Filter wipes">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={`retail-chip ${activeCategory === category.id ? 'is-active' : ''}`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="retail-section-head">
            <div>
              <span className="retail-eyebrow">
                <SlidersHorizontal size={17} />
                Shop by need
              </span>
              <h2>All wipe types in one place</h2>
            </div>
            <p>{filteredProducts.length} products shown</p>
          </div>

          <div className="retail-grid">
            {filteredProducts.map((product) => (
              <article className="retail-card" key={product._id}>
                <div className="retail-card-media">
                  <span className="retail-pack">{product.pack}</span>
                  <img src={product.image} alt={product.name} loading="lazy" />
                </div>

                <div className="retail-card-body">
                  <span className="retail-use">{product.use}</span>
                  <h3 className="retail-product-title">{product.name}</h3>
                  <p className="retail-product-desc">{product.description}</p>

                  <div className="retail-tags">
                    {product.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="retail-card-footer">
                    <div className="retail-price">
                      <strong>{formatPrice(product.b2cPrice)}</strong>
                      <small>Inclusive retail price</small>
                    </div>
                    <button
                      type="button"
                      className={`retail-add ${addedProduct === product._id ? 'is-added' : ''}`}
                      onClick={() => handleAddToCart(product)}
                    >
                      {addedProduct === product._id ? 'Added' : 'Add'}
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filteredProducts.length === 0 && (
              <div className="retail-empty">
                No wipes found. Try a different search or category.
              </div>
            )}
          </div>

          <div className="retail-bottom-bar">
            <p>
              Looking for private label or bulk manufacturing? This page is for direct retail buying. OEM buyers can use the dedicated inquiry flow.
            </p>
            <Link href="/oem" className="retail-cart-link">
              Click here <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Catalog;
