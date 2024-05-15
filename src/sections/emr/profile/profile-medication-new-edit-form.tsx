import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
// components
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

//
import { useLazyQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { useMutation } from '@apollo/client';
import { mutation_create_medication } from '@/libs/gqls/medicalProfile';
//
import { useParams } from 'src/routes/hook';
// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  clientside: any;
  refetch: any;
  isLoading4: any;
  setLoading4: any;
  tableDataMedication: any;
  currentItem?: {
    name: any;
  };
};

export default function ProfileMedicationNewEditForm({
  refetch,
  isLoading4,
  setLoading4,
  currentItem,
  onClose,
  clientside,
  tableDataMedication,
}: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);

  // console.log(clientside,'sssssss')

  const NewProfileSchema = Yup.object().shape({
    items: Yup.array().of(
      Yup.object().shape({
        medication: Yup.string().required('Medication name is required'),
      })
    ),
  });
  const params = useParams();
  const { id }: any = params;
  const defaultValues = useMemo(
    () => ({
      patientID: null,
      emrPatientID: Number(id) || null,
      isEMR: 1,
      patient: clientside?.idno,
      items: [{ medication: '' }],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewProfileSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const handleAdd = () => {
    append({
      medication: '',
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  ////////////////////////////////////////////////////////////////////////////
  // const [MobileNoValidation, setMobileNoValidation] = useState('');
  // const handleMobileNoChange = (event: any) => {
  //   setMobileNoValidation(event.target.value);
  // };
  // const [tableData, setTableData] = useState<any>([]);
  // const [messageAlleryData, setMessageAllery] = useState<any>([]);
  // const [statusAlleryData, setStatusAllery] = useState<any>([]);
  const [create_medication] = useMutation(mutation_create_medication, {
    context: {
      requestTrackerId: 'mutation_create_medication[medication_input_request]',
    },
    notifyOnNetworkStatusChange: true,
  });
  ////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////
  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['medication_input_request']) => {
      const data: NexusGenInputs['medication_input_request'] = {
        patientID: model?.patientID,
        emrPatientID: model?.emrPatientID,
        isEMR: model?.isEMR,
        patient: model?.patient,
        medication: model?.medication,
      };
      create_medication({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          closeSnackbar(snackKey);
          enqueueSnackbar('Create Medication Successfully');
          refetch();
          setLoading4(false)
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          setLoading4(false)
          // runCatch();
        });
    },
    [snackKey]
  );
  ////////////////////////////////////////////////////////////////////////////
  const values = watch();
  useEffect(() => {
    // console.log(values, 'YAWA@#');
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          ...values,
          patientID: null,
          emrPatientID: Number(values?.emrPatientID),
          isEMR: Number(values?.isEMR),
          patient: String(values?.patient),
          medication: values?.items,
        });
        // setSnackKey(null);
      })();
    }
  }, [snackKey]);
  const onSubmit = useCallback(
    async (data: any) => {
      setLoading4(true)
      try {
        const snackbarKey: any = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'creatingMedication',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        onClose();
        // await new Promise((resolve) => setTimeout(resolve, 500));
        // reset();
        // onClose();
        // enqueueSnackbar(currentItem ? 'Update success!' : 'Create success!');
        // console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [currentItem, enqueueSnackbar, onClose, reset]
  );

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Typography
              variant="caption"
              sx={{
                py: 1,
                px: 2,
                bgcolor: 'primary.main',
                color: 'common.white',
                textAlign: 'center',
                borderRadius: 1,
              }}
            >
              Complete medication name for the patient. Include how many milligram will be consumed
              or will be used.
            </Typography>

            <Stack spacing={2}>
              {fields.map((item, index) => (
                <RHFTextField
                  key={item.id}
                  fullWidth
                  name={`items[${index}].medication`}
                  label="Medication Name"
                  InputProps={{
                    endAdornment: index !== 0 && (
                      <InputAdornment position="end">
                        <IconButton color="error" onClick={() => handleRemove(index)}>
                          <Iconify icon="solar:close-circle-bold" width={24} height={24} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ))}
            </Stack>

            <Stack direction="row" justifyContent="flex-start">
              <Button
                size="small"
                color="primary"
                disabled={fields.length === 5}
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleAdd}
                sx={{ flexShrink: 0 }}
              >
                Add Item
              </Button>
            </Stack>
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
