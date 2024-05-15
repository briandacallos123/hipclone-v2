// @mui
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IEmrItem } from 'src/types/emr';
// components
import Iconify from 'src/components/iconify';
import { TableMobileRow } from '@/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// import { Avatar } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------
type StyledTableRowProps = {
  isPending: boolean;
};

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop: any) => prop !== 'isPending',
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

type Props = {
  row: any;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onLinkRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function EmrTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onLinkRow,
  onDeleteRow,
}: Props) {
  const upMd = useResponsive('up', 'md');

  const { fname, mname, lname, contact_no, email, link, status, patientRelation, gender } = row;
  // console.log(row, 'data');
  const confirm = useBoolean();

  const popover = usePopover();

  const fullName = `${fname} ${lname}`;

  const linkFullName = mname ? `${fname} ${mname} ${lname}` : `${fname} ${lname}`;

  const isLinked = Number(link);

  const linkStatus = status ? `Linked to ${linkFullName}` : 'Unlinked';

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
          menu={[
            {
              label: 'Delete',
              icon: 'solar:trash-bin-trash-bold',
              func: confirm.onTrue,
              color: 'error',
            },
            { label: 'View', icon: 'solar:eye-bold', func: onViewRow },
            {
              label: !status ? 'Link' : 'Unlink',
              icon: !status
                ? 'solar:link-minimalistic-2-bold'
                : 'solar:link-broken-minimalistic-bold',
              func: onLinkRow,
            },
          ]}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {row?.patientRelation?.userInfo[0]?.display_picture[0] ? (
              <Avatar
                alt={fullName}
                src={
                  row?.patientRelation?.userInfo[0]?.display_picture[0].filename.split('public')[1]
                }
                sx={{ mr: 2 }}
              >
                {fullName.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <Avatar alt={fullName} sx={{ mr: 2 }}>
                <Avatar sx={{ textTransform: 'capitalize' }}>{fullName[0]}</Avatar>
              </Avatar>
            )}
            <ListItemText
              primary={
                <>
                  <Typography variant="subtitle2">{fullName}</Typography>
                  <Iconify
                    icon={
                      (gender === '1' && 'solar:men-bold-duotone') ||
                      (gender === '2' && 'solar:women-bold-duotone') ||
                      'solar:question-circle-bold-duotone'
                    }
                    width={18}
                    height={18}
                    sx={{
                      ml: 0.5,
                      color:
                        (gender === '1' && 'info.main') ||
                        (gender === '2' && 'error.main') ||
                        'warning.main',
                    }}
                  />
                </>
              }
              secondary={
                <>
                  <Typography variant="caption">{email}</Typography>
                  <Typography variant="caption" color={isLinked ? 'success.main' : 'error'}>
                    {isLinked ? (
                      <>
                        {(() => {
                          let text: any;
                          if (isLinked) {
                            if (patientRelation?.MNAME) {
                              text = `${patientRelation?.FNAME} ${patientRelation?.MNAME} ${patientRelation?.LNAME}`;
                            } else {
                              text = `${patientRelation?.FNAME}  ${patientRelation?.LNAME}`;
                            }
                          }
                          return isLinked !== 0 && `(linked to existing patient ${text})`;
                        })()}
                      </>
                    ) : (
                      'Unlinked'
                    )}
                  </Typography>
                </>
              }
              primaryTypographyProps={{
                typography: 'subtitle2',
                display: 'flex',
                alignItems: 'center',
              }}
              secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
            />
          </div>
        </TableMobileRow>

        {renderConfirm}
      </>
    );
  }

  // const { FNAME, MNAME, LNAME, SUFFIX } = ;

  return (
    <>
      <StyledTableRow isPending={row?.tempAdd === 1} hover>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          {row?.patientRelation?.userInfo[0]?.display_picture[0] ? (
            <Avatar
              alt={row?.patientRelation?.FNAME}
              src={
                row?.patientRelation?.userInfo[0]?.display_picture[0].filename.split('public')[1]
              }
              sx={{ mr: 2 }}
            >
              {row?.patientRelation?.FNAME.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={fullName} sx={{ mr: 2 }}>
              <Avatar sx={{ textTransform: 'capitalize' }}>{fullName[0]}</Avatar>
            </Avatar>
          )}
          {/* <Avatar alt={fullName} src={fullName || ''}>
            {fullName?.charAt(0).toUpperCase()}
          </Avatar> */}
          {/* <Avatar sx={{ textTransform: 'capitalize' }}>{fullName[0]}</Avatar> */}

          <TableCell
            sx={{
              typography: 'subtitle2',
              textTransform: 'capitalize',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {fullName}

            <Typography sx={{ color: 'success.main', ml: 1 }}>
              {(() => {
                let text: any;
                if (isLinked) {
                  if (patientRelation?.MNAME) {
                    text = `${patientRelation?.FNAME} ${patientRelation?.MNAME} ${patientRelation?.LNAME}`;
                  } else {
                    text = `${patientRelation?.FNAME}  ${patientRelation?.LNAME}`;
                  }
                }
                return isLinked !== 0 && `(linked to existing patient ${text})`;
              })()}
            </Typography>
          </TableCell>
        </Stack>

        <TableCell sx={{ color: !patientRelation && !contact_no ? 'error.main' : 'success.main' }}>
          {patientRelation ? patientRelation?.CONTACT_NO : contact_no}
          {!patientRelation && !contact_no && 'No contact provided'}
        </TableCell>

        <TableCell sx={{ color: !patientRelation && !contact_no ? 'error.main' : 'success.main' }}>
          {patientRelation ? patientRelation?.EMAIL : email}
          {!patientRelation && !email && 'No email provided'}
        </TableCell>

        <TableCell align="center">
          <Iconify
            icon={isLinked ? 'solar:check-circle-outline' : 'solar:close-circle-outline'}
            sx={{
              m: 0,
              width: 20,
              height: 20,
              color: 'success.main',
              ...(!isLinked && { color: 'error.main' }),
            }}
          />
        </TableCell>

        {/* <Stack direction="row" alignItems="center" spacing={0.1}>
          {isLinked === 1 && <Avatar>{patientRelation?.FNAME[0]}</Avatar>}
          <TableCell
            sx={{ color: patientRelation === null && link === '0' ? 'error.main' : 'success.main' }}
          >
            {(() => {
              let text: any;
              if (isLinked) {
                if (patientRelation?.MNAME) {
                  text = `${patientRelation?.FNAME} ${patientRelation?.MNAME} ${patientRelation?.LNAME}`;
                } else {
                  text = `${patientRelation?.FNAME}  ${patientRelation?.LNAME}`;
                }
              } else {
                text = 'No linked account';
              }
              return text;
            })()}
            {/* {isLinked
              ? `${patientRelation?.FNAME} ${patientRelation?.MNAME} ${patientRelation?.LNAME}`
              : 'No linked account'} */}
        {/* </TableCell>
        </Stack> */}
        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </StyledTableRow>

      {!row?.tempAdd && (
        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="right-top"
          sx={{ width: 160 }}
        >
          {link === '0' && (
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
          )}

          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>

          {row?.link !== 1 && (
            <MenuItem
              onClick={() => {
                onLinkRow();
                popover.onClose();
              }}
            >
              <Iconify
                icon={
                  !status ? 'solar:link-minimalistic-2-bold' : 'solar:link-broken-minimalistic-bold'
                }
              />
              {!status ? 'Link' : 'Unlink'}
            </MenuItem>
          )}
        </CustomPopover>
      )}

      {renderConfirm}
    </>
  );
}
