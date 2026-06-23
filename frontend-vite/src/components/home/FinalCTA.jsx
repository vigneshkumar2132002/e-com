'use client';
import React from 'react';
import { ArrowRight, Download } from 'lucide-react';

export const FinalCTA = () => {
  return (
    <section className="py-24 bg-[#0A2540] text-white px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Ready to Partner?</h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Contact our sales team today to discuss your OEM requirements, request samples, or schedule a facility tour.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <button className="w-full sm:w-auto bg-[#4EB5F7] text-[#0A2540] px-10 py-4 rounded-full font-bold text-lg hover:bg-white transition-colors flex items-center justify-center gap-3">
            Contact Sales <ArrowRight className="w-5 h-5" />
          </button>
          <button className="w-full sm:w-auto border border-white/20 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-3">
            <Download className="w-5 h-5" /> Company Profile
          </button>
        </div>
      </div>
    </section>
  );
};
