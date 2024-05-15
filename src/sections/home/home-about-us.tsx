import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Image from 'src/components/image';
import { MotionContainer, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

const StyledRoot = styled('section')(({ theme }) => ({
  padding: theme.spacing(8, 2),
  backgroundColor: theme.palette.background.neutral,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(20),
  },
}));

// ----------------------------------------------------------------------

export default function HomeAboutUs() {
  const mdUp = useResponsive('up', 'md');

  return (
    <StyledRoot id="aboutus">
      <Container component={MotionContainer} maxWidth="xl">
        <m.div variants={varFade().inRight}>
          <Typography variant={mdUp ? 'h2' : 'h4'} color="primary.main" sx={{ lineHeight: 1 }}>
            ABOUT US
          </Typography>
          <Typography sx={{ mt: 5, fontSize: mdUp ? '20px' : '15px' }}>
            HIPS Health Information Program (HIPS) is a public service of HIPS, Inc. to continue its
            mission of improving the lives of the Filipino community by giving them access to
            quality healthcare.
            <br />
            <br />
            HIPS is a virtual clinic that connects patients to over 7,000 validated doctors
            nationwide with extensive selection of specialties. It offers services that make medical
            consultations safer and more convenient. Use of the platform is free with no
            subscription and service fees.
            <br />
            <br />
            HIPS is a virtual clinic that connects patients to over 7,000 validated doctors
            nationwide with extensive selection of specialties. It offers services that make medical
            consultations safer and more convenient. Use of the platform is free with no
            subscription and service fees.
            <br />
            {/* <br />
            HIPS was created by HIPS, Inc. through a solutions provider, AP GLOBAL IT SOLUTIONS. The
            platform has been subjected to cybersecurity testing and various security measures to
            ensure that information and data remain protected.
            <br /> */}
            <br />
            With HIPS, Health Is Priority.
          </Typography>
        </m.div>
        <Box
          component={m.div}
          variants={varFade().inUp}
          sx={{
            pt: 7,
            wi: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: (theme) => theme.spacing(mdUp ? 7 : 3),
          }}
        >
          {/* <Link href="https://www.natrapharm.com/" target="_blank">
            <Image
              src="/assets/images/home/footer_logo-natrapharm.png"
              alt="HIPS logo"
              sx={{ width: mdUp ? 220 : 140 }}
            />
          </Link> */}
          <Link href="https://www.apgitsolutions.com/" target="_blank">
            <Image
              src="/assets/images/home/footer_logo-apgit.png"
              alt="apgitsolutions logo"
              sx={{ width: mdUp ? 220 : 140 }}
            />
          </Link>
        </Box>
      </Container>
    </StyledRoot>
  );
}
