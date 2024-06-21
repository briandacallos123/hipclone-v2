// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useRouter } from 'src/routes/hook';
import { useAuthContext } from '@/auth/hooks';
import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export default function GotoDashboard({ sx }: Props) {
  const {user} = useAuthContext()
  const router = useRouter();

  // console.log(user,'USERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR')

  const GotoLink = () => {
      switch(user?.role){
        case "merchant":
          router.push(paths.merchant.dashboard);
          break;

        case "admin":
          router.push(paths.admin.dashboard);
          break;

        default:
          router.push('/dashboard')
      }
  }

  return (
    <>
      <Button
        onClick={()=>GotoLink()}
        variant="outlined"
        color="primary"
        sx={{ mr: 1, ...sx }}
      >
        Go to Dashboard
      </Button>
    </>
  );
}
