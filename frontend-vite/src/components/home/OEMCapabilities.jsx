'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Box, Plane, Stethoscope } from 'lucide-react';

export const OEMCapabilities = () => {
  const capabilities = [
    { icon: Droplet, title: "Custom Formulation", desc: "In-house R&D for proprietary blends, hypoallergenic formulas, and natural extracts." },
    { icon: Box, title: "Private Labeling", desc: "Complete end-to-end white label solutions, from design to mass production." },
    { icon: Stethoscope, title: "Medical Grade", desc: "Surgical dressings and hospital-grade sanitization products meeting global compliance." },
    { icon: Plane, title: "Global Logistics", desc: "Seamless export and documentation handling across 25+ countries." }
  ];

  return (
    <section className="py-24 bg-[#FAFAFC] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">OEM Solutions</h2>
          <p className="text-xl text-gray-600 max-w-2xl">We act as a direct extension of your brand, managing formulation, production, and international logistics.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {capabilities.map((cap, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-[#0976BC]/10 rounded-2xl flex items-center justify-center mb-6 text-[#0976BC]">
                <cap.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{cap.title}</h3>
              <p className="text-gray-600 leading-relaxed">{cap.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
