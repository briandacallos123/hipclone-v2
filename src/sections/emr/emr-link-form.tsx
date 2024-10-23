import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// _mock
import { _emrList } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, { RHFAutocomplete } from 'src/components/hook-form';
import { Autocomplete, TextField } from '@mui/material';
import { LinkAccount } from '@/libs/gqls/emr';
import { useMutation } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  currentItem?: any;
  list?: any;
  refetch?: any;
  optUpdate?: any;
  deletePatientInList?: any;
  calculateSimilarity: any;
  percentageSimilarity: any;
};

export default function EmrLinkForm({
  deletePatientInList,
  optUpdate,
  refetch,
  list,
  currentItem,
  onClose,
  calculateSimilarity,
  percentageSimilarity,
}: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const confirm = useBoolean();

  const NewEmrLinkSchema = Yup.object().shape({
    // account: Yup.string().required('Account is required'),
  });

  const [linkAcc] = useMutation(LinkAccount, {
    context: {
      requestTrackerId: 'Prescription_data[Prescription_data]',
    },
    notifyOnNetworkStatusChange: true,
  });
  // console.log('LIST@@@@:', list);

  const [snackKey, setSnackKey]: any = useState(null);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['LinkAccountInputs']) => {
      const data: NexusGenInputs['LinkAccountInputs'] = {
        id: model?.id,
        uuid: model?.uuid,
      };
      linkAcc({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          const { data } = res;
          closeSnackbar(snackKey);
          enqueueSnackbar('Linked successfully!');
          // reInitialize();
          setSnackKey(null);
          refetch();
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          setSnackKey(null);

          // runCatch();
        });
    },
    [snackKey]
  );

  const defaultValues = useMemo(
    () => ({
      account: '',
      id: currentItem?.id,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentItem]
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewEmrLinkSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (snackKey) {
      (async () => {
        // console.log(values, 'values');
        await handleSubmitValue({
          uuid: values?.account?.userInfo?.uuid,
          id: values?.id,
        });
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        // deletePatientInList(values.account);
        // optUpdate(currentItem, values.account);
        const snackbarKey = enqueueSnackbar('Linking Data...', {
          variant: 'info',
          key: 'savingGeneral',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        // await new Promise((resolve) => setTimeout(resolve, 500));
        // reset();
        // enqueueSnackbar(currentItem ? 'Update success!' : 'Create success!');
        // onClose();
        onClose();

        // console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [currentItem, enqueueSnackbar, reset, onClose, values]
  );

  console.log(values.account,'VALUESSSSSSSSSSS')
  useEffect(() => {
    if (values?.account) {
      const { fname, mname, lname } = currentItem;

      calculateSimilarity(
        (() => {
          if (mname) {
            return `${fname} ${mname} ${lname}`;
          }
          return `${fname} ${lname}`;
        })(),
        (() => {
          const { FNAME, LNAME }: any = values?.account;
          return `${FNAME} ${LNAME}`;
        })()
      );
    }
  }, [values.account]);

  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ pt: 0.7 }}>
            {/* <RHFAutocomplete
              disablePortal
              id="combo-box-demo"
              options={list?.QueryAllPatient || []}
              getOptionLabel={(option) => `${option.FNAME} ${option.LNAME}`}
              sx={{ width: '100%', height: '100%' }}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            /> */}
            <RHFAutocomplete
              name="account"
              label="Select Patient"
              options={list || []}
              getOptionLabel={(option) => {
                if (!option) {
                  return ``;
                }
                return `${option.FNAME} ${option.LNAME}`;
              }}
              renderOption={(props, option) => (
                // <li {...props}>{`${option.FNAME} ${option.LNAME}`}</li>
                <li {...props}>{`${option.FNAME} ${option.LNAME}`}</li>
              )}
              onChange={(e, selectedOption) => {
                setValue('account', selectedOption);
              }}
            />

            {values.account !== '' && (
              <Stack>
                {isDirty && <Typography
                  variant="body1"
                  color={(() => {
                    let rate = parseInt(percentageSimilarity);
                    let color: any;

                    if (rate >= 60) {
                      color = 'success.main';
                    } else {
                      color = 'error.main';
                    }
                    return color;
                  })()}
                >
                  Patient match score is {percentageSimilarity}. Click <strong>Link</strong> if you
                  want to proceed
                </Typography>}
                  {isDirty &&  <Typography
                  variant="subtitle1"
                  color={(() => {
                    let rate = parseInt(percentageSimilarity);
                    let color: any;

                    if (rate >= 60) {
                      color = 'success.main';
                    } else {
                      color = 'error.main';
                    }
                    return color;
                  })()}
                >
                  Match Score: {parseInt(percentageSimilarity)}
                </Typography>}
              </Stack>
            )}
          </Stack>
        </FormProvider>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!isDirty}
          onClick={() => {
            confirm.onTrue();
          }}
        >
          Link
        </Button>
      </DialogActions>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Link Accounts"
        content={<>Are you sure want to link the accounts?</>}
        action={
          <LoadingButton
            type="submit"
            variant="contained"
            color="success"
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            Proceed
          </LoadingButton>
        }
      />
    </>
  );
}
