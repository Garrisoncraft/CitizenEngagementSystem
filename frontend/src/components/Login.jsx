import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../apiClient';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username || !password) {
      setErrorMessage('Please enter username and password.');
      return;
    }

    try {
      const response = await apiClient.post('/auth/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Decode token to get user role
      const decoded = parseJwt(token);
      const role = decoded?.role;

      // Navigate based on role
      if (role === 'admin' || role === 'agency') {
        navigate('/admin/dashboard');
      } else if (role === 'citizen') {
        navigate('/');
      } else {
        navigate('/');
      }
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials.', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      <Box component="form" onSubmit={handleLogin}>
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
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </Typography>
    </Box>
  );
};

export default Login;
