import { m } from 'framer-motion';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Image from 'src/components/image';
import { MotionContainer, varFade } from 'src/components/animate';
import PricingCard from './components/pricing-card';
// ----------------------------------------------------------------------

const StyledRoot = styled('section')(({ theme }) => ({
  padding: theme.spacing(8, 2),
  backgroundColor: theme.palette.background.neutral,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(20),
  },
}));

const HoverableCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));
// ----------------------------------------------------------------------

export default function HomePlan() {
  const mdUp = useResponsive('up', 'md');
  const theme = useTheme();

  const _pricingPlans = [
    {
      subscription: 'Basic',
      price: '₱500',
      caption: 'Essential tools for efficient patient management at an affordable price.',
      lists: [
        '10 Patients',
        'Electronic Health Records (EHR)',
        'Appointment Scheduling and Reminders',
        'Vital Signs Monitoring',
        'Telehealth Integration',
        'Prescription Management',
        'Patient Portal',
        'Data Security and Compliance',
      ],
      labelAction: 'Choose Basic',
    },
    {
      subscription: 'Standard',
      price: '₱1000',
      caption: 'Perfect for boutique practices aiming for high-impact changes',
      lists: [
        '50 Patients',
        'Electronic Health Records (EHR)',
        'Appointment Scheduling and Reminders',
        'Vital Signs Monitoring',
        'Telehealth Integration',
        'Prescription Management',
        'Patient Portal',
        'Data Security and Compliance',
      ],
      labelAction: 'Choose Starter',
    },
    {
      subscription: 'Premium',
      price: '₱2000',
      caption:
        'unlocks your potential with unlimited patient management. Designed for healthcare heroes in bustling settings.',
      lists: [
        'Unlimited Patients',
        'Electronic Health Records (EHR)',
        'Appointment Scheduling and Reminders',
        'Vital Signs Monitoring',
        'Telehealth Integration',
        'Prescription Management',
        'Patient Portal',
        'Data Security and Compliance',
      ],
      labelAction: 'Choose Premium',
    },
  ];

  return (
    <StyledRoot id="aboutus">
      <Container component={MotionContainer} maxWidth="xl">
        <m.div variants={varFade().inRight}>
          <Typography
            variant={mdUp ? 'h2' : 'h4'}
            sx={{
              lineHeight: 1,
              textAlign: 'center',
              '& > span': { color: theme.palette.primary.main },
              pb: 5,
            }}
          >
            Find the Right
            <span>{` Plan `}</span>
          </Typography>
        </m.div>
        <Stack direction="row" alignItems="stretch" justifyContent="center" spacing={2}>
          {/* <Card sx={{ minWidth: 300, p: 4 }}>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', pb: 10 }}>
              Pick a Plan
            </Typography>

            <Stack direction="column" spacing={3}>
              <Divider />
              <Typography variant="subtitle2" sx={{ textAlign: 'left' }}>
                Clinics
              </Typography>
              <Divider />
              <Typography variant="subtitle2" sx={{ textAlign: 'left' }}>
                Patients
              </Typography>
              <Divider />
              <Typography variant="subtitle2" sx={{ textAlign: 'left' }}>
                Billing
              </Typography>
              <Divider />
            </Stack>
          </Card>
          <HoverableCard sx={{ minWidth: 300, p: 4 }}>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', pb: 10 }}>
              Standard Plan
            </Typography>
            <Stack direction="column" spacing={3}>
              <Divider />
              <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                Unlimited
              </Typography>
              <Divider />
              <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                50 Patients
              </Typography>
              <Divider />
              <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                ₱ 1,000 per month
              </Typography>
              <Divider />
              <Typography variant="body2" sx={{ textAlign: 'left' }}>
                Perfect for boutique practices aiming for high-impact changes.
              </Typography>
              <Divider />
              <Stack alignItems="center" sx={{ mt: 5 }}>
                <m.div variants={varFade().inUp}>
                  <LoadingButton
                    color="inherit"
                    size="large"
                    variant="contained"
                    onClick={() => {}}
                  >
                    Get Started
                  </LoadingButton>
                </m.div>
              </Stack>
            </Stack>
          </HoverableCard>
          <HoverableCard sx={{ minWidth: 300, p: 4 }}>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', pb: 10 }}>
              Premium Plan
            </Typography>
            <Stack direction="column" spacing={3}>
              <Divider />
              <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                Unlimited
              </Typography>
              <Divider />
              <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                Unlimited
              </Typography>
              <Divider />
              <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
                ₱ 2,000 per month
              </Typography>
              <Divider />
              <Typography variant="body2" sx={{ textAlign: 'left' }}>
                unlocks your potential with unlimited patient management. Designed for healthcare
                heroes in bustling settings
              </Typography>
              <Divider />
              <Stack alignItems="center" sx={{ mt: 5 }}>
                <m.div variants={varFade().inUp}>
                  <LoadingButton
                    color="inherit"
                    size="large"
                    variant="contained"
                    onClick={() => {}}
                  >
                    Get Started
                  </LoadingButton>
                </m.div>
              </Stack>
            </Stack>
          </HoverableCard> */}
          <Box
            gap={{ xs: 3, md: 0 }}
            display="grid"
            alignItems={{ md: 'center' }}
            gridTemplateColumns={{ md: 'repeat(3, 1fr)' }}
          >
            {_pricingPlans.map((card, index) => (
              <PricingCard key={card.subscription} card={card} index={index} />
            ))}
          </Box>
        </Stack>
      </Container>
    </StyledRoot>
  );
}
