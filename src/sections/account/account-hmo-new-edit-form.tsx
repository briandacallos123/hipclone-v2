import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
// types
import MenuItem from '@mui/material/MenuItem';
import { IUserProfileHmo } from 'src/types/user';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
import { useMutation } from '@apollo/client';
import { CREATE_HMO } from '@/libs/gqls/hmo';
import { NexusGenInputs } from 'generated/nexus-typegen';
// ----------------------------------------------------------------------

type FormValuesProps = IUserProfileHmo;

type Props = {
  onClose: VoidFunction;
  currentItem?: IUserProfileHmo;
  hmoList?: any;
  d?: any;
  refetch?: any;
};

export default function AccountHmoNewEditForm({
  refetch,
  d,
  hmoList: list,
  currentItem,
  onClose,
}: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [hmoList, setHmoList] = useState([]);

  console.log('D: ', d);
  console.log('List: ', list);
  console.log('hmoList: ', hmoList);

  useEffect(() => {
    if (d && list) {
      setHmoList((prev) => {
        const docHmo = d;
        const listOfHmo = list;
        const filteredData: any = [];
        listOfHmo?.forEach((i: any) => {
          const parentId = Number(i.id);
          let shouldAdd = true; // Initialize a flag to true
          docHmo?.forEach((j: any) => {
            const childId = Number(j.id);
            if (parentId === childId) {
              shouldAdd = false; // Set the flag to false if there's a match
            }
          });
          if (shouldAdd) {
            filteredData.push(i); // Add i to filteredData if the flag is still true
          }
        });
        console.log(filteredData, '?');
        return filteredData;
      });
    }
  }, []);

  const UpdateUserSchema = Yup.object().shape({
    // name: Yup.string().required('Name is required'),
    // mid: Yup.string().required('Member ID is required'),
  });

  const [create_hmo] = useMutation(CREATE_HMO);
  const [snackKey, setSnackKey] = useState(null);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['HmoMutationInput']) => {
      const data: NexusGenInputs['HmoMutationInput'] = {
        id: model.id,
      };
      create_hmo({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          const { data } = res;
          closeSnackbar(snackKey);
          enqueueSnackbar('Updated successfully!');

          refetch();
        })
        .catch((error) => {
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          // runCatch();
        });
    },
    [snackKey]
  );

  const defaultValues = useMemo(
    () => ({
      id: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentItem]
  );

  const methods = useForm<typeof defaultValues>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (snackKey) {
      (async () => {
        let myIds: any = [];

        d?.forEach((i: any) => {
          if (!myIds.includes(i?.id)) {
            myIds.push(Number(i?.id));
          }
        });
        myIds = [...myIds, values.id];
        await handleSubmitValue({
          id: myIds,
        });
        setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      try {
        // reset();
        // enqueueSnackbar('Saving items');

        const snackbarKey = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'SavingHMO',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);

        onClose();
        console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [currentItem, enqueueSnackbar, reset, onClose]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <RHFSelect name="id" label="Hmo List">
          <MenuItem value="" />

          {hmoList?.map((i) => (
            <MenuItem value={i?.id}>{i?.name}</MenuItem>
          ))}
        </RHFSelect>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {currentItem ? 'Update' : 'Create'}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
