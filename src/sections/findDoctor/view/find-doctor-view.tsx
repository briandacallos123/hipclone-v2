'use client';

import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useTheme, styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import { IconButtonProps } from '@mui/material';
import IconButton from '@mui/material/IconButton';
// _mock
import { _doctorList } from 'src/_mock';
// components
import { useResponsive } from 'src/hooks/use-responsive';
import { useAuthContext } from 'src/auth/hooks';
import { useParams, usePathname, useSearchParams } from 'src/routes/hook';
import { useSettingsContext } from 'src/components/settings';
// prisma
import { paths } from 'src/routes/paths';
import { useLazyQuery } from '@apollo/client';
import { GET_HMO_BY_UUID } from '@/libs/gqls/hmo';
//
import { LoginButton, SignupButton, Proceed, LoginUser } from '@/layouts/_common';
import AppointmentNewScheduleCard from '@/sections/appointment/appointment-new-schedule-card';
import Scrollbar from '@/components/scrollbar';
import Iconify from 'src/components/iconify';

import { PATH_AFTER_LOGIN } from 'src/config-global';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import AppointmentBookFee from '../../appointment/appointment-book-fee';
import AppointmentBookCover from '../../appointment/appointment-book-cover';
import AppointmentBookHmo from '../../appointment/appointment-book-hmo';

// ----------------------------------------------------------------------

const StyledToggleButton = styled((props) => (
  <IconButton disableRipple {...props} />
))<IconButtonProps>(({ theme }) => ({
  right: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  top: theme.spacing(13),
  borderRadius: `12px 0 0 12px`,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.customShadows.primary,
  '&:hover': {
    backgroundColor: theme.palette.primary.darker,
  },
}));
const NAV_WIDTH = 340;

export default function FindDoctorView() {
  const upMd = useResponsive('up', 'md');

  const [collapse, setCollapse] = useState<boolean>();
  useEffect(() => {
    setCollapse(JSON.parse(sessionStorage.getItem('videoBool')));
  }, []);

  const [collapseDesktop, setCollapseDesktop] = useState<boolean>(!collapse);

  useEffect(() => {
    const sideBar = JSON.parse(sessionStorage.getItem('videoBool'));
    // console.log(sideBar, '///////////');
    setCollapseDesktop(sideBar);
  }, [setCollapseDesktop]);

  console.log(JSON.parse(sessionStorage.getItem('videoBool')), 'session');

  const theme = useTheme();
  const lgUp = useResponsive('up', 'lg');

  // const handleToggleNav = () => {
  //   setCollapseDesktop(!collapseDesktop);
  // };
  const handleToggleNav = () => {
    setCollapseDesktop(!collapseDesktop);
  };

  useEffect(() => {
    if (collapseDesktop === false) {
      sessionStorage.setItem('videoBool', JSON.stringify(false));
    }
    if (collapseDesktop === true) {
      sessionStorage.setItem('videoBool', JSON.stringify(true));
    }
  }, [collapseDesktop]);

  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const params = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { id } = params;
  const [hmoData, setHmoData] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const path = usePathname();
  const searchParams: any = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const onClose = () => {
    setOpenDialog(false);
  };

  const [getData] = useLazyQuery(GET_HMO_BY_UUID, {
    context: {
      requestTrackerId: 'employees[QueryHmoByUUID]',
    },
    notifyOnNetworkStatusChange: true,
  });

  // useEffect(()=>{

  // },[user])

  useEffect(() => {
    if (user) {
      if (user?.role !== 'doctor' && isLoggedIn) {
        window.location.href =
          returnTo ||
          (id && path === `/find-doctor/${id}/`
            ? (() => {
                if (user?.role !== 'doctor') {
                  return paths.dashboard.appointment.book(id);
                }
              })()
            : PATH_AFTER_LOGIN);
      }
      if (user?.role === 'doctor') {
        setOpenDialog(true);
      }
    }
  }, []);

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

  const fullName = `${hmoData?.EMP_FNAME} ${hmoData?.EMP_MNAME || ''} ${hmoData?.EMP_LNAME}, ${
    hmoData?.EMP_TITLE
  }`;

  const specialization = `${hmoData?.SpecializationInfo?.name}, ${hmoData?.SUBSPECIALTY}`;
  const [isProfile, setIsProfile] = useState(true);

  const renderBtn = (
    <IconButton
      onClick={handleToggleNav}
      sx={{
        top: 12,
        right: 0,
        zIndex: 9,
        width: 32,
        height: 32,
        borderRight: 0,
        position: 'absolute',
        borderRadius: `12px 0 0 12px`,
        boxShadow: theme.customShadows.z8,
        bgcolor: theme.palette.background.paper,
        border: `solid 1px ${theme.palette.divider}`,
        '&:hover': {
          bgcolor: theme.palette.background.neutral,
        },
        ...(lgUp && {
          ...(!collapseDesktop && {
            right: NAV_WIDTH,
          }),
        }),
      }}
    >
      <Iconify width={16} icon={'mingcute:video-fill'} />
    </IconButton>
  );

  const renderVideo = (
    <iframe
      width="346"
      height="246"
      src="https://www.youtube.com/embed/qWOqKFketLY?list=UUZPW6HDPrmAbXwyP6vapZiQ"
      title="HIP - How to book an appointment with your doctor"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Grid container spacing={5}>
        <Grid xs={12} md={3}>
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

        <Grid xs={12} md={9}>
          <Stack direction="row" sx={{ m: 0 }}>
            <Stack direction="column" sx={{ width: '100%', overflow: 'hidden' }}>
              {/* {!lgUp && (
                <StyledToggleButton onClick={handleToggleNav}>
                  <Iconify width={16} icon="mingcute:video-fill" />
                </StyledToggleButton>
              )} */}
              <Stack
                direction="column"
                display="flex"
                spacing={2}
                // justifyContent="center"
                // alignItems="center"
              >
                <AppointmentBookHmo
                  isLoading={isLoading}
                  setLoading={setLoading}
                  data={hmoData?.HMO}
                />
               {hmoData?.isFeeShow !== 0 || hmoData?.isAddReqFeeShow !== 0 &&  <AppointmentBookFee isLoading={isLoading} setLoading={setLoading} data={hmoData} />}

                <Card>
                  <CardHeader title="Hospitals" />
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {hmoData?.clinicInfo?.map((item: any) => (
                      <div key={item.id} style={{ flex: '50%', padding: '8px' }}>
                        <AppointmentNewScheduleCard data={item} isProfile={isProfile} />
                      </div>
                    ))}
                  </div>
                </Card>
              </Stack>
            </Stack>
            {/* {lgUp ? (
              <Box sx={{ position: 'relative' }}>
                {renderBtn}
                <Stack
                  sx={{
                    height: 1,
                    flexShrink: 0,
                    width: NAV_WIDTH,
                    borderLeft: `solid 1px ${theme.palette.divider}`,
                    transition: theme.transitions.create(['width'], {
                      duration: theme.transitions.duration.shorter,
                    }),
                    ...(collapseDesktop && {
                      width: 1,
                    }),
                  }}
                >
                  {!collapseDesktop && <Box>{renderVideo}</Box>}
                </Stack>
              </Box>
            ) : (
              <Drawer
                open={collapseDesktop}
                anchor="right"
                onClose={handleToggleNav}
                ModalProps={{ keepMounted: true }}
                PaperProps={{
                  sx: {
                    pb: 1,
                    width: NAV_WIDTH,
                  },
                }}
              >
                {renderVideo}
              </Drawer>
            )} */}
          </Stack>
        </Grid>

        {/* <Grid xs={12} md={6}>
          <AppointmentBookFee data={hmoData} />
        </Grid> */}

        <Grid xs={12}>
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            {!user || user?.role === 'doctor' ? (
              <>
                <LoginButton isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} id={id} />
                <SignupButton />
              </>
            ) : (
              <Proceed id={id} />
            )}
          </Stack>
        </Grid>
      </Grid>

      <Dialog
        fullWidth
        maxWidth={false}
        open={openDialog}
        onClose={onClose}
        PaperProps={{
          sx: { maxWidth: 600, p: 3 },
        }}
      >
        {/* {renderHead} */}
        <DialogTitle>Caution</DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          You're trying to view or make an appointment as a doctor, we only allow patient on this
          section.
        </DialogContent>
        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
          <Button variant="contained" color="primary" sx={{ mr: 1 }}>
            Back
          </Button>
          <LoginUser />
        </Stack>
      </Dialog>
    </Container>
  );
}
