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
import { useRouter } from 'src/routes/hook';
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
import { Avatar } from '@mui/material';
import { getDateSpan } from '@/utils/format-time';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<ICheckoutCartItem, 'colors'> {
  colors: string;
}

type Props = {
  product: IProduct;
  // cart: ICheckoutCartItem[];
  disabledActions?: boolean;
  onclose:()=>void;
  // onGotoStep: (step: number) => void;
  // onAddCart: (cartItem: ICheckoutCartItem) => void;
};

export default function ProductDetailsSummary({
  // cart,
  product,
  // onAddCart,
  // onGotoStep,
  disabledActions,
  onclose,
  ...other
}: Props) {

  const { userData, createdAt, isPublic, likes, text, attachment } = product;



  // userData = {
  // EMP_FNAME,
  // EMP_ID,
  // EMP_LNAME,
  // EMP_MNAME,
  // EMP_TITLE
  // }
  const router = useRouter();

  // const {
  //   id,
  //   name,
  //   sizes,
  //   price,
  //   coverUrl,
  //   colors,
  //   newLabel,
  //   available,
  //   priceSale,
  //   saleLabel,
  //   totalRatings,
  //   totalReviews,
  //   inventoryType,
  //   subDescription,
  // } = product;

  // const existProduct = cart.map((item) => item.id).includes(id);

  // const isMaxQuantity =
  //   cart.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  const defaultValues = {

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

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      // try {
      //   if (!existProduct) {
      //     onAddCart({
      //       ...data,
      //       colors: [values.colors],
      //       subTotal: data.price * data.quantity,
      //     });
      //   }
      //   onGotoStep(0);
      //   router.push(paths.product.checkout);
      // } catch (error) {
      //   console.error(error);
      // }
    },
    []
  );

  const handleAddCart = useCallback(() => {
    try {
      // onAddCart({
      //   ...values,
      //   colors: [values.colors],
      //   subTotal: values.price * values.quantity,
      // });
    } catch (error) {
      console.error(error);
    }
  }, []);

  // ----------------------------------------------------------------------

  // const renderPrice = (
  //   <Box sx={{ typography: 'h5' }}>
  //     {priceSale && (
  //       <Box
  //         component="span"
  //         sx={{ color: 'text.disabled', textDecoration: 'line-through', mr: 0.5 }}
  //       >
  //         {fCurrency(priceSale)}
  //       </Box>
  //     )}

  //     {fCurrency(price)}
  //   </Box>
  // );

  // const renderShare = (
  //   <Stack direction="row" spacing={3} justifyContent="center">
  //     <Link
  //       variant="subtitle2"
  //       sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
  //     >
  //       <Iconify icon="mingcute:add-line" width={16} sx={{ mr: 1 }} />
  //       Compare
  //     </Link>

  //     <Link
  //       variant="subtitle2"
  //       sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
  //     >
  //       <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
  //       Favorite
  //     </Link>

  //     <Link
  //       variant="subtitle2"
  //       sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
  //     >
  //       <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
  //       Share
  //     </Link>
  //   </Stack>
  // );

  // const renderColorOptions = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Color
  //     </Typography>

  //     <Controller
  //       name="colors"
  //       control={control}
  //       render={({ field }) => (
  //         <ColorPicker
  //           colors={colors}
  //           selected={field.value}
  //           onSelectColor={field.onChange}
  //           limit={4}
  //         />
  //       )}
  //     />
  //   </Stack>
  // );

  // const renderSizeOptions = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Size
  //     </Typography>

  //     <RHFSelect
  //       name="size"
  //       size="small"
  //       helperText={
  //         <Link underline="always" color="textPrimary">
  //           Size Chart
  //         </Link>
  //       }
  //       sx={{
  //         maxWidth: 88,
  //         [`& .${formHelperTextClasses.root}`]: {
  //           mx: 0,
  //           mt: 1,
  //           textAlign: 'right',
  //         },
  //       }}
  //     >
  //       {sizes.map((size) => (
  //         <MenuItem key={size} value={size}>
  //           {size}
  //         </MenuItem>
  //       ))}
  //     </RHFSelect>
  //   </Stack>
  // );

  // const renderQuantity = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Quantity
  //     </Typography>

  //     <Stack spacing={1}>
  //       <IncrementerButton
  //         name="quantity"
  //         quantity={values.quantity}
  //         disabledDecrease={values.quantity <= 1}
  //         disabledIncrease={values.quantity >= available}
  //         onIncrease={() => setValue('quantity', values.quantity + 1)}
  //         onDecrease={() => setValue('quantity', values.quantity - 1)}
  //       />

  //       <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
  //         Available: {available}
  //       </Typography>
  //     </Stack>
  //   </Stack>
  // );

  // const renderActions = (
  //   <Stack direction="row" spacing={2}>
  //     <Button
  //       fullWidth
  //       disabled={isMaxQuantity || disabledActions}
  //       size="large"
  //       color="warning"
  //       variant="contained"
  //       startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
  //       onClick={handleAddCart}
  //       sx={{ whiteSpace: 'nowrap' }}
  //     >
  //       Add to Cart
  //     </Button>

  //     <Button fullWidth size="large" type="submit" variant="contained" disabled={disabledActions}>
  //       Buy Now
  //     </Button>
  //   </Stack>
  // );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {text.charAt(0).toUpperCase()}{text.split('').splice(1).join('')}
    </Typography>
  );

  // const renderRating = (
  //   <Stack
  //     direction="row"
  //     alignItems="center"
  //     sx={{
  //       color: 'text.disabled',
  //       typography: 'body2',
  //     }}
  //   >
  //     <Rating size="small" value={totalRatings} precision={0.1} readOnly sx={{ mr: 1 }} />
  //     {`(${fShortenNumber(totalReviews)} reviews)`}
  //   </Stack>
  // );

  // const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
  //   <Stack direction="row" alignItems="center" spacing={1}>
  //     {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
  //     {saleLabel.enabled && <Label color="error">{saleLabel.content}</Label>}
  //   </Stack>
  // );

  // const renderInventoryType = (
  //   <Box
  //     component="span"
  //     sx={{
  //       typography: 'overline',
  //       color:
  //         (inventoryType === 'out of stock' && 'error.main') ||
  //         (inventoryType === 'low stock' && 'warning.main') ||
  //         'success.main',
  //     }}
  //   >
  //     {inventoryType}
  //   </Box>
  // );

  const fullName = userData?.EMP_MNAME ? `${userData?.EMP_FNAME} ${userData?.EMP_MNAME} ${userData?.EMP_LNAME}` : `${userData?.EMP_FNAME} ${userData?.EMP_LNAME}`



  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ ml: {lg:10}, p:{xs:1, lg:3}, boxShadow:'3px 3px 40px #e6e6e6' }} spacing={3}  {...other}>
        {/* <Button sx={{align:'left'}} size='large' variant="outlined">Back</Button> */}
        <Stack spacing={2} alignItems="flex-start">
          {/* {renderLabels} */}

          <Stack sx={{width:'100%'}} direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack direction="row" gap={2}>
              <Avatar src={userData?.attachment && (() => {
                return `https://hip.apgitsolutions.com/${userData?.attachment?.filename?.split('/').splice(1).join('/')}`
              })()} />
              <Box>
                <Typography variant="body1">{fullName}</Typography>

                <Typography variant="body2" color="text.disabled">{userData?.EMP_TITLE} .</Typography>

                <Stack direction="row" alignItems="center" gap={.5}>
                  <Typography color="text.disabled">{getDateSpan(createdAt)} .</Typography>

                  <Iconify sx={{
                    color: "text.disabled"
                  }} icon="material-symbols:public" />
                </Stack>
              </Box>
            </Stack>
                  
              <Button onClick={onclose} variant="contained">Back</Button>
          </Stack>

          {/* {renderInventoryType} */}

          {/* <Typography variant="h5">{name}</Typography> */}

          {/* {renderRating} */}

          {/* {renderPrice} */}


          <Divider sx={{ borderStyle: 'dashed' }} />
          <Divider sx={{ borderStyle: 'dashed' }} />


          {renderSubDescription}
          <Stack direction="row" alignItems="center" gap={1}>
              <Iconify icon="mdi:heart" sx={{
                color: 'error.main'
              }} />
              <Typography>{likes}</Typography>
            </Stack>

        </Stack>


        {/* {renderColorOptions} */}

        {/* {renderSizeOptions} */}

        {/* {renderQuantity} */}


        {/* {renderActions} */}

        {/* {renderShare} */}
      </Stack>
    </FormProvider>
  );
}
