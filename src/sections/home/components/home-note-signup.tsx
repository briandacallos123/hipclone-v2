// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
//
import { NextAuthRegisterView } from 'src/sections/auth';

// ----------------------------------------------------------------------

type Props = {
  size?:
    | 'button'
    | 'caption'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'inherit'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'overline'
    | undefined;
  sx?: SxProps<Theme>;
};

export default function HomeNoteSignup({ size, sx, ...other }: Props) {
  const open = useBoolean();

  return (
    <>
      <Typography
        variant={size}
        sx={{
          ...sx,
          '& > span': { color: (theme) => theme.palette.primary.main },
          '& > a': {
            fontWeight: 'bold',
            cursor: 'pointer',
            color: (theme) => theme.palette.primary.main,
          },
        }}
        {...other}
      >
        <Typography component={Link} onClick={open.onTrue} sx={{ ...sx }}>
          Sign up
        </Typography>
        &nbsp;for<span>{` FREE `}</span>
        account now.
      </Typography>

      <NextAuthRegisterView open={open.value} onClose={open.onFalse} />
    </>
  );
}
