'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Card, { CardProps } from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';
// hooks
import { paths } from 'src/routes/paths';
import { useAuthContext } from '@/auth/hooks';
import { useRouter } from 'src/routes/hook';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock
import { _appointmentList, HOSPITAL_OPTIONS } from 'src/_mock';
// types
import { useSnackbar } from 'src/components/snackbar';
import {
  IAppointmentItem,
  IAppointmentTableFilters,
  IAppointmentTableFilterValue,
} from 'src/types/appointment';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { DR_APPTS, UpdateAppointmentM } from 'src/libs/gqls/drappts';
import { DR_CLINICS } from 'src/libs/gqls/drprofile';
import { GET_CLINIC_USER } from 'src/libs/gqls/allClinics';

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
import DashboardAppointmentTableRow from './dashboard-appointment-table-row';
// import DashboardAppointmentTableRowSkeleton from './dashboard-appointment-table-row-skeleton';
// import DashboardAppointmentTableToolbar from './dashboard-appointment-table-toolbar';
// import DashboardAppointmentTableFiltersResult from './dashboard-appointment-table-filters-result';
import { AppointmentDetailsView } from '../appointment/view';
import { YMD } from 'src/utils/format-time';
import { NexusGenInputs } from 'generated/nexus-typegen';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'hospital', label: 'Hospital/Clinic' },
  { id: 'scheduleDate', label: 'Schedule' },
  { id: 'type', label: 'Type', align: 'center' },
  { id: '' },
];

const TABLE_HEAD_PATIENT = [
  { id: 'hospital', label: 'Hospital/Clinic' },
  { id: 'scheduleDate', label: 'Schedule' },
  { id: 'type', label: 'Type', align: 'center' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  status: -1,
  hospital: [],
  startDate: new Date(),
  endDate: undefined,
  type: -1,
};

const resetFilters = {
  name: '',
  status: -1,
  hospital: [],
  startDate: undefined,
  endDate: undefined,
  type: -1,
};

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  refetchToday?: any;
  setTotalApt?: any;
  isPatient?: any;
}

export default function DashboardAppointmentList({
  refetchToday,
  title,
  subheader,
  setTotalApt,
  isPatient,
}: any) {
  const upMd = useResponsive('up', 'md');
  const { user, socket } = useAuthContext();
  const confirmApprove = useBoolean();
  const [clinicPayload, setClinicPayload] = useState<any>([]);
  const confirmCancel = useBoolean();
  const [isClinic, setIsClinic] = useState(0);
  const confirmDone = useBoolean();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });
  const { page, rowsPerPage, order, orderBy, setSelected } = table;

  const [tableData, setTableData] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isDateError(filters.startDate, filters.endDate);

 

  const denseHeight = table.dense ? 56 : 76;
  const [UpdateAppointment] = useMutation(UpdateAppointmentM);
  const canReset =
    !!filters.name ||
    !!filters.hospital.length ||
    (!!filters.startDate && !!filters.endDate) ||
    !!filters.startDate ||
    !!filters.endDate;

  const notFound = (!tableData?.length && canReset) || !tableData?.length;

  const handleFilters = useCallback(
    (name: string, value: IAppointmentTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  // const openView = useBoolean();
  // const [viewId, setViewId] = useState<any>(null);
  // const handleViewRow = useCallback(
  //   (data: any) => {
  //     setViewId(data);
  //     openView.onTrue();
  //   },
  //   [openView]
  // );

  // const handleResetFilters = useCallback(() => {
  //   setFilters(resetFilters);
  // }, []);

  // useEffect(()=>{
  //   if(!openView.value && viewId){
  //     setViewId(null)
  //   }
  // },[openView.value])

  // const {
  //   data: appt_data,
  //   error,
  //   loading,
  //   refetch,
  // }: any = useQuery(DR_APPTS, {
  //   context: {
  //     requestTrackerId: 'getAppointments[Apt-Dash]',
  //   },
  //   fetchPolicy: 'cache-first',
  //   variables: {
  //     data: {
  //       status: 0,
  //       typeStatus: filters.type,
  //       skip: page * rowsPerPage,
  //       take: rowsPerPage,
  //       orderBy,
  //       orderDir: order,
  //       searchKeyword: filters?.name,
  //       clinicIds: filters?.hospital.map((v: any) => Number(v)),
  //       startDate: YMD(filters?.startDate) || null,
  //       endDate: YMD(filters?.endDate) || null,
  //       isDashboard: 1,
  //       userType: user?.role,
  //     },
  //   },
  // });

  // useEffect(()=>{
  //   if(socket?.connected){
  //     socket.on('appointmentStatus',async(r:any)=>{
       
  //       if(Number(r?.recepient) === Number(user?.id) && Number(r?.notification_type) === 1){
  //         console.log("AYAW@@@")
  //         await refetch()
  //       }
  //     })
  //   }

  //   return () => {
  //     socket.off('appointmentStatus')
  //   }
  // },[socket?.connected])

  // useEffect(()=>{
  //   const isToRefetch = localStorage.getItem('isPending');

  //   if(isToRefetch){
  //     refetch()
  //     .then(()=>{
  //       localStorage.setItem('isPending','')
  //     })
  //   }
  // },[])

  // const [snackKey, setSnackKey]: any = useState(null);
  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // const handleSubmitValue = useCallback(
  //   async (model: NexusGenInputs['AppointmentUpdateMultitple']) => {
  //     const data: NexusGenInputs['AppointmentUpdateMultitple'] = {
  //       id: model.id,
  //       type: model.type,
  //     };
  //     UpdateAppointment({
  //       variables: {
  //         data,
  //       },
  //     })
  //       .then(async (res) => {
  //         if (snackKey) {
  //           const { data } = res;

  //           closeSnackbar(snackKey);
  //           enqueueSnackbar('Updated Successfully');
  //           setSnackKey(null);
  //           refetch();
  //           refetchToday();
  //           setSelected([]);
  //         }
  //       })
  //       .catch((error) => {
  //         closeSnackbar(snackKey);
  //         setSnackKey(null);

  //         enqueueSnackbar('Something went wrong', { variant: 'error' });
  //         // runCatch();
  //       });
  //   },
  //   [snackKey]
  // );

  // const openView = useBoolean();
  // const [viewId, setViewId] = useState<any>([]);
  // const handleViewRow = useCallback(
  //   (data: any) => {
  //     setViewId(data);
  //     openView.onTrue();
  //   },
  //   [openView]
  // );

  // const handleResetFilters = useCallback(() => {
  //   setFilters(defaultFilters);
  // }, []);

  // useEffect(() => {
  //   if (appt_data) {
  //     // const { data } = appt_data;
  //     // if (data) {
  //     const { allAppointments } = appt_data;
  //     setTableData(allAppointments?.appointments_data);
  //     setTotalRecords(allAppointments?.total_records);
  //     setTotalApt(allAppointments?.total_records);
  //     setIsClinic(isClinic + 1);

  //     // }
  //   }
  // }, [appt_data]);

  // const dataFiltered = applyFilter({
  //   inputData: appt_data?.allAppointments,
  //   comparator: getComparator(table.order, table.orderBy),
  //   filters,
  //   dateError,
  // });

  // const [lastFilterString, setLastFilterString] = useState<string>('');
  // const [checkSearchHistory, setSearchHistory] = useState<Boolean>(true);
  // first data load when component is rendered
  // useEffect(() => {
  //   if (checkSearchHistory) {
  //     getData({
  //       variables: {
  //         data: {
  //           status: 0,
  //           typeStatus: filters.type,
  //           skip: page * rowsPerPage,
  //           take: rowsPerPage,
  //           orderBy,
  //           orderDir: order,
  //           searchKeyword: filters?.name,
  //           clinicIds: filters?.hospital.map((v: any) => Number(v)),
  //           startDate: filters?.startDate,
  //           endDate: filters?.endDate,
  //           isDashboard: 1,
  //         },
  //       },
  //     }).then(async (result: any) => {
  //       const { data } = result;
  //       if (data) {
  //         const { allAppointments } = data;
  //         setTableData(allAppointments?.appointments_data);
  //         setTotalRecords(allAppointments?.total_records);
  //       }
  //     });
  //   }
  // }, [filters.status, checkSearchHistory, filters?.startDate, filters?.endDate, filters.type, filters?.name, filters?.hospital, page, rowsPerPage, orderBy, order]);

  // filter hooks
  // useEffect(() => {
  //   const checkFilteredHistory: any = (str: string, total: any) => {
  //     if (total === 0) {
  //       return lastFilterString.length >= str.length;
  //     }
  //     return !!total;
  //   };

  //   const fetch: any = checkFilteredHistory(filters?.name, totalRecords);
  //   setSearchHistory(Boolean(fetch));

  //   if (totalRecords !== 0) {
  //     getData({
  //       variables: {
  //         data: {
  //           status: 0,
  //           typeStatus: filters.type,
  //           skip: page * rowsPerPage,
  //           take: rowsPerPage,
  //           orderBy,
  //           orderDir: order,
  //           searchKeyword: filters?.name,
  //           clinicIds: filters?.hospital.map((v: any) => Number(v)),
  //           startDate: filters?.startDate,
  //           endDate: filters?.endDate,
  //         },
  //       },
  //     }).then(async (result: any) => {
  //       const { data } = result;
  //       if (data) {
  //         const { allAppointments } = data;
  //         setTableData(allAppointments?.appointments_data);
  //         setTotalRecords(allAppointments?.total_records);
  //         if (allAppointments?.total_records !== 0) {
  //           setLastFilterString(filters?.name);
  //         }
  //       }
  //     });
  //   }
  // }, [
  //   lastFilterString,
  //   totalRecords,
  //   page,
  //   rowsPerPage,
  //   order,
  //   orderBy,
  //   filters?.endDate,
  //   filters?.startDate,
  //   filters?.hospital,
  //   filters?.name,
  //   filters.type,
  // ]);

  // const {
  //   data: drClinicData,
  //   error: drClinicError,
  //   loading: drClinicLoad,
  //   refetch: drClinicFetch,
  // }: any = useQuery(DR_CLINICS);
  // const [clinicData, setclinicData] = useState<any>([]);

  // useEffect(() => {
  //   if (user?.role === 'doctor' && drClinicData) {
  //     const { doctorClinics } = drClinicData;
  //     setclinicData(doctorClinics);
  //   }
  // }, [drClinicData, user?.role]);

  // // =========
  // // import { GET_CLINIC_USER } from 'src/libs/gqls/allClinics';
  // const {
  //   data: userClinicData,
  //   error: userClinicError,
  //   loading: userClinicLoad,
  //   refetch: userClinicFetch,
  // }: any = useQuery(GET_CLINIC_USER, {
  //   variables: {
  //     data: {
  //       clinicIds: clinicPayload,
  //     },
  //   },
  // });
  // console.log('@@awitttt', clinicData);
  // useEffect(() => {
  //   if (user?.role === 'patient' && userClinicData) {
  //     const { AllClinicUser } = userClinicData;
  //     setclinicData(AllClinicUser);
  //   }
  // }, [user?.role, userClinicData]);

  // useEffect(() => {
  //   if (isClinic === 1) {
  //     const clinicItem = tableData?.map((item: any) => Number(item?.clinic));
  //     setClinicPayload(clinicItem);
  //   }
  // }, [tableData]);
  // // ========================

  // const handleViewPatient = useCallback(
  //   (id: any) => {
  //     const refID = id?.patientInfo?.userInfo[0]?.uuid;
  //     // console.log('uuid@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', id?.patientInfo);
  //     // router.push(paths.dashboard.patient.view('e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1'));
  //     router.push(paths.dashboard.patient.view(refID));
  //   },
  //   [router]
  // );

  // const [type, setType]: any = useState(null);

  // useEffect(() => {
  //   if (snackKey) {
  //     (async () => {
  //       await handleSubmitValue({ type, id: table.selected.map((i) => Number(i)) });
  //     })();
  //   }
  // }, [snackKey]);

  // const onSubmit = (type: String) => {
  //   const snackbarKey = enqueueSnackbar('Saving Data...', {
  //     variant: 'info',
  //     key: 'savingEducation',
  //     persist: true, // Do not auto-hide
  //   });
  //   setType(type);
  //   setSnackKey(snackbarKey);
  // };

  return (
    <>
      <Card>
        <CardHeader title={title} subheader={subheader} />

        {/* <DashboardAppointmentTableToolbar
          isPatient={isPatient}
          filters={filters}
          onFilters={handleFilters}
          //
          dense={table.dense}
          hospitalOptions={clinicData}
          onChangeDense={table.onChangeDense}
        /> */}

        {/* {canReset && (
          <DashboardAppointmentTableFiltersResult
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
                tableData?.map((row: any) => row?.id)
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
            <Table size={table.dense ? 'small' : 'medium'}>
              {upMd && user?.role !== 'patient' && (
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData?.map((row: any) => row?.id)
                    )
                  }
                />
              )}
              {/* {user?.role === 'patient' && upMd && (
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD_PATIENT}
                  onSort={table.onSort}
                />
              )} */}

              <TableBody>
                {/* {loading &&
                  [...Array(rowsPerPage)].map((_, i) => (
                    <DashboardAppointmentTableRowSkeleton key={i} />
                  ))} */}
                {/* {!loading &&
                  tableData?.map((row: any) => (
                    <DashboardAppointmentTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row?.id)}
                      onSelectRow={() => table.onSelectRow(row?.id)}
                      onViewRow={() => handleViewRow(row)}
                      onViewPatient={() => handleViewPatient(row)}
                    />
                  ))} */}

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

      {/* <ConfirmDialog
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
              onSubmit('approve');
              confirmApprove.onFalse();
            }}
          >
            Submit
          </Button>
        }
      /> */}

      {/* <ConfirmDialog
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
              onSubmit('cancel');
              confirmCancel.onFalse();
            }}
          >
            Submit
          </Button>
        }
      /> */}

      {/* <ConfirmDialog
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
              onSubmit('done');
              confirmDone.onFalse();
            }}
          >
            Submit
          </Button>
        }
      /> */}
      {/* {viewId && <AppointmentDetailsView
        refetch={refetch}
        refetchToday={refetchToday}
        open={openView.value}
        onClose={openView.onFalse}
        id={viewId}
       
      />} */}
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
  /* const { name, hospital, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (item : any) =>
        item?.patientInfo?.fname.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item?.patientInfo?.lname.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (hospital.length) {
    inputData = inputData.filter((item) => hospital.includes(item.hospital.name));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (item) =>
          fTimestamp(item.schedule) >= fTimestamp(startDate) &&
          fTimestamp(item.schedule) <= fTimestamp(endDate)
      );
    }
  } */
  if (!inputData) return [];

  return inputData;
}
