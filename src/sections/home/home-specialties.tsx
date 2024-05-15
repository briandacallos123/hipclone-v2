import { m } from 'framer-motion';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Image from 'src/components/image';
import { MotionContainer, varFade } from 'src/components/animate';
//
import { HomeNoteSignup } from './components';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { useSearch } from '@/auth/context/Search';
// ----------------------------------------------------------------------

const SPECIALTIES = [
  {
    name: 'allergology',
    value: 'ALLERGOLOGIST',
    label: 'Allergology',
    img: '/assets/icons/specialties 2/allergology.jpg',
  },
  {
    name: 'cardiology',
    value: 'CARDIOLOGIST',
    label: 'Cardiology',
    img: '/assets/icons/specialties 2/cardiology.png',
  },
  {
    name: 'dermatology',
    value: 'DERMATOLOGIST',
    label: 'Dermatology',
    img: '/assets/icons/specialties 2/dermatology.png',
  },
  {
    name: 'diabetology',
    value: 'DIABETOLOGIST',
    label: 'Diabetology',
    img: '/assets/icons/specialties 2/Diabetology.svg',
  },
  {
    name: 'emergency medicine',
    label: 'Emergency Medicine',
    value: 'EMERGENCY MEDICINE',
    img: '/assets/icons/specialties 2/Emergency Medicine.JPG',
  },
  {
    name: 'endocrinology',
    label: 'Endocrinology',
    value: 'ENDOCRINOLOGIST',
    img: '/assets/icons/specialties 2/Endocrinology.png',
  },
  {
    name: 'ent',
    value: 'ENT (OTOLARYNGOLOGY)',
    label: 'ENT',
    img: '/assets/icons/specialties 2/ENT.jpg',
  },
  {
    name: 'family medicine',
    label: 'Family Medicine',
    value: 'FAMILY MEDICINE',
    img: '/assets/icons/specialties 2/Family Medicine.jpg',
  },
  {
    name: 'gastroenterology',
    label: 'Gastroenterology',
    value: 'GASTROENTEROLOGIST',
    img: '/assets/icons/specialties 2/Gastroenterology.jpg',
  },
  {
    name: 'general practice',
    label: 'General Practice',
    value: 'GENERAL PRACTITIONER',
    img: '/assets/icons/specialties 2/General Practice.jpg',
  },
  {
    name: 'infectious diseases',
    label: 'Infectious Diseases',
    value: 'INFECTIOUS DISEASE',
    img: '/assets/icons/specialties 2/Infectious Diseases.jpg',
  },
  {
    name: 'internal medicine',
    label: 'Internal Medicine',
    value: 'INTERNAL MEDICINE',
    img: '/assets/icons/specialties 2/Internal Medicine.jpg',
  },
  {
    name: 'nephrology',
    value: 'NEPHROLOGIST',
    label: 'Nephrology',
    img: '/assets/icons/specialties 2/Nephrology.jpg',
  },
  {
    name: 'neurology',
    value: 'NEUROLOGIST',
    label: 'Neurology',
    img: '/assets/icons/specialties 2/Neurology.png',
  },
  {
    name: 'ob-gyne',
    value: 'OB-GYNE',
    label: 'OB-GYNE',
    img: '/assets/icons/specialties 2/OB-GYNE.jpg',
  },
  {
    name: 'occupational medicine',
    label: 'Occupational Medicine',
    value: 'OCCUPATIONAL MEDICINE',
    img: '/assets/icons/specialties 2/Occupational Medicine.jpg',
  },
  {
    name: 'ophthalmology',
    label: 'Ophthalmology',
    value: 'OPHTHALMOLOGIST',
    img: '/assets/icons/specialties 2/Ophthalmology.png',
  },
  {
    name: 'orthopedic surgery',
    label: 'Orthopedic Surgery',
    value: 'ORTHOPEDIC SURGEON',
    img: '/assets/icons/specialties 2/Orthopedic Surgery.jpg',
  },
  {
    name: 'pediatrics',
    value: 'PEDIATRICS',
    label: 'Pediatrics',
    img: '/assets/icons/specialties 2/Pediatrics.jpg',
  },
  {
    name: 'psychiatry',
    value: 'PSYCHIATRIST',
    label: 'Psychiatry',
    img: '/assets/icons/specialties 2/Psychiatry.jpg',
  },
  {
    name: 'pulmonology',
    value: 'pulmonologist',
    label: 'Pulmonology',
    img: '/assets/icons/specialties 2/Pulmonology.jpg',
  },
  {
    name: 'rehab medicine',
    label: 'Rehab Medicine',
    value: 'REHAB MEDICINE',
    img: '/assets/icons/specialties 2/Rehab Medicine.jpg',
  },
  {
    name: 'surgery',
    value: 'GENERAL SURGEON',
    label: 'Surgery',
    img: '/assets/icons/specialties 2/Surgery.jpg',
  },
  {
    name: 'urology',
    value: 'UROLOGIST',
    label: 'Urology',
    img: '/assets/icons/specialties 2/Urology.png',
  },
];

const StyledWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(8, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10),
  },
}));

const GridStyle = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(6, 1fr)',
  },
}));

const ItemStyle = styled(m.div)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  cursor: 'pointer',
  gap: theme.spacing(2),
  marginTop: theme.spacing(7),
  '& .item_img': {
    height: '100%',
    width: 80,
    lineHeight: 0,
    borderRadius: theme.spacing(1),
    boxShadow: `0 10px 40px ${
      theme.palette.mode === 'light'
        ? alpha(theme.palette.grey[400], 0.48)
        : alpha(theme.palette.common.black, 0.48)
    }`,
    transition: theme.transitions.create('all'),
    '&:hover': {
      transform: `scale(1.2)`,
    },
    [theme.breakpoints.up('md')]: {
      width: 120
    },
  },
}));

// ----------------------------------------------------------------------

export default function HomeSpecialties() {
  const mdUp = useResponsive('up', 'md');
  const { search, setSearch }: any = useSearch();
  const router = useRouter();
  const theme = useTheme();

  const chooseImg = (val: String) => {
    setSearch({ ...search, spec: val });
    router.push(paths.find);
  };

  return (
    <Container component={MotionContainer} maxWidth="xl">
      <StyledWrapper>
        <m.div variants={varFade().inUp}>
          <Typography
            variant={mdUp ? 'h3' : 'h4'}
            sx={{
              textAlign: 'center',
              '& > span': { color: theme.palette.primary.main },
            }}
          >
            Connect with over
            <span>{` validated doctors `}</span>
            nationwide with an extensive selection of specialties
          </Typography>
        </m.div>

        <GridStyle>
          {SPECIALTIES.map((item) => (
            <ItemStyle key={item.name} variants={varFade().in}>
              <div onClick={() => chooseImg(item.value.toLocaleLowerCase())} className="item_img">
                <Image src={item.img} alt={item.label} />
              </div>
              <Typography variant={mdUp ? 'body1' : 'caption'}>{item.label}</Typography>
            </ItemStyle>
          ))}
        </GridStyle>

        <Box component={m.div} variants={varFade().inUp} sx={{ pt: 12, textAlign: 'center' }}>
          <HomeNoteSignup sx={{ fontSize: { xs: '18px', md: '23px' } }} />
        </Box>
      </StyledWrapper>
    </Container>
  );
}
