// import Draggable from 'react-draggable';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  height: 'max-content',
  width: 'max-content',
  zIndex: theme.zIndex.modal,
  background: theme.palette.background.neutral,
  [theme.breakpoints.down('sm')]: {
    height: '100%',
    maxWidth: '100%',
  },
}));

// ----------------------------------------------------------------------

type Props = {
  id: string | null;
  open: boolean;
  onClose: VoidFunction;
};

export default function FloatingFrame({ id, open, onClose }: Props) {
  const theme = useTheme();

  const minimize = useBoolean(false);

  // console.log('minimize', minimize.value);

  const renderFrame = open && (
    <iframe
      title="telemedicine"
      src="https://connect2.hips-md.com/routes.php?short=f38gdxnktx"
      allow="camera *;microphone *"
      style={{ height: '100%', width: '100%' }}
    />
  );

  const renderButton = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1),
        ...(minimize.value && {
          top: 0,
          right: 0,
        }),
      }}
    >
      <IconButton onClick={!minimize.value ? minimize.onTrue : minimize.onFalse}>
        <Iconify
          icon={
            !minimize.value ? 'solar:minimize-square-3-outline' : 'solar:maximize-square-3-outline'
          }
          sx={{ transform: 'rotateY(180deg)' }}
        />
      </IconButton>

      <IconButton onClick={onClose}>
        <Iconify icon="solar:close-circle-outline" />
      </IconButton>
    </Stack>
  );

  if (minimize.value && open) {
    return (
      <StyledCard>
        {renderButton}

        {renderFrame}
      </StyledCard>
    );
  }

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open && !minimize.value}
      PaperProps={{
        sx: { position: 'relative', height: 600, maxWidth: 800 },
      }}
    >
      {renderButton}

      {renderFrame}
    </Dialog>
  );
}
