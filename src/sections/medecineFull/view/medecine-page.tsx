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
import { useCallback, useState } from 'react';
import MedecineFilteringHeaderTextField from '../medecine-filtering-header-textfield';

type MedecinePageProps = {
    data:[]
}

const MedecinePage = ({data}:MedecinePageProps) => {
    const [alignment, setAlignment] = useState<string | null>(null);  

    console.log(alignment,'HAYWS_________________')
    const theme = useTheme();

  const { user } = useAuthContext()

  const settings = useSettingsContext();

  const userFullName = user?.middleName ? `${user?.firstName} ${user?.middleName} ${user?.lastName}` : `${user?.firstName} ${user?.lastName}`
  
  const handleGrid = useCallback(()=>{
    setAlignment('grid')
  },[])

  const handleRow = useCallback(()=>{
    setAlignment('row')
  },[])

  
  return (
    <Container  maxWidth={settings.themeStretch ? false : 'xl'}>
    <Grid container spacing={3}>
      <Grid xs={12} md={12}>
        <EcommerceWelcome
          title={`Hi!  ${userFullName}`}
          description="Merchants near in"
          location="Navotas, Metro Manila"
          img={<MotivationIllustration />}
        />
      </Grid>



      <Grid xs={12} md={12}>
       
        <MedecineTableRowNew
          alignment={alignment}
          data={data}
        />

      </Grid>
    


    </Grid>
  </Container>
  )
}

export default MedecinePage