import { Avatar, Box, Container, Stack, Typography } from '@mui/material'
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
  email:any;
}

const DefaultMain = forwardRef((props, ref) => {
  const { forDownload, title,email, name, specialty, link, photo }: any = props;


  return (
    <Box ref={ref} sx={{
      width: '100%',
      height: 300,
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
        <Avatar src={photo} />
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{

        width: '100%'
      }}>
        <Box>
          <Image
            alt="logo"
            src="/logo/logo_full.png"
            width={70}
            height={25}


          />
        </Box>
        <Image
          src={link}
          width={60}
          height={60}
          alt="qr image"
        />
      </Stack>
    </Box>
  )
})

export default DefaultMain