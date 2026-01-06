import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  subtitle: z.string().optional(),
  category: z.string().optional(),
  duration: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().optional(),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  liveUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  order: z.number().default(0),

  // Technical Details
  overview: z.string().optional(),
  problem: z.string().optional(),
  solution: z.object({
    description: z.string(),
    coreLogic: z.string(),
  }).optional(),
  features: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
  })).optional(),
  techStack: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    database: z.array(z.string()),
  }).optional(),
  architecture: z.object({
    pattern: z.string(),
    communication: z.string(),
    authentication: z.string(),
    monitoring: z.string(),
  }).optional(),
  yourRole: z.object({
    backend: z.array(z.string()),
    frontend: z.array(z.string()),
    deployment: z.array(z.string()),
  }).optional(),
  challenges: z.array(z.object({
    problem: z.string(),
    solution: z.string(),
  })).optional(),
  security: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).optional(),
  outcome: z.object({
    whatWorks: z.array(z.string()),
    learnings: z.array(z.string()),
    improvements: z.array(z.string()),
  }).optional(),
  screenshots: z.record(z.string(), z.string()).optional(),
  screenshotsList: z.array(z.object({
    key: z.string(),
    url: z.string()
  })).optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  percentage: z.number().min(0).max(100),
  category: z.enum([
    'Programming Languages',
    'Frontend Development',
    'Backend Development',
    'Databases',
    'Networking & Security',
    'Tools & Platforms',
    'Design & Multimedia',
    'System Administration',
  ]),
  level: z.enum(['Expert', 'Advanced', 'Intermediate']),
  icon: z.string().optional(),
  order: z.number().default(0),
});

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  bio: z.string().min(1, 'Bio is required'),
  professionalSummary: z.string().optional(),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  location: z.string().min(1, 'Location is required'),
  dateOfBirth: z.string().optional(), // Received as string from form
  profileImageUrl: z.string().min(1, 'Profile image is required'),
  cvUrl: z.string().min(1, 'CV URL is required'),
  socialLinks: z.object({
    github: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
  }),
  stats: z.object({
    projectsCompleted: z.coerce.number().min(0),
    yearsExperience: z.coerce.number().min(0),
  }),
  heroImageUrl: z.string().optional(),
  timeline: z.array(z.object({
    year: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
  })).default([]),
  experience: z.array(z.object({
    role: z.string().min(1),
    company: z.string().min(1),
    period: z.string().min(1),
    highlights: z.array(z.string()).default([]),
  })).default([]),
  education: z.array(z.object({
    degree: z.string().min(1),
    institution: z.string().min(1),
    status: z.string().min(1),
  })).default([]),
  certifications: z.array(z.object({
    name: z.string().min(1),
    org: z.string().min(1),
    year: z.string().min(1),
  })).default([]),
  languages: z.array(z.object({
    name: z.string().min(1),
    level: z.string().min(1),
  })).default([]),
  hobbies: z.array(z.string()).default([]),
  references: z.array(z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    phone: z.string().min(1),
  })).default([]),
});

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  attachments: z.array(z.object({
    url: z.string(),
    name: z.string(),
  })).default([]),
});

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  published: z.boolean().default(false),
  tags: z.array(z.string()),
});

export const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  shortDesc: z.string().min(1, 'Short description is required'),
  description: z.string().min(1, 'Description is required'),
  features: z.array(z.object({
    title: z.string().min(1, 'Feature title is required'),
    description: z.string().min(1, 'Feature description is required'),
  })).min(1, 'At least one feature is required'),
  pricing: z.string().min(1, 'Pricing is required'),
  color: z.enum(['blue', 'green', 'red', 'purple', 'yellow', 'indigo']),
  icon: z.string().min(1, 'Icon is required'),
  order: z.number().default(0),
  active: z.boolean().default(true),
});

export const processSchema = z.object({
  step: z.string().min(1, 'Step is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  order: z.number().default(0),
});

export const benefitSchema = z.object({
  icon: z.string().min(1, 'Icon is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  order: z.number().default(0),
});
