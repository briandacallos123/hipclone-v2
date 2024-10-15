import { useMemo, useCallback, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { isEqual } from 'lodash';
import { useForm, FieldValues, Controller, CustomRenderInterface } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useMutation, useQuery } from '@apollo/client';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { DR_CLINICS } from 'src/libs/gqls/drprofile';
import { POST_NOTES_LAB } from 'src/libs/gqls/notes/notesLabReq';

import { get_Allprocedure, GET_PROCEDURES_NEW } from 'src/libs/gqls/payProcedure';
// _mock
import { _hospitals } from 'src/_mock';
// components
import EmptyContent from 'src/components/empty-content';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
  RHFRadioGroup,
} from 'src/components/hook-form';
import { useResponsive } from '@/hooks/use-responsive';
import { useBoolean } from 'src/hooks/use-boolean';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { CardHeader } from '@mui/material';
import { useSessionStorage } from '@/hooks/use-sessionStorage';
// import Iconify from '@/components/iconify/iconify';

// ----------------------------------------------------------------------

// const REQUEST_OPTIONS = [
//   { group: 'Covid 19 Test', items: ['RT-PCR COVID-19 Test'] },
//   {
//     group: 'Electrolytes',
//     items: ['CALCIUM-TOTAL', 'CALCIUM-IONIZED', 'INORGANIC PHOSPHORUS', 'ABG', 'TOTAL IRON'],
//   },
//   {
//     group: 'Chemistry Packages',
//     items: ['CHEM 5', 'LIPID PROFILE', 'SGOT, SGPT, ALKAPHOS, TPAG, BILI', 'KIDNEY PROFILE'],
//   },
// ];

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  refIds: any;
  refetch: any;
  editData?:any;
  closeTab?:any;
  qrImage?:any;
  clinicData?:any;
}

type StyledPaperProps = {
  active: boolean;
};

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'active',
})<StyledPaperProps>(({ active, theme }) => ({
  padding: theme.spacing(1),
  minWidth: 80,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  border: '2px solid transparent',
  cursor: 'pointer',
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create(['border', 'color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    color: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.light}`,
  },
  ...(active && {
    color: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.main}`,
  }),
}));

const TextFieldStyle = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    input: {
      color: theme.palette.common.black,
    },
    background: theme.palette.common.white,
    '& fieldset, &:hover fieldset, &.Mui-focused fieldset': {
      borderColor: theme.palette.common.black,
    },
  },
}));
export default function NoteNewFormLaboratory({clinicData, qrImage, editData, onClose, refIds, refetch: onRefetch }: Props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [snackKey, setSnackKey]: any = useState(null);
  const { getItem } = useSessionStorage();
  const {
    data: getData,
    error: getError,
    loading: getLoad,
    refetch: procedureFetch,
  }: any = useQuery(GET_PROCEDURES_NEW);

  const [procedureData, setProcedureData] = useState<any[]>([]);
  const [tempData, setTempData] = useState<any[]>([]);

  useEffect(() => {
    if (getData) {
      const { QueryAllprocedures } = getData;

      const temps = QueryAllprocedures.map((procedure: any) => ({
        items: procedure.payment_procedures.map((payment: any) => ({
          id: payment.id,
          name: payment.name,
        })),
      }));
      setTempData(temps);

      const formattedData = QueryAllprocedures.map((procedure: any) => ({
        group: procedure.name,
        items: procedure.payment_procedures.map((payment: any) => ({
          id: payment.id,
          name: payment.name,
        })),
      }));
      setProcedureData(formattedData);
    }
  }, [getData]);
  console.log(
    '@@@@',
    procedureData.map((i) => i)
  );

  const initialSelectedItems = {};
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const [category, setCategory] = useState<string>('');

  const handleChangeSeriesData = (event: object, value: string) => {
    setCategory(value);
    // console.log('PAYLOAD', value);
  };
  const handleChangeGroup = (data: any) => {
    setCategory(data);
    // console.log('PAYLOAD', event.target.value);
  };


  const isMd = useResponsive('up', 'md');

  // const [category, setCategory] = useState<string>('');

  // const handleChangeSeriesData = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setCategory(event.target.value);
  // };

  const NewNoteSchema = Yup.object().shape({
    hospitalId: Yup.number().nullable().required('Hospital ID is required'),

    selection: Yup.array()
      .min(1, 'At least one selection is required')
      .of(Yup.string().required('Each selection must have a value')),

    fastingHour: Yup.number()
      .required('Fasting Hour is required')
      .integer('Fasting Hour must be an integer')
      .min(0, 'Fasting Hour must be greater than or equal to 0'),

    other: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      hospitalId:editData?.clinicInfo?.id && Number(editData?.clinicInfo?.id)  || null,
      selection:editData?.procedures || [],
      fastingHour:editData?.fasting ||  null,
      other: editData?.others ||'',
      
    }),
    []
  );

  const methods = useForm<FieldValues>({
    resolver: yupResolver(NewNoteSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


 
  const values = watch();

  // useEffect(() => {
  //   const data = getItem('defaultFilters');
  //   if (data?.clinic) {
  //     setValue('hospitalId', Number(data?.clinic?.id));
  //   }
  // }, []);

  // console.log('data: ', values);

  const [createLabReq] = useMutation(POST_NOTES_LAB);

  
  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: NexusGenInputs['NotesLabInputType'] = {
        clinic: Number(model.hospitalId),
        patientID: Number(refIds?.S_ID),

        R_TYPE: String(5),
        procedures: model.selection, // array
        fasting: Number(model.fastingHour),
        others: String(model.other),
      };
      createLabReq({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          enqueueSnackbar('Create success!');
          // refetch();
          reset();
          onRefetch();
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          console.log(error, 'ano error?');
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });
    },
    [createLabReq, enqueueSnackbar, refIds?.S_ID, reset, snackKey]
  );

  const [myData, setMyData]: any = useState(null);
  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({ ...myData });
        // setSnackKey(null);
      })();
    }
  }, [snackKey, myData]);

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      try {
        // await handleSubmitValue({
        //   ...data,
        // });
        onClose();
        const snackbarKey: any = enqueueSnackbar('Saving Data...', {
          variant: 'info',
          key: 'savingNotesLab',
          persist: true, // Do not auto-hide
        });
        setSnackKey(snackbarKey);
        setMyData(data);
        reset();
        // console.info('DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, handleSubmitValue, onClose, reset]
  );

  // const REQUEST_OPTIONS: any = [];
  // const [category, setCategory] = useState<string>(
  //   REQUEST_OPTIONS.length > 0 ? REQUEST_OPTIONS[0].group : ''
  // );
  // procedureData.forEach((procedure) => {
  //   const category1 = procedure.payment_procedures_category?.name || 'Other';
  //   const item = {
  //     id: procedure.id,
  //     name: procedure.name,
  //   };

  //   const existingCategory = REQUEST_OPTIONS.find((option: any) => option.group === category);

  //   if (existingCategory) {
  //     existingCategory.items.push(item);
  //   } else {
  //     REQUEST_OPTIONS.push({ group: category1, items: [item] });
  //   }
  // });
  // const findProcedureNameById = (procedureId) => {
  //   const procedure = tempData.find((item) =>
  //     item.items.some((payment) => payment.id === procedureId)
  //   );
  //   if (procedure) {
  //     const payment = procedure.items.find((payment) => payment.id === procedureId);
  //     return payment ? payment.name : '';
  //   }
  //   return '';
  // };

  // console.log('@@@@@@@---', findProcedureNameById(3));
  // console.log('tempData', procedureData);
  const procedureFlatData = procedureData.flatMap((_) => [..._.items.flatMap((_i: any) => _i)]);
  // console.log('procedureFlatData', procedureFlatData);

  function reader(value: string) {
    const data = procedureFlatData.filter((_) => _.id === value)[0].name;

    return data;
  }

  const [selectId, setSelectId] = useState('');
  const open = useBoolean();
  const handleSelect = useCallback(
    (id: string) => {
      open.onTrue();
      setSelectId(id);
    },
    [open, setSelectId]
  );

  const [oneCard, setOnCard] = useState(false);
  const [expand, setExpand] = useState(false);

  const handleExpand = () => {
    setExpand(!expand);
  };
  const renderOption = (
    <Card sx={{ p: 3 }}>
      <Controller
        name="selection"
        control={control}
        render={({ field }: CustomRenderInterface) => {
          const onSelected = (newValue: string) =>
            field.value.includes(newValue)
              ? field.value.filter((value: string) => value !== newValue)
              : [...field.value, newValue];

          return (
            <Stack
              spacing={{ xs: 2, md: 5 }}
              direction={{ xs: 'column', md: 'row' }}
              divider={
                <Divider
                  flexItem
                  orientation={isMd ? 'vertical' : 'horizontal'}
                  sx={{ borderStyle: 'dashed' }}
                />
              }
            >
              <Stack sx={{ width: 1 }}>
                {isMd || expand ? (
                  <>
                    <Box
                      rowGap={3}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(3, 1fr)',
                        sm: 'repeat(6, 1fr)',
                        md: 'repeat(8, 1fr)',
                      }}
                      sx={{ mt: 1, mb: 3 }}
                    >
                      {procedureData.map((i: any) => (
                        <StyledPaper
                          key={i.group}
                          onClick={() => handleChangeGroup(i.group)}
                          active={isEqual(category, i.group)}
                        >
                          <Iconify icon={iconsData(i.group)} width={20} sx={{ mb: 1 }} />

                          <Typography sx={{ fontSize: '8px' }}>{i.group}</Typography>
                        </StyledPaper>
                      ))}
                    </Box>
                    {!isMd && (
                      <Typography
                        variant="button"
                        sx={{ color: 'primary.main', justifySelf: 'flex-end' }}
                        onClick={() => handleExpand()}
                      >
                        See less
                      </Typography>
                    )}
                  </>
                ) : (
                  <>
                    <Stack direction="row" justifyContent="space-between" sx={{ pb: 2 }}>
                      <Typography variant="subtitle1">Categories</Typography>
                      <Typography
                        variant="button"
                        sx={{ color: 'primary.main' }}
                        onClick={() => handleExpand()}
                      >
                        See all
                      </Typography>
                    </Stack>
                    <Stack direction="row" sx={{ overflow: 'auto', mb: 1, pb: 1 }} spacing={2}>
                      {procedureData.map((i: any) => (
                        <StyledPaper
                          key={i.group}
                          onClick={() => handleChangeGroup(i.group)}
                          active={isEqual(category, i.group)}
                        >
                          <Iconify icon={iconsData(i.group)} width={20} sx={{ mb: 1 }} />

                          <Typography sx={{ fontSize: '8px' }}>{i.group}</Typography>
                        </StyledPaper>
                      ))}
                    </Stack>
                  </>
                )}

                {/* <TextField
                  select
                  value={category}
                  SelectProps={{ native: true }}
                  onChange={handleChangeSeriesData}
                  sx={{
                    '& fieldset': { border: '0 !important' },
                    '& select': { pl: 1, py: 1, pr: '24px !important', typography: 'subtitle2' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0.75,
                      bgcolor: 'background.neutral',
                    },
                    '& .MuiNativeSelect-icon': { top: 7, right: 2, width: 20, height: 20 },
                  }}
                >
                  <option value="" style={{ color: 'grey' }}>
                    SELECT OPTION
                  </option>
                  {procedureData.map((item) => (
                    <option key={item.group} value={item.group}>
                      {item.group}
                    </option>
                  ))}
                </TextField> */}

                <Autocomplete
                  onChange={(e: any, value: string) => handleChangeSeriesData(e, value)}
                  options={procedureData.map((option) => option.group)}
                  getOptionLabel={(option) =>
                    procedureData.find((_) => _.group === option)?.group ?? ''
                  }
                  value={category}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderOption={(props, option) => {
                    const { group } = procedureData.filter((item) => item.group === option)[0];

                    if (!group) {
                      return null;
                    }

                    return (
                      <li {...props} key={group}>
                        {group}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextFieldStyle {...params} fullWidth placeholder="SELECT OPTION" />
                  )}
                />

                {procedureData
                  .filter((item) => item.group === category)
                  .map((selection) => (
                    <Box
                      key={selection.group}
                      // sx={{ mt: 1, WebkitColumnCount: 2, MozColumnCount: 2, columnCount: 2 }}
                      sx={{ mt: 1, overflowX: 'auto', pl: 1 }}
                      columnGap={1}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(2, 1fr)',
                        sm: 'repeat(6, 1fr)',
                        md: 'repeat(2, 1fr)',
                      }}
                    >
                      {selection.items.map((item: any) => (
                        <FormControlLabel
                          key={item.id}
                          control={
                            <Checkbox
                              checked={field.value.includes(item.id)}
                              onChange={() => field.onChange(onSelected(item.id))}
                            />
                          }
                          label={item.name}
                        />
                      ))}
                    </Box>
                  ))}
              </Stack>

              <Stack sx={{ width: 1 }}>
                {values.selection.length > 0 ? (
                  <>
                    <Typography variant="subtitle1">Selected Options</Typography>
                    <Box
                      sx={{
                        mt: 1,
                        WebkitColumnCount: { xs: 1, sm: 2 },
                        MozColumnCount: { xs: 1, sm: 2 },
                        columnCount: { xs: 1, sm: 2 },
                      }}
                    >
                      {values.selection.filter((i: any) => Number(i) <= 16).length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader
                            title={<Typography variant="body1">BLOOD CHEMISTRY</Typography>}
                          />

                          {values.selection
                            .filter((i: any) => Number(i) <= 16)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}

                      {values.selection.filter((i: any) => Number(i) <= 21 && Number(i) >= 17)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader
                            title={<Typography variant="body1">CHEMISTRY PACKAGES</Typography>}
                          />

                          {values.selection
                            .filter((i: any) => Number(i) <= 21 && Number(i) >= 17)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 35 && Number(i) >= 23)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader title={<Typography variant="body1">ENZYMES</Typography>} />
                          {values.selection
                            .filter((i: any) => Number(i) <= 35 && Number(i) >= 23)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 50 && Number(i) >= 36)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader
                            title={<Typography variant="body1">CLINICAL MICROSCOPY</Typography>}
                          />
                          {values.selection
                            .filter((i: any) => Number(i) <= 50 && Number(i) >= 36)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 62 && Number(i) >= 51)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader title={<Typography variant="body1">HEMATOLOGY</Typography>} />
                          {values.selection
                            .filter((i: any) => Number(i) <= 62 && Number(i) >= 51)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 78 && Number(i) >= 63)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader title={<Typography variant="body1">SEROLOGY</Typography>} />
                          {values.selection
                            .filter((i: any) => Number(i) <= 78 && Number(i) >= 63)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 89 && Number(i) >= 79)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader
                            title={<Typography variant="body1">24 HRS URINE TEST</Typography>}
                          />
                          {values.selection
                            .filter((i: any) => Number(i) <= 89 && Number(i) >= 79)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 99 && Number(i) >= 90)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader
                            title={<Typography variant="body1">ELECTROLYTES</Typography>}
                          />
                          {values.selection
                            .filter((i: any) => Number(i) <= 99 && Number(i) >= 90)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 104 && Number(i) >= 100)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader
                            title={<Typography variant="body1">THYROID FUNCTION TEST</Typography>}
                          />
                          {values.selection
                            .filter((i: any) => Number(i) <= 104 && Number(i) >= 100)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 118 && Number(i) >= 105)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader title={<Typography variant="body1">HEPATITIS</Typography>} />
                          {values.selection
                            .filter((i: any) => Number(i) <= 118 && Number(i) >= 105)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 126 && Number(i) >= 119)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader
                            title={<Typography variant="body1">TUMOR MARKER</Typography>}
                          />
                          {values.selection
                            .filter((i: any) => Number(i) <= 126 && Number(i) >= 119)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 135 && Number(i) >= 127)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader title={<Typography variant="body1">HORMONES</Typography>} />
                          {values.selection
                            .filter((i: any) => Number(i) <= 135 && Number(i) >= 127)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 143 && Number(i) >= 136)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader
                            title={<Typography variant="body1">BACTERIOLOGY</Typography>}
                          />
                          {values.selection
                            .filter((i: any) => Number(i) <= 143 && Number(i) >= 136)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 153 && Number(i) >= 144)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader
                            title={<Typography variant="body1">HISTOPHATOLOGY</Typography>}
                          />
                          {values.selection
                            .filter((i: any) => Number(i) <= 153 && Number(i) >= 144)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}

                      {values.selection.filter((i: any) => Number(i) <= 157 && Number(i) >= 154)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader title={<Typography variant="body1">X-RAY</Typography>} />
                          {values.selection
                            .filter((i: any) => Number(i) <= 157 && Number(i) >= 154)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 168 && Number(i) >= 158)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader
                            title={
                              <Typography variant="body1">X-RAY (UPPER EXTREMITIES)</Typography>
                            }
                          />
                          {values.selection
                            .filter((i: any) => Number(i) <= 168 && Number(i) >= 158)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}

                      {values.selection.filter((i: any) => Number(i) <= 188 && Number(i) >= 169)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader
                            title={
                              <Typography variant="body1">X-RAY (LOWER EXTREMITIES)</Typography>
                            }
                          />
                          {values.selection
                            .filter((i: any) => Number(i) <= 188 && Number(i) >= 169)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 210 && Number(i) >= 189)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader title={<Typography variant="body1">ULTRASOUND</Typography>} />
                          {values.selection
                            .filter((i: any) => Number(i) <= 210 && Number(i) >= 189)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) === 211).length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader
                            title={<Typography variant="body1">COVID19 TEST</Typography>}
                          />
                          {values.selection
                            .filter((i: any) => Number(i) === 211)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                      {values.selection.filter((i: any) => Number(i) <= 221 && Number(i) >= 212)
                        .length > 0 && (
                        <Card sx={{ p: 1, m: 1 }}>
                          <CardHeader
                            title={<Typography variant="body1">HEART STATION</Typography>}
                          />
                          {values.selection
                            .filter((i: any) => Number(i) <= 221 && Number(i) >= 212)
                            .map((item: string) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={field.value.includes(item)}
                                    onChange={() => field.onChange(onSelected(item))}
                                  />
                                }
                                label={<Typography variant="caption">{reader(item)}</Typography>}
                              />
                            ))}
                        </Card>
                      )}
                    </Box>
                  </>
                ) : (
                  <EmptyContent
                    title="No Data Selected"
                    sx={{
                      '& span.MuiBox-root': { height: 160 },
                    }}
                  />
                )}
                {values.selection.length > 0 && (
                  <Button
                    color="error"
                    onClick={() => setValue('selection', [])}
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  >
                    Clear
                  </Button>
                )}
              </Stack>
            </Stack>
          );
        }}
      />
    </Card>
  );

  return (
    <>
      <DialogContent sx={{ py: 3, bgcolor: 'background.neutral' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <RHFAutocomplete
              name="hospitalId"
              label="Hospital/Clinic"
              options={clinicData.map((hospital: any) => Number(hospital.id))}
              getOptionLabel={(option) =>
                clinicData.find((hospital: any) => Number(hospital.id) === Number(option))?.clinic_name
              }
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                const { id, clinic_name } = clinicData.filter(
                  (hospital: any) => hospital.id === option
                )[0];

                if (!id) {
                  return null;
                }

                return (
                  <li {...props} key={id}>
                    {clinic_name}
                  </li>
                );
              }}
              sx={{ pt: 1 }}
            />

            {renderOption}

            <RHFRadioGroup
              name="fastingHour"
              label="Fasting Hours"
              options={[
                { label: '6-8 Hours', value: 0 },
                { label: '8-10 Hours', value: 1 },
                { label: '10-12 Hours', value: 2 },
                { label: 'None', value: 3 },
              ]}
              row
              sx={{
                '& .MuiFormControlLabel-root': { mr: { xs: 2, lg: 4 } },
              }}
            />

            <RHFTextField name="other" label="Others" multiline rows={3} />
          </Stack>
        </FormProvider>
      </DialogContent>

      <DialogActions sx={{ p: 1.5 }}>
        <Button variant="outlined" onClick={()=>{
          onClose();
          reset();
        }}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </>
  );
}

function iconsData(data: string) {
  if (data === 'BLOOD CHEMISTRY') return 'fontisto:blood-test';
  if (data === 'CHEMISTRY PACKAGES') return 'fa6-solid:flask-vial';
  if (data === 'ENZYMES') return 'healthicons:enzyme-outline';
  if (data === 'CLINICAL MICROSCOPY') return 'ri:microscope-fill';
  if (data === 'HEMATOLOGY') return 'mdi:blood-bag';
  if (data === 'SEROLOGY') return 'covid:covid-carrier-blood-2';
  if (data === '24 HRS URINE TEST') return 'fluent-mdl2:test-explore-solid';

  if (data === 'ELECTROLYTES') return 'material-symbols:bloodtype';
  if (data === 'THYROID FUNCTION TEST') return 'healthicons:endocrinology-outline';
  if (data === 'HEPATITIS') return 'game-icons:liver';
  if (data === 'TUMOR MARKER') return 'game-icons:tumor';
  if (data === 'HORMONES') return 'ion:male-female-sharp';
  if (data === 'BACTERIOLOGY') return 'solar:bacteria-outline';
  if (data === 'HISTOPHATOLOGY') return 'game-icons:fleshy-mass';

  if (data === 'X-RAY') return 'mdi:x-ray-box-outline';
  if (data === 'X-RAY (UPPER EXTREMITIES)') return 'fluent-emoji-high-contrast:x-ray';
  if (data === 'X-RAY (LOWER EXTREMITIES)') return 'la:x-ray';
  if (data === 'ULTRASOUND') return 'medical-icon:i-ultrasound';
  if (data === 'COVID19 TEST') return 'covid:covid19-virus-1';
  if (data === 'HEART STATION') return 'healthicons:heart-cardiogram';
}
