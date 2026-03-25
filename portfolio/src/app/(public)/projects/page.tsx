import { Projects } from '@/components/public/Projects';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';

export const metadata = {
  title: 'Projects',
  description: 'Showcase of my recent work and case studies.',
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  await dbConnect();
  
  // Fetch projects on the server
  const projects = await Project.find({}).sort({ order: 1 }).lean();
  
  // Serialize for client component
  const serializedProjects = JSON.parse(JSON.stringify(projects));

  return <Projects initialProjects={serializedProjects} />;
}
