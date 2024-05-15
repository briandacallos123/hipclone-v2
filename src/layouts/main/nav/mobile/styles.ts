// @mui
import { styled, alpha } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';

// ----------------------------------------------------------------------

export const LinkItem = styled(ListItemButton)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  height: 48,
  '&:hover': {
    ...theme.typography.subtitle2,
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
  },
}));
