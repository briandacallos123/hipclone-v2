// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  size?: "button" | "caption" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "inherit" | "subtitle1" | "subtitle2" | "body1" | "body2" | "overline" | undefined;
  sx?: SxProps<Theme>;
};


export default function HomeNoteFind({ size, sx, ...other }: Props) {
  return (
    <Typography
      variant={size}
      sx={{ ...sx, '& > a': { fontWeight: 'bold', color: (theme) => theme.palette.primary.main } }}
      {...other}
    >
      Need to consult? Find your doctor
      <Link href="#finddoctor" underline="none">
        {` here`}
      </Link>
      .
    </Typography>
  );
}
