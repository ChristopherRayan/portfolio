const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://localhost:27017/portfolio_db";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    published: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

const blogs = [
  {
    title: "The Future of Web Development in 2025",
    slug: "future-web-development-2025",
    excerpt: "Exploring Next.js, AI integration, and the evolving role of full-stack engineers in a world of automated coding.",
    content: `# The Future of Web Development in 2025\n\nAs we move further into 2025, the landscape of web development continues to shift at an unprecedented pace. The days of simple static sites are long gone, replaced by highly interactive, AI-driven experiences.\n\n## Key Trends to Watch\n\n1. **AI-First Workflows**: Tools like Antigravity are no longer just helpers; they are central to the development process, enabling developers to focus on architecture and complex logic while handling boilerplate and refactoring with ease.\n2. **Next.js & React 19**: Server components, actions, and the continuous refinement of the App Router have made building performant applications the default, not the exception.\n3. **Edge Computing**: Latency is the enemy of UX. Deploying logic closer to the user is now standard practice for any global application.\n\nThe role of a full-stack developer is evolving from "someone who writes code" to "someone who orchestrates systems". It's an exciting time to be in the field!`,
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    published: true,
    tags: ["nextjs", "webdev", "ai", "2025"]
  },
  {
    title: "Mastering Framer Motion for Premium UX",
    slug: "mastering-framer-motion",
    excerpt: "Practical tips for creating smooth, performant, and delightful animations that elevate your website from good to premium.",
    content: `# Mastering Framer Motion for Premium UX\n\nAnimation is the "secret sauce" of premium web design. It provides context, guides the user, and makes an interface feel "alive".\n\n## Why Framer Motion?\n\nFramer Motion has become the industry standard for React animations because of its declarative API and powerful features.\n\n### Tips for Better Animations\n\n- **Use Layout Transitions**: The \`layout\` prop handles complex CSS transitions automatically, making list reordering and size changes look flawless.\n- **Staggered Animations**: Use \`variants\` to stagger the appearance of list items for a professional "loading" feel.\n- **Hover & Tap Effects**: Subtle scaling and color shifts on interaction provide immediate feedback to the user.\n\nRemember: Good animation is felt, not just seen. Avoid over-animating; keep it subtle and purposeful.`,
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    published: true,
    tags: ["animation", "design", "react", "ux"]
  },
  {
    title: "Building a Scalable AI-Powered Portfolio",
    slug: "scalable-ai-portfolio",
    excerpt: "A technical deep-dive into the architecture of this portfolio and how it supports rapid feature growth and AI integration.",
    content: `# Building a Scalable AI-Powered Portfolio\n\nWhen I set out to build this portfolio, I didn't just want a business card. I wanted a platform that could grow with me.\n\n## The Architecture\n\n- **Next.js 15+**: Leveraging the latest features for speed and SEO.\n- **MongoDB Atlas**: A flexible document store that allows me to iterate on schemas (like adding multi-file attachments) without downtime.\n- **Tailwind CSS**: A robust design system that keeps the UI consistent and premium.\n\n## AI Integration\n\nBy leveraging agentic AI tools during the development process, I've been able to implement complex features—like the unread message tracking system and multi-file uploads—in record time.\n\nThe future of portfolios isn't just showing what you've done; it's showing how you build.`,
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    published: true,
    tags: ["portfolio", "architecture", "nextjs", "tech-stack"]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database');

    const existing = await Blog.countDocuments();
    if (existing > 0) {
      console.log('Blogs already exist. Skipping seed.');
    } else {
      await Blog.insertMany(blogs);
      console.log('Successfully seeded 3 blog posts');
    }
  } catch (error) {
    console.error('Error seeding blogs:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
