import React from 'react';
import { Grid, Box, Typography, Link, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import Logo from '../assets/Logo.png';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#f9fafb', p: 4, mt: 8 }}>
      <Grid container spacing={4} justifyContent="space-between">
        {/* Left Section */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box
              component="img"
              src={Logo}
              alt="Citizen Engagement System Logo"
              sx={{ height: 32, width: 32, mr: 1 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e40af' }}>
              Citizen Engagement System
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
            Bridging the gap between citizens and government agencies for a more responsive community.
          </Typography>
        </Grid>

        {/* Platform Section */}
        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            PLATFORM
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Link href="/submit" underline="none" color="text.primary" sx={{ cursor: 'pointer' }}>
              Submit Feedback
            </Link>
            <Link href="/status" underline="none" color="text.primary" sx={{ cursor: 'pointer' }}>
              Track Complaints
            </Link>
            <Link href="#" underline="none" color="text.primary" sx={{ cursor: 'pointer' }}>
              Service Categories
            </Link>
            <Link href="#" underline="none" color="text.primary" sx={{ cursor: 'pointer' }}>
              Partner Agencies
            </Link>
          </Box>
        </Grid>

        {/* Support Section */}
        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            SUPPORT
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Link href="#" underline="none" color="text.primary" sx={{ cursor: 'pointer' }}>
              FAQ
            </Link>
            <Link href="#" underline="none" color="text.primary" sx={{ cursor: 'pointer' }}>
              Help Center
            </Link>
            <Link href="#" underline="none" color="text.primary" sx={{ cursor: 'pointer' }}>
              Contact Us
            </Link>
            <Link href="#" underline="none" color="text.primary" sx={{ cursor: 'pointer' }}>
              Privacy Policy
            </Link>
          </Box>
        </Grid>

        {/* Connect Section */}
        <Grid item xs={12} sm={3} md={3}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            CONNECT
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton aria-label="Facebook" href="#" color="primary" size="large">
              <FacebookIcon />
            </IconButton>
            <IconButton aria-label="Twitter" href="#" color="primary" size="large">
              <TwitterIcon />
            </IconButton>
            <IconButton aria-label="Instagram" href="#" color="primary" size="large">
              <InstagramIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} Citizen Engagement System. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
