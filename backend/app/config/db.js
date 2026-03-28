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
    const msg = String(err.message);
    if (msg.includes('querySrv') || msg.includes('ENOTFOUND')) {
      console.error(
        'SRV DNS failed. Try: (1) Windows: set IPv4 DNS to 8.8.8.8, run ipconfig /flushdns, restart terminal (2) Or in Atlas: Connect → Compass / Shell and copy a mongodb://… URI (not mongodb+srv) with all host:27017 and replicaSet=… into MONGODB_URI'
      );
    }
    process.exit(1);
  }
};

module.exports = connectDB;
