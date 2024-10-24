'use client';

// @mui
import Box from '@mui/material/Box';
// routes
import { usePathname } from 'src/routes/hook';
//
import Footer from './footer';
import Header from './header';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  const pathname = usePathname();

  const isHome = pathname === '/';

  console.log(pathname,'pathhhh')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1, maxWidth:'100%' }}>
      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(!isHome && {
            pt: { xs: 8, md: 10 },
          }),
        }}
      >
        {children}
      </Box>

        {(pathname === '/find-doctor/register/' || pathname === '/find-doctor/login/') && <Footer />}
      
    </Box>
  );
}
