// @mui
import { styled } from '@mui/material/styles';
import Link from '@mui/material/Link';

// ----------------------------------------------------------------------

export const LinkItem = styled(Link)(({ theme }) => ({
  ...theme.typography.subtitle1,
  color: theme.palette.text.primary,
  transition: theme.transitions.create('color', {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    textDecoration: 'none',
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
  },
}));
