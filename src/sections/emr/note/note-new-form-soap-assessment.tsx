import { useFormContext, useFieldArray } from 'react-hook-form';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import InputAdornment from '@mui/material/InputAdornment';
// components
import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function NoteNewFormSoapAssessment() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'remarkAssessment',
  });

  const handleAdd = () => {
    append({ message: '' });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <Card>
      <CardHeader title="ASSESSMENT" />

      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField name="diagnosis" label="Diagnosis" multiline rows={3} />

        <Stack spacing={2}>
          {fields.map((item, index) => (
            <RHFTextField
              key={item.id}
              fullWidth
              name={`remarkAssessment[${index}].message`}
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
      </Stack>
    </Card>
  );
}
