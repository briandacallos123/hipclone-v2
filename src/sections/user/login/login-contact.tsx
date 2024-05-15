import * as Yup from 'yup';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// _mock
import { _userProfile } from 'src/_mock';
// types
import { IUserProfile } from 'src/types/user';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { useLazyQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { USER_UPDATE_MOBILE_PHONE } from '@/libs/gqls/users';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

type FormValuesProps = IUserProfile;

export default function LoginContact() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);
  const [isloading, setLoading]: any = useState(false);
  const { user } = useAuthContext();

  // console.log(user,"user ot")
  // const [user] = useState<IUserProfile>(_userProfile);

  const UpdateUserSchema = Yup.object().shape({
    phoneNumber: Yup.string().required('Phone number is required'),
  });

  const defaultValues = useMemo(
    () => ({
      phoneNumber: user?.contact || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  const methods = useForm<any>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [user_mobile_phone_update] = useMutation(USER_UPDATE_MOBILE_PHONE, {
    context: {
      requestTrackerId: 'mutationUpdatePhone[UserUpdatePhoneProfileUpsertType]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['UserUpdatePhoneProfileUpsertType']) => {
      const data: NexusGenInputs['UserUpdatePhoneProfileUpsertType'] = {
        // id: model.id,
        mobile_number: model.mobile_number,
      };
      user_mobile_phone_update({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          closeSnackbar(snackKey);
          if(res?.data?.mutationUpdatePhone?.status === "Failed"){
            enqueueSnackbar('Mobile number already taken.', { variant: 'error' });
            setSnackKey(null);
          setLoading(false)
          }else{
            enqueueSnackbar('Update Mobile Phone Successfully!');
            setSnackKey(null);
            setLoading(false)
          }
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          closeSnackbar(snackKey);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          setLoading(false)
          // runCatch();
        });
    },
    [snackKey]
  );

  const values = watch();
  useEffect(() => {
    // console.log(values, 'YAWA@#');
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          ...values,
          mobile_number: values?.phoneNumber,
        });
        // setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {

      setLoading(true)

      try {
        const snackbarKey: any = enqueueSnackbar('Updating phone number...', {
          variant: 'info',
          key: 'UpdatingPhoneNumber',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        // onClose();

        // await new Promise((resolve) => setTimeout(resolve, 500));
        // reset();
        // enqueueSnackbar('Update success!');
        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, reset]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Box
          gap={1}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: '1fr 3fr',
          }}
        >
          <Typography variant="overline" gutterBottom>
            Contact Number
          </Typography>

          <RHFTextField name="phoneNumber" placeholder="Phone Number" />
        </Box>

        <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isloading}>
            Save Changes
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
