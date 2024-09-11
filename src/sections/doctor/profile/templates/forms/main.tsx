import { Avatar, Box, Container, Stack, Typography } from '@mui/material';
// import Image from '@/components/image';
import Image from 'next/image';
import React, { forwardRef, useEffect, useState } from 'react';
import { LogoFull } from 'src/components/logo';
import { bgGradient } from 'src/theme/css';

type MainProps = {
  title: string;
  name: string;
  facebook: string;
  twitter: string;
  email: string;
  specialty: string;
  link: string;
  photo: string;  // Changed to string to reflect URL type
  forDownload: any;
  isSelected?: boolean;
  selected?: boolean;
};

const Main = forwardRef<HTMLDivElement, MainProps>((props, ref) => {
  const { forDownload, facebook, twitter, email, title, name, specialty, link, photo, isSelected, selected } = props;

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        height: isSelected ? 400 : selected ? 300 : 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        backgroundImage: "url(/assets/doctor/templates/default1.jpg)",
        backgroundSize: 'cover',
        pt: 5,
        position: 'relative'
      }}
    >

      <Box sx={{
        position: 'absolute',
        top: {xs:10, lg:20},
        left: 20
      }}>
        <Image
          alt="logo"
          src="/logo/logo_full.png"
          width={120}
          height={30}
        />
      </Box>
      <Stack alignItems="center" justifyContent="center">
        <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: 18 }}>
          {name}
        </Typography>
        <Typography sx={{ textTransform: 'uppercase', fontSize: 10 }} variant="body2" color="gray">
          {specialty}
        </Typography>
      </Stack>

      <Stack>
        <Image
          alt="qr image"
          src={photo}  // Use the state variable for the src
          width={120}
          height={120}
          style={{
            borderRadius: '50%'
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>

        <Stack>

          {facebook &&
            <Stack direction="row" alignItems="center" gap={1}>
              <Avatar
                sx={{
                  width: 20,
                  height: 20
                }}
                src={'/assets/icons/socials/facebook.svg'}
              />
              <Typography variant="body2">{facebook}</Typography>
            </Stack>
          }

          {twitter && <Stack direction="row" alignItems="center" gap={1}>
            <Avatar
              sx={{
                width: 20,
                height: 20
              }}
              src={'/assets/icons/socials/twitter.svg'}
            />
            <Typography variant="body2">{twitter}</Typography>
          </Stack>}


          {email && <Stack direction="row" alignItems="center" gap={1}>
            <Avatar
              sx={{
                width: 20,
                height: 20
              }}
              src={'/assets/icons/socials/google.svg'}
            />
            <Typography variant="body2">{email}</Typography>
          </Stack>}





        </Stack>
        <Image
          src={link}
          width={100}
          height={100}
          alt="qr image"
        />
      </Stack>
    </Box>
  );
});

export default Main;
