import { Avatar, Box, Container, Paper, Stack, Typography } from '@mui/material';
// import Image from '@/components/image';
import Image from 'next/image';
import React, { forwardRef, useEffect, useState } from 'react';
import { LogoFull } from 'src/components/logo';
import { bgGradient } from 'src/theme/css';
import ImageAvatar from './ImageAvatar';

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
  contact?:string;
  arr?:string;
};

const Main = forwardRef<HTMLDivElement, MainProps>((props, ref) => {
  const {arr, forDownload, facebook,contact, twitter, email, title, name, specialty, link, photo, isSelected, selected } = props;

  const { facebook: arrFb, twitter: arrTt, contact: arrContact, email: arrEmail, name: arrName, specialty: arrSpecialty } = arr;


  console.log(selected,' SLECTED??????????')

  return (
    <Paper elevation={4} ref={ref}
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
        // pt: 5,
        position: 'relative',
      }}
    >

      <Box sx={{
        position: 'absolute',
        top: {xs:selected ? 10 : 5, lg:15},
        left: selected ? 15:5
      }}>
        <Image
          alt="logo"
          src="/logo/logo_full.png"
          height={selected ? 30 : 25}
          width={selected ? 80 : 80}
        />
      </Box>
      <Stack alignItems="center" sx={{
        marginTop:!selected ? 2 : 5
      }} justifyContent="center">
        <Typography  variant="body1" sx={{   fontSize: !selected && 15,  textTransform: 'capitalize', fontWeight: 'bold', fontSize: 18 }}>
          {name}
        </Typography>
        <Typography sx={{ textTransform: 'uppercase', fontSize: 10 }} variant="body2" color="gray">
          {specialty}
        </Typography>
      </Stack>
      <Stack>

        <ImageAvatar
          alt="qr image"
          src={photo}  // Use the state variable for the src
          width={isSelected ? 100 : selected ? 80 : 50}
          height={isSelected ? 100 : selected ? 80 : 50}
          style={{
            borderRadius: '50%'
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>

        <Stack>

          {arrFb && facebook &&
            <Stack direction="row" alignItems="center" gap={1}>
              <Avatar
                sx={{
                  width: 20,
                  height: 20
                }}
                src={'/assets/icons/socials/facebook.svg'}
              />
              <Typography sx={{
              fontSize:!selected && 12
              }} variant="body2">{facebook}</Typography>
            </Stack>
          }

          {arrTt &&  twitter && <Stack direction="row" alignItems="center" gap={1}>
            <Avatar
              sx={{
                width: 20,
                height: 20
              }}
              src={'/assets/icons/socials/twitter.svg'}
            />
            <Typography sx={{
              fontSize:!selected && 12
              }}  variant="body2">{twitter}</Typography>
          </Stack>}

          {arrContact && contact && <Stack direction="row" alignItems="center" gap={1}>
            <Avatar
              sx={{
                width: 20,
                height: 20
              }}
              src={'/assets/icons/socials/phone.svg'}
            />
            <Typography sx={{
              fontSize:!selected && 12
              }}  variant="body2">{contact}</Typography>
          </Stack>}


          {arrEmail && email && <Stack direction="row" alignItems="center" gap={1}>
            <Avatar
              sx={{
                width: 20,
                height: 20
              }}
              src={'/assets/icons/socials/google.svg'}
            />
            <Typography sx={{
              fontSize:!selected && 12
              }}  variant="body2">{email}</Typography>
          </Stack>}





        </Stack>
        <Image
          src={link}
          width={selected ? 100 : 60}
          height={selected ? 100 : 60}
          alt="qr image"
        />
      </Stack>
    </Paper>
  );
});

export default Main;
