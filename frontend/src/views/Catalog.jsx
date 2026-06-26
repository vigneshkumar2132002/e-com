'use client';

import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';

const Catalog = () => {
  return (
    <main className="catalog-min-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .catalog-min-page {
          min-height: 100vh;
          background: #ffffff;
          color: #0b1220;
          font-family: var(--font-body), Arial, sans-serif;
        }

        .catalog-min-hero {
          padding: 124px 48px 88px;
          background: #ffffff;
        }

        .catalog-min-inner {
          width: min(1440px, calc(100vw - 96px));
          min-height: 600px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.82fr) minmax(560px, 0.95fr);
          gap: 96px;
          align-items: center;
        }

        .catalog-min-copy {
          animation: catalogFadeUp 0.65s ease both;
        }

        .catalog-min-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 24px;
          color: #0976bc;
          font-size: 13px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .catalog-min-title {
          margin: 0;
          max-width: 690px;
          font-size: clamp(3.7rem, 5.05vw, 6.25rem);
          line-height: 1;
          letter-spacing: -0.058em;
          font-weight: 950;
        }

        .catalog-min-title span {
          color: #0976bc;
        }

        .catalog-min-text {
          max-width: 560px;
          margin: 24px 0 28px;
          color: #526071;
          font-size: 17px;
          line-height: 1.65;
        }

        .catalog-min-search {
          width: min(610px, 100%);
          height: 62px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          border: 1px solid #e1e7ef;
          border-radius: 18px;
          background: #ffffff;
          box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
          overflow: hidden;
        }

        .catalog-min-search label {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 20px;
          color: #8390a2;
          font-weight: 700;
        }

        .catalog-min-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #0b1220;
          font: inherit;
          font-weight: 700;
        }

        .catalog-min-search input::placeholder {
          color: #94a3b8;
        }

        .catalog-min-search button {
          height: 46px;
          margin-right: 8px;
          border: 0;
          border-radius: 14px;
          padding: 0 20px;
          background: #0b1220;
          color: #ffffff;
          font-weight: 850;
          cursor: pointer;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .catalog-min-search button:hover {
          transform: translateY(-1px);
          background: #0976bc;
        }

        .catalog-min-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .catalog-min-primary,
        .catalog-min-secondary {
          height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 14px;
          padding: 0 20px;
          font-weight: 850;
          text-decoration: none;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .catalog-min-primary {
          background: #0976bc;
          color: #ffffff;
        }

        .catalog-min-secondary {
          background: #ffffff;
          color: #0b1220;
          border: 1px solid #e1e7ef;
        }

        .catalog-min-primary:hover,
        .catalog-min-secondary:hover {
          transform: translateY(-2px);
        }

        .catalog-min-trust {
          display: flex;
          align-items: center;
          gap: 22px;
          flex-wrap: wrap;
          margin-top: 34px;
          color: #526071;
          font-size: 14px;
          font-weight: 780;
        }

        .catalog-min-trust span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .catalog-min-trust svg {
          color: #0976bc;
        }

        .catalog-min-visual {
          position: relative;
          min-height: 600px;
          border-radius: 0;
          background: transparent;
          overflow: visible;
          animation: catalogVisualIn 0.75s 0.12s ease both;
        }

        .catalog-min-visual::before {
          content: '';
          position: absolute;
          right: 0;
          top: 46px;
          width: 86%;
          height: 440px;
          border-radius: 34px;
          background: #f4f7fb;
          border: 1px solid rgba(9, 118, 188, 0.11);
          box-shadow: 0 28px 80px rgba(15, 23, 42, 0.08);
        }

        .catalog-min-main-image {
          position: absolute;
          right: 42px;
          top: 108px;
          width: 78%;
          height: 330px;
          border-radius: 26px;
          object-fit: cover;
          box-shadow: 0 24px 55px rgba(15, 23, 42, 0.12);
          animation: catalogSlowFloat 5s ease-in-out infinite;
        }

        .catalog-min-card {
          position: absolute;
          left: 0;
          top: 0;
          width: 250px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(226, 232, 240, 0.9);
          padding: 20px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.1);
          backdrop-filter: blur(12px);
          z-index: 2;
        }

        .catalog-min-card p {
          margin: 0 0 8px;
          color: #8390a2;
          font-size: 12px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .catalog-min-card h2 {
          margin: 0;
          font-size: 21px;
          line-height: 1.08;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .catalog-min-product-tile {
          position: absolute;
          left: 34px;
          bottom: 88px;
          width: 220px;
          height: 190px;
          border-radius: 28px;
          background: #ffffff;
          border: 1px solid #e1e7ef;
          box-shadow: 0 22px 55px rgba(15, 23, 42, 0.12);
          padding: 18px;
          z-index: 2;
        }

        .catalog-min-product-tile img {
          width: 100%;
          height: 118px;
          object-fit: contain;
          display: block;
        }

        .catalog-min-product-tile span {
          display: block;
          margin-top: 10px;
          color: #0b1220;
          font-size: 13px;
          font-weight: 900;
        }

        .catalog-min-stats {
          position: absolute;
          right: 34px;
          bottom: 18px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          z-index: 2;
        }

        .catalog-min-stat {
          min-width: 132px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid #e1e7ef;
          padding: 16px;
          box-shadow: 0 14px 32px rgba(15, 23, 42, 0.07);
        }

        .catalog-min-stat strong {
          display: block;
          font-size: 24px;
          line-height: 1;
          letter-spacing: -0.04em;
          color: #0976bc;
        }

        .catalog-min-stat small {
          display: block;
          margin-top: 6px;
          color: #64748b;
          font-weight: 800;
        }

        @keyframes catalogFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes catalogVisualIn {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes catalogSlowFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @media (min-width: 1024px) and (max-width: 1320px) {
          .catalog-min-inner {
            grid-template-columns: minmax(0, 0.95fr) minmax(440px, 0.85fr);
            gap: 48px;
          }

          .catalog-min-title {
            font-size: clamp(3.25rem, 4.55vw, 5rem);
          }

          .catalog-min-visual {
            min-height: 520px;
          }

          .catalog-min-visual::before {
            height: 392px;
          }

          .catalog-min-main-image {
            height: 295px;
            top: 98px;
          }

          .catalog-min-product-tile {
            width: 190px;
            height: 170px;
            bottom: 76px;
          }
        }
      `}} />

      <section className="catalog-min-hero">
        <div className="catalog-min-inner">
          <div className="catalog-min-copy">
            <div className="catalog-min-eyebrow">
              <ShoppingBag size={17} />
              Bapuji direct store
            </div>

            <h1 className="catalog-min-title">
              Shop healthcare essentials with <span>less effort.</span>
            </h1>

            <p className="catalog-min-text">
              A clean catalog for retail customers to find wound care, hygiene wipes, sterilization packs and daily medical supplies quickly.
            </p>

            <form className="catalog-min-search" onSubmit={(event) => event.preventDefault()}>
              <label>
                <Search size={18} />
                <input placeholder="Search products, categories, care needs" />
              </label>
              <button type="submit">Search</button>
            </form>

            <div className="catalog-min-actions">
              <Link className="catalog-min-primary" href="#products">
                Browse products <ArrowRight size={16} />
              </Link>
              <Link className="catalog-min-secondary" href="/docs/bapuji-surgicals-product-catalogue.pdf" target="_blank">
                View PDF
              </Link>
            </div>

            <div className="catalog-min-trust">
              <span><Truck size={18} /> Fast dispatch</span>
              <span><ShieldCheck size={18} /> Quality checked</span>
              <span>Simple checkout</span>
            </div>
          </div>

          <div className="catalog-min-visual" aria-label="Featured healthcare products">
            <div className="catalog-min-card">
              <p>Featured</p>
              <h2>Home care and clinic essentials.</h2>
            </div>
            <img className="catalog-min-main-image" src="/img/bapuji-production-final-packaging.png" alt="Bapuji healthcare product packaging" />
            <div className="catalog-min-product-tile">
              <img src="/img/bapuji-production-wound-care.png" alt="Wound care product" />
              <span>Wound care essentials</span>
            </div>
            <div className="catalog-min-stats">
              <div className="catalog-min-stat">
                <strong>24h</strong>
                <small>Order support</small>
              </div>
              <div className="catalog-min-stat">
                <strong>1980</strong>
                <small>Since</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Catalog;
