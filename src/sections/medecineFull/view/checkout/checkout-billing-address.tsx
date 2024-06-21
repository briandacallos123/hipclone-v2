// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
// types
import { IProductCheckoutState } from 'src/types/product';
// _mock
import { _addressBooks } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IAddressItem } from 'src/types/address';
// components
import Iconify from 'src/components/iconify';
//
import { AddressNewForm, AddressItem } from '../../../address';
import CheckoutSummary from './checkout-summary';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  checkout: IProductCheckoutState;
  onBackStep: VoidFunction;
  onCreateBilling: (address: any) => void;
};

export default function CheckoutBillingAddress({ checkout, onBackStep, onCreateBilling }: Props) {
  const addressForm = useBoolean();
  const { cart, total, discount, subTotal } = checkout;
  const { user }: any = useAuthContext()


  const userAddress = {
    name: user?.address,
    phoneNumber: user?.contact
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AddressItem
            // key={address.id}
            address={userAddress}
            action={
              <Stack flexDirection="row" flexWrap="wrap" flexShrink={0}>
                {/* {!address.primary && (
                  <Button size="small" color="error" sx={{ mr: 1 }}>
                    Delete
                  </Button>
                )} */}
                <Button variant="outlined" size="small" onClick={() => onCreateBilling(userAddress)}>
                  Deliver to this Address
                </Button>
              </Stack>
            }
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              boxShadow: (theme) => theme.customShadows.card,
            }}
          />
          

          <Stack direction="row" justifyContent="space-between">
            <Button
              size="small"
              color="inherit"
              onClick={onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Back
            </Button>

            <Button
              size="small"
              color="primary"
              onClick={addressForm.onTrue}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Address
            </Button>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={total}
            subTotal={total}
            discount={checkout.discount}
          />
        </Grid>
      </Grid>

      <AddressNewForm
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={onCreateBilling}
      />
    </>
  );
}
