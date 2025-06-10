const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Increase payload limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// Import connections
const connection = require('./connection/connection');

// Start Connection
connection();

const AuthRoute = require('./Routes/authRoute');
app.use('/auth', AuthRoute);

// 404 Route (Catch-All)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Page Not Found' });
});

// Port address details
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`📂 Server is running on port ${port}`);
});