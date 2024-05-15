// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CardProps } from '@mui/material/Card';
// routes
import { RouterLink } from 'src/routes/components';
// theme
import { bgGradient } from 'src/theme/css';
// utils
import { fShortenNumber } from 'src/utils/format-number';
// theme
import { ColorSchema } from 'src/theme/palette';
import { Skeleton, TableCell, TableRow } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  color?: ColorSchema;
  path: string;
  isLoading: any;
}

export default function OverviewWidgetSummary({
  title,
  total,
  color = 'primary',
  path,
  sx,
  isLoading,
  ...other
}: Props) {
  const theme = useTheme();

  // console.log(isLoading, 'yay@');

  return (
    <Stack
      alignItems="center"
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette[color].light, 0.2),
          endColor: alpha(theme.palette[color].main, 0.2),
        }),
        py: 3,
        borderRadius: 2,
        textAlign: 'center',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        ...sx,
      }}
      {...other}
    >
      {isLoading && (
        <TableCell>
          <Skeleton
            sx={{
              width: {
                xs: '100%',
                sm: 100,
              },
            }}
            height={40}
          />
        </TableCell>
      )}

      {!isLoading && total === 0 && <Typography variant="h2">0</Typography>}
      {!isLoading && total !== 0 && <Typography variant="h2">{fShortenNumber(total)}</Typography>}
      {/* {total === 0 ? (
        <TableCell>
          <Skeleton
            sx={{
              width: {
                xs: '100%',
                sm: 100,
              },
            }}
            height={40}
          />
        </TableCell>
      ) : (
        <Typography variant="h2">{fShortenNumber(total)}</Typography>
      )} */}

      <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.64 }}>
        {title}
      </Typography>

      <Button component={RouterLink} href={path} size="small" color="inherit">
        View All
      </Button>
    </Stack>
  );
}
