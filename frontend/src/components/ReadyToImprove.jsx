import React from 'react';
import { Box, Typography, Button, Grid, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';

const ReadyToImprove = () => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Box
      sx={{
        backgroundColor: '#2c4ad9',
        color: '#fff',
        py: { xs: 6, sm: 10 },
        px: { xs: 3, sm: 6 },
        textAlign: 'center',
      }}
    >
      <Typography
        variant={isSmUp ? 'h3' : 'h4'}
        fontWeight={700}
        gutterBottom
      >
        Ready to improve your community?
      </Typography>
      <Typography
        variant="body1"
        sx={{
          maxWidth: 600,
          mx: 'auto',
          mb: 5,
          lineHeight: 1.6,
        }}
      >
        Join thousands of citizens who are making a difference through CitizenConnect.<br />
        Submit your feedback, report issues, and help build a better community for everyone.
      </Typography>
      <Box sx={{ mb: 6 }}>
        <Button
          variant="contained"
          component={Link} 
          to="/submit"
          sx={{
            bgcolor: '#fff',
            color: '#2c4ad9',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            mr: 3,
            '&:hover': {
              bgcolor: '#e6e6e6',
            },
          }}
        >
          Submit Feedback
        </Button>
        <Button
          variant="outlined"
            component={Link} 
            to="/status"
          sx={{
            borderColor: '#fff',
            color: '#fff',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
              borderColor: '#fff',
            },
          }}
        >
          Track Existing Case
        </Button>
      </Box>
      <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 800, mx: 'auto' }}>
        <Grid item xs={6} sm={3}>
          <Typography fontWeight={700} gutterBottom>
            Agency Partners
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.8)">
            20+ Government Departments
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography fontWeight={700} gutterBottom>
            Response Time
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.8)">
            48 hours (average)
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography fontWeight={700} gutterBottom>
            Resolution Rate
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.8)">
            85% of all submissions
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography fontWeight={700} gutterBottom>
            Citizen Satisfaction
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.8)">
            4.8/5 average rating
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReadyToImprove;
