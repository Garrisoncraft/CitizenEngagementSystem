import React from 'react';
import { Box, Typography, Button, Avatar, Stack, Badge } from '@mui/material';
import HeaderImage from '../assets/HeaderImage.webp';
import User1 from '../assets/user1.png';
import User2 from '../assets/user1.png';
import User3 from '../assets/user1.png';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        backgroundColor: '#e6f0fa',
        p: 4,
        borderRadius: 2,
        alignItems: 'center',
        gap: 4,
      }}
    >
      {/* Left side content */}
      <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '50%' } }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, color: '#1a202c' }}>
          Your Voice{' '}
          <Box component="span" sx={{ color: '#1e40af' }}>
            Matters
          </Box>
        </Typography>
        <Typography variant="body1" sx={{ color: '#4a5568', mb: 3, lineHeight: 1.6 }}>
          A modern platform that connects citizens with government agencies for better public services.
          <br />
          Submit, track, and resolve your community issues in one place.
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            component={Link} 
            to="/submit"
            sx={{
              backgroundColor: '#1e40af',
              '&:hover': { backgroundColor: '#1c3aa9' },
              boxShadow: '0 2px 6px rgba(30, 64, 175, 0.5)',
              textTransform: 'none',
              px: 3,
              py: 1.5,
            }}
          >
            Submit Feedback
          </Button>
          <Button
            variant="outlined"
            component={Link} 
            to="/status"
            sx={{
              borderColor: '#cbd5e1',
              color: '#1a202c',
              textTransform: 'none',
              px: 3,
              py: 1.5,
              '&:hover': { borderColor: '#a0aec0', backgroundColor: '#f7fafc' },
            }}
          >
            Track Status
          </Button>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#718096', fontSize: '0.875rem' }}>
          <Stack direction="row" spacing={-1}>
            <Avatar
              alt="User 1"
              src={User1}
              sx={{
                border: '2px solid white',
                width: { xs: 28, md: 40 },
                height: { xs: 28, md: 40 },
              }}
            />
            <Avatar
              alt="User 2"
              src={User2}
              sx={{
                border: '2px solid white',
                width: { xs: 28, md: 40 },
                height: { xs: 28, md: 40 },
              }}
            />
            <Avatar
              alt="User 3"
              src={User3}
              sx={{
                border: '2px solid white',
                width: { xs: 28, md: 40 },
                height: { xs: 28, md: 40 },
              }}
            />
          </Stack>
          <Typography>Joined by 5,000+ citizens in your community</Typography>
        </Stack>
      </Box>

      {/* Right side image with overlay */}
      <Box
        sx={{
          flex: 1,
          maxWidth: { xs: '100%', md: '50%' },
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          width: '100%',
          height: { xs: 240, md: 'auto' },
        }}
      >
        <Box
          component="img"
          src={HeaderImage}
          alt="Header"
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            color: 'white',
            textShadow: '0 1px 4px rgba(0,0,0,0.7)',
          }}
        >
          <Typography variant="h6" sx={{mb:1, fontWeight: 700 }}>
            Road Repair Request
          </Typography>
          <Typography variant="body2">Status: In Progress</Typography>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            backgroundColor: '#047857',
            color: 'white',
            borderRadius: '20px',
            px: 2,
            py: 0.5,
            fontSize: '0.875rem',
            fontWeight: 600,
            boxShadow: '0 2px 6px rgba(4, 120, 87, 0.6)',
          }}
        >
          Updated 2h ago
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
