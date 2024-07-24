import React from 'react'
import { AvatarGroup, Box, Container, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
import ProductDetailsToolbar from '@/sections/product/product-details-toolbar';
import ProductDetailsCarousel from '@/sections/product/product-details-carousel-original';
import ProductDetailsSummary from '@/sections/product/product-details-summary';
import { LogoFull } from '@/components/logo';

type FeedsDialogProps = {
  open: boolean;
  onClose: () => void;
  product: any;
}

const FeedsDialog = ({ open, onClose, product }: FeedsDialogProps) => {

  const renderProduct = (
    <>
   
      <Grid container spacing={{ xs: 3, md: 5, lg: 2}}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel product={product} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
         
          <ProductDetailsSummary
            disabledActions
            onclose={onClose}
            product={product}
          />
        </Grid>
      </Grid>

      
    </>
  );

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"

    >
      <Box sx={{ m: 2, flex: 1 }}>
        <LogoFull disabledLink />
      </Box>
      <DialogContent sx={{
        mt: 10
      }} >
        <Container maxWidth={'lg'}>
          {renderProduct}
         
        </Container>
      </DialogContent>
    </Dialog>

  )
}

export default FeedsDialog