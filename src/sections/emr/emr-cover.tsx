import { useEffect, useState } from 'react';
import { capitalize } from 'lodash';
import { PDFViewer } from '@react-pdf/renderer';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
// types
import { useAuthContext } from 'src/auth/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fDate } from 'src/utils/format-time';
// theme
import { bgGradient } from 'src/theme/css';
// components
import { LogoFull } from 'src/components/logo';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';
import { useParams } from 'src/routes/hook';
import { useLazyQuery,useQuery } from '@apollo/client';
import { Prescriptions } from '@/libs/gqls/prescription';
import { get_note_soap } from '@/libs/gqls/notes/notesSoap';
import { get_all_emr_note_soap } from '@/libs/gqls/emr'; 
import EmrDetailsPDF from './emr-details-pdf';
//
import { useContextData } from './@view/emr-details-view';

// ----------------------------------------------------------------------

type Props = {
  data: any;
  loading: any;
};

export default function EmrCover({ data, loading }: Props) {

  const { id } = useParams();
  const {allData, setAllData, emrfetchCover, setemrfetchCover }: any = useContextData();
  const [soapData, setSoapData] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([]);
  
  const theme = useTheme();

  const upMd = useResponsive('up', 'md');
  const [item, setItem] = useState<any>([]);

  useEffect(() => {
    setItem(data);
  }, [data]);

  // const { firstName, lastName, email, avatarUrl, coverUrl } = data;

  const show = useBoolean();

  const { user } = useAuthContext();
  const fullName = `${item?.patientInfo?.FNAME || item?.fname} ${
    item?.patientInfo?.LNAME || item?.lname
  }`;

  // console.log(tableData, 'ItableDatatableData');
  // console.log(data, 'dataaaaa');
  // // console.log(data?.patientRelation?.S_ID, 'data?.patientRelation?.S_ID');
  // console.log(soapData, 'soapData');

  const carousel = useCarousel({
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    initialSlide: 0,
  });

    ////////////////////////////////////////////////////////////////////////////////////
    const containsLetters = (value: any) => /[a-zA-Z]/.test(value);
    const { data: prescriptionData,refetch:refetch_prescription }: any = useQuery(Prescriptions, {
      context: {
        requestTrackerId: 'Prescription_data[Prescription_data]',
      },
      fetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
      variables: {
        data: {
          skip: 0,
          take: 1,
          orderBy: 'date',
          orderDir: 'desc',
          uuid: id,
          isEmr: containsLetters(id) ? 2 : 1,
        },
      },
    });
  
    useEffect(() => {
      if (prescriptionData?.QueryAllPrescription?.Prescription_data) {
        const { data }: any = prescriptionData;
        setTableData(prescriptionData?.QueryAllPrescription?.Prescription_data);
      }
    }, [prescriptionData]);
  
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    const { data: getSoapFunc,refetch:refetch_notes }: any = useQuery(get_all_emr_note_soap, {
      context: {
        requestTrackerId: 'get_all_emr_note_soap[emr_note_soap_input_request]',
      },
      fetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
      variables: {
        data: {
          emr_id: Number(id) || null,
          patient_id: Number(data?.patientRelation?.S_ID) || null,
        },
      },
    });

    useEffect(() => {
      if (getSoapFunc?.get_all_emr_note_soap?.emr_note_soap_data?.[0]) {
        const { data }: any = getSoapFunc;
        setSoapData(getSoapFunc?.get_all_emr_note_soap?.emr_note_soap_data?.[0]);
      }
    }, [getSoapFunc]);


    useEffect(() => {
      if(emrfetchCover){
          refetch_notes().then((res:any)=>{
            setemrfetchCover(false)
          })
          refetch_prescription().then((res:any)=>{
            setemrfetchCover(false)
          })
        }
    }, [emrfetchCover]);
    ////////////////////////////////////////////////////////////////////////////////////


  const PROFILE_INFO = [
    {
      category: 'personal',
      data: [
        { label: 'Birthdate', value: fDate(item?.patientInfo?.BDAY) || '-' },
        { label: 'Age', value: item?.patientInfo?.AGE || item?.patientRelation?.AGE || '-' },
        {
          label: 'Gender',
          value:
            capitalize(
              item?.patientInfo?.SEX === 1 || item?.patientRelation?.SEX === 1 ? 'MALE' : 'Female'
            ) || '-',
        },
        {
          label: 'Blood type',
          value: item?.patientInfo?.BLOOD_TYPE || item?.patientRelation?.BLOOD_TYPE || '-',
        },
      ],
    },
    {
      category: 'contact',
      data: [
        {
          label: 'Address',
          value: item?.patientInfo?.HOME_ADD || item?.patientRelation?.HOME_ADD || '-',
        },
        {
          label: 'Phone number',
          value: item?.patientInfo?.CONTACT_NO || item?.patientRelation?.CONTACT_NO || '-',
        },
        { label: 'Email', value: item?.patientInfo?.EMAIL || item?.patientRelation?.EMAIL || '-' },
      ],
    },
    {
      category: 'employment',
      data: [
        { label: 'Occupation', value: item?.patientInfo?.OCCUPATION || '-' },
        { label: 'Employer', value: item?.patientInfo?.EMPLOYERSNAME || '-' },
        { label: 'Address', value: item?.patientInfo?.EMPLOYERSADDRESS || '-' },
        { label: 'Phone number', value: item?.patientInfo?.EMPLOYERSPHONENO || '-' },
      ],
    },
    {
      category: 'emergency',
      data: [
        { label: 'Name', value: item?.patientInfo?.EMERGENCYNAME || '-' },
        { label: 'Address', value: item?.patientInfo?.EMERGENCYADDRESS || '-' },
        { label: 'Phone number', value: item?.patientInfo?.EMERGENCYCONTACTNO || '-' },
        { label: 'Relationship', value: item?.patientInfo?.EMERGENCYRELATIONSHIP || '-' },
      ],
    },
    {
      category: 'physician',
      data: [
        { label: 'Referring', value: item?.patientInfo?.REFFERINGPHYSICIAN || '-' },
        { label: 'Primary', value: item?.patientInfo?.PRIMARYCAREPHYSICIAN || '-' },
        { label: 'Other', value: item?.patientInfo?.OTHERPHYSICIAN || '-' },
      ],
    },
  ];

  return (
    <>
      <Stack spacing={3}>
        <Card sx={{ height: { xs: 140, md: 180 } }}>
          <Box
            sx={{
              ...bgGradient({
                // color: alpha(theme.palette.primary.darker, 0.8),
                // imgUrl: user?.coverURL,
              }),
              background: 'url(/assets/background/banner-bg.png)',
              backgroundSize: 'cover',
              height: 1,
              color: 'common.white',
            }}
          >
            <Stack
              direction="row"
              sx={{
                left: 24,
                bottom: { md: 24 },
                zIndex: { md: 10 },
                pt: { xs: 4, md: 0 },
                position: 'absolute',
              }}
            >
              {item?.patientRelation?.userInfo[0]?.display_picture[0] ? (
                <Avatar
                  alt={item?.patientRelation?.FNAME}
                  src={
                    item?.patientRelation?.userInfo[0]?.display_picture[0].filename.split(
                      'public'
                    )[1]
                  }
                  sx={{
                    mx: 'auto',
                    width: { xs: 78, md: 128 },
                    height: { xs: 78, md: 128 },
                    border: `solid 2px ${theme.palette.common.white}`,
                  }}
                >
                  {item?.patientRelation?.FNAME.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar
                  alt={fullName}
                  sx={{
                    mx: 'auto',
                    width: { xs: 78, md: 128 },
                    height: { xs: 78, md: 128 },
                    border: `solid 2px ${theme.palette.common.white}`,
                  }}
                >
                  <Avatar sx={{ textTransform: 'capitalize' }}>{fullName[0]}</Avatar>
                </Avatar>
              )}
              {/* <Avatar
              alt={`${fullName}`}
              sx={{
                mx: 'auto',
                width: { xs: 78, md: 128 },
                height: { xs: 78, md: 128 },
                border: `solid 2px ${theme.palette.common.white}`,
              }}
            >
              {fullName.trim().charAt(0).toUpperCase()}
            </Avatar> */}
              {!loading ? (
                <ListItemText
                  sx={{
                    mt: { xs: 1.5, md: 4 },
                    ml: { xs: 1.5, md: 3 },
                  }}
                  primary={`${fullName}`}
                  // primary={fullName}
                  secondary={
                    <Box>
                      {Number(item?.link) !== 1 ? (
                        <Stack>
                          <Typography>
                            {item?.patientInfo?.EMAIL ||
                              item?.patientRelation?.EMAIL ||
                              item?.email}
                          </Typography>
                          <Typography>(Unlinked Account)</Typography>
                        </Stack>
                      ) : (
                        <Stack>
                          <Typography>
                            {item?.patientInfo?.EMAIL || item?.patientRelation?.EMAIL}
                          </Typography>
                          <Typography
                            variant="h6"
                            color="success.main"
                          >{`Linked from EMR (${item?.patientRelation?.FNAME} ${item?.patientRelation?.LNAME})`}</Typography>
                        </Stack>
                      )}
                    </Box>
                  }
                  primaryTypographyProps={{
                    typography: 'h4',
                  }}
                  secondaryTypographyProps={{
                    color: 'common.white',
                    component: 'span',
                    typography: 'body2',
                    sx: { opacity: 0.78 },
                  }}
                />
              ) : (
                <Stack
                  sx={{ mt: { xs: 1.5, md: 4 }, ml: { xs: 1.5, md: 3 } }}
                  direction="column"
                  spacing={2}
                >
                  <Skeleton width="300px" />
                  <Skeleton width="150px" />
                </Stack>
              )}
            </Stack>

            {item?.link === 1 && (
              <Button
                onClick={show.onToggle}
                size={upMd ? 'medium' : 'small'}
                sx={{
                  position: 'absolute',
                  ...(upMd && { bottom: 10, right: 10 }),
                  ...(!upMd && { top: 10, right: 10 }),
                }}
              >
                View More
              </Button>
            )}
          </Box>
        </Card>

        {show.value &&
          (upMd ? (
            <Box
              sx={{
                display: 'grid',
                columnGap: 3,
                rowGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
              }}
            >
              {PROFILE_INFO.map((info) => (
                <Card key={info.category} sx={{ p: 3 }}>
                  <InfoContainer info={info} />
                </Card>
              ))}
            </Box>
          ) : (
            <Card sx={{ px: 2, py: 3 }}>
              <CarouselArrows
                spacing={0.5}
                icon="solar:alt-arrow-right-bold"
                onNext={carousel.onNext}
                onPrev={carousel.onPrev}
                leftButtonProps={{ sx: { width: 30, height: 30 } }}
                rightButtonProps={{ sx: { width: 30, height: 30 } }}
                sx={{ position: 'absolute', top: 10, right: 10, zIndex: 9 }}
              />

              <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
                {PROFILE_INFO.map((info) => (
                  <Box key={info.category} sx={{ px: 1 }}>
                    <InfoContainer info={info} />
                  </Box>
                ))}
              </Carousel>
            </Card>
          ))}
      </Stack>

      <Dialog fullScreen open={show.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions sx={{ p: 1.5 }}>
            <Box sx={{ ml: 2, flex: 1 }}>
              <LogoFull disabledLink />
            </Box>

            <Button variant="outlined" onClick={show.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <EmrDetailsPDF
                item={item}
                allData={allData}
                soapData={soapData}
                prescription={tableData}
              />

              {/* {allData && <PatientDetailsPDF item={item} allData={allData} soapData={soapData} />} */}
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

type InfoContainerProps = {
  info: {
    category: string;
    data: { label: string; value: any }[];
  };
};

function InfoContainer({ info }: InfoContainerProps) {
  return (
    <>
      <Typography
        gutterBottom
        sx={{
          typography: 'subtitle2',
          textTransform: 'uppercase',
        }}
      >
        {`${info.category} information`}
      </Typography>

      <Stack sx={{ m: 0 }}>
        {info.data.map((item) => (
          <Typography
            key={item?.label}
            sx={{
              typography: 'subtitle2',
              '& > span': { typography: 'body2', color: 'text.disabled' },
            }}
          >
            {item.label}:&nbsp;
            <span>{item?.value || '-'}</span>
          </Typography>
        ))}
      </Stack>
    </>
  );
}
