import { Avatar, Box, Container, Stack, Typography } from '@mui/material'
// import Image from 'next/image';
import Image from '@/components/image';
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
}

const Main = forwardRef((props, ref) => {
  const { forDownload, title, name, specialty, link, photo, isSelected, selected}: any = props;


  return (
    <Box ref={ref} sx={{
      width: '100%',
      height: isSelected ? 400 : selected ? 300:200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 2,
      backgroundImage: "url(/assets/doctor/templates/default1.jpg)",
      backgroundSize: 'cover',
      pt: 5
    }}>
      <Stack alignItems="center" justifyContent="center">
        <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: 18 }}>{name}</Typography>
        <Typography sx={{ textTransform: 'uppercase', fontSize: 10 }} variant="body2" color="gray">{specialty}</Typography>
      </Stack>

      <Stack>
        <Image
          alt="qr image"
          width={150}
          height={150}
          src={photo} 
          sx={{
            borderRadius:'50%'
          }}
          />
         
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{

        width: '100%'
      }}>
        <Box>
          <Image
            alt="logo"
            src="/logo/logo_full.png"
            width={125}
            height={40}


          />
        </Box>
        <Image
          src={link}
          width={ 100}
          height={100}
          alt="qr image"
        />
      </Stack>
    </Box>
  )
})

export default Main