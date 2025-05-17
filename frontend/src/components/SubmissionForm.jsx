import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Typography, Box, Alert } from '@mui/material';
import apiClient from '../apiClient';
import TrackingIdPopup from './TrackingIdPopup';

const SubmissionForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submissionType, setSubmissionType] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [location, setLocation] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [submissionTypes] = useState(['Complaint', 'Feedback', 'Suggestion']);
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [trackingId, setTrackingId] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {  
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/admin/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setTrackingId('');
    setPopupOpen(false);

    if (!title || !description || !submissionType || !categoryId) {
      setErrorMessage('Please fill in all required fields including category.');
      return;
    }

    try {
      const response = await apiClient.post('/submissions', {
        title,
        description,
        submission_type: submissionType,
        category_id: categoryId,
        citizen_name: citizenName,
        citizen_email: citizenEmail,
        citizen_phone: citizenPhone,
        location
      });
      setTrackingId(response.data.tracking_id);
      setPopupOpen(true);
      setTitle('');
      setDescription('');
      setSubmissionType('');
      setCategoryId('');
      setCitizenName('');
      setCitizenEmail('');
      setCitizenPhone('');
      setLocation('');
    } catch (error) {
      setErrorMessage('Failed to submit. Please try again later.', error);
    }
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  useEffect(() => {
    if (errorMessage) {
      console.error('SubmissionForm error:', errorMessage);
    }
  }, [errorMessage]);

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 600,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 3,
        }}
        aria-label="Submission form for complaints or feedback"
      >
        <Typography variant="h5" gutterBottom tabIndex={0}>
          Submit a Complaint or Feedback
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }} role="alert" tabIndex={0}>
            {errorMessage}
          </Alert>
        )}
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          margin="normal"
          inputProps={{ 'aria-required': 'true', 'aria-label': 'Title of submission' }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          multiline
          rows={4}
          margin="normal"
          inputProps={{ 'aria-required': 'true', 'aria-label': 'Description of submission' }}
        />
        <TextField
          select
          label="Submission Type"
          value={submissionType}
          onChange={(e) => setSubmissionType(e.target.value)}
          fullWidth
          required
          margin="normal"
          inputProps={{ 'aria-required': 'true', 'aria-label': 'Type of submission' }}
        >
          {submissionTypes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          fullWidth
          required
          margin="normal"
          inputProps={{ 'aria-required': 'true', 'aria-label': 'Category of submission' }}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
        <Typography variant="subtitle1" sx={{ mt: 2 }} tabIndex={0}>
          Citizen Contact Information
        </Typography>
        <TextField
          label="Name"
          value={citizenName}
          onChange={(e) => setCitizenName(e.target.value)}
          fullWidth
          margin="normal"
          inputProps={{ 'aria-label': 'Citizen name' }}
        />
        <TextField
          label="Email"
          type="email"
          value={citizenEmail}
          onChange={(e) => setCitizenEmail(e.target.value)}
          fullWidth
          margin="normal"
          inputProps={{ 'aria-label': 'Citizen email' }}
        />
        <TextField
          label="Phone"
          value={citizenPhone}
          onChange={(e) => setCitizenPhone(e.target.value)}
          fullWidth
          margin="normal"
          inputProps={{ 'aria-label': 'Citizen phone number' }}
        />
        <TextField
          label="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          margin="normal"
          inputProps={{ 'aria-label': 'Location' }}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Submit
        </Button>
      </Box>
      <TrackingIdPopup open={popupOpen} onClose={handleClosePopup} trackingId={trackingId} />
    </>
  );
};

export default SubmissionForm;
