"use client"

import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import ScannerView from '../../../../sections/scan/view'

import { useTheme, alpha, styled } from '@mui/material/styles';
// import {} from '../../assets'
import PrescriptionPDF from '@/sections/prescription/prescription-pdf';
import { PrescriptionsUserQr } from '@/libs/gqls/prescription';
import { useLazyQuery } from '@apollo/client';
import { PDFViewer } from '@react-pdf/renderer';
import Iconify from '@/components/iconify';
import { ref } from 'yup';
import { useAuthContext } from '@/auth/hooks';
import { useParams } from 'src/routes/hook';
import QRCode from 'qrcode'
import { useSnackbar } from 'src/components/snackbar';
let imageURL =  '../../assets/background/bgScan.jpg';


const StyledRoot = styled('section')(({ theme, bgImage }) => ({
    // padding: theme.spacing(0, 10),
    background: `url("${bgImage}") no-repeat center`,
    backgroundSize: 'cover',
    // width:'100vw',
    height:'100vh',
    color: theme.palette.common.white,
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(8, 0),
    },
    [theme.breakpoints.up('xl')]: {
      padding: theme.spacing(14, 0),
    },
  }));

const PrescriptionView = () => {
    const [isVerified, setIsVerified] = useState(false)
    const [isOpen, setIsOpen] = useState(true);
    const [currentItem, setCurrentItem] = useState(null)
    const {id} = useParams()
    const [voucherId, setVoucherId] = useState(null)
    const surname = useRef(null)
    const [isWrongCred, setWrongCreds] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    console.log(currentItem,'PATIENTTTTTTTTTTTTT')

    const onSubmit = useCallback(() => {
      if(currentItem?.patient?.LNAME.toLowerCase() === surname?.current.toLowerCase()){
      
       
          setIsOpen(true)
          setIsVerified(true)
      }else{
        enqueueSnackbar('Invalid last name',{variant:'error'})
      }
  },[currentItem])

  useEffect(()=>{

  },[])

    const [getPrescription, { data, loading, error }] = useLazyQuery(PrescriptionsUserQr, {
        context: {
            requestTrackerId: 'prescriptions[QueryAllPrescriptionUser]',
          },
          notifyOnNetworkStatusChange: true,
      });

    useEffect(()=>{
        if(id){
            getPrescription({
                variables: {
                  data: {
                    presCode: id
                  },
                },
              }).then(async (result: any) => {
                const { data } = result;
          
                if (data) {
                  const { QueryAllPrescriptionUserQr } = data;
                  setCurrentItem(QueryAllPrescriptionUserQr?.Prescription_data)
          
                }
                // setIsLoading(false);
              });
        }
      },[id])

      const handleChange = (e:any) => {
        surname.current = e.target.value
    }

    const [qrImage, setQrImage] = useState(null)
    
  const generateQR = async(text:any) => {
    try {
      const res = await QRCode.toDataURL(text)
      // return <img width="50%" height="50%" src={res}/>
      setQrImage(res)
    } catch (err) {
      console.error(err)
    }
  }


  // const [link, setLink] = useState<string | null>(null)

    useEffect(()=>{
      (async()=>{
        const link = `https://hip.apgitsolutions.com/prescription-view/${id}`
        // setLink(link)
        await generateQR(link)
      })()
    },[id])

    return (

        <Dialog
            open={true}
            onClose={()=>{}}
            fullScreen
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                height:'100%'
            }}
            >
    
                {/* <Dialog open={isOpen} onClose={handleCloseSub}>
                    <DialogContent>
                        <TextField placeholder='last name' label="last name"/>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </DialogContent>
                </Dialog> */}
           
           <DialogContent sx={{
                height:'100%',
            }}>
                <StyledRoot bgImage={imageURL}>
                   
                        
                        {isVerified ? 
                         <Grid
                         container
                         sx={{
                            height:'100%'
                        }}>
                            {/* <Grid item sm={12} md={6}>
                                    <ScannerView handleChangeVoucher={handleChangeVoucher}/>
                            </Grid> */}
                            
                            <Grid item sm={12} md={12}>
                            {currentItem && isOpen && <Box sx={{height:'100%', overflow:'hidden'}}>
                                    <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                                            <PrescriptionPDF qrImage={qrImage} item={currentItem} />
                                    </PDFViewer>
                            </Box>}
                            </Grid>
                        </Grid>
                        :
                        <Box sx={{
                            // bgcolor:'red',
                            width:'100%',
                            height:'100%',
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            flexDirection:'column'
                            
                        }}>
                           <Box sx={{
                            display:'flex',
                            alignItems:'center',
                            mb:2
                           }}>
                                <Iconify color="primary.main" icon="gridicons:notice-outline" />
                                <Typography sx={{
                                    color:'primary.dark',
                                    ml:1
                                }} variant="body1">Insert your last name to proceed.</Typography>
                           </Box>
                            <Stack spacing={2} sx={{
                                backgroundColor:'white',
                                width:300,
                                // height:300,
                                p:3,
                                
                            }}>
                                
                                <TextField onChange={handleChange} ref={surname} fullWidth label="Last Name" placeholder='Last Name...'/>
                                <Button onClick={onSubmit} fullWidth variant="contained">Submit</Button>
                            </Stack>
                        </Box>
                        }
                    
                </StyledRoot>
               
            </DialogContent>
            
      </Dialog>
      )
}

export default PrescriptionView