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
        router.push(paths.dashboard.medecine.view(id));
    },[])


    return (
        <Box>
            <Grid  justifyContent="flex-start" container gap={2}>
                {
                    data?.map(({ id, attachment_info, generic_name, brand_name, price }: any) => (
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
                                        image={`http://localhost:9092/${attachment_info?.file_path?.split('/').splice(1).join('/')}`}
                                        alt={generic_name}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {generic_name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                           {brand_name}
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