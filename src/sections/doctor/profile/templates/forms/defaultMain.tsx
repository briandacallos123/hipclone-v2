import { Avatar, Box, Container, Paper, Stack, Typography } from '@mui/material'
// import Image from '@/components/image';
import Image from 'next/image';
import React, { forwardRef } from 'react'
import { LogoFull } from 'src/components/logo';
import { bgGradient } from 'src/theme/css';

type MainProps = {
  title: string;
  name: string;
  specialty: string;
  link: string;
  photo: any;
  forDownload: any;
  email: any;
}

const DefaultMain = forwardRef((props, ref) => {
  const { arr, forDownload, isSelected, facebook, selected, twitter, title, contact, email, name, specialty, link, photo, socials }: any = props;

  const { facebook: arrFb, twitter: arrTt, contact: arrContact, email: arrEmail, name: arrName, specialty: arrSpecialty } = arr;

  console.log(selected,'selectedselectedselectedselected!')

  return (
    <Paper elevation={4} ref={ref} sx={{
      width: '100%',
      height: 300,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 2,
      backgroundImage: "url(/assets/doctor/templates/default1.jpg)",
      backgroundSize: 'cover',
      pt: 5,
      position: 'relative'
    }}>

      <Box sx={{
        position: 'absolute',
        top: { xs: 10, lg: 20 },
        left: 20
      }}>
        <Image
          alt="logo"
          src="/logo/logo_full.png"
          height={selected ? 30 : 25}
          width={selected ? 80 : 80}

        />
      </Box>

      <Stack alignItems="center" justifyContent="center">
        <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: { xs: 14, lg: 18 } }}>{name}</Typography>
        <Typography sx={{ textTransform: 'uppercase', fontSize: 10 }} variant="body2" color="gray">{specialty}</Typography>
      </Stack>

      <Stack>
        <Image
          alt="qr image"
          style={{
            borderRadius: '50%'
          }}
          width={isSelected ? 100 : selected ? 80 : 50}
          height={isSelected ? 100 : selected ? 80 : 50}
          src={photo}
        />
      </Stack>


      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{

        width: '100%'
      }}>
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
              <Typography variant="body2">{facebook}</Typography>
            </Stack>
          }

          {arrTt && twitter && <Stack direction="row" alignItems="center" gap={1}>
            <Avatar
              sx={{
                width: 20,
                height: 20
              }}
              src={'/assets/icons/socials/twitter.svg'}
            />
            <Typography variant="body2">{twitter}</Typography>
          </Stack>}



          {arrContact && contact && <Stack direction="row" alignItems="center" gap={1}>
            <Avatar
              sx={{
                width: 20,
                height: 20
              }}
              src={'/assets/icons/socials/phone.svg'}
            />
            <Typography variant="body2">{contact}</Typography>
          </Stack>}


          {arrEmail && email && <Stack direction="row" alignItems="center" gap={1}>
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
          width={selected ? 100 : 60}
          height={selected ? 100 : 60}
          alt="qr image"
        />
      </Stack>
    </Paper>
  )
})

export default DefaultMain