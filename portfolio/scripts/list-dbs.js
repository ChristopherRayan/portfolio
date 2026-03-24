const mongoose = require('mongoose');

async function listDbs() {
  try {
    await mongoose.connect('mongodb://localhost:27017/');
    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.listDatabases();
    console.log("Databases:");
    for (let db of result.databases) {
      console.log(` - ${db.name} (${db.sizeOnDisk} bytes)`);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

listDbs();
