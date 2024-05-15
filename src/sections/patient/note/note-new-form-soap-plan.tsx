import { useFormContext, useFieldArray } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import InputAdornment from '@mui/material/InputAdornment';
// components
import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function NoteNewFormSoapPlan() {
  const { control } = useFormContext();

  const {
    fields: remarkFields,
    append: remarkAppend,
    remove: remarkRemove,
  } = useFieldArray({
    control,
    name: 'remarkPlan',
  });

  const {
    fields: prescriptionFields,
    append: prescriptionAppend,
    remove: prescriptionRemove,
  } = useFieldArray({
    control,
    name: 'prescriptions',
  });

  const handleAddRemark = () => {
    remarkAppend({ message: '' });
  };

  const handleAddPrescription = () => {
    prescriptionAppend({
      MEDICINE: '',
      MED_BRAND: '',
      DOSE: '',
      FORM: '',
      QUANTITY: '',
      FREQUENCY: '',
      DURATION: '',
    });
  };

  const handleRemoveRemark = (index: number) => {
    remarkRemove(index);
  };

  const handleRemovePrescription = (index: number) => {
    prescriptionRemove(index);
  };

  const renderRemark = (
    <Stack spacing={2}>
      {remarkFields.map((item, index) => (
        <RHFTextField
          key={item.id}
          fullWidth
          name={`remarkPlan[${index}].message`}
          label="Remarks"
          multiline
          minRows={1}
          InputProps={{
            endAdornment: index !== 0 && (
              <InputAdornment position="end">
                <IconButton color="error" onClick={() => handleRemoveRemark(index)}>
                  <Iconify icon="solar:close-circle-bold" width={24} height={24} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      ))}

      <Stack direction="row" justifyContent="flex-start">
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAddRemark}
          sx={{ flexShrink: 0 }}
        >
          Add Remark
        </Button>
      </Stack>
    </Stack>
  );

  const renderPrescription = (
    <Stack spacing={2}>
      {prescriptionFields.map((item, index) => (
        <Paper
          key={item.id}
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 2,
            bgcolor: 'background.neutral',
          }}
        >
          <Iconify icon="healthicons:rx-outline" height={68} width={68} />

          <Box
            gap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            <RHFTextField
              size="small"
              name={`prescriptions[${index}].MEDICINE`}
              label="Generic Name"
            />

            <RHFTextField
              size="small"
              name={`prescriptions[${index}].MED_BRAND`}
              label="Brand Name"
            />

            <RHFTextField
              size="small"
              name={`prescriptions[${index}].DOSE`}
              label="Dosage (in mg)"
              placeholder="0"
            />

            <RHFTextField
              size="small"
              name={`prescriptions[${index}].FORM`}
              label="Form (e.g. tablet, etc.)"
            />

            <RHFTextField
              size="small"
              name={`prescriptions[${index}].QUANTITY`}
              label="Quantity"
              placeholder="0"
            />

            <RHFTextField
              size="small"
              name={`prescriptions[${index}].FREQUENCY`}
              label="Frequency (per day)"
              placeholder="0"
            />

            <RHFTextField
              size="small"
              name={`prescriptions[${index}].DURATION`}
              label="Duration (in days)"
              placeholder="0"
            />
            {/* //  */}

            <Stack direction="row" justifyContent="flex-end" alignItems="flex-end">
              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={() => handleRemovePrescription(index)}
              >
                Remove
              </Button>
            </Stack>
          </Box>
        </Paper>
      ))}

      <Stack direction="row" justifyContent="flex-start">
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAddPrescription}
          sx={{ flexShrink: 0 }}
        >
          Add Prescription
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <Card>
      <CardHeader title="PLAN" />

      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField name="plan" label="Medical Plan" multiline rows={3} />

        {renderRemark}

        {renderPrescription}
      </Stack>
    </Card>
  );
}
