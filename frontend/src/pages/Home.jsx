import React from 'react';
import { useApp } from '../context/AppContext';
import Hero from '../sections/Hero';
import Categories from '../sections/Categories';
import FeaturedProperties from '../sections/FeaturedProperties';
import WhyChooseUs from '../sections/WhyChooseUs';
import Services from '../sections/Services';
import InvestmentLocations from '../sections/InvestmentLocations';
import Statistics from '../sections/Statistics';
import Testimonials from '../sections/Testimonials';
import MeetExperts from '../sections/MeetExperts';
import LatestArticles from '../sections/LatestArticles';
import BookSiteVisit from '../sections/BookSiteVisit';

const Home = () => {
  const { openBookModal } = useApp();
  return (
    <>
      <Hero onCtaClick={openBookModal} />
      <Categories />
      <FeaturedProperties />
      <WhyChooseUs />
      <Services />
      <InvestmentLocations />
      <Statistics />
      <Testimonials />
      <MeetExperts />
      <LatestArticles />

    </>
  );
};

export default Home;
