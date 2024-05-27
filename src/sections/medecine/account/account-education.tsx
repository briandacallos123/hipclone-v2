import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import ListItemText from '@mui/material/ListItemText';
// _mock
import { _userProfileEducation } from 'src/_mock';
// types
import { IUserProfileEducation } from 'src/types/user';
// components
import { useResponsive } from 'src/hooks/use-responsive';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { EducationMutation } from '../../libs/gqls/education';
import { useAuthContext } from 'src/auth/hooks';
import { GetEducations } from '../../libs/gqls/education';
// import

// ----------------------------------------------------------------------

type FormValuesProps = IUserProfileEducation;

export default function AccountEducation() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { user, reInitialize } = useAuthContext();
  const upMd = useResponsive('up', 'md');
  console.log(reInitialize);
  // const [user] = useState<IUserProfileEducation>(_userProfileEducation);
  const [updateEducation] = useMutation(EducationMutation);
  const { data: queryData, error, loading, refetch }: any = useQuery(GetEducations);
  const [userData, setUserData] = useState({});
  // console.log('QUERY: ', queryData);

  // useEffect(() => {
  //   if (queryData) {
  //     setUserData(queryData?.GetEducations?.data);
  //   }
  // }, [queryData]);
  const [snackKey, setSnackKey] = useState(null);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['EducationInput']) => {
      const data: NexusGenInputs['EducationInput'] = {
        medicalSchool: model.medicalSchool,
        recidency: model.recidency,
        fellowship1: model.fellowship1,
        fellowship2: model.fellowship2,
      };
      updateEducation({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          if (snackKey) {
            const { data } = res;
            console.log(snackKey, 'key');
            closeSnackbar(snackKey);
            enqueueSnackbar('Updated Successfully');
            refetch();
          }
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          // runCatch();
        });
    },
    [snackKey]
  );

  // const defaultValues = {
  //   // medicalSchool: user?.medicalSchool ?? { name: '', year: '' },
  //   // recidency: user?.recidency ?? { name: '', year: '' },
  //   // fellowship1: user?.fellowship1 ?? { name: '', year: '' },
  //   // fellowship2: user?.fellowship2 ?? { name: '', year: '' },
  //   medicalSchool: {},
  //   recidency: {},
  //   fellowship1: {},
  //   fellowship2: {},
  // };
  const defaultValues = useMemo(
    () => ({
      medicalSchool: { name: '', year: '' },
      recidency: { name: '', year: '' },
      fellowship1: { name: '', year: '' },
      fellowship2: { name: '', year: '' },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userData]
  );

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (queryData) {
      Object.entries(queryData?.GetEducations?.data).forEach((i, index) => {
        const name = i[0];
        const vals = i[1];
        setValue(name, vals);
      });
    }
  }, [queryData]);

  const values = watch();

  // console.log('SNACK KEY: ', snackKey);

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue(values);
        setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        const snackbarKey = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingEducation',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);

        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar]
  );

  console.log(defaultValues?.medicalSchool?.name, 'yey');
  console.log(defaultValues, 'LAHAT NG VALUES');
  // medicalSchool: user?.medicalSchool ?? { name: '', year: '' },
  //   recidency: user?.recidency ?? { name: '', year: '' },
  //   fellowship1: user?.fellowship1 ?? { name: '', year: '' },
  //   fellowship2: user?.fellowship2 ?? { name: '', year: '' },

  const FIELDS = [
    {
      value: 'medicalSchool',
    },
    {
      value: 'recidency',
    },
    {
      value: 'fellowship1',
    },
    {
      value: 'fellowship2',
    },
  ];

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack component={Card} spacing={{ md: 3, xs: 1 }} sx={{ p: 3 }}>
        {Object.keys(values)?.map((item, index) => (
          <Grid key={item} container spacing={{ md: 3, xs: 1 }}>
            <Grid xs={12} md={4}>
              <ListItemText
                primary={
                  (index === 0 && 'Medical School') ||
                  (index === 1 && 'Recidency') ||
                  'Fellowship Training'
                }
                secondary={
                  (index === 0 && 'Input your medical graduate education') ||
                  (index === 1 && 'Input your recidency/postgraduate training') ||
                  'Input your medical fellowship training'
                }
                primaryTypographyProps={{ typography: { md: 'h6', xs: 'body1' }, mb: 0.5 }}
                secondaryTypographyProps={{ component: 'span' }}
              />
            </Grid>

            <Grid xs={12} md={8}>
              <Box
                rowGap={{ md: 3, xs: 0 }}
                columnGap={{ md: 2, xs: 1 }}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: '3fr 1fr',
                }}
                sx={{ p: { md: 3, xs: 1 }, borderRadius: 2, bgcolor: 'background.neutral' }}
              >
                <RHFTextField name={`${item}.name`} label="Name of Institution" />
                <RHFTextField name={`${item}.year`} label="Year Completed" />
              </Box>
            </Grid>
          </Grid>
        ))}

        {/* {Object.keys(user).map((item, index) => (
          <Grid key={item} container spacing={3}>
            <Grid xs={12} md={4}>
              <ListItemText
                primary={
                  (index === 0 && 'Medical School') ||
                  (index === 1 && 'Recidency') ||
                  'Fellowship Training'
                }
                secondary={
                  (index === 0 && 'Input your medical graduate education') ||
                  (index === 1 && 'Input your recidency/postgraduate training') ||
                  'Input your medical fellowship training'
                }
                primaryTypographyProps={{ typography: 'h6', mb: 0.5 }}
                secondaryTypographyProps={{ component: 'span' }}
              />
            </Grid>

            <Grid xs={12} md={8}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: '3fr 1fr',
                }}
                sx={{ p: 3, borderRadius: 2, bgcolor: 'background.neutral' }}
              >
                <RHFTextField name={`${item}.name`} label="Name of Institution" />
                <RHFTextField name={`${item}.year`} label="Year Completed" />
              </Box>
            </Grid>
          </Grid>
        ))} */}

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
