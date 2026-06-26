'use client';
import React from 'react';
import Head from 'next/head';

// Modular Home Components
import { HeroSection } from '../components/home/HeroSection';
import { AboutIntroduction } from '../components/home/AboutIntroduction';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { ProductCategories } from '../components/home/ProductCategories';
import { WetWipesRange } from '../components/home/WetWipesRange';
import { CompanyFAQ } from '../components/home/CompanyFAQ';
import { TestimonialsSection } from '../components/home/TestimonialsSection';

const Home = () => {
  return (
    <>
      <Head>
        <title>Bapuji Surgicals | Premium OEM & Private Label</title>
        <meta name="description" content="Leading OEM manufacturer of Wet Wipes and Surgical Dressings. Partner with Bapuji Surgicals for private label manufacturing." />
        <meta name="keywords" content="OEM Manufacturer, Private Label, Wet Wipes OEM, Surgical Dressings" />
      </Head>

      <div className="home-dotted-bg w-full min-h-screen bg-white font-sans selection:bg-[#0976BC] selection:text-white relative pb-10">
        <main>
          <HeroSection />
          <AboutIntroduction />
          <WhyChooseUs />
          <ProductCategories />
          <WetWipesRange />
          <CompanyFAQ />
          <TestimonialsSection />
        </main>
      </div>
    </>
  );
};

export default Home;
