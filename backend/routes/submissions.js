const express = require('express');
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../utils/mailer');

// Function to generate short tracking ID
function generateTrackingId() {
  return uuidv4().split('-')[0].toUpperCase();
}

//Create new complaint/feedback
router.post('/', async (req, res) => {
  try {
const {
      title,
      description,
      submission_type,
      category_id,
      citizen_name,
      citizen_email,
      citizen_phone,
      location
    } = req.body;

    // Basic validation
    if (!title || !description || !submission_type || !category_id) {
      return res.status(400).json({ error: 'Title, description, submission_type, and category_id are required' });
    }

    // Additional input sanitization (simple example)
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description.trim();
    const sanitizedSubmissionType = submission_type.trim();
    const sanitizedCategoryId = category_id;
    const sanitizedCitizenName = citizen_name ? citizen_name.trim() : null;
    const sanitizedCitizenEmail = citizen_email ? citizen_email.trim() : null;
    const sanitizedCitizenPhone = citizen_phone ? citizen_phone.trim() : null;
    const sanitizedLocation = location ? location.trim() : null;

    const tracking_id = generateTrackingId();

    const agency_id = null;

    const [result] = await pool.execute(
      `INSERT INTO submissions 
      (tracking_id, title, description, submission_type, category_id, agency_id, citizen_name, citizen_email, citizen_phone, location) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

      [tracking_id, sanitizedTitle, sanitizedDescription, sanitizedSubmissionType, sanitizedCategoryId, agency_id, sanitizedCitizenName, sanitizedCitizenEmail, sanitizedCitizenPhone, sanitizedLocation]
    );

    // Send tracking ID email to citizen if email provided
    if (sanitizedCitizenEmail) {
      const subject = 'Citizen Engagement Tracking ID';
      const text = `Dear ${sanitizedCitizenName || 'Citizen'},\n\nThank you for your submission titled "${sanitizedTitle}". Your tracking ID is: ${tracking_id}.\n\nYou can use this ID to track the status of your submission.\n\nBest regards,\nCitizen Engagement Team`;
      sendEmail(sanitizedCitizenEmail, subject, text);
    }

    res.status(201).json({ tracking_id });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET submission status and response
router.get('/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    const [rows] = await pool.execute(
      `SELECT tracking_id, title, description, submission_type, citizen_name, citizen_email, citizen_phone, location, category_id, agency_id, status, public_response, created_at, updated_at
       FROM submissions WHERE tracking_id = ?`,
      [trackingId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
