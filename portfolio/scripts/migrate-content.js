const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['1.1.1.1', '8.8.8.8']);

const SOURCE_URI = process.env.SOURCE_MONGODB_URI || 'mongodb://localhost:27017/portfolio_db';
const TARGET_URI = process.env.TARGET_MONGODB_URI;

const COLLECTIONS = [
  'profiles',
  'blogs',
  'skills',
  'projects',
  'services',
  'benefits',
  'processes',
];

async function connect(uri) {
  return mongoose.createConnection(uri, {
    serverSelectionTimeoutMS: 30000,
  }).asPromise();
}

async function migrateCollection(sourceDb, targetDb, collectionName) {
  const docs = await sourceDb.collection(collectionName).find({}).toArray();
  await targetDb.collection(collectionName).deleteMany({});

  if (docs.length > 0) {
    await targetDb.collection(collectionName).insertMany(docs);
  }

  console.log(`${collectionName}: ${docs.length} documents copied`);
}

async function main() {
  if (!TARGET_URI) {
    throw new Error('TARGET_MONGODB_URI is required');
  }

  const sourceConn = await connect(SOURCE_URI);
  const targetConn = await connect(TARGET_URI);

  try {
    for (const collectionName of COLLECTIONS) {
      await migrateCollection(sourceConn.db, targetConn.db, collectionName);
    }

    console.log('Content migration complete');
  } finally {
    await sourceConn.close();
    await targetConn.close();
  }
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
