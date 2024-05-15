import { useState, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha } from '@mui/material/styles';
// types
import { IDashboardCover } from 'src/types/general';
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgGradient } from 'src/theme/css';
import { useAuthContext } from '@/auth/hooks';
import { useLazyQuery } from '@apollo/client';
import { get_note_vitals_user } from '@/libs/gqls/notes/notesVitals';
import { VitalView } from 'src/sections/vital/view';
import IMG from '../../../public/assets/background/banner-bg.png';
// ----------------------------------------------------------------------

export default function DashboardCover({
  uname,
  name,
  avatarUrl,
  job,
  email,
  coverUrl,
  title,
  specialty,
}: IDashboardCover) {
  const theme = useTheme();
  const { user } = useAuthContext();

  const isDoctor = user?.role === 'doctor';
  const isSecretary = user?.role === 'secretary';
  const linkData = process.env.NEXT_PUBLIC_DOMAIN;
  // console.log(linkData, 'linkData');
  const [copy, setCopy] = useState('Copy Link');
  const handleCopyClick = async () => {
    const linkToCopy = `${linkData}/find-doctor/${uname}/`;

    try {
      await navigator.clipboard.writeText(linkToCopy);
      setCopy('Link Copied');
      setTimeout(() => {
        setCopy('Copy Link');
      }, 3000);
      console.log('Link copied to clipboard:', linkToCopy);
    } catch (err) {
      console.error('Unable to copy link to clipboard', err);
    }
  };
  const upMd = useResponsive('up', 'md');

  // vitals
  const [chartData, setChartData] = useState<any>([]);

  // console.log('@@@@', user);
  const [
    getDataUser,
    { data: dataUser, loading: userloading, error: userError, refetch: userRefetch },
  ] = useLazyQuery(get_note_vitals_user, {
    context: {
      requestTrackerId: 'getVitals[gREC]',
    },
    notifyOnNetworkStatusChange: true,
  });
  useEffect(() => {
    if (user?.role === 'patient') {
      getDataUser({
        variables: {
          data: {
            uuid: String(user.uuid),
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        if (data) {
          const { QueryNotesVitalsUser } = data;
          setChartData(QueryNotesVitalsUser?.vitals_data);
        }
      });
    }
  }, [getDataUser, user?.role, user?.uuid]);
  console.log('chartData', chartData);

  const isDashboard = true;
  return (
    <Card sx={{ height: { xs: (isDoctor || isSecretary) ? 170 : 100, md: 200 } }}>
      <Box
        sx={{
          ...bgGradient({
            // background: `url('../../../public/assets/background/banner-bg.png')`,
          }),
          background: 'url(/assets/background/banner-bg.png)',
          backgroundSize: 'cover',
          height: 1,
          color: 'common.white',
        }}
      >
        <Stack
          direction="row"
          sx={{
            left: 24,
            bottom: { md: 20 },
            zIndex: { md: 10 },
            pt: { xs: 2, md: 0 },
            position: 'absolute',
          }}
        >
          <Avatar
            src={avatarUrl}
            alt={name}
            sx={{
              mt: (isDoctor || isSecretary) ? 4 : 8,
              mx: 'auto',
              width: { xs: 60, md: 128 },
              height: { xs: 60, md: 128 },
              border: `solid 2px ${theme.palette.common.white}`,
            }}
          />

          {(isDoctor || isSecretary) ? (
            <ListItemText
              sx={{
                mt: { md: 3 },
                ml: { xs: 1.5, md: 3 },
              }}
              primary={`${name} - ${title}`}
              secondary={
                <Stack direction="column">
                  <Typography variant={upMd ? 'body2' : 'caption'}>{job}</Typography>
                  <Typography variant={upMd ? 'body2' : 'caption'}>{email}</Typography>
                  <Typography
                    variant={upMd ? 'body2' : 'caption'}
                  >{`Specialty: ${specialty}`}</Typography>
                  <Typography
                    variant={upMd ? 'body2' : 'caption'}
                  >{`Link: ${linkData}/find-doctor/${uname}/`}</Typography>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    sx={{ p: 0.5, width: 80 }}
                    onClick={() => handleCopyClick()}
                  >
                    {copy}
                  </Button>
                </Stack>
              }
              primaryTypographyProps={{
                typography: { xs: 'body2', md: 'h4' },
              }}
              secondaryTypographyProps={{
                mt: 0.5,
                color: 'common.white',
                sx: { opacity: 0.78 },
              }}
            />
          ) : (
            <ListItemText
              sx={{
                mt: { md: 13 },
                ml: { xs: 1.5, md: 3 },
                pr: 5,
              }}
              primary={`${name} ${(isDoctor || isSecretary) ? '-' : ''} ${isDoctor ? title : ''}`}
              secondary={
                <Stack direction="column">
                  {(isDoctor || isSecretary) && <Typography variant={upMd ? 'body2' : 'caption'}>{job}</Typography>}
                  <Typography variant={upMd ? 'body2' : 'caption'}>{email}</Typography>
                  {(isDoctor || isSecretary) && (
                    <>
                      <Typography
                        variant={upMd ? 'body2' : 'caption'}
                      >{`Specialty: ${specialty}`}</Typography>
                      <Typography
                        variant={upMd ? 'body2' : 'caption'}
                      >{`Link: ${linkData}/find-doctor/${uname}/`}</Typography>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        sx={{ p: 0.5, width: 80 }}
                        onClick={() => handleCopyClick()}
                      >
                        {copy}
                      </Button>
                    </>
                  )}
                </Stack>
              }
              primaryTypographyProps={{
                typography: { xs: 'body2', md: 'h4' },
              }}
              secondaryTypographyProps={{
                mt: 0.5,
                color: 'common.white',
                sx: { opacity: 0.78 },
              }}
            />
          )}

          {/* <Box sx={{ bgcolor: 'blue' }}>test</Box> */}

          {/* {chartData && (
            <Box sx={{ mt: 8 , borderRadius: 5}}>
              <VitalView items={chartData} loading={userloading} isDashboard={isDashboard} />
            </Box>
          )} */}
        </Stack>
      </Box>
    </Card>
  );
}
