import Iconify from '@/components/iconify'
import { LogoFull } from '@/components/logo';
import { useResponsive } from '@/hooks/use-responsive';
import { Avatar, Box, Button, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTheme, alpha } from '@mui/material/styles';
import QRCode from 'qrcode'

type AppointmentQueueModalProps = {
    open: boolean,
    onClose: () => void;
    data: any;
}

const AppointmentQueueModal = ({ open, onClose, data }: AppointmentQueueModalProps) => {
    const upMd = useResponsive('up', 'md');
    const theme = useTheme();
    const img = data?.patientInfo?.userInfo?.[0]?.display_picture[0]
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
    const [link, setLink] = useState<string | null>(null)

    useEffect(() => {
        (async () => {

            const link = `/queue/${data?.voucherId}`
            setLink(link)
            await generateQR(link)
        })()
    }, [data?.id])

    const navigateLink= () => {
        if(link){
        //   window.location.href = link
        window.open(link, '_blank');
          
        }
      }

      const downloadQr = () => {
        const link = document.createElement('a');
        link.href = qr;
    
        link.download = 'Qrcode.png';
    
        console.log(link,'LINK@@@@@@@')
    
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    

    return (
        <Box>
            <Dialog
                fullScreen={!upMd}
                fullWidth
                maxWidth={false}
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: { maxWidth: 620 },
                }}
            >
                <DialogTitle>
                    <CardHeader title="Appointment Preview" sx={{ p: 0 }} />
                </DialogTitle>

                <DialogContent >
                    <Stack flexDirection="row" alignItems="flex-start" justifyContent="space-between">
                        <Box>
                            {img ? (
                                <Avatar
                                    alt={data?.patientInfo?.FNAME}
                                    src={
                                        img?.filename.split('public')[1]
                                    }
                                    sx={{
                                        mx: 'auto',
                                        width: { xs: 78, md: 128 },
                                        height: { xs: 78, md: 128 },
                                        border: `solid 2px ${theme.palette.common.white}`,
                                    }}
                                >
                                    {data?.patient?.FNAME.charAt(0).toUpperCase()}
                                </Avatar>
                            ) : (
                                <Avatar
                                    alt={data?.patientInfo?.FNAME}
                                    sx={{
                                        mx: 'auto',
                                        width: { xs: 78, md: 128 },
                                        height: { xs: 78, md: 128 },
                                        border: `solid 2px ${theme.palette.common.white}`,
                                    }}
                                >
                                    <Avatar sx={{ textTransform: 'capitalize' }}>
                                        {' '}
                                        {data?.patientInfo?.FNAME.charAt(0).toUpperCase()}
                                    </Avatar>
                                </Avatar>
                            )}
                        </Box>
                        <Box>
                            <Stack direction="row" alignItems="center">
                                <img src={qrImage} width="50%" height="50%" />
                                <Tooltip sx={{ mt: 1 }} title="Download">
                                    <img style={{
                                        cursor: 'pointer'
                                    }} onClick={downloadQr} src='/assets/download.svg' />
                                </Tooltip>
                            </Stack>
                            <Box>
                                <Typography variant="body2">Code: {data?.voucherId}</Typography>
                                <Typography variant="body2">Unable to scan? <Typography onClick={navigateLink} variant="body2" sx={{ textDecoration: 'underline', color: 'primary.main', cursor: 'pointer' }}>click here to preview</Typography></Typography>
                            </Box>
                        </Box>
                    </Stack>
                    <div>
                        <Typography variant="overline" color="text.disabled">
                            Name:
                        </Typography>
                        <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
                            {data?.patientInfo?.MNAME ? `${data?.patientInfo?.FNAME} ${data?.patientInfo?.MNAME} ${data?.patientInfo?.LNAME}` : `${data?.patientInfo?.FNAME} ${data?.patientInfo?.LNAME}`}
                        </Typography>

                        <Typography variant="overline" color="text.disabled">
                            Home address:
                        </Typography>
                        <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
                            {data?.patientInfo?.HOME_ADD}
                        </Typography>
                        <Typography variant="overline" color="text.disabled">
                            Gender:
                        </Typography>
                        <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
                            {Number(data?.patientInfo?.SEX) === 1 ? 'Male' : 'Female'}
                        </Typography>
                    </div>
                    <div>
                        <Typography sx={{ mb: 1 }} variant="overline" color="text.disabled">
                            Hospital/Clinic:
                        </Typography>
                        <Typography variant={!upMd ? 'body2' : 'subtitle1'}>
                            {data?.clinicInfo?.clinic_name}
                        </Typography>

                    
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="contained" onClick={navigateLink}>
                        Proceed to Queue
                    </Button>



                </DialogActions>
            </Dialog>


        </Box>
    )
}

export default AppointmentQueueModal