const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/dbConnect');
const authRouter = require('./router/auth-router');
const pubRouter = require('./router/pub-router'); // Add publications router
const path = require('path');
const morgan = require('morgan'); // For request logging
// const otpRoutes = require('./router/otp-router');

// Initialize app
const app = express();

// Database connection
connectDB();

// Middleware
app.use(morgan('dev')); // Log requests to console
app.use(cookieParser());
app.use(express.json({ limit: '10mb' })); // Increased limit for file uploads
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://utkarshgupta.info', 'https://utkarshgupta.vercel.app', 'https://utkarshgupta-sr931662s-projects.vercel.app'],
    methods: 'GET,POST,PUT,DELETE,PATCH,HEAD',
    credentials: true,
  })
);
// Serve static files (for uploaded publications)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes
app.get('/', (req, res) => {
  res.status(200).send('Academic Portfolio API');
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/publications', pubRouter); // Add publications routes
app.use('/api/contact', authRouter);
// app.use('/api/auth/otp', otpRoutes);
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
  console.error(err.stack); // Log error stack trace
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Show stack in development
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});