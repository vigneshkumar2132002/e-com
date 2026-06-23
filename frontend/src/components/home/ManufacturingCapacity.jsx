'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const ManufacturingCapacity = () => {
  const stats = [
    { number: "50M+", label: "Monthly Capacity" },
    { number: "40+", label: "Years Expertise" },
    { number: "12", label: "Automated Lines" },
    { number: "25+", label: "Export Countries" }
  ];

  return (
    <section className="py-14 md:py-24 bg-[#FAFAFC] px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight">Massive Scale.<br/>Zero Compromise.</h2>
          <p className="text-base md:text-xl text-gray-600">Our infrastructure is engineered for high-volume contract manufacturing, delivering unyielding quality from pilot runs to global distribution.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 text-center hover:shadow-xl transition-shadow"
            >
              <h3 className="text-3xl md:text-5xl font-black text-[#0976BC] mb-2">{stat.number}</h3>
              <p className="font-bold text-gray-500 uppercase tracking-wider text-xs md:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
