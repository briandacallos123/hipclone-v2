import * as Yup from 'yup';
import { useCallback, useMemo,useState,useEffect} from 'react';
import { useForm, Controller, CustomRenderInterface } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// types
import { IEmrItem } from 'src/types/emr';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { useMutation } from '@apollo/client';
import { MutationEmrPatient } from '@/libs/gqls/emr';
import { YMD } from 'src/utils/format-time';
// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IEmrItem, 'birthDate'> {
  birthDate: Date | null;
}

type Props = {
  onClose: VoidFunction;
  currentItem?: IEmrItem;
  refetch?: any;
};
// queryData, 
export default function EmrNewEditForm({ currentItem, onClose, refetch }: Props) {
  const { enqueueSnackbar,closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]:any = useState(null);

  const NewEmrSchema = Yup.object().shape({
    fname: Yup.string().required('Firstname is required'),
    lname: Yup.string().required('Lastname is required'),
    birthDate: Yup.string().required('Birthday is required'),
    gender: Yup.string().required('Gender is required'),
    status: Yup.string().required('Status is required'),
  });

  const defaultValues = useMemo(
    () => ({
      fname: '',
      lname: '',
      suffix: '',
      birthDate: new Date(),
      gender: '',
      status: '',
      address: '',
      contact_no: '',
      email: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentItem]
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewEmrSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    // console.log(values, 'YAWA@#');
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          ...values,
            fname: values?.fname,
            lname: values?.lname,
            suffix: values?.suffix,
            status: values?.status,
            dateofbirth: YMD(values?.birthDate),
            gender: values?.gender,
            address:values?.address,
            contact_no: values?.contact_no,
            email: values?.email,
        });
        // setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const [createEmr] = useMutation(MutationEmrPatient, {
    context: {
      requestTrackerId: 'MutationEmrPatient[EmrPatientUpsertType]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleSubmitValue = useCallback(async (model: NexusGenInputs['EmrPatientUpsertType']) => {
    const data: NexusGenInputs['EmrPatientUpsertType'] = {
      fname: model.fname,
      suffix: model.suffix,
      gender: model.gender,
      lname: model.lname,
      status: model.status,
      address: model.address,
      email: model.email,
      contact_no: model.contact_no,
      dateofbirth: model.dateofbirth,
    };
    createEmr({
      variables: {
        data,
      },
    })
      .then(async (res) => {
        closeSnackbar(snackKey);
        enqueueSnackbar('Created successfully!');
        refetch();
      })
      .catch((error) => { 
        closeSnackbar(snackKey);
        enqueueSnackbar('Something went wrong', { variant: 'error' });
        // runCatch();
      });
      
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
          const snackbarKey:any = enqueueSnackbar('Creating Emr Patient...', {
            variant: 'info',
            key: 'CreatingEmrPatient',
            persist: true, // Do not auto-hide
          });
          setSnackKey(snackbarKey);
          onClose();
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, onClose, reset]
  );

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="fname" label="First Name" />
              <RHFTextField name="lname" label="Last Name" />
              <RHFTextField name="suffix" label="Suffix (e.g. I, II, Jr., etc.)" />

              <Controller
                name="birthDate"
                control={control}
                render={({ field, fieldState: { error } }: CustomRenderInterface) => (
                  <DatePicker
                    label="Date of Birth"
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />

              <RHFSelect name="gender" label="Gender">
                <MenuItem value={1}>Male</MenuItem>
                <MenuItem value={2}>Female</MenuItem>
                {/* <MenuItem value="unspecified">Unspecified</MenuItem> */}
              </RHFSelect>

              <RHFSelect name="status" label="Civil Status">
                <MenuItem value={1}>Single</MenuItem>
                <MenuItem value={2}>Married</MenuItem>
                <MenuItem value={3}>Separated</MenuItem>
                <MenuItem value={4}>Widowed</MenuItem>
              </RHFSelect>
            </Box>

            <RHFTextField name="address" label="Address" />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField type="text" name="contact_no" label="Phone Number (optional)" />
              <RHFTextField type="email" name="email" label="Email (optional)" />
            </Box>
          </Stack>
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
          {currentItem ? 'Update' : 'Create'}
        </LoadingButton>
      </DialogActions>
    </>
  );
}
