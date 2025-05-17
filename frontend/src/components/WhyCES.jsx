import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const WhyCES = () => {
  return (
    <Box sx={{ py: 8, px: 2, textAlign: 'center' }}>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
        Why Use CitizenConnect?
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6, maxWidth: 600, mx: 'auto' }}>
        Our platform streamlines communication between citizens and government <br /> agencies, making public services more responsive.
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, textAlign: 'left' }}>
            <Box sx={{ mb: 2, backgroundColor: '#e0e7ff', width: 48, height: 48, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AssignmentIcon fontSize="large" sx={{ color: '#3b82f6' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Easy Submission
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
              Submit your feedback,<br /> complaints, or suggestions <br /> through our simple form in just <br /> a few minutes.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, textAlign: 'left' }}>
            <Box sx={{ mb: 2, backgroundColor: '#e0e7ff', width: 48, height: 48, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DescriptionIcon fontSize="large" sx={{ color: '#3b82f6' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Smart Categorization
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
              Our system automatically <br /> categorizes and routes your <br /> submission to the appropriate <br /> government agency.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, textAlign: 'left' }}>
            <Box sx={{ mb: 2, backgroundColor: '#e0e7ff', width: 48, height: 48, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrackChangesIcon fontSize="large" sx={{ color: '#3b82f6' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Status Tracking
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
              Track the status of your <br /> submission in real-time and <br /> receive updates as it <br /> progresses.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, textAlign: 'left' }}>
            <Box sx={{ mb: 2, backgroundColor: '#e0e7ff', width: 48, height: 48, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ThumbDownIcon fontSize="large" sx={{ color: '#3b82f6' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Direct Responses
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
              Receive official responses <br /> directly from government <br /> agencies handling your <br />submission.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WhyCES;
