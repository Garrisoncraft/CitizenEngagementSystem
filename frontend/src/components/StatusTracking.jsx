import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, Paper } from '@mui/material';
import apiClient from '../apiClient';

const StatusTracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [submission, setSubmission] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    setSubmission(null);
    setErrorMessage('');

    if (!trackingId) {
      setErrorMessage('Please enter your tracking ID.');
      return;
    }

    try {
      const response = await apiClient.get(`/submissions/${trackingId}`);
      setSubmission(response.data);
    } catch (error) {
      setErrorMessage('Submission not found or error fetching status.', error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 3,
      }}
      aria-label="Track submission status form"
    >
      <Typography variant="h5" gutterBottom tabIndex={0}>
        Track Submission Status
      </Typography>
      <Box component="form" onSubmit={handleCheckStatus} sx={{ mb: 3 }}>
        <TextField
          label="Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
          fullWidth
          required
          margin="normal"
          inputProps={{ 'aria-required': 'true', 'aria-label': 'Tracking ID' }}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
          Check Status
        </Button>
      </Box>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} role="alert" tabIndex={0}>
          {errorMessage}
        </Alert>
      )}
      {submission && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" tabIndex={0}>
            {submission.title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom tabIndex={0}>
            Status: {submission.status}
          </Typography>
          <Typography variant="body1" gutterBottom tabIndex={0}>
            {submission.description}
          </Typography>
          {submission.public_response && (
            <>
              <Typography variant="subtitle2" tabIndex={0}>
                Response from Agency:
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }} tabIndex={0}>
                {submission.public_response}
              </Typography>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default StatusTracking;
