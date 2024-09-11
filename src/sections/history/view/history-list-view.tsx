'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock
import { HOSPITAL_OPTIONS } from 'src/_mock';
// prisma
import {
  GET_ALL_PATIENT_APPOINTMENTS,
  GET_ALL_PATIENT_APPOINTMENTS_USER,
  GET_ALL_PATIENT_APPOINTMENTS_CLINIC
} from '@/libs/gqls/appointmentHistory';
import { GET_CLINIC_USER } from 'src/libs/gqls/allClinics';
import { PATIENT_APPTS } from '@/libs/gqls/patientApt';
import { DoctorClinicsHistory } from '@/libs/gqls/drprofile';
import { useLazyQuery, useQuery } from '@apollo/client';
// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useParams, usePathname } from 'src/routes/hook';
// types
import {
  IAppointmentItem,
  IAppointmentTableFilters,
  IAppointmentTableFilterValue,
} from 'src/types/appointment';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { isDateError } from 'src/components/custom-date-range-picker';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
//
import AppointmentHistoryTableRow from '../history-table-row';
import AppointmentHistoryTableRowSkeleton from '../history-table-row-skeleton';
import AppointmentHistoryTableToolbar from '../history-table-toolbar';
import AppointmentHistoryTableFiltersResult from '../history-table-filters-result';
import { AppointmentDetailsView } from '../../appointment/view';
import { YMD } from 'src/utils/format-time';
import { useSessionStorage } from '@/hooks/use-sessionStorage';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'doctor', label: 'Doctor' },
  { id: 'hospital', label: 'Hospital/Clinic' },
  { id: 'date', label: 'Schedule' },
  { id: 'type', label: 'Type', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  // { id: 'paymentStatus', label: 'Payment Status', align: 'center' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  status: -1,
  hospital: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function AppointmentHistoryListView() {
  const upMd = useResponsive('up', 'md');
  const pathname = usePathname();
  const [isPatient, setIspatient] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (pathname.includes('user')) {
      setIspatient(true);
    } else {
      setIspatient(false);
    }
  }, [pathname]);
  const theme = useTheme();
  const [filters, setFilters] = useState(defaultFilters);
  const table = useTable({ defaultOrderBy: 'date', defaultOrder:'desc' });
  const { page, rowsPerPage, order, orderBy } = table;

  const openView = useBoolean();

  const [viewId, setViewId] = useState<string>(null);

  const [getData, getDataResult]: any = useLazyQuery(GET_ALL_PATIENT_APPOINTMENTS, {
    context: {
      requestTrackerId: 'getAppointmentsHistory[AptHistory]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [getPatUserData, getPatUserResult]: any = useLazyQuery(
    GET_ALL_PATIENT_APPOINTMENTS_USER,
    {
      context: {
        requestTrackerId: 'getAppointmentsHistory[AptHistory]',
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const { id } = useParams();


  const { user, getDefaultFilters } = useAuthContext();
  const [tableData, setTableData] = useState<any>([]);
  const [tempData, setTempData] = useState<any>([]);
  const [summary, setSummary]: any = useState({});
  // const [totalRecords, setTotalRecords] = useState(0);
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [done, setDone] = useState(0);
  const [cancelled, setCancelled] = useState(0);
  const [telemed, setTelemed] = useState(0);
  const [faceToFace, setFaceToFace] = useState(0);
  const [clinicTake, setClinicTake] = useState(5);
  const [isClinic, setIsClinic] = useState(0);

  const {
    data: drClinicData,
    error: drClinicError,
    loading: drClinicLoad,
    refetch: drClinicFetch,
  }: any = useQuery(GET_ALL_PATIENT_APPOINTMENTS_CLINIC,{
    variables:{
      data:{
        uuid:id
      }
    }
  });

  const [clinicData, setclinicData] = useState<any>([]);


  const containsLetters = (value: any) => /[a-zA-Z]/.test(value);
  // const [tableLoading, setTableLoading] = useState(true);
  useEffect(() => {
    const customId = (() => {
      if (containsLetters(id)) {
        // for patient
        return { uuid: id };
      }
      return { emrID: Number(id) };
      // for emr
    })();

    if (user?.role === 'doctor' || user?.role === 'secretary') {
      getData({
        variables: {
          // payload request
          data: {
            status: Number(filters?.status),
            skip: page * rowsPerPage,
            take: rowsPerPage,
            orderBy,
            orderDir: order,
            searchKeyword: filters?.name,
            clinicIds: filters?.hospital.length
              ? filters?.hospital.map((v: any) => Number(v))
              : null,
            startDate: YMD(filters?.startDate) || null,
            endDate: YMD(filters?.endDate) || null,
            ...customId,
            // uuid: id,
            // userType: user?.role,
          },
        },
      }).then(async (result: any) => {
        const { data } = result;

        if (data) {
          const { GET_ALL_PATIENT_APPOINTMENTS } = data;
          setTableData(GET_ALL_PATIENT_APPOINTMENTS?.patientAppointment);
          setSummary(GET_ALL_PATIENT_APPOINTMENTS?.summary);
          setIsLoading(false);
          setTotal(GET_ALL_PATIENT_APPOINTMENTS?.summary?.totalRecords)
          // setTotalRecords(allAppointmentsbyUuid?.total_records);
          // setTotal(allAppointmentsbyUuid?.summary?.total);
          // setPending(allAppointmentsbyUuid?.summary?.pending);
          // setApproved(allAppointmentsbyUuid?.summary?.approved);
          // setDone(allAppointmentsbyUuid?.summary?.done);
          // setCancelled(allAppointmentsbyUuid?.summary?.cancelled);
          // setTelemed(allAppointmentsbyUuid?.summary?.telemedicine);
          // setFaceToFace(allAppointmentsbyUuid?.summary?.faceToFace);
        }
      });
    }
  }, [
    page,
    rowsPerPage,
    order,
    orderBy,
    filters?.endDate,
    filters?.startDate,
    filters?.hospital,
    filters?.name,
    filters?.status,
  ]);
  const { getItem } = useSessionStorage();


  useEffect(() => {
    const data = getItem('defaultFilters');
    if (data?.clinic) {
      filters.hospital = [Number(data?.clinic?.id)]
    }
  }, []);
  // useEffect(() => {
  //   if (getDefaultFilters('clinic')) {
  //     let { clinic }: any = getDefaultFilters('clinic');
  //     setFilters({
  //       ...filters,
  //       hospital: [Number(clinic?.id)],
  //     });
  //   }
  // }, []);

  // patient user
  useEffect(() => {
    if (user?.role === 'patient') {
      getPatUserData({
        variables: {
          // payload request
          data: {
            status: Number(filters?.status),
            skip: page * rowsPerPage,
            take: rowsPerPage,
            orderBy,
            orderDir: order,
            searchKeyword: filters?.name,
            clinicIds: filters?.hospital.length
              ? filters?.hospital.map((v: any) => Number(v))
              : null,
            startDate: YMD(filters?.startDate) || null,
            endDate: YMD(filters?.endDate) || null,
            // userType: user?.role,
          },
        },
      }).then(async (result: any) => {
        const { data } = result;
        setIsLoading(false);
        if (data) {
          const { GET_ALL_PATIENT_APPOINTMENTS_USER } = data;
          setTableData(GET_ALL_PATIENT_APPOINTMENTS_USER?.patientAppointment);
          setSummary(GET_ALL_PATIENT_APPOINTMENTS_USER?.summary);
          setIsClinic(isClinic + 1);
          setTotal(GET_ALL_PATIENT_APPOINTMENTS_USER?.summary?.totalRecords)
          // setclinicData(GET_ALL_PATIENT_APPOINTMENTS_USER?.clinic)
          // setTotal(GET_ALL_PATIENT_APPOINTMENTS_USER)
          
          // setTotalRecords(allAppointmentsbyUuid?.total_records)
        }
      });
    }
  }, [
    page,
    rowsPerPage,
    order,
    orderBy,
    filters?.endDate,
    filters?.startDate,
    filters?.hospital,
    filters?.name,
    filters?.status,
    user?.role,
  ]);


  useEffect(() => {
    if ((drClinicData && user?.role === 'doctor') || user?.role === 'secretary') {
      // setclinicData(drClinicData?.DoctorClinicsHistory);
      setclinicData(drClinicData?.GET_ALL_PATIENT_APPOINTMENTS_CLINIC?.clinic)
      // console.log(drClinicData,'drClinicDatadrClinicDatadrClinicDatadrClinicDatadrClinicData')
    }
  }, [drClinicData]);

  // import { GET_CLINIC_USER } from 'src/libs/gqls/allClinics';
  const [clinicPayload, setClinicPayload] = useState<any>([]);
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
  // console.log('@@', clinicPayload);
  // useEffect(() => {
  //   if (user?.role === 'patient' && userClinicData) {
  //     const { AllClinicUser } = userClinicData;
  //     setclinicData(AllClinicUser);
  //   }
  // }, [user?.role, userClinicData]);

  useEffect(() => {
    if (isClinic === 1) {
      const clinicItem = tableData?.map((item: any) => Number(item?.clinicInfo?.id));
      setClinicPayload(clinicItem);
    }
  }, [tableData, isClinic]);
  // ========================

  const dateError = isDateError(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name ||
    !!filters.hospital.length ||
    filters.status !== -1 ||
    (!!filters.startDate && !!filters.endDate) ||
    !!filters.startDate ||
    !!filters.endDate;

  // const notFound = (!getPatUserResult.loading && !getDataResult.loading) && !tableData.length;
  const notFound = !(user?.role === 'patient' ? getPatUserResult.loading: getDataResult.loading) && !tableData.length;

  // const getAppointmentLength = (status: any) =>
  //   tableData1.filter((item: any) => item.status === 1).length;

  const TABS = [
    { value: -1, label: 'All', color: 'default', count: summary?.all || 0 },
    {
      value: 0,
      label: 'Pending',
      color: 'warning',
      count: summary?.pending || 0,
    },
    {
      value: 1,
      label: 'Approved',
      color: 'info',
      count: summary?.approve || 0,
    },
    {
      value: 2,
      label: 'Cancelled',
      color: 'error',
      count: summary?.cancelled || 0,
    },
    { value: 3, label: 'Done', color: 'success', count: summary?.done || 0 },
  ] as const;

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

  const handleViewRow = useCallback(
    (item: any) => {
      setViewId(item);
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

  const handleResetFilters = useCallback(() => {
    setFilters({
      name: '',
      status: -1,
      hospital: [],
      startDate: null,
      endDate: null,
    });
  }, []);

  return (
    <>
      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {/* { value: -1, label: 'All', color: 'default', count: summary?.all },
    {
      value: 0,
      label: 'Pending',
      color: 'warning',
      count: summary?.pending || 0,
    },
    {
      value: 1,
      label: 'Approved',
      color: 'info',
      count: summary?.approve || 0,
    }, */}
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    ((tab.value === -1 || tab.value === filters.status) && 'filled') || 'soft'
                  }
                  color={tab.color}
                >
                  {(() => {
                    if (tab.value === -1) return summary?.all || 0;
                    if (tab.value === 0) return summary?.pending || 0;
                    if (tab.value === 1) return summary?.approve || 0;
                    if (tab.value === 2) return summary?.cancelled || 0;
                    if (tab.value === 3) return summary?.done || 0;
                    // if (tab.value === 4) return telemed || 0;
                    // if (tab.value === 5) return faceToFace || 0;
                    return 0;
                  })()}
                </Label>
              }
            />
          ))}
        </Tabs>

        <AppointmentHistoryTableToolbar
          filters={filters}
          onFilters={handleFilters}
          clinicTake={clinicTake}
          setClinicTake={() => {
            setClinicTake((prev) => {
              return (prev += 5);
            });
          }}
          //
          hospitalOptions={clinicData}
        />

        {canReset && (
          <AppointmentHistoryTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            hospitalOptions={clinicData}
            onResetFilters={handleResetFilters}
            //
            results={total}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: { md: 800 } }}>
              {upMd && (
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={table.onSort}
                />
              )}

              <TableBody>
                {/* {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => {
                    if (loading) return <AppointmentHistoryTableRowSkeleton key={row.id} />;

                    return (
                      <AppointmentHistoryTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
                      />
                    );
                  })} */}

                {(getPatUserResult.loading || getDataResult.loading) &&
                  [...Array(rowsPerPage)].map((_, i) => (
                    <AppointmentHistoryTableRowSkeleton key={i} />
                  ))}
                {!(getPatUserResult.loading || getDataResult.loading) &&
                  tableData?.map((row: any) => (
                    <AppointmentHistoryTableRow
                      key={row.id}
                      row={row}
                      onViewRow={() => handleViewRow(row)}
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
          count={summary?.totalRecords || 0}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      {viewId && <AppointmentDetailsView
        isHistory={true}
        open={openView.value}
        onClose={openView.onFalse}
        id={viewId}
        refetchToday={() => {
          console.log('Fetching..');
        }}
      />}
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
  inputData: IAppointmentItem[];
  comparator: (a: any, b: any) => number;
  filters: IAppointmentTableFilters;
  dateError: boolean;
}) {
  if (!inputData) return [];
  return inputData;
}
