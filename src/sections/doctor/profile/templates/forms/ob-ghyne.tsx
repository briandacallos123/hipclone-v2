import { Avatar, Box, Container, Grid, Stack, Typography } from '@mui/material'
import Image from 'next/image';
import React, { useRef } from 'react'
import { LogoFull } from 'src/components/logo';
import { bgGradient } from 'src/theme/css';

type MainProps = {
  title: string;
  name: string;
  specialty: string;
  link: string;
  user: any;
}

const OB = ({ title, name, specialty, link, user, ...rest}: MainProps) => {
 

  return (
    <Box {...rest} sx={{
      width: 200,
      height: 200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 2,
      p: 2,
      backgroundImage: "url(/assets/doctor/templates/ob-ghyne.jpg)",
      backgroundSize: 'cover',
      position: 'relative',
      pt:3
    }}>

      <Grid container>
        <Grid item lg={4}>
          <Avatar sx={{
            width: 50,
            height: 50
          }} src={user?.photoURL} />
        </Grid>
        <Grid item lg={8}>
          <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{name}</Typography>
          <Typography sx={{ textTransform: 'capitalize', fontSize: 12 }} variant="body2" color="gray">{specialty}</Typography>
        </Grid>
      </Grid>



      {/* <Avatar
            src="/logo/logo_single.png"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
     </Stack> */}
      {/* 

      <Grid container>
        <Grid item lg={4}>
          <Avatar sx={{
            width: 50,
            height: 50
          }} src={user?.photoURL} />
        </Grid>
        <Grid item lg={8}>
          <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{name}</Typography>
          <Typography sx={{ textTransform: 'capitalize', fontSize: 12 }} variant="body2" color="gray">{specialty}</Typography>
        </Grid>
      </Grid>
    
      <Stack direction="row" justifyContent="flex-end" sx={{

        width: '100%'
      }}>
        <Image
          src={link}
          width={40}
          height={40}
          alt="qr image"
        />


      </Stack> */}
      <Stack direction="row" justifyContent="flex-start" sx={{

        width: '100%'
      }}>
        <Image
          src={link}
          width={70}
          height={70}
          alt="qr image"
        />


      </Stack>
    </Box>
  )
}

export default OB