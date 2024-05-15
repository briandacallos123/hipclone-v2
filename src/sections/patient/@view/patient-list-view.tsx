'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hook';
// _mock
import { _patientList, HOSPITAL_OPTIONS } from 'src/_mock';
// types
// import { useParams } from 'src/routes/hook';
import { NexusGenInputs } from 'generated/nexus-typegen';
import {
  IPatientItem,
  IPatientObject,
  IPatientTableFilters,
  IPatientTableFilterValue,
} from 'src/types/patient';
// components
import Label from 'src/components/label';
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
//
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_RECORD } from '@/libs/gqls/records';

import PatientAnalytic from '../patient-analytic';
import PatientTableRow from '../patient-table-row';
import PatientTableRowSkeleton from '../patient-table-row-skeleton';
import PatientTableToolbar from '../patient-table-toolbar';
import PatientTableFiltersResult from '../patient-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phoneNumber', label: 'Phone number' },
  { id: 'gender', label: 'Gender', align: 'center' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  status: -1,
  hospital: [],
};

// ----------------------------------------------------------------------

export default function PatientListView() {
  const upMd = useResponsive('up', 'md');

  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable();
  const { page, rowsPerPage, order, orderBy } = table;

  const params = useParams();
  const { id } = params;

  // const [tableData] = useState(_patientList);
  const [filters, setFilters] = useState(defaultFilters);

  const [isLoading, setIsLoading] = useState(true);

  const { data, loading, error } = useQuery(GET_RECORD, {
    context: {
      requestTrackerId: 'getRecord[gREC]',
    },
    variables: {
      data: {
        sex: Number(filters?.status),
        skip: page * rowsPerPage,
        take: rowsPerPage,
        orderBy,
        orderDir: order,
        searchKeyword: filters?.name,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const [tableItem1, setTable1] = useState<any>([]);
  const [totalData, setTotalData] = useState(0);
  const [totalTab, setTotalTab] = useState(0);
  const [maleTab, setMaleTab] = useState(0);
  const [femaleTab, setFemaleTab] = useState(0);
  const [paginationTotal, setPaginationtotal] = useState(0);
  // const [unspecTab, setPaginationtotal] = useState(0);

  // const [lastFilterString, setLastFilterString] = useState<string>('');
  // const [checkSearchHistory, setSearchHistory] = useState<Boolean>(true);

  // useEffect(() => {
  //   getData({
  //     variables: {
  //       data: {
  //         sex: Number(filters?.status),
  //         skip: page * rowsPerPage,
  //         take: rowsPerPage,
  //         orderBy,
  //         orderDir: order,
  //         searchKeyword: filters?.name,
  //       },
  //     },
  //   }).then(async (result: any) => {
  //     const { data } = result;
  //     if (data) {
  //       const { allRecords } = data;
  //       setTable1(allRecords?.Records_data);
  //       // setTotalData(allRecords?.total_records);
  //       setTotalTab(allRecords?.total_records);
  //       setMaleTab(allRecords?.male);
  //       setFemaleTab(allRecords?.female);
  //       setPaginationtotal(allRecords?.total_records_fix);
  //     }
  //   });
  // }, [
  //   /* data, */ filters?.name,
  //   filters?.status,
  //   /* getData, */ order,
  //   orderBy,
  //   page,
  //   rowsPerPage,
  // ]);
  useEffect(() => {
    if (data) {
      const { allRecords } = data;
      setTable1(allRecords?.Records_data);
      setTotalTab(allRecords?.total_records);
      setMaleTab(allRecords?.male);
      setFemaleTab(allRecords?.female);
      setPaginationtotal(allRecords?.total_records_fix);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (id) {
      console.log('ID: ', id);
    }
  }, [id]);

  const dataFiltered = applyFilter({
    inputData: tableItem1,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  // const loading = false;

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !!filters.name || !!filters.hospital.length || filters.status !== -1;

  const notFound = !isLoading && !tableItem1?.length;

  // const getPatientLength = (gender: number) =>
  //   tableItem1.filter((item: any) => item.SEX === gender).length;

  // const getPercentByStatus = (status: number) =>
  //   (getPatientLength(status) / tableData.length) * 100;

  const getPercentMale = () => (maleTab / totalTab) * 100;
  const getPercentFemale = () => (femaleTab / totalTab) * 100;
  const getPercentUnSpec = () => (totalTab / totalTab) * 100;

  const TABS = [
    { value: -1, label: 'All', color: 'default', count: totalTab || 0 },
    { value: 1, label: 'Male', color: 'info', count: maleTab || 0 },
    { value: 2, label: 'Female', color: 'error', count: femaleTab || 0 },
  ] as const;

  const handleFilters = useCallback(
    (name: string, value: IPatientTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleViewRow = useCallback(
    (id: any) => {

      const refID = id?.patientInfo?.userInfo?.uuid;
      console.log(id,'_____________________IDI_____________________') 
      // console.log('uuid', id?.patientInfo);
      // router.push(paths.dashboard.patient.view('e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1'));
      router.push(paths.dashboard.patient.view(refID)); 
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography
        variant="h5"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Patients
      </Typography>

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
              <PatientAnalytic
                title="Total"
                total={totalTab}
                percent={100}
                icon="solar:users-group-two-rounded-bold-duotone"
                color={theme.palette.text.primary}
              />

              <PatientAnalytic
                title="Male"
                total={maleTab}
                percent={getPercentMale()}
                icon="solar:men-bold-duotone"
                color={theme.palette.info.main}
              />

              <PatientAnalytic
                title="Female"
                total={femaleTab}
                percent={getPercentFemale()}
                icon="solar:women-bold-duotone"
                color={theme.palette.error.main}
              />
              {/* 
            <PatientAnalytic
              title="Unspecified"
              total={unspecTab}
              percent={getPercentUnSpec()}
              icon="solar:question-circle-bold-duotone"
              color={theme.palette.warning.main}
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
                    ((tab.value === -1 || tab.value === filters.status) && 'filled') || 'soft'
                  }
                  color={tab.color}
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <PatientTableToolbar
          filters={filters}
          onFilters={handleFilters}
          //
        />

        {canReset && (
          <PatientTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={(()=>{
              let val:any = 0

              if(filters.status === 2){
                // female
                val = femaleTab
              }else if(filters.status === 1){
                // male
                val = maleTab
              }
              return val;
            })()}
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
                {isLoading &&
                  [...Array(rowsPerPage)].map((_, i) => <PatientTableRowSkeleton key={i} />)}
                {!isLoading &&
                  tableItem1?.map((row: any, index: number) => (
                    <PatientTableRow key={index} row={row} onViewRow={() => handleViewRow(row)} />
                  ))}
                {/* {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row: any) => {
                    if (loading) return <PatientTableRowSkeleton key={row.id} />;

                    return (
                      <PatientTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
                      />
                    );
                  })} */}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, paginationTotal)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={paginationTotal}
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
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: any;
  comparator: (table: any, b: any) => number;
  filters: IPatientTableFilters;
}) {
  if (!inputData) return [];

  return inputData;
}
