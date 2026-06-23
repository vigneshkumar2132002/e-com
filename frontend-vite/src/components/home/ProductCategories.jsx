'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const ProductCategories = () => {
  const categories = [
    { title: "Baby Wipes", img: "/img/baby_wipes_front_1781683404957.png", link: "/wet-wipes", color: "bg-blue-50" },
    { title: "Personal Care", img: "/img/personal_wipes_front_1781683417872.png", link: "/wet-wipes", color: "bg-pink-50" },
    { title: "Surgical Dressings", img: "https://images.unsplash.com/photo-1584308666744-24d5e4a86121?w=500&auto=format&fit=crop&q=60", link: "/catalog", color: "bg-teal-50" },
    { title: "Automotive & Home", img: "/img/auto_wipes_front_1781683488881.png", link: "/wet-wipes", color: "bg-gray-100" }
  ];

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Manufacturing Lines</h2>
            <p className="text-xl text-gray-600">Explore our high-volume production capabilities across specialized sectors.</p>
          </div>
          <a href="/catalog" className="flex items-center gap-2 text-[#0976BC] font-bold hover:gap-3 transition-all">
            View Complete Catalog <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <a href={cat.link} key={idx}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`${cat.color} rounded-3xl p-8 h-[360px] flex flex-col justify-between group cursor-pointer hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-gray-200`}
              >
                <div className="h-48 flex items-center justify-center">
                  <img src={cat.img} alt={cat.title} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md" />
                </div>
                <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm p-4 rounded-2xl">
                  <h3 className="font-bold text-lg text-gray-900">{cat.title}</h3>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-sm group-hover:bg-[#0976BC] group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
