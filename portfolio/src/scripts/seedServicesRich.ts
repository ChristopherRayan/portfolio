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
      { title: "MERN Stack Development", description: "MongoDB, Express, React, and Node.js for high-performance apps." },
      { title: "RESTful API Design", description: "Clean, well-documented API architectures for seamless integration." },
      { title: "Responsive UI/UX", description: "Mobile-first interfaces that work perfectly on every device size." },
      { title: "Database Optimization", description: "Complex query tuning and schema design for speed and scale." },
      { title: "Secure Authentication", description: "JWT and OAuth implementations to keep your user data safe." },
      { title: "Cloud Deployment", description: "Deployment and CI/CD setup on Vercel, AWS, or DigitalOcean." }
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
      { title: "Infrastructure Setup", description: "Designing and implementing physical and virtual network architectures." },
      { title: "24/7 Monitoring", description: "Real-time surveillance of network traffic and system health." },
      { title: "Security Hardening", description: "Firewall configuration and intrusion detection system setup." },
      { title: "Server Management", description: "Linux and Windows server administration for enterprise needs." },
      { title: "Performance Tuning", description: "Optimizing bandwidth and reducing latency for critical services." },
      { title: "Disaster Recovery", description: "Robust backup strategies to ensure zero data loss during failures." }
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
      { title: "Penetration Testing", description: "Finding vulnerabilities before attackers do using advanced toolsets." },
      { title: "Security Auditing", description: "Comprehensive reviews of codebases and infrastructure for compliance." },
      { title: "Threat Response", description: "Immediate mitigation strategies for active security incidents." },
      { title: "Burp Suite Expert", description: "Professional grade web application security testing and analysis." },
      { title: "Policy Development", description: "Creating corporate security frameworks and employee guidelines." },
      { title: "Data Encryption", description: "Implementing end-to-end encryption for sensitive data at rest." }
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
      { title: "Schema Architecture", description: "Designing data models that scale horizontally and vertically." },
      { title: "Indexing Strategies", description: "Advanced indexing to ensure sub-second query performance." },
      { title: "Data Migration", description: "Safe and zero-downtime transfers between different DB systems." },
      { title: "Replication Setup", description: "High-availability clustering for MongoDB and PostgreSQL." },
      { title: "Backup Automation", description: "Encrypted, off-site backups with automated verification." },
      { title: "Security Protocols", description: "Strict Access Control Lists (ACLs) and connection hardening." }
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
      { title: "Custom Design", description: "Unique visual identities tailored to your specific brand goals." },
      { title: "CMS Integration", description: "Easy-to-use platforms like Headless CMS or WordPress." },
      { title: "SEO Optimization", description: "High-performance code that ranks better on search engines." },
      { title: "Analytics tracking", description: "Deep insights into user behavior with Google Analytics/Vitals." },
      { title: "Animation Effects", description: "Smooth micro-interactions that wow your website visitors." },
      { title: "Domain & Hosting", description: "Complete setup and management of your web infrastructure." }
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
      { title: "Stack Selection", description: "Choosing the right tools based on budget, time, and scale." },
      { title: "Code Reviews", description: "Deep audits of existing codebases to find bugs and bottlenecks." },
      { title: "Architecture Advice", description: "High-level planning for complex distributed systems." },
      { title: "Team Mentorship", description: "Upskilling your developers in modern web and security tech." },
      { title: "Project Estimation", description: "Realistic timelines and resource planning for management." },
      { title: "Toolchain Setup", description: "Building better DX with ESLint, Prettier, and Husky." }
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
      { title: "Logo Identity", description: "Memorable brand marks that represent your core values." },
      { title: "Social Graphics", description: "High-impact visual content for Instagram, LinkedIn, and X." },
      { title: "Print Layouts", description: "Brochures, business cards, and physical marketing material." },
      { title: "UI Components", description: "Designing beautiful buttons, cards, and navigation systems." },
      { title: "Vector Art", description: "Scalable illustrations for websites and mobile applications." },
      { title: "Style Guides", description: "Consistent typography and color palettes for your brand." }
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
