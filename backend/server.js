const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
// Routes
const submissionsRouter = require('./routes/submissions');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');


const port = process.env.PORT || 5000;



// Middleware
app.use(cors());
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
