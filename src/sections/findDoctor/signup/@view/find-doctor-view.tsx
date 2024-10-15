'use client';


import { useSettingsContext } from '@/components/settings';
import { Box, Grid, Stack, Typography } from '@mui/material';
import Container from '@mui/material/Container'
import React from 'react'
import { useTheme } from '@mui/material/styles';
import RegisterForm from '../register-form';
import Footer from '@/layouts/main/footer';
import Image from '@/components/image';
import { useResponsive } from '@/hooks/use-responsive';
import Iconify from '@/components/iconify';


const RegisterDoctor = ({spec}:any) => {
  const settings = useSettingsContext();
  const mdUp = useResponsive('up', 'md');

  const theme = useTheme();


  const PRIMARY_MAIN = theme.palette.primary.main;


  const infoText = (
    <>
      <Stack sx={{
        color:'#fff'
      }} gap={2}>
        <Stack gap={1}>
          <Typography variant="h3">Empowering Healthcare Together!</Typography>
          <Typography variant="body1">
            As a dedicated healthcare professional, you know the importance of collaboration in providing the best patient care. At Mediko Connect, we’re building a vibrant community where doctors like you can connect, share knowledge, and enhance their practice.
          </Typography>
        </Stack>

        <Stack direction="row" gap={2}>
          <Iconify sx={{
              width:80,
              height:40
          }} icon="tdesign:calendar"/>
          {/* <Image
            sx={{
              width: 80,
              height: 40
            }}
            src={'/assets/registration-doctor/calendar.svg'}
          /> */}
          <Typography
            sx={{
              lineHeight: 1.5,
              fontSize:'16px',
              '& > span': {
                color: theme.palette.primary.lighter, fontWeight: 'bold',
                fontSize: mdUp ? '20px' : '18px',

              },
            }}
          >
            <span>{`Effortless Appointment Management`}</span><br />Streamline your practice by easily connecting with patients and managing appointments from the comfort of your office, enhancing both efficiency and care quality..
          </Typography>
        </Stack>

        <Stack direction="row" gap={2}>
        <Iconify sx={{
              width:80,
              height:40
          }} icon="bx:chat"/>
          {/* <Image
            sx={{
              width:80,
              height: 40
            }}
            src={'/assets/registration-doctor/chat.svg'}
          /> */}
          <Typography
            sx={{
              lineHeight: 1.5,
              fontSize:'16px',
              '& > span': {
                color: theme.palette.primary.lighter, fontWeight: 'bold',
                fontSize: mdUp ? '20px' : '18px',

              },
            }}
          >
            <span>{`Engage with Your Patients: Chat and Video Calls`}</span><br />Easily connect with your patients through secure chat and video calls, ensuring that you can provide timely support and guidance, no matter where they are.
          </Typography>
        </Stack>

            {/* viewport */}
        <Stack direction="row" gap={2}>

   
        <Iconify sx={{
             width:80,
             height:40
          }} icon="ic:twotone-devices"/>
          {/* <Image
            sx={{
              width:80,
              height: 40
            }}
            src={'/assets/registration-doctor/viewport.svg'}
          /> */}
          <Typography
            sx={{
              lineHeight: 1.5,
              fontSize:'16px',
              '& > span': {
                color: theme.palette.primary.lighter, fontWeight: 'bold',
                fontSize: mdUp ? '20px' : '18px',

              },
            }}
          >
            <span>{`Access Anytime, Anywhere`}</span><br />Seamlessly connect with your patients through chat and video calls on any device, ensuring you’re always accessible when they need you most.
          </Typography>
        </Stack>
      </Stack>
    </>
  )

  return (
    <Container
      sx={{
        background: PRIMARY_MAIN,
        py:{xs:5,lg:0},
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      maxWidth={settings.themeStretch ? false : 'lg'}>

      <Box sx={{
        flex: 1,
        width: { lg: 1400 },
        p: { lg: 10 }
      }}>
        <Grid gap={mdUp ? 1:3} justifyContent='space-between' container>
          <Grid xs={12} md={6} item>
            {infoText}
          </Grid>
          <Grid xs={12} md={5} item >
            <RegisterForm spec={spec}/>
          </Grid>

        </Grid>
      </Box>
    </Container>
  )
}

export default RegisterDoctor