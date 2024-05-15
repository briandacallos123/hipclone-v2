'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
// _mock
import { _emrList } from 'src/_mock';
//
import EmrLinkForm from '../emr-link-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
  open: boolean;
  list: any;
  onClose: VoidFunction;
  refetch: VoidFunction;
  optUpdate: VoidFunction;
  deletePatientInList: VoidFunction;
  calculateSimilarity: VoidFunction;
  percentageSimilarity: VoidFunction;
};

// ----------------------------------------------------------------------

export default function EmrLinkView({
  deletePatientInList,
  optUpdate,
  refetch,
  list,
  id,
  open,
  onClose,
  calculateSimilarity,
  percentageSimilarity,
}: Props) {
  // const currentItem = _emrList.find((item) => item.id === id);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 480 },
      }}
    >
      <DialogTitle>Link records from existing patient</DialogTitle>

      <EmrLinkForm
        deletePatientInList={deletePatientInList}
        optUpdate={optUpdate}
        refetch={refetch}
        list={list}
        currentItem={id}
        onClose={onClose}
        calculateSimilarity={calculateSimilarity}
        percentageSimilarity={percentageSimilarity}
      />
    </Dialog>
  );
}
