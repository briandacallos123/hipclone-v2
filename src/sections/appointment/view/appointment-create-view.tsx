'use client';

import { useEffect, useState } from 'react';
// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
// _mock
// import { _doctorList } from 'src/_mock';
// components
import { useAuthContext } from 'src/auth/hooks';
import { useParams, useRouter } from 'src/routes/hook';
import { useSettingsContext } from 'src/components/settings';
// prisma
import { useLazyQuery } from '@apollo/client';
import { GET_HMO_BY_UUID } from '@/libs/gqls/hmo';
//
import { Button } from '@mui/material';
import { paths } from 'src/routes/paths';
import AppointmentBookingCover from '../appointment-book-coverBook';
import AppointmentBookCover from '../appointment-book-cover';
import AppointmentBookHmo from '../appointment-book-hmo';
import AppointmentBookFee from '../appointment-book-fee';
import AppointmentNewForm from '../appointment-new-form';

// ----------------------------------------------------------------------

export default function AppointmentCreateView() {
  const settings = useSettingsContext();
  const router = useRouter();

  const params = useParams();
  const [isLoading, setLoading] = useState(true);
  const { id } = params;
  const [hmoData, setHmoData] = useState<any>([]);

  const [getData, getDataResult] = useLazyQuery(GET_HMO_BY_UUID, {
    context: {
      requestTrackerId: 'employees[QueryHmoByUUID]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    setLoading(true);
    getData({
      variables: {
        data: {
          uuid: String(id),
        },
      },
    }).then(async (result: any) => {
      setLoading(false);
      const { data } = result;

      if (data) {
        const { QueryHmoByUUID } = data;
        setHmoData(QueryHmoByUUID);
      }
    });
  }, [getData, id]);

  // const currentItem = _doctorList.filter((item) => item.id === id)[0];
  const { user } = useAuthContext();

  const fullName = `${hmoData?.EMP_FNAME} ${hmoData?.EMP_MNAME || ''} ${hmoData?.EMP_LNAME}, ${
    hmoData?.EMP_TITLE
  }`;

  const specialization = `${hmoData?.SpecializationInfo?.name || hmoData?.SUBSPECIALTY || ''} `;
  console.log(user, 'user@@');
  useEffect(() => {
    if (user?.role === 'doctor') {
      router.push(paths.dashboard.root);
    }
  }, [user]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Button
            variant="contained"
            onClick={() => {
              router.push(paths?.dashboard?.appointment?.find);
            }}
            sx={{ m: 1 }}
          >
            Back
          </Button>
          <AppointmentBookCover
            name={fullName}
            job={specialization}
            email={hmoData?.EMP_EMAIL}
            // avatarUrl={currentItem?.doctor.avatarUrl}
            coverUrl={user?.coverURL}
            hmoData={hmoData}
            isLoading={isLoading}
            setLoading={setLoading}
          />
        </Grid>

        <Grid xs={12} md={8}>
          <Stack
            direction="column"
            display="flex"
            spacing={2}
            // justifyContent="center"
            // alignItems="center"
          >
            <AppointmentBookHmo data={hmoData?.HMO} />
            <AppointmentBookFee data={hmoData} />
            <AppointmentNewForm
              currentItem={hmoData}
              hmoData={hmoData?.HMO}
              refetch={getDataResult}
            />
          </Stack>
        </Grid>

        {/* <Grid xs={12} md={6}>
          <AppointmentBookFee data={hmoData} />
        </Grid>

        <Grid xs={12}>
          <AppointmentNewForm currentItem={hmoData} hmoData={hmoData?.HMO} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
