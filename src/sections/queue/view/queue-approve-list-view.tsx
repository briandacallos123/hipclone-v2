'use client';

import { useState, useCallback, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useParams } from 'src/routes/hook';

import { useTheme, alpha } from '@mui/material/styles';

// @mui
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// _mock
import { _appointmentList } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IAppointmentItem } from 'src/types/appointment';
// components
import Scrollbar from 'src/components/scrollbar';
import Label from 'src/components/label';
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
import { useRouter } from 'src/routes/hook';
import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
// prisma
import { GET_QUEUES, MUTATE_QUEUES } from '@/libs/gqls/drappts';
import { useQuery, useMutation } from '@apollo/client';

import { useAuthContext } from '@/auth/hooks';
import { AppointmentDetailsView } from 'src/sections/appointment/view';
import QueueApproveTableRow from '../queue-approve-table-row';
import QueueApproveTableRowSkeleton from '../queue-list-table-row-skeleton';
import QueueTableToolbar from '../queue-table-toolbar';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { useMyContext } from './queue-view';
import { useSearch } from '@/auth/context/Search';
import SendSMSCreate from '../sms-create-view';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Patient' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'type', label: 'Type' },
  { id: 'payment', label: 'Payment Status' },
  { id: '', label: 'Action' },
];

const defaultFilters = {
  name: '',
  status: -1,
};

// ----------------------------------------------------------------------

type Props = {
  setAprTotal: any;
};

export default function QueueApproveListView({ setAprTotal }: Props) {
  const upMd = useResponsive('up', 'md');
  const { user } = useAuthContext();
  const theme = useTheme();
  const table = useTable({ defaultOrderBy: 'schedule' });
  const { page, rowsPerPage, order, orderBy } = table;
  const { triggerR, cRefetch, refetchTabs }: any = useMyContext();
  const openView = useBoolean();
  const openSMS = useBoolean();
  const router = useRouter();
  const [telemed, setTelemed] = useState(0);
  const [Face2F, setFace2F] = useState(0);
  const [viewId, setViewId] = useState(null);
  const { patientDone, setPatientDone }: any = useSearch();
  const [tableData, setTableData] = useState<any>([]);
  const [totalData, setTotalData] = useState(0);

  const [filters, setFilters] = useState(defaultFilters);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      sessionStorage.setItem('queueId', JSON.stringify(id));
      // if (!sessionStorage.getItem('queueId')) {

      // }
    }
  }, [id]);
  const denseHeight = table.dense ? 56 : 76;

  const canReset = !!filters.name;
  const userType = user?.role;
  const [createEmr] = useMutation(MUTATE_QUEUES, {
    context: {
      requestTrackerId: 'Prescription_Mutation_Type[MutationPrescription]',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [isLoading, setIsLoading] = useState(true);

  const {
    data: dataLock,
    loading: tableLoading,
    refetch,
  }: any = useQuery(GET_QUEUES, {
    context: {
      requestTrackerId: 'getQueuesApr[Apt-Dash-queue]',
    },
    // fetchPolicy: 'cache-first',
    variables: {
      data: {
        userType: String(userType),
        skip: page * rowsPerPage,
        take: rowsPerPage,
        uuid: id,
        status: 1,
        searchKeyword: filters.name,
        orderBy,
        orderDir: order,
        type: filters?.status,
      },
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (sessionStorage.getItem('hasChanges') === 'true') {
      refetch();
    }
  }, [sessionStorage.getItem('hasChanges')]);

  useEffect(() => {
    if (cRefetch !== '' && cRefetch === 'approved') {
      refetch().then(() => {
        triggerR('');
      });
    }
  }, [cRefetch]);

  useEffect(() => {
    if (dataLock) {
      // const { data } = dataLock;

      const { QueueAll } = dataLock;
      // setTable(todaysAPR);
      setTableData(QueueAll?.queue_data);
      setTotalData(QueueAll?.total_records);
      setTelemed(QueueAll?.telemed);
      setFace2F(QueueAll?.face2face);
      setIsLoading(false);
    }
  }, [dataLock]);

  const [snackKey, setSnackKey] = useState(null);
  useEffect(() => {
    if (dataLock) setAprTotal(totalData);
  }, [dataLock, setAprTotal, totalData]);

  const [toMutate, setToMutate]: any = useState({ data: null, type: null });

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['UpdateDoctor']) => {
      const data: NexusGenInputs['UpdateDoctor'] = {
        id: model.id,
        type: model.type,
      };
      createEmr({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          // console.log(res, 'response');
          const { data } = res;

          // setIsRefetch(data?.MutationPrescription);
          // reset();
          refetch();
          closeSnackbar(snackKey);
          setSnackKey(null);
          refetchTabs();
          enqueueSnackbar('Create success!');
          if (toMutate.type === 1) {
            triggerR('done');
          } else {
            triggerR('cancelled');
          }

          

        })
        .catch((error) => {
          closeSnackbar(snackKey);
          setSnackKey(null);

          enqueueSnackbar('Something went wrong', { variant: 'error' });
          // runCatch();
        });
    },
    [snackKey]
  );

  const notFound = !isLoading && !tableData.length;

  // useEffect(() => {
  //   getData({
  //     variables: {
  //       data: {
  //         skip: page * rowsPerPage,
  //         take: rowsPerPage,
  //         uuid: id,
  //         status: 1,
  //         searchKeyword: filters.name,
  //         orderBy,
  //         orderDir: order,
  //         type: filters?.status,
  //       },
  //     },
  //   }).then(async (result: any) => {
  //     const { data } = result;
  //     if (data) {
  //       const { QueueAll } = data;
  //       // setTable(todaysAPR);
  //       setTableData(QueueAll?.queue_data);
  //       setTotalData(QueueAll?.total_records);
  //       setTelemed(QueueAll?.telemed);
  //       setFace2F(QueueAll?.face2face);
  //     }
  //   });
  // }, [filters.name, page, rowsPerPage, order, orderBy, getData, id, filters?.status]);

  const handleFilters = useCallback(
    (name: string, value: string) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleViewPatient = (data: any) => {
    sessionStorage.setItem('patientView', JSON.stringify({ data: tableData }));
    // setPatientView({ ...patientView, data: tableData });
    router.push(paths.dashboard.patient.view(data?.patientInfo?.UUID));
  };

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleViewRow = useCallback(
    (ids: any) => {
      setViewId(ids);
      openView.onTrue();
    },
    [openView]
  );

  const handleSMS = useCallback(() => {
    openSMS.onTrue();
  }, [openSMS]);

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          id: Number(toMutate?.data?.id),
          type: Number(toMutate?.type),
        });
        //  setSnackKey(null);
      })();
    }
  }, [snackKey]);

  const handleDone = useCallback((ids: any, type: Number) => {
    setToMutate({
      data: ids,
      type,
    });
    const snackbarKey: any = enqueueSnackbar('Saving Data...', {
      variant: 'info',
      key: 'savingEducation',
      persist: true, // Do not auto-hide
    });
    setSnackKey(snackbarKey);
  }, []);

  // useEffect(() => {
  //   if (patientDone !== null) {
  //     console.log(patientDone, 'DONE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  //     setToMutate({
  //       data: Number(patientDone?.id),
  //       type: Number(patientDone?.type),
  //     });
  //     const snackbarKey: any = enqueueSnackbar('Saving Data...', {
  //       variant: 'info',
  //       key: 'savingEducation',
  //       persist: true, // Do not auto-hide
  //     });
  //     setSnackKey(snackbarKey);
  //   }
  // }, [patientDone]);

  const TABS = [
    { value: -1, label: 'All', color: 'default', count: totalData },
    {
      value: 1,
      label: 'Telemedicine',
      color: 'success',
      count: telemed,
    },
    {
      value: 2,
      label: 'Face-To-Face',
      color: 'info',
      count: Face2F,
    },
  ] as const;

  useEffect(()=>{
    if(!openView.value && viewId){
      setViewId(null)
    }
  },[openView])

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
                    if (tab.value === -1) return totalData || 0;
                    if (tab.value === 1) return telemed || 0;
                    if (tab.value === 2) return Face2F || 0;

                    return 0;
                  })()}
                </Label>
              }
            />
          ))}
        </Tabs>
        <QueueTableToolbar filters={filters} onFilters={handleFilters} />

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
                {tableLoading &&
                  [...Array(rowsPerPage)].map((_, i) => <QueueApproveTableRowSkeleton key={i} />)}
                {!tableLoading &&
                  tableData?.map((row: any, index: number) => (
                    <QueueApproveTableRow
                      key={row.id}
                      row={row}
                      sendSmsRow={() => handleSMS()}
                      onViewRow={() => handleViewRow(row)}
                      onDoneRow={() => {
                        handleDone(row, 1);
                      }}
                      onCancelRow={() => {
                        handleDone(row, 2);
                      }}
                      onViewPatient={() => {
                        handleViewPatient(row);
                      }}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, totalData)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={totalData}
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
        open={openView.value}
        onClose={openView.onFalse}
        refetch={refetch}
        id={viewId}
        refetchToday={() => {
          refetchTabs()
        }}
      />}
      <SendSMSCreate open={openSMS.value} onClose={openSMS.onFalse} />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IAppointmentItem[];
  comparator: (a: any, b: any) => number;
  filters: { name: string };
}) {
  if (!inputData) return [];

  return inputData;
}
