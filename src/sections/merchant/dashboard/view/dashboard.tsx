'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// _mock
import {
  _ecommerceNewProducts,
  _ecommerceSalesOverview,
  _ecommerceBestSalesman,
  _ecommerceLatestProducts,
} from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
// assets
import { MotivationIllustration } from 'src/assets/illustrations';
//
import EcommerceWelcome from '../ecommerce-welcome';
import EcommerceNewProducts from '../ecommerce-new-products';
import EcommerceYearlySales from '../ecommerce-yearly-sales';
import EcommerceBestSalesman from '../ecommerce-best-salesman';
import EcommerceSaleByGender from '../ecommerce-sale-by-gender';
import EcommerceSalesOverview from '../ecommerce-sales-overview';
import EcommerceWidgetSummary from '../ecommerce-widget-summary';
import EcommerceLatestProducts from '../ecommerce-latest-products';
import EcommerceCurrentBalance from '../ecommerce-current-balance';
import { useAuthContext } from '@/auth/hooks';
import { useLazyQuery } from '@apollo/client';
import { QueryMerchantDashboard } from '@/libs/gqls/merchant';
import { useEffect, useState } from 'react';
// ----------------------------------------------------------------------

export default function DashboardView() {
  const { user } = useMockedUser();
  const [summary, setSummary] = useState({order:0, sales:0, store:0, orderData:[]});

  const {user:u} = useAuthContext()

  const theme = useTheme();

  const settings = useSettingsContext();

  const [getMerchantDashboard, merchantDashboardResult] = useLazyQuery(QueryMerchantDashboard, {
    context: {
        requestTrackerId: 'merchantDashboard[QueryMerchantDashboard]',
      },
      notifyOnNetworkStatusChange: true,
  });

  useEffect(()=>{
    getMerchantDashboard().then((res)=>{
      const {data} = res;
      if(data){
        const {QueryMerchantDashboard} = data;
        setSummary({
          order:QueryMerchantDashboard?.ordersCount,
          sales:QueryMerchantDashboard?.salesProfit,
          store:QueryMerchantDashboard?.storeCount,
          orderData:QueryMerchantDashboard?.orders
        })
      } 
    })
  },[merchantDashboardResult.data])

  function calculateMonthlyTotals(orders) {
    // Initialize an object to store monthly totals
    const monthlyTotals = {};

    // Loop through each order
    orders.forEach(order => {
        // Extract year and month from created_at
        const year = order.created_at.slice(0, 4); // Get YYYY format
        const month = order.created_at.slice(5, 7); // Get MM format

        // Create a key for the year if it doesn't exist
        if (!monthlyTotals[year]) {
            monthlyTotals[year] = {
                year: year,
                data: []
            };
        }

        // Calculate total sales for the order
        const totalSales = order.price * parseInt(order.quantity, 10);

        // Add total sales to the corresponding month's data array
        const monthIndex = parseInt(month, 10) - 1; // Adjust month to array index (0-based)
        if (!monthlyTotals[year].data[monthIndex]) {
            monthlyTotals[year].data[monthIndex] = 0;
        }
        monthlyTotals[year].data[monthIndex] += totalSales;
    });

    // Fill in missing months with 0 if necessary
    Object.values(monthlyTotals).forEach(yearData => {
        yearData.data = yearData.data.map(monthValue => monthValue || 0);
    });

    return monthlyTotals;
}

const [series, setSeries] = useState([])

// Calculate total sales grouped by month
useEffect(()=>{
  if(summary?.orderData){
    const seriesData = calculateMonthlyTotals(summary?.orderData);
  //  console.log(series,'HAHAA')
  setSeries(seriesData)
  }
},[summary?.orderData])

console.log(series[2024]?.data,'DATAAAAAAAA')
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <EcommerceWelcome
            title={`Welcome Back! \n ${u?.displayName}`}
            description="Best seller of the month You have done 57.6% more sales today."
            img={<MotivationIllustration />}
            action={
              <Button variant="contained" color="primary">
                Go Now
              </Button>
            }
          />
        </Grid>

        {/* <Grid xs={12} md={4}>
          <EcommerceNewProducts list={_ecommerceNewProducts} />
        </Grid> */}

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Orders"
            percent={2.6}
            total={summary?.order}
            chart={{
              series: [],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Active Store"
            percent={-0.1}
            total={summary?.store}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Sales Profit"
            percent={0.6}
            total={summary?.sales}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <EcommerceSaleByGender
            title="Sale By Gender"
            total={2324}
            chart={{
              series: [
                { label: 'Mens', value: 44 },
                { label: 'Womens', value: 75 },
              ],
            }}
          />  
        </Grid> */}

        {/* <Grid xs={12} md={12} lg={12}>
          <EcommerceYearlySales
            title="Yearly Sales"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2024',
                  data: [
                    {
                      name: 'Total Income',
                      data: [],
                    },
                   
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Total Income',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'Total Expenses',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <EcommerceSalesOverview title="Sales Overview" data={_ecommerceSalesOverview} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceCurrentBalance
            title="Current Balance"
            currentBalance={187650}
            sentAmount={25500}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <EcommerceBestSalesman
            title="Best Salesman"
            tableData={_ecommerceBestSalesman}
            tableLabels={[
              { id: 'name', label: 'Seller' },
              { id: 'category', label: 'Product' },
              { id: 'country', label: 'Country',  align: 'center' },
              { id: 'totalAmount', label: 'Total', align: 'right' },
              { id: 'rank', label: 'Rank', align: 'right' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceLatestProducts title="Latest Products" list={_ecommerceLatestProducts} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
