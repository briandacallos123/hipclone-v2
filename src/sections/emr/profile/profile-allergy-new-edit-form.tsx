import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { mutation_create_allergy } from '@/libs/gqls/medicalProfile';
//
import { useParams } from 'src/routes/hook';
// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  clientside?: any;
  refetch?: any;
  isLoading?: any;
  setLoading?: any;
  updateRow?: any;
  tableDataAllergy?: any;
  currentItem?: {
    name: string;
  };
};

export default function ProfileAllergyNewEditForm({
  refetch,
  isLoading,
  setLoading,
  currentItem,
  onClose,
  clientside,
  tableDataAllergy,
}: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);
  //  console.log(tableData,'tableDatatableData')
  const NewProfileSchema = Yup.object().shape({
    items: Yup.array().of(
      Yup.object().shape({
        allergy: Yup.string().required('Allergy name is required'),
      })
    ),
  });
  const params = useParams();
  const { id }: any = params;
  // console.log(currentItem,"currentItem")
  // console.log(clientside,"clientside")

  const defaultValues = useMemo(
    () => ({
      patientID: null, // need pa i condition nitong dalawa based kung nasaang page ba yung user
      emrPatientID: Number(id) || null, // need pa i condition nitong dalawa based kung nasaang page ba yung user
      isEMR: 1,
      patient: clientside?.idno,
      // items: [''],
      items: [
        {
          allergy: '',
        },
      ],
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
      allergy: '',
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  ////////////////////////////////////////////////////////////////////////////
  const [create_allery] = useMutation(mutation_create_allergy, {
    context: {
      requestTrackerId: 'mutation_create_allergy[allergy_input_request]',
    },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  });
  ////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////
  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['allergy_input_request']) => {
      const data: NexusGenInputs['allergy_input_request'] = {
        patientID: model?.patientID,
        emrPatientID: model?.emrPatientID,
        isEMR: model?.isEMR,
        patient: model?.patient,
        allergy: model?.allergy,
      };
      create_allery({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          // console.log("TEST",snackKey)

          const { data } = res;

          const message = data?.mutation_create_allergy?.message;
          const status = data?.mutation_create_allergy?.status;

          if (status === 'Failed') {
            closeSnackbar(snackKey);
            enqueueSnackbar(message, { variant: 'error' });
            setLoading(false)
          } else {
            closeSnackbar(snackKey);
            enqueueSnackbar('Create Allergy Successfully');
            refetch();
            setLoading(false)
          }

          // if (snackKey) {

          // if(data.mutation_create_allergy.status === "Failed")
          // {
          //   enqueueSnackbar(`${data.mutation_create_allergy.message}`, { variant: 'error' } );
          // }else
          // {

          // }
          // }
          // setIsRefetch(data?.USER_UPDATE_MOBILE_PHONE);
          // reset();
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          setLoading(false)
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
          allergy: values?.items,
        });
        // setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: any) => {
      setLoading(true)
      try {
        const snackbarKey: any = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'creatingAllergy',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        onClose();
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
              An allergy is a reaction by your immune system to something that does not bother most
              other people. People who have allergies often are sensitive to more than one thing.
            </Typography>

            <Stack spacing={2}>
              {fields.map((item, index) => (
                <RHFTextField
                  key={item.id}
                  fullWidth
                  name={`items[${index}].allergy`}
                  label="Allergy Name"
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
