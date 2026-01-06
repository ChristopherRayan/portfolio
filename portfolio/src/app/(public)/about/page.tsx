import { About } from '@/components/public/About';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';

export const metadata = {
  title: 'About Me',
  description: 'Learn more about my background, experience, and journey.',
};

export default async function AboutPage() {
  await dbConnect();
  const profile = await Profile.findOne({}).lean();
  const serializedProfile = JSON.parse(JSON.stringify(profile));

  return <About initialProfile={serializedProfile} />;
}
