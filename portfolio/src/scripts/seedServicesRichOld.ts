import { dbConnect } from '../lib/db';
import Service from '../models/Service';
import Process from '../models/Process';
import Benefit from '../models/Benefit';

const services = [
  {
    title: "Full-Stack Web Development",
    shortDesc: "Build powerful, scalable web applications",
    description: "Custom web applications using modern technologies like React.js, Node.js, and MongoDB. From concept to deployment, I create responsive, user-friendly solutions.",
    features: [
      "MERN Stack Development (MongoDB, Express, React, Node.js)",
      "RESTful API Design & Development",
      "Responsive UI/UX Implementation",
      "Database Design & Optimization",
      "Payment Gateway Integration",
      "Third-party API Integration"
    ],
    pricing: "Starting from $500",
    color: "blue",
    icon: "Code",
    order: 1,
    active: true
  },
  {
    title: "Network Administration",
    shortDesc: "Secure, reliable network infrastructure",
    description: "Professional network setup, monitoring, and maintenance to ensure your infrastructure runs smoothly with maximum uptime and security.",
    features: [
      "Network Infrastructure Setup",
      "System Monitoring & Optimization",
      "Server Configuration & Management",
      "Network Security Implementation",
      "Performance Tuning",
      "24/7 Support & Maintenance"
    ],
    pricing: "Custom Quote",
    color: "green",
    icon: "Server",
    order: 2,
    active: true
  },
  {
    title: "Cybersecurity Solutions",
    shortDesc: "Protect your digital assets",
    description: "Comprehensive security assessments and implementation using industry-standard tools and best practices to safeguard your systems.",
    features: [
      "Vulnerability Assessment & Penetration Testing",
      "Security Audits & Compliance",
      "Threat Detection & Response",
      "Security Tools Implementation (Burp Suite)",
      "Security Policy Development",
      "Employee Security Training"
    ],
    pricing: "Starting from $800",
    color: "red",
    icon: "Shield",
    order: 3,
    active: true
  },
  {
    title: "Database Design & Management",
    shortDesc: "Efficient, scalable data solutions",
    description: "Design and implement robust database systems that scale with your business needs while maintaining optimal performance.",
    features: [
      "Database Architecture Design",
      "MongoDB, MySQL, PostgreSQL Setup",
      "Data Migration & Integration",
      "Performance Optimization",
      "Backup & Recovery Solutions",
      "Database Security Hardening"
    ],
    pricing: "Starting from $400",
    color: "purple",
    icon: "Database",
    order: 4,
    active: true
  },
  {
    title: "Website Development",
    shortDesc: "Modern, professional websites",
    description: "Create stunning websites that represent your brand and engage your audience with modern design and smooth functionality.",
    features: [
      "Custom Website Design",
      "Content Management Systems",
      "E-commerce Solutions",
      "SEO Optimization",
      "Mobile-First Design",
      "Analytics Integration"
    ],
    pricing: "Starting from $600",
    color: "yellow",
    icon: "Globe",
    order: 5,
    active: true
  },
  {
    title: "Technical Consulting",
    shortDesc: "Expert guidance for your projects",
    description: "Get professional advice on technology decisions, architecture planning, and implementation strategies for your projects.",
    features: [
      "Technology Stack Selection",
      "Architecture Planning",
      "Code Review & Optimization",
      "Performance Analysis",
      "Security Assessment",
      "Team Training & Mentorship"
    ],
    pricing: "$100/hour",
    color: "indigo",
    icon: "Smartphone",
    order: 6,
    active: true
  },
  {
    title: "Graphic Design",
    shortDesc: "Creative visual solutions",
    description: "Professional graphic design services for your brand, including logos, marketing materials, and digital assets.",
    features: [
      "Logo & Brand Identity Design",
      "Marketing Material Design",
      "Social Media Graphics",
      "UI/UX Visual Design",
      "Vector Illustration",
      "Print Design Solutions"
    ],
    pricing: "Starting from $300",
    color: "purple",
    icon: "Palette",
    order: 7,
    active: true
  }
];

const processes = [
  {
    step: "01",
    title: "Discovery & Planning",
    description: "We discuss your requirements, goals, and project scope to create a detailed plan.",
    order: 1
  },
  {
    step: "02",
    title: "Design & Development",
    description: "I create wireframes, designs, and start building your solution using best practices.",
    order: 2
  },
  {
    step: "03",
    title: "Testing & Review",
    description: "Thorough testing ensures everything works perfectly before launch.",
    order: 3
  },
  {
    step: "04",
    title: "Launch & Support",
    description: "Deployment to production with ongoing support and maintenance.",
    order: 4
  }
];

const benefits = [
  {
    icon: "Zap",
    title: "Fast Delivery",
    description: "Quick turnaround without compromising quality",
    order: 1
  },
  {
    icon: "Shield",
    title: "Security First",
    description: "Built with security best practices from the ground up",
    order: 2
  },
  {
    icon: "Check",
    title: "Quality Assured",
    description: "Rigorous testing and code reviews for every project",
    order: 3
  },
  {
    icon: "MessageSquare",
    title: "Clear Communication",
    description: "Regular updates and transparent progress tracking",
    order: 4
  }
];

async function seed() {
  try {
    await dbConnect();
    
    // Clear existing
    await Service.deleteMany({});
    await Process.deleteMany({});
    await Benefit.deleteMany({});

    // Insert new
    await Service.insertMany(services);
    await Process.insertMany(processes);
    await Benefit.insertMany(benefits);

    console.log('✅ Successfully seeded rich services data!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    process.exit();
  }
}

seed();
