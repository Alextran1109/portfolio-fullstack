require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('No MONGODB_URI in .env');
  process.exit(1);
}

mongoose
  .connect(uri, { dbName: 'portfolio', serverSelectionTimeoutMS: 15000 })
  .then(async () => {
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('DB ok');
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
