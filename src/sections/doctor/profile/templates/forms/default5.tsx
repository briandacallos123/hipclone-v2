import { Avatar, Box, Container, Grid, Paper, Stack, Typography } from '@mui/material'
import Image from 'next/image';
// import Image from '@/components/image';
import React, { forwardRef } from 'react'
import { LogoFull } from 'src/components/logo';
import { bgGradient } from 'src/theme/css';
import ImageAvatar from './ImageAvatar';

type MainProps = {
    title: string;
    name: string;
    specialty: string;
    link: string;
    photo: any;
    forDownload: any;
}

const Default5 = forwardRef((props, ref) => {
    const { arr, forDownload, isSelected, selected, contact, address, facebook, twitter, title, email, name, specialty, link, photo, socials }: any = props;

    const { facebook: arrFb, twitter: arrTt, contact: arrContact, email: arrEmail, name: arrName, specialty: arrSpecialty, address: arrAddress } = arr;


    console.log(facebook, twitter, 'social sa loob ng default5!')


    return (
        <Paper elevation={4} ref={ref} sx={{
            width: '100%',
            height: isSelected ? 400 : selected ? 300 : 200,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            backgroundImage: "url(/assets/doctor/templates/default5.jpg)",
            backgroundSize: 'cover',
            // pt: 5,
            position: 'relative',

        }}>


            <Grid container>
                <Grid justifyContent="flex-end" item xs={6} lg={6} >
                    <Box sx={{
                        position: 'absolute',
                        top: isSelected ? 20:10,
                        left: isSelected ? 20 : 15,
                        margin: '0 auto'
                    }}>
                        <Image
                            alt="logo"
                            src="/logo/logo_full.png"
                            height={selected ? 30 : 25}
                            width={selected ? 80 : 80}

                        />
                    </Box>
                    <Stack justifyContent="flex-end"  sx={{
                        left: 10,
                        width:'100%',
                        height:'100%'

                    }}>

                     
                    
                        {(arrContact || isSelected) && contact &&
                            <Stack direction="row" alignItems="center" gap={1}>
                                <Avatar
                                    sx={{
                                        width: 20,
                                        height: 20
                                    }}
                                    src={'/assets/icons/socials/phone.svg'}
                                />
                                <Typography sx={{
              fontSize:!selected && 12
              }} variant="body2">{contact}</Typography>
                            </Stack>
                        }

                        {(arrFb || isSelected) && facebook &&
                            <Stack direction="row" alignItems="center" gap={1}>
                                <Avatar
                                    sx={{
                                        width: 20,
                                        height: 20
                                    }}
                                    src={'/assets/icons/socials/facebook.svg'}
                                />
                                <Typography sx={{
              fontSize:!selected && 12
              }} variant="body2">{facebook}</Typography>
                            </Stack>
                        }

                        {(arrTt || isSelected) && twitter && <Stack direction="row" alignItems="center" gap={1}>
                            <Avatar
                                sx={{
                                    width: 20,
                                    height: 20
                                }}
                                src={'/assets/icons/socials/twitter.svg'}
                            />
                            <Typography sx={{
              fontSize:!selected && 12
              }} variant="body2">{twitter}</Typography>
                        </Stack>}


                        {(arrEmail || isSelected) && email && <Stack direction="row" alignItems="center" gap={1}>
                            <Avatar
                                sx={{
                                    width: 20,
                                    height: 20
                                }}
                                src={'/assets/icons/socials/google.svg'}
                            />
                            <Typography sx={{
              fontSize:!selected && 12
              }} variant="body2">{email}</Typography>
                        </Stack>}





                    </Stack>

                </Grid>
                <Grid item xs={6} lg={6} justifyContent="center" sx={{
                    mt:isSelected && 10,
                }}>
                    <Stack alignItems="center">
                        <ImageAvatar
                            width={isSelected ? 100 : selected ? 80 : 50}
                            height={isSelected ? 100 : selected ? 80 : 50}
                            alt="qr image"
                            style={{
                                borderRadius: '50%',
                            }}
                            src={photo}
                        />
                      
                    </Stack>
                    <Stack alignItems="center" justifyContent="center" sx={{ mt: 1, width: '100%' }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{arrName && name}</Typography>
                        <Box sx={{ width: '100%', height: 2, background: '##68a4e4' }}></Box>
                        <Typography sx={{ textTransform: 'uppercase', fontSize: 10 }} variant="body2" color="gray">{arrSpecialty && specialty}</Typography>
                    </Stack>

                    <Stack alignItems="center">
                        <Image
                            src={link}
                            width={selected ? 100 : 60}
                            height={selected ? 100 : 60}
                            alt="qr image"
                        />
                    </Stack>

                </Grid>
            </Grid>



            {/* <Stack direction="row" justifyContent="center" alignItems="center" gap={5} sx={{
                width: '100%',
                color: 'white',
                px: 2,
                position: 'absolute',
                bottom: 10,

            }}>

                {arrAddress && <Typography sx={{fontSize:12}} variant="body2">
                    {address}
                </Typography>}
            </Stack> */}


        </Paper>
    )
})

export default Default5