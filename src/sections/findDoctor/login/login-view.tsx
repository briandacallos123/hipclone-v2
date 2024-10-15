'use client'

import { Box, Container, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import LoginForm from './login-form'
import { useTheme } from '@mui/material/styles';
import { useSettingsContext } from '@/components/settings';
import { useResponsive } from '@/hooks/use-responsive';

const LoginView = () => {
  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;
  const settings = useSettingsContext();
  const mdUp = useResponsive('up', 'md');


  const infoText = (
    <Stack sx={{
      color: '#fff'
    }}>
      <Typography
        sx={{
          lineHeight: 1.5,
          fontSize: '18px',
          '& > span': {
            color: theme.palette.primary.lighter, fontWeight: 'bold',
            fontSize: mdUp ? '25px' : '22px',

          },
        }}
      >
        {/* Login at */}
        <span>{` Mediko Connect Login `}</span><br />
      </Typography>
    </Stack>
  )

  return (
    <Container
      sx={{
        background: PRIMARY_MAIN,
        py: { xs: 5, lg: 0 },
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      maxWidth={settings.themeStretch ? false : 'lg'}>

      <Box rowGap={2} sx={{
        flex: 1,
        width: { lg: 600 },
        p: { lg: 10 },
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'center'
      }}>
        {infoText}

        <LoginForm />
      </Box>
    </Container>
  )
}

export default LoginView