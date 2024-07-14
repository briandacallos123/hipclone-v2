// @mui
'use client'

import { useTheme, alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CardProps } from '@mui/material/Card';
// theme
import { bgGradient } from 'src/theme/css';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import Iconify from '@/components/iconify';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useBoolean } from 'src/hooks/use-boolean';
import MapContainer from '../map/GoogleMap';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  description?: string;
  img?: React.ReactNode;
  action?: React.ReactNode;
  location?: string;
  onFilters?: () => void;
}

export default function EcommerceWelcome({ onFilters, location, title, description, action, img, ...other }: Props) {
  const theme = useTheme();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loadingMap, setLoadingMap] = useState(false)
  const [userAddress, setUserAddress] = useState(null)
  const [manualAddress, setManualAddress] = useState<string | null>('')
  const [mapData, setMapData] = useState({ lat: null, lng: null })
  const [map, showMap] = useState(false)
  const [doneManual, setDoneManual] = useState(false);

  const open = useBoolean();


  const handleEditManual = () => {
    open.onTrue()
  }

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude }: any = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
        (error) => {
          console.error('Error getting geolocation:', error);
        });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [])

  const useManualAddress = useCallback((address: string) => {
    setManualAddress(address)
  }, [manualAddress])

  useEffect(() => {
    if (manualAddress?.length >= 10) {

      (async () => {
        const payload = {
          address: manualAddress
        }

        const response = await axios.post('https://hip.apgitsolutions.com//api/getLocation', payload);
        setMapData({
          ...mapData,
          lat: response?.data?.latitude,
          lng: response?.data?.longitude
        })
        showMap(true)

      })()
    }
  }, [manualAddress])


  useEffect(() => {
    if (latitude && longitude) {
      setLoadingMap(true);


      (async () => {
        const payload: any = {
          latitude,
          longitude
        }
        // https://hip.apgitsolutions.com/api/getAddress
        const response = await axios.post('https://hip.apgitsolutions.com/api/getAddress', payload);
        const { address }: any = response?.data
        setUserAddress(address)
        setLoadingMap(false)
      })()
    }
  }, [latitude, longitude])

  const handleSubmitManual = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onFilters('latitude', mapData.lat);
    onFilters('longitude', mapData.lng);
    setDoneManual(true)

  }, [mapData.lat, mapData.lng])
  

  useEffect(()=>{
    if(doneManual){
      setDoneManual(false)
    }
  },[doneManual])

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
            textTransform:'capitalize'
          }}
        >
          {(()=>{
            if(manualAddress && doneManual){
              return manualAddress
            }else{
              return userAddress ? userAddress : location
            }
          })()}
        </Typography>

        <Stack spacing={2}>
          {!userAddress ? <Typography>Want to change your location? <Button
            sx={{
              hover: {
                textDecoration: 'underline'
              }
            }}
            onClick={getLocation}

          >
            {loadingMap ? 'loading' : 'click here'}
          </Button></Typography> :
            <Typography>Getting wrong address?
              <Button
                sx={{
                  hover: {
                    textDecoration: 'underline'
                  }
                }}
                onClick={handleEditManual}

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
      <ManualEditDialog handleSubmitManual={handleSubmitManual} mapData={mapData} map={map} useManualAddress={useManualAddress} open={open.value} handleClose={open.onFalse} />
    </Stack>
  );
}

type ManualEditDialogProps = {
  open: boolean;
  handleClose: () => void;
  useManualAddress: () => void;
  map: boolean;
  mapData: any;
  handleSubmitManual: () => void;
}

const ManualEditDialog = ({ open, map, handleSubmitManual, mapData, handleClose, useManualAddress }: ManualEditDialogProps) => {

  const handleChange = (e) => {
    useManualAddress(e)
  }


  const handleSubmit = () => {
    handleClose()
    handleSubmitManual()
  }

  return (
    <Dialog
      fullWidth
      maxWidth={'xs'}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        gap: 3,
      }}

    >
      <DialogTitle id="alert-dialog-title">Input your address, here.</DialogTitle>
      <DialogContent sx={{
        p: 3,
      }}>

        <TextField sx={{
          mb: 3
        }} placeholder='Ex. Tondo, Manila City' onChange={(e) => handleChange(e.target.value)} fullWidth name="address" />
        {/* {<MapContainer reset={!map} lat={mapData?.lat} lng={mapData?.lng} />} */}

      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="success" onClick={handleSubmit} autoFocus>
          Submit
        </Button>
      </DialogActions>

    </Dialog>
  )
}