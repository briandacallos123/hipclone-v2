import { format } from 'date-fns';
// @mui
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// _mock
import { _doctorList, _hospitals } from 'src/_mock';
// hooks
import { fDateTime } from 'src/utils/format-time';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IPrescriptionItem } from 'src/types/prescription';
// components
import Iconify from 'src/components/iconify';
import { TableMobileRow } from 'src/components/table';
import Label from '@/components/label';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  onViewRow: VoidFunction;
};

export default function PrescriptionTableRow({ row, onViewRow }: Props) {
  const upMd = useResponsive('up', 'md');
  const {user} = useAuthContext(  )
  // console.log(row, 'row@@ ');

  // const { prescriptionNumber, date, hospitalId, doctor } = row;

  // const keyHospital = _hospitals.filter((_) => _.id === hospitalId)[0];

  // const keyDoctor = _doctorList.filter((_) => _.id === doctor.id)[0].doctor;

  const fullName = `${row?.patient?.FNAME} ${row?.patient?.MNAME}, ${row?.patient?.LNAME}`;

  if (!upMd) {
    return (
      <TableMobileRow
        menu={[
          {
            label: 'View',
            icon: 'solar:eye-bold',
            func: onViewRow,
          },
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Iconify icon="healthicons:rx-outline" height={60} width={60} sx={{ mr: 1 }} />

          <ListItemText
            primary={`#${row?.ID}`}
            secondary={
              <>
                <Typography variant="caption">{row?.clinicInfo?.clinic_name}</Typography>
                <Typography variant="caption">{row?.DATE}</Typography>
              </>
            }
            primaryTypographyProps={{ typography: 'subtitle2', color: 'primary.main' }}
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
          <Iconify icon="healthicons:rx-outline" height={48} width={48} sx={{ mr: 1 }} />

          <Typography
            variant="subtitle2"
            sx={{ color: 'primary.main', textTransform: 'capitalize' }}
          >
            {`#${row?.ID}`}
          </Typography>
        </div>
      </TableCell>

      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {row?.doctorInfo?.user?.[0]?.display_picture?.[0] && (
            <>
              {row?.doctorInfo?.user?.[0]?.display_picture?.[0] ? (
                <Avatar
                  alt={row?.doctorInfo?.EMP_FULLNAME}
                  src={row?.doctorInfo?.user?.[0]?.display_picture?.[0]?.filename.split('public')[1]}
                  sx={{ mr: 2 }}
                >
                  {row?.doctorInfo?.EMP_FULLNAME.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar alt={row?.doctorInfo?.EMP_FULLNAME} sx={{ mr: 2 }}>
                  {row?.doctorInfo?.EMP_FULLNAME.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </>
          )}
          {/* <Avatar alt={row?.doctorInfo?.EMP_FULLNAME} sx={{ mr: 2 }}>
            {row?.doctorInfo?.EMP_FULLNAME.trim().charAt(0).toUpperCase()}
          </Avatar> */}

          <ListItemText
            primary={row?.doctorInfo?.EMP_FULLNAME}
            // primary={''}

            primaryTypographyProps={{ typography: 'subtitle2' }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </div>
      </TableCell>

      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {row?.clinicInfo?.clinicDPInfo?.[0] ? (
            <Avatar
              alt={row?.clinicInfo?.clinic_name}
              src={row?.clinicInfo?.clinicDPInfo?.[0].filename.split('public')[1]}
              sx={{mr: 2}}
            >
              {row?.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
              
            </Avatar>
          ) : (
            <Avatar alt={row?.clinicInfo?.clinic_name}  sx={{mr: 2}}>
               <Avatar sx={{ textTransform: 'capitalize' }}>
                {row?.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
               </Avatar>
            </Avatar>
          )}
          {/* <Avatar alt="keyHospital.name" sx={{ mr: 2 }}>
            {row?.doctorInfo?.DoctorClinics?.clinic_name?.trim().charAt(0).toUpperCase()}
          </Avatar> */}

          <ListItemText
            primary={row?.clinicInfo?.clinic_name}
            // primary={''}
            secondary={row?.clinicInfo?.location}
            // secondary={''}
            primaryTypographyProps={{ typography: 'subtitle2' }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </div>
      </TableCell>

      {user?.role === 'patient' &&  <TableCell>
              <Label variant="soft" >
                      {row?.presCode ? row?.presCode:"empty" }
                  </Label>
            </TableCell>}

      <TableCell>{row?.DATE}</TableCell>
      {/* <TableCell>{''}</TableCell> */}

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="View Details" placement="top" arrow>
          <IconButton onClick={() => onViewRow()}>
            <Iconify icon="solar:clipboard-text-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

function timestampToDate(timestamp: any) {
  // Parse the timestamp string to a number (if it's a string)
  const timestampNumber = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;

  // Check if the parsed timestamp is a valid number
  if (!isNaN(timestampNumber)) {
    // Convert the timestamp to a Date object
    const date = new Date(timestampNumber);

    // Define options for formatting the date
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    // Format the date as "Month Day, Year"
    const formattedDate = date.toLocaleDateString(undefined, options);

    return formattedDate;
  } 
    return 'Invalid Timestamp';
  
}
