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
import MedecineFiltering from '../medecine-table-filtering';
import {medecineData} from '../mock'
import MedecineTableRow from '@/sections/medecine/medecine-table-row';
import MedecineTableRowNew from '../medecine-table-row';
// ----------------------------------------------------------------------

export default function MedicineListView() {
  // const { user } = useMockedUser();

  const theme = useTheme();

  const {user} = useAuthContext()

  const settings = useSettingsContext();

  const userFullName = user?.middleName ? `${user?.firstName} ${user?.middleName} ${user?.lastName}` : `${user?.firstName} ${user?.lastName}`

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <EcommerceWelcome
            title={`Hi!  ${userFullName}`}
            description="Where should we deliver your medecines?"
            img={<MotivationIllustration />}
          />
        </Grid>

        {/* <Grid xs={12} md={4}>
          <EcommerceNewProducts list={_ecommerceNewProducts} />
        </Grid> */}

        <Grid xs={12} md={2}>
          <MedecineFiltering heading="Type" onSelect={()=>{}} data={[
            {id:1, text:"Branded"},
            {id:2,text:"Generic"},
            
            ]}/>
        </Grid>

        <Grid xs={12} md={10}>
          <MedecineTableRowNew
          data={medecineData}
          />
        
        </Grid>

        
{/* 
        <Grid xs={12} md={6} lg={8}>
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
              { id: 'country', label: 'Country', align: 'center' },
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
