// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
//
import { MerchantView } from 'src/sections/auth';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
  id?: string;
  isLoggedIn?: any;
  setLoggedIn?: any;
};

export default function MerchantButton({ setLoggedIn, isLoggedIn, sx, id }: Props) {
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
        Merchant? Login
      </Button>

      <MerchantView
        isLoggedIn={isLoggedIn}
        setLoggedIn={setLoggedIn}
        open={open.value}
        onClose={open.onFalse}
        id={id}
      />
    </>
  );
}
