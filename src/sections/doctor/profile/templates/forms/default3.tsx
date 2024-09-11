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

const Default3 = forwardRef((props, ref) => {
  const { forDownload,isSelected, title, name, specialty,selected, link, photo, arr }: any = props;

  const componentRef = useRef(null);
  const [imgSrc, setImgSrc]: any = useState(null)

  const {contact, email, name :arrName, specialty :arrSpecialty} = arr;

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
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        backgroundImage: "url(/assets/doctor/templates/default3.jpg)",
        backgroundSize: 'cover',
        pt: 5,
        position: 'relative'
      }}>

      <Box sx={{

        position: 'absolute',
        top: 25,
        right: 30
      }}>
        <Image
          alt="logo"
          src="/logo/logo_full.png"
          // width={selected ? 120:75}
          // height={selected ? 40:25}
          sx={{
            width:selected?120:80
          }}


          
        />
      </Box>

      <Stack sx={{ width: '100%' }}>
        <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: isSelected || selected ? 24:18, color: 'white' }}>{arrName && name}</Typography>
        <Typography sx={{ textTransform: 'uppercase', fontSize: 10 }} variant="body2" color="white">{ arrSpecialty && specialty}</Typography>
      </Stack>

      {/* <Stack>
        <Avatar src={photo?.photoURL} />
      </Stack> */}

      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          width: '100%'
        }}>
        <Box sx={{
          width: 70,
          height: 70
        }}>
          <Image
            alt="user photo"
            width={isSelected || selected ? 120:50}
            height={isSelected || selected ? 120:50}
            src={photo} 
            sx={{
              borderRadius:'50%'
            }}
            />

        </Box>
        <Image
          src={link}
          width={isSelected || selected ? 120:60}
          height={isSelected || selected ? 120:60}
          alt="qr image"
        />
      </Stack>
    </Box>
  )
})

export default Default3