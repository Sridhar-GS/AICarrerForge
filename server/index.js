const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aiforge')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB error", err));

const evalRoutes = require('./routes/evalRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/eval', evalRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});