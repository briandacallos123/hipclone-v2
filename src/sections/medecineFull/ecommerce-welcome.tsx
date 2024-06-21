// @mui
'use client'

import { useTheme, alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CardProps } from '@mui/material/Card';
// theme
import { bgGradient } from 'src/theme/css';
import { Button, FormControl, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import Iconify from '@/components/iconify';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  description?: string;
  img?: React.ReactNode;
  action?: React.ReactNode;
  location?:string
}

export default function EcommerceWelcome({location, title, description, action, img, ...other }: Props) {
  const theme = useTheme();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loadingMap, setLoadingMap] = useState(false)
  const [userAddress, setUserAddress] = useState(null)

  console.log(userAddress,'HUH?')
  const getLocation = useCallback(()=>{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude }:any = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      }, 
      (error) => {
        console.error('Error getting geolocation:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  },[])

  useEffect(()=>{
    if(latitude && longitude){
      setLoadingMap(true);


      (async()=>{
        const payload:any = {
          latitude,
          longitude
        }
        const response = await axios.post('https://hip.apgitsolutions.com/api/getAddress',payload);
        const {address}:any = response?.data
        setUserAddress(address)
        setLoadingMap(false)
      })()
    }
  },[latitude, longitude])
  

  return (
    <Stack
      flexDirection={{ xs: 'column', md: 'row' }}
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette.primary.light, 0.2),
          endColor: alpha(theme.palette.primary.main, 0.2),
        }),
        height: { md: 1 },
        borderRadius: 2,
        position: 'relative',
        color: 'primary.darker',
        backgroundColor: 'common.white',
      }}
      {...other}
    >
      <Stack
        flexGrow={1}
        justifyContent="center"
        alignItems={{ xs: 'center', md: 'flex-start' }}
        sx={{
          p: {
            xs: theme.spacing(5, 3, 0, 3),
            md: theme.spacing(5),
          },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        {/* <Typography paragraph variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {title}
        </Typography> */}

        <Typography
          variant="h6"
          sx={{
            opacity: 0.8,
            maxWidth: 360,
            mb: { xs: 3, xl: 2 },
          }}
        >
          {description}
        </Typography>
        <Typography
          variant="h2"
          sx={{
            opacity: 0.8,
            mb: { xs: 3, xl: 2 },
          }}
        >
          {userAddress ? userAddress : location}
        </Typography>

       <Stack spacing={2}>
          {!userAddress ? <Typography>Want to change your location? <Button
          sx={{
            hover:{
              textDecoration:'underline'
            }
          }}
          onClick={getLocation}
          
          >
            {loadingMap ? 'loading':'click here'}
            </Button></Typography>:
            <Typography>Getting wrong address?
              <Button
          sx={{
            hover:{
              textDecoration:'underline'
            }
          }}
          onClick={getLocation}
          
          >
            Edit
            </Button>
               </Typography>
            }
       </Stack>

        {action && action}
      </Stack>

      {img && (
        <Stack
          component="span"
          justifyContent="center"
          sx={{
            p: { xs: 5, md: 3 },
            maxWidth: 360,
            mx: 'auto',
          }}
        >
          {img}
        </Stack>
      )}
    </Stack>
  );
}
