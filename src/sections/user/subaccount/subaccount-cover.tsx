// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// types
import { IUserSubaccountItem } from 'src/types/user';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
  currentItem?: any;
};

export default function SubaccountCover({ currentItem }: Props) {
  const theme = useTheme();

  const fullName = `${currentItem?.subAccountInfo?.fname} ${currentItem?.subAccountInfo?.mnane || "" } ${currentItem?.subAccountInfo?.lname || ""}`;

  return (
    <Card sx={{ mt: 1, height: { xs: 240, md: 180 } }}>
      <Label
        color={currentItem?.status === 1 ? 'success' : 'error'}
        sx={{ position: 'absolute', top: 12, right: 12, textTransform: 'uppercase' }}
      >
        {currentItem?.status === 1 ? 'active' : 'inactive'}
      </Label>

      <Box sx={{ height: 1 }}>
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

        {currentItem?.subAccountInfo?.userInfo?.display_picture[0] ? (
            <Avatar
              alt={currentItem?.subAccountInfo?.fname}
              src={currentItem?.subAccountInfo?.userInfo?.display_picture[0].filename.split('public')[1]}
              sx={{
                mx: 'auto',
                width: { xs: 64, md: 128 },
                height: { xs: 64, md: 128 },
                border: `solid 2px ${theme.palette.common.white}`,
              }}
            >
              {currentItem?.subAccountInfo?.fname.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar alt={currentItem?.subAccountInfo?.fname} sx={{
              mx: 'auto',
              width: { xs: 64, md: 128 },
              height: { xs: 64, md: 128 },
              border: `solid 2px ${theme.palette.common.white}`,
            }}>
              {currentItem?.subAccountInfo?.fname.charAt(0).toUpperCase()}
            </Avatar>
          )}


          {/* <Avatar
            // src={currentItem?.avatarUrl}
            alt={currentItem?.subAccountInfo?.fname}
            sx={{
              mx: 'auto',
              width: { xs: 64, md: 128 },
              height: { xs: 64, md: 128 },
              border: `solid 2px ${theme.palette.common.white}`,
            }}
          >
            {currentItem?.subAccountInfo?.fname.charAt(0).toUpperCase()}

            </Avatar> */}

          <ListItemText
            sx={{
              mt: { xs: 3, md: 1 },
              ml: { md: 3 },
              textAlign: { xs: 'center', md: 'unset' },
            }}
            primary={fullName}
            secondary={
              <>
                <Typography variant="subtitle1" sx={{color:"success.main"}}>{currentItem?.subAccountInfo?.occupation}</Typography>
                <Typography variant="body2">{currentItem?.subAccountInfo?.email}</Typography>
                <Typography variant="body2">{currentItem?.subAccountInfo?.mobile_no}</Typography>
              </>
            }
            primaryTypographyProps={{
              typography: 'h4',
            }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              sx: { opacity: 0.78 },
            }}
          />
        </Stack>
      </Box>
    </Card>
  );
}
