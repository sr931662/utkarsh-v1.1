// server.js - Add these changes
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/dbConnect');
const authRouter = require('./router/auth-router');
const pubRouter = require('./router/pub-router');
const contactRouter = require('./router/contact'); // Add this import
const path = require('path');
const morgan = require('morgan');

// Initialize app
const app = express();

// Database connection
connectDB();

// Middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://utkarshgupta.info', 'https://utkarshgupta.vercel.app', 'https://utkarshgupta-sr931662s-projects.vercel.app'],
    methods: 'GET,POST,PUT,DELETE,PATCH,HEAD',
    credentials: true,
  })
);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get('/', (req, res) => {
  res.status(200).send('Academic Portfolio API');
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/publications', pubRouter);
app.use('/api/contact', contactRouter); // Add this line for contact routes

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Endpoint not found'
  });
});

// Serve frontend (React build)
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
