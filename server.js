const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kawakib';
if (!process.env.MONGODB_URI) {
  console.warn('Warning: MONGODB_URI environment variable is not set. Using default local MongoDB URI.');
} else {
  // Redact password for logging
  const safeUri = mongoUri.replace(/:\w+@/, ':<redacted>@');
  console.log('Using MongoDB URI:', safeUri);
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  if (err.message) {
    console.error('MongoDB error message:', err.message);
  }
  if (err.reason) {
    console.error('MongoDB error reason:', err.reason);
  }
});

// Routes
app.use('/api/cardsets', require('./routes/cardsets'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 