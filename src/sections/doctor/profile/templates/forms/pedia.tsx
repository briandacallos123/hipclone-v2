import { Avatar, Box, Container, Grid, Stack, Typography } from '@mui/material'
import Image from 'next/image';
import React from 'react'
import { LogoFull } from 'src/components/logo';
import { bgGradient } from 'src/theme/css';

type MainProps = {
  title: string;
  name: string;
  specialty: string;
  link: string;
  photo: any;
}

const Pediatrics = ({ title, name, specialty, link, photo }: MainProps) => {

  return (
    <Box sx={{
      width: 200,
      height: 200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 2,
      p: 2,
      backgroundImage: "url(/assets/doctor/templates/pediatrics.jpg)",
      backgroundSize: 'cover',
      position:'relative',
      pt:5
    }}>
      <Box sx={{
        width: 25,
        height: 25,
        position:'absolute',
        right:15,
        top:15
      }}>
        <Avatar
          src="/logo/logo_single.png"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </Box>

      <Grid container>
        <Grid item lg={4}>
          <Avatar sx={{
            width: 50,
            height: 50
          }} src={photo} />
        </Grid>
        <Grid item lg={8}>
          <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{name}</Typography>
          <Typography sx={{ textTransform: 'capitalize', fontSize: 12 }} variant="body2" color="gray">{specialty}</Typography>
        </Grid>
      </Grid>
      {/* <Stack alignItems="center" justifyContent="center">
        <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight:'bold', fontSize:18 }}>{name}</Typography>
        <Typography sx={{textTransform:'capitalize', fontSize:12}} variant="body2" color="gray">{specialty}</Typography>
      </Stack>

      <Stack>
        <Avatar src={photo?.photoURL}/>
      </Stack>

      */}
      <Stack direction="row" justifyContent="flex-end" sx={{

        width: '100%'
      }}>
        <Image
          src={link}
          width={40}
          height={40}
          alt="qr image"
        />


      </Stack>
    </Box>
  )
}

export default Pediatrics