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
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import Badge from '@mui/material/Badge';
import { useTheme } from '@mui/material/styles';
// _mock
import { _doctorList, _hospitals } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IImagingItem } from 'src/types/document';
// components
import Iconify from 'src/components/iconify';
import { LogoFull } from 'src/components/logo';
import { TableMobileRow } from 'src/components/table';
//
import PatientImagingPDF from './imaging-pdf';
import { usePathname } from 'src/routes/hook';
import { useAuthContext } from 'src/auth/hooks';
import { TYPE_OPTIONS } from '../patient/imaging/type_option'; 
import { Stack } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  patientData: any;
};

export default function ImagingTableRow({ patientData, row }: any) {
  const pathname = usePathname();
  const isEMR = pathname.includes('my-emr');
  const upMd = useResponsive('up', 'md');
  const theme = useTheme();
  const { labName, type, date, doctor, hospitalId } = row;
  const { user } = useAuthContext();

  // const keyDoctor = _doctorList.filter((_) => _.id === doctor.id)[0].doctor;

  // const keyHospital = _hospitals.filter((_) => _.id === hospitalId)[0];

  const view = useBoolean();

  const isEmrData = () => {
    let text: any;

    // for patient
    if (!isEMR && row.clinicInfo?.clinic_name) {
      // for patnet
      text = (
        <>
          {row?.clinicInfo !== null ? (
                <Avatar
                  alt={isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
                  src={row?.clinicInfo?.clinicDPInfo?.[0]?.filename.split('public')[1]}
                  // src={row?.clinicInfo?.clinicDPInfo[0]?.display_picture[0].filename.split('public')[1] || row?.patientInfo?.userInfo[0]?.display_picture[0].filename.split('public')[1]}
                  sx={{ mr: 2 }}
                >
                    {isEMR
                    ? row.clinicInfo?.clinic_name.charAt(0).toUpperCase()
                    : row.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar
                  alt={isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
                  sx={{ mr: 2 }}
                >
                    {isEMR
                    ? row.clinicInfo?.clinic_name.charAt(0).toUpperCase()
                    : row.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
                </Avatar>
              )}
          {/* <Avatar
            alt={!isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
            // src={row?.patientInfo?.userInfo[0]?.display_picture[0].filename.split('public')[1] || ''}
            sx={{ mr: 2 }}
          >
            {!isEMR
              ? row.clinicInfo?.clinic_name.charAt(0).toUpperCase()
              : row.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
          </Avatar> */}
          {!isEMR && row.clinicInfo?.clinic_name ? (
            <ListItemText
              primary={!isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
              primaryTypographyProps={{ typography: 'subtitle2' }}
            />
          ) : (
            <Typography variant="subtitle2">Patient Upload</Typography>
          )}
        </>
      );
    } else {
      // for emr
      text = (
        <>
            {row?.clinicInfo === null ? (
                <Avatar
                  alt={isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
                  src={row?.patientInfo?.[0]?.userInfo?.[0]?.display_picture?.[0]?.filename.split('public')[1] || row?.patientInfo?.userInfo?.[0]?.display_picture?.[0]?.filename.split('public')[1]}
                  sx={{ mr: 2 }}
                >
                    {isEMR
                    ? row.clinicInfo?.clinic_name.charAt(0).toUpperCase()
                    : row.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar
                  alt={isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
                  src={row?.clinicInfo?.clinicDPInfo?.[0]?.filename.split('public')[1] || ''}
                  sx={{ mr: 2 }}
                >
                    {isEMR
                    ? row.clinicInfo?.clinic_name.charAt(0).toUpperCase()
                    : row.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
                </Avatar>
              )}

          {isEMR && row.clinicInfo?.clinic_name ? (
            <ListItemText
              primary={isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
              primaryTypographyProps={{ typography: 'subtitle2' }}
            />
          ) : (
            <Typography variant="subtitle2">Patient Upload</Typography>
          )}
        </>
      );
    }

    return text;
  };


  const isEmrDataMobile = () => {
    let text: any;

    // for patient
    if (!isEMR && row.clinicInfo?.clinic_name) {
      // for patnet
      text = (
        <>
          {row?.clinicInfo !== null ? (
                <Avatar
                  alt={isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
                  src={row?.clinicInfo?.clinicDPInfo?.[0]?.filename.split('public')[1]}
                  // src={row?.clinicInfo?.clinicDPInfo[0]?.display_picture[0].filename.split('public')[1] || row?.patientInfo?.userInfo[0]?.display_picture[0].filename.split('public')[1]}
                  sx={{ mr: 2 }}
                >
                </Avatar>
              ) : (
                <Avatar
                  alt={isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
                  sx={{ mr: 2 }}
                >
                </Avatar>
              )}
          {/* <Avatar
            alt={!isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
            // src={row?.patientInfo?.userInfo[0]?.display_picture[0].filename.split('public')[1] || ''}
            sx={{ mr: 2 }}
          >
            {!isEMR
              ? row.clinicInfo?.clinic_name.charAt(0).toUpperCase()
              : row.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
          </Avatar> */}
          {!isEMR && row.clinicInfo?.clinic_name ? (
            <></>
          ) : (
            <></>
            // <Typography variant="subtitle2">Patient Upload</Typography>
          )}
        </>
      );
    } else {
      // for emr
      text = (
        <>
            {row?.clinicInfo === null ? (
                <Avatar
                  alt={isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
                  src={row?.patientInfo?.[0]?.userInfo?.[0]?.display_picture?.[0]?.filename.split('public')[1] || row?.patientInfo?.userInfo?.[0]?.display_picture?.[0]?.filename.split('public')[1]}
                  sx={{ mr: 2 }}
                >
                    {/* {isEMR
                    ? row.clinicInfo?.clinic_name.charAt(0).toUpperCase()
                    : row.clinicInfo?.clinic_name.charAt(0).toUpperCase()} */}
                </Avatar>
              ) : (
                <Avatar
                  alt={isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
                  src={row?.clinicInfo?.clinicDPInfo?.[0]?.filename.split('public')[1] || ''}
                  sx={{ mr: 2 }}
                >
                    {/* {isEMR
                    ? row.clinicInfo?.clinic_name.charAt(0).toUpperCase()
                    : row.clinicInfo?.clinic_name.charAt(0).toUpperCase()} */}
                </Avatar>
              )}

          {isEMR && row.clinicInfo?.clinic_name ? (
            <></>
          ) : (
            <></>
            // <Typography variant="subtitle2">Patient Upload</Typography>
          )}
        </>
      );
    }

    return text;
  };

  const isSecretary = () => {
    let text: any;

    // for patient
    if (user?.role === 'secretary' || user?.role === 'doctor' || user?.role === 'patient') {
      if (user?.permissions?.lab_result === 1 && user?.role === 'secretary') {
        text = (
          <>
            <Badge
              badgeContent={
                !isEMR ? row.labreport_attachments.length : row.labreport_attachments.length
              }
              color="primary"
            >
              <IconButton onClick={view.onTrue}>
                <Iconify icon="solar:clipboard-text-bold" />
              </IconButton>
            </Badge>
          </>
        );
      } else {
        text = (
          <>
            <Badge color="primary">
              <IconButton disabled>
                <Iconify icon="solar:clipboard-text-bold" />
              </IconButton>
            </Badge>
          </>
        );
      }
      if (user?.role === 'doctor') {
        text = (
          <>
            <Badge
              badgeContent={
                !isEMR ? row.labreport_attachments.length : row.labreport_attachments.length
              }
              color="primary"
            >
              <IconButton onClick={view.onTrue}>
                <Iconify icon="solar:clipboard-text-bold" />
              </IconButton>
            </Badge>
          </>
        );
      }
      if (user?.role === 'patient') {
        text = (
          <>
            <Badge
              badgeContent={
                !isEMR ? row.labreport_attachments.length : row.labreport_attachments.length
              }
              color="primary"
            >
              <IconButton onClick={view.onTrue}>
                <Iconify icon="solar:clipboard-text-bold" />
              </IconButton>
            </Badge>
          </>
        );
      }
    }
    return text;
  };

  // const fullName = `${row.firstName} ${keyDoctor.lastName}, ${keyDoctor.title}`;

  const renderView = (
    <Dialog fullScreen open={view.value}>
      <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
        <DialogActions sx={{ p: 1.5 }}>
          <Box sx={{ ml: 2, flex: 1 }}>
            <LogoFull disabledLink />
          </Box>

          <Button variant="outlined" onClick={view.onFalse}>
            Close
          </Button>
        </DialogActions>

        <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
            <PatientImagingPDF patientData={patientData} item={row} />
          </PDFViewer>
        </Box>
      </Box>
    </Dialog>
  );

  if (!upMd) {
    return (
      <>
        <TableMobileRow
          menu={[
            {
              label: 'View',
              icon: 'solar:eye-bold',
              func: view.onTrue,
            },
          ]}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* <Avatar alt={row?.clinicInfo?.clinic_name || 'Patient Upload'} sx={{ mr: 2 }}>
              {row?.clinicInfo?.clinic_name.charAt(0).toUpperCase() ||
                'Patient Upload'.charAt(0).toUpperCase()}
            </Avatar> */}
            {isEmrDataMobile()}
            <ListItemText
              primary={
                <>
                <Stack direction="row" alignItems="center" sx={{py:1}}>
                <Iconify icon={  (()=>{
                  let icon:any;
                  TYPE_OPTIONS?.forEach((p:any)=>{
                      p?.classify?.find((c:any)=>{
                          if(row?.type === c?.name){
                              icon =  c?.icon;
                          }
                      })
                  })
                  return icon || ''
                  })()} width={20}  />
      
                  <Typography sx={{ml:2}}>
                  {type}
                  </Typography>
                </Stack>
                </>
              }
              secondary={
                <>
                  <Typography variant="caption">
                    {row.clinicInfo?.clinic_name || 'Patient Upload'}
                  </Typography>
                </>
              }
              primaryTypographyProps={{
                typography: 'subtitle2',
                textTransform: 'capitalize',
                color: 'primary.main',
              }}
              secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
            />
          </div>
        </TableMobileRow>

        {renderView}
      </>
    );
  }

  return (
    <>
      <TableRow hover>
        {/* <TableCell>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={!isEMR ? row.doctorInfo?.EMP_FNAME  : row.doctorInfo?.EMP_FNAME} sx={{ mr: 2 }}>
              {!isEMR ? row.doctorInfo?.EMP_FNAME.charAt(0).toUpperCase()  : row.doctorInfo?.EMP_FNAME.charAt(0).toUpperCase()}
            </Avatar>

            <ListItemText
              primary={!isEMR ? row.doctorInfo?.EMP_FULLNAME  : row.doctorInfo?.EMP_FULLNAME}
              secondary={!isEMR ? row.doctorInfo?.EMP_TITLE  : row.doctorInfo?.EMP_TITLE}
              primaryTypographyProps={{ typography: 'subtitle2' }}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'caption',
              }}
            />
          </div>
        </TableCell> */}

        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isEmrData()}

            {/* {!isEMR && row.clinicInfo?.clinic_name ? :} */}
            {/* 
            {!isEMR && row.clinicInfo?.clinic_name ? (
              <Avatar
                alt={!isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
                sx={{ mr: 2 }}
              >
                {!isEMR
                  ? row.clinicInfo?.clinic_name.charAt(0).toUpperCase()
                  : row.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
              </Avatar>
            ) : null} */}

            {/* {!isEMR && row.clinicInfo?.clinic_name ? (
              <ListItemText
                primary={!isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
                primaryTypographyProps={{ typography: 'subtitle2' }}
              />
            ) : (
              <>
              {!isEMR && row.clinicInfo?.clinic_name 
              ? 
              <Typography variant="subtitle2">
                Patient Upload
              </Typography> 
              :null
              }
              </>
            )} */}

            {/* {isEMR && row.clinicInfo?.clinic_name ? (
              <Avatar
                alt={isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
                sx={{ mr: 2 }}
              >
                {isEMR
                  ? row.clinicInfo?.clinic_name.charAt(0).toUpperCase()
                  : row.clinicInfo?.clinic_name.charAt(0).toUpperCase()}
              </Avatar>
            ) : null}

            {isEMR && row.clinicInfo?.clinic_name ? (
              <ListItemText
                primary={isEMR ? row.clinicInfo?.clinic_name : row.clinicInfo?.clinic_name}
                primaryTypographyProps={{ typography: 'subtitle2' }}
              />
            ) : (
              <>
              {isEMR && row.clinicInfo?.clinic_name 
              ? 
              <Typography variant="subtitle2">
                Patient Upload
              </Typography> 
              :null
              }
              </>
              
            )} */}
          </div>
        </TableCell>

        <TableCell>{row.labName}</TableCell>

        <TableCell>{row.resultDate}</TableCell>

        <TableCell sx={{ color: 'primary.main', textTransform: 'capitalize'}}>
          
            <Stack direction="row" alignItems="center" sx={{py:1}}>
            <Iconify icon={  (()=>{
            let icon:any;
            TYPE_OPTIONS?.forEach((p:any)=>{
                p?.classify?.find((c:any)=>{
                    if(row?.type === c?.name){
                        icon =  c?.icon;
                    }
                })
            })
            return icon || ''
            })()} width={20}  />

            <Typography sx={{ml:2}}>
            {row?.type}
            </Typography>
            </Stack>
        </TableCell>

        <TableCell align="left" sx={{ px: 1 }}>
          <Tooltip title="View Details" placement="top" arrow>
            {isSecretary()}
            {/* <Badge
              badgeContent={
                !isEMR ? row.labreport_attachments.length : row.labreport_attachments.length
              }
              color="primary"
            >
              <IconButton onClick={view.onTrue}>
                <Iconify icon="solar:clipboard-text-bold" />
              </IconButton>
            </Badge> */}
          </Tooltip>
        </TableCell>
      </TableRow>

      {renderView}
    </>
  );
}
