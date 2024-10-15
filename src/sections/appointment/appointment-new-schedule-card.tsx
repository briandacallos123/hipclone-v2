// @mui
import { useEffect } from 'react';
import Card, { CardProps } from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// types
import { IHospital, ISchedule } from 'src/types/general';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

type Props = CardProps & {
  // data: {
  //   key: ISchedule;
  //   hospital: IHospital;
  // };
  data?: any;
  checked?: boolean;
  onChange?: VoidFunction;
  isProfile?: any;
};

export default function AppointmentNewScheduleCard({ data, checked, onChange, isProfile }: Props) {
  // const schedData = data?.ClinicSchedInfo?.map((item: any) => item);
  // const schedDays = [schedData?.map((item: any) => item?.days)];

  const scheduleType = [
    ...new Set(data?.ClinicSchedInfo?.map((_) => _.type).flatMap((_) => [..._])),
  ];
  const scheduleDays = [
    ...new Set(data?.ClinicSchedInfo?.map((_) => _.days).flatMap((_) => [..._])),
  ];

  // useEffect(()=> {
  //   setTimeS(s_time)
  // },[])

  // schedDays.push(...schedData);
  // console.log('schedType', scheduleType);
  // console.log('schedDays', scheduleDays);
  // console.log('asdasdasd: ', data);

  return (
    <>
      {isProfile && (
        <Box sx={{ p: 3, position: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {data?.clinicDPInfo?.length ? 
             <Avatar
             sx={{ mr: 2 }}
             alt={data?.clinic_name}
             src={data?.clinicDPInfo?.[0]?.filename}
             />
            :
            <Avatar alt={data?.clinic_name} sx={{ mr: 2 }}>
            {data?.clinic_name?.charAt(0).toUpperCase()}
          </Avatar>
            }
           
            {/* {data?.clinicDPInfo?.[0] ? (
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
            )} */}

            <ListItemText
              primary={data?.clinic_name}
              secondary={
                <>
                  <Typography variant="caption">{data?.location}</Typography>
                  <Stack direction="row" sx={{ mb: 1 }}>
                    <Typography variant="body2">Days: &nbsp;</Typography>
                    <Stack component="span" direction="row" divider={<span>,&nbsp;</span>}>
                      {scheduleDays.map((item: any) => (
                        <Typography key={item} variant="subtitle2">
                          {reader(item)}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>

                  <Stack spacing={1} direction="row">
                    {scheduleType?.map((item: any) => (
                      <Label key={item} variant="soft" color={(item === 1 && 'success') || 'info'}>
                        {typeFormat(item)}
                        {/* {console.log('asdasdasdasd', item)} */}
                      </Label>
                    ))}
                  </Stack>
                </>
              }
              primaryTypographyProps={{ typography: 'subtitle2' }}
            />
          </div>
        </Box>
      )}

      {!isProfile && (
        <Card sx={{ p: 3, position: 'relative' }}>
          <Checkbox
            checked={checked}
            onChange={onChange}
            sx={{ position: 'absolute', top: 5, right: 5 }}
          />

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

            <ListItemText
              primary={data?.clinic_name}
              secondary={
                <>
                  <Typography variant="caption">{data?.location}</Typography>
                  <Stack direction="row" sx={{ mb: 1 }}>
                    <Typography variant="body2">Days: &nbsp;</Typography>
                    <Stack component="span" direction="row" divider={<span>,&nbsp;</span>}>
                      {scheduleDays.map((item: any) => (
                        <Typography key={item} variant="subtitle2">
                          {reader(item)}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>

                  <Stack spacing={1} direction="row">
                    {scheduleType?.map((item: any) => (
                      <Label key={item} variant="soft" color={(item === 1 && 'success') || 'info'}>
                        {typeFormat(item)}
                        {/* {console.log('asdasdasdasd', item)} */}
                      </Label>
                    ))}
                  </Stack>
                </>
              }
              primaryTypographyProps={{ typography: 'subtitle2' }}
            />
          </div>
        </Card>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

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
function typeFormat(data: number) {
  return (
    <>
      {data === 1 && 'Telemedicine'}
      {data === 2 && 'Face-To-Face'}
    </>
  );
}
