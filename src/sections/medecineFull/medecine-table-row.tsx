import { paths } from '@/routes/paths';
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import React, { useCallback } from 'react';

import { useRouter } from 'src/routes/hook';

type MedecineTableRowProps = {
    data: []
}

const MedecineTableRowNew = ({ data }:MedecineTableRowProps) => {

    const router = useRouter();


    const handleView = useCallback((id:number)=>{
        console.log(id,"AYDIIII")

        router.push(paths.dashboard.medecine.view(id));
    },[])

    return (
        <Box>
            <Grid  justifyContent="space-between" container gap={2}>
                {
                    data?.map(({ id, image, title, details, price }: any) => (
                        <Grid xl={2}>

                            <Card sx={{maxWidth:500}}>
                                <CardActionArea
                                onClick={()=>{
                                    handleView(id)
                                }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={image}
                                        alt={title}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                           {details}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                         ₱{price}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    )
}

export default MedecineTableRowNew