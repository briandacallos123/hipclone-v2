import * as Yup from 'yup';
import { useCallback, useMemo,useEffect,useState } from 'react';
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
import { mutation_create_family_history } from '@/libs/gqls/medicalProfile';
// 

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  clientside?:any;
  refetch?:any;
  isLoading2?:any;
  setLoading2?:any;
  currentItem?: {
    name: string;
  };
};

export default function ProfileFamilyNewEditForm({isLoading2, setLoading2,currentItem, onClose,clientside,refetch }: Props) {
  const { enqueueSnackbar,closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]:any = useState(null);

  
  const NewProfileSchema = Yup.object().shape({
    items: Yup.array().of(
      Yup.object().shape({
        family_history: Yup.string().required('Family history name is required'),
      })
    ),
  });
  // console.log(clientside,"clientside")

  const defaultValues = useMemo(
    () => ({
      patientID : clientside?.patientInfo?.S_ID,
      emrPatientID: null,
      isEMR :clientside?.patientInfo?.isEMR,
      patient: clientside?.patientInfo?.IDNO,
      items: [{ family_history: '' }],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentItem]
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
      family_history: '',
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
    const [create_family_history] = useMutation(mutation_create_family_history, {
      context: {
        requestTrackerId: 'mutation_create_family_history[family_history_input_request]',
      },
      notifyOnNetworkStatusChange: true,
    });
      ////////////////////////////////////////////////////////////////////////////
  
      ////////////////////////////////////////////////////////////////////////////
      const handleSubmitValue = useCallback(async (model: NexusGenInputs['family_history_input_request']) => {
        const data: NexusGenInputs['family_history_input_request'] = {
          patientID: model?.patientID,
          emrPatientID:model?.emrPatientID,
          isEMR: model?.isEMR,
          patient: model?.patient,
          family_history: model?.family_history,
        };
        create_family_history({
          variables: {
            data,
          },
        })
          .then(async (res) => {
            closeSnackbar(snackKey);
            enqueueSnackbar('Create Family History Successfully');
            refetch();
            setLoading2(false)

          })
          .catch((error) => {
            closeSnackbar(snackKey);
            enqueueSnackbar('Something went wrong', { variant: 'error' });
            setLoading2(false)

            // runCatch();
          });
      }, [snackKey]);
      ////////////////////////////////////////////////////////////////////////////


      const values = watch();
      useEffect(() => {
          // console.log(values, 'YAWA@#');
          if (snackKey) {
            (async () => {
              await handleSubmitValue({
                ...values,
                patientID:Number(values?.patientID),
                emrPatientID:null,
                isEMR:Number(values?.isEMR),
                patient:String(values?.patient),
                family_history:values?.items,
              });
              // setSnackKey(null);
            })();
          }
        }, [snackKey]);
  const onSubmit = useCallback(
    async (data: any) => {

      setLoading2(true)

      try {
        try {
          const snackbarKey:any = enqueueSnackbar('Saving Data...', {
            variant: 'info',
            key: 'creatingFamilyhistory',
            persist: true, // Do not auto-hide
          });
          setSnackKey(snackbarKey);
          onClose();
        } catch (error) {
          console.error(error);
        }
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
              Record of the relationships among family members along with their medical histories.
              This includes current and past illnesses. A family history may show a pattern of
              certain diseases in a family.
            </Typography>

            <Stack spacing={2}>
              {fields.map((item, index) => (
                <RHFTextField
                  key={item.id}
                  fullWidth
                  name={`items[${index}].family_history`}
                  label="Family History Name"
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
