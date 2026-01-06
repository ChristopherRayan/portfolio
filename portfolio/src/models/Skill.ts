import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISkill extends Document {
  _id: any;
  name: string;
  percentage: number;
  category: 'Programming Languages' | 'Frontend Development' | 'Backend Development' | 'Databases' | 'Networking & Security' | 'Tools & Platforms' | 'Design & Multimedia' | 'System Administration';
  level: 'Expert' | 'Advanced' | 'Intermediate';
  icon?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    category: {
      type: String,
      enum: [
        'Programming Languages',
        'Frontend Development',
        'Backend Development',
        'Databases',
        'Networking & Security',
        'Tools & Platforms',
        'Design & Multimedia',
        'System Administration',
      ],
      required: true,
      default: 'Programming Languages',
    },
    level: {
      type: String,
      enum: ['Expert', 'Advanced', 'Intermediate'],
      required: true,
      default: 'Intermediate',
    },
    icon: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);

export default Skill;
