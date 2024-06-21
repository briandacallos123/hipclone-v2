import Iconify from '@/components/iconify/iconify';
import { paths } from '@/routes/paths';
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Grid, Rating, Stack, Typography } from '@mui/material'
import Image from 'next/image';
import React, { useCallback } from 'react';

import { useRouter } from 'src/routes/hook';

type MedecineTableRowProps = {
    data: [];
    alignment: string
}

const MedecineTableRowNew = ({ data, alignment }: MedecineTableRowProps) => {

    const router = useRouter();


    const handleView = useCallback((id: number) => {
        router.push(paths.dashboard.medecine.view(id));
    }, [])

    const isRow = alignment === 'row';

    return (
        <Box>
            <Grid gap={3} justifyContent="flex-start" container>
                {
                    data?.map(({ id, attachment_store, name, address, rating, product_types }: any) => (
                        <Grid xl={2} >

                            <Card sx={{ maxWidth: isRow ? '100%' : 300, height: 350 }}>
                                <CardActionArea
                                    onClick={() => {
                                        handleView(id)
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: isRow && 'flex',
                                        }}
                                    >
                                        {isRow ? <Box sx={{
                                            width: isRow && '10%'
                                        }}>

                                            <CardMedia
                                                component="img"
                                                image={`https://hip.apgitsolutions.com/${attachment_store?.file_url?.split('/').splice(1).join('/')}`}
                                                alt={name}
                                                height="100%"
                                                width="100%"
                                            />
                                        </Box> :

                                            <CardMedia
                                                component="img"
                                                image={`https://hip.apgitsolutions.com/${attachment_store?.file_url?.split('/').splice(1).join('/')}`}
                                                alt={name}
                                                height={150}
                                            />}
                                        <CardContent sx={{
                                            display: isRow && 'flex',
                                            alignItems: isRow && 'center',
                                            justifyContent: isRow && 'space-between',
                                        }}>
                                            <Box sx={{
                                                width: '100%'
                                            }}>
                                                <Typography variant="h6" >
                                                    {`${name} - ${address}`}
                                                </Typography>

                                                <Typography sx={{
                                                    textTransform: 'capitalize',
                                                    mt: 2
                                                }} variant="body2" color="grey">
                                                    {product_types}
                                                </Typography>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    mt: 1
                                                }}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,

                                                    }}>
                                                        <Rating max={1} name="read-only" value={1} readOnly />
                                                        <Typography>{rating}</Typography>
                                                    </Box>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                    }}>
                                                        <Iconify color="grey" icon="fa6-regular:clock" />
                                                        <Typography sx={{
                                                            color: 'grey'
                                                        }}>45mins</Typography>
                                                    </Box>
                                                    <Box


                                                    >
                                                        <Typography sx={{
                                                            textTransform: 'capitalize',
                                                        }} variant="body2" color="grey">
                                                            4.6 Km
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>

                                        </CardContent>
                                    </Box>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </Box >
    )
}

export default MedecineTableRowNew