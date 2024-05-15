// @mui
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  title?: string;
}

export default function ModalSplash({ title = 'Loading data...', sx, ...other }: Props) {
  return (
    <Stack
      spacing={1.5}
      alignItems="center"
      sx={{
        px: 3,
        py: 5,
        width: 1,
        minHeight: 1,
        ...sx,
      }}
      {...other}
    >
      <Typography variant="body1">{title}</Typography>

      <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 640 }} />
    </Stack>
  );
}
