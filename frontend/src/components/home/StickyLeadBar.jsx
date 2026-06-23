'use client';
import React from 'react';
import { Phone, FileText } from 'lucide-react';

export const StickyLeadBar = () => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-auto md:top-1/3 md:left-auto md:right-0 md:translate-x-0 bg-white/90 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.15)] md:shadow-2xl rounded-full md:rounded-l-2xl md:rounded-r-none z-50 flex flex-row md:flex-col items-center p-2 md:p-4 gap-2 md:gap-4 border border-gray-200 md:border-r-0">
      <button className="flex flex-row md:flex-col items-center gap-2 md:gap-2 hover:text-[#0976BC] transition-colors group px-4 md:px-0 py-2 md:py-0">
        <div className="bg-[#0976BC] text-white p-2.5 rounded-full group-hover:scale-110 transition-transform">
          <FileText className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold text-gray-800 md:text-xs">Quote</span>
      </button>
      
      <div className="w-px h-8 bg-gray-200 md:w-8 md:h-px"></div>
      
      <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex flex-row md:flex-col items-center gap-2 md:gap-2 hover:text-green-500 transition-colors group px-4 md:px-0 py-2 md:py-0">
        <div className="bg-green-500 text-white p-2.5 rounded-full group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
          <Phone className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold text-gray-800 md:text-xs">Chat</span>
      </a>
    </div>
  );
};
