// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha } from '@mui/material/styles';
import { ASSETS_API } from 'src/config-global';
// types
import { IAppointmentBookCover } from 'src/types/appointment';
// theme
import { bgGradient } from 'src/theme/css';
import { Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function AppointmentBookingCover({
  name,
  avatarUrl,
  job,
  email,
  coverUrl,
}: IAppointmentBookCover) {
  const theme = useTheme();

  return (
    <Card sx={{ height: { xs: 220, md: 180 } }}>
      <Box
        sx={{
          ...bgGradient({
            color: alpha(theme.palette.primary.darker, 0.8),
            imgUrl: `${ASSETS_API}/assets/images/cover/cover_1.jpg`,
          }),
          height: 1,
          color: 'common.white',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            left: { md: 24 },
            bottom: { md: 24 },
            zIndex: { md: 10 },
            pt: { xs: 4, md: 0 },
            position: { md: 'absolute' },
          }}
        >
          <Avatar
            alt={name}
            sx={{
              mx: 'auto',
              width: { xs: 64, md: 128 },
              height: { xs: 64, md: 128 },
              border: `solid 2px ${theme.palette.common.white}`,
            }}
          >
            {name?.trim().charAt(0).toUpperCase()}
          </Avatar>

          <ListItemText
            sx={{
              mt: 3,
              ml: { md: 3 },
              textAlign: { xs: 'center', md: 'unset' },
            }}
            primary={(() => {
              if (name.indexOf('undefined') === -1) {
                return name;
              }
              return <Skeleton sx={{ width: 1, height: 15 }} />;
            })()}
            secondary={
              <>
                <Typography variant="body2">
                  {job ? job : <Skeleton sx={{ width: 1, height: 12 }} />}
                </Typography>
                <Typography variant="body2">
                  {email ? email : <Skeleton sx={{ width: 1, height: 12 }} />}
                </Typography>
              </>
            }
            primaryTypographyProps={{
              typography: 'h4',
            }}
            secondaryTypographyProps={{
              mt: 0.5,
              color: 'common.white',
              component: 'span',
              sx: { opacity: 0.78 },
            }}
          />
        </Stack>
      </Box>
    </Card>
  );
}
