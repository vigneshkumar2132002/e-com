'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

const productionImages = [
  {
    src: '/img/bapuji-production-hygiene-wipes.png',
    alt: 'Hygiene wipes moving through a clean production line',
  },
  {
    src: '/img/bapuji-production-sterilization-pouches.png',
    alt: 'Sterilization reels and pouches undergoing quality inspection',
  },
  {
    src: '/img/bapuji-production-medical-labels.png',
    alt: 'Medical labels being inspected during production',
  },
  {
    src: '/img/bapuji-production-wound-care.png',
    alt: 'Advanced wound dressings undergoing laboratory quality checks',
  },
  {
    src: '/img/bapuji-production-surgical-gauze.png',
    alt: 'Surgical gauze pads being produced and packed',
  },
  {
    src: '/img/bapuji-production-final-packaging.png',
    alt: 'Finished healthcare products being checked before dispatch',
  },
];

const productFamilies = [
  'Surgical dressings',
  'Hygiene care',
  'Sterilization packaging',
  'Advanced wound care',
];

export const AboutIntroduction = () => {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % productionImages.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="bg-transparent px-5 py-16 md:px-8 md:py-24 lg:py-28">
      <div className="mx-auto grid max-w-[1600px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#EAF5FB] md:rounded-[40px]">
            {productionImages.map((image, index) => (
              <div
                key={image.src}
                className={`absolute inset-0 transition-[opacity,transform] duration-1000 ${
                  index === activeImage ? 'scale-[1.08] opacity-100' : 'scale-100 opacity-0'
                }`}
                style={{ zIndex: index === activeImage ? 2 : 1 }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  priority
                />
              </div>
            ))}

            <div className="absolute bottom-5 left-5 z-10 flex gap-1.5" aria-hidden="true">
              {productionImages.map((image, index) => (
                <span
                  key={image.src}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index === activeImage ? 'w-7 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-5 inline-flex items-center rounded-full border border-[#0976BC]/15 bg-[#0976BC]/8 px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#0976BC] shadow-[0_10px_28px_rgba(9,118,188,0.08)]">
            Who we are
          </p>
          <h2 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 md:text-5xl lg:text-[3.5rem]">
            Healthcare essentials made with precision and care.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
            Established in 1980, Bapuji Surgicals has supported hospitals, clinics and healthcare professionals for more than four decades with dependable medical and hygiene products.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
            Our portfolio brings together surgical dressings, hygiene care, sterilization reels and pouches, medical labels and tags, and advanced wound-care solutions—developed around safety, consistency and clinical effectiveness.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {productFamilies.map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 md:text-base">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#0976BC]" strokeWidth={2.2} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#0976BC] px-6 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#07649f] hover:text-white"
          >
            Discover our story
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
