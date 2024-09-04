import { Avatar, Box, Container, Stack, Typography } from '@mui/material'
import html2canvas from 'html2canvas';
import Image from '@/components/image';
import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { LogoFull } from 'src/components/logo';
import { bgGradient } from 'src/theme/css';

type MainProps = {
  title: string;
  name: string;
  specialty: string;
  link: string;
  photo: any;
  forDownload: any;
  ref: any;
}

const Default4 = forwardRef((props, ref) => {
  const { forDownload,isSelected, address,selected, contact, email, title, name, specialty, link, photo, arr }: any = props;

  const componentRef = useRef(null);
  const [imgSrc, setImgSrc]: any = useState(null)

  const { contact: arrContact, email: arEmail, name: arrName, address: arrAddress, specialty: arrSpecialty } = arr;

  // useEffect(() => {
  //   (async () => {
  //     console.log("haha")
  //     if (componentRef.current) {
  //       const canvas = await html2canvas(componentRef.current);
  //       const imgData = canvas.toDataURL('image/png');
  //       console.log(imgData, 'imgDataimgData')
  //       setImgSrc(imgData);
  //     }
  //   })()
  // }, [])


  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        height: isSelected ? 400 : selected ? 300:200,
        
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundImage: "url(/assets/doctor/templates/default4.jpg)",
        backgroundSize: 'cover',
        position: 'relative',
        p: 2
      }}>

      <Stack sx={{
        width: '100%',
        height: '100%'
      }}>
        <Stack direction="row" sx={{
          width: '100%',
          flex: 1
        }} alignItems="flex-start" justifyContent="space-around">
          <Image
            src={link}
            width={selected ? 100:50}
            height={selected ? 100:50}
            alt="qr image"
          />

          <Image
            alt="qr image"
            width={selected ? 100:50}
            height={selected ? 100:50}
            src={photo} 
            sx={{
              borderRadius:'50%'
            }}
            />

          <Image
            alt="logo"
            src="/logo/logo_full.png"
            // width={75}
            // height={25}

            width={selected ? 125:75}
            height={selected ? 40:25}

            // height={selected ? 35}
          />

        </Stack>

        <Stack sx={{
          flex: 1
        }} direction="row" alignItems="center" justifyContent="center">
          <Box sx={{
            widtH: '50%',
            textAlign: 'center'
          }}>
            <Typography variant="body1" sx={{ textTransform: 'capitalize', color: '#000', fontWeight: 'bold', fontSize: isSelected || selected ? 24:18 }}>{arrName && name}</Typography>
            <Typography sx={{ textTransform: 'uppercase', fontSize: 10 }} variant="body2" color="black">{arrSpecialty && specialty}</Typography>
          </Box>
        </Stack>

        <Stack direction="row" sx={{
          width: '100%',
          mt: 3,
        }} justifyContent="space-between">
          <Typography variant="body2" sx={{ color: '#fff', fontSize: 10 }}>{arEmail && email}</Typography>
          <Typography variant="body2" sx={{ color: '#fff', fontSize: 10 }}>{arrContact && contact}</Typography>
          <Typography variant="body2" sx={{ color: '#fff', fontSize: 10 }}>{arrAddress && address}</Typography>

        </Stack>
      </Stack>

      {/* <Box sx={{

        position: 'absolute',
        top: 10,
        right: 25
      }}>

      </Box>

      <Stack sx={{ width: '100%' }}>
        <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: 18, color: 'white' }}>{arrName && name}</Typography>
        <Typography sx={{ textTransform: 'uppercase', fontSize: 10 }} variant="body2" color="white">{arrSpecialty && specialty}</Typography>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        sx={{
          width: '100%'
        }}>
        <Box sx={{
          width: 70,
          height: 70
        }}>


        </Box>

      </Stack> */}
    </Box>
  )
})

export default Default4