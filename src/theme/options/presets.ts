// @mui
import { alpha } from '@mui/material/styles';
// theme
import { palette as themePalette } from 'src/theme/palette';

// ----------------------------------------------------------------------

export function presets(presetsColor: string) {
  const primary = primaryPresets.find((i) => i.name === presetsColor);
  console.log(primary,'HEHEZ')
  const theme = {
    palette: {
      primary,
    },
    customShadows: {
      primary: primary && `0 8px 16px 0 ${alpha(`${primary?.main}`, 0.24)}`,
    },
  };

  return theme;
}

// ----------------------------------------------------------------------

const palette = themePalette('light');

export const primaryPresets = [
  // DEFAULT
  {
    name: 'default',
    ...palette.primary,
  },
  // RED
  {
    name: 'red',
    lighter: '#FFE3D5',
    light: '#FFC1AC',
    main: '#FF3030',
    dark: '#B71833',
    darker: '#7A0930',
    contrastText: '#FFFFFF',
  },
  // PURPLE
  {
    name: 'purple',
    lighter: '#EBD6FD',
    light: '#B985F4',
    main: '#7635dc',
    dark: '#431A9E',
    darker: '#200A69',
    contrastText: '#FFFFFF',
  },
  // BLUE
  {
    name: 'blue',
    lighter: '#D1E9FC',
    light: '#76B0F1',
    main: '#2065D1',
    dark: '#103996',
    darker: '#061B64',
    contrastText: '#FFFFFF',
  },
  // ORANGE
  {
    name: 'orange',
    lighter: '#FEF4D4',
    light: '#FED680',
    main: '#fda92d',
    dark: '#B66816',
    darker: '#793908',
    contrastText: palette.grey[800],
  },
  // GREEN
  {
    name: 'green',
    lighter: '#C8FAD6',
    light: '#5BE49B',
    main: '#00A76F',
    dark: '#007867',
    darker: '#004B50',
    contrastText: '#FFFFFF',
  },
];
