// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { ISchedule, IHospital } from 'src/types/general';
import { IAppointmentFindItem } from 'src/types/appointment';
// utils
import { fPercent } from '@/utils/format-number';
import { styled } from '@mui/material/styles';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { TableMobileRow } from 'src/components/table';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import { CardActions, CardContent, CardHeader, CardMedia } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// ----------------------------------------------------------------------

type Props = {
  row: any;
  onBookRow: VoidFunction;
  disableBtn: any;
  isDoctor?: Boolean;
  isCol?:Boolean;
  isRow?:Boolean
};

export default function AppointmentFindTableRow({ isDoctor, disableBtn, row, onBookRow,isCol, isRow}: Props) {
  const upMd = useResponsive('up', 'md');
  const [isLoading, setLoading] = useState(false);
  const fullName = `${row?.EMP_FNAME} ${row?.EMP_LNAME}, ${row?.EMP_TITLE}`;

  const toggleBook = () => {
    setLoading(true);
    onBookRow();
  };

  if (!upMd) {
    return (
      <TableMobileRow
        button={
          <IconButton onClick={() => onBookRow()} sx={{ position: 'absolute', top: 0, right: 0 }}>
            <Iconify icon="material-symbols:bookmark-add-rounded" color="success.main" />
            <Typography>Book Now</Typography>
          </IconButton>
        }
      >
        <Stack spacing={2} sx={{ pt: 2.5 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {row?.user?.display_picture?.[0] ? (
              <Avatar
                alt={fullName}
                src={row?.user?.display_picture?.[0]?.filename.split('public')[1]}
                sx={{ mr: 2 }}
              >
                {fullName.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <Avatar alt={fullName} sx={{ mr: 2 }}>
                {fullName.charAt(0).toUpperCase()}
              </Avatar>
            )}

            {/* <Avatar alt={fullName} src={''} sx={{ mr: 2 }}>
              {fullName.charAt(0).toUpperCase()}
            </Avatar> */}

            <ListItemText
              primary={fullName}
              secondary={
                <>
                  <Typography variant="caption">
                    Specialty: {row?.SpecializationInfo?.name}
                  </Typography>
                  <Typography variant="caption">Sub-specialty: {row?.SUBSPECIALTY}</Typography>
                  <Typography variant="caption">Response rate:&nbsp; 100%</Typography>
                </>
              }
              primaryTypographyProps={{ typography: 'subtitle2' }}
              secondaryTypographyProps={{ display: 'flex', flexDirection: 'column' }}
            />
          </div>

          {row?.HMOInfo?.length > 0 && (
            <Stack alignItems="flex-start">
              <Typography variant="overline" color="text.disabled">
                HMO Accreditation
              </Typography>

              {row?.HMOInfo.map((item: any, idx: number) => (
                <Typography key={idx} variant="body2">
                  •&nbsp; {item?.name}
                </Typography>
              ))}
            </Stack>
          )}

          <div>
            <Typography variant="overline" color="text.disabled" gutterBottom>
              Clinics & Schedules
            </Typography>

            <Box
              rowGap={1}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              {row?.clinicInfo?.map((item: any, idx: number) => (
                <ScheduleCard key={idx} data={item} />
              ))}
            </Box>
          </div>
        </Stack>
      </TableMobileRow>
    );
  }

  const doctorImg = () => {
    const baseUrl = row?.user?.display_picture?.[0]?.filename.split('public')[1]
    return baseUrl
  }

  const ExpandMore = styled((props: any) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  if(isCol){
    return(
      <Card>
        {row?.user?.display_picture?.[0] ? 
          <CardMedia
            component="img"
            height="194"
            image={doctorImg()}
            alt="Paella dish"
          />:
          <Box
            component="img"
            src={`/assets/icons/user/u_user.svg`}
            sx={{ height:194, width:'100%', textAlign:'center', backgroundPosition:'center',backgroundSize:'cover', mt:2 }}
          />
            
        }

           <Stack direction="row" alignItems="flex-start" sx={{my:2, px:4}}>
           <ListItemText
              primary={fullName}
           
              secondary={
                <>
                  <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    Specialty: {row?.SpecializationInfo?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    Sub-specialty: {row?.SUBSPECIALTY}
                  </Typography>
                  <Typography variant="caption">Response rate:&nbsp; 100%</Typography>
                  {row?.HMOInfo?.length > 0 && (
                    <Stack alignItems="flex-start">
                      <Typography variant="overline" color="text.disabled">
                        HMO Accreditation
                      </Typography>

                      <Stack direction="row" flexWrap="wrap" columnGap={3} rowGap={1}>
                        {row?.HMOInfo.map((item: any, idx: number) => (
                          <Stack
                            direction="row"
                            key={idx}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Avatar
                              alt={item.id}
                              src={imgReader(Number(item.id))}
                              sx={{ mr: 1, height: '25px', width: '25px' }}
                            />

                            <Typography variant="caption"> {item?.name}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  )}
                </>
              }
              primaryTypographyProps={{ typography: 'h6' }}
            />

              <Tooltip title="Book Appointment" placement="top" arrow>
                {!isLoading ?  <>
                  <Button
                    disabled={disableBtn}
                    variant="outlined"
                    sx={{ bgcolor: 'primary.light', minWidth: '1px', width: '1px' }}
                    onClick={() => toggleBook()}
                  >
                    <Stack direction="column">
                      <Iconify
                        icon="material-symbols:bookmark-add-rounded"
                        color={`${!disableBtn && 'common.white'}`}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          writingMode: 'vertical-lr',
                          textOrientation: 'upright',
                          color: 'common.white',
                        }}
                      >
                        Book Now
                      </Typography>
                    </Stack>
                  </Button>
                </> : (
                  <LoadingButton loading={isLoading} />
                )}
              </Tooltip>

            </Stack>

            {/* actions */}

            <CardActions disableSpacing>
            
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
            </CardActions>

            {/* content */}

            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
              <div>
                <Typography variant="overline" color="text.disabled" gutterBottom>
                  Clinics & Schedules
                </Typography>

                <Box
                  rowGap={1}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={
                    (isCol ? {
                      xs: 'repeat(1, 1fr)'
                    } : 
                    {
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                    }
                    )
                  }
                >
                  {row?.clinicInfo?.map((item: any, idx: number) => (
                    <ScheduleCard key={idx} data={item} />
                  ))}
                </Box>
              </div>
              </CardContent>
            </Collapse>
      </Card>
    )
  }

  return (
    <TableRow hover sx={{
      border:'.5px solid #ededed',
      borderRadius:"20px",
      padding: "10px",
      boxShadow:"0px 7px #f7f7f7, 0px -7px #f7f7f7",
      marginBottom:'10px'
    }}>
      <TableCell>
        <Stack spacing={2}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {row?.user?.display_picture?.[0] ? (
              // <Avatar
              //   alt={fullName}
              //   src={row?.user?.display_picture?.[0]?.filename.split('public')[1]}
              //   sx={{ mr: 2 }}
              // >
              //   {fullName.charAt(0).toUpperCase()}
              // </Avatar>

              <Box
                sx={{
                  backgroundImage: `url(${`${(() => {
                    const baseUrl = row?.user?.display_picture?.[0]?.filename.split('public')[1];

                    //if (!baseUrl) return false;

                    //if (!hmoData.attachment?.includes('public')) return hmoData.attachment;

                    //const path = hmoData?.attachment.split('public');

                    //const publicPart = path[1];

                    return `${baseUrl}`;
                  })()}`})`,
                  backgroundSize: 'cover', // You can customize this as needed
                  backgroundRepeat: 'no-repeat', // You can customize this as needed

                  backgroundPosition: 'center',
                  height: '120px',
                  width: '120px',
                  marginRight: '20px',
                  borderRadius: '50%',
                }}
              />
            ) : (
              <Avatar alt={fullName} sx={{ mr: 2 }}>
                {fullName.charAt(0).toUpperCase()}
              </Avatar>
            )}
            {/* <Avatar alt={fullName} src="" sx={{ mr: 2 }}>
              {fullName.charAt(0).toUpperCase()}
            </Avatar> */}

            <ListItemText
              primary={fullName}
              secondary={
                <>
                  <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    Specialty: {row?.SpecializationInfo?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    Sub-specialty: {row?.SUBSPECIALTY}
                  </Typography>
                  <Typography variant="caption">Response rate:&nbsp; 100%</Typography>
                  {row?.HMOInfo?.length > 0 && (
                    <Stack alignItems="flex-start">
                      <Typography variant="overline" color="text.disabled">
                        HMO Accreditation
                      </Typography>

                      <Stack direction="row" flexWrap="wrap" columnGap={3} rowGap={1}>
                        {row?.HMOInfo.map((item: any, idx: number) => (
                          <Stack
                            direction="row"
                            key={idx}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Avatar
                              alt={item.id}
                              src={imgReader(Number(item.id))}
                              sx={{ mr: 1, height: '25px', width: '25px' }}
                            />

                            <Typography variant="caption"> {item?.name}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  )}
                </>
              }
              primaryTypographyProps={{ typography: 'h6' }}
            />
          </div>

          <div>
            <Typography variant="overline" color="text.disabled" gutterBottom>
              Clinics & Schedules
            </Typography>

            <Box
              rowGap={1}
              columnGap={2}
              display="grid"
              gridTemplateColumns={
                (isCol ? {
                  xs: 'repeat(1, 1fr)'
                } : 
                {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }
                )
              }
            >
              {row?.clinicInfo?.map((item: any, idx: number) => (
                <ScheduleCard key={idx} data={item} />
              ))}
            </Box>
          </div>
        </Stack>
      </TableCell>

      <TableCell align="right" sx={{ px: 1 }}>
        <Tooltip title="Book Appointment" placement="top" arrow>
          {!isLoading ?  <>
             <Button
              disabled={disableBtn}
              variant="outlined"
              sx={{ bgcolor: 'primary.light', minWidth: '1px', width: '1px' }}
              onClick={() => toggleBook()}
            >
              <Stack direction="column">
                <Iconify
                  icon="material-symbols:bookmark-add-rounded"
                  color={`${!disableBtn && 'common.white'}`}
                />
                <Typography
                  variant="caption"
                  sx={{
                    writingMode: 'vertical-lr',
                    textOrientation: 'upright',
                    color: 'common.white',
                  }}
                >
                  Book Now
                </Typography>
              </Stack>
            </Button>
          </> : (
            <LoadingButton loading={isLoading} />
          )}
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

// ----------------------------------------------------------------------

type CardProps = {
  data: {
    key: ISchedule;
    hospital: IHospital;
  };
};

function ScheduleCard({ data }: CardProps | any) {
  return (
    <Card
      sx={{
        py: 1,
        px: 2,
        boxShadow: 0,
        bgcolor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[300]
            : theme.palette.background.neutral,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {data?.clinicDPInfo?.[0] ? (
          <Avatar
            alt={data?.clinic_name}
            src={data?.clinicDPInfo?.[0]?.filename.split('public')[1]}
            sx={{ mr: 2 }}
          >
            {data?.clinic_name?.charAt(0).toUpperCase()}
          </Avatar>
        ) : (
          <Avatar alt={data?.clinic_name} sx={{ mr: 2 }}>
            {data?.clinic_name?.charAt(0).toUpperCase()}
          </Avatar>
        )}
        {/* <Avatar alt={data?.clinic_name} src="" sx={{ mr: 2 }}>
          {data?.clinic_name?.charAt(0).toUpperCase()}
        </Avatar> */}

        <ListItemText
          primary={data?.clinic_name}
          secondary={
            <>
              <Typography variant="caption" sx={{ mb: 0.5 }}>
                {data?.location}
              </Typography>

              <Stack direction="row">
                <Typography variant="caption">Days: &nbsp;</Typography>
                <Stack
                  component="span"
                  direction="row"
                  flexWrap="wrap"
                  divider={<Typography variant="caption">,&nbsp;</Typography>}
                >
                  <ReadMerge data={data?.ClinicSchedInfo} />
                </Stack>
              </Stack>

              <Stack spacing={1} direction="row">
                <ReadType data={data?.ClinicSchedInfo} />
              </Stack>
            </>
          }
          primaryTypographyProps={{ typography: 'subtitle2' }}
        />
      </div>
    </Card>
  );
}

// ----------------------------------------------------------------------
function uniqueArrayValues<T>(arr: T[]): T[] {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
}
const ReadType = (props: any) => {
  const { data } = props;
  const merge = data?.map((v: any) => v?.typeArray);
  let combine: any = [];
  merge?.map((v: any) => {
    v?.map((c: any) => {
      combine.push(c);
    });
  });
  const uniqueValues: any = uniqueArrayValues(combine);

  return (
    <>
      {uniqueValues.map((v: number, idx: number) => (
        <Label key={idx} variant="soft" color={(v === 2 && 'success') || 'info'}>
          {v === 2 ? 'Telemedicine' : 'Face to Face'}
        </Label>
      ))}
    </>
  );
};
const ReadMerge = (props: any) => {
  const { data } = props;
  const merge = data?.map((v: any) => v?.daysArray);
  let combine: any = [];
  merge?.map((v: any) => {
    v?.map((c: any) => {
      combine.push(c);
    });
  });
  const uniqueValues: any = uniqueArrayValues(combine);
  return (
    <>
      {uniqueValues.map((v: number, idx: number) => (
        <Typography key={idx} variant="caption" sx={{ fontWeight: 'bold' }}>
          {reader(v)}&nbsp;
        </Typography>
      ))}
    </>
  );
};
function reader(data: number) {
  return (
    <>
      {data === 0 && 'Sun'}
      {data === 1 && 'Mon'}
      {data === 2 && 'Tue'}
      {data === 3 && 'Wed'}
      {data === 4 && 'Thu'}
      {data === 5 && 'Fri'}
      {data === 6 && 'Sat'}
    </>
  );
}

function imgReader(data: number) {
  if (data === 1) return '/assets/icons/hmo/asiancare-health-systems.jpg';
  if (data === 2) return '/assets/icons/hmo/cocolife.jpg';
  if (data === 3) return '/assets/icons/hmo/dynamic-care-corporation.jpg';
  if (data === 4) return '/assets/icons/hmo/eastwest-healthcare.jpg';
  if (data === 5) return '/assets/icons/hmo/health-plan-philippines.jpg';
  if (data === 6) return '/assets/icons/hmo/hmi.jpg';
  if (data === 7) return '/assets/icons/hmo/insular-health-care.jpg';
  if (data === 8) return '/assets/icons/hmo/intellicare.jpg';
  if (data === 9) return '/assets/icons/hmo/kaiser-international-healthgroup.jpg';
  if (data === 10) return '/assets/icons/hmo/life-&-health-hmp.jpg';
  if (data === 11) return '/assets/icons/hmo/maxicare.jpg';
  if (data === 12) return '/assets/icons/hmo/medicard.jpg';
  if (data === 13) return '/assets/icons/hmo/medicare-plus.jpg';
  if (data === 14) return '/assets/icons/hmo/medocare-health-systems.jpg';
  if (data === 15) return '/assets/icons/hmo/metrocare-healthcare-systems.jpg';
  if (data === 16) return '/assets/icons/hmo/optimum-medical-and-healthcare-services.jpg';
  if (data === 17) return '/assets/icons/hmo/pacific-cross-health-care.jpg';
  if (data === 18) return '/assets/icons/hmo/philcare-philhealth-care.jpg';
  return '/assets/icons/hmo/valucare.jpg';
}
