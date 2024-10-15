// @mui
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha } from '@mui/material/styles';
import { ASSETS_API } from 'src/config-global';
// types
import { UserAvatar } from 'src/assets/illustrations';
import { IAppointmentBookCover } from 'src/types/appointment';
// theme
import { bgGradient } from 'src/theme/css';
import { Skeleton } from '@mui/material';
import Image from '@/components/image';
import { useResponsive } from '@/hooks/use-responsive';

// ----------------------------------------------------------------------

export default function AppointmentBookCover({
  name,
  // avatarUrl,
  job,
  email,
  hmoData,
  coverUrl,
  isLoading,
  setLoading,
}: any) {
  const theme = useTheme();

  const upMd = useResponsive()

  // const EmployeeImg = () => {
  //   if (!hmoData?.attachment) return false;

  //   let path = hmoData?.attachment.split('public');

  //   const publicPart = path[1];

  //   return `${publicPart}`;
  // };
  // const EmployeeImg = () => {
  //   if (!hmoData?.attachment) return false;

  //   let filePath = path.join(process.cwd(), 'public', hmoData?.attachment);

  //   try {
  //     // Check if the file exists
  //     fs.accessSync(filePath, fs.constants.R_OK);

  //     // If the file exists, return the path
  //     return `/${hmoData?.attachment}`;
  //   } catch (error) {
  //     // If the file doesn't exist, return false or any default value
  //     return <UserAvatar />;
  //   }
  // };


  const EmployeeImg = async () => {
    // if (!hmoData?.attachment) return <UserAvatar />;
  };

  if (hmoData) {
    console.log(EmployeeImg(), 'hehe');
  }

  console.log(EmployeeImg(), 'hehe@@@@@@');

  if (isLoading) {
    return <Skeleton sx={{ height: { xs: 220, md: 500 }, width: { xs: 220, md: 400 } }} />;
  }

  return (
    <Card sx={{
      position: 'sticky',
      top: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      pt: 4
    }}>

      {/* <Card
        sx={{ height: { xs: 220, md: 400 }, backgroundImage: 'url(assets/illustrations/user.svg)' }}
      >
        {!isFound ? (
          <UserAvatar />
        ) : (
          <Box
            sx={{
              backgroundImage: `url(${`${(() => {
                if (!hmoData?.attachment) return false;

                if (!hmoData.attachment?.includes('public')) return hmoData.attachment;

                const path = hmoData?.attachment.split('public');

                const publicPart = path[1];

                return `${publicPart}`;
              })()}`})`,
              backgroundSize: 'cover', // You can customize this as needed
              backgroundRepeat: 'no-repeat', // You can customize this as needed

              backgroundPosition: 'center',
              height: '100%',
              width: '100%',
            }}
          />
        )}
      </Card> */}
      <Image
        src={
          hmoData?.attachment
        }
        sx={{
          height: upMd ? 400 : 200,
          width: upMd ? 400 : 200,
        }}
      />
      <Box>
        <ListItemText
          sx={{
            // mt: 15,
            p: 5,

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
              {/* <Typography variant="body2">
                {job ? job : <Skeleton sx={{ width: 1, height: 12 }} />}
              </Typography>
              <Typography variant="body2">
                {email ? email : <Skeleton sx={{ width: 1, height: 12 }} />}
              </Typography> */}
            </>
          }
          primaryTypographyProps={{
            typography: 'h4',
            textAlign: 'center',
          }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            sx: { opacity: 0.78 },
            textAlign: 'center',
          }}
        />
      </Box>
    </Card>
  );
}
