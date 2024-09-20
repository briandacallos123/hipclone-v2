'use client';

import { useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _noteList } from 'src/_mock';
// types

// components
import useNotesHooks from '@/sections/note/_notesHooks';
import Iconify from 'src/components/iconify';
import { NoteListView } from '@/sections/note/view';
import PatientNoteCreateView from './note-create-view';
// import useNotesHooks from '../note/_notesHooks';
// ----------------------------------------------------------------------

type Props = {
  slug?: string;
  uuid: any;
};

export default function PatientNoteListView({ slug, uuid }: Props) {
  const upMd = useResponsive('up', 'md');

  const [payloads, setPayloads] = useState<any>({});
  const {
    data: medData,
    loading: medLoad,
    refetch,
    tableData1,
    totalData,
    Ids,
    isLoadingPatient,
    clinicData
  } = useNotesHooks(payloads);
  const openCreate = useBoolean();
  const openUpdate = useBoolean();
  // console.log(tableData1, 'table data1');
  // const [tableData] = useState(_noteList.filter((_) => _.patientId === slug));
  const [editData, setEditData] = useState(null);

  const onUpdateRow = (row:any) => {
    openUpdate.onTrue();
    setEditData(row)
  }
  const [refetchChild, setRefetchChild ] = useState(false);

  const [clearData, setClearData] = useState(false);

  return (
    <>
      <NoteListView
        refIds={uuid}
        setPayloads={setPayloads}
        data={medData}
        loading={medLoad}
        refetch={refetch}
        clinicData={clinicData}
        tableData1={tableData1}
        totalData={totalData}
        updateRow={onUpdateRow}
        isLoading={isLoadingPatient}
        setRefetchChild={setRefetchChild}
        refetchChild={refetchChild}
        clearData={clearData}
        setClearData={setClearData}
        Ids={Ids}
        action={
          upMd ? (
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={openCreate.onTrue}
              sx={{ ml: 2, width: 140 }}
            >
              New Record
            </Button>
          ) : (
            <IconButton onClick={openCreate.onTrue}>
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          )
        }
      />

      <PatientNoteCreateView
        open={openCreate.value || openUpdate.value}
        onClose={(()=>{
          openCreate.onFalse();
          openUpdate.onFalse();
          setEditData(null)
          setClearData(true)
        })}
        refIds={slug}
        refetch={()=>{
          refetch()
          setRefetchChild(true)
        }}
        editData={editData}
      />
    </>
  );
}
