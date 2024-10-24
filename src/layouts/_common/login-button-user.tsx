// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
//
import { NextAuthLoginView } from 'src/sections/auth';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
  id?: string;
};

export default function LoginButton({ sx, id }: Props) {
  const open = useBoolean();

  return (
    <>
      <Button
        onClick={open.onTrue}
        // component={RouterLink}
        // href={paths.auth.login}
        variant="outlined"
        color="primary"
        sx={{ mr: 1, ...sx }}
      >
        Login As Patient
      </Button>

      <NextAuthLoginView open={open.value} onClose={open.onFalse} id={id} />
    </>
  );
}
