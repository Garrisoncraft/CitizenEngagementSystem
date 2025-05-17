const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { requireAdmin } = require("../middleware/roleCheck");
const { authenticateToken, JWT_SECRET } = require("../middleware/auth");
const { sendEmail } = require("../utils/mailer");



// GET /categories - list predefined categories
router.get("/categories", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name FROM categories ORDER BY name"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /agencies - list predefined agencies with email
router.get("/agencies", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email FROM agencies ORDER BY name"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching agencies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new agency (admin only)
router.post("/agencies", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    // Check if agency already exists
    const [existing] = await pool.execute(
      "SELECT id FROM agencies WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Agency with this email already exists" });
    }
    // Insert new agency
    const [result] = await pool.execute(
      "INSERT INTO agencies (name, email) VALUES (?, ?)",
      [name, email]
    );
    res.status(201).json({ message: "Agency created successfully", id: result.insertId });
  } catch (error) {
    console.error("Error creating agency:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [rows] = await pool.execute(
      "SELECT id, username, role, agency_id FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get all users (admin only)
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, username, role, agency_id FROM users ORDER BY username"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user (admin only)
router.put("/users/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, password, role, agency_id } = req.body;

    // Validate role if provided
    if (role && !["admin", "agency", "citizen"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Check if user exists
    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE id = ?",
      [userId]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user
    const updateQuery = `
      UPDATE users SET
        username = COALESCE(?, username),
        password_hash = COALESCE(?, password_hash),
        role = COALESCE(?, role),
        agency_id = COALESCE(?, agency_id)
      WHERE id = ?
    `;
    await pool.execute(updateQuery, [
      username,
      hashedPassword,
      role,
      agency_id || null,
      userId,
    ]);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user (admin only)
router.delete("/users/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE id = ?",
      [userId]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user
    await pool.execute("DELETE FROM users WHERE id = ?", [userId]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/submissions", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    let query = `
      SELECT s.id, s.tracking_id, s.title, s.submission_type, s.status, s.created_at, c.name AS category, a.name AS agency
      FROM submissions s
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN agencies a ON s.agency_id = a.id
    `;
    let params = [];

    if (user.role === "agency") {
      query += " WHERE s.agency_id = ?";
      params.push(user.agency_id);
    }

    query += " ORDER BY s.created_at DESC";

    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update submission (admin protected)
router.put("/submissions/:id", authenticateToken, async (req, res) => {
  try {
    const submissionId = req.params.id;
    const { category_id, agency_id, status, public_response, internal_notes } =
      req.body;

    // Validate status if provided
    const validStatuses = [
      "Submitted",
      "Under Review",
      "Assigned to Agency",
      "In Progress",
      "Resolved",
      "Closed",
    ];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Update submission
    const [result] = await pool.execute(
      `UPDATE submissions SET category_id = ?, agency_id = ?, status = ?, public_response = ?, internal_notes = ?, updated_at = NOW() WHERE id = ?`,
      [
        category_id || null,
        agency_id || null,
        status || null,
        public_response || null,
        internal_notes || null,
        submissionId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Submission not found" });
    }

    // Insert into submission_history table to log status changes
    if (status) {
      await pool.execute(
        "INSERT INTO submission_history (submission_id, status, public_response, internal_notes, changed_at) VALUES (?, ?, ?, ?, NOW())",
        [
          submissionId,
          status,
          public_response || null,
          internal_notes || null,
        ]
      );
    }

    // Send email notification to agency if agency_id is assigned
    if (agency_id) {
      // Get agency email and submission details
      const [agencyRows] = await pool.execute(
        "SELECT email, name FROM agencies WHERE id = ?",
        [agency_id]
      );
      if (agencyRows.length > 0) {
        const agencyEmail = agencyRows[0].email;
        const agencyName = agencyRows[0].name;

        const [submissionRows] = await pool.execute(
          "SELECT title, description, submission_type FROM submissions WHERE id = ?",
          [submissionId]
        );
        if (submissionRows.length > 0) {
          const submission = submissionRows[0];
          const emailSubject = `New Submission Assigned: ${submission.title}`;
          const emailText = `Dear ${agencyName},

          A new submission has been assigned to your agency.

          Title: ${submission.title}
          Type: ${submission.submission_type}
          Description:
          ${submission.description}

          Please log in to the Citizen Engagement System admin dashboard to review and manage this citizen's feedback.

          Best regards,
          Citizen Engagement System`;

          await sendEmail(agencyEmail, emailSubject, emailText);
        }
      }
    }

    // Send email notification to citizen on status update
    if (status) {
      const [submissionRows] = await pool.execute(
        "SELECT citizen_email, citizen_name, tracking_id FROM submissions WHERE id = ?",
        [submissionId]
      );
      if (submissionRows.length > 0) {
        const submission = submissionRows[0];
        if (submission.citizen_email) {
          const emailSubject = `Update on your submission ${submission.tracking_id}`;
          const emailText = `Dear ${submission.citizen_name || 'Citizen'},

            Your submission with tracking ID ${submission.tracking_id} has been updated to status: ${status}.
                    
            You can check the details and any public response by logging into the Citizen Engagement System.
                    
            Thank you for your engagement.
                    
            Best regards,
            Citizen Engagement System`;

          await sendEmail(submission.citizen_email, emailSubject, emailText);
        }
      }
    }

    res.json({ message: "Submission updated successfully" });
  } catch (error) {
    console.error("Error updating submission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete submission (admin protected)
router.delete("/submissions/:id", authenticateToken, async (req, res) => {
  try {
    const submissionId = req.params.id;

    // Check if submission exists
    const [existing] = await pool.execute(
      "SELECT id FROM submissions WHERE id = ?",
      [submissionId]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "Submission not found" });
    }
    // Delete submission
    await pool.execute("DELETE FROM submissions WHERE id = ?", [submissionId]);

    res.json({ message: "Submission deleted successfully" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
