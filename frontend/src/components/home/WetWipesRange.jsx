'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const wipes = [
  {
    title: 'Baby Wipes',
    note: 'Gentle daily care',
    image: '/img/wetwipes-cutouts/baby-wipes-cutout.png',
    accent: '#0ea5e9',
  },
  {
    title: 'Household Wipes',
    note: 'Surface cleaning',
    image: '/img/wetwipes-cutouts/household-wipes-cutout.png',
    accent: '#22c55e',
  },
  {
    title: 'Pet Wipes',
    note: 'Coat and paw care',
    image: '/img/wetwipes-cutouts/pet-wipes-cutout.png',
    accent: '#a855f7',
  },
  {
    title: 'Automobile Wipes',
    note: 'Interior detailing',
    image: '/img/wetwipes-cutouts/automobile-wipes-cutout.png',
    accent: '#f97316',
  },
  {
    title: 'Women Wipes',
    note: 'Personal freshness',
    image: '/img/wetwipes-cutouts/women-wipes-cutout.png',
    accent: '#ec4899',
  },
  {
    title: 'Men Wipes',
    note: 'Grooming essentials',
    image: '/img/wetwipes-cutouts/men-wipes-cutout.png',
    accent: '#334155',
  },
];

export const WetWipesRange = () => {
  return (
    <section className="px-4 pb-8 sm:px-6 lg:px-8 lg:pb-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="relative left-1/2 mb-10 w-screen -translate-x-1/2 border-y border-slate-200 bg-white/70 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:px-8">
            <div className="max-w-[760px]">
              <p className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#0976BC]">
                <Sparkles className="h-4 w-4" />
                Wet wipes only
              </p>
              <h2 className="m-0 text-[2.45rem] font-bold leading-[1.04] tracking-[-0.04em] text-slate-950 sm:text-[3.2rem] lg:text-[4rem]">
                A clearer lineup for daily-use wipes.
              </h2>
            </div>
            <p className="max-w-[420px] text-base leading-7 text-slate-600 lg:text-right">
              Six focused wet wipe formats for baby care, home cleaning, pets, auto detailing and personal care programs.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {wipes.map((item) => (
            <a
              key={item.title}
              href="/weywipes"
              className="group flex min-h-[390px] flex-col justify-between overflow-hidden rounded-lg border border-slate-200 bg-white p-5 text-slate-950 shadow-[0_16px_44px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:text-slate-950 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)]"
            >
              <div className="flex justify-end">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0976BC] text-white transition-transform duration-300 group-hover:rotate-[-35deg]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>

              <div className="relative my-7 flex flex-1 items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="relative max-h-[190px] w-full object-contain drop-shadow-[0_18px_26px_rgba(15,23,42,0.12)] transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div>
                <h3 className="m-0 text-[1.28rem] font-bold leading-tight tracking-[-0.03em] text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-semibold text-slate-500">{item.note}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
