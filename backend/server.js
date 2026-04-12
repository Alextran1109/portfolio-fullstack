require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const createError = require('http-errors');
const connectDB = require('./app/config/db');

const authRoutes = require('./app/routes/authRoutes');
const userRoutes = require('./app/routes/userRoutes');
const projectRoutes = require('./app/routes/projectRoutes');
const serviceRoutes = require('./app/routes/serviceRoutes');
const referenceRoutes = require('./app/routes/referenceRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Portfolio API', data: { version: '1.0.0' } });
});

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/references', referenceRoutes);

app.use((req, res, next) => {
  next(createError(404, `Not found: ${req.method} ${req.path}`));
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid id' });
  }
  if (res.headersSent) return;
  res.status(status).json({ success: false, message });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
