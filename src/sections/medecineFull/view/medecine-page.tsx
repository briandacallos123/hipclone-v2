// @mui
'use client'

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
import { medecineData } from '../mock'
import MedecineTableRow from '@/sections/medecine/medecine-table-row';
import MedecineTableRowNew from '../medecine-table-row';
import MedecineFilteringHeader from '../medecine-filtering-header';
import MedecineTablePagination from '../medecine-table-pagination';
import { Box } from '@mui/material';

type MedecinePageProps = {
    data:[]
}

const MedecinePage = ({data}:MedecinePageProps) => {
    // console.log(data,'AWTS_________')
    const theme = useTheme();

  const { user } = useAuthContext()

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



      <Grid xs={12} md={2}>
        <MedecineFiltering heading="Type" onSelect={() => { }} data={[
          { id: 1, text: "Branded" },
          { id: 2, text: "Generic" },

        ]} />
         <MedecineFiltering heading="Service Type" onSelect={() => { }} data={[
          { id: 1, text: "Delivery" },
          { id: 2, text: "Pick Up" },

        ]} />
      </Grid>

      <Grid xs={12} md={10} >
        <Box sx={{
          mb:5
        }}>
          <MedecineFilteringHeader onSort={() => { }} sort="Best Selling" sortOptions={[
            {
              id: 1,
              label: "Best Selling",
              value: "best selling"
            },
            {
              id: 2,
              label: "Price Descending",
              value: "price descending"
            },
            {
              id: 3,
              label: "Price Ascending",
              value: "price ascending"
            },

          ]} />
        </Box>
        <MedecineTableRowNew
          data={data}
        />

      </Grid>
      <Grid md={12}>
        <MedecineTablePagination medecine={data} />
      </Grid>



    </Grid>
  </Container>
  )
}

export default MedecinePage