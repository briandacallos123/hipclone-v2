import { m } from 'framer-motion';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Image from 'src/components/image';
import { MotionContainer, varFade } from 'src/components/animate';
//
import { HomeNoteFind, HomeNoteSignup } from './components';

// ----------------------------------------------------------------------

const BENEFITS = [
  {
    label: 'Schedule Appointments',
    caption:
      'Select preferred date, time, and type of consultation (face-to-face or telemedicine).',
    img: '/assets/icons/services/schedule-appointments.png',
  },
  {
    label: 'Medical Consultation Online',
    caption: 'Consult your doctor from the safety of your home.',
    img: '/assets/icons/services/medical-consultation-online.png',
  },
  {
    label: 'Receive Realtime Alerts',
    caption: 'Keep track of appointments through SMS notifications and HIP inbox.',
    img: '/assets/icons/services/receive-realtime-alerts.png',
  },
  {
    label: 'Use HMO Coverage',
    caption: 'Consult with HMO Accredited Doctors.',
    img: '/assets/icons/services/use-hmo-coverage.png',
  },
  {
    label: 'Monitor Your Health',
    caption: 'Record your daily weight, blood pressure, body temperature and more.',
    img: '/assets/icons/services/monitor-your-health.png',
  },
  {
    label: 'Payment Confirmation',
    caption: 'Pay direct to doctors account and upload proof of payment.',
    img: '/assets/icons/services/payment-confirmation.png',
  },
];

const StyledRoot = styled('section')(({ theme }) => ({
  padding: theme.spacing(8, 2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 25),
  },
}));

const GridStyle = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  rowGap: theme.spacing(3),
  columnGap: theme.spacing(7),
  marginTop: theme.spacing(7),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}));

const ItemStyle = styled(m.div)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  cursor: 'pointer',
  gap: theme.spacing(2),
}));

// ----------------------------------------------------------------------

export default function HomeBenefits() {
  const mdUp = useResponsive('up', 'md');

  const theme = useTheme();

  return (
    <StyledRoot id="benefits">
      <Container component={MotionContainer} maxWidth="xl">
        <m.div variants={varFade().inUp}>
          <Typography
            variant={mdUp ? 'h3' : 'h4'}
            sx={{
              textAlign: 'center',
              '& > span': { color: theme.palette.primary.main },
            }}
          >
            <span>{`Sign up `}</span>
            for a FREE patient account NOW and maximize the benefits of HIPS Virtual Clinic
          </Typography>
        </m.div>

        <GridStyle>
          {BENEFITS.map((item) => (
            <ItemStyle key={item.label} variants={varFade().in} sx={{ textAlign: 'center' }}>
              <Image src={item.img} alt={item.label} sx={{ width: mdUp ? 180 : 100 }} />
              <div>
                <Typography variant={mdUp ? 'h3' : 'h5'} color="primary.main" noWrap>
                  {item.label}
                </Typography>
                <Typography sx={{ fontSize: mdUp ? '23px' : '15px' }}>{item.caption}</Typography>
              </div>
            </ItemStyle>
          ))}
        </GridStyle>

        <Box
          component={m.div}
          variants={varFade().inUp}
          sx={{ pt: mdUp ? 15 : 8, textAlign: 'center' }}
        >
          <HomeNoteSignup sx={{ fontSize: { xs: '18px', md: '23px' } }} />
          <HomeNoteFind sx={{ fontSize: { xs: '18px', md: '23px' } }} />
        </Box>
      </Container>
    </StyledRoot>
  );
}
