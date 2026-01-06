const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/portfolio_db';

console.log('Testing connection to:', MONGODB_URI);

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');
    
    // List collections to show "what is there"
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    if (collections.length === 0) {
        console.log('   (No collections found - database is valid but empty)');
    } else {
        collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
