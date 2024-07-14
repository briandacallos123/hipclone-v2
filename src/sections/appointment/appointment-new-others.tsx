import { useCallback } from 'react';
import { useFormContext, Controller, CustomRenderInterface } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import CardHeader from '@mui/material/CardHeader';
import FormControlLabel from '@mui/material/FormControlLabel';
// _mock
import { HMO_OPTIONS } from 'src/_mock';
import { RHFTextField, RHFSwitch, RHFUpload, RHFSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const CHEIF_COMPLAINT_OPTIONS = [
  'Fever',
  'Dry Cough',
  'Tiredness',
  'Aches and Pains',
  'Sore Throat',
  'Diarrhea',
  'Conjunctivitis',
  'Headache',
  'Loss of Taste/Smell',
  'A rash on skin, or discolouration of fingers or toes',
  'Difficulty breathing or shortness of breath',
  'Chest Pain/Pressure',
  'Loss of Speech/Movement',
];

const ADDITIONAL_REQUEST_OPTIONS = [
  { label: 'Medical Certificate', value: 1 },
  { label: 'Medical Clearance', value: 2 },
  { label: 'Medical Abstract', value: 3 },
];

// ----------------------------------------------------------------------
type Props = {
  hmoData: any;
  values: any;
};

export default function AppointmentNewOthers({ values, hmoData }: Props) {
  const { control, setValue, getValues } = useFormContext();

  // const handleDrop = useCallback(
  //   (acceptedFiles: File[]) => {
  //     const file = acceptedFiles[0];

  //     const newFile = Object.assign(file, {
  //       preview: URL.createObjectURL(file),
  //     });

  //     if (file) {
  //       setValue('attachment', newFile, { shouldValidate: true });
  //     }
  //   },
  //   [setValue]
  // );

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.attachment || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('attachment', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.attachment]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('attachment', []);
  }, [setValue]);

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered =
        values.attachments && values.attachments?.filter((file: any) => file !== inputFile);
      setValue('attachment', filtered);
    },
    [setValue, values.attachments]
  );
  console.log(hmoData,'_________________HMO_________________________________________' );

  return (
    <>
      <Card>
        <CardHeader title="CHIEF COMPLAINTS" />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Controller
            name="chiefComplaint"
            control={control}
            render={({ field }: CustomRenderInterface) => {
              const onSelected = (option: string) =>
                field.value.includes(option)
                  ? field.value.filter((value: string) => value !== option)
                  : [...field.value, option];

              return (
                <Box
                  gap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(3, 1fr)',
                  }}
                >
                  {CHEIF_COMPLAINT_OPTIONS.map((item) => (
                    <FormControlLabel
                      key={item}
                      control={
                        <Checkbox
                          checked={field.value.includes(item)}
                          onChange={() => field.onChange(onSelected(item))}
                        />
                      }
                      label={item}
                    />
                  ))}
                </Box>
              );
            }}
          />
          <RHFTextField name="cheifOther" label="Other Complaints" fullWidth />
        </Stack>
      </Card>

      <Card>
        <CardHeader title="ADDITIONAL REQUEST" />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Controller
            name="additionalRequest"
            control={control}
            render={({ field }: CustomRenderInterface) => {
              const onSelected = (option: string) =>
                field.value.includes(option)
                  ? field.value.filter((value: string) => value !== option)
                  : [...field.value, option];

              return (
                <Box
                  gap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(3, 1fr)',
                  }}
                >
                  {ADDITIONAL_REQUEST_OPTIONS.map((item) => (
                    <FormControlLabel
                      key={item.label}
                      control={
                        <Checkbox
                          checked={field.value.includes(item.value)}
                          onChange={() => field.onChange(onSelected(item.value))}
                        />
                      }
                      label={item.label}
                    />
                  ))}
                </Box>
              );
            }}
          />
          <RHFTextField name="additionalOther" label="Other Request" fullWidth />
        </Stack>
      </Card>

      {hmoData?.length!==0 && (
        <Card>
          <CardHeader title="HMO ACCREDITATION (if applicable)" />

          <Stack alignItems="center" spacing={3} sx={{ p: 3 }}>
            <RHFSwitch name="useHmo" label="Do you want to use HMO for this appointment?" />

            {getValues('useHmo') && (
              <>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                  sx={{ width: '100%' }}
                >
                  <RHFSelect name="hmo.name" label="HMO Name">
                    {hmoData?.map((option: any) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>

                  <RHFTextField name="hmo.mid" label="Member ID" />
                </Box>

              
                <RHFUpload
                  multiple
                  thumbnail
                  name="attachment"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemoveFile}
                  onRemoveAll={handleRemoveAllFiles}
                  onUpload={() => console.info('ON UPLOAD')}
                />
              </>
            )}
          </Stack>
        </Card>
      )}
    </>
  );
}
