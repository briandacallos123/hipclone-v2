import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import Image from '@/components/image';
import { bgBlur } from '@/theme/css';
import { useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';



const HomeBackdrop = () => {
  const [toShow, setToShow] = useState(true);
  const theme = useTheme();

  const router = useRouter()

  useEffect(()=>{
    if(!toShow){

    }
  },[toShow])

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const handlePatient = () => setToShow(false)

  const navigateToDoctor = () => {
    localStorage.setItem('userRole','doctor')
    router.push(paths.doctor.login)
  }


  useEffect(()=>{
    localStorage?.removeItem('userRole')
  },[])


  return toShow &&  <>
  <Container sx={{
    width: { lg: 600 },
    height: { lg: 600 },
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: 99999,
    opacity: 1,
    p: 3,
    borderRadius: 2,
    transform: `translate(-50%, -50%)`,
    px: 7,
    py: 5,
    ...bgBlur({
      color: theme.palette.background.default,
    })
  }}>
    <Typography sx={{
      mb: 5
    }} variant="h4">
      Which one are you?
    </Typography>



    {/* content */}
    {/* doctor */}
    <Stack gap={3}>
      <Stack direction='row' alignItems='center' justifyContent='space-around'>
        <Image
          src={'/assets/illustrations/doctorMale.png'}
          sx={{
            width: { xs: 80, lg: 150 },
            height: { xs: 100, lg: 200 },
          }}
        />
        <Button onClick={navigateToDoctor} size='large' sx={{
          p: 2,
          // background: '#fff',
          // color: '#000',
          // '&:hover':{
          //   background:'#000',
          //   color:'#fff'
          // }
        }} variant="contained">I'm a Doctor</Button>
      </Stack>

      <Stack direction='row' alignItems='center' justifyContent='space-around'>
        <Button onClick={handlePatient} size='large' sx={{
          p: 2,
          // background: '#fff',
          // color: '#000',
          // '&:hover':{
          //   background:'#000',
          //   color:'#fff',
          // }

        }} variant="contained">I'm a Patient</Button>
        <Image
          src={'/assets/illustrations/patientFemale.png'}
          sx={{
            width: { xs: 80, lg: 200 },
            height: { xs: 100, lg: 200 },
          }}
        />
      </Stack>
    </Stack>
  </Container>

  <Box sx={{
    background:PRIMARY_MAIN,
    opacity: .4,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999
  }}>

  </Box>

</>

}

export default HomeBackdrop