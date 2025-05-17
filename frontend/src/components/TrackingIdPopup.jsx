import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const TrackingIdPopup = ({ open, onClose, trackingId }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="tracking-id-dialog-title" maxWidth="xs" fullWidth>
      <DialogTitle id="tracking-id-dialog-title">Submission Successful</DialogTitle>
      <DialogContent dividers>
        <Typography tabIndex={0}>
          Your tracking ID is <strong>{trackingId}</strong>.
        </Typography>
        <Typography tabIndex={0} sx={{ mt: 2 }}>
          The tracking ID has also been sent to your email.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrackingIdPopup;
