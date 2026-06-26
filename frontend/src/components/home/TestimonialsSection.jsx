'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Kavya Menon',
    role: 'Founder, PureNest Hygiene',
    image: '/img/testimonials/client-kavya.png',
    imagePosition: '50% 28%',
    quote:
      'Bapuji helped us move from a product idea to a retail-ready wet wipes line with the right formulation, packaging clarity and dependable production support.',
    detail:
      'Their team understood our brand positioning and guided us through sheet size, pack count, fragrance direction and quality expectations without making the process feel complicated.',
  },
  {
    name: 'Rohan Iyer',
    role: 'Director, MedSupply Partners',
    image: '/img/testimonials/client-rohan.png',
    imagePosition: '50% 24%',
    quote:
      'The biggest difference has been consistency. Every repeat order arrives with the same pack quality, moisture feel and dispatch discipline our customers expect.',
    detail:
      'For a distributor, reliability matters as much as product quality. Bapuji gives us clear communication, practical timelines and confidence when we commit stock to clients.',
  },
  {
    name: 'Meera Shah',
    role: 'Procurement Lead, CarePlus Clinics',
    image: '/img/testimonials/client-meera.png',
    imagePosition: '50% 24%',
    quote:
      'Their healthcare manufacturing mindset shows in the details, from documentation and hygiene focus to how carefully they approach bulk supply requirements.',
    detail:
      'We needed a partner who could understand institutional standards and still remain flexible with product requirements. Bapuji has been responsive, structured and easy to work with.',
  },
];

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = testimonials[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 text-center">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0976BC]">
            What clients say
          </p>
          <h2 className="mx-auto m-0 max-w-[680px] text-[2.25rem] font-semibold leading-[1.05] text-slate-950 sm:text-[3rem] lg:text-[3.6rem]">
            Honest feedback from valued partners
          </h2>
          <p className="mx-auto mt-5 max-w-[620px] text-base leading-7 text-slate-500">
            Real responses from businesses that trusted Bapuji Surgicals for wet wipes, private label programs and healthcare supply support.
          </p>
        </div>

        <div className="grid items-center gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
          <div className="grid grid-cols-3 gap-3 lg:h-[520px] lg:grid-cols-1 lg:grid-rows-3">
            {testimonials.map((item, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`group relative h-[128px] overflow-hidden rounded-[24px] border-0 bg-white p-0 shadow-[0_14px_34px_rgba(9,118,188,0.08)] outline-none transition-all duration-500 focus-visible:ring-2 focus-visible:ring-[#0976BC]/30 sm:h-[168px] lg:h-full ${
                    isActive
                      ? 'z-10 scale-[1.08] ring-2 ring-[#0976BC] ring-offset-4 ring-offset-white shadow-[0_24px_58px_rgba(9,118,188,0.2)]'
                      : 'scale-[0.96] opacity-90 grayscale-[35%] hover:scale-100 hover:opacity-100 hover:grayscale-0'
                  }`}
                  aria-label={`Show testimonial from ${item.name}`}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 220px, 33vw"
                    className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                    style={{ objectPosition: item.imagePosition }}
                  />
                </button>
              );
            })}
          </div>

          <article className="relative min-h-[430px] overflow-hidden rounded-[36px] bg-white px-7 py-8 shadow-[0_30px_90px_rgba(9,118,188,0.11)] sm:px-10 sm:py-10 lg:h-[520px] lg:px-14">
            <Quote className="absolute right-8 top-3 h-44 w-44 text-[#0976BC]/5 sm:h-56 sm:w-56" />

            <div key={active.name} className="relative z-10 flex h-full flex-col animate-fade-in">
              <p className="max-w-[820px] text-[1.7rem] font-medium leading-[1.16] text-slate-950 sm:text-[2.3rem] lg:text-[2.65rem]">
                {active.quote}
              </p>
              <p className="mt-6 max-w-[680px] text-base leading-7 text-slate-600">
                {active.detail}
              </p>

              <div className="mt-auto flex flex-col gap-6 pt-10 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="m-0 text-xl font-bold text-slate-950">{active.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{active.role}</p>
                </div>

                <div className="flex items-center gap-1 text-[#0976BC]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-12 flex flex-col items-center text-center">
          <p className="max-w-full text-base font-semibold leading-6 text-slate-700 sm:whitespace-nowrap">
            See how a dependable manufacturing partner makes a difference.
          </p>
          <Link
            href="/oem"
            className="mt-5 inline-flex h-[52px] items-center justify-center gap-2 rounded-lg bg-slate-950 px-7 text-sm font-bold uppercase tracking-[0.04em] text-white shadow-[0_16px_34px_rgba(9,118,188,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#0976BC] hover:text-white"
          >
            Start OEM inquiry
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
