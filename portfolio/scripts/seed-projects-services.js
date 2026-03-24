const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/portfolio_db';

const projects = [
  {
    title: "E-Commerce Platform",
    slug: "e-commerce-platform",
    subtitle: "A scalable online store",
    category: "Full-Stack Project",
    duration: "3 months",
    description: "Built a fully functional e-commerce platform with Stripe integration.",
    longDescription: "This project involved creating a custom storefront with Next.js and a Node.js backend to handle complex order logic.",
    technologies: ["Next.js", "Node.js", "MongoDB", "Stripe"],
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    order: 1
  },
  {
    title: "AI Chat Assistant",
    slug: "ai-chat-assistant",
    subtitle: "Conversational AI Interface",
    category: "AI Integration",
    duration: "1 month",
    description: "An AI chat interface integrating OpenAI's API.",
    longDescription: "Developed a responsive chat UI with streaming responses and message history persistence.",
    technologies: ["React", "OpenAI", "Tailwind CSS"],
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    order: 2
  }
];

const services = [
  {
    title: "Web Development",
    shortDesc: "Custom web applications",
    description: "I build responsive, fast, and scalable web applications tailored to your business needs.",
    features: [
      { title: "Responsive Design", description: "Mobile-first approach" },
      { title: "SEO Optimization", description: "Built with SEO best practices" }
    ],
    pricing: "Starting at $500",
    color: "blue",
    icon: "Monitor",
    order: 1
  },
  {
    title: "Backend Architecture",
    shortDesc: "Robust server solutions",
    description: "Designing and implementing secure, scalable backend architectures and APIs.",
    features: [
      { title: "REST APIs", description: "Well documented API endpoints" },
      { title: "Database Design", description: "Optimized data structures" }
    ],
    pricing: "Starting at $400",
    color: "green",
    icon: "Server",
    order: 2
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    await mongoose.connection.db.collection('projects').deleteMany({});
    await mongoose.connection.db.collection('projects').insertMany(projects);
    console.log('Seeded projects');

    await mongoose.connection.db.collection('services').deleteMany({});
    await mongoose.connection.db.collection('services').insertMany(services);
    console.log('Seeded services');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

seed();
