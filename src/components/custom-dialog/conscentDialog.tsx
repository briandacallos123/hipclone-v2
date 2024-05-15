// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
//
import { ConfirmDialogProps } from './types';

// ----------------------------------------------------------------------

export default function ConsentDialog({
  title,
  content,
  viewMore,
  action,
  open,
  onClose,
  ...other
}: any) {
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && (
        <DialogContent sx={{ typography: 'body2' }}>
          {' '}
          {content}{' '}
          <Button component="a" download href={viewMore} target="_blank" color="info">
            Continue Reading...
          </Button>
        </DialogContent>
      )}

      <DialogActions>
        {action}

        <Button variant="outlined" color="error" onClick={onClose}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
