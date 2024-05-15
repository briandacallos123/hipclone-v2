// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
// components
import { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function NoteNewFormSoapSubjective() {
  return (
    <Card>
      <CardHeader title="SUBJECTIVE" />

      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField name="chiefComplaint" label="Chief Complaints" multiline rows={3} />
        <RHFTextField name="history" label="History of Present Illness" multiline rows={3} />
      </Stack>
    </Card>
  );
}
