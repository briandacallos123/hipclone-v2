import { m } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'src/components/snackbar';
import { NextAuthRegisterView } from '../auth';
// @mui
import { styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
// _mocks
import { get_hmo_list } from '@/libs/gqls/hmo_list';
// import { HMO_OPTIONS } from 'src/_mock';
import { useQuery } from '@apollo/client';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { MotionContainer, varFade } from 'src/components/animate';
import { useBoolean } from '@/hooks/use-boolean';
import { useSearch } from '@/auth/context/Search';
import { _doctorList, _doctors, _hospitals, staticClinic, staticSpec, staticHMO } from '@/_mock';
// ----------------------------------------------------------------------

const StyledRoot = styled('section')(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: `url("../../assets/bg_gif.gif") no-repeat center`,
  backgroundSize: 'cover',
  color: theme.palette.common.white,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 40),
  },
}));

const TextFieldStyle = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    input: {
      color: theme.palette.common.black,
    },
    background: theme.palette.common.white,
    '& fieldset, &:hover fieldset, &.Mui-focused fieldset': {
      borderColor: theme.palette.common.black,
    },
  },
}));

// ----------------------------------------------------------------------

export default function HomeFindDoctor() {
  const mdUp = useResponsive('up', 'md');
  const { search, setSearch }: any = useSearch();
  // console.log(search, 'search');
  const [HMO_OPTIONS, setHmoOptions]: any = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  // const { data } = useQuery(get_hmo_list);
  const router = useRouter();

  // useEffect(() => {
  //   if (data) {
  //     setHmoOptions(data?.hmo_list);
  //   }
  // }, [data]);

  const handleSubmit = () => {
    setLoading(true);
    router.push(paths.find);
    // if (!(search?.doctor || search?.clinic || search?.spec)) {
    //   enqueueSnackbar('Please fill atleast 1 field to search', { variant: 'error' });
    // } else {

    // }
  };
  // const handleSubmit = useCallback(
  //   (id?: string) => {

  //   },
  //   [router]
  // );

  const handleChange = (name: any, val: any) => {
    setSearch((prev: any) => {
      return { ...prev, [name]: val };
    });
  };

  const [selectedDoctor, setSelectedDoctor]: any = useState(null);
  const handleDoctorChange = (event, newValue) => {
    setSelectedDoctor(newValue);
  };

  // const [clinicData, setClinicData]: any = useState('');
  // const [clinicDataType, setClinicDataType]: any = useState('');
  // const [removeClinic, setRemoveClinic] = useState(false);

  const [clinicData, setClinicData] = useState({
    clinicClick: '',
    clinicType: '',
    lastChange: '',
  });

  const [specData, setSpecData] = useState({
    specClick: '',
    specType: '',
    lastChange: '',
  });

  const [doctorData, setDoctorData] = useState({
    doctorClick: '',
    doctorType: '',
    lastChange: '',
  });

  const [myHmo, setMyHmo] = useState(null);

  useEffect(() => {
    if (myHmo) {
      const { id }: any = staticHMO?.find((i: any) => myHmo === i?.title);

      setSearch({
        ...search,
        hmo: [id],
      });
    }
  }, [myHmo]);

  useEffect(() => {
    setSearch({
      ...search,
      clinic: (() => {
        if (clinicData?.lastChange === 'typed') {
          return clinicData?.clinicType;
        }
        return clinicData?.clinicClick;
      })(),
    });
  }, [clinicData]);

  useEffect(() => {
    setSearch({
      ...search,
      doctor: (() => {
        if (doctorData?.lastChange === 'typed') {
          return doctorData?.doctorType;
        }
        // console.log('Clicked sya');
        return `${doctorData?.doctorClick?.firstName} ${doctorData?.doctorClick?.lastName}`;
      })(),
    });
  }, [doctorData]);

  useEffect(() => {
    setSearch({
      ...search,
      spec: (() => {
        if (specData?.lastChange === 'typed') {
          return specData?.specType;
        }
        return specData?.specClick;
      })(),
    });
  }, [specData]);

  return (
    <StyledRoot id="finddoctor">
      <Container component={MotionContainer} maxWidth="xl">
        <Stack spacing={3} sx={{ px: { sm: 5, md: 20 }, textAlign: 'center' }}>
          <m.div variants={varFade().inUp}>
            <Typography variant="h2" sx={{ lineHeight: 1 }}>
              FIND YOUR DOCTOR
            </Typography>
          </m.div>

          <m.div variants={varFade().inUp}>
            <TextFieldStyle
              value={search?.doctor}
              name="doctor"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              // onChange={(e) => {
              //   setDoctorData((prev) => {
              //     return {
              //       ...prev,
              //       lastChange: 'typed',
              //       doctorType: e.target.value,
              //     };
              //   });
              // }}
              // {...params}
              fullWidth
              placeholder="Search Doctor"
            />
            {/* <Autocomplete
              freeSolo
              // value={doctorData?.doctorClick}
              onChange={(event: any, newValue: string | null) => {
                setDoctorData((prev: any) => {
                  return {
                    ...prev,
                    doctorClick: newValue,
                    doctorType: newValue,
                    lastChange: 'clicked',
                  };
                });
              }}
              options={_doctors.map((option) => option)}
              getOptionLabel={(option) => {
                let myDoctor = _doctors?.find((i) => i?.id === option?.id);

                return myDoctor?.firstName !== undefined
                  ? `${myDoctor?.firstName} ${myDoctor?.lastName}`
                  : '';
              }}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                const { id, firstName, lastName } = _doctors.filter(
                  (item) => item?.id === option?.id
                )[0];

                if (!id) {
                  return null;
                }

                return (
                  <li {...props} key={id}>
                    {`${firstName} ${lastName}`}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextFieldStyle
                  value={doctorData?.doctorType}
                  onChange={(e) => {
                    setDoctorData((prev) => {
                      return {
                        ...prev,
                        lastChange: 'typed',
                        doctorType: e.target.value,
                      };
                    });
                  }}
                  {...params}
                  fullWidth
                  placeholder="Search Doctor"
                />
              )}
            /> */}
          </m.div>

          <m.div variants={varFade().inUp}>
            <Autocomplete
              freeSolo
              value={clinicData?.clinicClick}
              onChange={(event: any, newValue: string | null) => {
                setClinicData((prev) => {
                  return {
                    ...prev,
                    clinicClick: newValue,
                    clinicType: newValue,
                    removeClinicClick: false,
                    lastChange: 'clicked',
                  };
                });
              }}
              options={staticClinic}
              // getOptionLabel={(option) => staticClinic.find((_) => _ === option) ?? ''}
              // isOptionEqualToValue={(option, value) => option === value}
              // renderOption={(props, option) => {
              //   const val = staticClinic.filter((item) => item === option)[0];

              //   if (!val) {
              //     return null;
              //   }

              //   return (
              //     <li {...props} key={val}>
              //       {val}
              //     </li>
              //   );
              // }}
              renderInput={(params) => (
                <TextFieldStyle
                  value={clinicData?.clinicType}
                  onChange={(e) => {
                    setClinicData((prev) => {
                      return {
                        ...prev,
                        lastChange: 'typed',
                        clinicType: e.target.value,
                      };
                    });
                  }}
                  {...params}
                  fullWidth
                  placeholder="Search hospital/location..."
                />
              )}
            />
          </m.div>

          <m.div variants={varFade().inUp}>
            <Autocomplete
              freeSolo
              value={specData?.specClick}
              onChange={(event: any, newValue: string | null) => {
                setSpecData((prev) => {
                  return {
                    ...prev,
                    specClick: newValue,
                    specType: newValue,
                    lastChange: 'clicked',
                  };
                });
              }}
              // onChange={(e) => handleChange(e.target.name, e.target.value)}
              options={staticSpec}
              // getOptionLabel={(option) => staticSpec.find((_) => _ === option) ?? ''}
              // isOptionEqualToValue={(option, value) => option === value}
              // renderOption={(props, option) => {
              //   const val = staticSpec.filter((item) => item === option)[0];

              //   if (!val) {
              //     return null;
              //   }

              //   return (
              //     <li {...props} key={val}>
              //       {val}
              //     </li>
              //   );
              // }}
              renderInput={(params) => (
                <TextFieldStyle
                  value={specData?.specType}
                  onChange={(e) => {
                    setSpecData((prev) => {
                      return {
                        ...prev,
                        lastChange: 'typed',
                        specType: e.target.value,
                      };
                    });
                  }}
                  {...params}
                  fullWidth
                  placeholder="Search Specialization..."
                />
              )}
            />
          </m.div>

          {/* <m.div variants={varFade().inUp}>
          
            <Autocomplete
              freeSolo
              // onChange={(e) => handleChange(e.target.name, e.target.value)}
              options={staticSpec.map((option) => option)}
              getOptionLabel={(option) => staticSpec.find((_) => _ === option) ?? ''}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                const val = staticSpec.filter((item) => item === option)[0];

                if (!val) {
                  return null;
                }

                return (
                  <li {...props} key={val}>
                    {val}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextFieldStyle {...params} fullWidth placeholder="Search specialization..." />
              )}
            />
          </m.div> */}

          <m.div variants={varFade().inUp}>
            <TextFieldStyle
              select
              fullWidth
              value={myHmo}
              onChange={(e: any) => {
                setMyHmo(e.target.value);
              }}
              placeholder="Select HMO"
              SelectProps={{ native: true }}
            >
              <option value="">Select HMO</option>
              {staticHMO?.map((option: any) => (
                <option key={option?.id} value={option?.title}>
                  {option?.title}
                </option>
              ))}
            </TextFieldStyle>
          </m.div>

          <m.div variants={varFade().inUp}>
            <LoadingButton
              color="inherit"
              size="large"
              variant="contained"
              loading={isLoading}
              onClick={() => handleSubmit()}
            >
              Search
            </LoadingButton>
          </m.div>
        </Stack>

        <Box component={m.div} variants={varFade().inRight} sx={{ mt: 10, px: 3 }}>
          <Typography
            sx={{
              fontSize: { xs: '18px', md: '23px' },
              '& > span': { fontWeight: 'bold' },
            }}
          >
            <span>How to Search for your doctor:</span>
            <br />
            1. Start your search by location, specialization, name or hospital.
            <br />
            2. Click “SEARCH” to view results.
            <br />
            3. Once you&apos;ve found your doctor, click “Book Now” to schedule an appointment.
          </Typography>
        </Box>

        {mdUp && (
          <Box component={m.div} variants={varFade().inUp} sx={{ mt: 10, textAlign: 'center' }}>
            <SignupNote />
          </Box>
        )}
      </Container>
    </StyledRoot>
  );
}

// ----------------------------------------------------------------------

function SignupNote() {
  const open = useBoolean();

  return (
    <>
      <Typography
        color="common.white"
        sx={{
          fontSize: { xs: '18px', md: '23px' },
          '& > a': {
            fontSize: { xs: '18px', md: '23px' },
            fontWeight: 'bold',
            cursor: 'pointer',
            color: (theme) => theme.palette.common.black,
          },
        }}
      >
        <Typography component={Link} onClick={open.onTrue}>
          Sign up
        </Typography>
        &nbsp;for FREE account now.
      </Typography>

      <NextAuthRegisterView open={open.value} onClose={open.onFalse} />
    </>
  );
}
