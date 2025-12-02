import React from 'react';
import { Box } from '@mui/material';
import HeroSection from '../components/home/HeroSection';
import Ecosystem from '../components/home/Ecosystem';
import Community from '../components/home/Community';
import Team from '../components/home/Team';
import LatestNews from '../components/home/LatestNews';
import Roadmap from '../components/home/Roadmap';
import FAQ from '../components/home/FAQ';
import FinalCTA from '../components/home/FinalCTA';

const Home: React.FC = () => {
  return (
    <Box>
      <HeroSection />
      <Ecosystem />
      <Community />
      <Team />
      <LatestNews />
      <Roadmap />
      <FAQ />
      <FinalCTA />
    </Box>
  );
};

export default Home;
