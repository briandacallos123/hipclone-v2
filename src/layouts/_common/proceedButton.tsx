// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
// routes
// hooks
import { useRouter } from 'src/routes/hook';
import { useBoolean } from 'src/hooks/use-boolean';
//
import { paths } from 'src/routes/paths';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
  id?: string;
};

export default function Proceed({ sx, id }: Props) {
  const open = useBoolean();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  // console.log(user, 'USER@@');
  const GotoLink = () => {
    setLoading(true);
    if (user?.role !== 'doctor') {
      router.push(paths.dashboard.appointment.book(id));
    } else {
      router.push(paths.dashboard.root);
    }
  };

  return (
    <>
      <LoadingButton
        onClick={() => GotoLink()}
        // component={RouterLink}
        // href={paths.auth.login}
        variant="outlined"
        loading={loading}
        color="primary"
        sx={{ mr: 1, ...sx }}
      >
        Proceed
      </LoadingButton>

      {/* <NextAuthLoginView open={open.value} onClose={open.onFalse} id={id} /> */}
    </>
  );
}
