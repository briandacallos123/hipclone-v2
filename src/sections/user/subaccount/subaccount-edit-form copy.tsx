import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm, FieldValues, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
// types
import { IUserSubaccountItem } from 'src/types/user';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFMultiCheckbox, RHFSwitch, RHFCheckbox } from 'src/components/hook-form';
//
import SubaccountCover from './subaccount-cover';
//
import { useLazyQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { useMutation } from '@apollo/client';
import { mutation_secretary_permission } from '@/libs/gqls/sub_accounts';

// ----------------------------------------------------------------------

const APPOINTMENT_OPTION = [
  { label: 'Approved Appointments', value: 'appt_approve' },
  { label: 'Cancel Appointments', value: 'appt_cancel' },
  { label: 'Done Appointments', value: 'appt_done' },
  { label: 'Change Appointment Type', value: 'appt_type' },
  { label: 'Change Payment Status', value: 'appt_pay' },
];

const RECORD_OPTION = [
  { label: 'Upload Laboratory and Imaging Result', value: 'upload_result' },
  { label: 'View Prescriptions', value: 'view_prescriptions' },
];

const HMO_OPTION = [{ label: 'Export Report', value: 'export_result' }];

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  currentItem?: any;
  clientside?: any;
  refetch?: any;
};

export default function SubaccountEditForm({ currentItem, clientside, onClose }: Props) {

  // console.log(currentItem, "boooomss");
  // console.log(clientside, "boooomss222222");

  // console.log(currentItem,'ITEM SA FORM')

  const { enqueueSnackbar } = useSnackbar();

  const UpdateUserSchema = Yup.object().shape({});

  const [openSwitch, setOpenSwitch] = useState(false);

  useEffect(() => {
    setOpenSwitch(currentItem?.status === 1 ? true : false);
  }, [currentItem?.status]);

  const [secretary_update_permission] = useMutation(mutation_secretary_permission, {
    context: {
      requestTrackerId: 'mutation_secretary_permission[secretary_permission_request_type]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleSubmitValue = useCallback(async (model: NexusGenInputs['secretary_permission_request_type']) => {
    const data: NexusGenInputs['secretary_permission_request_type'] = {
      id :  Number(model.id),
      status : Number(model.status),
      appt_all : Number(model.appt_all),
      appt_approve :  Number(model.appt_approve),
      appt_cancel :  Number(model.appt_cancel),
      appt_done :  Number(model.appt_done),
      appt_type : Number( model.appt_type),
      appt_pay :  Number(model.appt_pay),
      lab_result :  Number(model.lab_result),
      hmo_claim :  Number(model.hmo_claim),
      pres_view :  Number(model.pres_view),
    };
    secretary_update_permission({
      variables: {
        data,
      },
    })
      .then(async (res) => {
        // console.log(res, 'response');
        const { data } = res; 
        
        if(data.mutation_secretary_permission.status === "Failed")
        {
          enqueueSnackbar(`${data.mutation_secretary_permission.message}`, { variant: 'error' } );
        }else
        {
          enqueueSnackbar('Update Permission Successfully');
        }
        // setIsRefetch(data?.USER_UPDATE_MOBILE_PHONE);
        // reset();
      })
      .catch((error) => {
        enqueueSnackbar('Something went wrong', { variant: 'error' });
        // runCatch();
      });
  }, []);

  const defaultValues = useMemo(() => {
    const apptOptions = [
      clientside?.appt_approve,
      clientside?.appt_cancel,
      clientside?.appt_done,
      clientside?.appt_type,
      clientside?.appt_pay,
    ]; // array indexes: 0=approve, 1=cancel, 2=done, 3=type, 4=pay

    return {
      appt_all: clientside?.appt_all || 0,
      appt_options: apptOptions || [0, 0, 0, 0, 0],
      lab_result: clientside?.lab_result || 0,
      pres_view: clientside?.pres_view || 0,
      appt_approve: clientside?.appt_approve || 0,
      appt_done: clientside?.appt_done || 0,
      appt_cancel: clientside?.appt_cancel || 0,
      appt_type: clientside?.appt_type || 0,
      hmo_claim: clientside?.hmo_claim || 0,
      appt_pay: clientside?.appt_pay || 0,
      status: clientside?.status || 0,
      id: clientside?.id || 0,
    };
  }, [clientside?.id]);

  const methods = useForm<FieldValues>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    const isCheck = areEqual(values.appt_options, [1, 1, 1, 1, 1]);

    if (isCheck) {
      setValue('appt_all', 1);
    } else {
      setValue('appt_all', 0);
    }
  }, [values.appt_options, setValue]);

  console.log('asdasfsf', values);

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      try {
        handleSubmitValue({
          id:Number(data?.id),
          status:Number(data?.status),
          appt_all:Number(data?.appt_all),
          appt_approve:Number(data?.appt_approve),
          appt_cancel:Number(data?.appt_cancel),
          appt_done:Number(data?.appt_done),
          appt_type:Number(data?.appt_type),
          appt_pay:Number(data?.appt_pay),
          lab_result:Number(data?.lab_result),
          hmo_claim:Number(data?.hmo_claim),
          pres_view:Number(data?.pres_view),
        })
        // reset();
        // onClose();
        // enqueueSnackbar('Update success!');
      } catch (error) {
        console.error(error);
      }
    },
    []
  );


 



  return (
    <>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <SubaccountCover currentItem={currentItem} />

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
            <RHFSwitch
              name="status"
              checked={openSwitch}
              label="Make account active?"
              labelPlacement="start"
              sx={{ m: 0, justifyContent: 'space-between' }}
            />
          </Stack>

          <Stack>
            <Typography variant="subtitle2">Appointments</Typography>

            <Controller
              name="appt_options"
              control={control}
              render={({ field }: any) => {
                const isCheck = Boolean(getValues('appt_all'));

                const onChecked = (index: number, value: boolean) => [
                  ...field.value.map((el:any, i:any) => {
                    if (i === index) {
                      return Number(value);
                    }
                    return el;
                  }),
                ];

                const onCheckAll = () => {
                  if (isCheck) {
                    setValue('appt_options', [0, 0, 0, 0, 0]);
                    setValue('appt_all', 0);
                  } else {
                    setValue('appt_options', [1, 1, 1, 1, 1]);
                    setValue('appt_all', 1);
                  }
                };

                return (
                  <Stack>
                    <FormControlLabel
                      label="All Permission"
                      control={<Checkbox checked={isCheck} onChange={onCheckAll} />}
                    />
                    {APPOINTMENT_OPTION.map((option, index) => (
                      <FormControlLabel
                        key={option.value}
                        control={
                          <Checkbox
                            checked={field.value[index] === 1}
                            onChange={() =>
                              field.onChange(onChecked(index, Boolean(!field.value[index])))
                            }
                          />
                        }
                        label={option.label}
                      />
                    ))}
                  </Stack>
                );
              }}
            />

            {/* <RHFCheckbox name="appt_all" label="All Permission" />
            <RHFCheckbox name="appt_approve" label="Approved Appointments" />
            <RHFCheckbox name="appt_cancel" label="Cancel Appointments" />
            <RHFCheckbox name="appt_done" label="Done Appointments" />
            <RHFCheckbox name="appt_type" label="Change Appointment Type" />
            <RHFCheckbox name="appt_pay" label="Change Payment Status" /> */}
          </Stack>

          <Stack sx={{ mt: 3 }}>
            <Typography variant="subtitle2">Medical Records</Typography>

            <RHFCheckbox name="lab_result" label="Upload Laboratory and Imaging Result" />
            <RHFCheckbox name="pres_view" label="View Prescriptions" />
          </Stack>
          <Stack sx={{ mt: 3 }}>
            <Typography variant="subtitle2">Hmo Claims</Typography>

            <RHFCheckbox name="hmo_claim" label="Export Report" />
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
          Save Changes
        </LoadingButton>
      </DialogActions>
    </>
  );
}

// ----------------------------------------------------------------------

function areEqual(array1: number[], array2: number[]) {
  if (array1.length === array2.length) {
    return array1.every((element) => {
      if (array2.includes(element)) {
        return true;
      }

      return false;
    });
  }

  return false;
}
