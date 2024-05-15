import { forwardRef } from 'react';
//
import { NavItemDesktopProps } from '../types';
import { LinkItem } from './styles';

// ----------------------------------------------------------------------

const NavItem = forwardRef<HTMLDivElement, NavItemDesktopProps>(({ item }) => {
  const { title, path } = item;

  return <LinkItem href={`/${path}`}>{title}</LinkItem>;
});

export default NavItem;
