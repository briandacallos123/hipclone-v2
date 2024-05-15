// @mui
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// hooks
// types
import { IPatientObject } from 'src/types/patient';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { TableMobileRow } from 'src/components/table';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  onViewRow: VoidFunction;
};

export default function PatientTableRow({ row, onViewRow }: Props) {
  const upMd = useResponsive('up', 'md');

  const fullName = `${row.patientInfo?.FNAME} ${row.patientInfo?.LNAME}`;
  // console.log('asdasdasd', row);

  if (!upMd) {
    return (
      <TableMobileRow
        menu={[
          {
            label: 'View',
            icon: 'solar:eye-bold',
            func: () => onViewRow(),
          },
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
        {row?.patientInfo?.userInfo?.display_picture[0] ? (
            <Avatar
              alt={row?.patientInfo?.FNAME}
              src={row?.patientInfo?.userInfo?.display_picture[0].filename.split('public')[1]}
              sx={{ mr: 2 }}
            >
              {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={row?.patientInfo?.FNAME}  sx={{ mr: 2 }}>
              {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
            </Avatar>
          )}
          {/* <Avatar alt={fullName} sx={{ mr: 2 }}>
            {fullName.trim().charAt(0).toUpperCase()}
          </Avatar> */}

          <ListItemText
            primary={
              <>
                <Typography variant="subtitle2">{fullName}</Typography>
                <Iconify
                  icon={
                    (row.patientInfo?.SEX === 1 && 'solar:men-bold-duotone') ||
                    (row.patientInfo?.SEX === 2 && 'solar:women-bold-duotone') ||
                    'solar:question-circle-bold-duotone'
                  }
                  width={18}
                  height={18}
                  sx={{
                    ml: 0.5,
                    color:
                      (row.patientInfo?.SEX === 1 && 'info.main') ||
                      (row.patientInfo?.SEX === 2 && 'error.main') ||
                      'warning.main',
                  }}
                />
              </>
            }
            secondary={
              <>
                <Typography variant="caption">{row.patientInfo?.EMAIL}</Typography>
                <Typography variant="caption">{`${row.patientInfo?.CONTACT_NO}`}</Typography>
              </>
            }
            primaryTypographyProps={{ display: 'flex', alignItems: 'center' }}
            secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
          />
        </div>
      </TableMobileRow>
    );
  }

  return (
    <TableRow hover>
      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        {row?.patientInfo?.userInfo?.display_picture[0] ? (
            <Avatar
              alt={row?.patientInfo?.FNAME}
              src={row?.patientInfo?.userInfo?.display_picture[0].filename.split('public')[1]}
              sx={{ mr: 2 }}
            >
              {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={row?.patientInfo?.FNAME}  sx={{ mr: 2 }}>
              {row?.patientInfo?.FNAME.charAt(0).toUpperCase()}
            </Avatar>
          )}

          <ListItemText
            primary={fullName}
            secondary={row.patientInfo?.HOME_ADD}
            sx={{ cursor: 'pointer' }}
            primaryTypographyProps={{ typography: 'subtitle2' }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
            onClick={() => onViewRow()}
          />
        </div>
      </TableCell>

      <TableCell>{row.patientInfo?.EMAIL}</TableCell>

      <TableCell>{`${row.patientInfo?.CONTACT_NO}`}</TableCell>

      <TableCell align="center">
        <Label
          variant="soft"
          color={
            (row.patientInfo?.SEX === 1 && 'info') ||
            (row.patientInfo?.SEX === 2 && 'error') ||
            'warning'
          }
        >
          {row.patientInfo?.SEX === 1 ? 'Male' : 'Female'}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1 }}>
        <Tooltip title="View Details" placement="top" arrow>
          <IconButton onClick={() => onViewRow()}>
            <Iconify icon="solar:clipboard-text-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
