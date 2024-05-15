import { format } from 'date-fns';
import { PDFViewer } from '@react-pdf/renderer';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
// _mock
import { _doctorList, _hospitals } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IImagingItem } from 'src/types/document';
// components
import Iconify from 'src/components/iconify';
//
import ProfileImagingPDF from './imaging-pdf';

// ----------------------------------------------------------------------

type Props = {
  row: IImagingItem;
};

export default function ProfileImagingTableRow({ row }: Props) {
  const { labName, type, date, doctor, hospitalId } = row;

  const keyDoctor = _doctorList.filter((_) => _.id === doctor.id)[0].doctor;

  const keyHospital = _hospitals.filter((_) => _.id === hospitalId)[0];

  const view = useBoolean();

  const fullName = `${keyDoctor.firstName} ${keyDoctor.lastName}, ${keyDoctor.title}`;

  return (
    <>
      <TableRow hover>
        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={fullName} src={keyDoctor.avatarUrl} sx={{ mr: 2 }}>
              {fullName.charAt(0).toUpperCase()}
            </Avatar>

            <ListItemText primary={fullName} primaryTypographyProps={{ typography: 'subtitle2' }} />
          </div>
        </TableCell>

        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={keyHospital.name} src={keyHospital.avatarUrl} sx={{ mr: 2 }}>
              {keyHospital.name.charAt(0).toUpperCase()}
            </Avatar>

            <ListItemText
              primary={keyHospital.name}
              secondary={keyHospital.address}
              primaryTypographyProps={{ typography: 'subtitle2' }}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'caption',
              }}
            />
          </div>
        </TableCell>

        <TableCell>{labName}</TableCell>

        <TableCell>{format(new Date(date), 'dd MMM yyyy')}</TableCell>

        <TableCell sx={{ color: 'primary.main', textTransform: 'capitalize' }}>{type}</TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <Tooltip title="View Details" placement="top" arrow>
            <IconButton onClick={view.onTrue}>
              <Iconify icon="solar:clipboard-text-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <Dialog fullScreen open={view.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <ProfileImagingPDF item={row} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
