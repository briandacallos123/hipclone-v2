import { useResponsive } from '@/hooks/use-responsive';
import { Box, Grid, Skeleton, Stack } from '@mui/material'
import React from 'react'

const UpcomingSkeleton = () => {

    const upMd = useResponsive('up', 'md');


    if (!upMd) {
        return (
            <Stack rowGap={4} sx={{
                width: '100%'
            }}>
                <Stack justifyContent='flex-end' flexDirection='row' gap={2}>
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                </Stack>

                <Stack direction="row" gap={2}>
                    <Skeleton variant="circular" width={40} height={40} />

                    <Skeleton animation="wave" variant="rectangular" width={140} height={40} />

                </Stack>
                <Stack direction="row" gap={2}>
                    <Skeleton variant="circular" width={40} height={40} />

                    <Skeleton animation="wave" variant="rectangular" width={140} height={40} />

                </Stack>
                <Stack direction="row" gap={2}>
                    <Skeleton variant="circular" width={40} height={40} />

                    <Skeleton animation="wave" variant="rectangular" width={140} height={40} />

                </Stack>
            </Stack>
        )
    }

    return (
        <Grid container>
            <Grid item md={8}>
                <Stack gap={2}>
                    <Stack>
                        <Skeleton animation="wave" variant="rectangular" width={150} height={20} />

                    </Stack>
                    <Stack direction='row' gap={2}>
                        <Skeleton animation="wave" variant="rectangular" width={100} height={40} />
                        <Skeleton animation="wave" variant="rectangular" width={100} height={40} />

                    </Stack>
                    <Stack gap={2}>
                        <Stack gap={3} direction='row' alignItems='center'>
                            <Skeleton animation="wave" variant="rectangular" width={50} height={50} />
                            <Skeleton animation="wave" variant="rectangular" width={210} height={40} />

                        </Stack>
                        <Stack gap={3} direction='row' alignItems='center'>
                            <Skeleton animation="wave" variant="rectangular" width={50} height={50} />
                            <Skeleton animation="wave" variant="rectangular" width={210} height={40} />

                        </Stack>
                    </Stack>
                </Stack>
            </Grid>
            <Grid item md={4}>
                <Skeleton animation="wave" variant="rectangular" width={200} height={200} />

            </Grid>

        </Grid>
    )
}

export default UpcomingSkeleton