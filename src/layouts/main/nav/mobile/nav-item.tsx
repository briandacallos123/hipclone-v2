// @mui
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
//
import { NavItemMobileProps } from '../types';
import { LinkItem } from './styles';

// ----------------------------------------------------------------------

export default function NavItem({ item }: NavItemMobileProps) {
  const { title, path, icon } = item;

  return (
    <Link href={`/${path}`} underline="none">
      <LinkItem>
        <ListItemIcon> {icon} </ListItemIcon>

        <ListItemText disableTypography primary={title} />
      </LinkItem>
    </Link>
  );
}
