'use client';

import { useState, useCallback, useEffect, forwardRef } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// _mock
import { v4 as uuidv4 } from 'uuid';

import { _userService } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
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
import ServicePaymentMethodTableRow from './service-payment-method-table-row';
import ServicePaymentMethodTableRowSkeleton from './service-payment-method-table-row-skeleton';
import ServicePaymentMethodCreate from './service-payment-method-create';
import ServicePaymentMethodEdit from './service-payment-method-edit';
import { useQuery } from '@apollo/client';
import { DeletePayment, GetPaymentMethod } from '../../../libs/gqls/services';
import { useMutation } from '@apollo/client';
import { CreatePayment } from '@/libs/gqls/services';
import { NexusGenInputs } from 'generated/nexus-typegen';
import { useSnackbar } from 'src/components/snackbar';
import './styles/service.css'
// ----------------------------------------------------------------------

type IUserPaymentItem = {
  id: string;
  name: string;
  accountNumber: string;
  instruction: string;
};

const TABLE_HEAD = [
  { id: 'name', label: 'Method' },
  { id: 'accountNumber', label: 'Account Number' },
  { id: 'instruction', label: 'Instruction' },
  { id: '', label: 'Action' },
];

// ----------------------------------------------------------------------

const ServicePaymentMethodList = forwardRef(({ tutorialTab, incrementTutsTab }, ref) => {
  const upMd = useResponsive('up', 'md');

  const table = useTable({ defaultOrderBy: 'accountNumber' });

  // console.log(table.selected, 'yey@@');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [deletePayment] = useMutation(DeletePayment, {
    context: {
      requestTrackerId: 'Prescription_Mutation_Type[MutationPrescription]',
    },
    notifyOnNetworkStatusChange: true,
  });
  const {
    loading: load,
    data: services,
    refetch,
  } = useQuery(GetPaymentMethod, {
    variables: {
      data: {
        take: table.rowsPerPage,
        skip: table.page * table.rowsPerPage,
      },
    },
  });

  const [tableData, setTableData] = useState([]);

  const [servicesData, setServicesData]: any = useState(null);
  const [tempId, setTempId] = useState(uuidv4());

  // console.log(services, 'yawa ');
  useEffect(() => {
    if (services) {
      //  servicesData?.GetPaymentMethod?.data?
      setServicesData(services?.GetPaymentMethod?.data);
    }
  }, [services]);

  const [serverData, setServerData] = useState(null);

  useEffect(() => {
    if (serverData) {
      // console.log('ServerData', serverData);
      const newData = servicesData?.map((i: any) => {
        if (i?.tempId === serverData?.tempId) {
          return serverData;
        }
        return i;
      });
      setServicesData(newData.slice(0, table.rowsPerPage));
    }
  }, [serverData]);

  const appendData = (d: any) => {
    setServicesData((prev: any) => {
      const allIds: any = [];
      let actualData: any = [];

      const myNewData = {
        acct: d?.accountNumber,
        title: d?.name,
        description: d?.instruction,
        tempId,
        client: 1,
      };

      prev?.forEach((i: any) => {
        let push: any = true;

        if (!allIds.includes(i?.id)) {
          allIds.push(i?.id);
          if (!allIds.includes(myNewData?.tempId)) {
            allIds.push(myNewData?.tempId);
            actualData = [...actualData, myNewData];
          }
        } else {
          push = false;
        }
        if (push) {
          actualData = [...actualData, i];
        }

        // if(!allIds.includes(myNewData?.tempId)){

        // }
        // if (!allIds.includes(myNewData?.tempId)) {
        //   allIds.push(myNewData?.tempId);
        //   actualData.push(myNewData);
        // }
        // if (!allIds.includes(i?.id)) {
        //   allIds.push(i?.id);
        //   actualData.push(i);
        // }

        // if (!allIds.includes(i?.id)) {
        //   if (!allIds.includes(myNewData?.tempId)) {
        //     allIds.push(myNewData?.tempId);
        //     actualData = [myNewData, ...actualData];
        //   }
        //   allIds.push(i?.id);
        //   actualData.push(i);
        // }
      });

      // console.log('allIds: ', allIds);
      // console.log('Actual: ', actualData);

      return actualData;

      // return (prev = [myNewData, ...prev].slice(0, table.rowsPerPage));
    });
  };

  const [snackKey, setSnackKey] = useState(null);

  const handleSubmitValue = useCallback(
    async (model: NexusGenInputs['PaymentMethodInputsDel']) => {
      const data: NexusGenInputs['PaymentMethodInputsDel'] = {
        id: model.id,
      };
      deletePayment({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          // console.log(res, 'response');
          const { data } = res;
          closeSnackbar(snackKey);
          // setIsRefetch(data?.MutationPrescription);
          setSnackKey(null);
          refetch();
          enqueueSnackbar('Deleted successfully!');
        })
        .catch((error) => {
          closeSnackbar(snackKey);
          console.log(error, 'ERRORD DAW@');
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          // runCatch();
        });
    },
    [snackKey]
  );
  const [deleteId, setDeleteId] = useState([]);

  useEffect(() => {
    if (snackKey || deleteId?.length) {
      (async () => {
        await handleSubmitValue({
          id: deleteId,
        });

        table.setSelected([]);
      })();
    }
  }, [snackKey, deleteId?.length]);

  const confirm = useBoolean();

  const openCreate = useBoolean();

  const openEdit = useBoolean();

  const [editId, setEditId] = useState(null);

  // function for updating client side
  const updateData = (d: any) => {
    const newTable = servicesData?.map((i) => {
      if (i?.id === editId?.id) {
        return {
          acct: d?.accountNumber,
          description: d?.instruction,
          id: d?.id,
          title: d?.name,
          client: 1,
        };
      }
      return i;
    });
    setServicesData(newTable);
  };

  const onSuccessUpdate = (d: any) => {
    const newTable = servicesData?.map((i) => {
      if (i?.id === d?.id) {
        return d;
      }
      return i;
    });
    setServicesData(newTable);
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  // client side
  // const appendData = (d) => {

  // }
  // const loading = false;

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const notFound = !load && !services?.GetPaymentMethod?.data?.length;

  const handleDeleteRows = useCallback(() => {
    // const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    // setTableData(deleteRows);
    const toDeleteDatas = table.selected;
    // console.log(toDeleteDatas, 'ids@');
    // table.onUpdatePageDeleteRows({
    //   totalRows: tableData.length,
    //   totalRowsInPage: dataInPage.length,
    //   totalRowsFiltered: dataFiltered.length,
    // });
    const snackbarKey: any = enqueueSnackbar('Deleting Data...', {
      variant: 'info',
      key: 'Deleting',
      persist: true, // Do not auto-hide
    });
    setSnackKey(snackbarKey);
    setDeleteId(toDeleteDatas);
  }, [table.selected]);

  const handleEditRow = useCallback(
    (id: any) => {
      setEditId(id);
      openEdit.onTrue();
    },
    [openEdit]
  );

  const handleDeleteRow = useCallback(
    (id: any) => {
      // const deleteRow = tableData.filter((row) => row.id !== id);
      // setTableData(deleteRow);
      // table.onUpdatePageDeleteRow(dataInPage.length);
      // console.log("yey")
      const snackbarKey: any = enqueueSnackbar('Deleting Data...', {
        variant: 'info',
        key: 'Deleting',
        persist: true, // Do not auto-hide
      });
      setSnackKey(snackbarKey);
      setDeleteId(id.id);
      // openEdit.onTrue();
    },
    [dataInPage.length, table, tableData]
  );
  const [isView, setIsView] = useState(false)

  const handleViewRow = async (row) => {
    try {
      const response = await fetch('/api/getImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: row?.attachment?.filename
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      // setImgSrc(objectUrl);
      // setNoteData(row)


      setEditId({
        ...row,
        attachment: {
          id: row?.attachment?.id,
          filename: objectUrl
        }
      });
      setIsView(true)
      openEdit.onTrue();

      // Clean up object URL on component unmount
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } catch (error) {
      console.error('Error fetching image:', error);
    }


  }

  return (
    <>
      <div className={tutorialTab && !openCreate.value && tutorialTab === 11 ? 'service-fee ' : ''}>
        <Card ref={ref}>
          <CardHeader
            title="Payment Method"
            action={
              <Button
                onClick={openCreate.onTrue}
                disabled={load}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Method
              </Button>
            }
          />

          <TableContainer sx={{ mt: 3, position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={servicesData?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  servicesData.map((row: any) => row?.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      confirm.onTrue();
                    }}
                  >
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
                    rowCount={servicesData?.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     servicesData.map((row: any) => row?.id)
                  //   )
                  // }
                  />
                )}

                <TableBody>
                  {load &&
                    [...Array(table.rowsPerPage)].map((_, i) => (
                      <ServicePaymentMethodTableRowSkeleton key={i} />
                    ))}
                  {!load &&
                    servicesData &&
                    servicesData?.map((row: any, index: number) => (
                      <ServicePaymentMethodTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row)}
                        onEditRow={() => handleEditRow(row)}
                        onViewRow={() => handleViewRow(row)}
                      />
                    ))}

                  {/* {services?.GetPaymentMethod?.data &&
                  services?.GetPaymentMethod?.data?.slice(0, table.rowsPerPage).map((row) => {
                    if (load) return <ServicePaymentMethodTableRowSkeleton key={row.id} />;

                    return (
                      <ServicePaymentMethodTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row)}
                        onEditRow={() => handleEditRow(row)}
                      />
                    );
                  })} */}
                  {/* {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => {
                    if (loading) return <ServicePaymentMethodTableRowSkeleton key={row.id} />;

                    return (
                      <ServicePaymentMethodTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    );
                  })} */}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      services?.GetPaymentMethod?.totalRecords
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <ServicePaymentMethodCreate
            refetch={refetch}
            isTuts={tutorialTab && tutorialTab === 11 ? true : false}
            open={openCreate.value}
            onClose={openCreate.onFalse}
            appendData={appendData}
            tempId={tempId}
            resolveData={(d) => {
              setServerData(d);
              setTempId(uuidv4());
            }}
            incrementTutsTab={incrementTutsTab}
          />

          <ServicePaymentMethodEdit
            open={openEdit.value}
            onClose={() => {
              setEditId(null);
              openEdit.onFalse();
              if (isView) {
                setIsView(false)
              }
            }}
            isView={isView}
            onSuccess={onSuccessUpdate}
            id={editId}
            updateData={updateData}
            refetch={refetch}
            appendData={appendData}
          />

          <TablePaginationCustom
            count={services?.GetPaymentMethod?.totalRecords}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>

        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
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
                confirm.onFalse();
              }}
            >
              Delete
            </Button>
          }
        />
      </div>
    </>
  );
})

export default ServicePaymentMethodList

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
}: {
  inputData: IUserPaymentItem[];
  comparator: (a: any, b: any) => number;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  return inputData;
}
