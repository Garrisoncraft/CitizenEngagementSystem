import React, { useState, useEffect } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, TextField, Button, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Backdrop, CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import apiClient from '../apiClient';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editAgencyId, setEditAgencyId] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
     const token = localStorage.getItem('token');
      const [usersRes, agenciesRes] = await Promise.all([
        apiClient.get('/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        apiClient.get('/admin/agencies', {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);
        setUsers(usersRes.data);
        setAgencies(agenciesRes.data);
        setLoading(false);
      } catch (error) {
        setErrorMessage('Failed to fetch users or agencies.', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditOpen = (user) => {
    setEditUser(user);
    setEditUsername(user.username);
    setEditRole(user.role);
    setEditAgencyId(user.agency_id || '');
    setEditPassword('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleEditClose = () => {
    setEditUser(null);
  };

  const handleEditSave = async () => {
    if (!editUsername || !editRole) {
      setErrorMessage('Username and role are required.');
      return;
    }
    setActionLoading(true);
    try {
      const payload = {
        username: editUsername,
        role: editRole,
        agency_id: editRole === 'agency' ? editAgencyId || null : null,
      };
      if (editPassword) {
        payload.password = editPassword;
      }
      const token = localStorage.getItem('token');
        await apiClient.put(
          `/admin/users/${editUser.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? { ...u, ...payload } : u))
      );
      setSuccessMessage('User updated successfully.');
      setEditUser(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to update user.');
    }
    setActionLoading(false);
  };

  const handleDelete = async (userId) => {
    setActionLoading(true);
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setConfirmDelete(null);
      setSuccessMessage('User deleted successfully.');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to delete user.');
    }
    setActionLoading(false);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4 }}>
       <Backdrop open={actionLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography variant="h5" gutterBottom>
        User Management
      </Typography>
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Agency</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const agency = agencies.find((a) => a.id === user.agency_id);
              return (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{agency ? agency.name : ''}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditOpen(user)} aria-label="edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setConfirmDelete(user.id)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editUser} onClose={handleEditClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Select
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="citizen">Citizen</MenuItem>
            <MenuItem value="agency">Agency</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
          {editRole === 'agency' && (
            <Select
              value={editAgencyId}
              onChange={(e) => setEditAgencyId(e.target.value)}
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
          )}
          <TextField
            label="New Password"
            type="password"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            fullWidth
            margin="normal"
            helperText="Leave blank to keep current password"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button
            onClick={() => handleDelete(confirmDelete)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
