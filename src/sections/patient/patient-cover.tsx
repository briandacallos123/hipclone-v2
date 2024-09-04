import { useCallback, useEffect, useState } from 'react';
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
import IconButton from '@mui/material/IconButton';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// types
import { NexusGenInputs } from 'generated/nexus-typegen';
import { useAuthContext } from 'src/auth/hooks';
import { IPatient } from 'src/types/general';
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
import { GET_QUEUES, MUTATE_QUEUES } from '@/libs/gqls/drappts';
import { get_note_soap } from '@/libs/gqls/notes/notesSoap';
import { get_all_emr_note_soap } from '@/libs/gqls/emr';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useSearch } from '@/auth/context/Search';
import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
//

import { ConfirmDialog } from 'src/components/custom-dialog';
import { Prescriptions } from '@/libs/gqls/prescription';
import Iconify from '@/components/iconify';
import { useParams, useRouter } from 'src/routes/hook';
// eslint-disable-next-line import/no-cycle
import { useContextData } from './@view/patient-details-view';
import PatientDetailsPDF from './patient-details-pdf';
import { useMainContextData } from '../../layouts/dashboard/main';
import axios from 'axios';
// ----------------------------------------------------------------------

type Props = {
  data: any;
  loading: boolean;
};

export default function PatientCover({ data, loading }: Props) {
  const theme = useTheme();
  const { allData, setAllData, fetchCover, setfetchCover }: any = useContextData();
  const { openTelemed, setOpenTelemed }: any = useMainContextData();
  const [tableData, setTableData] = useState<any>([]);
  const { patientDone, setPatientDone }: any = useSearch();
  const [soapData, setSoapData] = useState<any>([]);
  const upMd = useResponsive('up', 'md');
  const [item, setItem] = useState<any>([]);
  const { id } = useParams();
  const [isQueue, setIsQueue] = useState(false);
  const [apptID, setApptId] = useState<string>();

  useEffect(() => setItem(data), [data]);

  console.log(allData,'UUID SA LABAS_________________________________________________________________________')
  const apptData = JSON.parse(sessionStorage.getItem('patientView'));
  // console.log('block', block.data);
  // console.log(
  //   'block',
  //   apptData.data.filter((i) => i?.patientInfo?.UUID === data?.patientInfo?.userInfo?.uuid)
  // );
  const appointmentID = apptData?.data.filter(
    (i) => i?.patientInfo?.UUID === data?.patientInfo?.userInfo?.uuid
  );
  // console.log('data', data.patientInfo.userInfo.uuid);
  useEffect(() => {
    const isInQueue = JSON.parse(sessionStorage.getItem('patientView'));

    if (isInQueue && item) {
      const foundData = isInQueue?.data?.find(
        (i: any) => i?.patientInfo?.EMAIL === item?.patientInfo?.EMAIL
      );
      // console.log(foundData, 'HUHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');

      if (foundData) {
        setIsQueue(true);

        const stringifiedNumber = foundData.id.toString();
        const base64EncodedString = btoa(stringifiedNumber);
        setApptId(base64EncodedString);
      }
    }
  }, [item]);
  // console.log(apptID);
  // const { firstName, lastName, email, avatarUrl, coverUrl } = data;
  const router = useRouter();
  const show = useBoolean();
  const confirm = useBoolean();
  const smsConfirm = useBoolean();
  const sent = useBoolean();

  const { user } = useAuthContext();
  const fullName = `${item?.patientInfo?.FNAME || ''} ${item?.patientInfo?.LNAME || ''}`;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const carousel = useCarousel({
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    initialSlide: 0,
  });

  const containsLetters = (value: any) => /[a-zA-Z]/.test(value);
  const { data: prescriptionData, refetch: refetch_prescription }: any = useQuery(Prescriptions, {
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
        isEmr: containsLetters(String(item?.patientInfo?.userInfo?.uuid)) ? 2 : 1,
        uuid: String(item?.patientInfo?.userInfo?.uuid),
      },
    },
  });

  useEffect(() => {
    if (prescriptionData?.QueryAllPrescription?.Prescription_data) {
      const { data }: any = prescriptionData;
      setTableData(prescriptionData?.QueryAllPrescription?.Prescription_data);
    }
  }, [prescriptionData]);

  // useEffect(() => {
  //   setSoapRefetch(refetch_notes);
  // }, [refetch_notes]);

  const [createEmr] = useMutation(MUTATE_QUEUES, {
    context: {
      requestTrackerId: 'Prescription_Mutation_Type[MutationPrescription]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [targetItem, setTargetItem]: any = useState(null);
  const [snackKey, setSnackKey]: any = useState(null);
  const [hideDone, setHideDone]: any = useState(false);
  const [checkCurrent, setCheckCurrent]: any = useState(false);
  const [patientViewData, setPatientViewData]: any = useState([]);
  const [hideNext, setHideNext] = useState(false);
  // make data done
  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['UpdateDoctor']) => {
      const data: NexusGenInputs['UpdateDoctor'] = {
        id: model.id,
        type: model.type,
      };
      createEmr({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          const { data } = res;

          closeSnackbar(snackKey);
          setSnackKey(null);

          let myData = JSON.parse(sessionStorage.getItem('patientView'));

          let nextItemIndex = myData?.data?.findIndex((i: any) => {
            return i?.patientInfo?.EMAIL === targetItem?.patientInfo?.EMAIL;
          });

          sessionStorage.setItem('hasChanges', JSON.stringify(true));

          router.push(
            paths.dashboard.patient.view(myData?.data[nextItemIndex + 1]?.patientInfo?.UUID)
          );

          if (nextItemIndex + 1 !== myData?.data?.length) {
            enqueueSnackbar('Updated Successfully!');

            // console.log(
            //   myData?.data[nextItemIndex + 1]?.patientInfo?.userInfo[0]?.display_picture[0],
            //   'ANG TAGALLLL'
            // );
            const newItem = {
              ...myData?.data[nextItemIndex + 1],
            };
            newItem.patientInfo.userInfo.display_picture[0] =
              myData?.data[nextItemIndex + 1]?.patientInfo?.userInfo?.display_picture?.[0];

            sessionStorage.setItem('nextItem', JSON.stringify(newItem));
            router.push(
              paths.dashboard.patient.view(myData?.data[nextItemIndex + 1]?.patientInfo?.UUID)
            );
          } else {
            if (myData?.data?.length === 1) {
              enqueueSnackbar(`You've reached the last patient on queue.`);
              router.push(paths.dashboard.queue(JSON.parse(sessionStorage.getItem('queueId'))));
            } else {
              router.push(paths.dashboard.patient.view(patientViewData[0]?.patientInfo?.UUID));
              // sessionStorage.setItem('isBackToFirst', JSON.stringify(true));
            }
          }

          let newData = {
            data: myData?.data?.filter((i: any) => Number(i?.id) !== Number(targetItem?.id)),
          };

          sessionStorage.setItem('patientView', JSON.stringify(newData));
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          // console.log(error, 'ERRORRR@@@');
          enqueueSnackbar(`Something went wrong ${error}`, { variant: 'error' });
          // runCatch();
        });
    },
    [snackKey]
  );

  useEffect(() => {
    const nextItemSession = JSON.parse(sessionStorage.getItem('nextItem'));
    // console.log(nextItemSession, 'SESSION@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    if (nextItemSession) {
      setTargetItem(nextItemSession);
    }
  }, [sessionStorage.getItem('nextItem')]);

  const [isLast, setLast] = useState(null);
  const [nextItem, setNextItem]: any = useState(null);

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          id: Number(targetItem?.id),
          type: 1,
        });
        //  setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const handleDone = useCallback(() => {
    const snackbarKey: any = enqueueSnackbar('Saving Data...', {
      variant: 'info',
      key: 'savingEducation',
      persist: true, // Do not auto-hide
    });
    setSnackKey(snackbarKey);
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////
  const { data: getSoapFunc, refetch: refetch_notes }: any = useQuery(get_all_emr_note_soap, {
    context: {
      requestTrackerId: 'get_all_emr_note_soap[emr_note_soap_input_request]',
    },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      data: {
        emr_id: Number(data?.patientInfo?.emr_patient?.[0]?.id) || null,
        patient_id: Number(data?.patientInfo?.S_ID) || null,
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
    if (fetchCover) {
      refetch_notes().then((res: any) => {
        setfetchCover(false);
      });
      refetch_prescription().then((res: any) => {
        setfetchCover(false);
      });
    }
  }, [fetchCover]);
  ////////////////////////////////////////////////////////////////////////////////////

  const PROFILE_INFO = [
    {
      category: 'personal',
      data: [
        { label: 'Birthdate', value: fDate(item?.patientInfo?.BDAY) || '-' },
        { label: 'Age', value: item?.patientInfo?.AGE || '-' },
        {
          label: 'Gender',
          value: capitalize(item?.patientInfo?.SEX === 1 ? 'MALE' : 'Female') || '-',
        },
        { label: 'Blood type', value: item?.patientInfo?.BLOOD_TYPE || '-' },
      ],
    },
    {
      category: 'contact',
      data: [
        { label: 'Address', value: item?.patientInfo?.HOME_ADD || '-' },
        { label: 'Phone number', value: item?.patientInfo?.CONTACT_NO || '-' },
        { label: 'Email', value: item?.patientInfo?.EMAIL || '-' },
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

  const isNext = () => {
    let myIndex: any;
    let goFirst: any;
    let hideBtn: any;

    if (patientViewData?.length > 1) {
      if (
        item?.patientInfo?.EMAIL ===
        patientViewData[patientViewData?.length - 1]?.patientInfo?.EMAIL
      ) {
        goFirst = true;
      } else {
        let found = false;

        myIndex = patientViewData?.findIndex((i: any) => {
          return i?.patientInfo?.EMAIL === item?.patientInfo?.EMAIL;
        });
      }
    } else {
      hideBtn = 'hide';
    }
    return hideBtn || goFirst || Number(myIndex + 1);
  };

  useEffect(() => {
    if (patientViewData?.length && item) {
      if (patientViewData?.length === 1) {
        setHideNext(true);
      }
      // console.log(
      //   'MERONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN',
      //   patientViewData
      // );
      const foundItem = patientViewData?.find(
        (i) => i?.patientInfo?.EMAIL === item?.patientInfo?.EMAIL
      );

      // console.log(foundItem, 'FOUND ITEM@@@@@@@@@@@@@@@');
      if (foundItem) {
        setTargetItem(foundItem);
        const res = isNext();
        setNextItem(res);
      }
    }
  }, [patientViewData, item]);

  // useEffect(() => {
  //   if (checkCurrent) {
  //     let myData = JSON.parse(sessionStorage.getItem('patientView'));
  //     let dTarget = myData?.data?.find((i: any) => Number(i?.id) === Number(targetItem?.id));

  //     if (dTarget === undefined || dTarget === 'undefined' || !dTarget) {
  //       setHideDone(true);
  //     }
  //   }
  // }, [JSON.parse(sessionStorage.getItem('patientView'))]);
  useEffect(() => {
    var myData = JSON.parse(sessionStorage.getItem('patientView'));
    // getting first item
    // var isFirst = JSON.parse(sessionStorage.getItem('isBackToFirst'));
    // console.log(
    //   myData,
    //   'myDatamyDatamyDatamyDatamyDatamyDatamyDatamyDatamyDatamyDatamyDatamyDatamyData'
    // );
    if (myData?.data) {
      setPatientViewData(myData?.data);
    }
    // let ewan = JSON?.parse(sessionStorage?.getItem('nextItem'));

    // if (isFirst) {
    //   setItem(myData?.data[0]);
    // }
  }, [item]);

  const linkData = process.env.NEXT_PUBLIC_DOMAIN;
  const [copy, setCopy] = useState('Copy Link');
  const handleCopyClick = async () => {
    const linkToCopy = `https://natrapharm.hips-md.com/go/?i=${apptID}`;

    try {
      await navigator.clipboard.writeText(linkToCopy);
      // console.log('Link copied to clipboard:', linkToCopy);
      setCopy('Link Copied');
      setTimeout(() => {
        setCopy('Copy Link');
      }, 3000);
    } catch (err) {
      console.error('Unable to copy link to clipboard', err);
    }
  };

  const [time, setTime] = useState(5);
  const handleChangeTime = (event: any) => {
    setTime(event.target.value);
  };

  // const handleSent = useCallback(async () => {
  //   sent.onTrue();
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     await sent.onFalse();
  //     await smsConfirm.onFalse();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [sent, smsConfirm]);

  // console.log('ppointmentID.id[0]}', appointmentID[0].id);
  const handleSent = useCallback(async () => {
    sent.onTrue();
    try {
      const response = await fetch(`/api/sendSMS/?time=${time}&apptID=${appointmentID[0].id}`);
      if (response.ok) {
        await setTimeout(() => {
          sent.onFalse();
          smsConfirm.onFalse();
        }, 2000);
      } else {
        console.error('Failed to send SMS:', response.statusText);
      }
    } catch (error) {
      console.error('Error occurred while sending SMS:', error.message);
    }
  }, [appointmentID, sent, smsConfirm, time]);

  const handleOpenLink = useCallback(async() => {
    const UUID = localStorage?.getItem('apptUUID');
    // console.log(uuid,'UUID______________________________________________________________________')
    const payload:any = {
      agentName: user?.displayName,
      visitorName: `${item?.patientInfo?.FNAME} ${item?.patientInfo?.LNAME}`,
      datetime: "2024-08-28T11:04:00.000Z",
      roomId: UUID,
    };
  
    try {
      const response = await axios({
        method: 'options',
        url: 'https://connect3.hips-md.com/api/index.php',
        data: {
          ...payload
        },
        headers: {
          'Content-Type': 'application/json'
        },
      })

      const {agenturl, visitorurl} = response?.data
      
      if(response?.data){
        window.open(agenturl,'_blank');
      }
      
      
      // const response = await axios.options('https://connect3.hips-md.com/api/index.php',payload)
      // const response = await fetch('https://connect3.hips-md.com/api/index.php', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(payload)
      // });

      // const response = await fetch('https://connect3.hips-md.com/api/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(payload)
      // });

    

    }catch(Err){
      console.log(Err);
    }
    // const link = `https://connect2.hips-md.com/routes.php?short=f38gdxnktx`;
    // Open the link in a new tab
    // const windowFeatures = 'width=500,height=500';

    // Open the link in a new window
    // if (upMd) {
    //   window.open(link, 'Telemed', windowFeatures);
    // } else {
    //   window.open(link, 'Telemed');
    // }
  },[id])

  // console.log('openTelemed', openTelemed);
  const handleSetTelemed = () => {
    setOpenTelemed(true);
  };

  const currentDay = new Date();
  // const DayCondition = currentDay != currentDay;

  return (
    <>
      <Stack spacing={{ md: 3, xs: 0 }}>
        <Card sx={{ height: { xs: 145, md: 180 } }}>
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
                bottom: { md: 24, xs: 45 },
                zIndex: { md: 10 },
                position: 'absolute',
              }}
            >
              {item && item?.patientInfo?.userInfo?.display_picture?.[0] ? (
                <Avatar
                  alt={item?.patientInfo?.FNAME}
                  src={
                    item?.patientInfo?.userInfo?.display_picture?.[0]?.filename.split('public')[1]
                  }
                  sx={{
                    mx: 'auto',
                    width: { xs: 58, md: 128 },
                    height: { xs: 58, md: 128 },
                    border: `solid 2px ${theme.palette.common.white}`,
                  }}
                >
                  {item?.patientInfo?.FNAME.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar
                  alt={item?.patientInfo?.FNAME}
                  sx={{
                    mx: 'auto',
                    width: { xs: 58, md: 128 },
                    height: { xs: 58, md: 128 },
                    border: `solid 2px ${theme.palette.common.white}`,
                  }}
                >
                  {item?.patientInfo?.FNAME.charAt(0).toUpperCase()}
                </Avatar>
              )}

              {/* <Avatar
                alt={fullName}
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
                  primary={fullName}
                  secondary={item?.patientInfo?.EMAIL}
                  primaryTypographyProps={{
                    typography: upMd ? 'h4' : 'subtitle1',
                  }}
                  secondaryTypographyProps={{
                    color: 'common.white',
                    component: 'span',
                    typography: upMd ? 'body1' : 'caption',
                    sx: { opacity: 0.78 },
                  }}
                />
              ) : (
                <Stack
                  spacing={1}
                  sx={{
                    mt: { xs: 1.5, md: 4 },
                    ml: { xs: 1.5, md: 3 },
                  }}
                >
                  <Skeleton variant="text" width={upMd ? 300 : 150} sx={{ typography: 'h4' }} />
                  <Skeleton variant="text" width={upMd ? 150 : 100} sx={{ typography: 'body1' }} />
                </Stack>
              )}
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: 'absolute',
                ...(upMd && { top: 10, right: 10 }),
                ...(!upMd && { bottom: 10, right: 10 }),
              }}
            >
              {!hideNext &&
                isQueue &&
                (() => {
                  const myData = JSON.parse(sessionStorage.getItem('patientView'));
                  return targetItem?.patientInfo?.EMAIL !== myData?.data[0]?.patientInfo?.EMAIL;
                })() && (
                  <Button
                    startIcon={<Iconify icon="solar:arrow-left-outline" />}
                    size={upMd ? 'medium' : 'small'}
                    onClick={() => {
                      router.push(
                        paths.dashboard.patient.view(
                          patientViewData[
                            (() => {
                              let index: any;

                              const myData = JSON.parse(sessionStorage.getItem('patientView'));
                              if (
                                targetItem?.patientInfo?.EMAIL !==
                                myData?.data[0]?.patientInfo?.EMAIL
                              ) {
                                let currentIndex = myData?.data?.findIndex(
                                  (i: any) =>
                                    i?.patientInfo?.EMAIL === targetItem?.patientInfo?.EMAIL
                                );
                                index = currentIndex - 1;
                              }

                              return index;
                            })()
                          ]?.patientInfo?.UUID
                          // patientViewData[`${nextItem === true ? 0 : nextItem}`]?.patientInfo?.UUID
                        )
                      );
                    }}
                  >
                    Previous
                  </Button>
                )}

              {isQueue && (
                <Button
                  startIcon={<Iconify icon="solar:arrow-left-outline" />}
                  size={upMd ? 'medium' : 'small'}
                  onClick={() => {
                    sessionStorage.setItem('isQueue', JSON.stringify(true));
                    router.push(
                      paths.dashboard.queue(JSON.parse(sessionStorage.getItem('queueId')))
                    );
                  }}
                >
                  Back To Queue List
                </Button>
              )}

              {!hideNext &&
                isQueue &&
                (() => {
                  const myData = JSON.parse(sessionStorage.getItem('patientView'));
                  return (
                    targetItem?.patientInfo?.EMAIL !==
                    myData?.data[myData?.data?.length - 1]?.patientInfo?.EMAIL
                  );
                })() && (
                  <Button
                    startIcon={<Iconify icon="solar:arrow-right-outline" />}
                    size={upMd ? 'medium' : 'small'}
                    onClick={() => {
                      router.push(
                        paths.dashboard.patient.view(
                          patientViewData[
                            (() => {
                              let index: any;

                              const myData = JSON.parse(sessionStorage.getItem('patientView'));
                              if (
                                targetItem?.patientInfo?.EMAIL !==
                                myData?.data[myData?.data?.length - 1]?.patientInfo?.EMAIL
                              ) {
                                let currentIndex = myData?.data?.findIndex(
                                  (i: any) =>
                                    i?.patientInfo?.EMAIL === targetItem?.patientInfo?.EMAIL
                                );
                                index = currentIndex + 1;
                              }

                              return index;
                            })()
                          ]?.patientInfo?.UUID
                        )
                      );
                    }}
                  >
                    Next
                  </Button>
                )}
            </Stack>

            {isQueue && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  position: 'absolute',
                  ...(upMd && { bottom: 10, right: 70 }),
                  ...(!upMd && { top: 10, right: 25 }),
                }}
              >
                {upMd ? (
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="fa-solid:sms" />}
                    size={upMd ? 'medium' : 'small'}
                    onClick={() => {
                      smsConfirm.onTrue();
                    }}
                    sx={{ bgcolor: 'primary.dark' }}
                  >
                    Send SMS
                  </Button>
                ) : (
                  <IconButton
                    size="small"
                    sx={{ color: 'white' }}
                    onClick={() => {
                      smsConfirm.onTrue();
                    }}
                  >
                    <Iconify icon="fa-solid:sms" />
                  </IconButton>
                )}
                {upMd ? (
                  <Button
                    sx={{ bgcolor: 'primary.dark' }}
                    variant="contained"
                    startIcon={<Iconify icon="material-symbols:video-chat" />}
                    size={upMd ? 'medium' : 'small'}
                    onClick={() => {
                      handleOpenLink();
                    }}
                  >
                    Start Telemedicine
                  </Button>
                ) : (
                  <IconButton
                    size="small"
                    sx={{ color: 'white' }}
                    onClick={() => {
                      handleOpenLink();
                      // handleSetTelemed();
                    }}
                  >
                    <Iconify icon="material-symbols:video-chat" />
                  </IconButton>
                )}
                {isQueue && (
                  <Button
                    startIcon={<Iconify icon="solar:check-circle-outline" />}
                    size={upMd ? 'medium' : 'small'}
                    onClick={() => {
                      confirm.onTrue();
                    }}
                    // sx={{
                    //   position: 'absolute',
                    //   ...(upMd && { bottom: 10, right: 100 }),
                    //   ...(!upMd && { top: 10, right: 25 }),
                    // }}
                  >
                    Done
                  </Button>
                )}
                <Button
                  onClick={show.onToggle}
                  size={upMd ? 'medium' : 'small'}
                  // sx={{
                  //   position: 'absolute',
                  //   ...(upMd && { bottom: 10, right: 10 }),
                  //   ...(!upMd && { top: 10, right: 10 }),
                  // }}
                >
                  View More
                  {/* {show.value ? 'View Less' : 'View More'} */}
                </Button>
              </Stack>
            )}

            {!isQueue && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  position: 'absolute',
                  ...(upMd && { bottom: 10, right: 70 }),
                  ...(!upMd && { top: 10, right: 25 }),
                }}
              >
                <Button
                  onClick={show.onToggle}
                  size={upMd ? 'medium' : 'small'}
                  // sx={{
                  //   position: 'absolute',
                  //   ...(upMd && { bottom: 10, right: 10 }),
                  //   ...(!upMd && { top: 10, right: 10 }),
                  // }}
                >
                  View More
                  {/* {show.value ? 'View Less' : 'View More'} */}
                </Button>
              </Stack>
            )}

            {/* <Stack direction="column" justifyContent="center">
              <Stack direction="row" alignItems="center">
               
              </Stack>
             
            </Stack> */}
          </Box>
        </Card>

        {/* {show.value &&
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
        ))} */}
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
              {allData && (
                <PatientDetailsPDF
                  item={item}
                  allData={allData}
                  soapData={soapData}
                  prescription={tableData}
                />
              )}
              {/* {allData && <PatientDetailsPDF item={item} allData={allData} soapData={soapData} />} */}
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>

      {/* delete dialog */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Done"
        content={<>Are you sure you want to mark this as done?</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDone(targetItem);
              confirm.onFalse();
            }}
          >
            Done
          </Button>
        }
      />

      {/* sms dialog */}
      <ConfirmDialog
        open={smsConfirm.value}
        onClose={smsConfirm.onFalse}
        title="Notify Patient for Telemedicine in"
        content={
          <Box>
            <Typography variant="body1">SMS Message will be sent to Patient : </Typography>
            <Typography sx={{ py: 2 }} variant="body2">
              {`Telemed w/ Dr. ${item.clinicInfo?.doctorInfo?.EMP_FULLNAME} - Test Account starts in ${time}mins. Log in to HIP or click
              link:https://natrapharm.hips-md.com/go/?i=${apptID}`}
            </Typography>
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={() => handleCopyClick()}
            >
              {copy}
            </Button>
            <Select
              sx={{ mx: 2 }}
              value={time}
              size="small"
              label="Age"
              onChange={handleChangeTime}
            >
              <MenuItem value={5}>5 mins</MenuItem>
              <MenuItem value={10}>10 mins</MenuItem>
              <MenuItem value={15}>15 mins</MenuItem>
            </Select>
          </Box>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleSent();
            }}
          >
            Send
          </Button>
        }
      />

      <Dialog open={sent.value} onClose={sent.onFalse}>
        <Stack justifyContent="center" alignItems="center" sx={{ p: 5 }}>
          <Typography variant="body1">SMS Message Sent </Typography>
          <Iconify
            style={{ color: 'green', width: '80px', height: '80px' }}
            icon="line-md:circle-to-confirm-circle-twotone-transition"
          />
        </Stack>
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
