const dns = require('dns');
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in environment');
    process.exit(1);
  }
  try {
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch {}
    await mongoose.connect(uri, { dbName: 'portfolio' });
    console.log('MongoDB connected (database: portfolio)');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
