// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IUserSubaccountItem } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { TableMobileRow } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  isLoading: any;
  setLoading: any;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function SubaccountTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  isLoading,
  setLoading,

}: Props) {
  const upMd = useResponsive('up', 'md');
  
  const theme = useTheme();
  // const { firstName, lastName, phoneNumber, email, status, position, avatarUrl } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  // const fullName = `${firstName} ${lastName}`;

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

  

  if (!upMd) {
    return (
      <>
        <TableMobileRow
          selected={selected}
          onSelectRow={onSelectRow}
          menu={[
            {
              label: 'View',
              icon: 'solar:eye-bold',
              func: onViewRow,
            },
            {
              label: 'Edit',
              icon: 'solar:pen-bold',
              func: onEditRow,
            },

            // {
            //   label: 'Delete',
            //   icon: 'solar:trash-bin-trash-bold',
            //   func: confirm.onTrue,
            //   color: 'error',
            // },
          ]}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
          {row?.subAccountInfo?.userInfo?.display_picture?.[0] && (
            <>
              {row?.subAccountInfo?.userInfo?.display_picture?.[0] ? (
                <Avatar
                  alt={row?.subAccountInfo?.fname}
                  src={row?.subAccountInfo?.userInfo?.display_picture?.[0]?.filename.split('public')[1]}
                  sx={{ mr: 2 }}
                >
                  {row?.subAccountInfo?.fname.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar alt={row?.subAccountInfo?.fname} sx={{ mr: 2 }}>
                  {row?.subAccountInfo?.fname.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </>
          )}
          
            {/* <Avatar alt={row?.subAccountInfo?.fname}  sx={{ mr: 2 }}>
              {row?.subAccountInfo?.fname.charAt(0).toUpperCase()}
            </Avatar> */}

            <ListItemText
              primary={`${row?.subAccountInfo?.fname} ${row?.subAccountInfo?.lname} ${row?.subAccountInfo?.lname}`}
              secondary={
                <>
                  <Typography variant="caption">{row?.subAccountInfo?.email}</Typography>
                  <div>
                    <Label variant="soft" color={(row?.status === 1 && 'success') || (row?.status === 0 && 'error')}>
                    {(row?.status === 1 && 'Active') || (row?.status === 0 && 'Inactive')}
                    </Label>
                  </div>
                </>
              }
              primaryTypographyProps={{ typography: 'subtitle2' }}
              secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
            />
          </div>
        </TableMobileRow>

        

        {renderConfirm}
      </>
    );
  }

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center' }}>
          {row?.subAccountInfo?.userInfo?.display_picture?.[0] ? (
            <Avatar
              alt={row?.subAccountInfo?.fname}
              src={row?.subAccountInfo?.userInfo?.display_picture?.[0].filename.split('public')[1]}
              sx={{ mr: 2 }}
            >
              {row?.subAccountInfo?.fname.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={row?.subAccountInfo?.fname} sx={{ mr: 2 }}>
              {row?.subAccountInfo?.fname.charAt(0).toUpperCase()}
            </Avatar>
          )}

            <ListItemText
              primary={`${row?.subAccountInfo?.fname} ${row?.subAccountInfo?.lname} ${row?.subAccountInfo?.lname}`}
              secondary={row?.subAccountInfo?.occupation}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
            />
          </div>
        </TableCell>

        <TableCell>{row?.subAccountInfo?.email}</TableCell>

        <TableCell>{row?.subAccountInfo?.mobile_no}</TableCell>

        <TableCell align="center">
          <Label  variant="soft" 
                  color={(row?.status === 1 && 'success') || (row?.status === 0 && 'error') || 'success'}>
                  {(row?.status === 1 && 'Active') || (row?.status === 0 && 'Inactive')}
          </Label>
        </TableCell>

        <TableCell align="center" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>


        {isLoading 
        ? <LoadingButton
        loading={isLoading}
         >
        <Iconify icon="solar:pen-bold" />
        Edit
        </LoadingButton>
        : <MenuItem
        onClick={() => {
          onEditRow();
          popover.onClose();
        }}
      >
        <Iconify icon="solar:pen-bold" />
        Edit
      </MenuItem>}

        

        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}
      </CustomPopover>

      {renderConfirm}
    </>
  );
}
