import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/portfolio_db';

async function checkHeroImage() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const profile = await mongoose.connection.db.collection('profiles').findOne({});
    
    console.log('--- Hero Image Debug ---');
    if (!profile) {
        console.log('No profile found.');
    } else {
        console.log('ID:', profile._id);
        console.log('heroImageUrl Type:', typeof profile.heroImageUrl);
        console.log('heroImageUrl Value:', profile.heroImageUrl);
        
        // Check if it's nested or weirdly shaped
        console.log('Full Profile Keys:', Object.keys(profile));
    }
    console.log('------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkHeroImage();
