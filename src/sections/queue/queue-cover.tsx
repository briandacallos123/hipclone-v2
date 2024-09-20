// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha } from '@mui/material/styles';
// types
import { IQueueCover } from 'src/types/general';
// theme
import { bgGradient } from 'src/theme/css';
import { Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function QueueCover({ name, address, avatarUrl, coverUrl, isLoading }: any) {
  const theme = useTheme();

  

  return (
    <Card sx={{ height: { xs: 140, md: 180 } }}>
      <Box
        sx={{
          ...bgGradient({
          
          }),
          background: 'url(/assets/background/bg-blueee.jpg)',
          backgroundSize: 'cover',
          height: 1,
          color: 'common.white',
        }}
      >
        <Stack
          direction="row"
          sx={{
            left: 24,
            bottom: { md: 24 },
            zIndex: { md: 10 },
            pt: { xs: 4, md: 0 },
            position: 'absolute',
          }}
        >
          <Avatar
            src={avatarUrl}
            alt={name}
            sx={{
              mx: 'auto',
              width: { xs: 60, md: 128 },
              height: { xs: 60, md: 128 },
              border: `solid 2px ${theme.palette.common.white}`,
            }}
          />

          {isLoading ? (
            <Stack spacing={1}>
              <Skeleton sx={{ width: 150, height: 12 }} />
              <Skeleton sx={{ width: 500, height: 12 }} />
            </Stack>
          ) : (
            name && <ListItemText
              sx={{
                mt: { md: 4 },
                ml: { xs: 1.5, md: 3 },
              }}
              primary={name}
              secondary={address}
              primaryTypographyProps={{
                typography: { xs: 'h6', md: 'h4' },
              }}
              secondaryTypographyProps={{
                mt: 0.5,
                typography: 'body2',
                color: 'common.white',
                sx: { opacity: 0.78 },
              }}
            />
          )}
        </Stack>
      </Box>
    </Card>
  );
}
