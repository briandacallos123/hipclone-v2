// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useRouter } from 'src/routes/hook';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export default function GotoDashboard({ sx }: Props) {

  const router = useRouter();

  const GotoLink = () => {
      router.push('/dashboard')
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
