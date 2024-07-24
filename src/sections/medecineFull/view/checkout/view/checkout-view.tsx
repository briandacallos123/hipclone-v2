'use client';

import { useEffect, useCallback } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useDispatch } from 'src/redux/store';

import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';

import { useSettingsContext } from 'src/components/settings';

import CheckoutCart from '../checkout-cart';
import CheckoutSteps from '../checkout-steps';
import CheckoutPayment from '../checkout-payment';
import CheckoutOrderComplete from '../checkout-order-complete';
import CheckoutBillingAddress from '../checkout-billing-address';
import { useCheckoutContext } from '@/context/checkout/Checkout';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';


const initialOptions = {
  "client-id": "Ade90ExOQRf0oSF1PDxbAmrh7x3t9KsKyRv2aH-p0RD5sXM6EJXtGMwICl567C5sREE6uJgAN5TqyGFH",
  currency: "PHP",
  intent: "capture",
};

export default function CheckoutView() {
  const settings = useSettingsContext();
  const { state, incrementCart, removeItem, incrementSetup, incrementCheckout, decrementSetup, removeToCart, addAddress }: any = useCheckoutContext()
  const { cart, activeStep } = state

  const completed = activeStep === PRODUCT_CHECKOUT_STEPS.length;


  const billing = true


  useEffect(() => {
    if (activeStep === 1) {
    }
  }, [activeStep]);


  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Checkout
      </Typography>

      <Grid container justifyContent={'center'}>
        <Grid xs={12} md={8}>
          <CheckoutSteps activeStep={activeStep} steps={PRODUCT_CHECKOUT_STEPS} />
        </Grid>
      </Grid>


      {completed ? (
        <CheckoutOrderComplete open={completed} onReset={() => { }} onDownloadPDF={() => { }} />
      ) :

        (
          <>
            {activeStep === 0 && (

              <CheckoutCart
                checkout={state}
                onNextStep={incrementSetup}
                onDeleteCart={removeItem}
                onApplyDiscount={() => { }}
                onIncreaseQuantity={incrementCheckout}
                onDecreaseQuantity={removeToCart}
              />

            )}

            {activeStep === 1 && (
              <CheckoutBillingAddress
                checkout={state}
                onBackStep={decrementSetup}
                onCreateBilling={addAddress}
              />
            )}

            {activeStep === 2 && billing && (

              <PayPalScriptProvider options={initialOptions}>
                <CheckoutPayment
                  checkout={state}
                  onNextStep={() => { }}
                  onBackStep={decrementSetup}
                  onGotoStep={() => { }}
                  onApplyShipping={() => { }}
                  onReset={() => { }}
                />
              </PayPalScriptProvider>


            )}
          </>
        )
      }
    </Container>
  );
}
