import React from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../sections/HeroSection';
import { TrendingSection } from '../sections/TrendingSection';
import { BannerSection } from '../sections/BannerSection';
import { CategoryGridSection } from '../sections/CategoryGridSection';
import { TestimonialSection } from '../sections/TestimonialSection';
import { Footer } from '../sections/Footer';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrendingSection />
        <BannerSection />
        <CategoryGridSection />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  );
};

