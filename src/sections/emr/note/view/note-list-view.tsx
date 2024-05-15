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

// ----------------------------------------------------------------------

type Props = {
  slug?: string;
  id?: any;
  data: any;
};

export default function PatientNoteListView({ slug, id, data }: Props) {
  const upMd = useResponsive('up', 'md');

  const openCreate = useBoolean();
  const isEMR = 1;
  // const [tableData] = useState(_noteList.filter((_) => _.patientId === slug));
  const [payloads, setPayloads] = useState<any>({});
  const {
    data: medData,
    loading: medLoad,
    emrRefetch,
    tableData1,
    totalData,
    Ids,
    tableDataEMR,
    totalDataEMR,
  } = useNotesHooks(payloads);
  return (
    <>
      {/* EMR  */}
      <NoteListView
        refIds={slug}
        setPayloads={setPayloads}
        data={medData}
        loading={medLoad}
        refetch={emrRefetch}
        tableData1={tableDataEMR}
        totalData={totalDataEMR}
        Ids={Ids}
        isEMR={isEMR}
        id={id}
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
        open={openCreate.value}
        onClose={openCreate.onFalse}
        data={data}
        refetch={emrRefetch}
      />
    </>
  );
}
