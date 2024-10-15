import { useState, createContext, useContext } from 'react';
// @mui
import Box, { BoxProps } from '@mui/material/Box';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSettingsContext } from 'src/components/settings';
//
import { useBoolean } from '@/hooks/use-boolean';
import { HEADER, NAV } from '../config-layout';
import FloatingFrame from '../_common/floating-frame';

// ----------------------------------------------------------------------

const SPACING = 8;

const ContextData = createContext({});

export const useMainContextData = () => useContext(ContextData);

export default function Main({ children, sx, ...other }: BoxProps) {
  const settings = useSettingsContext();
  const open = useBoolean(false);
  const [openTelemed, setOpenTelemed] = useState<any>(false);

  const lgUp = useResponsive('up', 'lg');

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';
  // const handleTelemed = () => {
  //   setOpenTelemed(!openTelemed);
  // };

  if (isNavHorizontal) {
    return (
      <ContextData.Provider value={{ openTelemed, setOpenTelemed }}>
        <Box
          position="relative"
          component="main"
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: 'column',
            pt: `${HEADER.H_MOBILE + 24}px`,
            pb: 10,
            ...(lgUp && {
              pt: `${HEADER.H_MOBILE * 2 + 40}px`,
              pb: 15,
            }),
          }}
        >
          <FloatingFrame id={null} open={openTelemed} onClose={() => setOpenTelemed(false)} />
          {children}
        </Box>
      </ContextData.Provider>
    );
  }

  return (
    <ContextData.Provider value={{ openTelemed, setOpenTelemed }}>
      <Box
        position="relative"
        component="main"
        sx={{
          flexGrow: 1,
          py: `${HEADER.H_MOBILE + SPACING}px`,
          ...(lgUp && {
            px: 2,
            py: `${HEADER.H_DESKTOP + SPACING}px`,
            width: `calc(100% - ${NAV.W_VERTICAL}px)`,
            ...(isNavMini && {
              width: `calc(100% - ${NAV.W_MINI}px)`,
            }),
          }),
          ...sx,
        }}
        {...other}
      >
       <FloatingFrame id={null} open={openTelemed} onClose={() => setOpenTelemed(false)} />
        {children}
      </Box>
    </ContextData.Provider>
  );
}
