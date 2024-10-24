'use client';

import { useScroll } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
// layouts
import MainLayout from 'src/layouts/main';
// components
import ScrollProgress from 'src/components/scroll-progress';
//
import HomeHero from '../home-hero';
import HomeSpecialties from '../home-specialties';
import HomeFindDoctor from '../home-find-doctor';
import HomeBenefits from '../home-benefits';
import HomeConsult from '../home-consult';
import HomeAboutUs from '../home-about-us';
import HomeSubscribe from '../home-subscribe';
import HomeBackdrop from '../home-bockdrop';
import { useAuthContext } from '@/auth/hooks';
import Footer from '@/layouts/main/footer';

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();
  const {user} = useAuthContext();

  
  return (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        {!user && <HomeBackdrop/>}
        <HomeHero />

        <HomeSpecialties />

        <HomeFindDoctor />

        <HomeBenefits />

        {/* <HomeConsult /> */}

        <HomeSubscribe />

        <HomeAboutUs />
        <Footer />
      </Box>
    </MainLayout>
  );
}
