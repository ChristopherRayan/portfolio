import type { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Project, { IProject } from '@/models/Project';
import ProjectDetailsClient from '@/components/public/ProjectDetailsClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const project = await Project.findOne({ slug }).lean();

  if (!project) {
    return {
      title: 'Project Not Found | Portfolio',
    };
  }

  const title = project.title;
  const description = project.description;
  const image = project.imageUrl;

  return {
    title: `${title} | Project Showcase`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  
  const projectDoc = await Project.findOne({ slug }).lean();
  
  if (!projectDoc) {
    notFound();
  }

  // Serialize Mongoose docs for Client Component
  const project = JSON.parse(JSON.stringify(projectDoc)) as IProject;

  return <ProjectDetailsClient project={project} />;
}
