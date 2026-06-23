'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Boxes, Factory, Layers3, ShieldCheck } from 'lucide-react';

const productLines = [
  {
    title: 'Wound Care',
    label: 'Clinical essentials',
    description: 'Gauze swabs, absorbent cotton, dressing pads and wound-care consumables for hospitals and distributors.',
    image: '/img/bapuji-production-wound-care.png',
    href: '/catalog?category=wound-care',
    accent: '#0976BC',
    stat: 'Sterile & bulk packs',
  },
  {
    title: 'Hygiene Wipes',
    label: 'Private label ready',
    description: 'Baby, personal care, surface, pet, automotive and specialty wet wipes built for retail and B2B programs.',
    image: '/img/baby_wipes_perspective_1781683500232.png',
    href: '/weywipes',
    accent: '#16A34A',
    stat: 'OEM formulas',
  },
  {
    title: 'Sterilization Packaging',
    label: 'Cleanroom supply',
    description: 'Sterilization reels, medical pouches, labels and packaging support for repeatable clinical workflows.',
    image: '/img/bapuji-production-sterilization-pouches.png',
    href: '/catalog?category=sterilization',
    accent: '#0F766E',
    stat: 'Traceable batches',
  },
  {
    title: 'Surgical Apparel',
    label: 'Protective range',
    description: 'Disposable gowns, drapes and protective supplies designed around comfort, coverage and dependable dispatch.',
    image: '/img/bapuji-production-surgical-gauze.png',
    href: '/catalog?category=apparel',
    accent: '#475569',
    stat: 'Hospital supply',
  },
];

const capabilities = [
  { icon: ShieldCheck, text: 'Medical-grade QA' },
  { icon: Factory, text: 'OEM manufacturing' },
  { icon: Boxes, text: 'Bulk dispatch' },
  { icon: Layers3, text: 'Private label packaging' },
];

export const ProductCategories = () => {
  return (
    <section className="bg-transparent px-8 py-28">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16 grid grid-cols-[minmax(0,0.95fr)_minmax(560px,1fr)] items-center gap-20">
          <div className="max-w-[680px]">
            <p className="mb-5 inline-flex items-center rounded-full border border-[#0976BC]/15 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#0976BC] shadow-[0_10px_30px_rgba(9,118,188,0.08)]">
              Our products
            </p>
            <h2 className="m-0 text-[3.65rem] font-bold leading-[1.02] tracking-[-0.05em] text-slate-950">
              Complete healthcare supply lines in one place.
            </h2>
          </div>

          <div className="flex max-w-[780px] flex-col items-stretch gap-7 justify-self-end">
            <p className="m-0 max-w-[720px] text-lg leading-8 text-slate-600">
              Explore Bapuji Surgicals product families across wound care, hygiene wipes, sterilization packaging and protective medical supplies, with OEM support for private label programs.
            </p>
            <div className="grid w-full grid-cols-2 gap-3">
              {capabilities.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex h-[52px] items-center gap-3 rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.035)]">
                    <Icon className="h-4 w-4 text-[#0976BC]" strokeWidth={2.1} />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {productLines.map((line, index) => (
            <motion.article
              key={line.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="group flex min-h-[520px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_90px_rgba(15,23,42,0.12)]"
            >
              <Link href={line.href} className="flex h-full flex-col text-slate-950 no-underline hover:text-slate-950">
                <div className="relative h-[255px] overflow-hidden bg-slate-100">
                  <img
                    src={line.image}
                    alt={line.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <div
                    className="absolute left-5 top-5 rounded-full px-3.5 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-lg"
                    style={{ backgroundColor: line.accent }}
                  >
                    {line.label}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-start justify-between gap-5">
                    <h3 className="m-0 text-[1.65rem] font-bold leading-[1.05] tracking-[-0.04em] text-slate-950">
                      {line.title}
                    </h3>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition-colors duration-300 group-hover:bg-[#0976BC]">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>

                  <p className="m-0 text-[0.98rem] leading-7 text-slate-600">
                    {line.description}
                  </p>

                  <div className="mt-auto pt-7">
                    <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                      <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Range</span>
                      <span className="font-bold text-slate-800">{line.stat}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between rounded-[28px] bg-slate-950 px-8 py-7 text-white">
          <div>
            <h3 className="m-0 text-2xl font-bold tracking-[-0.03em] text-white">Need a custom product configuration?</h3>
            <p className="mt-2 text-sm text-white/68">Send formulation, substrate, packaging and quantity details to our OEM desk.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/docs/bapuji-surgicals-product-catalogue.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 font-bold text-white transition-colors hover:bg-white/10 hover:text-white"
            >
              View catalog
            </a>
            <Link href="/oem" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-bold text-slate-950 transition-colors hover:bg-[#0976BC] hover:text-white">
              Start OEM inquiry
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
