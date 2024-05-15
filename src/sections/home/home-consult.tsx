import Slider from 'react-slick';
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

const CAROUSEL_ITEMS = [
  {
    id: 1,
    caption: 'Sign up for free!',
    img: '/assets/images/home/steps/step-1.png',
  },
  {
    id: 2,
    caption: 'Search for your doctor.',
    img: '/assets/images/home/steps/step-2.png',
  },
  {
    id: 3,
    caption: 'Book an appointment and wait for SMS confirmation.',
    img: '/assets/images/home/steps/step-3.png',
  },
  {
    id: 4,
    caption: 'Upload a proof of payment.',
    img: '/assets/images/home/steps/step-4.png',
  },
  {
    id: 5,
    caption: 'Consult with your doctor.',
    img: '/assets/images/home/steps/step-5.png',
  },
];

const StyledRoot = styled('section')(({ theme }) => ({
  padding: theme.spacing(0, 0, 8),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10),
  },
}));

const SliderStyle = styled(Slider)(({ theme }) => ({
  '& .slick-track': {
    display: 'flex',
    gap: theme.spacing(5),
    '& .slick-slide': {
      display: 'flex',
      height: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  '& .slick-dots li button:before': {
    color: theme.palette.primary.dark,
    fontSize: 12,
    marginTop: theme.spacing(2),
  },
  '& .slick-dots li.slick-active button:before': {
    color: theme.palette.primary.main,
  },
  [theme.breakpoints.up('md')]: {
    '& .slick-track': {
      '& .slick-slide': {
        alignItems: 'flex-start',
      },
    },
  },
}));

// ----------------------------------------------------------------------

export default function HomeConsult() {
  const mdUp = useResponsive('up', 'md');

  const theme = useTheme();

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    arrows: false,
    slidesToShow: 5,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const renderCarousel = (
    <Box component={m.div} variants={varFade().in} sx={{ pt: mdUp ? 10 : 3 }}>
      <SliderStyle {...settings}>
        {CAROUSEL_ITEMS.map((slide) => (
          <Box key={slide.id} sx={{ textAlign: 'center' }}>
            <Image src={slide.img} alt={slide.caption} style={{ width: '100%' }} />
            <Typography variant="h6" color="primary.main" sx={{ mt: 2 }}>
              {`Step ${slide.id}:`}
            </Typography>
            <Typography variant="body1">{slide.caption}</Typography>
          </Box>
        ))}
      </SliderStyle>
    </Box>
  );

  return (
    <StyledRoot id="consult">
      <Container component={MotionContainer} maxWidth="xl">
        <m.div variants={varFade().inUp}>
          <Typography variant={mdUp ? 'h3' : 'h4'} sx={{ textAlign: 'center' }}>
            How to consult with your doctor in 5 easy steps
          </Typography>
        </m.div>

        {renderCarousel}

        <Box component={m.div} variants={varFade().inUp} sx={{ pt: 15, textAlign: 'center' }}>
          <HomeNoteSignup sx={{ fontSize: { xs: '18px', md: '23px' } }} />
          <HomeNoteFind sx={{ fontSize: { xs: '18px', md: '23px' } }} />
        </Box>
      </Container>
    </StyledRoot>
  );
}
