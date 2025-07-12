const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
// const itemRoutes = require('./routes/items'); // optional for now
// const adminRoutes = require('./routes/admin'); // optional for now

app.use('/api/auth', authRoutes);
// app.use('/api/items', itemRoutes);
// app.use('/api/admin', adminRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
  });
})
.catch(err => console.error('MongoDB connection error:', err));
