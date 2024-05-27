import { Box, Button, Container, ListItemText, Table, TableBody, TableContainer } from '@mui/material'
import React, { useEffect, useState } from 'react'
// import { UseMerchantMedContext } from '@/context/merchant/Merchant';
import { UseMerchantContext } from '@/context/workforce/merchant/MerchantContext'
import MerchantTableRowNear from './merchant-table-row'
import { TableHeadCustom } from '@/components/table'
import Scrollbar from '@/components/scrollbar'

const TABLE_HEAD_PATIENT = [
  { id: 'store', label: 'Store' },
  { id: 'address', label: 'Address' },
  { id: 'merchant', label: 'Merchant', align: 'center' },
  { id: 'status', label: "Status", align: 'center' },
  // { id: 'type', label: 'Type', align: 'center' },
  // { id: 'status', label: 'Status', align: 'center' },
  { id: 'action', label: 'Action', align: 'center' },
  // { id: '' },
];

const MedecineMerchantView = ({handleStore}:any) => {
  const { state }: any = UseMerchantContext()
  const [nearbyMerchants, setNearbyMerchants] = useState([]);

  console.log(state, 'nearbyMerchants_________')

  const key = "AIzaSyBfeD60EqbUHeAdl7eLmAekqU4iQBKtzVk"
  useEffect(() => {
    if (state?.merchantData) {

      setNearbyMerchants(state?.merchantData)
    }

  }, [state?.merchantData]);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log(latitude, longitude, 'HEHE')
            resolve({ lat: latitude, lng: longitude });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  };

  return (
    <Container maxWidth="lg">
      <ListItemText
        primary="Nearby Store"
        secondary="Please select your store."
        primaryTypographyProps={{ typography: 'h4' }}
        sx={{
          cursor: 'pointer',
          mb:5,
          textTransform: 'capitalize'
        }}
        />
      <TableContainer sx={{ position: 'relative', overflow: 'unset', minWidth: 1200 }}>
        {/* <TableSelectedAction
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
            /> */}

        <Scrollbar>
          <Table size={'medium'} sx={{ minWidth: 1200 }}>

            <TableHeadCustom
              order="asc"
              orderBy="name"
              headLabel={TABLE_HEAD_PATIENT}
            // rowCount={tableData?.length}
            // numSelected={table.selected.length}
            // onSort={table.onSort}
            // onSelectAllRows={(checked) =>
            //   table.onSelectAllRows(
            //     checked,
            //     tableData?.map((row: any) => row?.id)
            //   )
            // }
            />
            {/* {upMd && (
                 
                )} */}
            {/* {user?.role === 'patient' && (
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                  />
                )} */}

            <TableBody>
              {state?.merchantData?.map((row: any) => (

                <MerchantTableRowNear handleStore={handleStore} row={row} />
              ))}
              {/* {isLoading
                    ? [...Array(rowsPerPage)].map((_, i) => <AppointmentTableRowSkeleton key={i} />)
                    : tableData?.map((row: NexusGenInputs['DoctorTypeInputInterface']) => (
                        <AppointmentTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(String(row.id))}
                          onSelectRow={() => table.onSelectRow(String(row.id))}
                          onViewRow={() => handleViewRow(row)}
                          onViewPatient={() => handleViewPatient(row)}
                        />
                      ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, totalRecords)}
                  />

                  <TableNoData notFound={notFound} /> */}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      {/* <Box>
        <Button>Proceed</Button>
      </Box> */}
      {/* <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableHeadCustom
          // order={table.order}
          // orderBy={table.orderBy}
          headLabel={ TABLE_HEAD_PATIENT}

          // onSort={table.onSort}

        />

        <Table sx={{ minWidth: 1200 }}>
          <TableBody>
            {state?.merchantData?.map((row: any) => (
              // <li key={index}>
              //   <strong>{merchant?.first_name}</strong> - {merchant?.middle_name}
              // </li>
              <MerchantTableRowNear row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
      {/* <ul>
  
</ul> */}
    </Container>
  )
}

export default MedecineMerchantView