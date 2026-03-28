require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const dns = require('dns').promises;
const mongoose = require('mongoose');

function redact(uri) {
  return uri.replace(/:([^:@/]+)@/, ':****@');
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Thieu MONGODB_URI trong .env');
    process.exit(1);
  }
  console.log('URI (an mat khau):', redact(uri));

  const hostMatch = uri.match(/@([^/?]+)/);
  const clusterHost = hostMatch ? hostMatch[1] : '';
  const srvName = `_mongodb._tcp.${clusterHost}`;

  try {
    const records = await dns.resolveSrv(srvName);
    console.log('SRV OK:', records.length, 'may chu');
  } catch (e) {
    console.error('SRV LOI:', e.code || e.message);
    console.error('-> Mang/router khong tra loi DNS cho', srvName);
    console.error('-> Doi DNS Windows sang 8.8.8.8, ipconfig /flushdns, hoac dung URI mongodb:// (khong srv) tu Atlas.');
    process.exit(1);
  }

  try {
    try {
      require('dns').setServers(['8.8.8.8', '8.8.4.4']);
    } catch {}
    await mongoose.connect(uri, {
      dbName: 'portfolio',
      serverSelectionTimeoutMS: 15000,
    });
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('Ket noi MongoDB thanh cong (ping OK).');
    await mongoose.disconnect();
  } catch (e) {
    console.error('Mongoose:', e.message);
    if (String(e.message).includes('bad auth') || String(e.message).includes('Authentication failed')) {
      console.error('-> Sai user hoac mat khau. Atlas > Database Access > doi password user midterm_user.');
    }
    if (String(e.message).includes('IP') || String(e.message).includes('whitelist')) {
      console.error('-> Atlas > Network Access > Add IP Address > Allow Access from Anywhere (0.0.0.0/0) de thu.');
    }
    process.exit(1);
  }
}

main();
