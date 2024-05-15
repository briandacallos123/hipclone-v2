import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// utils
import { fData } from 'src/utils/format-number';
// types
import { IHospital } from 'src/types/general';
// prisma
import { useMutation } from '@apollo/client';
import { CLINIC_UPDATE_ONE } from '@/libs/gqls/clinicSched';
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
import { NexusGenInputs } from 'generated/nexus-typegen';
// ----------------------------------------------------------------------

// const PROVINCE_OPTIONS = ['Abra', 'Bataan', 'Cagayan'];

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IHospital, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
}

type Props = {
  onClose: VoidFunction;
  currentItem?: any;
  // appendData: any;
  // appendDataClient: any;
  // uuid: any;
  clientSide: any;
  refetch: any;
  provinces: any;
};

export default function ClinicEditForm({
  // uuid,
  // appendDataClient,
  // appendData,
  currentItem,
  clientSide,
  onClose,
  provinces,
  refetch,
}: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // console.log(currentItem);
  const UpdateUserSchema = Yup.object().shape({
    clinic_name: Yup.string().required('Clinic name is required'),
    number: Yup.string().required('Number is required'),
    location: Yup.string().required('Location is required'),
    Province: Yup.string().required('Province is required'),
    // avatarUrl: '',
  });

  const getImage = () => {
    if (clientSide?.clinicDPInfo[0]?.filename) {
      const url = clientSide?.clinicDPInfo[0]?.filename;
      const parts = url?.split('public');
      const publicPart = parts && parts[1];
      return publicPart;
    }
  };

  const defaultValues = useMemo(
    () => ({
      clinic_name: clientSide?.clinic_name,
      number: clientSide?.number,
      location: clientSide?.location,
      Province: clientSide?.Province,
      avatarUrl: (clientSide?.clinicDPInfo[0]?.filename && getImage()) || '',
    }),
    [clientSide]
  );

  const methods = useForm<FieldValues>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const [UpdateClinic] = useMutation(CLINIC_UPDATE_ONE);
  const [snackKey, setSnackKey]: any = useState(null);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['ClinicInsertPayload']) => {
      const data: NexusGenInputs['ClinicInsertPayload'] = {
        clinic_name: model.clinic_name,
        location: model.location,
        number: model.number,
        Province: model.Province,
        refId: currentItem.id,
        uuid: model.uuid,
      };
      UpdateClinic({
        variables: {
          data,
          file: model?.avatarUrl,
        },
      })
        .then(async (res: any) => {
          const { data: dataResponse } = res;
          // appendData(dataResponse?.UpdateClinic);
          // appendData(dataResponse?.PostClinic);
          closeSnackbar(snackKey);
          setSnackKey(null);
          enqueueSnackbar('Update success!');
          reset();

          refetch(dataResponse.UpdateClinic);
        })
        .catch((error) => {
          console.log(error, 'ano error?');
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });
    },
    [snackKey]
  );

  const values = watch();
  // console.log(values, 'VALUESSS sa labas');

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          ...values,
          // uuid,
        });
        // setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(async (data: NexusGenInputs['ClinicInsertPayload']) => {
    try {
      // appendDataClient(data);
      const snackbarKey = enqueueSnackbar('Saving Data...', {
        variant: 'info',
        key: 'savingEducation',
        persist: true, // Do not auto-hide
      });
      setSnackKey(snackbarKey);

      // await handleSubmitValue({
      //   ...data,
      // });
      onClose();
      // enqueueSnackbar('Saving Edited data...!');
      // console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} sx={{ pt: 1, pb: 3 }}>
            <Grid xs={12} md={4}>
              <Card sx={{ py: 5, px: 3, textAlign: 'center' }}>
                <RHFUploadAvatar
                  name="avatarUrl"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 3,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
              </Card>
            </Grid>

            <Grid xs={12} md={8}>
              <Stack spacing={3}>
                <RHFTextField name="clinic_name" label="Clinic/Hospital Name" />
                <RHFTextField name="location" label="Clinic Address" />

                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFTextField
                    name="number"
                    label="Clinic Phone Number"
                    helperText="This number will be visible to the public. Please indicate the clinic official contact number."
                  />

                  <RHFSelect name="Province" label="Province">
                    {provinces &&
                      provinces?.map((option: any, index: Number) => (
                        <MenuItem key={index} value={option?.Province}>
                          {option?.Province}
                        </MenuItem>
                      ))}
                  </RHFSelect>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </FormProvider>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Save Changes
        </LoadingButton>
      </DialogActions>
    </>
  );
}
