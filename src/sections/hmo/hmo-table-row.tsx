import { format } from 'date-fns';
// @mui
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
// types
import { IHmoItem } from 'src/types/hmo';
// components
import { useResponsive } from 'src/hooks/use-responsive';
import { TableMobileRow } from '@/components/table';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Badge from '@mui/material/Badge';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function HmoTableRow({ row, selected, onSelectRow, onViewRow }: Props) {
  // const { patient, schedule, hmo, type } = row;

  // console.log(row,'rowrow')
  const upMd = useResponsive('up', 'md');
  const fullName = `${row.patientHmoInfo?.patient?.FNAME} ${row.patientHmoInfo?.patient?.MNAME} ${row.patientHmoInfo?.patient?.LNAME}`;
  if (!upMd) {
    return (
      <TableMobileRow
        selected={selected}
        onSelectRow={onSelectRow}
        menu={[
          {
            label: 'View',
            icon: 'solar:eye-bold',
            func: onViewRow,
          },
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={row.hmoInfo?.name}
            src={row?.avatarUrl}
            sx={{ mr: 2, height: '50px', width: '50px' }}
          >
            {row.hmoInfo?.name.charAt(0).toUpperCase()}
          </Avatar>

          <ListItemText
            primary={
              <>
                <Typography variant="body2">{`${row.hmoInfo?.name} (${row.member_id})`}</Typography>
              </>
            }
            secondary={
              <>
                <Typography variant="caption">
                  {format(new Date(row.date_appt), 'dd MMM yyyy')}&nbsp;({row.time_appt})
                </Typography>
                <Stack direction="row" spacing={1} sx={{ typography: 'caption' }}>
                  <Label variant="soft" color={(row?.type === 1 && 'success') || 'info'}>
                    {row?.type === 1 ? 'telemedicine' : 'face-to-face'}
                  </Label>
                  <Label
                    color={(row?.payment_status && 'success') || 'error'}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {row?.payment_status ? 'paid' : 'unpaid'}
                  </Label>
                </Stack>
              </>
            }
            primaryTypographyProps={{
              display: 'flex',
              flexDirection: 'row',
              color: 'primary.main'
            }}
            secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
          />
        </div>
      </TableMobileRow>
    );
  }

  return (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {row?.appointmentInfo?.patientInfo[0].userInfo[0].display_picture[0] ? (
            <Avatar
              alt={row?.appointmentInfo?.patientInfo[0].FNAME}
              src={
                row?.appointmentInfo?.patientInfo[0].userInfo[0].display_picture[0].filename.split(
                  'public'
                )[1]
              }
              sx={{ mr: 2 }}
            >
              {row?.appointmentInfo?.patientInfo[0].FNAME.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={row?.appointmentInfo?.patientInfo[0].FNAME} sx={{ mr: 2 }}>
              {row?.appointmentInfo?.patientInfo[0].FNAME.charAt(0).toUpperCase()}
            </Avatar>
          )}
          {/* <Avatar alt={row.patientHmoInfo?.patient?.FNAME}  sx={{ mr: 2 }}>
            {row.patientHmoInfo?.patient?.FNAME.charAt(0).toUpperCase()}
          </Avatar> */}

          <ListItemText
            primary={row.member_id}
            secondary={`${row.patientHmoInfo?.patient?.FNAME} ${row.patientHmoInfo?.patient?.MNAME} ${row.patientHmoInfo?.patient?.LNAME}`}
            primaryTypographyProps={{ typography: 'subtitle2', color: 'primary.main' }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'body2',
            }}
          />
        </div>
      </TableCell>

      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={row.hmoInfo?.name} sx={{ mr: 2 }}>
            {row.hmoInfo?.name.charAt(0).toUpperCase()}
          </Avatar>

          <ListItemText
            primary={row.hmoInfo?.name}
            primaryTypographyProps={{ typography: 'subtitle2', color: 'primary.main' }}
          />
        </div>
      </TableCell>

      {/* <TableCell>{row.hmo_details?.name}</TableCell> */}

      <TableCell>
        <ListItemText
          primary={format(new Date(row.date_appt), 'dd MMM yyyy')}
          secondary={row.time_appt}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center">
        <Label variant="soft" color={(row.payment_type === 'cheque' && 'info') || 'warning'}>
          {row.payment_type}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Label variant="soft" color={(row.export_stat === 1 && 'success') || 'error'}>
          {row.export_stat === 1 ? 'YES' : 'NO'}
        </Label>
      </TableCell>

      <TableCell align="center" sx={{ px: 1 }}>
        <Tooltip title="View Details" placement="top" arrow>
          <Badge
            badgeContent={row.appointmentInfo?.appt_hmo_attachment?.length || 0}
            color="primary"
          >
            <IconButton onClick={() => onViewRow()}>
              <Iconify icon="solar:clipboard-text-bold" />
            </IconButton>
          </Badge>
          {/* <IconButton onClick={() => onViewRow()}>
            <Iconify icon="solar:clipboard-text-bold" />
          </IconButton> */}
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
