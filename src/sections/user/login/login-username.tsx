import * as Yup from 'yup';
import { useCallback, useMemo, useState,useEffect } from 'react';
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
import { useLazyQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { useMutation } from '@apollo/client';
import { USER_UPDATE_USERNAME } from '@/libs/gqls/users';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

type FormValuesProps = IUserProfile;

export default function LoginUsername() {
  const { enqueueSnackbar,closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]:any = useState(null);
  const [isloading, setLoading]: any = useState(false);

  const { user } = useAuthContext();
  // const [user] = useState<IUserProfile>(_userProfile);


  const [user_username_update] = useMutation(USER_UPDATE_USERNAME, {
    context: {
      requestTrackerId: 'mutationUpdateUsername[UserUpdateProfileUpsertType]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleSubmitValue = useCallback(async (model: NexusGenInputs['UserUpdateProfileUpsertType']) => {
    const data: NexusGenInputs['UserUpdateProfileUpsertType'] = {
      uname: model.uname,
    };
    user_username_update({
      variables: {
        data,
      },
    })
      .then(async (res) => {
        closeSnackbar(snackKey);
        enqueueSnackbar('Update Username Successfully!');
        setSnackKey(null)
         setLoading(false)
        // refetch();
      })
      .catch((error) => {
        closeSnackbar(snackKey);
        setSnackKey(null);

        enqueueSnackbar('Something went wrong', { variant: 'error' });
         setLoading(false)
        // runCatch();
      });
  }, [snackKey]);

  const UpdateUserSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
  });

  const defaultValues = useMemo(
    () => ({
      username: user?.username || '',
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


  const values = watch();

      useEffect(() => {
          // console.log(values, 'YAWA@#');
          if (snackKey) {
            (async () => {
              await handleSubmitValue({
                ...values,
                uname:values?.username,
              });
              // setSnackKey(null);
            })();
          }
        }, [snackKey]);


  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      setLoading(true)
      try {
        const snackbarKey:any = enqueueSnackbar('Updating Username...', {
          variant: 'info',
          key: 'UpdatingUsername',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
       
        // await new Promise((resolve) => setTimeout(resolve, 500));
        // reset();
        // enqueueSnackbar('Update success!');
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
            Username
          </Typography>

          <RHFTextField disabled name="username" placeholder="Username" />
        </Box>

        {/* <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isloading}>
            Save Changes
          </LoadingButton>
        </Stack> */}
      </Card>
    </FormProvider>
  );
}
