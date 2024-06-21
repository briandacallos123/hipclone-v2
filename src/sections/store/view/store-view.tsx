'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
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
// import MedecineSkeleton from '../medecine-skeleton';
// import AppointmentAnalytic from '../appointment-analytic';
// import AppointmentTableRow from '../appointment-table-row';
// import AppointmentTableRowSkeleton from '../appointment-table-row-skeleton';
// import AppointmentTableToolbar from '../appointment-table-toolbar';
// import AppointmentTableFiltersResult from '../appointment-table-filters-result';
// import AppointmentDetailsView from './appointment-details-view';
import { YMD } from 'src/utils/format-time';
import { useSearch } from '@/auth/context/Search';
import { UseOrdersContext } from '@/context/dashboard/medecine/Medecine';
// import MedecineTableRow from '../medecine-table-row';
// import MedecineCreateView from './merchant-create-view';
// import MedecineCreateFullView from './merchant-create-view-full';
import StoreCreateView from './store-create-view';
import storeController from '../StoreController';
import StoreSkeletonView from './store-skeleton-view';
import StoreTableRow from './store-table-row';
import StoreSkeletonRow from './store-skeleton';
import StoreToolbar from './store-toolbar';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  // { id: 'productType', label: 'Product Types' },
  { id: 'rating', label: 'Rating', align: 'left' },
  { id: 'active', label: 'Status', align: 'left' },
  // { id: 'desc', label: 'Description', align: 'left' },

  { id: '', label: "Action", align: 'center' },
];


// const defaultFilters = {
//   name: '',
//   status: -1,
//   hospital: [],
//   startDate: null,
//   endDate: null,
// };

// ----------------------------------------------------------------------

// type StoreViewProps = {
//   data:[],
// }

export default function StoreListView() {
  const upMd = useResponsive('up', 'md');
  const { setTriggerRef, triggerRef }: any = useSearch();
  const theme = useTheme();
  const { user, socket } = useAuthContext();
  const isPatient = user?.role === 'patient';
  const settings = useSettingsContext();
  const confirmApprove = useBoolean();
  const [isClinic, setIsClinic] = useState(0);
  const confirmCancel = useBoolean();

  // const [summaryData, setSummaryData] = useState(null)
  // const [totalRecordsData, setTotalRecordsData] = useState(null)


  const { loading, table, state: tableState,handleSubmitDelete, handleFilterStatus, filters, setFilters, handleFilters }: any = storeController()
  const { tableData, summary, totalRecords } = tableState




  // useEffect(() => {
  //   setTotalRecordsData(totalRecords)
  //   setSummaryData(summaryData)
  // }, [totalRecords, summaryData])

  const { state, deletedOrderFunc }: any = UseOrdersContext()

  const confirmDone = useBoolean();

  const confirmOrder = useBoolean();

  const { page, rowsPerPage, order, orderBy } = table;

  const openView = useBoolean();

  const [viewId, setViewId] = useState(null);


  // const [filters, setFilters]: any = useState(defaultFilters);

  const dateError = isDateError(filters.startDate, filters.endDate);



  // const [totalRecords, setTotalRecords] = useState(0);

  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [done, setDone] = useState(0);
  const [cancelled, setCancelled] = useState(0);

  const router = useRouter();
  const [clinicData, setclinicData] = useState<any>([]);

  const [clinicPayload, setClinicPayload] = useState<any>([]);

  const denseHeight = table.dense ? 56 : 76;


  const notFound = !loading && !tableData?.length;

  const getAppointmentLength = (status: string | number) =>
    tableData?.filter((item: any) => item?.status === status).length;

  const getPercentByStatus = (status: string) =>
    (getAppointmentLength(status) / tableData.length) * 100;




  const TABS = [
    { value: -1, label: 'All', color: 'default', count: totalRecords },
    { value: 1, label: 'Active', color: 'success', count: summary?.active },
    { value: 2, label: 'Inactive', color: 'error', count:summary?.inactive },
  ] as const

 

  const handleViewRow = useCallback(
    (data: any) => {
      setViewId(data);
      openView.onTrue();
    },
    [openView]
  );

  const handleManageRow = useCallback(
    (id: number) => {
      router.push(paths.merchant.manage(id));

    },
    [openView]
  );


 
  // const updateRow = (d: any) => {
  //   const { mutation_create_hmo_claims } = d;
  //   const targetData = {
  //     ...(typeof viewId === 'object' ? viewId : {}),
  //     id: mutation_create_hmo_claims?.id,
  //     hmo_claims: mutation_create_hmo_claims?.hmo_claims_data,
  //   };
  //   setTableData((prev: any) => {
  //     return prev.map((i: any) => {
  //       if (Number(i?.id) === Number(targetData?.id)) {
  //         return targetData;
  //       }
  //       return i;
  //     });
  //   });
  // };



  const handleViewPatient = useCallback(
    (id: any) => {
      const refID = id?.patientInfo?.userInfo[0]?.uuid;

      router.push(paths.dashboard.patient.view(refID));
    },
    [router]
  );

  const [deleteId, setDeleteId] = useState(null)

  const handleDeleteRow = useCallback(async (id: any) => {
   
    setDeleteId(id)
    confirmApprove.onTrue()
  }, [])




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
          <Typography variant="h5">Store</Typography>

          <Button
            // component={RouterLink}
            // href={paths.dashboard.appointment.find}
            onClick={() => {
              // console.log("huh?")
              confirmOrder.onTrue()
            }}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Create New Store
          </Button>
        </Stack>

        {upMd && (
          <Card
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          >

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
          
          <StoreToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            hospitalOptions={clinicData}
          />

          

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
                  {loading
                    ? [...Array(rowsPerPage)].map((_, i) => <StoreSkeletonRow key={i} />)
                    : tableData?.map((row: NexusGenInputs['DoctorTypeInputInterface']) => (
                      <StoreTableRow
                        key={row.id}
                        row={row}
                        // onSelectRow={() => table.onSelectRow(String(row.id))}
                        onViewRow={() => handleViewRow(row)}
                        onManageRow={() => handleManageRow(Number(row?.id))}
                      onDeleteRow={()=>handleDeleteRow(row?.id)}
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
      {/* 
      {viewId && <AppointmentDetailsView
        updateRow={updateRow}
        refetch={refetch}
        refetchToday={() => {
          console.log('Fetching..');
        }}
        open={openView.value}
        onClose={openView.onFalse}
        id={viewId}MedecineCreateFullView
      />} */}
      <StoreCreateView open={confirmOrder?.value} onClose={confirmOrder.onFalse} />
      {/* <MedecineCreateFullView open={confirmOrder?.value} onClose={confirmOrder.onFalse}/> */}

      <ConfirmDialog
        open={confirmApprove.value}
        onClose={confirmApprove.onFalse}
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
            onClick={async() => {
               handleSubmitDelete(deleteId)
               confirmApprove.onFalse()
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
            Are you sure want to delete this item?
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
