// @mui
import Stack from '@mui/material/Stack';
//
import { NavProps } from '../types';
import NavItem from './nav-item';

// ----------------------------------------------------------------------

export default function NavDesktop({ data }: NavProps) {
  return (
    <Stack
      component="nav"
      direction="row"
      alignItems="center"
      spacing={5}
      sx={{ mr: 2.5, height: 1 }}
    >
      {data.map((link) => (
        <NavItem key={link.title} item={link} />
      ))}
    </Stack>
  );
}
