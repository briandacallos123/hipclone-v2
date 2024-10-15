'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Drawer from '@mui/material/Drawer';
import { useTheme, styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Grid, IconButtonProps } from '@mui/material';
import IconButton from '@mui/material/IconButton';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { usePathname, useRouter } from 'src/routes/hook';
// _mock
import { _doctorList, HMO_OPTIONS } from 'src/_mock';
// types
import {
  IAppointmentFindItem,
  IAppointmentFindTableFilters,
  IAppointmentFindTableFilterValue,
} from 'src/types/appointment';
// components
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
import { GET_FYD } from '@/libs/gqls/fyd';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_HMO_BY_UUID } from '@/libs/gqls/hmo';
import { get_hmo_list } from '@/libs/gqls/hmo_list';
//
import Iconify from 'src/components/iconify';
// import { useSearch } from '@/auth/context/Search';
import { useSearch } from '@/auth/context/Search';
import AppointmentFindSteps from '../appointment-find-steps';
import AppointmentFindTableRow from '../appointment-find-table-row';
import AppointmentFindTableRowSkeleton from '../appointment-find-table-row-skeleton';
import AppointmentFindSearchbar from '../appointment-find-searchbar';
import AppointmentFindSearchbarResult from '../appointment-find-searchbar-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [{ id: 'name', label: 'Name/Schedules' }, { id: '' }];

const defaultFilters = {
  name: '',
  hospital: '',
  specialty: '',
  hmo: [],
};

// ----------------------------------------------------------------------
const StyledToggleButton = styled((props) => (
  <IconButton disableRipple {...props} />
))<IconButtonProps>(({ theme }) => ({
  right: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  top: theme.spacing(13),
  borderRadius: `12px 0 0 12px`,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.customShadows.primary,
  '&:hover': {
    backgroundColor: theme.palette.primary.darker,
  },
}));
const NAV_WIDTH = 340;

export default function AppointmentFindView() {
  const upMd = useResponsive('up', 'md');

  const theme = useTheme();
  const lgUp = useResponsive('up', 'lg');


  const [collapse, setCollapse] = useState<boolean>();
  useEffect(() => {
    setCollapse(JSON.parse(sessionStorage.getItem('videoBool')));
  }, []);

  const [view, setView] = useState('row');

  const handleChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
    setView(nextView);
  };

  const [collapseDesktop, setCollapseDesktop] = useState<boolean>(collapse);

  // sessionStorage.setItem('videoBool', JSON.stringify(false));
  useEffect(() => {
    const sideBar = JSON.parse(sessionStorage.getItem('videoBool'));
  
    setCollapseDesktop(sideBar);
  }, [setCollapseDesktop]);

  const handleToggleNav = () => {
    setCollapseDesktop(!collapseDesktop);
  };

  useEffect(() => {
    if (collapseDesktop === false) {
      sessionStorage.setItem('videoBool', JSON.stringify(false));
    }
    if (collapseDesktop === true) {
      sessionStorage.setItem('videoBool', JSON.stringify(true));
    }
  }, [collapseDesktop]);
  const { search, setSearch }: any = useSearch();

  const settings = useSettingsContext();
  const path = usePathname();
  const router = useRouter();

  const isDoctorPath = path === '/dashboard/my-doctors/';

  const [dType, setDType] = useState(isDoctorPath && 1);

  const table = useTable();
  const { page, rowsPerPage, order, orderBy } = table;

  const [tableData, setDataTable] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    if (search?.doctor || search?.clinic || search?.spec || search?.hmo) {
      setFilters((prev: any) => {
        return {
          ...prev,
          name: search?.doctor ? search?.doctor : '',
          hospital: search?.clinic ? search?.clinic : '',
          specialty: search?.spec ? search?.spec : '',
          hmo: search?.hmo?.length ? [Number(search?.hmo)] : [],
        };
      });
    }
  }, [search?.doctor, search?.clinic, search?.spec, search?.spec]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const [getFYD, { data, error, loading, refetch }] = useLazyQuery(GET_FYD, {
    context: {
      requestTrackerId: 'getFYD[gFYD]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    getFYD({
      variables: {
        data: {
          skip: page * rowsPerPage,
          take: rowsPerPage,
          orderBy,
          orderDir: order,
          searchKeyword: String(filters?.name),
          searchSpecial: String(filters?.specialty),
          searchClinic: String(filters?.hospital),
          myDoctor:dType && dType === 1 ? true:false,
          hmoIds: filters?.hmo && filters?.hmo?.map((v: any) => Number(v)),
        },
      },
    }).then(async (result: any) => {
      setSearch(null);
      const { data } = result;
      if (data) {
        const { findYourDoctor } = data;
        setDataTable(findYourDoctor?.FYD_data);
        setTotalRecords(findYourDoctor?.fyd_totalRecords);
      }
    });
  }, [
    page,
    rowsPerPage,
    orderBy,
    order,
    filters?.name,
    filters?.specialty,
    filters?.hospital,
    filters?.hmo,
    dType
  ]);

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name || !!filters.hospital || !!filters.specialty || !!filters.hmo.length;

  const notFound = (!tableData?.length && canReset) || !tableData?.length;

  const handleFilters = useCallback(
    (name: string, value: IAppointmentFindTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );
  const [disableBtn, setDisableBtn] = useState(false);

  const handleBookRow = useCallback(
    (id: string) => {
      setDisableBtn(true);
      if (path.includes('/dashboard')) {
        router.push(paths.dashboard.appointment.book(id));
      } else {
        router.push(paths.book(id));
      }
      // router.push(paths.dashboard.appointment.book('e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1'));
    },
    [path, router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  console.log(view,'VALUE NG VIEW_____________________________________________')

  const {
    data: hmoListData,
    error: hmoListError,
    loading: hmoListLoading,
    refetch: hmoListFetch,
  }: any = useQuery(get_hmo_list);

  const [hmoList, setHmoList] = useState<any>([]);

  useEffect(() => {
    hmoListFetch().then((result: any) => {
      const { data } = result;
      if (data) {
        const { hmo_list } = data;
        setHmoList(hmo_list);
      }
    });
    return () => hmoListFetch();
  }, []);
  const renderBtn = (
    <IconButton
      onClick={handleToggleNav}
      sx={{
        top: 12,
        right: 0,
        zIndex: 9,
        width: 32,
        height: 32,
        borderRight: 0,
        position: 'absolute',
        borderRadius: `12px 0 0 12px`,
        boxShadow: theme.customShadows.z8,
        bgcolor: theme.palette.background.paper,
        border: `solid 1px ${theme.palette.divider}`,
        '&:hover': {
          bgcolor: theme.palette.background.neutral,
        },
        ...(lgUp && {
          ...(!collapseDesktop && {
            right: NAV_WIDTH,
          }),
        }),
      }}
    >
      <Iconify width={16} icon='mingcute:video-fill' />
    </IconButton>
  );

  const renderVideo = (
    <iframe
      width="346"
      height="246"
      src="https://www.youtube.com/embed/qWOqKFketLY?list=UUZPW6HDPrmAbXwyP6vapZiQ"
      title="HIP - How to book an appointment with your doctor"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );

  const DynamicData = () => {
    let content:any;

    if(view === 'row'){
      content =    (!loading &&
        tableData?.map((row: any) => (
          <AppointmentFindTableRow
            key={row?.EMPID}
            isRow={view === 'row'}
            disableBtn={disableBtn}
            row={row}
            isDoctor={isDoctorPath}
            onBookRow={() => handleBookRow(row?.user?.uname || row?.user?.uuid)}
          />
        )))

    }else{
      content = <Grid container spacing={4}>
        {!loading &&
          tableData?.map((row: any) => (
           <Grid item  xs={2} sm={4} md={4} key={row.id}>
               <AppointmentFindTableRow
                isCol={view !== 'row'}
                key={row?.EMPID}
                disableBtn={disableBtn}
                row={row}
                isDoctor={isDoctorPath}
                onBookRow={() => handleBookRow(row?.user?.uname || row?.user?.uuid)}
              />
            </Grid>
        ))}
      </Grid>
    }

    return content

  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Card sx={{ p: 3, mb: 5 }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
          
          {isDoctorPath ? "MY DOCTORS":"FIND YOUR DOCTOR"}
        </Typography>

        <AppointmentFindSearchbar
          filters={filters}
          onFilters={handleFilters}
          //
          hmoOptions={hmoList}
        />

        {canReset && (
          <AppointmentFindSearchbarResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            hmoOptions={hmoList}
            results={dataFiltered.length}
            sx={{ mt: 2 }}
          />
        )}
      </Card>

      <Stack direction="row" sx={{ m: 0 }}>
        <Stack direction="column" sx={{ width: '100%', overflow: 'hidden' }}>
          {/* {!lgUp && (
            <StyledToggleButton onClick={handleToggleNav}>
              <Iconify width={16} icon="mingcute:video-fill" />
            </StyledToggleButton>
          )} */}
          {path !== '/find-doctor/' && <AppointmentFindSteps setDType={setDType} dType={dType} view={view} handleChange={handleChange}/>}
          <Card
            sx={{
              mt: 3,
              boxShadow:
                '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
            }}
          >
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'}>
                  {upMd && (
                    <TableHeadCustom
                      order={table.order}
                      orderBy={table.orderBy}
                      headLabel={TABLE_HEAD}
                      onSort={table.onSort}
                    />
                  )}

                  <TableBody sx={{mt:4}}>
                    {loading &&
                      [...Array(rowsPerPage)].map((v) => (
                        <AppointmentFindTableRowSkeleton key={v} />
                      ))}


                     <DynamicData/>

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, totalRecords)}
                    />

                    <TableNoData notFound={notFound && !loading} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={totalRecords}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              //
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
          </Card>
        </Stack>

        {/* {lgUp ? (
          <Box sx={{ position: 'relative' }}>
            {renderBtn}
            <Stack
              sx={{
                height: 1,
                flexShrink: 0,
                width: NAV_WIDTH,
                borderLeft: `solid 1px ${theme.palette.divider}`,
                transition: theme.transitions.create(['width'], {
                  duration: theme.transitions.duration.shorter,
                }),
                ...(collapseDesktop && {
                  width: 1,
                }),
              }}
            >
              {!collapseDesktop && <Box>{renderVideo}</Box>}
            </Stack>
          </Box>
        ) : (
          <Drawer
            open={collapseDesktop}
            anchor="right"
            onClose={handleToggleNav}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
              sx: {
                pb: 1,
                width: NAV_WIDTH,
              },
            }}
          >
            {renderVideo}
          </Drawer>
        )} */}
      </Stack>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IAppointmentFindItem[];
  comparator: (a: any, b: any) => number;
  filters: IAppointmentFindTableFilters;
}) {
  if (!inputData) return [];

  return inputData;
}
