import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: any;
  title: string;
  slug: string;
  subtitle: string;
  category: string;
  duration: string;
  description: string;
  longDescription: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  
  // Rich Technical Content
  overview?: string;
  problem?: string;
  solution?: {
    description: string;
    coreLogic: string;
  };
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  techStack?: {
    frontend: string[];
    backend: string[];
    database: string[];
  };
  architecture?: {
    pattern: string;
    communication: string;
    authentication: string;
    monitoring: string;
  };
  yourRole?: {
    backend: string[];
    frontend: string[];
    deployment: string[];
  };
  challenges?: Array<{
    problem: string;
    solution: string;
  }>;
  security?: Array<{
    title: string;
    description: string;
  }>;
  outcome?: {
    whatWorks: string[];
    learnings: string[];
    improvements: string[];
  };
  screenshots?: {
    [key: string]: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subtitle: { type: String, default: '' },
    category: { type: String, default: 'Full-Stack Project' },
    duration: { type: String, default: '' },
    description: { type: String, required: true },
    longDescription: { type: String, default: '' },
    technologies: [{ type: String }],
    imageUrl: { type: String, required: true },
    liveUrl: { type: String },
    githubUrl: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    
    // Rich Technical Content
    overview: { type: String },
    problem: { type: String },
    solution: {
      description: { type: String },
      coreLogic: { type: String },
    },
    features: [{
      title: { type: String },
      description: { type: String },
      icon: { type: String },
    }],
    techStack: {
      frontend: [{ type: String }],
      backend: [{ type: String }],
      database: [{ type: String }],
    },
    architecture: {
      pattern: { type: String },
      communication: { type: String },
      authentication: { type: String },
      monitoring: { type: String },
    },
    yourRole: {
      backend: [{ type: String }],
      frontend: [{ type: String }],
      deployment: [{ type: String }],
    },
    challenges: [{
      problem: { type: String },
      solution: { type: String },
    }],
    security: [{
      title: { type: String },
      description: { type: String },
    }],
    outcome: {
      whatWorks: [{ type: String }],
      learnings: [{ type: String }],
      improvements: [{ type: String }],
    },
    screenshots: { type: Map, of: String },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
