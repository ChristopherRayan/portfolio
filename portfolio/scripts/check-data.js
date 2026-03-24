const mongoose = require('mongoose');

async function checkData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/portfolio_db');
    const cols = await mongoose.connection.db.listCollections().toArray();
    for (const c of cols) {
      const count = await mongoose.connection.db.collection(c.name).countDocuments();
      console.log(`${c.name}: ${count} documents`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
