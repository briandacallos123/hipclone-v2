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
import MerchantOrdersTableRow from './merchant-table-row';
import { UseMerchantOrdersContext } from '@/context/merchant/orders/MerchantOrders';
// import MerchantTableRow from '../merchant-table-row';
// import AppointmentAnalytic from '../appointment-analytic';
// import AppointmentTableRow from '../appointment-table-row';
// import AppointmentTableRowSkeleton from '../appointment-table-row-skeleton';
// import AppointmentTableToolbar from '../appointment-table-toolbar';
// import AppointmentTableFiltersResult from '../appointment-table-filters-result';
// import AppointmentDetailsView from './appointment-details-view';
import { YMD } from 'src/utils/format-time';
// import MerchantTableSkeleton from '../merchant-table-skeleton';
import { useSearch } from '@/auth/context/Search';
import MerchantOrderSkeleton from './merchant-order-skeleton';
import MerchantController from './MerchantController';
import AppointmentAnalytic from '@/sections/appointment/appointment-analytic';
import OrderView from './merchant-view';
// import { UseMerchantContext } from '@/context/workforce/merchant/MerchantContext';
// import MerchantCreateView from './merchant-create-view';
// import { UseMerchantMedContext } from '@/context/merchant/Merchant';
// import MerchantCreateView from './merchant-create-view';
// import MerchantMedicineSkeleton from './merchant-table-skeleton';
// import MerchantMedecineTableRow from './merchant-table-row';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'store', label: 'Store Name' },
  { id: 'Medicine Name', label: 'Generic Name' },
  // { id: 'hospital', label: 'Hospital/Clinic' },
  // { id: 'brandName', label: 'Dose' },
  // { id: 'Form', label: 'Form', align: 'center' },
  // { id: 'Quantiy', label: 'Quantity', align: 'center' },
  { id: 'Patient', label: 'Patient', align: 'center' },
  { id: 'Status', label: 'Payment Status', align: 'center' },
  { id: 'Type', label: 'Delivery Type', align: 'center' },
  { id: 'Status_Id', label: 'Status', align: 'center' },

  { id: 'Action', label: "action" },
];



const defaultFilters = {
  name: '',
  status: -1,
  hospital: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------


export default function MerchantOrdersView() {
  const upMd = useResponsive('up', 'md');
  const { setTriggerRef, triggerRef }: any = useSearch();
  const theme = useTheme();
  // const { user } = useAuthContext();
  // const isPatient = user?.role === 'patient';
  const settings = useSettingsContext();
  const confirmDelete = useBoolean();
  const confirmEdit = useBoolean();
  const opencreate = useBoolean();

  const [isClinic, setIsClinic] = useState(0);
  const confirmCancel = useBoolean();

  const confirmDone = useBoolean();


  const openView = useBoolean();

  const [viewId, setViewId] = useState(null);


  const { state, getOrdersResult, doneMerchantOrderFunc, table, deletedMerchantMedFunc, handleFilters, filters, handleFilterStatus }: any = MerchantController();


  const { page, rowsPerPage, order, orderBy } = table;

  const dateError = isDateError(filters.startDate, filters.endDate);

  const router = useRouter();


  const [clinicPayload, setClinicPayload] = useState<any>([]);




  // useEffect(() => {
  //   if (!openView.value && viewId) {
  //     setViewId(null)
  //   }
  // }, [openView.value])
  // ========================




  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name ||
    !!filters.hospital.length ||
    filters.status !== -1 ||
    (!!filters.startDate && !!filters.endDate) ||
    !!filters.startDate ||
    !!filters.endDate;

  const notFound = !getOrdersResult?.loading && !state?.orders?.length;





  const [editRow, setEditRow] = useState(null)



  const handleEditRow = (row: any) => {
    opencreate.onTrue()
    setEditRow(row)

  }

  const handleApproved = (id) => {
    doneMerchantOrderFunc({
      status: 2,
      order_id: id
    })
  }
  
  const handleCancelled = (id) => {
    doneMerchantOrderFunc({
      status: 3,
      order_id: id
    })
  }

  

  const handleDone = (id) => {
    doneMerchantOrderFunc({
      status: 4,
      order_id: id
    })
    // console.log(id,'IDDDDDDDDDDDDDD________________')
  }

  // const handleFilters = useCallback(
  //   (name: string, value: IAppointmentTableFilterValue) => {
  //     table.onResetPage();
  //     setFilters((prevState: any) => ({
  //       ...prevState,
  //       [name]: value,
  //     }));
  //   },
  //   [table]
  // );

  const handleViewRow = useCallback(
    (data: any) => {
      setViewId(data);
      openView.onTrue();
    },
    [openView]
  );


  // const handleResetFilters = useCallback(() => {
  //   setFilters(defaultFilters);
  // }, []);

  const handleViewPatient = useCallback(
    (id: any) => {

      const refID = id?.patientInfo?.userInfo[0]?.uuid;

      router.push(paths.dashboard.patient.view(refID));
    },
    [router]
  );

  const handleDeleteRow = (id: string) => {
    deletedMerchantMedFunc(id)

  }


  const TABS = [
    { value: -1, label: 'All', color: 'default', count: state?.totalRecords },
    {
      value: 1,
      label: 'Pending',
      color: 'warning',
      count: state?.summary?.pending,
    },
    {
      value: 2,
      label: 'Approved',
      color: 'primary',
      count: state?.summary?.approved,
    },
    {
      value: 4,
      label: 'Done',
      color: 'success',
      count: state?.summary?.done,
    },
    {
      value: 3,
      label: 'Cancelled',
      color: 'error',
      count: state?.summary?.cancelled,
    },
   
    // {
    //   value: 0,
    //   label: 'Pick up',
    //   color: 'info',
    //   count: state?.summary?.pickup,
    // },

  ] as const;


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
          <Typography variant="h5">Orders</Typography>




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
                  total={state?.totalRecords}
                  percent={100}
                  icon="solar:bill-list-bold-duotone"
                  color={theme.palette.text.primary}
                  label="orders"
                />

                <AppointmentAnalytic
                  title="Pending"
                  total={state?.summary?.pending}
                  percent={(state?.summary?.pending / state?.totalRecords) * 100}
                  icon="solar:clock-circle-bold-duotone"
                  color={theme.palette.warning.main}
                  label="orders"

                />
                <AppointmentAnalytic
                  title="Approved"
                  total={state?.summary?.approved}
                  percent={(state?.summary?.approved / state?.totalRecords) * 100}
                  icon="solar:close-circle-bold-duotone"
                  color={theme.palette.primary.main}
                  label="orders"

                />
                <AppointmentAnalytic
                  title="Done"
                  total={state?.summary?.done}
                  percent={(state?.summary?.done / state?.totalRecords) * 100}
                  icon="solar:close-circle-bold-duotone"
                  color={theme.palette.success.main}
                  label="orders"

                />
                <AppointmentAnalytic
                  title="Cancelled"
                  total={state?.summary?.cancelled}
                  percent={(state?.summary?.cancelled / state?.totalRecords) * 100}
                  icon="solar:close-circle-bold-duotone"
                  color={theme.palette.error.main}
                  label="orders"

                />

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
                key={tab?.value}
                value={tab?.value}
                label={tab?.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === -1 || tab.value === Number(filters.status)) && 'filled') ||
                      'soft'
                    }
                    color={tab?.color}
                  >
                    {tab?.count}
                    {/* {(() => {
                      if (tab.value === -1) return total || 0;
                      if (tab.value === 0) return pending || 0;
                      if (tab.value === 1) return approved || 0;
                      if (tab.value === 2) return cancelled || 0;
                      if (tab.value === 3) return done || 0;

                      return 0;
                    })()} */}
                  </Label>
                }
              />
            ))}
          </Tabs>
          {/* 
          <AppointmentTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            hospitalOptions={clinicData}
          />

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
            {/* <TableSelectedAction
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
                    <IconButton color="info" onClick={confirmDelete.onTrue}>
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
            /> */}

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: { md: 800 } }}>
                {upMd && (
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    // rowCount={tableData?.length}
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

                  {getOrdersResult?.loading
                    ? [...Array(rowsPerPage)].map((_, i) => <MerchantOrderSkeleton key={i} />)
                    : state?.orders?.map((row: NexusGenInputs['DoctorTypeInputInterface']) => (
                      <MerchantOrdersTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(String(row.id))}
                        onSelectRow={() => table.onSelectRow(String(row.id))}
                        onViewRow={() => handleViewRow(row)}
                        onViewPatient={() => handleViewPatient(row)}
                        onDeleteRow={() => handleDeleteRow(row?.id)}
                        onEditRow={() => handleEditRow(row)}
                        onDone={() => handleDone(row?.id)}
                        onApproved={()=>handleApproved(row?.id)}
                        onCancelled={()=>handleCancelled(row?.id)}
                      />
                    ))}

                  {/*                       
                  { state?.orders?.map((row: NexusGenInputs['DoctorTypeInputInterface']) => (
                        <MerchantOrdersTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(String(row.id))}
                          onSelectRow={() => table.onSelectRow(String(row.id))}
                          onViewRow={() => handleViewRow(row)}
                          onViewPatient={() => handleViewPatient(row)}
                          onDeleteRow={()=>handleDeleteRow(row?.id)}
                          onEditRow={()=>handleEditRow(row)}
                        />
                      ))} */}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, state?.totalRecords)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={state?.totalRecords}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}

            dense={table.dense}
            onChangeDense={table.onChangeDense}

          // page, rowsPerPage, order, orderBy 
          />
        </Card>
      </Container>

      {/* <MerchantCreateView editRow={editRow} isEdit={editRow && true} onClose={()=>{
        opencreate.onFalse();
        setEditRow(null)
      }} open={opencreate.value}/> */}

      <OrderView dataView={viewId} open={openView.value} onClose={openView.onFalse}/>

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
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Approve"
        content={
          <>
            Are you sure want to delete this item?
          </>
        }
        action={
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              confirmDelete.onFalse();
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
