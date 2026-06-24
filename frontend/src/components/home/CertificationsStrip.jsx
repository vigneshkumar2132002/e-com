'use client';
import React from 'react';

export const CertificationsStrip = () => {
  const certs = [
    { imgSrc: "/img/iso_logo.png", title: "ISO 9001:2015", desc: "Certified Quality" },
    { imgSrc: "/img/gmp_logo.png", title: "GMP Certified", desc: "Good Manufacturing" },
    { imgSrc: "/img/fda_logo.png", title: "FDA Compliant", desc: "Export Standards" }
  ];

  return (
    <div className="w-full bg-white py-7 md:py-10 px-4 md:px-6 relative z-20">
      <div className="max-w-[90rem] mx-auto flex flex-wrap justify-center items-center gap-5 md:gap-40">
        {certs.map((cert, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 md:gap-4"
          >
            <div className="bg-[#F0F8FF] rounded-2xl flex items-center justify-center w-14 h-14 md:w-20 md:h-20 flex-shrink-0 overflow-hidden">
              <img src={cert.imgSrc} alt={cert.title} className="w-full h-full object-contain mix-blend-multiply scale-[1.35]" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm md:text-base">{cert.title}</h4>
              <p className="text-gray-500 text-xs md:text-sm">{cert.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
