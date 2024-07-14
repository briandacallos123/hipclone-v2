'use client';

import { useEffect, useCallback, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// redux
import { useDispatch } from 'src/redux/store';
// import { getProduct } from 'src/redux/slices/product';
// _mock
import { PRODUCT_PUBLISH_OPTIONS } from 'src/_mock';
// routes
import { paths } from 'src/routes/paths';
// import { useParams } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
//
import { medecineData } from '@/sections/medecineFull/mock';
// import { useProduct } from '../hooks';
import { ProductDetailsSkeleton } from '../product-skeleton';
import ProductDetailsReview from '../product-details-review';
import ProductDetailsSummary from '../product-details-summary';
import ProductDetailsToolbar from '../product-details-toolbar';
import ProductDetailsCarousel from '../product-details-carousel';
import StoreOtherProducts from '../product-details-description';
import EcommerceWelcome from '@/sections/medecineFull/ecommerce-welcome';
import { MotivationIllustration } from 'src/assets/illustrations';
import ProductStoreDetails from '../product-store-details';
import { useLazyQuery } from '@apollo/client';
import { QuerySingleMedecine } from '@/libs/gqls/medecine'
import { useParams } from 'next/navigation';
import { Stack } from '@mui/material';
import ProductDetailsDescription from '../product-details-description';
import { useRouter } from 'next/navigation';
import StoreDashboardBreadcramps from '@/sections/medecine-final/id/view/store-dashboard-breadcramps';
// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: '100% Original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'solar:verified-check-bold',
  },
  {
    title: '10 Day Replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Year Warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'solar:shield-check-bold',
  },
];

// ----------------------------------------------------------------------

function useInitial() {



  //   const getProductCallback = useCallback(() => {
  //     if (id) {
  //       dispatch(getProduct(id));
  //     }
  //   }, [dispatch, id]);

  //   useEffect(() => {
  //     getProductCallback();
  //   }, [getProductCallback]);

  return null;
}

type MedecineViewByIdProps = {
  data: []
}

export default function MedecineViewById({id}:any) {
  // useInitial();
  const router = useRouter()
  const [data, setData] = useState(null)
  // const { id }: any = useParams();

  const [getOrders, getOrdersResult] = useLazyQuery(QuerySingleMedecine, {
    context: {
      requestTrackerId: 'orders[QueryAllOrdersPatient]',
    },
    notifyOnNetworkStatusChange: true,
    // fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    getOrders({
      variables: {
        data: {
          id: Number(id)
        }
      }
    }).then((res) => {
      const { data } = res;
      if(data){
        const {QuerySingleMedecine} = data;
        setData(QuerySingleMedecine)
      }
    })
  }, [getOrdersResult.data])
  
  useEffect(()=>{
    const toCart = localStorage?.getItem('toCart') === '1';

    if(toCart){
      router.push('/dashboard/medecine-checkout/checkout')
      localStorage.removeItem('toCart')
    }
  },[])


  const settings = useSettingsContext();


  const [currentTab, setCurrentTab] = useState('description');

  const [publish, setPublish] = useState('');

  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
  }, []);

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const renderSkeleton = <ProductDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`May error ba`}
      action={
        <Button
          component={RouterLink}
          href=""
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderProduct = data && (
    <>
      {/* <ProductDetailsToolbar
        backLink={paths.dashboard.product.root}
        editLink={paths.dashboard.product.edit(`${product?.id}`)}
        liveLink={paths.product.details(`${product?.id}`)}
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={PRODUCT_PUBLISH_OPTIONS}
      /> */}

      <Grid sx={{mb:1}} container spacing={{ xs: 3, md: 5, lg: 8 }}>
        
        <Grid xs={12} md={12}>
          <StoreDashboardBreadcramps  path="single-med" storeName={data?.merchant_store?.name} address={data?.merchant_store?.address} />
            <ProductStoreDetails item={data?.merchant_store} />
          
        
        </Grid>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel product={data} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <ProductDetailsSummary
            product={data}
          />
        </Grid>
      </Grid>

      {/* <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box> */}

      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
             {
              value: 'description',
              label: `Description`,
            },
            // {
            //   value: 'products',
            //   label: 'Other Products',
            // },
            
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {/* {currentTab === 'products' && (
          <StoreOtherProducts data={data?.user?.merchant_store?.products} />
        )} */}
         {currentTab === 'description' && (
          <ProductDetailsDescription data={data} />
        )}

        {/* {currentTab === 'reviews' && (
           <ProductDetailsReview
             ratings={product.ratings}
             reviews={product.reviews}
            totalRatings={product.totalRatings}
             totalReviews={product.totalReviews}
           />
         )} */}
      </Card>
    </>
  );

  return (
    <Container maxWidth={'lg'}>
      {/* {productStatus.loading ? (
        renderSkeleton
      ) : (
        <>{productStatus.error ? renderError : renderProduct}</>
      )} */}
      
      {renderProduct}
    </Container>
  );
}







