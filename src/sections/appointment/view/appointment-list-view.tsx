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
import AppointmentQueueModal from '../appointment-queue-modal';
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
import AppointmentAnalytic from '../appointment-analytic';
import AppointmentTableRow from '../appointment-table-row';
import AppointmentTableRowSkeleton from '../appointment-table-row-skeleton';
import AppointmentTableToolbar from '../appointment-table-toolbar';
import AppointmentTableFiltersResult from '../appointment-table-filters-result';
import AppointmentDetailsView from './appointment-details-view';
import { YMD } from 'src/utils/format-time';
import { useSearch } from '@/auth/context/Search';
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'hospital', label: 'Hospital/Clinic' },
  { id: 'scheduleDate', label: 'Schedule' },
  { id: 'isPaid', label: 'Payment', align: 'center' },
  { id: 'type', label: 'Type', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'action', label: 'Action', align: 'center' },
  // { id: '' },
];

const TABLE_HEAD_PATIENT = [
  { id: 'hospital', label: 'Hospital/Clinic' },
  { id: 'scheduleDate', label: 'Schedule' },
  { id: 'isPaid', label: 'Payment', align: 'center' },
  // { id: 'voucher',label: "Voucher Code", align: 'center' },
  { id: 'type', label: 'Type', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'action', label: 'Action', align: 'center' },
  // { id: '' },
];

const defaultFilters = {
  name: '',
  status: -1,
  hospital: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function AppointmentListView() {
  const upMd = useResponsive('up', 'md');
  const { setTriggerRef, triggerRef }: any = useSearch();
  const theme = useTheme();
  const { user, socket } = useAuthContext();
  const isPatient = user?.role === 'patient';
  const settings = useSettingsContext();
  const confirmApprove = useBoolean();
  const [isClinic, setIsClinic] = useState(0);
  const confirmCancel = useBoolean();

  const confirmDone = useBoolean();

  const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });
  const { page, rowsPerPage, order, orderBy } = table;

  const openView = useBoolean();

  const openPreview = useBoolean();

  const [viewId, setViewId] = useState(null);

  console.log(viewId, "VIEW ID ______________________________________________________")

  const [filters, setFilters]: any = useState(defaultFilters);

  // useEffect(() => {
  //   console.log(filters, '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  // }, [filters]);
  const dateError = isDateError(filters.startDate, filters.endDate);

  const [isLoading, setIsLoading] = useState(true);

  const {
    data: drData,
    loading,
    refetch,
  }: any = useQuery(DR_APPTS, {
    context: {
      requestTrackerId: 'getAppointments[Apt]',
    },
    notifyOnNetworkStatusChange: true,
    variables: {
      // payload request
      data: {
        status: Number(filters?.status),
        typeStatus: -1,
        skip: page * rowsPerPage,
        take: rowsPerPage,
        orderBy,
        orderDir: order,
        searchKeyword: filters?.name,
        clinicIds: filters?.hospital.map((v: any) => Number(v)),
        startDate: YMD(filters?.startDate) || null,
        endDate: YMD(filters?.endDate) || null,
        isDashboard: 0,
        userType: user?.role,
      },
    },
  });

  useEffect(()=>{
    if (socket?.connected) {
      socket.on('appointmentStatus', async(u: any) => {
        if(Number(u?.recepient) === Number(user?.id)){
      
          await refetch()
        }
        
      })
    }

   return () => {
    socket?.off('appointmentStatus')
   }
  },[socket?.connected])

  // useEffect(() => {
  //   if (getDefaultFilters('clinic')) {
  //     let { clinic }: any = getDefaultFilters('clinic');
  //     setFilters({
  //       ...filters,
  //       hospital: [Number(clinic?.id)],
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (drData) {
      const { allAppointments } = drData;
      setTableData(allAppointments?.appointments_data);
      setTotalRecords(allAppointments?.total_records);
      setIsClinic(isClinic + 1);
      setTotal(allAppointments?.summary?.total);
      setPending(allAppointments?.summary?.pending);
      setApproved(allAppointments?.summary?.approved);
      setDone(allAppointments?.summary?.done);
      setCancelled(allAppointments?.summary?.cancelled);
      setIsLoading(false)
    }
  }, [drData]);

  //  useEffect(() => {
  //    getData({
  //      variables: {
  //        // payload request
  //        data: {
  //          status: Number(filters?.status),
  //          typeStatus: -1,
  //          skip: page * rowsPerPage,
  //          take: rowsPerPage,
  //          orderBy,
  //          orderDir: order,
  //          searchKeyword: filters?.name,
  //          clinicIds: filters?.hospital.map((v: any) => Number(v)),
  //          startDate: filters?.startDate,
  //          endDate: filters?.endDate,
  //          isDashboard: 0,
  //          userType: user?.role,
  //        },
  //      },
  //    }).then(async (result: any) => {
  //      const { data } = result;
  //      if (data) {
  //        const { allAppointments } = data;
  //        setTableData(allAppointments?.appointments_data);
  //        setTotalRecords(allAppointments?.total_records);

  //        setTotal(allAppointments?.summary?.total);
  //        setPending(allAppointments?.summary?.pending);
  //        setApproved(allAppointments?.summary?.approved);
  //        setDone(allAppointments?.summary?.done);
  //        setCancelled(allAppointments?.summary?.cancelled);
  //      }
  //    });
  //  }, [
  //    totalRecords,
  //    page,
  //    rowsPerPage,
  //    order,
  //    orderBy,
  //    filters?.endDate,
  //    filters?.startDate,
  //    filters?.hospital,
  //    filters?.name,
  //    filters?.status,
  //  ]);

  const [tableData, setTableData] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [done, setDone] = useState(0);
  const [cancelled, setCancelled] = useState(0);

  const {
    data: drClinicData,
    error: drClinicError,
    loading: drClinicLoad,
    refetch: drClinicFetch,
  }: any = useQuery(DR_CLINICS);
  const router = useRouter();
  const [clinicData, setclinicData] = useState<any>([]);

  useEffect(() => {
    if (triggerRef) {
      refetch().then((prev: any) => {
        setTriggerRef(false);
      });
    }
  }, [triggerRef]);

  useEffect(() => {
    // drClinicFetch().then((result: any) => {
    //   const { data } = result;
    //   if (data) {
    //     const { doctorClinics } = data;
    //     setclinicData(doctorClinics);
    //   }
    // });
    // return () => drClinicFetch();
    if (user?.role === 'doctor' && drClinicData) {
      const { doctorClinics } = drClinicData;
      setclinicData(doctorClinics);
    }
  }, [drClinicData, user?.role]);

  // =========
  // import { GET_CLINIC_USER } from 'src/libs/gqls/allClinics';
  const [clinicPayload, setClinicPayload] = useState<any>([]);
  const {
    data: userClinicData,
    error: userClinicError,
    loading: userClinicLoad,
    refetch: userClinicFetch,
  }: any = useQuery(GET_CLINIC_USER, {
    variables: {
      data: {
        clinicIds: clinicPayload,
      },
    },
  });
 
  useEffect(() => {
    if (user?.role === 'patient' && userClinicData) {
      const { AllClinicUser } = userClinicData;
      setclinicData(AllClinicUser);
    }
  }, [user?.role, userClinicData]);

  useEffect(() => {
    //
    if (isClinic === 1) {
      const clinicItem = tableData?.map((item: any) => Number(item?.clinic));
      setClinicPayload(clinicItem);
    }
  }, [tableData]);
  useEffect(()=>{
    if(!openView.value && viewId){
      setViewId(null)
    }
  },[openView.value])
  // ========================

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

  const notFound = !isLoading  && !tableData?.length;

  const getAppointmentLength = (status: string | number) =>
    tableData?.filter((item: any) => item?.status === status).length;

  const getPercentByStatus = (status: string) =>
    (getAppointmentLength(status) / tableData.length) * 100;

  const TABS = [
    { value: -1, label: 'All', color: 'default', count: tableData?.length },
    {
      value: 0,
      label: 'Pending',
      color: 'warning',
      count: getAppointmentLength(0),
    },
    {
      value: 1,
      label: 'Approved',
      color: 'info',
      count: getAppointmentLength(1),
    },
    { value: 3, label: 'Done', color: 'success', count: getAppointmentLength(3) },
    {
      value: 2,
      label: 'Cancelled',
      color: 'error',
      count: getAppointmentLength(2),
    },
  ] as const;

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

  const [viewQueue, setViewQueue] = useState(null)

  const handleOpenQueue = useCallback((data:any) => {
    setViewQueue(data)
    openPreview.onTrue()

  },[])

  const successModal = useBoolean();
  const successBooking = sessionStorage.getItem('successBooking');

  useEffect(()=>{
    if(successBooking){
      successModal.onTrue()
      sessionStorage.removeItem('successBooking')
    }
  },[successBooking])

 

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
          <Typography variant="h5">Appointments</Typography>

          {user?.role === 'patient' && (
            <Button
              component={RouterLink}
              href={paths.dashboard.appointment.find}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Appointment
            </Button>
          )}
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
                  total={total}
                  percent={100}
                  icon="solar:bill-list-bold-duotone"
                  color={theme.palette.text.primary}
                />

                <AppointmentAnalytic
                  title="Pending"
                  total={pending}
                  percent={(pending / total) * 100}
                  icon="solar:clock-circle-bold-duotone"
                  color={theme.palette.warning.main}
                />

                <AppointmentAnalytic
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
                    {(() => {
                      if (tab.value === -1) return total || 0;
                      if (tab.value === 0) return pending || 0;
                      if (tab.value === 1) return approved || 0;
                      if (tab.value === 2) return cancelled || 0;
                      if (tab.value === 3) return done || 0;

                      return 0;
                    })()}
                  </Label>
                }
              />
            ))}
          </Tabs>

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
          )}

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
                    headLabel={!isPatient ?TABLE_HEAD:TABLE_HEAD_PATIENT }
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
                  {isLoading
                    ? [...Array(rowsPerPage)].map((_, i) => <AppointmentTableRowSkeleton key={i} />)
                    : tableData?.map((row: NexusGenInputs['DoctorTypeInputInterface']) => (
                        <AppointmentTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(String(row.id))}
                          onSelectRow={() => table.onSelectRow(String(row.id))}
                          onViewRow={() => handleViewRow(row)}
                          onViewPatient={() => handleViewPatient(row)}
                          onViewQueue={()=>{
                            handleOpenQueue(row)
                          }}
                        />
                      ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, totalRecords)}
                  />

                  <TableNoData notFound={notFound} />
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
      </Container>

      <AppointmentQueueModal data={viewQueue} open={openPreview.value} onClose={openPreview.onFalse}/>

      {viewId && <AppointmentDetailsView
        updateRow={updateRow}
        refetch={refetch}
        refetchToday={() => {
          console.log('Fetching..');
        }}
        open={openView.value}
        onClose={openView.onFalse}
        id={viewId}
      />}

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
       <SuccessDialog open={successModal.value} handleClose={successModal.onFalse}/>


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


type SuccessDialogProps = {
  open:boolean;
  handleClose:()=>void;
}


const SuccessDialog = ({open, handleClose}:SuccessDialogProps) => {
  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Created appointment successfully!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please wait for your doctor's confirmation, see you.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
