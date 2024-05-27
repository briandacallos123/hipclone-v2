"use client"

import React, { useEffect, useRef } from 'react'
import jsQR from "jsqr";
import { LogoFull } from 'src/components/logo';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { useResponsive } from 'src/hooks/use-responsive';
import { useTheme, alpha, styled } from '@mui/material/styles';

const StyledRoot = styled('section')(({ theme }) => ({
    padding: theme.spacing(0, 10),
    color: theme.palette.common.white,
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(8, 0),
    },
    [theme.breakpoints.up('xl')]: {
      padding: theme.spacing(14, 0),
    },
    overflow:'hidden'
  
  }));

  type prop = {
    handleChangeVoucher?:(e:React.ChangeEvent)=>void;
    setVoucherCode?:(code:string)=>void;
  }

const ScanViewOrder = ({handleChangeVoucher, setVoucherCode}:prop) => {
  
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
      const video:any = videoRef.current;
      const canvas:any = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationFrameId:any
  
      const handleStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          video.srcObject = stream;
          video.play();
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      };
  
      const decodeQRCode = () => {
        const { videoWidth, videoHeight } = video;
        if (videoWidth && videoHeight) {
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
          const imageData = ctx.getImageData(0, 0, videoWidth, videoHeight);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            // console.log('QR Code detected:', code.data);
            // Handle QR code result here
            // window.location.href = code.data
            // console.log(code,'CODE________')
            let codeL = code.data.split('/').length;
            const lastItem = code.data.split('/')[codeL-1]

            console.log(codeL, lastItem,'DALAWANG VALUE TO')
          //  console.log(lastItem,'LAST ITEM')
          //  console.log(codeL,'codeL codeL')
          //  console.log(code,'code')
            // setVoucherCode(lastItem)
          }
        }
        animationFrameId = requestAnimationFrame(decodeQRCode);
      };
    
      const handleLoadedMetadata = () => {
        decodeQRCode();
      };
    
      handleStream();
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
      return () => {
        if (video.srcObject) {
          const stream = video.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach((track:any) => track.stop());
        }
        cancelAnimationFrame(animationFrameId);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }, []);

    const renderScanner = (
      <div style={{ position: 'relative',top:-100, width: 500, height: 500, paddingBottom: 4 }}>
        <video
          ref={videoRef}
          style={{
            width: '80%',
            height: '80%',
            // maxWidth: '35%',
            display: 'block',
            margin: 'auto',
          }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );

    const renderScannerMobile = (
      <div style={{ position: 'relative', width: '400px', height: 'auto', paddingBottom: 4 }}>
        <video
          ref={videoRef}
          style={{
            width: '400px',
            height: '200px',
            display: 'block',
            margin: 'auto',
          }}
        />
      </div>
    );

    const upMd = useResponsive('up', 'md');

    return (
      <div>
        {/* <div style={{ position: 'absolute', top: 5, left: 5 }}>
          <LogoFull sx={{ mr: 2.5 }} />
        </div> */}
        <StyledRoot>
          <Stack direction="column" justifyContent="center" alignItems="center" sx={{ p: 1 }}>
            <Box
              sx={{
                minHeight: '-webkit-fill-available',
                // width: '-webkit-fill-available',
                mt: 5,
                p: 4,
                alignItems: 'center',
                // background:'#1A2027',
                width:400,
                height:300
              }}
            >
              <Stack justifyContent="center" alignItems="center" sx={{ pb: 9, mt: 1 }}>
                {upMd ? renderScanner : renderScannerMobile}
              </Stack>
              {/* <Box sx={{
                display:'flex',
                justifyContent:"center",
                flexDirection:'column',
                alignItems:'center'
              }}>
                <TextField onChange={handleChangeVoucher} sx={{
                  borderRadius:'10px',
                  border:'2px solid #1A2027'
                }}  placeholder='Voucher code here...'/>
                
              </Box> */}
            </Box>
          </Stack>
        </StyledRoot>
      </div>
    );
}

export default ScanViewOrder;
