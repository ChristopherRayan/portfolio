import mongoose, { Schema, Document, Model } from 'mongoose';

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  institution: string;
  status: string;
}

export interface Certification {
  name: string;
  org: string;
  year: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Reference {
  name: string;
  title: string;
  phone: string;
}

export interface IProfile extends Document {
  _id: any;
  name: string;
  title: string;
  bio: string;
  professionalSummary?: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth?: Date;
  profileImageUrl: string;
  cvUrl: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  stats: {
    projectsCompleted: number;
    yearsExperience: number;
  };
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImageUrl?: string;
  timeline: TimelineEvent[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  hobbies: string[];
  references: Reference[];
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    professionalSummary: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    dateOfBirth: { type: Date },
    profileImageUrl: { type: String, required: true },
    cvUrl: { type: String, required: true },
    socialLinks: {
      github: { type: String },
      linkedin: { type: String },
      facebook: { type: String },
      instagram: { type: String },
    },
    stats: {
      projectsCompleted: { type: Number, default: 0 },
      yearsExperience: { type: Number, default: 0 },
    },
    // Hero Section Overrides
    heroTitle: { type: String }, 
    heroSubtitle: { type: String }, 
    heroDescription: { type: String },
    heroImageUrl: { type: String },
    timeline: [{
      year: { type: String },
      title: { type: String },
      description: { type: String },
    }],
    experience: [{
      role: { type: String },
      company: { type: String },
      period: { type: String },
      highlights: [{ type: String }],
    }],
    education: [{
      degree: { type: String },
      institution: { type: String },
      status: { type: String },
    }],
    certifications: [{
      name: { type: String },
      org: { type: String },
      year: { type: String },
    }],
    languages: [{
      name: { type: String },
      level: { type: String },
    }],
    hobbies: [{ type: String }],
    references: [{
      name: { type: String },
      title: { type: String },
      phone: { type: String },
    }],
  },
  { timestamps: true }
);

// Ensure only one profile exists
// Prevent Mongoose 'OverwriteModelError' in development
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Profile;
}

const Profile = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);

export default Profile;
