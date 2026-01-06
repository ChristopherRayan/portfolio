const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/portfolio_db';

const skills = [
  // Programming Languages
  { name: 'JavaScript', percentage: 95, category: 'Programming Languages', level: 'Expert', icon: '🟨' },
  { name: 'Python', percentage: 90, category: 'Programming Languages', level: 'Expert', icon: '🐍' },
  { name: 'Java', percentage: 85, category: 'Programming Languages', level: 'Advanced', icon: '☕' },
  { name: 'C++', percentage: 80, category: 'Programming Languages', level: 'Advanced', icon: '🔵' },
  { name: 'C#', percentage: 80, category: 'Programming Languages', level: 'Advanced', icon: '🟣' },
  { name: 'PHP', percentage: 75, category: 'Programming Languages', level: 'Intermediate', icon: '🐘' },

  // Frontend Development
  { name: 'React.js', percentage: 95, category: 'Frontend Development', level: 'Expert', icon: '⚛️' },
  { name: 'HTML5', percentage: 98, category: 'Frontend Development', level: 'Expert', icon: '🧡' },
  { name: 'CSS3', percentage: 95, category: 'Frontend Development', level: 'Expert', icon: '💙' },
  { name: 'Tailwind CSS', percentage: 90, category: 'Frontend Development', level: 'Expert', icon: '🎨' },

  // Backend Development
  { name: 'Node.js', percentage: 92, category: 'Backend Development', level: 'Expert', icon: '🟢' },
  { name: 'Express.js', percentage: 90, category: 'Backend Development', level: 'Expert', icon: '🚀' },
  { name: 'REST APIs', percentage: 95, category: 'Backend Development', level: 'Expert', icon: '🔌' },

  // Databases
  { name: 'MongoDB', percentage: 90, category: 'Databases', level: 'Expert', icon: '🍃' },
  { name: 'MySQL', percentage: 85, category: 'Databases', level: 'Advanced', icon: '🐬' },
  { name: 'PostgreSQL', percentage: 80, category: 'Databases', level: 'Advanced', icon: '🐘' },

  // Networking & Security
  { name: 'TCP/IP', percentage: 85, category: 'Networking & Security', level: 'Advanced', icon: '🌐' },
  { name: 'Network Config', percentage: 80, category: 'Networking & Security', level: 'Advanced', icon: '⚙️' },
  { name: 'Cybersecurity', percentage: 85, category: 'Networking & Security', level: 'Advanced', icon: '🛡️' },
  { name: 'Burp Suite', percentage: 75, category: 'Networking & Security', level: 'Intermediate', icon: '🐝' },
  { name: 'Linux Security', percentage: 80, category: 'Networking & Security', level: 'Advanced', icon: '🐧' },

  // Tools & Platforms
  { name: 'Git', percentage: 95, category: 'Tools & Platforms', level: 'Expert', icon: '📊' },
  { name: 'VS Code', percentage: 98, category: 'Tools & Platforms', level: 'Expert', icon: '💻' },
  { name: 'Linux', percentage: 90, category: 'Tools & Platforms', level: 'Expert', icon: '🐧' },
  { name: 'Postman', percentage: 95, category: 'Tools & Platforms', level: 'Expert', icon: '📬' },
  { name: 'Docker', percentage: 80, category: 'Tools & Platforms', level: 'Advanced', icon: '🐳' },

  // Design & Multimedia
  { name: 'Adobe Photoshop', percentage: 85, category: 'Design & Multimedia', level: 'Advanced', icon: '🎨' },
  { name: 'UI/UX', percentage: 80, category: 'Design & Multimedia', level: 'Advanced', icon: '✨' },
  { name: 'Figma', percentage: 85, category: 'Design & Multimedia', level: 'Advanced', icon: '🎨' },

  // System Administration
  { name: 'OS Installation', percentage: 95, category: 'System Administration', level: 'Expert', icon: '💿' },
  { name: 'PC Troubleshooting', percentage: 95, category: 'System Administration', level: 'Expert', icon: '🔧' },
  { name: 'System Monitoring', percentage: 85, category: 'System Administration', level: 'Advanced', icon: '📊' },
];

async function seedSkills() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing skills
    await mongoose.connection.db.collection('skills').deleteMany({});
    console.log('Cleared existing skills');

    // Insert new skills
    await mongoose.connection.db.collection('skills').insertMany(skills);
    console.log('Inserted 33 skills');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding skills:', error);
    process.exit(1);
  }
}

seedSkills();
