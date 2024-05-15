// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
//
import { NextAuthRegisterView } from 'src/sections/auth';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export default function SignupButton({ sx }: Props) {
  const open = useBoolean();

  return (
    <>
      <Button
        onClick={open.onTrue}
        // component={RouterLink}
        // href={paths.auth.register}
        variant="contained"
        color="primary"
        sx={{ mr: 1, ...sx }}
      >
        New patient? Signup
      </Button>

      <NextAuthRegisterView open={open.value} onClose={open.onFalse} />
    </>
  );
}
