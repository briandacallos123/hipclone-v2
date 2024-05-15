'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// _mock
import { _emrList } from 'src/_mock';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useRouter } from 'src/routes/hook';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IEmrItem, IEmrTableFilters } from 'src/types/emr';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
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
import stringSimilarity from 'string-similarity';
//
import { useQuery } from '@apollo/client';
import { EMR_PATIENTS, QueryAllPatient } from '../../../libs/gqls/emr';
import EmrCreateView from './emr-create-view';
import EmrLinkView from './emr-link-view';
import EmrAnalytic from '../emr-analytic';
import EmrTableRow from '../emr-table-row';
import EmrTableRowSkeleton from '../emr-table-row-skeleton';
import EmrTableToolbar from '../emr-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'phoneNumber', label: 'Phone number' },
  { id: 'email', label: 'Email' },
  { id: 'status', label: 'Link status', align: 'center' },
  // { id: 'linkedAccount', label: 'Linked account' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  status: -1,
};

// ----------------------------------------------------------------------

export default function EmrListView() {
  const theme = useTheme();

  const upMd = useResponsive('up', 'md');

  const settings = useSettingsContext();

  const table = useTable();
  const [linkId, setLinkId] = useState<string>('');
  const openLink = useBoolean();
  const { page, rowsPerPage, order, orderBy } = table;

  const confirmCreate = useBoolean();

  const confirmDelete = useBoolean();

  const openCreate = useBoolean();
  const router = useRouter();

  /*   const [tableData, setTableData] = useState(_emrList); */
  const [tableData, setTableData]: any = useState([]);
  const [summary, setSummary]: any = useState<any>(null);
  const [filters, setFilters]: any = useState(defaultFilters);

  const [isLoading, setLoading] = useState(true);

  const { data: patientList, refetch: refetchPatient } = useQuery(QueryAllPatient, {
    variables: {
      data: {
        take: 20,
        searchKeyWord: null,
      },
    },
  });
  const [listPatient, setListPatient]: any = useState([]);
  // console.log(tableData, '!!!!!!');

  useEffect(() => {
    if (patientList?.QueryAllPatient) {
      setListPatient(patientList?.QueryAllPatient);
    }
  }, [patientList]);

  const deletePatientInList = (d: any) => {
    // console.log(d, 'd@@@');
    setListPatient((prev: any) => {
      return prev?.filter((i: any) => Number(i?.IDNO) !== Number(d?.IDNO));
    });
  };

  const {
    data: patientData,
    error,
    loading,
    refetch,
  }: any = useQuery(EMR_PATIENTS, {
    context: {
      requestTrackerId: 'emr_data_field[emr_data_field]',
    },
    notifyOnNetworkStatusChange: true,
    variables: {
      data: {
        skip: page * rowsPerPage,
        take: rowsPerPage,
        orderBy,
        orderDir: order,
        status: Number(filters.status),
        searchKeyWord: filters?.name,
      },
    },
  });

  useEffect(() => {
    if (patientData) {
      // console.log(patientData.QueryAllEMR, 'patientData@@@');
      // const { data } = patientData.QueryAllEMR;
      setTableData(patientData?.QueryAllEMR?.emr_data_field);
      setSummary(patientData?.QueryAllEMR?.summary);
      setLoading(false);
    }
  }, [patientData]);

  // const queryData = async () => {
  //   setLoading(true);
  //   getData({
  //     variables: {
  //       data: {
  //         skip: page * rowsPerPage,
  //         take: rowsPerPage,
  //         orderBy,
  //         orderDir: order,
  //         status: Number(filters.status),
  //         searchKeyWord: filters?.name,
  //       },
  //     },
  //   })
  //     .then(async (result: any) => {
  //       const { data } = result;
  //       setTableData(data?.QueryAllEMR?.emr_data_field);
  //       setSummary(data?.QueryAllEMR?.summary);
  //       setLoading(false);
  //     })
  //     .catch((err: any) => {
  //       setLoading(false);
  //     });
  // };

  useEffect(() => {
    // queryData();
    refetchPatient();
  }, [/* data, */ filters.status, filters.name, /* getData,  */ order, orderBy, page, rowsPerPage]);

  // const dataFiltered = applyFilter({
  //   inputData: tableData,
  //   comparator: getComparator(table.order, table.orderBy),
  //   filters,
  // });

  // const dataInPage = dataFiltered.slice(
  //   table.page * table.rowsPerPage,
  //   table.page * table.rowsPerPage + table.rowsPerPage
  // );

  // const loading = false;

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !!filters.name || filters.status !== -1;

  // const notFound = (!tableData?.length && canReset) || !tableData?.length;
  const notFound = !isLoading && !tableData?.length;

  const getEmrLength = (status: string) =>
    tableData?.filter((item: any) => String(item?.status)?.toString() === status)?.length;

  const getPercentByStatus = (status: string) => (getEmrLength(status) / tableData?.length) * 100;

  const TABS = [
    { value: -1, label: 'All', color: 'default', count: summary?.total || 0 },
    {
      value: 1,
      label: 'Linked',
      color: 'success',
      count: summary?.link || 0,
    },
    {
      value: 0,
      label: 'Unlinked',
      color: 'error',
      count: summary?.unlink || 0,
    },
  ] as const;

  const handleFilters = useCallback(
    (name: string, value: string) => {
      table.onResetPage();
      setFilters((prevState): any => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData?.filter((row: any) => row?.id !== id);
      setTableData(deleteRow);

      // table.onUpdatePageDeleteRow(dataInPage.length);
    },
    // [dataInPage.length, table, tableData]
    []
  );

  const handleDeleteRows = useCallback(() => {
    // const deleteRows = tableData?.filter((row: any) => !table.selected.includes(row?.id));
    // setTableData(deleteRows);
    // table.onUpdatePageDeleteRows({
    //   totalRows: tableData?.length,
    //   totalRowsInPage: dataInPage.length,
    //   totalRowsFiltered: dataFiltered.length,
    // });
    // }, [dataFiltered.length, dataInPage.length, table, tableData]);
  }, []);

  const handleLinkRow = useCallback(
    (id: any) => {
      // setLinkId('e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1');

      setLinkId(id);
      openLink.onTrue();
    },
    [openLink]
  );

  const handleViewRow = useCallback(
    (id: any) => {
      // setViewId('e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1');
      // console.log(id, 'IDD');
      router.push(paths.dashboard.emr.view(id?.id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  // console.log(tableData, '@#@#@');
  const optUpdate = (d: any, m: any) => {
    // linkId;
    // console.log(d, 'D@@@@@@');
    // console.log(m, 'm@@@');

    const newData = tableData?.map((i: any) => {
      // console.log(i, '@@@@@@');
      if (Number(i.id) === Number(d.id)) {
        return {
          ...d,
          tempAdd: 1,
          link: 1,
          patientRelation: {
            FNAME: m?.FNAME,
            LNAME: m?.LNAME,
            IDNO: m?.IDNO,
            EMAIL: m?.EMAIL,
            CONTACT_NO: m?.CONTACT_NO,
          },
        };
      }
      return i;
    });
    setTableData(newData.slice(0, rowsPerPage));
  };

  const optCreate = (d: any) => {
    // console.log(d, '!!!!!!!!!');
    const newData = tableData?.map((i: any) => {
      // console.log(i, '@@@@@@');
      if (Number(i.id) === Number(d.id)) {
        return d;
      }
      return i;
    });
    setTableData(newData.slice(0, rowsPerPage));
  };

  const [percentageSimilarity, setPercentageSimilarity]: any = useState(null);

  const calculateSimilarity = (str1: String = '', str2: String = '') => {
    // console.log(str1, str2, 'yay');
    const similarity = stringSimilarity?.compareTwoStrings(str1, str2);
    // console.log(similarity, 'yay@@@@@');

    const similarityPercentage = (similarity * 100).toFixed(2);
    setPercentageSimilarity(similarityPercentage);
  };

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
          <Typography variant="h5">My EMR</Typography>
          <Button
            onClick={confirmCreate.onTrue}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Patient
          </Button>
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
                <EmrAnalytic
                  title="Total"
                  total={summary?.total || 0}
                  percent={100}
                  icon="solar:bill-list-bold-duotone"
                  color={theme.palette.text.primary}
                />

                <EmrAnalytic
                  title="Linked"
                  total={summary?.link || 0}
                  percent={getPercentByStatus('true')}
                  icon="solar:check-circle-bold-duotone"
                  color={theme.palette.success.main}
                />

                <EmrAnalytic
                  title="Unlinked"
                  total={summary?.unlink || 0}
                  percent={getPercentByStatus('false')}
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

          <EmrTableToolbar filters={filters} onFilters={handleFilters} />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table?.dense}
              numSelected={table?.selected.length}
              rowCount={tableData?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData?.map((row: any) => row?.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirmDelete.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
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

                <TableBody>
                  {loading &&
                    [...Array(rowsPerPage)].map((_, i) => <EmrTableRowSkeleton key={i} />)}

                  {!loading &&
                    tableData?.map((row: any, index: number) => (
                      <EmrTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row)}
                        onLinkRow={() => handleLinkRow(row)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  {/* {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => {
                      if (loading) return <EmrTableRowSkeleton key={row.id} />;

                      return (
                        <EmrTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                        />
                      );
                    })} */}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, summary?.allRecords)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={summary?.allRecords || 0}
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

      <EmrCreateView refetch={refetch} open={openCreate.value} onClose={openCreate.onFalse} />

      <EmrLinkView
        open={openLink.value}
        list={listPatient}
        onClose={openLink.onFalse}
        id={linkId}
        calculateSimilarity={calculateSimilarity}
        percentageSimilarity={percentageSimilarity}
        deletePatientInList={deletePatientInList}
        optUpdate={optUpdate}
        // di ko na gagamitin si refetch, naming lang to para di na mag import ng bago
        refetch={refetch}
      />

      <ConfirmDialog
        open={confirmCreate.value}
        onClose={confirmCreate.onFalse}
        title="Create EMR"
        content="You acknowledge that you have sought your patient's consent to sharing personal and sensitive personal information with HIP."
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              openCreate.onTrue();
              confirmCreate.onFalse();
            }}
          >
            Add
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmDelete.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

// function applyFilter({
//   inputData,
//   comparator,
//   filters,
// }: {
//   inputData: IEmrItem[];
//   comparator: (a: any, b: any) => number;
//   filters: IEmrTableFilters;
// }) {
//   const { name, status } = filters;

//   const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

//   stabilizedThis?.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis?.map((el) => el[0]);

//   if (name) {
//     inputData = inputData?.filter(
//       (item) =>
//         item?.firstName?.toLowerCase()?.indexOf(name?.toLowerCase()) !== -1 ||
//         item?.lastName?.toLowerCase()?.indexOf(name?.toLowerCase()) !== -1
//     );
//   }

//   if (status !== 'all') {
//     inputData = inputData?.filter((item) => item?.status?.toString() === status);
//   }

//   return inputData;
// }
