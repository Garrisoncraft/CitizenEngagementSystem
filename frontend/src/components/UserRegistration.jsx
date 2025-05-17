import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, MenuItem, Select, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import apiClient from '../apiClient';

const UserRegistration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [agencyId, setAgencyId] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencies, setAgencies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch agencies for agency selection
    const fetchAgencies = async () => {
      try {
        const response = await apiClient.get('/admin/agencies');
        setAgencies(response.data);
      } catch (error) {
        console.error('Failed to fetch agencies', error);
      }
    };
    fetchAgencies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username || !password || !role) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    let newAgencyId = agencyId;

    try {
      if (role === 'agency' && !agencyId) {
        if (!agencyName || !agencyEmail) {
          setErrorMessage('Please provide agency name and email.');
          return;
        }
        const token = localStorage.getItem('token');
        const agencyRes = await apiClient.post(
          '/admin/agencies',
          { name: agencyName, email: agencyEmail },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        newAgencyId = agencyRes.data.id;
      }

      const payload = { username, password, role };
      if (role === 'agency') {
        payload.agency_id = newAgencyId || null;
      }
      await apiClient.post('/auth/register', payload);
      setSuccessMessage('User registered successfully.');
      setUsername('');
      setPassword('');
      setRole('citizen');
      setAgencyId('');
      setAgencyName('');
      setAgencyEmail('');
      const response = await apiClient.get('/admin/agencies');
      setAgencies(response.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        User Registration
      </Typography>
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          required
          margin="normal"
        >
        <MenuItem value="citizen">Citizen</MenuItem>
        <MenuItem value="agency">Agency</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </Select>
      {role === 'agency' && (
        <>
          <Select
            value={agencyId}
            onChange={(e) => setAgencyId(e.target.value)}
            fullWidth
            margin="normal"
            displayEmpty
          >
            <MenuItem value="">
              <em>Select Agency</em>
            </MenuItem>
            {agencies.map((agency) => (
              <MenuItem key={agency.id} value={agency.id}>
                {agency.name}
              </MenuItem>
            ))}
          </Select>
          {!agencyId && (
            <>
              <TextField
                label="New Agency Name"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="New Agency Email"
                value={agencyEmail}
                onChange={(e) => setAgencyEmail(e.target.value)}
                fullWidth
                margin="normal"
              />
            </>
          )}
        </>
      )}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Register
        </Button>
      </Box>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </Box>
  );
};

export default UserRegistration;
