"use client"

import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'


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
import { GET_RECORD_PATIENT } from '@/libs/gqls/records';
import NotePDFText from '../note/note-pdf-text';
import NotePDFCertificate from '../note/note-pdf-certificate';
import NotePDFClearance from '../note/note-pdf-clearance';
import { get_note_medClear } from '@/libs/gqls/notes/notesMedClear';
let imageURL = '../../assets/background/bgScan.jpg';


const StyledRoot = styled('section')(({ theme }) => ({
  // padding: theme.spacing(0, 10),
  background: `url('/assets/background/queue-bg.jpg')`,
  backgroundSize: 'cover',
  // width:'100vw',
  height: '100vh',
  color: theme.palette.common.white,
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(8, 0),
  },
  [theme.breakpoints.up('xl')]: {
    padding: theme.spacing(14, 0),
  },
}));

const MedicalClearance = () => {
  const [isVerified, setIsVerified] = useState(false)
  const [isOpen, setIsOpen] = useState(true);
  const [currentItem, setCurrentItem] = useState(null)
  const { id } = useParams()
  const [voucherId, setVoucherId] = useState(null)
  const surname = useRef(null)
  const [isWrongCred, setWrongCreds] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();



  const onSubmit = useCallback(() => {
    if (currentItem?.patientInfo?.LNAME?.toLowerCase() === surname?.current.toLowerCase()) {


      setIsOpen(true)
      setIsVerified(true)
    } else {
      enqueueSnackbar('Invalid last name', { variant: 'error' })
    }
  }, [currentItem])

  useEffect(() => {

  }, [])

  const [getMedical, { data, loading, error }] = useLazyQuery(get_note_medClear, {
    context: {
      requestTrackerId: 'prescriptions[QueryAllPrescriptionUser]',
    },
    notifyOnNetworkStatusChange: true,
  });

  // const [noteData, setNoteData] = useState(null)
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

 

  useEffect(() => {
    if (id) {
      getMedical({
        variables: {
          data: {
            qrCode: id
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { QueryNotesMedCler } = data;
          setCurrentItem(QueryNotesMedCler);
        }
      });
    }
  }, [id])

  const handleChange = (e: any) => {
    surname.current = e.target.value
  }

  const [qrImage, setQrImage] = useState(null)

  const generateQR = async (text: any) => {
    try {
      const res = await QRCode.toDataURL(text)
      // return <img width="50%" height="50%" src={res}/>
      setQrImage(res)
    } catch (err) {
      console.error(err)
    }
  }


  // const [link, setLink] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const link = `http://localhost:9092/records/medical-clearance/${currentItem?.qrcode}`
      // setLink(link)
      await generateQR(link)
    })()
  }, [id])

  return (

    <Dialog
      open={true}
      onClose={() => { }}
      fullScreen
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
       
      }}
    >
      <DialogContent sx={{
         minHeight:'100vh',
        width:'100vw',
        background: `url('/assets/background/queue-bg.jpg')`,
        backgroundSize: 'cover',
        p:0
      }}>
       {isVerified ?
            <Grid
              container
              sx={{
                height: '100%',
                width:'100vw',

              }}>

              <Grid item sm={12} md={12} lg={12}>
                {currentItem && isOpen && <Box sx={{ height: '100%', overflow: 'hidden' }}>
                  <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                    {/* <PrescriptionPDF qrImage={qrImage} item={currentItem} /> */}
                    <NotePDFClearance qrImage={qrImage} item={currentItem}/>
                  </PDFViewer>
                </Box>}
              </Grid>
            </Grid>
            :
            <Box sx={{
              // bgcolor:'red',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'

            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2
              }}>
                <Iconify color="primary.main" icon="gridicons:notice-outline" />
                <Typography sx={{
                  color: 'primary.dark',
                  ml: 1
                }} variant="body1">Insert your last name to proceed.</Typography>
              </Box>
              <Stack spacing={2} sx={{
                backgroundColor: 'white',
                width: 300,
                // height:300,
                p: 3,

              }}>

                <TextField onChange={handleChange} ref={surname} fullWidth label="Last Name" placeholder='Last Name...' />
                <Button onClick={onSubmit} fullWidth variant="contained">Submit</Button>
              </Stack>
            </Box>
          }


      </DialogContent>

    </Dialog>
  )
}

export default MedicalClearance