const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load .env before anything else

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
// const itemRoutes = require('./routes/items');
// const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
// app.use('/api/items', itemRoutes);
// app.use('/api/admin', adminRoutes);

// MongoDB connection (no deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(5000, () => {
      console.log('🚀 Server is running on http://localhost:5000');
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });
