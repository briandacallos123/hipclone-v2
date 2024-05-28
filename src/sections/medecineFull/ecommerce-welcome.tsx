// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CardProps } from '@mui/material/Card';
// theme
import { bgGradient } from 'src/theme/css';
import { Button, FormControl, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  description?: string;
  img?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EcommerceWelcome({ title, description, action, img, ...other }: Props) {
  const theme = useTheme();

  return (
    <Stack
      flexDirection={{ xs: 'column', md: 'row' }}
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette.primary.light, 0.2),
          endColor: alpha(theme.palette.primary.main, 0.2),
        }),
        height: { md: 1 },
        borderRadius: 2,
        position: 'relative',
        color: 'primary.darker',
        backgroundColor: 'common.white',
      }}
      {...other}
    >
      <Stack
        flexGrow={1}
        justifyContent="center"
        alignItems={{ xs: 'center', md: 'flex-start' }}
        sx={{
          p: {
            xs: theme.spacing(5, 3, 0, 3),
            md: theme.spacing(5),
          },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography paragraph variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            opacity: 0.8,
            maxWidth: 360,
            mb: { xs: 3, xl: 2 },
          }}
        >
          {description}
        </Typography>

       <Stack spacing={2}>
       <FormControl sx={{ mt:.5, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Location</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password" 
            endAdornment={
              <InputAdornment position="end">
                 <Iconify icon="mdi:location"/>
              </InputAdornment>
            }
            label="Location"
            sx={{
              border:'1px solid gray'
            }}
          />
        </FormControl>

        <Button fullWidth variant="contained" color="success">Search</Button>
       </Stack>

        {/* <TextField
        id="input-with-icon-textfield"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
            
              <Iconify icon="mdi:location"/>
            </InputAdornment>
          ),
        }}
        variant="standard"
        sx={{
          border:'1px solid gray',
          borderRadius:'10px',
          p:.5
        }}
      /> */}

        {action && action}
      </Stack>

      {img && (
        <Stack
          component="span"
          justifyContent="center"
          sx={{
            p: { xs: 5, md: 3 },
            maxWidth: 360,
            mx: 'auto',
          }}
        >
          {img}
        </Stack>
      )}
    </Stack>
  );
}
