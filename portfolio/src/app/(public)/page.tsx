import { Hero } from '@/components/public/Hero';
import { dbConnect } from '@/lib/db';
import Profile from '@/models/Profile';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  await dbConnect();
  const profile = await Profile.findOne({}).lean();
  const serializedProfile = JSON.parse(JSON.stringify(profile));

  return (
    <>
      <Hero initialProfile={serializedProfile} />
    </>
  );
}
