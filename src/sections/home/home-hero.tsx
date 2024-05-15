import { m } from 'framer-motion';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Image from 'src/components/image';
import { MotionContainer, varFade } from 'src/components/animate';
//
import { HomeNoteFind, HomeNoteSignup } from './components';

// ----------------------------------------------------------------------

const StyledWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(15, 0, 3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(12, 9, 10),
  },
}));

const TitleStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 0,
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
  const mdUp = useResponsive('up', 'md');

  const theme = useTheme();

  const CONTENT_TITLE = ['Health', 'Is', 'Priority'];

  const renderTitle = (
    <TitleStyle>
      {CONTENT_TITLE.map((title) => (
        <Typography
          key={title}
          sx={{
            typography: mdUp ? 'h3' : 'h2',
            lineHeight: 1,
            '& > span': { color: theme.palette.primary.main },
          }}
        >
          <span>{title.charAt(0)}</span>
          {title.substring(1)}
        </Typography>
      ))}
    </TitleStyle>
  );

  const renderHeader = (
    <Typography
      sx={{
        fontSize: mdUp ? '38px' : '26px',
        fontWeight: 'bold',
        lineHeight: 1,
        '& > span': { color: theme.palette.primary.main },
      }}
    >
      The <span>{` VIRTUAL CLINIC `}</span>
      that conveniently and safely connects you with your doctor
    </Typography>
  );

  const renderBody = (
    <Typography
      sx={{
        fontSize: '20px',
        '& > span': { fontWeight: 700 },
        ...(mdUp && { fontSize: '23px', lineHeight: 1 }),
      }}
    >
      {/* Your and your family&apos;s health should never be put on hold. With
      <span>{` HIPS`}</span>, you can access doctors online and conveniently schedule your
      face-to-face or online medical consultations. */}
      Ensuring the health of both you and your family should always be a top priority. Through{' '}
      <span>{` HIPS`}</span>, you have the ability to connect with doctors remotely and conveniently
      book either in-person or virtual medical consultations.
      {mdUp && (
        <>
          <br />
          <br />
          <Link
            variant="subtitle1"
            color="primary.main"
            href="#benefits"
            underline="none"
            sx={{
              fontSize: mdUp ? '23px' : '20px',
              lineHeight: mdUp && 1,
              '&:hover': { cursor: 'pointer' },
            }}
          >
            {'Learn more '}
          </Link>
          about the benefits of signing up for a free patient account now.
        </>
      )}
    </Typography>
  );

  return (
    <>
      <Container component={MotionContainer} maxWidth="xl" sx={{ height: 1 }}>
        <StyledWrapper>
          <Grid container spacing={{ md: 7 }}>
            {!mdUp && (
              <Grid xs={12} sx={{ position: 'relative' }}>
                <m.div variants={varFade().inRight}>{renderTitle}</m.div>

                <m.div variants={varFade().inUp} style={{ marginTop: 10 }}>
                  <Image
                    src="/assets/images/home/newHome.jpg"
                    sx={{
                      width: 'auto',
                      borderRadius: 2,
                      lineHeight: 0,
                    }}
                  />
                </m.div>
              </Grid>
            )}

            <Grid xs={12} md={7} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component={m.div}
                variants={varFade().inRight}
                sx={{ pt: 10, ...(!mdUp && { pt: 4, textAlign: 'center' }) }}
              >
                {renderHeader}

                {mdUp && (
                  <>
                    <Box sx={{ mt: 7, pr: 10 }}>{renderBody}</Box>

                    <HomeNoteSignup sx={{ mt: 12, fontSize: '23px' }} />

                    {renderTitle}
                  </>
                )}
              </Box>
            </Grid>

            {mdUp && (
              <Grid xs={12} md={5}>
                <m.div variants={varFade().inUp}>
                  <Image
                    src="/assets/images/home/newHome.jpg"
                    sx={{
                      width: 600,
                      borderRadius: 2,
                      lineHeight: 0,
                      boxShadow: `-20px 20px 80px ${
                        theme.palette.mode === 'light'
                          ? alpha(theme.palette.grey[500], 0.48)
                          : alpha(theme.palette.common.black, 0.48)
                      }`,
                    }}
                  />
                </m.div>
              </Grid>
            )}
          </Grid>

          <Box component={m.div} variants={varFade().inUp} sx={{ pt: 5, textAlign: 'center' }}>
            {!mdUp && <HomeNoteSignup sx={{ mt: 5, fontSize: '20px' }} />}
            <HomeNoteFind sx={{ fontSize: { xs: '18px', md: '20px' } }} />
          </Box>
        </StyledWrapper>
      </Container>

      {!mdUp && (
        <Box
          component={MotionContainer}
          sx={{ py: 3, px: 2, bgcolor: 'background.neutral', textAlign: 'center' }}
        >
          <m.div variants={varFade().inRight}>{renderBody}</m.div>
        </Box>
      )}
    </>
  );
}
