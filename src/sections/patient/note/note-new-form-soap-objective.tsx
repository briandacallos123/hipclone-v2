import { useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';

// components
import Iconify from 'src/components/iconify';
import { RHFRadioGroup, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const PHYSICAL_EXAM = [
  { label: 'General Appearance / BMI', value: 'bmi' },
  { label: 'Skin', value: 'skin' },
  { label: 'HEENT', value: 'heent' },
  { label: 'Teeth', value: 'teeth' },
  { label: 'Neck', value: 'neck' },
  { label: 'Lungs', value: 'lung' },
  { label: 'Heart', value: 'heart' },
  { label: 'Abdomen', value: 'abdomen' },
  { label: 'GU System', value: 'guSystem' },
  { label: 'Musculoskeletal Functioning', value: 'musculoskeletal' },
  { label: 'Back / Spine', value: 'back' },
  { label: 'Neurological', value: 'neurological' },
  { label: 'Psychiatric', value: 'psychiatric' },
];

// ----------------------------------------------------------------------

export default function NoteNewFormSoapObjective() {
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'remarkObjective',
  });

  const upMd = useResponsive('up', 'md');

  const values = watch();



  useEffect(() => {
    setValue(`bodyMass`, Number(values.weight / (values.height * 0.01) ** 2));
  }, [setValue, values.weight, values.height]);

  const handleAdd = () => {
    append({ message: '' });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const renderVital = (
    <div>
      <Typography variant="overline" color="text.disabled">
        Vitals
      </Typography>
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(5, 1fr)',
        }}
        sx={{ pt: 2 }}
      >
        <RHFTextField
          type="number"
          name="weight"
          label="Weight"
          placeholder="0"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
        />

        <RHFTextField
          type="number"
          name="height"
          label="Height"
          placeholder="0"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: <InputAdornment position="end">cm</InputAdornment>,
          }}
        />

        <RHFTextField
          type="number"
          name="bodyMass"
          label="Body Mass Index"
          placeholder="0"
          value={values.bodyMass === 0 ? '' : values.bodyMass?.toFixed(2)}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            readOnly: true,
            endAdornment: <InputAdornment position="end">kg/m2</InputAdornment>,
          }}
        />

        <RHFTextField
          type="number"
          name="bloodPressureMm"
          label="Blood Pressure (mm)"
          placeholder="0"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: <InputAdornment position="end">mm</InputAdornment>,
          }}
        />

        <RHFTextField
          type="number"
          name="bloodPressureHg"
          label="Blood Pressure (Hg)"
          placeholder="0"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: <InputAdornment position="end">Hg</InputAdornment>,
          }}
        />

        <RHFTextField
          type="number"
          name="oxygen"
          label="Oxygen Saturation"
          placeholder="0"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />

        <RHFTextField
          type="number"
          name="respiratory"
          label="Respiratory Rate"
          placeholder="0"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: <InputAdornment position="end">breathes/min</InputAdornment>,
          }}
        />

        <RHFTextField
          type="number"
          name="heartRate"
          label="Heart Rate"
          placeholder="0"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
          }}
        />

        <RHFTextField
          type="number"
          name="temperature"
          label="Body Temperature"
          placeholder="0"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: <InputAdornment position="end">°C</InputAdornment>,
          }}
        />
      </Box>
    </div>
  );

  const renderVision = (
    <div>
      <Typography variant="overline" color="text.disabled">
        Vision
      </Typography>
      <Box
        rowGap={3}
        columnGap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: '2fr 1fr 1fr',
        }}
        sx={{ pt: 2 }}
      >
        <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
          <RHFTextField
            type="number"
            name="visionLeft"
            label="Left"
            placeholder="0"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
            }}
          />

          <RHFTextField
            type="number"
            name="visionRight"
            label="Right"
            placeholder="0"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
            }}
          />
        </Box>

        <RHFRadioGroup
          name="pupil"
          label="Pupils"
          options={[
            { label: 'Equal', value: 'equal' },
            { label: 'Unequal', value: 'unequal' },
          ]}
          row
          sx={{ '& .MuiFormControlLabel-root': { mr: 4 } }}
        />

        <RHFRadioGroup
          name="lense"
          label="Glasses/Lenses"
          options={[
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ]}
          row
          sx={{ '& .MuiFormControlLabel-root': { mr: 4 } }}
        />
      </Box>
    </div>
  );

  const renderHearing = (
    <Stack>
      <Typography variant="overline" color="text.disabled">
        Hearing
      </Typography>
      <RHFRadioGroup
        name="hearing"
        options={[
          { label: 'Normal', value: '1' },
          { label: 'Impaired', value: '2' },
          { label: 'Hearing Aid', value: '3' },
        ]}
        row
        sx={{ '& .MuiFormControlLabel-root': { mr: 4 } }}
      />
    </Stack>
  );

  const renderExam = (
    <Stack spacing={1}>
      <Typography variant="overline" color="text.disabled">
        Physical Exam
      </Typography>
      <Paper
        sx={{
          p: 2,
          bgcolor: 'background.neutral',
        }}
      >
        <Stack spacing={2}>
          {PHYSICAL_EXAM.map((field) => (
            <Box
              key={field.label}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: '1fr 4fr',
              }}
            >
              <RHFRadioGroup
                row
                name={`${field.value}.option`}
                label={field.label}
               
                options={[
                  { label: 'Normal', value: 'normal' },
                  { label: 'Abnormal', value: 'abnormal' },
                ]}
                sx={{
                  '& .MuiFormControlLabel-root': { mr: { xs: 2, lg: 4 } },
                }}
              />

              <RHFTextField name={`${field.value}.comment`} label="Comment" />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );

  const renderRemark = (
    <Stack spacing={2}>
      {fields.map((item, index) => (
        <RHFTextField
          key={item.id}
          fullWidth
          name={`remarkObjective[${index}].message`}
          label="Remarks"
          multiline
          minRows={1}
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

      <Stack direction="row" justifyContent="flex-start">
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Add Remark
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <Card>
      <CardHeader title="OBJECTIVE" />

      <Stack spacing={3} sx={{ p: 3 }}>
        {renderVital}

        {renderVision}

        {renderHearing}

        {renderExam}

        {renderRemark}
      </Stack>
    </Card>
  );
}
