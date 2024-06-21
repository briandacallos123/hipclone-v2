import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useResponsive } from 'src/hooks/use-responsive';
import { Box, Grid } from '@mui/material';

const MedecinePageSkeleton = () => {
    return (
        <Box sx={{
            width: '100%',
            height: 300
        }}>
            {[...Array(3)].map((_, i) =>
            (
                <Grid sx={{mb:2}} key={i} gap={2} container>
                    <Grid lg={3}>
                        <Skeleton sx={{
                            height: 200
                        }} width="100%" />
                    </Grid>
                    <Grid lg={3}>
                        <Skeleton sx={{
                            height: 200
                        }} width="100%" />
                    </Grid>
                    <Grid lg={3}>
                        <Skeleton sx={{
                            height: 200
                        }} width="100%" />
                    </Grid>
                </Grid>
            ))
            }

        </Box>
      
    )
}

export default MedecinePageSkeleton

