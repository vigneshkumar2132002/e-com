'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, ClipboardCheck, FlaskConical, HeartPulse } from 'lucide-react';

const reasons = [
  {
    icon: CalendarCheck,
    title: 'Reliable Production Planning',
    desc: 'We align sampling, batch schedules and repeat orders so distributors and brands can plan supply with confidence.',
  },
  {
    icon: FlaskConical,
    title: 'Custom OEM Programs',
    desc: 'From wet wipe formulas to packaging formats, our team supports private label products built around your market needs.',
  },
  {
    icon: ClipboardCheck,
    title: 'Quality Documentation',
    desc: 'Batch records, inspection checks and clean production workflows help keep every order consistent and traceable.',
  },
  {
    icon: HeartPulse,
    title: 'Healthcare-Focused Range',
    desc: 'Our portfolio covers hygiene wipes, wound care, sterilization packaging and essential medical supply lines.',
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="bg-transparent px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] rounded-[26px] bg-[#f2f8fc] px-5 py-10 text-slate-950 sm:px-8 lg:px-12 lg:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[650px]">
            <h2 className="m-0 text-[2.2rem] font-bold leading-none tracking-[-0.04em] text-slate-950 sm:text-[3rem]">
              Why Choose Us?
            </h2>
            <p className="mt-4 max-w-[560px] text-sm font-medium leading-6 text-slate-600 sm:text-base sm:leading-7">
              Our commitment to dependable healthcare manufacturing goes beyond products. We support brands, hospitals and distributors with quality, clarity and repeatable supply.
            </p>
          </div>

          <Link
            href="/oem"
            className="group inline-flex h-12 w-fit items-center justify-center gap-3 rounded-full bg-[#0976BC] py-1 pl-7 pr-1 text-sm font-bold text-white transition-colors hover:bg-[#075f98] hover:text-white"
          >
            Start OEM Inquiry
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0976BC] transition-transform duration-300 group-hover:rotate-[-35deg]">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <article
                key={reason.title}
                className="flex min-h-[310px] flex-col rounded-[18px] bg-white p-7 text-slate-950 transition-transform duration-300 hover:-translate-y-1"
              >
                <Icon className="h-8 w-8 text-[#0976BC]" strokeWidth={1.8} />
                <h3 className="mt-9 max-w-[230px] text-xl font-bold leading-[1.08] tracking-[-0.035em] text-slate-950">
                  {reason.title}
                </h3>
                <p className="mt-4 max-w-[250px] text-sm font-medium leading-6 text-slate-600">
                  {reason.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
