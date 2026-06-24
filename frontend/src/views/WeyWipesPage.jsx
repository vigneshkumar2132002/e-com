'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  ChevronDown,
  FlaskConical,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const products = [
  {
    id: 'baby',
    name: 'Baby Wipes',
    short: 'Sensitive care',
    desc: 'Soft, alcohol-free wipes for infant and family care programs.',
    image: '/img/wetwipes-cutouts/baby-wipes-cutout.png',
    detailImage: '/img/baby_wipes_perspective_1781683500232.png',
    accent: '#0ea5e9',
    features: ['Alcohol free', 'Aloe and vitamin E', 'pH balanced'],
    moq: '10k packs',
  },
  {
    id: 'personal',
    name: 'Personal Care Wipes',
    short: 'Daily freshness',
    desc: 'Portable personal hygiene formats for travel, wellness and retail.',
    image: '/img/wetwipes-cutouts/personal-wipes-cutout.png',
    detailImage: '/img/personal_wipes_perspective_1781683524082.png',
    accent: '#14b8a6',
    features: ['Cooling feel', 'Travel friendly', 'Custom fragrance'],
    moq: '10k packs',
  },
  {
    id: 'women',
    name: 'Women Wipes',
    short: 'Gentle hygiene',
    desc: 'Personal care wipes with soothing formulas and premium packaging.',
    image: '/img/wetwipes-cutouts/women-wipes-cutout.png',
    detailImage: '/img/womens_wipes_perspective_1781683554768.png',
    accent: '#ec4899',
    features: ['Micellar option', 'Rosewater option', 'Dermatology tested'],
    moq: '10k packs',
  },
  {
    id: 'men',
    name: 'Men Wipes',
    short: 'Active care',
    desc: 'Larger-format grooming wipes for fitness, travel and outdoor use.',
    image: '/img/wetwipes-cutouts/men-wipes-cutout.png',
    detailImage: '/img/mens_wipes_perspective_1781683542130.png',
    accent: '#334155',
    features: ['Odor control', 'Menthol option', 'Extra large sheets'],
    moq: '10k packs',
  },
  {
    id: 'pet',
    name: 'Pet Wipes',
    short: 'Coat and paw care',
    desc: 'Pet-safe grooming wipes for paws, coats and quick cleanups.',
    image: '/img/wetwipes-cutouts/pet-wipes-cutout.png',
    detailImage: '/img/wetwipes-cutouts/pet-wipes-cutout.png',
    accent: '#8b5cf6',
    features: ['Pet safe', 'Oat extract option', 'Tear resistant'],
    moq: '10k packs',
  },
  {
    id: 'household',
    name: 'Household Wipes',
    short: 'Surface cleaning',
    desc: 'Multi-surface cleaning wipes for home, retail and institutional use.',
    image: '/img/wetwipes-cutouts/household-wipes-cutout.png',
    detailImage: '/img/wetwipes-cutouts/household-wipes-cutout.png',
    accent: '#22c55e',
    features: ['Grease cutting', 'Citrus option', 'Bulk supply'],
    moq: '10k packs',
  },
  {
    id: 'auto',
    name: 'Automobile Wipes',
    short: 'Interior detailing',
    desc: 'Dashboard, leather and surface wipes for automotive care brands.',
    image: '/img/wetwipes-cutouts/automobile-wipes-cutout.png',
    detailImage: '/img/wetwipes-cutouts/automobile-wipes-cutout.png',
    accent: '#f97316',
    features: ['UV protection', 'Lint free', 'Premium finish'],
    moq: '10k packs',
  },
];

const capabilities = [
  {
    icon: FlaskConical,
    title: 'Formula Development',
    desc: 'Water-based, cosmetic, sanitizing and specialty formulations tuned for your market.',
  },
  {
    icon: PackageCheck,
    title: 'Private Label Packaging',
    desc: 'Flow packs, flip lids, sachets, canisters, cartons and export-ready cartons.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Compliance',
    desc: 'Batch documentation, stability checks, QA inspection and clean production workflows.',
  },
  {
    icon: Truck,
    title: 'Dispatch Support',
    desc: 'Bulk production planning, repeat-order scheduling and domestic or export logistics.',
  },
];

const processSteps = [
  {
    title: 'Brief',
    desc: 'Share the product type, target market, wipe count, pack style, MOQ and launch timeline.',
  },
  {
    title: 'Formula',
    desc: 'Select the liquid system, fragrance, actives, substrate feel and compliance requirements.',
  },
  {
    title: 'Sample',
    desc: 'Review prototype wipes for moisture, texture, fragrance, pack handling and lid performance.',
  },
  {
    title: 'Artwork',
    desc: 'Finalize private label graphics, pouch layout, carton markings and export-ready details.',
  },
  {
    title: 'Production',
    desc: 'Move into batch manufacturing with QA checks, filling, sealing, packing and traceability.',
  },
  {
    title: 'Dispatch',
    desc: 'Coordinate cartons, documentation, repeat-order planning and domestic or export shipment.',
  },
];

const faqs = [
  {
    q: 'What is the MOQ for private label wet wipes?',
    a: 'Standard programs usually start at 10,000 packs per variant. Pilot quantities can be discussed for long-term OEM programs.',
  },
  {
    q: 'Can you customize fragrance, substrate and packaging?',
    a: 'Yes. The team can customize substrate GSM, liquid formulation, fragrance, sheet count, lid, pouch, carton and export packaging.',
  },
  {
    q: 'Do you support export orders?',
    a: 'Yes. Bapuji supports export-ready packing, documentation and batch traceability for international buyers.',
  },
  {
    q: 'How long does sampling and production take?',
    a: 'Sampling depends on formula and packaging complexity. Once approved, repeat manufacturing cycles are planned against MOQ and dispatch timelines.',
  },
];

const stats = [
  ['50M+', 'Monthly wipe capacity'],
  ['7', 'Retail wipe categories'],
  ['10k+', 'Standard OEM MOQ'],
  ['1980', 'Manufacturing legacy'],
];

const RollingStatNumber = ({ value }) => (
  <span>{value}</span>
);

const WeyWipesPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [modalProduct, setModalProduct] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [activeProcessStep, setActiveProcessStep] = useState(0);

  const activeIndex = useMemo(
    () => products.findIndex((item) => item.id === selectedProduct.id),
    [selectedProduct]
  );

  const revealNextProduct = () => {
    setSelectedProduct((current) => {
      const currentIndex = products.findIndex((item) => item.id === current.id);
      return products[(currentIndex + 1) % products.length];
    });
  };

  const scrollToProducts = () => {
    document.getElementById('wey-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const processTimer = window.setInterval(() => {
      setActiveProcessStep((current) => {
        if (current === null) return 0;
        return (current + 1) % processSteps.length;
      });
    }, 5000);

    return () => window.clearInterval(processTimer);
  }, []);

  useEffect(() => {
    const heroTimer = window.setTimeout(revealNextProduct, 6000);
    return () => window.clearTimeout(heroTimer);
  }, [selectedProduct.id]);

  return (
    <>
      <Head>
        <title>WeyWipes | OEM Wet Wipes & Private Label Manufacturing</title>
        <meta
          name="description"
          content="Explore WeyWipes private label wet wipes manufacturing by Bapuji Surgicals. Baby wipes, personal care wipes, pet wipes, household wipes and automobile wipes."
        />
      </Head>
      <style jsx global>{`
        @keyframes wey-progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>

      <div className="min-h-screen w-full overflow-x-hidden bg-white font-sans text-slate-950 selection:bg-[#0976BC] selection:text-white">
        <Navbar />

        <main>
          <section className="relative overflow-hidden bg-white px-0 pt-28">
            <div
              className="absolute inset-0 transition-colors duration-500"
              style={{
                background: `linear-gradient(135deg, ${selectedProduct.accent}12 0%, #ffffff 42%, #f8fafc 100%)`,
              }}
            />

            <div className="relative mx-auto flex min-h-[760px] w-full max-w-[1880px] flex-col justify-between px-4 py-8 sm:px-6 lg:min-h-[820px] lg:px-10 lg:py-10">
              <div className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(420px,0.55fr)]">
                <div className="relative z-10 pt-8 lg:pt-0">
                  <p className="mb-6 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-[#0976BC]">
                    <span className="h-px w-10 bg-[#0976BC]" />
                    New products
                  </p>

                  <div key={`hero-copy-${selectedProduct.id}`} className="transition-opacity duration-500">
                      <p className="m-0 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
                        0{activeIndex + 1} / 07  |  {selectedProduct.short}
                      </p>
                      <h1 className="mt-5 max-w-[1200px] whitespace-nowrap text-[3.2rem] font-bold leading-[0.9] tracking-[-0.055em] text-slate-950 sm:text-[5rem] lg:text-[7rem] xl:text-[8rem]">
                        {selectedProduct.name}
                      </h1>
                      <p className="mt-7 max-w-[620px] text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
                        {selectedProduct.desc}
                      </p>
                  </div>

                  <div className="mt-9 flex h-[52px] flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={scrollToProducts}
                      className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border-0 bg-[#0976BC] px-7 text-sm font-bold text-white outline-none shadow-[0_18px_34px_rgba(9,118,188,0.22)] ring-0 transition-colors hover:bg-[#075f98]"
                    >
                      Explore Products
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalProduct(selectedProduct)}
                      className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 text-sm font-bold text-slate-900 transition-colors hover:border-slate-400 hover:bg-slate-50"
                    >
                      Product details
                    </button>
                  </div>

                </div>

                <div className="relative min-h-[380px] lg:min-h-[600px]">
                  <div className="absolute inset-x-10 bottom-12 h-20 rounded-full bg-slate-950/10 blur-2xl" />

                  {products.map((item) => (
                    <div
                      key={item.id}
                      className={`absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-700 ${
                        selectedProduct.id === item.id ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-[380px] w-full object-contain drop-shadow-[0_30px_45px_rgba(15,23,42,0.22)] sm:max-h-[470px] lg:max-h-[560px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-20 mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
                {products.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedProduct(item)}
                    className={`group relative min-h-[86px] overflow-hidden rounded-lg border bg-white/80 px-4 py-3 text-left transition-[border-color,box-shadow,color,background-color] duration-500 ease-out ${
                      selectedProduct.id === item.id
                        ? 'border-slate-950 text-white shadow-[0_18px_48px_rgba(15,23,42,0.16)]'
                        : 'border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <span className={`absolute inset-0 z-0 bg-slate-950 transition-opacity duration-500 ${selectedProduct.id === item.id ? 'opacity-100' : 'opacity-0'}`} />
                    {selectedProduct.id === item.id && (
                      <span
                        key={`chip-progress-${item.id}`}
                        style={{ animation: 'wey-progress 6s linear forwards' }}
                        className="absolute inset-x-0 bottom-0 z-20 h-1 bg-[#0976BC]"
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-between gap-3">
                      <span className="text-sm font-bold tracking-[-0.02em]">{item.name}</span>
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#0976BC]" />
                    </span>
                    <span className={`relative z-10 mt-2 block text-xs font-semibold transition-colors duration-500 ${selectedProduct.id === item.id ? 'text-white/62' : 'text-slate-400'}`}>
                      {item.short}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative z-20 mx-auto mt-8 w-full max-w-[980px]">
                <div className="h-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    key={`hero-progress-${selectedProduct.id}`}
                    style={{ animation: 'wey-progress 6s linear forwards' }}
                    className="h-full rounded-full bg-[#0976BC]"
                  />
                </div>
              </div>
            </div>

            <div className="relative left-1/2 w-screen -translate-x-1/2 border-y border-slate-200 bg-white">
              <div className="mx-auto grid max-w-[1600px] grid-cols-2 divide-x divide-y divide-slate-200 sm:grid-cols-4 sm:divide-y-0">
                {stats.map(([value, label]) => (
                  <div key={label} className="px-5 py-7 text-center">
                    <div className="text-3xl font-bold tracking-[-0.04em] text-slate-950">
                      <RollingStatNumber value={value} />
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="wey-products" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <div className="mx-auto max-w-[1600px]">
              <div className="mb-12 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                <div>
                  <p className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-[#0976BC]">Product range</p>
                  <h2 className="m-0 max-w-[760px] text-[2.7rem] font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-[4rem]">
                    Seven wipe formats, one manufacturing partner.
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
                {products.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setModalProduct(item)}
                    className="group flex min-h-[360px] flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 text-left shadow-[0_16px_44px_rgba(15,23,42,0.045)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{item.short}</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0976BC] text-white transition-transform group-hover:-rotate-45">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="my-7 flex flex-1 items-center justify-center">
                      <img src={item.image} alt={item.name} className="max-h-[180px] w-full object-contain drop-shadow-[0_18px_26px_rgba(15,23,42,0.12)] transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div>
                      <h3 className="m-0 text-xl font-bold tracking-[-0.03em] text-slate-950">{item.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="border-y border-slate-200 bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1fr)] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-[#0976BC]">OEM capability</p>
                <h2 className="m-0 max-w-[620px] text-[2.55rem] font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-[3.75rem]">
                  From idea to retail-ready pack.
                </h2>
                <p className="mt-6 max-w-[520px] text-base leading-8 text-slate-600">
                  WeyWipes is built for B2B buyers who need clear execution: product brief, sampling, packaging, manufacturing, QA and dispatch.
                </p>
              </div>

              <div className="grid border-t border-slate-200 sm:grid-cols-2 sm:border-l sm:border-t-0">
                {capabilities.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="border-b border-slate-200 p-6 sm:border-r lg:p-8">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0976BC]/10 text-[#0976BC]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-8 text-xl font-bold tracking-[-0.03em] text-slate-950">{item.title}</h3>
                      <p className="mt-3 max-w-[420px] text-sm leading-7 text-slate-600">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <div className="mx-auto max-w-[1600px]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-center">
                <div>
                  <p className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-[#0976BC]">Manufacturing process</p>
                  <h2 className="m-0 text-[2.7rem] font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-[4rem]">
                    A practical path for private label launch.
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {processSteps.map((step, index) => (
                    <button
                      key={step.title}
                      type="button"
                      onClick={() => setActiveProcessStep(activeProcessStep === index ? null : index)}
                      className={`flex min-h-[230px] flex-col rounded-lg border p-5 text-left shadow-[0_12px_34px_rgba(15,23,42,0.04)] outline-none transition-colors duration-300 ${
                        activeProcessStep === index
                          ? 'border-[#0976BC] bg-white text-slate-950 shadow-[0_18px_50px_rgba(9,118,188,0.12)]'
                          : 'border-slate-200 bg-white text-slate-950 hover:border-[#0976BC]/35 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm font-bold text-[#0976BC]">
                        0{index + 1}
                      </span>
                      <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
                      <div className="mt-4 h-[72px] overflow-hidden">
                        <motion.p
                          animate={activeProcessStep === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                          className="m-0 text-sm font-medium leading-6 text-slate-600"
                        >
                          {step.desc}
                        </motion.p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[minmax(340px,0.7fr)_minmax(0,1fr)]">
              <div>
                <p className="mb-8 inline-flex items-center gap-3 text-2xl font-bold tracking-[-0.04em] text-slate-500">
                  <span className="h-6 w-1 rounded-full bg-[#0976BC]" />
                  FAQ
                </p>
                <h2 className="m-0 max-w-[420px] text-[2.35rem] font-bold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-[3rem]">
                  Frequently Asked Questions
                </h2>
                <p className="mt-6 max-w-[520px] text-base font-medium leading-7 text-slate-600">
                  Everything you need to know about Bapuji Surgicals contract packaging, B2B credential reviews, and bulk logistics.
                </p>

                <div className="mt-10 max-w-[520px] rounded-lg border border-slate-200 bg-slate-50 p-7">
                  <h3 className="m-0 text-lg font-bold text-slate-950">Still have questions?</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Can&apos;t find the answers you&apos;re looking for? Please contact our dedicated wholesale support team.
                  </p>
                  <a
                    href="/contact"
                    className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0976BC] px-6 text-sm font-bold text-white transition-colors hover:bg-[#075f98] hover:text-white"
                  >
                    Contact Support
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={faq.q}
                    className={`overflow-hidden rounded-lg border bg-white shadow-[0_12px_34px_rgba(15,23,42,0.035)] transition-colors duration-300 ${
                      openFaq === index ? 'border-[#0976BC]/35' : 'border-slate-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="flex min-h-[74px] w-full items-center justify-between gap-6 border-0 bg-white px-7 py-5 text-left text-lg font-bold tracking-[-0.025em] text-slate-950 outline-none ring-0 transition-colors hover:bg-slate-50"
                    >
                      <span>{faq.q}</span>
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                        openFaq === index ? 'bg-[#0976BC] text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                      </span>
                    </button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="mx-7 border-t border-slate-100 pb-6 pt-5">
                            <p className="m-0 text-base leading-8 text-slate-600">{faq.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-slate-950 px-4 py-20 text-center text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[980px]">
              <h2 className="text-[2.7rem] font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-[4.2rem]">
                Ready to launch your wet wipes line?
              </h2>
              <p className="mx-auto mt-5 max-w-[640px] text-base leading-8 text-white/64">
                Build a private label wipe product with manufacturing support from Bapuji Surgicals.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={scrollToProducts} className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-slate-950 transition-colors hover:bg-sky-300">
                  Explore products
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-white/18 px-7 text-sm font-bold text-white transition-colors hover:bg-white/10 hover:text-white">
                  <svg className="h-[18px] w-[18px] text-white" viewBox="0 0 448 512" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M380.9 97.1C339 55.1 283.2 32 223.9 32 101.5 32 2 131.5 2 253.9c0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.5 224.1-221.9 0-59.3-25.2-115-67.1-157.1zM223.9 438.7h-.1c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.5 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
                    />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </section>
        </main>

        <AnimatePresence>
          {modalProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex justify-end bg-slate-950/72 backdrop-blur-sm"
              onClick={() => setModalProduct(null)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 210 }}
                className="h-full w-full overflow-y-auto bg-white p-6 sm:max-w-[560px] sm:p-8"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setModalProduct(null)}
                  className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200"
                  aria-label="Close product details"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="mt-6 flex h-[320px] items-center justify-center rounded-lg bg-slate-50 p-8">
                  <img src={modalProduct.detailImage} alt={modalProduct.name} className="h-full w-full object-contain drop-shadow-[0_24px_36px_rgba(15,23,42,0.16)]" />
                </div>
                <p className="mt-8 text-sm font-bold uppercase tracking-[0.12em] text-[#0976BC]">{modalProduct.short}</p>
                <h2 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-slate-950">{modalProduct.name}</h2>
                <p className="mt-4 text-base leading-8 text-slate-600">{modalProduct.desc}</p>
                <div className="mt-8 grid gap-3">
                  {modalProduct.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 font-bold text-slate-700">
                      <Check className="h-5 w-5 text-emerald-500" />
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">MOQ</p>
                    <p className="mt-1 font-bold text-slate-950">{modalProduct.moq}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Private label</p>
                    <p className="mt-1 font-bold text-emerald-600">Available</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setModalProduct(null);
                    setTimeout(scrollToProducts, 120);
                  }}
                  className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0976BC] font-bold text-white transition-colors hover:bg-[#075f98]"
                >
                  View product range
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </>
  );
};

export default WeyWipesPage;
