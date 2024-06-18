"use client"

import Iconify from '@/components/iconify';
import { convertTimeFormat } from '@/utils/format-time';
import { Box, Rating, Stack, Typography } from '@mui/material';
import React from 'react'

type MedecineStoreHeaderProps = {
    storeName: string;
    product_type: string;
    startTime: string;
    endTime: string;
    rating: number;
    address: string;
}

const MedecineStoreHeader = ({ address, storeName, product_type, startTime, endTime, rating }: MedecineStoreHeaderProps) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5
        }}>
            <Typography variant='h3'>{`${storeName} - ${address}`}</Typography>
            <Typography variant='body2' color="grey">{product_type}</Typography>

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

            <Stack direction="row" alignItems="center" gap={3}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Typography variant="body2" color="grey">Opening Hours</Typography>
                    <Typography variant="body2" color="grey">{convertTimeFormat(startTime)}</Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Typography variant="body2" color="grey">Closing Hours</Typography>
                    <Typography variant="body2" color="grey">{convertTimeFormat(endTime)}</Typography>
                </Box>
            </Stack>
        </Box>
    )
}

export default MedecineStoreHeader