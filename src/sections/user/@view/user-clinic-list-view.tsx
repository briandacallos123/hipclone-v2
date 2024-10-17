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
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// _mock
import { _userClinic } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IUserClinicItem, IUserClinicTableFilters } from 'src/types/user';
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
import { NexusGenInputs } from 'generated/nexus-typegen';

import { useQuery, useMutation } from '@apollo/client';
import { CLINIC_SCHEDLIST, DeleteClinic, DeleteClinicSched } from '@/libs/gqls/clinicSched';
//
import UserClinicCreateView from './user-clinic-create-view';
import UserClinicEditView from './user-clinic-edit-view';
import UserClinicScheduleCreateView from './user-clinic-schedule-create-view';
import ClinicTableRow from '../clinic/clinic-table-row';
import ClinicTableRowSkeleton from '../clinic/clinic-table-row-skeleton';
import ClinicTableToolbar from '../clinic/clinic-table-toolbar';
import uuidv4 from '@/utils/uuidv4';
import { useSnackbar } from 'src/components/snackbar';
import { Box } from '@mui/material';
import { paths } from '@/routes/paths';
import { useRouter } from 'next/navigation';
import './circular-highlight.css'; // Import your CSS file
import { m } from 'framer-motion';
import { MotionContainer, varFade } from 'src/components/animate';
import Image from '@/components/image';
// ----------------------------------------------------------------------

const TABLE_HEAD = [{ id: 'name', label: 'Clinic & Schedules' }];

const defaultFilters = {
  name: '',
  status: -1,
};


// ----------------------------------------------------------------------

export default function UserClinicListView() {
  const upMd = useResponsive('up', 'md');

  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();
  
  const table = useTable({
    defaultOrder: 'desc',
  });
  const { page, rowsPerPage, order, orderBy } = table;

  const confirm = useBoolean();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const openCreate = useBoolean();

  const openEdit = useBoolean();

  const [editId, setEditId] = useState<any>('');
  const [editSchedId, setEditSchedId] = useState<number>(0);

  const openAddSchedule = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [schedData, setSchedData] = useState<any>([]);
  const [totalData, setTotalData] = useState(0);
  const [totalftc, setTotalftc] = useState(0);
  const [totaltm, setTotaltm] = useState(0);
  const [filters, setFilters] = useState(defaultFilters);
  const [provinces, setProvinces] = useState([]);

  const currentStep = localStorage?.getItem('currentStep')

  // console.log(schedData, 'SCHED DATA');
  // const [getData, { data, loading, error, refetch }] = useQuery(CLINIC_SCHEDLIST, {
  //   context: {
  //     requestTrackerId: 'getSched[gSched]',
  //   },
  //   notifyOnNetworkStatusChange: true,

  // });
  const {
    data: clinicData,
    loading,
    error,
    refetch,
  } = useQuery(CLINIC_SCHEDLIST, {
    context: {
      requestTrackerId: 'getSched[gSched]',
    },
    notifyOnNetworkStatusChange: true,
    variables: {
      data: {
        skip: page * rowsPerPage,
        take: rowsPerPage,
        orderBy,
        orderDir: String(order),
        searchKeyword: String(filters?.name),
        sched_type: Number(filters?.status),
      },
    },
    fetchPolicy: 'cache-first',
  });

  const [snackKey, setSnackKey]: any = useState(null);
  const [snackKeySched, setSnackKeySched]: any = useState(null);

  const [deleteClinic] = useMutation(DeleteClinic);
  const [deleteClinicSched] = useMutation(DeleteClinicSched);

  const handleDeleteSchedule = useCallback(
    async (model: any) => {
      const data: NexusGenInputs['DeleteClinicInputsSched'] = {
        id: model.id,
      };
      deleteClinicSched({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          closeSnackbar(snackKeySched);
          setSnackKeySched(null);
          enqueueSnackbar('Deleted successfully!');
          refetch();
        })
        .catch((error) => {
          console.log(error, 'ano error?');
          closeSnackbar(snackKeySched);
          setSnackKeySched(null);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });
    },
    [snackKeySched]
  );
  const [deleteSchedId, setDeleteSched] = useState(null);

  useEffect(() => {
    if (deleteSchedId) {
      (async () => {
        await handleDeleteSchedule({ id: Number(deleteSchedId) });
      })();
    }
  }, [deleteSchedId]);

  const handleDeleteSched = (id: any) => {
    // console.log(id, 'id@@@@');
    setDeleteSched(id);

    const snackbarKey: any = enqueueSnackbar('Deleting Schedule...', {
      variant: 'info',
      key: 'savingEducationss',
      persist: true, // Do not auto-hide
    });
    setSnackKeySched(snackbarKey);
  };

  const handleSubmitValue = useCallback(
    async (model: any) => {
      const data: NexusGenInputs['DeleteClinicInputs'] = {
        id: model.id,
        // message: model.message,
        // status: model.status,
      };
      deleteClinic({
        variables: {
          data,
        },
      })
        .then(async (res) => {
          closeSnackbar(snackKey);
          setSnackKey(null);
          enqueueSnackbar('Deleted successfully!');
          refetch();
        })
        .catch((error) => {
          console.log(error, 'ano error?');
          closeSnackbar(snackKey);
          setSnackKey(null);
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        });
    },
    [snackKey]
  );

  useEffect(() => {
    if (clinicData) {
      // const { data } = clinicData;
      setSchedData(clinicData?.QueryClinics?.clinic_data);
      setTotalData(clinicData?.QueryClinics?.total);
      setTotaltm(clinicData?.QueryClinics?.total_tm);
      setTotalftc(clinicData?.QueryClinics?.total_f2f);
      setProvinces(clinicData?.QueryClinics?.provinces);
    }
  }, [clinicData]);
  useEffect(() => {
    // (async () => {
    //   refetch().then((res) => {
    //     const { data } = res;
    //     if (data) {
    //       console.log(data, 'DATA@@@@@@@');
    //       const { QueryClinics } = data;
    //       setSchedData(QueryClinics?.clinic_data);
    //       setTotalData(QueryClinics?.total);
    //       setTotaltm(QueryClinics?.total_tm);
    //       setTotalftc(QueryClinics?.total_f2f);
    //       setProvinces(QueryClinics?.provinces);
    //     }
    //   });
    // })();
    // getData({
    //   variables: {
    //     data: {
    //       skip: page * rowsPerPage,
    //       take: rowsPerPage,
    //       orderBy,
    //       orderDir: String(order),
    //       searchKeyword: String(filters?.name),
    //       sched_type: Number(filters?.status),
    //     },
    //   },
    // }).then(async (result: any) => {
    //   const { data } = result;
    //   if (data) {
    //     const { QueryClinics } = data;
    //     setSchedData(QueryClinics?.clinic_data);
    //     setTotalData(QueryClinics?.total);
    //     setTotaltm(QueryClinics?.total_tm);
    //     setTotalftc(QueryClinics?.total_f2f);
    //     setProvinces(QueryClinics?.provinces);
    //   }
    // });
  }, [filters?.name, filters?.status, order, orderBy, page, rowsPerPage]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const [uuid, setUuid] = useState(uuidv4());

  const [tempData, setTempData] = useState(null);
  // server side
  // console.log(tempData, 'tempData DATA 1@@@');

  useEffect(() => {
    if (tempData) {
      // console.log(tempData, 'TEMPDATA@@@@@');
      // console.log(schedData, 'schedData@@@@@');
      const findItem = schedData?.map((i: any) => {
        if (i.id !== tempData?.uuid) {
          return i;
        } else {
          return tempData;
        }
      });
      setUuid(uuidv4());
      setSchedData(findItem);
    }
  }, [tempData]);
  // client side
  const appendDataClient = (d: any) => {
    const { Province, clinic_name, location, number, type, days } = d;
    // console.log('render', type);

    setSchedData((prev: any) => {
      const allIds: any = [];
      let actualData: any = [];

      const newData = {
        id: uuid,
        Province,
        clinic_name,
        location,
        number,
        type,
        days,
        client: 1,
      };

      prev?.forEach((i: any) => {
        if (!allIds.includes(i?.id)) {
          allIds.push(i?.id);
          actualData.push(i);
          if (!allIds.includes(newData?.id)) {
            allIds.push(newData?.id);
            actualData = [newData, ...actualData];
          }
        }
      });

      return actualData.slice(0, rowsPerPage);
    });
    // console.log(schedData, 'sa loob');
  };
  // console.log(schedData, 'sa labas');

  // const loading = false;

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !!filters.name || filters.status !== -1;

  const notFound = (!totalData && canReset) || !totalData;

  // const getStatusLength = (status: string) =>
  //   tableData.filter((item) => item.schedule.find((_) => _.type.includes(status))).length;

  const TABS = [
    { value: -1, label: 'All', color: 'default', count: totalData },
    {
      value: 1,
      label: 'Telemedicine',
      color: 'success',
      count: totaltm,
    },
    {
      value: 2,
      label: 'Face-to-Face',
      color: 'error',
      count: totalftc,
    },
  ] as const;

  const [isHideSched, setHideSched] = useState(false);

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
  useEffect(() => {
    // console.log('UPDATED@@@@:', schedData);
  }, [schedData]);
  const [deleteId, setDeleteId]: any = useState(null);

  useEffect(() => {
    if (snackKey) {
      (async () => {
        await handleSubmitValue({
          id: String(deleteId),
        });
      })();
    }
  }, [snackKey]);

  // console.log('UUID FROM SOURCE: ', uuid);
  const handleDeleteRow = useCallback(async (id: string) => {
    // const deleteRow = tableData.filter((row) => row.id !== id);
    // setTableData(deleteRow);
    // table.onUpdatePageDeleteRow(dataInPage.length);
    setDeleteId(id);
    const snackbarKey: any = enqueueSnackbar('Deleting Data...', {
      variant: 'info',
      key: 'savingEducation',
      persist: true, // Do not auto-hide
    });
    setSnackKey(snackbarKey);
  }, []);

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id: any) => {
      setEditId(id);
      openEdit.onTrue();
    },
    [openEdit]
  );
  const [schedId, setShedId] = useState<any>([]);

  // TO DO:
  // after mag success need hanapin yung inadd sa client side at palitan
  // ng response.

  const modifySched = (d: any) => {
    // console.log('Server', d);
    // console.log(schedData, 'sched');
    setSchedData((prev: any) => {
      let newData = prev?.map((i: any) => {
        if (Number(i?.id) === Number(d?.clinic)) {
          const newSchedInfo = i?.ClinicSchedInfo?.map((c: any) => {
            if (Number(c?.id) === Number(d?.clinic)) {
              return d;
            } else {
              return c;
            }
          });
          return { ...i, ClinicSchedInfo: newSchedInfo };
        } else {
          return i;
        }
      });
      // console.log('NEW DATA@@@', newData);
      return newData;
    });
  };

  const appendClinic = (d: any) => {
    // console.log('client@@: ', d);
    // console.log(d?.end_time.toString(), 'DETE@@');

    const myObj = {
      ...d,
      end_time: d?.end_time.toString(),
      start_time: d?.start_time?.toString(),
      id: String(d?.refId),
      type: d?.type?.map((i: any) => Number(i)),
      days: d?.type?.map((i: any) => Number(i)),
    };

    setSchedData((prev: any) => {
      let newData = prev?.map((i: any) => {
        if (Number(i?.id) === Number(myObj?.id)) {
          // const ewan = { ...d };
          const childrenInfo = [...i.ClinicSchedInfo, myObj];
          // console.log(childrenInfo, 'CHILDREN INFO');
          return { ...i, ClinicSchedInfo: childrenInfo };
        } else {
          return i;
        }
      });
      return newData;
    });
  };

  const handleAddSched = useCallback(
    (id: any) => {
      setShedId(id);
      openAddSchedule.onTrue();
    },
    [openAddSchedule]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );


  const PRIMARY_MAIN = theme.palette.primary.main;
  const [step, setSteps] = useState(1);

  const incrementStep = () => setSteps((prev) => prev + 1)

  const firstStep = (
    <m.div>

      <Typography

        sx={{
          fontSize: 15,
          lineHeight: 1.25,
          '& > span': {
            color: theme.palette.primary.main,
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'capitalize'
          },
        }}
      >
       Please ensure you fill in all required clinic management fields. 🏥✅
      </Typography>
    </m.div>
  )

  const secondStep = (
    <m.div>

      <Typography

        sx={{
          fontSize: 15,
          lineHeight: 1.25,
          '& > span': {
            color: theme.palette.primary.main,
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'capitalize'
          },
        }}
      >
        Accurate clinic information is crucial! 🏥 Patients won't be able to find you if your clinic isn't listed. 📍
      </Typography>
    </m.div>
  )

  const successStep1 = (
    <m.div>
      <Typography
        sx={{
          fontSize: 15,
          lineHeight: 1.25,
          '& > span': {
            color: theme.palette.primary.main,
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'capitalize',
          },
        }}
      >
        <span>Congratulations! 🎉</span>  <br/>
        <br/>
        Your new clinic has been successfully created!
      </Typography>
    </m.div>
  )

  const successStep2 = (
    <m.div>
      <Typography
        sx={{
          fontSize: 15,
          lineHeight: 1.25,
          '& > span': {
            color: theme.palette.primary.main,
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'capitalize'
          },
        }}
      >
        Patients will now be able to find and visit your clinic for their healthcare needs! 🌟🏥
      </Typography>
    </m.div>
  )

  const renderFifthTutorial = (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,

    }}>


      <>
        <Box sx={{
          background: PRIMARY_MAIN,
          opacity: .4,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>

        </Box>

        {step !== 3 && <Box sx={{
          zIndex: 99999,
          position: 'absolute',
          bottom: 0,
        }}>
          {/* message */}
          <m.div variants={varFade().inUp}>
            <Box sx={{
              background: theme.palette.background.default,
              height: 'auto',
              width: 'auto',
              maxWidth:250,
              left: 10,
              borderRadius: 2,
              zIndex: 99999,
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              p: 3
            }}>
              {step === 1 && firstStep}
              {step === 2 && secondStep}


              <Box sx={{ width: '90%',pt:2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={incrementStep} variant="contained" size={'small'}>Continue</Button>
              </Box>
            </Box>
          </m.div>

          <Image
            sx={{
              width: 350,
              height: 450,
              position: 'relative',
              bottom: -100,
              right: -120,

            }}
            src={'/assets/tutorial-doctor/nurse-tutor.png'}

          />
        </Box>}
      </>

    </Box>
  )

  const addHighlight = (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
    }}>
      <Box sx={{
        background: PRIMARY_MAIN,
        opacity: .4,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9991
      }}>

      </Box>
    </Box>
  )

  const [successStep, setScsStep] = useState(1);

  const incrementScsStep = () => setScsStep(successStep +1);

  useEffect(()=>{
    if(Number(successStep) === 3){
      router.push(paths.dashboard.user.manage.service)
    }
  },[successStep])

  const successClinic = (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9998,
    }}>
      <Box sx={{
        background: PRIMARY_MAIN,
        opacity: .4,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9991
      }}>


      </Box>

      <Box sx={{
        zIndex: 99999,
        position: 'absolute',
        bottom: 0,
      }}>
        {/* message */}
        <m.div variants={varFade().inUp}>
          <Box sx={{
            background: theme.palette.background.default,
            height: 'auto',
            width: 'auto',
            maxWidth:250,
            left: 10,
            borderRadius: 2,
            zIndex: 99999,
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            p:3
          }}>
            {successStep === 1 && successStep1}
            {successStep === 2 && successStep2}
            


            <Box sx={{ width: '90%',pt:2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={incrementScsStep} variant="contained" size={'small'}>Continue</Button>
            </Box>
          </Box>
        </m.div>

        <Image
          sx={{
            width: 350,
            height: 450,
            position: 'relative',
            bottom: -100,
            right: -120,

          }}
          src={'/assets/tutorial-doctor/nurse-tutor.png'}

        />
      </Box>
    </Box>
  )


  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {Number(currentStep) === 6 && step !== 14 && renderFifthTutorial}
        {Number(currentStep) === 6 && step === 3 && !openCreate.value && addHighlight}
        {Number(currentStep) === 7 && successStep !== 3 && successClinic}

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: { xs: 3, md: 5 },
            position: 'relative'
          }}
        >
          <Typography variant="h5">Manage Clinic</Typography>
          <div className={`${currentStep && Number(currentStep) === 6 && step === 3 && !openCreate.value && 'circular-highlight'}`}>
            <Button
              onClick={openCreate.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Clinic
            </Button>
          </div>
        </Stack>

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

          <ClinicTableToolbar filters={filters} onFilters={handleFilters} />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData?.map((row) => row?.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
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
                    rowCount={tableData.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id)
                      )
                    }
                  />
                )}


                  <TableBody>
                    {loading &&
                      [...Array(rowsPerPage)].map((_, i) => <ClinicTableRowSkeleton key={i} />)}
                    {!loading &&
                      schedData?.map((row: any, index: number) => (
                       
                          <ClinicTableRow
                          key={row.id}
                          isHideSched={isHideSched}
                          row={row}
                          setHideSched={setHideSched}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onEditRow={(CreatePayment) => handleEditRow(row)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onAddSchedule={() => handleAddSched(row)}
                          refetch={() => refetch()}
                          onDeleteSched={handleDeleteSched}
                        />
                      ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, totalData)}
                    />

                    <TableNoData notFound={notFound && !loading} />
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
      </Container>

      <UserClinicCreateView
        appendDataClient={appendDataClient}
        appendData={(d: any) => {
          if (d) {
            // console.log(d, 'D@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
            setTempData(d);
          }
        }}
        provinces={provinces}
        uuid={uuid && uuid}
        refetch={refetch}
        open={openCreate.value}
        onClose={openCreate.onFalse}
      />

      <UserClinicEditView
        // appendDataClient={appendDataClient}
        // appendData={(d: any) => {
        //   if (d) {
        //     // console.log(d, 'D@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        //     setTempData(d);
        //   }
        // }}
        // uuid={uuid && uuid}
        open={openEdit.value}
        refetch={refetch}
        // refetch={(d) => {
        //   const newData = schedData?.map((i) => {
        //     if (Number(i?.id) === Number(d?.id)) {
        //       return d;
        //     } else {
        //       return i;
        //     }
        //   });
        //   setSchedData(newData);
        // }}
        onClose={() => {
          setEditId(null);
          openEdit.onFalse();
        }}
        id={editId}
        provinces={provinces}
      />

      <UserClinicScheduleCreateView
        open={openAddSchedule.value}
        onClose={openAddSchedule.onFalse}
        id={schedId}
        modifySched={modifySched}
        appendClinic={appendClinic}
        refetch={refetch}
        setHideSched={() => {
          setHideSched(true);
        }}
      />

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
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IUserClinicItem[];
  comparator: (a: any, b: any) => number;
  filters: IUserClinicTableFilters;
}) {
  if (!inputData) return [];

  return inputData;
}
