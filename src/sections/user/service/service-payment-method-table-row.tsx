// @mui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { TableMobileRow } from 'src/components/table';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { styled, alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

type IUserPaymentItem = {
  id: string;
  name: string;
  accountNumber: string;
  instruction: string;
};

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: IUserPaymentItem;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

type StyledTableRowProps = {
  isPending: boolean;
};

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'isPending',
})<StyledTableRowProps>(({ isPending, theme }) => ({
  backgroundColor: 'inherit',
  transition: theme.transitions.create('all', {
    duration: '2s',
  }),
  ...(isPending && {
    backgroundColor: theme.palette.primary.lighter,
    '&:MuiTableRow-hover:hover': {
      backgroundColor: theme.palette.primary.lighter,
    },
    transition: theme.transitions.create('all', {
      duration: '300ms',
    }),
  }),
}));

export default function ServicePaymentMethodTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const upMd = useResponsive('up', 'md');
  // console.log('ROW: ', row);
  // const { name, accountNumber, instruction } = row;
  const { title: name, acct: accountNumber, description: instruction } = row;

  const test = (tester, toTest) => {
    tester = tester?.toString();
    const containsTester = new RegExp(`${toTest}`, 'i').test(tester);
    // console.log('CONTAINS: ', containsTester);
    return containsTester;
    // const containsTester = /\`${tester}\`/.test(inputValue);
  };

  // console.log(test('a', 'ian'));
  // console.log(test('z', 'gi'));

  const iconSrc =
    // (checkWord(name, 'BDO') && '/assets/icons/payment/bdo.jpg') ||
    (test(name, 'BDO') && '/assets/icons/payment/bdo.jpg') ||
    // (name === 'TEST' && '/assets/icons/payment/bdo.jpg') ||
    (test(name, 'BPI') && '/assets/icons/payment/bpi.jpg') ||
    (test(name, 'Philam') && '/assets/icons/payment/philam.jpg') ||
    (test(name, 'PayMaya') && '/assets/icons/payment/paymaya.jpg') ||
    '/assets/icons/payment/gcash.jpg';

  const confirm = useBoolean();

  const popover = usePopover();

  const renderConfirm = (
    <ConfirmDialog
      open={confirm.value}
      onClose={confirm.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Delete
        </Button>
      }
    />
  );

  // console.log('ROW: ', row);

  if (!upMd) {
    return (
      <>
        <TableMobileRow
          selected={selected}
          onSelectRow={onSelectRow}
          menu={[
            {
              label: 'Edit',
              icon: 'solar:pen-bold',
              func: onEditRow,
            },
            {
              label: 'Delete',
              icon: 'solar:trash-bin-trash-bold',
              func: confirm.onTrue,
              color: 'error',
            },
          ]}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={iconSrc} alt={name} sx={{ mr: 2 }}>
              {name.charAt(0).toUpperCase()}
            </Avatar>

            <ListItemText
              primary={accountNumber}
              secondary={name}
              primaryTypographyProps={{ typography: 'subtitle2' }}
              secondaryTypographyProps={{ typography: 'caption' }}
            />
          </div>
        </TableMobileRow>

        {renderConfirm}
      </>
    );
  }

  return (
    <>
      <StyledTableRow hover isPending={row?.client === 1}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={iconSrc} alt={name} sx={{ mr: 1.5 }}>
              {name?.charAt(0)?.toUpperCase()}
            </Avatar>

            <ListItemText
              primary={name}
              primaryTypographyProps={{ typography: 'body2', whiteSpace: 'nowrap' }}
            />
          </div>
        </TableCell>

        <TableCell sx={{ typography: 'subtitle2' }}>{accountNumber}</TableCell>

        <TableCell sx={{ typography: 'caption' }}>{instruction}</TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </StyledTableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      {renderConfirm}
    </>
  );
}
