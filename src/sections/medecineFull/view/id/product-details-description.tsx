// components
import { Box, Card, CardContent, CardMedia, Grid, Typography, CardActionArea } from '@mui/material';
import Markdown from 'src/components/markdown';

// ----------------------------------------------------------------------

type Props = {
  data: [];
};

export default function StoreOtherProducts({ data }: Props) {
  console.log(data,'DATA KO TO_________________')
  return (
    <Box sx={{
      p:3
    }}>
      {/* Products */}
            <Grid  justifyContent="flex-start" container gap={2}>
                {
                    data?.map(({ id, attachment_info, generic_name, brand_name, price }: any) => (
                        <Grid xl={2}>

                            <Card sx={{maxWidth:500}}>
                                <CardActionArea
                                // onClick={()=>{
                                //     handleView(id)
                                // }}
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
  );
}
