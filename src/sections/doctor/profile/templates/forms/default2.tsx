import { Avatar, Box, Container, Grid, Stack, Typography } from '@mui/material'
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

const Default2 = forwardRef((props, ref) => {
  const { forDownload,isSelected, title, name,selected, specialty, link, photo, arr}: any = props

  const {contact, email, name :arrName, specialty :arrSpecialty} = arr;

  return (
    <Box ref={ref} sx={{
      width: '100%',
      height: isSelected ? 400 : selected ? 300:200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 2,
      backgroundImage: "url(/assets/doctor/templates/default2.jpg)",
      backgroundSize: 'cover',
      pt: 5,
      position: 'relative',

    }}>
      <Box sx={{
        position: 'absolute',
        top: 10,
        right: 15,
        margin: '0 auto'
      }}>
       <Image
            alt="logo"
            src="/logo/logo_full.png"
            // height={selected ? 40:25}
            // width={selected ? 120:80}
            sx={{
              width:selected?120:80
            }}
          />
      </Box>

      <Grid container gap={2}>

        <Grid item lg={5} justifyContent="center" alignItems="center">
          <Image
            src={link}
            width={selected ? 130:90}
            // height={selected ? 120:90}
            alt="qr image"
          />
        </Grid>

        <Grid justifyContent="center" alignItems="center" item lg={6} sx={{
          width:'100%',
          textAlign:'center',
          mt:selected && 3
        }}>
          <Stack alignItems="center" justifyContent="center" sx={{ my: 1, width:'100%' }}>
            <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{arrName && name}</Typography>
            <Typography sx={{ textTransform: 'uppercase', fontSize: 10 }} variant="body2" color="gray">{arrSpecialty && specialty}</Typography>
          </Stack>
          <Stack justifyContent="center" alignItems="center">
          <Image
            alt="qr image"
            width={selected ? 100:50}
            sx={{
              borderRadius:'50%'
            }}
            src={photo} />
          </Stack>
        </Grid>

      </Grid>

      
    </Box>
  )
})

export default Default2