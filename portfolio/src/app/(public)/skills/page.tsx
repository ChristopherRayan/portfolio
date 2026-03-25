import { Skills } from '@/components/public/Skills';
import dbConnect from '@/lib/db';
import Skill from '@/models/Skill';

export const metadata = {
  title: 'Skills',
  description: 'My technical expertise and toolset.',
};

export const dynamic = 'force-dynamic';

export default async function SkillsPage() {
  await dbConnect();
  
  // Fetch skills on the server
  const skills = await Skill.find({}).sort({ order: 1 }).lean();
  
  // Serialize for client component
  const serializedSkills = JSON.parse(JSON.stringify(skills));

  return <Skills initialSkills={serializedSkills} />;
}
