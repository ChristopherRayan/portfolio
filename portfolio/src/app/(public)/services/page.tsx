import { Services } from '@/components/public/Services';
import { dbConnect } from '@/lib/db';
import Service from '@/models/Service';
import Process from '@/models/Process';
import Benefit from '@/models/Benefit';

export const metadata = {
  title: 'Services',
  description: 'Professional services and solutions I offer.',
};

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  await dbConnect();
  
  // Fetch initial data on the server for fast loading
  const services = await Service.find({ active: true }).sort({ order: 1 }).lean();
  const processSteps = await Process.find({}).sort({ order: 1 }).lean();
  const benefits = await Benefit.find({}).sort({ order: 1 }).lean();

  // Serialize IDs for client components
  const serializedServices = JSON.parse(JSON.stringify(services));
  const serializedProcess = JSON.parse(JSON.stringify(processSteps));
  const serializedBenefits = JSON.parse(JSON.stringify(benefits));

  return (
    <Services 
      initialServices={serializedServices} 
      initialProcess={serializedProcess} 
      initialBenefits={serializedBenefits} 
    />
  );
}
