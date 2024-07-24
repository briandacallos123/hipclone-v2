import * as Yup from 'yup';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

// types
// import {
//   ICheckoutCardOption,
//   ICheckoutPaymentOption,
//   ICheckoutDeliveryOption,
//   IProductCheckoutState,
// } from 'src/types/product';
// components
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
//
import CheckoutSummary from './checkout-summary';
import CheckoutDelivery from './checkout-delivery';
import CheckoutBillingInfo from './checkout-billing-info';
import CheckoutPaymentMethods from './checkout-payment-methods';
import { useMutation } from '@apollo/client';
import { CreateOrders } from '@/libs/gqls/Orders';
import { useSnackbar } from 'src/components/snackbar';
import { paths } from '@/routes/paths';
import { useRouter } from 'next/navigation';
import { useCheckoutContext } from '@/context/checkout/Checkout';
import { UseOrdersContext } from '@/context/dashboard/medecine/Medecine';
import { Box, Typography } from '@mui/material';
// ----------------------------------------------------------------------

const DELIVERY_OPTIONS: any[] = [
  {
    value: 0,
    label: 'Free',
    description: '5-7 Days delivery',
  },
  {
    value: 10,
    label: 'Standard',
    description: '3-5 Days delivery',
  },
  {
    value: 20,
    label: 'Express',
    description: '2-3 Days delivery',
  },
];

const PAYMENT_OPTIONS: any[] = [
  {
    value: 'gcash',
    label: 'Pay with Gcash',
    description: 'Please pay payments using your gcash in every store you bought medecines',
  },
  {
    value: 'cash',
    label: 'Cash on delivery',
    description: 'Pay with cash when your order is delivered.',
  },
];



type Props = {
  checkout: any;
  onNextStep: VoidFunction;
  onBackStep: VoidFunction;
  onReset: VoidFunction;
  onGotoStep: (step: number) => void;
  onApplyShipping: (value: number) => void;
};

type FormValuesProps = {
  delivery: number;
  payment: string;
};

export default function CheckoutPayment({
  checkout,
  onReset,
  onNextStep,
  onBackStep,
  onGotoStep,
  onApplyShipping,
}: Props) {
  const { resetCheckout, state }: any = useCheckoutContext()
  // const {resetOrder}:any = UseOrdersContext()
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const [currency, setCurrency] = useState(options.currency);

  const [CARDS_OPTIONS, setCardOptions] = useState([])
  const formRef = useRef()

  useEffect(() => {
    if (checkout?.cart) {
      const cardPayment = [];
      checkout?.cart?.forEach((item) => {
        if (item?.onlinePayment) {
          if (cardPayment?.length === 0) {
            cardPayment.push({ value: 'g cash', label: item?.onlinePayment?.recepient_contact, attachment: item?.onlinePayment?.file_url })
          }
        }
      })


      setCardOptions(cardPayment)
    }
  }, [checkout?.cart])



  const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const PaymentSchema = Yup.object().shape({
  });

  const defaultValues = {
    delivery: state?.billingAddress?.name,
    payment: '',
    products: checkout?.cart,
    total: checkout?.total,
    contact: state?.billingAddress?.contact,
    refNumber:""
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch()

  const [createMedFunc] = useMutation(CreateOrders, {
    context: {
      requestTrackerId: 'Create_Merch[Merchant_User_Key]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const createOrder = useCallback((model: any) => {
  
    createMedFunc({
      variables: {
        data: {
          address: model.address,
          payment: model.payment,
          contact: model?.contact,
          medicine_list: model.medicine_list,
          refNumber: model?.referenceNumber
        },
        file: model?.paymentAttachment
      }
    }).then((res) => {
      const { data } = res;
      enqueueSnackbar("Created Order Succesfully")
      router.push(paths.dashboard.medecine.root)
      // empty the cart on local storage
      localStorage.setItem('cart', '')
      resetCheckout()
      // resetOrder()

    })
  }, [])


  const onSubmit = useCallback(async (data: any) => {
    try {


      const productPayloads = data?.products?.map((item: any) => {
        return {
          generic_name: item?.generic_name,
          brand_name: item?.brand_name,
          dose: item?.dose,
          form: item?.form,
          quantity: item?.quantity,
          price: item?.price,
          store_id: item?.store_id,
          medecine_id: item?.id
        }
      })
      const newPayloads = {
        medicine_list: productPayloads,
        payment: data?.payment,
        contact: data?.contact,
        address: data?.delivery,
        paymentAttachment: data?.avatar,
        referenceNumber: data?.refNumber
      }


      createOrder(newPayloads)
      // onNextStep();
      // onReset();
    } catch (error) {
      console.error(error);
    }
  }, [onNextStep, onReset]);

  const onCurrencyChange = ({ target: { value } }) => {
    setCurrency(value);
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: value,
      },
    });
  }

  const onCreateOrder = useCallback((data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: checkout.total,
            currency_code: 'PHP'
          },
        },
      ],
    });
  },[checkout.total])

  const loadingButtonRef:any = useRef();

  const onApproveOrder = (data, actions) => {


    return actions.order.capture().then((details) => {
      if (loadingButtonRef.current) {
        setValue('payment', 'paypal');
        setValue('refNumber', details?.id)
      }
    });
  }

  useEffect(()=>{
    if(values.payment === 'paypal'){
      loadingButtonRef.current.click();
    }
  },[values.payment])

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
        {/* <Grid xs={12} md={8}>
          
          {
            isPending ? <p>LOADING...</p> : (
              <>
                <select value={currency} onChange={onCurrencyChange}>
                  <option value="USD">💵 USD</option>
                  <option value="EUR">💶 Euro</option>
                  <option value="PHP">💶 PHP</option>

                </select>

                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) => onCreateOrder(data, actions)}
                  onApprove={(data, actions) => onApproveOrder(data, actions)}
                />
              </>
            )
          }
          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            options={PAYMENT_OPTIONS}
            sx={{ my: 3 }}
          />

          <Button
            size="small"
            color="inherit"
            onClick={onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Back
          </Button>
        </Grid> */}

        <Grid xs={12} md={12} >
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 2 }}>
            <Box sx={{ width: { md: 700 } }}>
              <CheckoutBillingInfo onBackStep={onBackStep} billing={state?.billingAddress} />

              <CheckoutSummary
                enableEdit
                total={checkout.total}

                subTotal={checkout.total}
                discount={checkout.discount}
                shipping={checkout.billingAddress}
                onEdit={() => onGotoStep(0)}
              />

              <Typography variant="overline" sx={{mb:10}}>Payment</Typography>
              {
                isPending ? <p>LOADING...</p> : (
                  <>
                    {/* <select value={currency} onChange={onCurrencyChange}>
                      <option value="USD">💵 USD</option>
                      <option value="EUR">💶 Euro</option>
                      <option value="PHP">💶 PHP</option>

                    </select> */}

                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) => onCreateOrder(data, actions)}
                      onApprove={(data, actions) => onApproveOrder(data, actions)}
                    />
                  </>
                )
              }

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                ref={loadingButtonRef}
                
              >
                Complete Order
              </LoadingButton>
              <Button
                size="small"
                color="inherit"
                onClick={onBackStep}
                sx={{mt:3}}
                startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              >
                Back
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
