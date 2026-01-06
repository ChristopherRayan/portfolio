const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/portfolio_db';

async function checkProfile() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Explicitly using the 'profiles' collection (lowercase plural is default Mongoose behavior)
    // The model is 'Profile', so collection is 'profiles'
    const profile = await mongoose.connection.db.collection('profiles').findOne({});
    
    console.log('--- Current Profile Data ---');
    if (!profile) {
        console.log('No profile found in database.');
    } else {
        console.log(JSON.stringify(profile, null, 2));
    }
    console.log('----------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkProfile();
