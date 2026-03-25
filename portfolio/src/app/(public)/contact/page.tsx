import { Suspense } from 'react';
import { ContactForm } from '@/components/public/ContactForm';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch for collaborations or inquiries.',
};

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactForm />
    </Suspense>
  );
}
