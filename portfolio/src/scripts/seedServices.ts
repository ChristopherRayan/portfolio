// Seed script for initial services data
// Run this once to populate the database with initial services

import { dbConnect } from '../lib/db';
import Service from '../models/Service';

const initialServices = [
  {
    title: 'Web Design',
    description: 'Creating beautiful, intuitive, and responsive interfaces that delight users.',
    icon: 'Monitor',
    order: 0,
    active: true,
  },
  {
    title: 'Web Development',
    description: 'Building robust and scalable web applications using modern technologies.',
    icon: 'Code',
    order: 1,
    active: true,
  },
  {
    title: 'Backend Development',
    description: 'Developing secure and efficient server-side logic and APIs.',
    icon: 'Server',
    order: 2,
    active: true,
  },
  {
    title: 'Mobile Friendly',
    description: 'Ensuring applications look great on all devices and screen sizes.',
    icon: 'Smartphone',
    order: 3,
    active: true,
  },
];

async function seedServices() {
  try {
    await dbConnect();
    
    // Check if services already exist
    const existingServices = await Service.countDocuments();
    if (existingServices > 0) {
      console.log('Services already exist. Skipping seed.');
      return;
    }

    // Insert initial services
    await Service.insertMany(initialServices);
    console.log('✅ Successfully seeded services!');
  } catch (error) {
    console.error('❌ Error seeding services:', error);
  } finally {
    process.exit();
  }
}

seedServices();
