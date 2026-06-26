'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What makes Bapuji Surgicals a dependable wet wipes manufacturing partner?',
    answer:
      'Bapuji Surgicals combines healthcare manufacturing discipline with wet wipes production capability, so every program is handled with attention to hygiene, batch consistency, packaging quality and practical dispatch planning. Our team supports customers from product selection and formulation direction through substrate, fragrance, pack format and labeling choices, making it easier for brands, distributors and institutions to launch with confidence.',
  },
  {
    question: 'Do you support OEM and private label wet wipes for growing brands?',
    answer:
      'Yes. We work with businesses that need custom wet wipe programs under their own brand name, including baby care, personal care, household cleaning, pet care, automobile and specialty wipe categories. Depending on the project, we can help align the wipe type, sheet size, liquid formulation, packaging format, artwork requirements and order quantity so the final product feels commercially ready instead of generic.',
  },
  {
    question: 'How do you maintain quality across repeated wet wipes orders?',
    answer:
      'Quality is managed through defined production practices, supplier and material checks, controlled filling, packing oversight and final inspection before dispatch. For repeat orders, we focus on keeping the critical details stable, including wipe feel, moisture level, pack sealing, label accuracy and carton presentation. This consistency is especially important for distributors and private label buyers who need the same customer experience across every batch.',
  },
  {
    question: 'Can your team help choose the right wipe format for my market?',
    answer:
      'Absolutely. If you are unsure whether your product should be positioned for baby care, hygiene, personal freshness, surface cleaning, pet grooming or automotive detailing, our team can guide the conversation around use case, target customer, expected price point and packaging preference. The goal is to help you avoid overbuilding the product while still giving your customers the performance and presentation they expect.',
  },
  {
    question: 'What information should I share for a faster wet wipes quotation?',
    answer:
      'A clear inquiry usually includes the wipe category, approximate sheet size, number of wipes per pack, preferred fragrance or active ingredients, packaging style, target order quantity, branding needs and delivery location. If you already have a benchmark product, photos or a sample reference can also help. With these details, our team can respond with a more accurate production direction and quotation timeline.',
  },
  {
    question: 'Do you handle only wet wipes, or other healthcare supply products too?',
    answer:
      'Wet wipes are a focused and growing part of our product range, but Bapuji Surgicals also serves broader healthcare and hygiene supply needs, including wound care, sterilization packaging and protective medical products. This wider manufacturing background helps us bring a more disciplined, B2B-ready approach to wet wipes projects, especially for clients who value documentation, reliability and long-term supply relationships.',
  },
];

export const CompanyFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-32 lg:pt-10">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 rounded-[28px] bg-white px-6 py-10 shadow-[0_22px_70px_rgba(9,118,188,0.09)] sm:px-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20 lg:px-12 lg:py-14">
          <div className="max-w-[520px]">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#0976BC]">
              Bapuji support
            </p>
            <h2 className="m-0 text-[2.05rem] font-semibold leading-[1.08] text-slate-950 sm:text-[2.75rem]">
              Frequently asked questions
            </h2>
            <p className="mt-5 max-w-[420px] text-sm leading-6 text-slate-500">
              To help you make informed decisions, we have compiled answers to some of the most commonly asked questions about working with Bapuji Surgicals.
            </p>
          </div>

          <div className="grid gap-4">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;

              return (
              <div
                key={item.question}
                className={`overflow-hidden rounded-[22px] transition-all duration-300 ${
                  isOpen
                    ? 'bg-white shadow-[0_20px_54px_rgba(9,118,188,0.12)]'
                    : 'bg-white shadow-[0_14px_34px_rgba(9,118,188,0.055)] hover:shadow-[0_18px_46px_rgba(9,118,188,0.09)]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  className="group grid w-full cursor-pointer appearance-none grid-cols-[auto_1fr_auto] items-center gap-4 border-0 bg-transparent px-5 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0976BC]/30 sm:gap-5 sm:px-6 sm:py-7"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300 ${
                      isOpen
                        ? 'bg-[#0976BC] text-white'
                        : 'bg-[#eff6fb] text-[#526f8c] group-hover:bg-[#e4f1fa] group-hover:text-[#0976BC]'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className={`m-0 text-[1.05rem] font-bold leading-snug transition-colors duration-300 sm:text-[1.35rem] ${
                      isOpen ? 'text-slate-950' : 'text-slate-950 group-hover:text-[#0976BC]'
                    }`}
                  >
                    {item.question}
                  </h3>
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen
                        ? 'rotate-180 border-[#cce3f3] bg-[#0976BC] text-white shadow-[0_10px_22px_rgba(9,118,188,0.22)]'
                        : 'border-[#d9e7f1] bg-[#f8fbfd] text-[#0976BC] group-hover:border-[#b7d7ec] group-hover:bg-[#eff8fd]'
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-7 pl-[88px] pr-6 sm:pl-[104px] sm:pr-16">
                      <p className="m-0 max-w-[760px] pt-1 text-sm leading-7 text-slate-600">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
