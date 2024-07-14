import { useEffect, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
// routes
import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hook';
import { useRouter } from 'next/navigation';
// utils
import { fShortenNumber, fCurrency } from 'src/utils/format-number';
// types
import { IProduct, ICheckoutCartItem } from 'src/types/product';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ColorPicker } from 'src/components/color-utils';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
//
import { IncrementerButton } from './_common';
import { useCheckoutContext } from '@/context/checkout/Checkout';
import { useAuthContext } from '@/auth/hooks';


// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<ICheckoutCartItem, 'colors'> {
  colors: string;
}

type Props = {
  product: IProduct;
};

export default function ProductDetailsSummary({
  product,
  ...other
}: Props) {
  const router = useRouter();

  const {addToCart}:any = useCheckoutContext()
  const {user} = useAuthContext()
  const {
    id,
    generic_name,
    brand_name,
    price,
    dose,
    form,
    manufacturer,
    description,
    stock,
    rating
  } = product;

  const defaultValues = {
    id,
    generic_name,
    price,
    quantity:0,
  };

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  // useEffect(() => {
  //   if (product) {
  //     reset(defaultValues);
  //   }
  // }, [product]);

  
  const renderPrice = (
    <Box sx={{ typography: 'h5' }}>
  
      {`₱ ${fCurrency(price)}`}
    </Box>
  );

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      <Link
        variant="subtitle2"
        sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
      >
        <Iconify icon="mingcute:add-line" width={16} sx={{ mr: 1 }} />
        Compare
      </Link>

      <Link
        variant="subtitle2"
        sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
      >
        <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
        Favorite
      </Link>

      <Link
        variant="subtitle2"
        sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Share
      </Link>
    </Stack>
  );

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Quantity
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={values.quantity}
          disabledDecrease={values.quantity === 0}
          disabledIncrease={values.quantity >= stock}
          onIncrease={() => setValue('quantity', values.quantity += 1)}
          onDecrease={() =>  {
            if(values.quantity === 1){

              setValue('quantity', 0)
            }else{
              setValue('quantity', values.quantity -= 1)
            }
          }}
        />

        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
          Available: {stock}
        </Typography>
      </Stack>
    </Stack>
  );

  const handleAddCart = useCallback(()=>{
    
    addToCart({ ...product, itemQty: values.quantity })

    // localStorage.setItem('openCart','1')
  },[values.quantity])

  const handleGoToCart= useCallback(()=>{
    addToCart({ ...product, itemQty: values.quantity })
    localStorage.setItem('toCart','1');
    router.push('/dashboard/medecine-checkout/checkout')
  },[values.quantity])


  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        size="large"
        color="warning"
        variant="contained"
        disabled={values.quantity === 0}
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Add to Cart
      </Button>

      <Button onClick={handleGoToCart} disabled={values.quantity === 0} fullWidth size="large" type="submit" variant="contained" >
        Buy Now
      </Button>
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary'}}>
      {`${description[0].toUpperCase()}${description.split('').splice(1).join('')}`}
    </Typography>
  );

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        color: 'text.disabled',
        typography: 'body2',
      }}
    >
      <Rating size="small" value={5} precision={0.1} readOnly sx={{ mr: 1 }} />
      {`(${fShortenNumber(rating)} reviews)`}
    </Stack>
  );

  return (
    <FormProvider methods={methods} >
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {/* {renderLabels} */}

          {/* {renderInventoryType} */}

          {/* store name */}
          <Typography variant="h5">{generic_name}</Typography>

          {renderRating}

          {/* {price}
           */}
           {renderPrice}
          {renderSubDescription}

          {/* {address} */}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* {renderColorOptions}

        {renderSizeOptions} */}

        {user?.role === 'patient' && renderQuantity}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {user?.role === 'patient' && renderActions}

        {/* {renderShare} */}
      </Stack>
    </FormProvider>
  );
}
