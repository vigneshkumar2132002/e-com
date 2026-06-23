'use client';
import React from 'react';

// Modular Home Components
import { HeroSection } from '../components/home/HeroSection';
import { CertificationsStrip } from '../components/home/CertificationsStrip';
import { ManufacturingCapacity } from '../components/home/ManufacturingCapacity';
import { ProductCategories } from '../components/home/ProductCategories';
import { OEMCapabilities } from '../components/home/OEMCapabilities';
import { FinalCTA } from '../components/home/FinalCTA';

const Home = () => {
  return (
      <div className="w-full min-h-screen font-sans selection:bg-[#0976BC] selection:text-white relative pb-10">
        <main>
          <HeroSection />
          <CertificationsStrip />
          <ManufacturingCapacity />
          <ProductCategories />
          <OEMCapabilities />
          <FinalCTA />
        </main>
      </div>
  );
};

export default Home;
