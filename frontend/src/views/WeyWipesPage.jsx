'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, Cpu, ShoppingBag, Layers, Activity, Check, ChevronDown, Award, FlaskConical, Plus, X, Users, Settings, ArrowRight, Download, Factory, CheckCircle2, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const wipesCategories = [
  { id: 'baby', name: 'Baby Wipes', desc: 'Hypoallergenic, ultra-soft care for sensitive newborn skin.', image: '/img/baby_wipes_front_1781683404957.png', perspective: '/img/baby_wipes_perspective_1781683500232.png', features: ['99% Pure Water', 'Aloe & Vitamin E', 'Alcohol-Free'] },
  { id: 'personal', name: 'Personal Care Wipes', desc: 'Refreshing daily wipes infused with cucumber and mint.', image: '/img/personal_wipes_front_1781683417872.png', perspective: '/img/personal_wipes_perspective_1781683524082.png', features: ['Cooling Sensation', 'Travel Friendly', 'pH Balanced'] },
  { id: 'mens', name: "Men's Care Wipes", desc: 'Heavy-duty cooling wipes for active men.', image: '/img/mens_wipes_front_1781683430559.png', perspective: '/img/mens_wipes_perspective_1781683542130.png', features: ['Odor Neutralizing', 'Menthol Cooling', 'Extra Large'] },
  { id: 'womens', name: "Women's Care Wipes", desc: 'Gentle intimate hygiene and makeup removal.', image: '/img/womens_wipes_front_1781683440999.png', perspective: '/img/womens_wipes_perspective_1781683554768.png', features: ['Micellar Infused', 'Rosewater', 'Soothing'] },
  { id: 'pet', name: 'Pet Wipes', desc: 'Deodorizing and dirt-removing wipes for dogs and cats.', image: '/img/pet_wipes_front_1781683466061.png', perspective: '/img/pet_wipes_perspective_1781687043029.png', features: ['Oatmeal Extract', 'Tear-Resistant', 'Pet Safe'] },
  { id: 'household', name: 'Household Wipes', desc: 'Antibacterial multi-surface cleaning wipes.', image: '/img/household_wipes_front_1781683478151.png', perspective: '/img/household_wipes_front_1781683478151.png', features: ['Kills 99.9% Bacteria', 'Grease Cutting', 'Lemon Scent'] },
  { id: 'auto', name: 'Automobile Wipes', desc: 'Premium dashboard and leather conditioning wipes.', image: '/img/auto_wipes_front_1781683488881.png', perspective: '/img/auto_wipes_front_1781683488881.png', features: ['UV Protection', 'Leather Conditioning', 'Lint-Free'] }
];

const WeyWipesPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  // Auto-playing hero slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % wipesCategories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
    <Head>
      <title>OEM Wet Wipes Manufacturer | Private Label Wipes | Bapuji Surgicals</title>
      <meta name="description" content="Leading OEM and Private Label Wet Wipes manufacturer. 50+ million monthly capacity, GMP certified, export ready. Baby, Personal Care, Pet, and Automotive wipes." />
      <meta name="keywords" content="OEM Wet Wipes Manufacturer, Private Label Wet Wipes, Wet Wipes Contract Manufacturing, Export Quality Wet Wipes, Hospital Grade Wet Wipes" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Manufacturer",
            "name": "Bapuji Surgicals",
            "description": "Leading OEM and Private Label Wet Wipes manufacturer with 50+ million monthly capacity.",
            "url": "https://www.bapujisurgicals.com/wet-wipes",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-9876543210",
              "contactType": "customer service"
            }
          }
        `}
      </script>
    </Head>
    <div className="w-full min-h-screen bg-[#FDFCF8] font-sans selection:bg-[#0976BC] selection:text-white">
      <Navbar />

      {/* =========================================
          FLOATING CONVERSION BAR
          ========================================= */}
      <div className="fixed bottom-0 md:bottom-auto md:top-1/3 left-0 md:left-auto md:right-0 w-full md:w-auto bg-white/90 backdrop-blur-md shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl md:rounded-l-2xl z-40 flex flex-row md:flex-col justify-around md:justify-start items-center p-3 md:p-4 gap-2 md:gap-4 border-t md:border-t-0 md:border-l border-gray-200">
        <button className="flex flex-col md:flex-row items-center gap-1 md:gap-3 hover:text-[#0976BC] transition-colors group">
          <div className="bg-[#0976BC] text-white p-2 md:p-3 rounded-full group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="text-[10px] md:text-sm font-bold text-gray-800 md:pr-4">Request Quote</span>
        </button>
        <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex flex-col md:flex-row items-center gap-1 md:gap-3 hover:text-green-500 transition-colors group">
          <div className="bg-green-500 text-white p-2 md:p-3 rounded-full group-hover:scale-110 transition-transform">
            <Phone className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="text-[10px] md:text-sm font-bold text-gray-800 md:pr-4">WhatsApp</span>
        </a>
      </div>

      {/* =========================================
          HERO SECTION (Cinematic Apple-Style)
          ========================================= */}
      <section className="relative w-full h-[90vh] bg-black overflow-hidden flex items-center justify-center pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-between px-10 md:px-24"
          >
            {/* Left Content */}
            <div className="w-full md:w-1/2 flex flex-col items-start z-20">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-[#0976BC] font-bold tracking-widest uppercase text-sm mb-4"
              >
                Premium OEM Manufacturing
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-white text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
              >
                {wipesCategories[currentSlide].name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-gray-400 text-lg md:text-xl mb-8 max-w-lg"
              >
                {wipesCategories[currentSlide].desc}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex gap-4"
              >
                <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors">
                  Request OEM Quote
                </button>
                <button className="border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
                  Download Catalog
                </button>
              </motion.div>
            </div>

            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="hidden md:flex w-1/2 justify-end z-20"
            >
              <img 
                src={wipesCategories[currentSlide].image} 
                alt={wipesCategories[currentSlide].name} 
                className="max-h-[70vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="absolute bottom-10 left-10 md:left-24 flex gap-3 z-30">
          {wipesCategories.map((_, idx) => (
            <div key={idx} className="w-12 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer" onClick={() => setCurrentSlide(idx)}>
              {idx === currentSlide && (
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-full bg-[#0976BC]"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          PRODUCT CATEGORIES GRID
          ========================================= */}
      <section className="py-32 px-6 md:px-24 bg-white">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Our Premium Wipes Portfolio</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Click on any category to explore specifications, OEM opportunities, and packaging variants.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {wipesCategories.map((cat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-[#F8F9FA] rounded-3xl p-8 cursor-pointer border border-gray-100 hover:shadow-2xl hover:border-transparent transition-all group"
              onClick={() => setSelectedProduct(cat)}
            >
              <div className="h-48 mb-8 flex justify-center items-center">
                <img src={cat.image} alt={cat.name} className="h-full object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{cat.name}</h3>
              <p className="text-gray-600 mb-6">{cat.desc}</p>
              <div className="flex flex-wrap gap-2">
                {cat.features.slice(0, 2).map((feat, i) => (
                  <span key={i} className="text-xs font-semibold bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full">{feat}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================
          OEM MANUFACTURING BLOCK
          ========================================= */}
      <section className="py-32 bg-[#0976BC] text-white px-6 md:px-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Complete OEM & Private Label Solutions</h2>
            <p className="text-blue-100 text-lg mb-10">We don't just manufacture wipes; we build brands. From custom formulation to export-ready packaging, our end-to-end OEM services are trusted by industry leaders globally.</p>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <FlaskConical className="w-8 h-8 text-blue-300 mb-4" />
                <h4 className="font-bold text-xl mb-2">Custom Formulation</h4>
                <p className="text-blue-100 text-sm">Tailored ingredients, pH levels, and active compounds to suit your market.</p>
              </div>
              <div>
                <Layers className="w-8 h-8 text-blue-300 mb-4" />
                <h4 className="font-bold text-xl mb-2">Custom Packaging</h4>
                <p className="text-blue-100 text-sm">Canisters, flow-packs, individual sachets, and premium boxes.</p>
              </div>
              <div>
                <Award className="w-8 h-8 text-blue-300 mb-4" />
                <h4 className="font-bold text-xl mb-2">Custom Fragrance</h4>
                <p className="text-blue-100 text-sm">Extensive library of hypoallergenic and premium fragrances.</p>
              </div>
              <div>
                <Truck className="w-8 h-8 text-blue-300 mb-4" />
                <h4 className="font-bold text-xl mb-2">Export Ready</h4>
                <p className="text-blue-100 text-sm">Fully compliant documentation and logistics for 20+ countries.</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 p-10 rounded-3xl backdrop-blur-md border border-white/20">
            <h3 className="text-2xl font-bold mb-6">Request Manufacturing Quote</h3>
            <form className="flex flex-col gap-4">
              <input type="text" placeholder="Company Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50" />
              <div className="flex gap-4">
                <input type="text" placeholder="Contact Person" className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50" />
                <input type="text" placeholder="Country" className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50" />
              </div>
              <select className="w-full bg-[#0A64A0] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50">
                <option value="">Select Product Category...</option>
                <option value="baby">Baby Wipes</option>
                <option value="personal">Personal Care Wipes</option>
                <option value="auto">Automobile Wipes</option>
                <option value="other">Other</option>
              </select>
              <textarea placeholder="Describe your requirement (MOQ, Private Label needs...)" rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50"></textarea>
              <button type="button" className="bg-white text-[#0976BC] font-bold py-4 rounded-xl mt-4 hover:bg-gray-100 transition-colors" onClick={() => alert('Inquiry Submitted successfully!')}>Submit Inquiry</button>
            </form>
          </div>
        </div>
      </section>

      {/* =========================================
          TRUSTED MANUFACTURING PARTNER
          ========================================= */}
      <section className="py-32 px-6 md:px-24 bg-white text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Trusted Manufacturing Partner</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-20">We operate one of the most advanced automated facilities, equipped to handle global scale and exceptional quality.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="p-8">
            <h3 className="text-5xl font-extrabold text-[#0976BC] mb-4">50+</h3>
            <p className="text-gray-700 font-bold">Brands Served</p>
          </div>
          <div className="p-8">
            <h3 className="text-5xl font-extrabold text-[#0976BC] mb-4">10+</h3>
            <p className="text-gray-700 font-bold">Countries Exported To</p>
          </div>
          <div className="p-8">
            <h3 className="text-5xl font-extrabold text-[#0976BC] mb-4">50M+</h3>
            <p className="text-gray-700 font-bold">Wipes Monthly Capacity</p>
          </div>
          <div className="p-8">
            <h3 className="text-5xl font-extrabold text-[#0976BC] mb-4">98%</h3>
            <p className="text-gray-700 font-bold">Customer Satisfaction</p>
          </div>
        </div>

        <h3 className="text-3xl font-bold mb-10 text-gray-900">Quality & Compliance</h3>
        <div className="flex flex-wrap justify-center gap-6">
          {['GMP Certified', 'ISO 9001:2015', 'FDA Compliant', 'Dermatologically Tested', 'Alcohol-Free', 'Paraben-Free'].map((cert, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-6 py-4 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span className="font-bold text-gray-800">{cert}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          FACTORY & PRODUCTION SHOWCASE
          ========================================= */}
      <section className="py-32 bg-[#F8F9FA] px-6 md:px-24">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center text-gray-900">Inside Our Manufacturing Facility</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-16 text-center">State-of-the-art automated production, rigorous quality testing, and massive warehousing capabilities.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative h-80 rounded-3xl overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60" alt="Production Line" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <span className="text-white font-bold text-xl">Production Line</span>
            </div>
          </div>
          <div className="relative h-80 rounded-3xl overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1580983546086-5c6218d9f1db?w=800&auto=format&fit=crop&q=60" alt="Packaging Line" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <span className="text-white font-bold text-xl">Automated Packaging</span>
            </div>
          </div>
          <div className="relative h-80 rounded-3xl overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=60" alt="Quality Testing" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <span className="text-white font-bold text-xl">Quality Testing Lab</span>
            </div>
          </div>
          <div className="relative h-80 rounded-3xl overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60" alt="Warehouse" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <span className="text-white font-bold text-xl">Global Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          OEM PROCESS TIMELINE
          ========================================= */}
      <section className="py-32 bg-[#F8F9FA] px-6 md:px-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center text-gray-900">How OEM Works</h2>
          <div className="flex flex-col md:flex-row justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 hidden md:block"></div>
            {[
              { step: 1, title: 'Inquiry' },
              { step: 2, title: 'Product Discussion' },
              { step: 3, title: 'Sample Development' },
              { step: 4, title: 'Artwork Approval' },
              { step: 5, title: 'Manufacturing' },
              { step: 6, title: 'QC Inspection' },
              { step: 7, title: 'Dispatch' }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center mb-8 md:mb-0 bg-[#F8F9FA] px-4">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-[#0976BC] flex items-center justify-center text-[#0976BC] font-bold text-xl mb-4 shadow-xl">
                  {s.step}
                </div>
                <span className="font-bold text-gray-800 text-center max-w-[120px]">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          PRODUCT COMPARISON TABLE
          ========================================= */}
      <section className="py-32 bg-white px-6 md:px-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-gray-900">Capability Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="p-6 font-bold text-gray-900">Product Category</th>
                  <th className="p-6 font-bold text-gray-900">Alcohol Free</th>
                  <th className="p-6 font-bold text-gray-900">Fragrance</th>
                  <th className="p-6 font-bold text-gray-900">OEM Capable</th>
                  <th className="p-6 font-bold text-gray-900">Standard MOQ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-6 font-bold text-gray-800">Baby Wipes</td>
                  <td className="p-6 text-green-600 font-bold">Yes</td>
                  <td className="p-6 text-gray-600">Mild / Custom</td>
                  <td className="p-6 text-green-600 font-bold">Yes</td>
                  <td className="p-6 text-gray-600">10k Packs</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-6 font-bold text-gray-800">Personal Care Wipes</td>
                  <td className="p-6 text-green-600 font-bold">Yes</td>
                  <td className="p-6 text-gray-600">Custom</td>
                  <td className="p-6 text-green-600 font-bold">Yes</td>
                  <td className="p-6 text-gray-600">10k Packs</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-6 font-bold text-gray-800">Pet Wipes</td>
                  <td className="p-6 text-green-600 font-bold">Yes</td>
                  <td className="p-6 text-gray-600">Custom</td>
                  <td className="p-6 text-green-600 font-bold">Yes</td>
                  <td className="p-6 text-gray-600">10k Packs</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-6 font-bold text-gray-800">Household Wipes</td>
                  <td className="p-6 text-red-500 font-bold">Contains Alcohol</td>
                  <td className="p-6 text-gray-600">Lemon / Custom</td>
                  <td className="p-6 text-green-600 font-bold">Yes</td>
                  <td className="p-6 text-gray-600">10k Packs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================
          OEM FAQ SECTION
          ========================================= */}
      <section className="py-32 bg-[#F8F9FA] px-6 md:px-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-gray-900">OEM Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What is the MOQ (Minimum Order Quantity)?", a: "Our standard MOQ starts at 10,000 packs per variant to ensure cost-efficiency in custom manufacturing. However, we can discuss pilot runs for long-term strategic partners." },
              { q: "Can I use my own branding and Private Label?", a: "Absolutely. We specialize in Private Label manufacturing. Our team will work with your artwork and brand guidelines to produce market-ready products." },
              { q: "Do you export globally?", a: "Yes, we currently export to over 20+ countries and are fully compliant with international logistics, documentation, and regulatory standards." },
              { q: "Can you customize the fragrance and formulation?", a: "Yes! We have an extensive library of hypoallergenic, natural, and premium fragrances. We also formulate custom solutions including alcohol-free, antibacterial, and specialized extracts." },
              { q: "What is the standard production lead time?", a: "Initial custom orders typically take 4-6 weeks for formulation, packaging approval, and production. Repeat orders have significantly shorter lead times." },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <button 
                  className="w-full px-8 py-6 text-left flex justify-between items-center font-bold text-lg text-gray-900 hover:text-[#0976BC] transition-colors"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  {faq.q}
                  <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-[#0976BC]' : 'text-gray-400'}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-6 text-gray-600 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          DOWNLOAD CENTER & CTA
          ========================================= */}
      <section className="py-32 bg-[#111] text-white px-6 md:px-24 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready To Launch Your Brand?</h2>
        <p className="text-gray-400 text-xl mb-16 max-w-2xl mx-auto">Partner with Bapuji Surgicals for world-class OEM and Private Label Manufacturing.</p>
        
        <div className="flex flex-wrap justify-center gap-6 mb-20">
          <button className="bg-[#0976BC] text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-600 transition-colors shadow-2xl shadow-blue-500/20">
            Request OEM Quote
          </button>
          <button className="bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors">
            Schedule Consultation
          </button>
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="border border-white/20 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center gap-3">
            <Phone className="w-5 h-5" /> WhatsApp Us
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto border-t border-white/10 pt-16">
          <div className="flex flex-col items-center cursor-pointer hover:text-[#0976BC] transition-colors">
            <Download className="w-10 h-10 mb-4 text-gray-400" />
            <span className="font-bold">Download Brochure</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-[#0976BC] transition-colors">
            <Download className="w-10 h-10 mb-4 text-gray-400" />
            <span className="font-bold">Product Catalog</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-[#0976BC] transition-colors">
            <Download className="w-10 h-10 mb-4 text-gray-400" />
            <span className="font-bold">OEM Capability Deck</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-[#0976BC] transition-colors">
            <Download className="w-10 h-10 mb-4 text-gray-400" />
            <span className="font-bold">Certifications</span>
          </div>
        </div>
      </section>

      {/* =========================================
          PRODUCT DETAIL MODAL
          ========================================= */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full md:w-[600px] bg-white h-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-8 right-8 bg-gray-100 p-2 rounded-full hover:bg-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="h-80 bg-[#F8F9FA] rounded-2xl flex items-center justify-center p-8 mb-8 mt-10">
                  <img src={selectedProduct.perspective || selectedProduct.image} alt={selectedProduct.name} className="h-full object-contain drop-shadow-2xl" />
                </div>
                
                <h2 className="text-4xl font-bold mb-4 text-gray-900">{selectedProduct.name}</h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">{selectedProduct.desc}</p>
                
                <h3 className="text-xl font-bold mb-4">Product Features</h3>
                <ul className="space-y-3 mb-10">
                  {selectedProduct.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <Check className="w-5 h-5 text-green-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
                
                <h3 className="text-xl font-bold mb-4">OEM Availability</h3>
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="block text-sm text-gray-500 mb-1">Standard MOQ</span>
                    <span className="font-bold text-gray-900">10,000 Packs</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="block text-sm text-gray-500 mb-1">Private Label</span>
                    <span className="font-bold text-green-600">Available</span>
                  </div>
                </div>

                <button type="button" className="w-full bg-[#0976BC] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors" onClick={() => alert('Redirecting to OEM Quote Form')}>
                  Request OEM Quote
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
    </>
  );
};

export default WeyWipesPage;
