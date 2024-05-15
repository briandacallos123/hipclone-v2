'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _hospitals, HOSPITAL_OPTIONS } from 'src/_mock';
// types
import { IImagingItem, IImagingTableFilters, IImagingTableFilterValue } from 'src/types/document';
// components
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
import { YMD } from 'src/utils/format-time';
import ProfileImagingTableRow from '../imaging-table-row';
import ProfileImagingTableToolbar from '../imaging-table-toolbar';
import ProfileImagingTableFiltersResult from '../imaging-table-filters-result';
import ProfileImagingTableRowSkeleton from '../imaging-table-row-skeleton';

//
import { GET_CLINIC_USER } from 'src/libs/gqls/allClinics';
import { useLazyQuery, useQuery } from '@apollo/client';
import { labreport_patient_data } from '@/libs/gqls/labreport_patient';
// import { labreport_emr_patient_data } from '@/libs/gqls/labreport_emr_patient';
import { emr_labreport_patient_data } from '@/libs/gqls/labreport_emr_patient';
import { DR_CLINICS } from '@/libs/gqls/drprofile';
import { get_note_vitals } from '@/libs/gqls/notes/notesVitals';
//

//
import { usePathname, useParams } from 'src/routes/hook';
//
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'doctor', label: 'Doctor' },
  { id: 'hospital', label: 'Hospital/Clinic' },
  { id: 'labName', label: 'Laboratory Name' },
  { id: 'date', label: 'Result Date' },
  { id: 'type', label: 'Type' },
  { id: 'action', label: 'Action' },
];

const defaultFilters = {
  name: '',
  clinic: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

type Props = {
  data_slug: any;
  isRefetch: any;
  setRefetch: any;
  action?: React.ReactNode;
};

export default function ImagingListView({ data_slug, action, isRefetch, setRefetch }: Props) {
  const params = useParams();
  const { id }: any = params;
  const [isPatient, setIspatient] = useState<boolean>(true);
  const pathname = usePathname();
  const [isClinic, setIsClinic] = useState(0);
  const { user } = useAuthContext();
  // console.log(user?.role, 'emr id');
  const [chartData, setChartData] = useState<any>([]);
  const [dadad, { data: asd, loading: asdd, error: asddd, refetch }] = useLazyQuery(
    get_note_vitals,
    {
      context: {
        requestTrackerId: 'getVitals[gREC]',
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    dadad({
      variables: {
        data: {
          userType: String(user?.role),
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      if (data) {
        const { QueryNotesVitals } = data;
        setChartData(QueryNotesVitals?.vitals_data);
      }
    });
  }, [dadad]);

  const handleRefetch = async () => {
    await refetch({
      variables: {
        data: {
          isPatient,
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      if (data) {
        const { QueryNotesVitals } = data;
        setChartData(QueryNotesVitals?.vitals_data);
      }
    });
  };

  // console.log('newData: ', chartData);

  const upMd = useResponsive('up', 'md');

  const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

  // const [tableData] = useState(data);
  const [total, setTotal] = useState(0);
  const [tableData1, setTableData1] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(true);
  const { page, rowsPerPage, order, orderBy } = table;

  // console.log(tableData1, 'HAAALAAAAAAAAAAAAAAAAA@@@');

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isDateError(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData1,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  // const loading = false;

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name ||
    !!filters.clinic.length ||
    (!!filters.startDate && !!filters.endDate) ||
    !!filters.startDate ||
    !!filters.endDate;

  const notFound = !tableData1.length && !isLoading

  const handleFilters = useCallback(
    (name: string, value: IImagingTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );
  useEffect(() => {
    if (isRefetch) {
      labRefetch().then(() => {
        setRefetch(false);
      });
    }
  }, [isRefetch]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // const pathname = usePathname();
  const isEMR = pathname.includes('my-emr');

  ////////////////////////////////////////////////////////////////////////////
  const {
    data,
    error,
    loading,
    refetch: labRefetch,
  }: any = useQuery(!isEMR ? labreport_patient_data : emr_labreport_patient_data, {
    context: {
      requestTrackerId: !isEMR
        ? 'labreport[labreport_patient_data]'
        : 'emr_labreport[emr_labreport_patient_data]',
    },
    notifyOnNetworkStatusChange: true,
    variables: {
      data: {
        uuid: data_slug || Number(id),
        take: rowsPerPage,
        skip: page * rowsPerPage,
        orderBy,
        userType: user?.role,
        orderDir: order,
        searchKeyword: filters?.name,
        clinicIds: filters?.clinic.map((v: any) => Number(v)),
        startDate: YMD(filters?.startDate) || null,
        endDate: YMD(filters?.endDate) || null,
      },
    },
  });

  useEffect(() => {
    if (data) {
      if (!isEMR) {
        const { labreport_patient_data } = data;
        setTableData1(labreport_patient_data?.labreport_patient);
        setTotal(labreport_patient_data?.total_records);
        setIsClinic(isClinic + 1);
      } else {
        const { emr_labreport_patient_data } = data;
        setTableData1(emr_labreport_patient_data?.e_labreport_patient);
        setTotal(emr_labreport_patient_data?.total_records);
        setIsClinic(isClinic + 1);
      }
      setIsLoading(false)
    }
  }, [data]);
  ////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////
  const [clinicData, setclinicData] = useState<any>([]);
  const {
    data: drClinicData,
    error: drClinicError,
    loading: drClinicLoad,
    refetch: drClinicFetch,
  }: any = useQuery(DR_CLINICS);

  useEffect(() => {
    if (user?.role !== 'patient' && drClinicData) {
      const { doctorClinics } = drClinicData;
      setclinicData(doctorClinics);
    }
  }, [drClinicData, user?.role]);

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
  console.log('@@', clinicPayload);
  useEffect(() => {
    if (user?.role === 'patient' && userClinicData) {
      const { AllClinicUser } = userClinicData;
      setclinicData(AllClinicUser);
    }
  }, [user?.role, userClinicData]);

  useEffect(() => {
    if (isClinic === 1) {
      const clinicItem = tableData1?.map((item: any) => Number(item?.clinic));
      setClinicPayload(clinicItem);
    }
  }, [tableData1]);
  // ========================

  // ////////////////////////////////////////////////////////////////////////

  const [patientInfo, setPatientInfo] = useState({});
  // console.log(patientInfo, 'patientInfo@@@@@');
  useEffect(() => {
    if (tableData1?.length) {
      tableData1?.map((item: any) => {
        if (item.patientInfo) {
          setPatientInfo(item.patientInfo);
        }
        if (item.emrPatientInfo) {
          setPatientInfo(item.emrPatientInfo);
        }
      });
    }
  }, [tableData1]);

  return (
    <Card>
      <ProfileImagingTableToolbar
        filters={filters}
        onFilters={handleFilters}
        action={action}
        //
        hospitalOptions={clinicData}
        // hospitalOptions={HOSPITAL_OPTIONS.map((option) => option)}
      />

      {canReset && (
        <ProfileImagingTableFiltersResult
          filters={filters}
          onFilters={handleFilters}
          hospitalOptions={clinicData}
          //
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
                // onSort={table.onSort}
              />
            )}

            <TableBody>
              {isLoading
                ? [...Array(rowsPerPage)].map((_, i) => <ProfileImagingTableRowSkeleton key={i} />)
                : tableData1?.map((row: any) => (
                    <ProfileImagingTableRow patientData={patientInfo} key={row.id} row={row} />
                  ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, total)}
              />

              <TableNoData notFound={notFound } />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={total}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        //
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IImagingItem[];
  comparator: (a: any, b: any) => number;
  filters: IImagingTableFilters;
  dateError: boolean;
}) {
  if (!inputData) return [];
  return inputData;
}
