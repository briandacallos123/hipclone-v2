// @mui
import { alpha, styled, SxProps, Theme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
// components
import Iconify from '../iconify/iconify';
import CustomPopover, { usePopover } from '../custom-popover';

// ----------------------------------------------------------------------

type StyledCardProps = {
  isSelected?: boolean;
};

const StyledCard = styled(CardHeader, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<StyledCardProps>(({ isSelected, theme }) => ({
  padding: theme.spacing(1),
  transition: theme.transitions.create(['background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    background: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
  },
  ...(isSelected && {
    background: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
  }),
}));

// ----------------------------------------------------------------------

interface Props extends CardProps {
  children?: React.ReactNode;
  menu?: {
    label: string;
    icon: string;
    func: VoidFunction;
    color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  }[];
  button?: React.ReactNode;
  selected?: boolean;
  onSelectRow?: VoidFunction;
  sx?: SxProps<Theme>;
}

export default function TableMobileRow({
  selected,
  onSelectRow,
  children,
  menu,
  button,
  sx,
  ...other
}: Props) {
  const popover = usePopover();

  return (
    <>
      <TableRow>
        <TableCell sx={{ p: 0 }}>
          <StyledCard
            component={Card}
            title={
              <div style={{  alignItems: 'flex-start' }}>
                {onSelectRow && (
                  <Checkbox checked={selected} onClick={onSelectRow} sx={{ p: 0, mr: 2 }} />
                )}

                {children}
              </div>
            }
            action={
              menu ? (
                <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              ) : (
                button
              )
            }
            isSelected={selected}
            sx={{ ...sx }}
            {...other}
          />
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        {menu?.map((action) => (
          <MenuItem
            key={action.label}
            onClick={() => {
              action.func();
              popover.onClose();
            }}
            sx={{ color: `${action.color}.main` }}
          >
            <Iconify icon={action.icon} />
            {action.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
