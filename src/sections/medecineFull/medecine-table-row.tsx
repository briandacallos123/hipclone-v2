import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import React from 'react'

type MedecineTableRowProps = {
    data: []
}

const MedecineTableRowNew = ({ data }:MedecineTableRowProps) => {

    console.log(data,'DATA_____________________________________________________');


    return (
        <Box>
            <Grid  justifyContent="space-between" container gap={2}>
                {
                    data?.map(({ id, image, title, details, price }: any) => (
                        <Grid xl={2}>

                            <Card sx={{maxWidth:500}}>
                                <CardActionArea>
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