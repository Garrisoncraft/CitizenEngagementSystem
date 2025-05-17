const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
// Routes
const submissionsRouter = require('./routes/submissions');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');


const app = express();
const port = process.env.PORT || 5000;

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  optionsSuccessStatus: 200,
};



// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());


app.use('/submissions', submissionsRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);



// Basic route to test server
app.get('/', (req, res) => {
  res.send('Citizen Engagement System API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
