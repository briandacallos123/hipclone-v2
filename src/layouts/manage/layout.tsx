// @mui
'use client';

import Box from '@mui/material/Box';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSettingsContext } from 'src/components/settings';
//
import Main from './main';
import Header from './header';
import FooterNav from './footer-nav';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';
import { bgBlur } from '@/theme/css';
import { useTheme } from '@mui/material/styles';
import { Container } from '@mui/material';


// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ManageLayout({ children }: Props) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const mdUp = useResponsive('up', 'md');

  const nav = useBoolean();

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;

  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>{children}</Main>

        {!mdUp && <FooterNav />}
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            display: { lg: 'flex' },
            minHeight: { lg: 1 },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>

        {!mdUp && <FooterNav />}
      </>
    );
  }

  const theme = useTheme();

  return (
    <>
      <Container sx={{
        background: theme.palette.background.default,
      }} maxWidth={settings.themeStretch ? false : 'lg'}>
        <Box
          sx={{
            display: { lg: 'flex' },
            minHeight: { lg: 1 },
           

          }}
        >
          {renderNavVertical}

          <Box sx={{
            py:3,
            pt:{xs:5,lg:3},
            width:'100%'
          }}>
           {children}
          </Box>
        </Box>
      </Container>

    </>
  );
}
