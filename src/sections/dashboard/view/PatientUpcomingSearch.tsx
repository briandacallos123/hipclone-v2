import { useCallback, useEffect, useState } from 'react';
import { capitalize } from 'lodash';
// @mui
import { Theme, styled, alpha, SxProps } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemText from '@mui/material/ListItemText';
// _mock
import { _patientList } from 'src/_mock';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// types
import { IPatientItem } from 'src/types/patient';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.8),
  backgroundColor: alpha(theme.palette.grey[900], 0.48),
  '&:hover': {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey[900],
  },
  transition: theme.transitions.create('all', {
    duration: theme.transitions.duration.shorter,
  }),
}));

const PaperStyle = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  border: '2px solid transparent',
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  background: theme.palette.background.neutral,
  transition: theme.transitions.create(['border'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    border: `2px solid ${theme.palette.primary.light}`,
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------
type Props = {
  item?: any;
};
export default function PatientUpcomingSearch({ item }: Props) {
  const upMd = useResponsive('up', 'md');

  const popover = usePopover();

  const [tableData, setTableData] = useState<any>([]);

  const [filterName, setFilterName] = useState('');



  useEffect(() => {
    if (filterName.length >= 3) {
      setTableData(
        item?.filter(
          (data: any) =>
            data?.doctorInfo?.EMP_FNAME.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
            data?.doctorInfo?.EMP_FNAME.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        )
      );
    }
    if (!filterName || filterName.length < 3) {
      setTableData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName]);

  return (
    <>
      <StyledIconButton onClick={popover.onOpen} sx={{ width: 32, height: 32 }}>
        <Iconify icon="eva:search-fill" />
      </StyledIconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow={upMd ? 'left-top' : 'top-right'}
        hiddenArrow
        sx={{ ml: 0.75, width: 500, ...(!upMd && { ml: 0, mt: 1 }) }}
      >
        <Stack spacing={1}>
          <TextField
            fullWidth
            size="small"
            value={filterName}
            onChange={(event) => setFilterName(event.target.value)}
            placeholder="Search name..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          {tableData
            .filter((_: any, index: any) => index < 5)
            .map((data: any) => (
              <CarouselItem key={data.id} item={data} />
            ))}
        </Stack>
      </CustomPopover>
    </>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  item: any;
  sx?: SxProps<Theme>;
};

function CarouselItem({ item, sx }: CarouselItemProps) {
  // const { id, patient } = item;

  const router = useRouter();

  const fullName = item?.doctorInfo?.EMP_MNAME ? `${item?.doctorInfo?.EMP_FNAME} ${item?.doctorInfo?.EMP_MNAME} ${item?.doctorInfo?.EMP_LNAME}`:`${item?.doctorInfo?.EMP_FNAME} ${item?.doctorInfo?.EMP_LNAME}`

  const info = `${item?.doctorInfo?.EMP_TITLE}`

  const handleNavigate = useCallback(
    (newId: string) => {
      router.push(paths.dashboard.patient.view(newId));
    },
    [router]
  );

  return (
    <PaperStyle onClick={() => handleNavigate(item.patientInfo?.userInfo?.uuid)} sx={{ ...sx }}>
      <Avatar alt={fullName} sx={{ mr: 1 }}>
        {fullName.trim().charAt(0).toUpperCase()}
      </Avatar>

      <ListItemText
        primary={fullName}
        secondary={info}
        primaryTypographyProps={{ typography: 'subtitle2' }}
        secondaryTypographyProps={{
          component: 'span',
          typography: 'caption',
          color: 'text.disabled',
        }}
      />
    </PaperStyle>
  );
}
