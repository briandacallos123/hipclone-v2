'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { useAuthContext } from '@/auth/hooks';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock
import { _appointmentList, HOSPITAL_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hook';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import {
  IAppointmentItem,
  IAppointmentTableFilters,
  IAppointmentTableFilterValue,
} from 'src/types/appointment';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { isDateError } from 'src/components/custom-date-range-picker';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

//
import { useLazyQuery, useQuery } from '@apollo/client';
import { DR_APPTS } from '@/libs/gqls/drappts';
import { DR_CLINICS } from '@/libs/gqls/drprofile';
import { GET_CLINIC_USER } from 'src/libs/gqls/allClinics';
import { NexusGenInputs } from 'generated/nexus-typegen';
// import MerchantTableRow from '../merchant-table-row';
import AppointmentAnalytic from '@/sections/appointment/appointment-analytic';
// import AppointmentTableRow from '../appointment-table-row';
// import AppointmentTableRowSkeleton from '../appointment-table-row-skeleton';
// import AppointmentTableToolbar from '../appointment-table-toolbar';
// import AppointmentTableFiltersResult from '../appointment-table-filters-result';
// import AppointmentDetailsView from './appointment-details-view';
import { YMD } from 'src/utils/format-time';
// import MerchantTableSkeleton from '../merchant-table-skeleton';
import { useSearch } from '@/auth/context/Search';
// import { UseMerchantContext } from '@/context/workforce/merchant/MerchantContext';
// import MerchantCreateView from './merchant-create-view';
import { UseMerchantMedContext } from '@/context/merchant/Merchant';
import MerchantCreateView from './merchant-create-view-2';
import MerchantMedicineSkeleton from './merchant-table-skeleton';
import MerchantMedecineTableRow from './merchant-table-row';
import { QueryAllMedecineForMerchant, QueryAllMerchantMedicine } from '@/libs/gqls/merchantUser';
import AppointmentTableToolbar from '@/sections/appointment/appointment-table-toolbar';
import MedecineMerchantToolbar from './appointment-table-toolbar';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID'},

  { id: 'name', label: 'Medecine Name' },
  { id: 'store', label: 'Store Name' },
  { id: 'stock', label: 'Stock', align: 'center' },
  { id: 'price', label: 'Price', align: 'center' },

  // { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Action', align: 'center' },
  // { id: '' },
];



const defaultFilters = {
  name: '',
  status: -1,
  hospital: [],
  startDate: null,
  endDate: null,
  orderBy:null,
  orderDir:null
};

// ----------------------------------------------------------------------


export default function MerchantMedicineView() {
  const upMd = useResponsive('up', 'md');
  const { setTriggerRef, triggerRef }: any = useSearch();
  const theme = useTheme();
  // const { user } = useAuthContext();
  // const isPatient = user?.role === 'patient';
  const settings = useSettingsContext();
  const confirmApprove = useBoolean();
  const confirmEdit = useBoolean();
  const opencreate = useBoolean();

  const [isClinic, setIsClinic] = useState(0);
  const confirmCancel = useBoolean();

  const confirmDone = useBoolean();
  const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });
  const { page, rowsPerPage, order, orderBy } = table;
  const [tableData, setTableData] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [getMedecines, getMedecinesResult] = useLazyQuery(QueryAllMedecineForMerchant, {
    context: {
      requestTrackerId: 'medecines[getMedecinesResult]',
    },
    notifyOnNetworkStatusChange: true,
  });
  const [filters, setFilters]: any = useState(defaultFilters);
  const [summary, setSummary] = useState({totalRecords:0, shortSupply:0})

  useEffect(() => {
    getMedecines({
      variables: {
        data: {
          skip: page * rowsPerPage,
          take: rowsPerPage,
          search: filters.name,
          supply:filters.status,
          orderBy:orderBy ,
          orderDir:order
        }
      }
    }).then((res: any) => {
      const { data } = res;
      if (data) {
        const { QueryAllMedecineForMerchant } = data;
        setTableData(QueryAllMedecineForMerchant?.all)
        setSummary({
          totalRecords:QueryAllMedecineForMerchant?.summaryObjMerchant?.total,
          shortSupply:QueryAllMedecineForMerchant?.summaryObjMerchant?.shortSupply
        })
      }
    })
  }, [table.page, orderBy, order, table.rowsPerPage, filters.sort, filters.name, filters.status, getMedecinesResult.data ])



  const openView = useBoolean();

  const [viewId, setViewId] = useState(null);




  // const { page, rowsPerPage, order, orderBy } = table;

  const dateError = isDateError(filters.startDate, filters.endDate);




  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [done, setDone] = useState(0);
  const [cancelled, setCancelled] = useState(0);


  const router = useRouter();
  const [clinicData, setclinicData] = useState<any>([]);

  const [clinicPayload, setClinicPayload] = useState<any>([]);



  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  // filter hooks

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name ||
    !!filters.hospital.length ||
    filters.status !== -1 ||
    (!!filters.startDate && !!filters.endDate) ||
    !!filters.startDate ||
    !!filters.endDate;

  const notFound = !getMedecinesResult?.loading && !tableData?.length;

  const getAppointmentLength = (status: string | number) =>
    tableData?.filter((item: any) => item?.status === status).length;

  const getPercentByStatus = (status: string) =>
    (getAppointmentLength(status) / tableData.length) * 100;

  const TABS = [
    { value: -1, label: 'All', color: 'default', count:summary?.totalRecords },
    {
      value:1,
      label: 'Short in Stock',
      color: 'error',
      count: summary.shortSupply,
    },
    // {
    //   value: 1,
    //   label: 'Offline',
    //   color: 'info',
    //   count: getAppointmentLength(1),
    // },
    // { value: 3, label: 'Done', color: 'success', count: getAppointmentLength(3) },
    // {
    //   value: 2,
    //   label: 'Cancelled',
    //   color: 'error',
    //   count: getAppointmentLength(2),
    // },
  ] as const;

  const [editRow, setEditRow] = useState(null)



  const handleEditRow = (row: any) => {
    opencreate.onTrue()
    setEditRow(row)

  }

  const handleFilters = useCallback(
    (name: string, value: IAppointmentTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleViewRow = useCallback(
    (data: any) => {
      setViewId(data);
      openView.onTrue();
    },
    [openView]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  //////////////////////////////////////////////////////
  // client side approach
  const updateRow = (d: any) => {
    const { mutation_create_hmo_claims } = d;
    const targetData = {
      ...(typeof viewId === 'object' ? viewId : {}),
      id: mutation_create_hmo_claims?.id,
      hmo_claims: mutation_create_hmo_claims?.hmo_claims_data,
    };
    setTableData((prev: any) => {
      return prev.map((i: any) => {
        if (Number(i?.id) === Number(targetData?.id)) {
          return targetData;
        }
        return i;
      });
    });
  };
  // client side approach
  //////////////////////////////////////////////////////

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewPatient = useCallback(
    (id: any) => {
      // const refID = id?.patientInfo?.userInfo?.uuid;
      const refID = id?.patientInfo?.userInfo[0]?.uuid;
      // console.log('uuid', id);
      // router.push(paths.dashboard.patient.view('e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1'));
      router.push(paths.dashboard.patient.view(refID));
    },
    [router]
  );

  const handleDeleteRow = (id: string) => {
    // DeleteMerchantFunc(id)
   
  }




  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Typography variant="h5">Supply</Typography>

          {/*           
            <Button
              onClick={opencreate.onTrue}
              // component={RouterLink}
              // href={paths.dashboard.appointment.find}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Create New Medecine
            </Button> */}

        </Stack>

        {upMd && (
          <Card
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          >
            <Scrollbar>
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                sx={{ py: 2 }}
              >
                <AppointmentAnalytic
                  title="Total"
                  total={summary?.totalRecords}
                  percent={100}
                  icon="solar:bill-list-bold-duotone"
                  color={theme.palette.text.primary}
                  label="Medecines"
                />

                <AppointmentAnalytic
                  title="Short In Stock"
                  total={summary?.shortSupply}
                  percent={(summary?.shortSupplying / summary?.totalRecords) * 100}
                  icon="solar:clock-circle-bold-duotone"
                  color={theme.palette.error.main}
                  label="Medecines"

                />

                {/* <AppointmentAnalytic
                  title="Approved"
                  total={approved}
                  percent={(approved / total) * 100}
                  icon="solar:play-circle-bold-duotone"
                  color={theme.palette.info.main}
                />

                <AppointmentAnalytic
                  title="Done"
                  total={done}
                  percent={(done / total) * 100}
                  icon="solar:check-circle-bold-duotone"
                  color={theme.palette.success.main}
                />

                <AppointmentAnalytic
                  title="Cancelled"
                  total={cancelled}
                  percent={(cancelled / total) * 100}
                  icon="solar:close-circle-bold-duotone"
                  color={theme.palette.error.main}
                /> */}
              </Stack>
            </Scrollbar>
          </Card>
        )}

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === -1 || tab.value === Number(filters.status)) && 'filled') ||
                      'soft'
                    }
                    color={tab.color}
                  >
                    {tab?.count}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <MedecineMerchantToolbar
            filters={filters}
            onFilters={handleFilters}
          />
          {/* 


          {canReset && (
            <AppointmentTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              hospitalOptions={clinicData}
              //
              onResetFilters={handleResetFilters}
              //
              results={totalRecords}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData?.map((row: NexusGenInputs['DoctorTypeInputInterface']) => row?.id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Approve">
                    <IconButton color="info" onClick={confirmApprove.onTrue}>
                      <Iconify icon="solar:play-circle-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Cancel">
                    <IconButton color="error" onClick={confirmCancel.onTrue}>
                      <Iconify icon="solar:close-circle-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Done">
                    <IconButton color="success" onClick={confirmDone.onTrue}>
                      <Iconify icon="solar:check-circle-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: { md: 800 } }}>
                {upMd && (
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData?.length}
                    // numSelected={table.selected.length}
                    onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     tableData?.map((row: any) => row?.id)
                  //   )
                  // }
                  />
                )}
                {/* {user?.role === 'patient' && (
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                  />
                )} */}

                <TableBody>
                  {/* {merchantData?.length !== 0  && merchantData?.map((row: NexusGenInputs['DoctorTypeInputInterface']) => (
                        <MerchantTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(String(row.id))}
                          onSelectRow={() => table.onSelectRow(String(row.id))}
                          onViewRow={() => handleViewRow(row)}
                          onViewPatient={() => handleViewPatient(row)}
                        />
                  ))
                      } */}
                      {/* {tableData?.map((row: NexusGenInputs['DoctorTypeInputInterface']) => (
                      <MerchantMedecineTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(String(row.id))}
                        onSelectRow={() => table.onSelectRow(String(row.id))}
                        onViewRow={() => handleViewRow(row)}
                        onViewPatient={() => handleViewPatient(row)}
                        onDeleteRow={() => handleDeleteRow(row?.id)}
                        onEditRow={() => handleEditRow(row)}
                      />
                    ))} */}
                  {getMedecinesResult?.loading
                    ? [...Array(rowsPerPage)].map((_, i) => <MerchantMedicineSkeleton key={i} />)
                    : tableData?.map((row: NexusGenInputs['DoctorTypeInputInterface']) => (
                      <MerchantMedecineTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(String(row.id))}
                        onSelectRow={() => table.onSelectRow(String(row.id))}
                        onViewRow={() => handleViewRow(row)}
                        onViewPatient={() => handleViewPatient(row)}
                        onDeleteRow={() => handleDeleteRow(row?.id)}
                        onEditRow={() => handleEditRow(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, summary?.totalRecords)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={summary?.totalRecords}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}

            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <MerchantCreateView refetch={()=>{
        getMedecinesResult.refetch()
      }} editRow={editRow} isEdit={editRow && true} onClose={() => {
        opencreate.onFalse();
        setEditRow(null)
      }} open={opencreate.value} />

      {/* {viewId && <AppointmentDetailsView
        updateRow={updateRow}
        refetch={refetch}
        refetchToday={() => {
          console.log('Fetching..');
        }}
        open={openView.value}
        onClose={openView.onFalse}
        id={viewId}
      />} */}

      <ConfirmDialog
        open={confirmApprove.value}
        onClose={confirmApprove.onFalse}
        title="Approve"
        content={
          <>
            Are you sure want to approve <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              confirmApprove.onFalse();
            }}
          >
            Submit
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmCancel.value}
        onClose={confirmCancel.onFalse}
        title="Cancel"
        content={
          <>
            Are you sure want to cancel <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirmCancel.onFalse();
            }}
          >
            Submit
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmDone.value}
        onClose={confirmDone.onFalse}
        title="Done"
        content={
          <>
            Are you sure want to mark <strong> {table.selected.length} </strong> items as done?
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              confirmDone.onFalse();
            }}
          >
            Submit
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: any;
  comparator: (a: any, b: any) => number;
  filters: IAppointmentTableFilters;
  dateError: boolean;
}) {
  if (!inputData) return [];

  return inputData;
}
