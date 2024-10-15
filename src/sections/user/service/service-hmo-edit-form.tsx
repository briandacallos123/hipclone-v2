import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller, CustomRenderInterface } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
// _mock
import { HMO_OPTIONS } from 'src/_mock';
// types
import { IUserService } from 'src/types/user';
// components
import { useResponsive } from 'src/hooks/use-responsive';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider from 'src/components/hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { CREATE_HMO } from '@/libs/gqls/hmo';
// ----------------------------------------------------------------------

type FormValuesProps = IUserService;

type HmoOptionProps = { name: string; id: string };

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentItem?: any;
  appendData?: any;
  onSuccess?: any;
  incrementTutsTab?:()=>void;
};

export default function ServiceHmoEditForm({
  appendData,
  refetch,
  currentItem,
  open,
  onClose,
  onSuccess,
  incrementTutsTab,
}: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const upMd = useResponsive('up', 'md');
  const [hmoList, setHmoList] = useState([]);
  const [CreateHmo] = useMutation(CREATE_HMO, {
    context: {
      requestTrackerId: 'HmoMutation[CreateMutation]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [toggleUpdate, setToggleUpdate] = useState(false);

  const [myHmo, setMyHmo] = useState([]);

  // console.log(myHmo, 'myHmo@@@');

  const UpdateUserSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      // hmo: currentItem?.Hmo?.hmo.flatMap((_) => [_.id]) ?? [],
      hmo: currentItem?.Hmo?.hmo.flatMap((_) => [_.id]) ?? [],
    }),
    [currentItem]
  );

  const [snackKey, setSnackKey] = useState(null);

  const methods = useForm<any>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

const currentStep = localStorage.getItem('currentStep');

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['HmoMutationInput']) => {
      const data: NexusGenInputs['HmoMutationInput'] = {
        id: model?.id,
      };
      CreateHmo({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          if (snackKey) {
            const { data } = res;
            // console.log(data, 'data to');
            // reset();
            onSuccess(data);
            closeSnackbar(snackKey);
            enqueueSnackbar('Updated Successfully');
            setToggleUpdate(false);
            if(currentStep && Number(currentStep) !== 100){
              localStorage.setItem('currentStep','11');
              incrementTutsTab()
            }
            // refetch();
          }
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          // runCatch();
        });
    },
    [snackKey]
  );

  const values = watch();
  // console.log('HMO SA DEFAULT: ', values);

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          id: values?.hmo.map((i) => Number(i)),
        });
        setSnackKey(null);
      })();
    }
  }, [snackKey]);

  useEffect(() => {
    if (currentItem?.Hmo) {
      setHmoList(currentItem?.Hmo?.HmoList);
      setMyHmo(currentItem?.Hmo?.hmo.flatMap((_) => [_.id]));
      setValue(
        'hmo',
        currentItem?.Hmo?.hmo?.map((i) => i.id)
      );
    }
  }, [currentItem?.Hmo]);

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        setToggleUpdate(true);
        appendData(values);

        const snackbarKey = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingEducation',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);

        // await new Promise((resolve) => setTimeout(resolve, 500));
        // enqueueSnackbar('Update success!');
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
    [values]
  );

  // const categorizeArray = (array: any): { group: any; items: any }[] => {
  //   const map: { [key: string]: any } = array.reduce((func: any, value: any) => {
  //     const char: string = value?.charAt(0)?.toUpperCase();

  //     func[char] = [].concat(func[char] || [], value);

  //     return func;
  //   }, {});

  //   const result = Object.keys(map).map((element) => ({
  //     group: element,
  //     items: map[element],
  //   }));

  //   return result;
  // };
  const categorizeArray = (
    array: HmoOptionProps[]
  ): { group: string; items: HmoOptionProps[] }[] => {
    const map: { [key: string]: HmoOptionProps[] } = array.reduce(
      (func: any, value: HmoOptionProps) => {
        const char: string = value.name.charAt(0).toUpperCase();

        func[char] = [].concat(func[char] || [], value);

        return func;
      },
      {}
    );

    const result = Object.keys(map).map((element) => ({
      group: element,
      items: map[element],
    }));

    return result;
  };

  return (
    <Dialog
      fullScreen={!upMd}
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <DialogTitle>
        <Typography variant="h6">HMO Accreditation</Typography>
        <Typography variant="body2" color="text.disabled">
          Choose the accredited HMO for patients to reflect
        </Typography>
      </DialogTitle>

      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="hmo"
            control={control}
            value={myHmo && myHmo}
            render={({ field }: CustomRenderInterface) => {
              const onSelected = (option: string) =>
                field.value.includes(option)
                  ? field.value.filter((value: any) => value !== option)
                  : [...field.value, option];

              return (
                hmoList &&
                categorizeArray(hmoList).map((accordion) => (
                  <Accordion key={accordion.group}>
                    <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                      <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
                        {accordion.group}
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Stack sx={{ m: 0 }}>
                        {accordion.items.map((item) => (
                          <FormControlLabel
                            key={item.id}
                            control={
                              <Checkbox
                                checked={field.value.includes(item.id.toString())}
                                onChange={() => field.onChange(onSelected(item.id.toString()))}
                              />
                            }
                            // label={
                            //   <Stack spacing={1} direction="row">
                            //     <Image
                            //       src={item.icon}
                            //       alt={item.name}
                            //       ratio="1/1"
                            //       sx={{ maxHeight: 12, maxWidth: 12, borderRadius: 0.5 }}
                            //     />
                            //     <Typography variant="body2">{item.name}</Typography>
                            //   </Stack>
                            // }
                            label={item.name}
                          />
                        ))}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))
              );
            }}
          />
        </FormProvider>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          disabled={toggleUpdate}
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
