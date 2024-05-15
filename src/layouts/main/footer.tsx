// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// components
import Iconify from 'src/components/iconify';
import { Logo } from 'src/components/logo';

// ----------------------------------------------------------------------

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: 'center',
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Logo sx={{ mb: 1, mx: 'auto' }} />

        <Typography variant="caption" component="div">
          All rights reserved.
          <br />
          Developed by
          <Link href="https://www.natrapharm.com/" target="_blank">
            {' AP Global IT Solutions, Inc. '}
          </Link>
        </Typography>

        <div>
          <Typography variant="body2" sx={{ mt: 5 }}>
            Follow & contact us
          </Typography>
          <Stack direction="row" justifyContent="center">
            <IconButton
              component={Link}
              href="https://www.facebook.com/natrapharminc"
              target="_blank"
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" sx={{ height: 24, width: 24 }} />
            </IconButton>

            <IconButton
              component={Link}
              href="mailto:hip_support@apgitsolutions.com"
              target="_blank"
            >
              <Iconify icon="eva:email-fill" color="#DF3E30" sx={{ height: 24, width: 24 }} />
            </IconButton>
          </Stack>
        </div>
      </Container>
    </Box>
  );
}
