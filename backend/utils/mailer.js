const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Configure the transporter with your admin email credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.ADMIN_EMAIL, 
    pass: process.env.ADMIN_EMAIL_PASSWORD  
  }
});

/**
 * Send email notification to the agency
 * @param {string} to - recipient email address
 * @param {string} subject - email subject
 * @param {string} text - email body text
 */
async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
}

module.exports = { sendEmail };

